import React from "react";
import { Box, Text } from "ink";
// import Marquee from "./Marquee.js";

const ACCENT = "#FF5F00";

function TabButton({ label, active }) {
  return React.createElement(
    Text,
    { color: active ? ACCENT : "white", bold: active },
    label + (active ? " ◀" : ""),
  );
}

export default function Header({ activeTab }) {
  return React.createElement(
    Box,
    { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
    React.createElement(
      Box,
      { flexDirection: "row", gap: 2 },
      React.createElement(TabButton, {
        label: "About",
        active: activeTab === "about",
      }),
      React.createElement(TabButton, {
        label: "Links",
        active: activeTab === "links",
      }),
    ),
    // React.createElement(Marquee),
  );
}
