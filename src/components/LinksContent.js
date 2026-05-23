import React from "react";
import { Box, Text, useInput, useStdout } from "ink";

const ACCENT = "#FF5F00";

const LINKS = [
  { label: "Website", url: "https://example.com" },
  { label: "X", url: "https://x.com/manu_3ll" },
  { label: "LinkedIn", url: "https://linkedin.com/in/example" },
  { label: "GitHub", url: "https://github.com/Manu3lde" },
];

function LinkItem({ label, url, isActive, termWidth }) {
  // OSC 8 hyperlink: \u001b]8;;URL\u001b\\TEXT\u001b]8;;\u001b\\
  const link = `\u001b]8;;${url}\u001b\\${url}\u001b]8;;\u001b\\`;
  const itemWidth = termWidth < 80 ? Math.max(termWidth - 6, 30) : 36;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      paddingX: 1,
      paddingY: 1,
      borderStyle: "single",
      borderColor: isActive ? ACCENT : "gray",
      width: itemWidth,
    },
    React.createElement(
      Text,
      { color: isActive ? ACCENT : "white", wrap: "end" },
      (isActive ? "▶ " : "  ") + label,
    ),
    React.createElement(Text, { color: "cyan", wrap: "anywhere" }, link),
  );
}

export default function LinksContent({ isActive }) {
  const [index, setIndex] = React.useState(0);
  const [status, setStatus] = React.useState("Use Arrows to navigate");
  const { write, stdout } = useStdout();
  const termWidth = (stdout && stdout.columns) || 80;

  useInput(
    (input, key) => {
      if (!isActive) return;

      if (key.leftArrow || key.upArrow || input === 'k') {
        setIndex(prev => (prev === 0 ? LINKS.length - 1 : prev - 1));
      }

      if (key.rightArrow || key.downArrow || input === 'j') {
        setIndex(prev => (prev === LINKS.length - 1 ? 0 : prev + 1));
      }

      if (key.return) {
        const url = LINKS[index].url;
        // OSC 52: copy to clipboard
        const b64 = Buffer.from(url).toString("base64");
        write(`\u001b]52;c;${b64}\u0007`);
        setStatus("✓ Link copied to clipboard!");
      }
    },
    { isActive },
  );

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    React.createElement(
      Box,
      {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        width: "100%",
      },
      ...LINKS.map((link, i) =>
        React.createElement(LinkItem, {
          key: link.label,
          label: link.label,
          url: link.url,
          isActive: i === index,
          termWidth,
        })
      )
    ),
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(Text, { color: "gray" }, status),
    ),
  );
}
