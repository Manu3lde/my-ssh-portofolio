import { readFileSync } from "fs";
import ssh2 from "ssh2";
import React from "react";
import { render } from "ink";
import App from "./src/App.js";

const { Server } = ssh2;
const HOST_KEY = readFileSync("./private.key");

const server = new Server({ hostKeys: [HOST_KEY] }, client => {
  client.on("authentication", ctx => ctx.accept());

  client.on("session", accept => {
    const session = accept();
    let shellStream = null;
    let inkInstance = null;

    // Default dimensions
    let ptyInfo = { cols: 100, rows: 30 };

    session.on("pty", (accept, reject, info) => {
      if (accept) accept();
      ptyInfo = { cols: info.cols, rows: info.rows };

      if (shellStream) {
        shellStream.columns = info.cols;
        shellStream.rows = info.rows;
      }
    });

    session.on("shell", accept => {
      shellStream = accept();

      // Configure the stream for Ink
      shellStream.isTTY = true;
      shellStream.columns = ptyInfo.cols;
      shellStream.rows = ptyInfo.rows;

      // Dummy functions Ink expects
      shellStream.setRawMode = () => {};
      shellStream.ref = () => {};
      shellStream.unref = () => {};

      // CLEAR SCREEN: Hard reset the terminal before starting
      shellStream.write("\u001b[2J\u001b[0;0H");

      // Start Ink
      inkInstance = render(React.createElement(App), {
        stdout: shellStream,
        stdin: shellStream,
        patchConsole: false,
      });

      session.on("window-change", (accept, reject, info) => {
        if (accept) accept();

        // Update dimensions
        shellStream.columns = info.cols;
        shellStream.rows = info.rows;

        // Force Ink to re-calculate the entire layout
        if (inkInstance) {
          inkInstance.rerender(React.createElement(App));
        }
      });

      shellStream.on("close", () => {
        if (inkInstance) inkInstance.unmount();
        client.end();
      });
    });
  });
});

server.listen(2222, "0.0.0.0", () => {
  console.log("Server listening on 2222");
});
