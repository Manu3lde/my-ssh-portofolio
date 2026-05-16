import React from "react";
import { Box, Text } from "ink";

const ACCENT = "#FF5F00";
const VERSION = "v0.1.5";

export default function Footer() {
  return React.createElement(
    Box,
    {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 1,
      paddingTop: 1,
      borderStyle: "single",
      borderColor: "gray",
    },
    React.createElement(Text, { color: "gray" }, VERSION),
    React.createElement(
      Box,
      { flexDirection: "row", gap: 2 },
      React.createElement(Text, { color: ACCENT }, "n"),
      React.createElement(Text, {}, "navigate"),
      React.createElement(Text, { color: ACCENT }, "t"),
      React.createElement(Text, {}, "theme"),
      React.createElement(Text, { color: ACCENT }, "q"),
      React.createElement(Text, {}, "quit"),
    ),
  );
}
