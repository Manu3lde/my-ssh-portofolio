import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';
import path from 'path';

const VERSION = '0.6.0';
const BINARY_NAME = 'bore';

const platform = process.platform;
const arch = process.arch;

let url = '';

if (platform === 'linux') {
  if (arch === 'x64') {
    url = `https://github.com/ekzhang/bore/releases/download/v${VERSION}/bore-v${VERSION}-x86_64-unknown-linux-musl.tar.gz`;
  } else if (arch === 'arm64') {
    url = `https://github.com/ekzhang/bore/releases/download/v${VERSION}/bore-v${VERSION}-aarch64-unknown-linux-musl.tar.gz`;
  }
} else if (platform === 'darwin') {
  if (arch === 'x64') {
    url = `https://github.com/ekzhang/bore/releases/download/v${VERSION}/bore-v${VERSION}-x86_64-apple-darwin.tar.gz`;
  } else if (arch === 'arm64') {
    url = `https://github.com/ekzhang/bore/releases/download/v${VERSION}/bore-v${VERSION}-aarch64-apple-darwin.tar.gz`;
  }
} else if (platform === 'win32') {
  url = `https://github.com/ekzhang/bore/releases/download/v${VERSION}/bore-v${VERSION}-x86_64-pc-windows-msvc.zip`;
}

if (!url) {
  console.error(`Unsupported platform/architecture: ${platform}/${arch}`);
  process.exit(1);
}

const dest = path.join(process.cwd(), BINARY_NAME + (platform === 'win32' ? '.exe' : ''));

// Only download if it doesn't exist or if we want to force it
// For simplicity, let's always try to get the right one if we are in CI/Render
if (fs.existsSync(dest) && !process.env.RENDER) {
  console.log(`${BINARY_NAME} already exists, skipping download.`);
  process.exit(0);
}

console.log(`Downloading ${BINARY_NAME} from ${url}...`);

const tempFile = path.join(process.cwd(), `bore_temp_${Date.now()}${path.extname(url)}`);
const file = fs.createWriteStream(tempFile);

https.get(url, (response) => {
  if (response.statusCode === 302 || response.statusCode === 301) {
    https.get(response.headers.location, (res) => res.pipe(file));
  } else {
    response.pipe(file);
  }

  file.on('finish', () => {
    file.close();
    console.log('Download complete. Extracting...');

    try {
      if (url.endsWith('.tar.gz')) {
        execSync(`tar -xzf ${tempFile}`);
        // The tar contains 'bore' binary
      } else if (url.endsWith('.zip')) {
        // Use powershell on windows or unzip on linux
        if (platform === 'win32') {
          execSync(`powershell -Command "Expand-Archive -Path ${tempFile} -DestinationPath . -Force"`);
        } else {
          execSync(`unzip -o ${tempFile}`);
        }
      }

      // Cleanup temp file
      fs.unlinkSync(tempFile);

      // On Linux/Mac, ensure it's executable
      if (platform !== 'win32') {
        fs.chmodSync(dest, '755');
      }

      console.log(`${BINARY_NAME} setup successful.`);
    } catch (err) {
      console.error('Error during extraction:', err.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  fs.unlinkSync(tempFile);
  console.error('Error downloading binary:', err.message);
  process.exit(1);
});
