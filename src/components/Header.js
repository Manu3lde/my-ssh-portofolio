import React from "react";
import { Box, Text, useStdout } from "ink";
import Marquee from "./Marquee.js";

const ACCENT = "#FF5F00";

function TabButton({ label, active }) {
  return React.createElement(
    Text,
    { color: active ? ACCENT : "white", bold: active },
    label + (active ? " ◀" : ""),
  );
}

export default function Header({ activeTab }) {
  const { stdout } = useStdout();
  const termWidth = (stdout && stdout.columns) || 80;
  const isMobile = termWidth < 60;

  return React.createElement(
    Box,
    { 
      flexDirection: isMobile ? "column" : "row", 
      justifyContent: "space-between", 
      alignItems: isMobile ? "center" : "flex-start",
      marginBottom: 1,
      gap: isMobile ? 1 : 0
    },
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
    React.createElement(
      Box,
      { width: isMobile ? "100%" : "auto", alignItems: "center" },
      React.createElement(Marquee)
    ),
  );
}
