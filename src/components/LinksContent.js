import React from "react";
import { Box, Text, useInput, useStdout } from "ink";

const ACCENT = "#FF5F00";

const LINKS = [
  { label: "Website", url: "https://example.com" },
  { label: "X", url: "https://x.com/manu_3ll" },
  { label: "LinkedIn", url: "https://linkedin.com/in/example" },
  { label: "GitHub", url: "https://github.com/Manu3lde" },
];

function LinkItem({ label, url, isActive }) {
  // OSC 8 hyperlink: \u001b]8;;URL\u001b\\TEXT\u001b]8;;\u001b\\
  // This allows the client's terminal to handle the link opening.
  const link = `\u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\`;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      paddingX: 1,
      paddingY: 1,
      borderStyle: "single",
      borderColor: isActive ? ACCENT : "gray",
      width: 36,
    },
    React.createElement(
      Text,
      { color: isActive ? ACCENT : "white" },
      (isActive ? "▶ " : "  ") + label,
    ),
    React.createElement(Text, { color: "cyan" }, link),
  );
}

export default function LinksContent({ isActive }) {
  const [index, setIndex] = React.useState(0);
  const [status, setStatus] = React.useState("Press Ctrl+Shift+Enter to copy link");
  const { write } = useStdout();

  useInput(
    (_input, key) => {
      if (!isActive) return;

      if (key.leftArrow) {
        setIndex(prev => (prev === 0 ? LINKS.length - 1 : prev - 1));
        setStatus("Press Ctrl+Shift+Enter to copy link");
      }

      if (key.rightArrow) {
        setIndex(prev => (prev === LINKS.length - 1 ? 0 : prev + 1));
        setStatus("Press Ctrl+Shift+Enter to copy link");
      }

      if (key.return) {
        if (key.ctrl && key.shift) {
          const url = LINKS[index].url;
          // OSC 52: copy to clipboard
          // This escape sequence tells the terminal to copy text to the client's clipboard.
          const b64 = Buffer.from(url).toString("base64");
          write(`\u001b]52;c;${b64}\u0007`);
          setStatus("✓ Link copied to your local clipboard!");
        } else {
          setStatus("Hint: Use Ctrl+Shift+Enter or Click the link");
        }
      }
    },
    { isActive },
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
        { key: `row-${i}`, flexDirection: "row", gap: 4, marginBottom: 1 },
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
          : null,
      ),
    );
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    ...rows,
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(Text, { color: "gray" }, status),
    ),
  );
}
