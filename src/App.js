import React from "react";
import { Box, Text, useInput, useApp } from "ink";
import Spinner from "ink-spinner";
import Header from "./components/Header.js";
import AboutContent from "./components/AboutContent.js";
import LinksContent from "./components/LinksContent.js";
import Footer from "./components/Footer.js";

const LOADING_MS = 3000;
const ACCENT = "#FF5F00";

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("about");
  const { exit } = useApp();

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADING_MS);
    return () => clearTimeout(t);
  }, []);

  useInput((input, key) => {
    if (input === "q" || (key.ctrl && input === "c")) {
      exit();
    }
    if (key.tab) {
      setActiveTab(prev => (prev === "about" ? "links" : "about"));
    }
  });

  if (loading) {
    return React.createElement(
      Box,
      {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingY: 2,
      },
      React.createElement(
        Text,
        { color: ACCENT },
        React.createElement(Spinner, { type: "dots" }),
        " Loading...",
      ),
    );
  }

  function clear() {
    exec(`clear`);
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      justifyContent: "space-between",
    },
    React.createElement(Header, { activeTab }),
    React.createElement(
      Box,
      { flexGrow: 1, minHeight: 12 },
      activeTab === "about"
        ? React.createElement(AboutContent)
        : React.createElement(LinksContent, {
            isActive: activeTab === "links",
          }),
    ),
    React.createElement(Footer),
  );
}
