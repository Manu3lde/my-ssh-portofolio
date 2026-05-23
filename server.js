import { readFileSync } from "fs";
import { EventEmitter } from "events";
import { exec } from "child_process";
import http from "http";
import ssh2 from "ssh2";
import React from "react";
import { render } from "ink";
import App from "./src/App.js";

const { Server } = ssh2;

// Use SSH_HOST_KEY env var if available, otherwise fall back to local file
const HOST_KEY = process.env.SSH_HOST_KEY 
  ? process.env.SSH_HOST_KEY 
  : readFileSync("./private.key");

/**
 * Wrap a duplex SSH stream so that every \n in outgoing writes becomes \r\n.
 * In raw-mode terminals (which is what SSH gives us), \n moves the cursor
 * DOWN but does NOT return to column 0.  Ink only emits \n, so every line
 * starts one column further right — the "staircase" effect.
 */
function wrapStream(stream, cols, rows) {
  const original = stream.write.bind(stream);

  stream.write = (data, encoding, cb) => {
    let out;
    if (Buffer.isBuffer(data)) {
      // Replace bare \n (0x0A) not already preceded by \r (0x0D)
      const bytes = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0x0a && (i === 0 || data[i - 1] !== 0x0d)) {
          bytes.push(0x0d);
        }
        bytes.push(data[i]);
      }
      out = Buffer.from(bytes);
    } else if (typeof data === "string") {
      out = data.replace(/(?<!\r)\n/g, "\r\n");
    } else {
      out = data;
    }
    return original(out, encoding, cb);
  };

  // Mark as TTY and set dimensions
  stream.isTTY = true;
  stream.columns = cols;
  stream.rows = rows;

  // Ink calls this to get the current terminal size
  stream.getWindowSize = () => [stream.columns, stream.rows];

  // Required no-ops for TTY compatibility
  stream.setRawMode = () => {};
  stream.ref = () => {};
  stream.unref = () => {};

  // Put the stream in flowing mode so stdin events reach Ink
  stream.resume();

  return stream;
}

const server = new Server(
  {
    hostKeys: [HOST_KEY],
    ident: "my-portfolio-v1",
    // This sends a "ping" every 20 seconds to keep the tunnel open
    keepaliveInterval: 20000,
    keepaliveCountMax: 3,
  },
  client => {
    client.on("authentication", ctx => {
      // Accept any password or public key
      if (ctx.method === 'password' || ctx.method === 'publickey' || ctx.method === 'none') {
        ctx.accept();
      } else {
        ctx.reject(['password', 'publickey']);
      }
    });

    client.on("session", accept => {
      const session = accept();
      let shellStream = null;
      let inkInstance = null;
      let ptyInfo = { cols: 120, rows: 30 };

      session.on("pty", (accept, _reject, info) => {
        if (accept) accept();
        ptyInfo = { cols: info.cols || 120, rows: info.rows || 30 };
        if (shellStream) {
          shellStream.columns = ptyInfo.cols;
          shellStream.rows = ptyInfo.rows;
        }
      });

      session.on("shell", accept => {
        shellStream = wrapStream(accept(), ptyInfo.cols, ptyInfo.rows);

        // Build a fake stderr that routes back to the SSH stream.
        // Ink uses stderr for some escape sequences; without this they go to
        // the server process's own stderr instead of the client's screen.
        const fakeStderr = Object.assign(
          Object.create(EventEmitter.prototype),
          {
            isTTY: true,
            columns: shellStream.columns,
            rows: shellStream.rows,
            getWindowSize: () => [shellStream.columns, shellStream.rows],
            // shellStream.write is already the translated version
            write: (data, enc, cb) => shellStream.write(data, enc, cb),
          },
        );
        EventEmitter.call(fakeStderr);

        // Hard-reset: clear screen + move cursor home
        shellStream.write("\u001b[2J\u001b[H");

        // Start Ink
        inkInstance = render(React.createElement(App), {
          stdout: shellStream,
          stdin: shellStream,
          stderr: fakeStderr,
          patchConsole: false,
        });

        // Handle terminal resize
        session.on("window-change", (accept, _reject, info) => {
          if (accept) accept();
          const cols = info.cols || shellStream.columns;
          const rows = info.rows || shellStream.rows;

          shellStream.columns = cols;
          shellStream.rows = rows;
          fakeStderr.columns = cols;
          fakeStderr.rows = rows;

          // 'resize' is what Ink listens on to redo its layout calculation
          shellStream.emit("resize");

          if (inkInstance) {
            inkInstance.rerender(React.createElement(App));
          }
        });

        shellStream.on("close", () => {
          if (inkInstance) inkInstance.unmount();
          client.end();
        });

        shellStream.on("error", () => {
          if (inkInstance) inkInstance.unmount();
          client.end();
        });
      });
    });
  },
);

const PORT = process.env.SSH_PORT || 22222;

// --- Render Health Check Hack ---
// Render Web Services expect an HTTP server to be listening on process.env.PORT
const HTTP_PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('SSH Server is running\n');
}).listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`Health check HTTP server listening on port ${HTTP_PORT}`);
});
// --------------------------------

server.listen(PORT, "0.0.0.0", () => {
  console.log(`SSH portfolio listening on port ${PORT}`);

  // This will run the tunnel automatically when Render starts your app
  exec(`./bore local ${PORT} --to bore.pub`, (err, stdout, stderr) => {
    if (err) console.error(err);
    if (stderr) console.error(stderr);
    console.log(stdout);
  });
});
