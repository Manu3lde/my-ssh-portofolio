import React from 'react';
import { Box, Text, useInput } from 'ink';
import { exec } from 'child_process';

const ACCENT = '#FF5F00';

const LINKS = [
  { label: 'Website', url: 'https://example.com' },
  { label: 'X', url: 'https://x.com/example' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/example' },
  { label: 'GitHub', url: 'https://github.com/example' },
];

function openUrl(url) {
  const escaped = url.replace(/"/g, '\\"');

  if (process.platform === 'win32') {
    // Windows: use "start" to open default browser
    exec(`start "" "${escaped}"`);
  } else if (process.platform === 'darwin') {
    // macOS
    exec(`open "${escaped}"`);
  } else {
    // Linux and others
    exec(`xdg-open "${escaped}"`);
  }
}

function LinkItem({ label, url, isActive }) {
  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      paddingX: 1,
      paddingY: 1,
      borderStyle: 'single',
      borderColor: isActive ? ACCENT : 'gray',
      width: 36,
    },
    React.createElement(
      Text,
      { color: isActive ? ACCENT : 'white' },
      (isActive ? '▶ ' : '  ') + label
    ),
    React.createElement(
      Text,
      { color: 'cyan' },
      url
    )
  );
}

export default function LinksContent({ isActive }) {
  const [index, setIndex] = React.useState(0);

  useInput(
    (_input, key) => {
      if (!isActive) return;

      if (key.leftArrow) {
        setIndex((prev) => (prev === 0 ? LINKS.length - 1 : prev - 1));
      }

      if (key.rightArrow) {
        setIndex((prev) => (prev === LINKS.length - 1 ? 0 : prev + 1));
      }

      if (key.return) {
        const url = LINKS[index].url;
        // Log to terminal for feedback and open in default browser
        // (Ink will re-render after this console.log, which is fine for a simple app.)
        // eslint-disable-next-line no-console
        console.log(`Opening URL: ${url}`);
        openUrl(url);
      }
    },
    { isActive }
  );

  // Arrange links in a 2x2 grid that fits within the 80-column app width:
  // each card is width 36, row gap is 4 => 36 + 4 + 36 = 76.
  const rows = [];
  for (let i = 0; i < LINKS.length; i += 2) {
    const first = LINKS[i];
    const second = LINKS[i + 1];

    rows.push(
      React.createElement(
        Box,
        { key: `row-${i}`, flexDirection: 'row', gap: 4, marginBottom: 1 },
        React.createElement(LinkItem, {
          label: first.label,
          url: first.url,
          isActive: i === index,
        }),
        second
          ? React.createElement(LinkItem, {
              label: second.label,
              url: second.url,
              isActive: i + 1 === index,
            })
          : null
      )
    );
  }

  return React.createElement(
    Box,
    {
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ...rows
  );
}
