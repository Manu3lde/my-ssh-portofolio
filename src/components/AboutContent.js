import React from "react";
import { Box, Text, useStdout } from "ink";

const ACCENT = "#FF5F00";

const ASCII_PLACEHOLDER = `
##################################################
####################--+#..+#-#####################
##################+           .+-#################
##############..                   -##+###########
###########++-.                       .###########
###########-                          .-##########
###########-              .             -#########
#########-       --+++++++++###+-       .+########
##########.    -##################-      +########
##########+   .+++-+++#####++++++#+      +########
###########-  .-++++-+####++--+++-+-    +#########
############. .+--. ...++-.-.. .-+-    -##########
############+ -++#. .+ -+.-#+. .+-+. -+###########
############+-++###+++-##+-+#++++#+----###########
#############-.+####+++++#++######++-++###########
##############+-----+#++++##+-----++++############
##############+-+#####+++#########+-+#############
################+##++++++++#++###+ +##############
#################+####++++#++###--+###############
##################++##########+--#################
###################+-+####++-------+##############
#################+. -----------++     +###########
################+   ----------++#+    .###########
###############-   .---------+##+.     .--++######
###########-..    .--------++#+-.-               .
#######+-...      .------++++..--                .
####+........     .----+++-..---                ..
`;

const NAME_PLACEHOLDER = `
 █▀█ █▀▄ ▀█▀ █▀█ █▀▄ ▀█▀ █▀█ █▀█
 █▀█ █▀▄  █  █ █ █▀▄  █  █▀█ █ █
 ▀ ▀ ▀ ▀  ▀  ▀▀▀ ▀ ▀ ▀▀▀ ▀ ▀ ▀ ▀
`;

// Measure actual ASCII art width
const asciiLines = ASCII_PLACEHOLDER.split("\n");
const ASCII_WIDTH = asciiLines.reduce(
  (max, line) => (line.length > max ? line.length : max),
  0,
);

const BIO_WIDTH = 40;
const GAP = 4;
// Minimum terminal width required to show side-by-side layout
const MIN_SIDE_BY_SIDE = ASCII_WIDTH + GAP + BIO_WIDTH + 4; // +4 for paddingX

export default function AboutContent() {
  const { stdout } = useStdout();

  // Read terminal width — falls back to 80 if not available
  const termWidth = (stdout && stdout.columns) || 80;
  const sideBySide = termWidth >= MIN_SIDE_BY_SIDE;

  if (sideBySide) {
    // Wide terminal: ASCII art on the left, bio on the right
    return React.createElement(
      Box,
      {
        flexDirection: "row",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: GAP,
      },
      React.createElement(
        Box,
        {
          flexDirection: "column",
          width: ASCII_WIDTH,
          flexShrink: 0,
          flexGrow: 0,
        },
        React.createElement(
          Text,
          { color: ACCENT, wrap: "truncate" },
          ASCII_PLACEHOLDER,
        ),
      ),
      React.createElement(
        Box,
        { flexDirection: "column", width: BIO_WIDTH, flexShrink: 0 },
        React.createElement(Text, { bold: true }, NAME_PLACEHOLDER),
        React.createElement(Text, { color: ACCENT, bold: true }, "Bio"),
        React.createElement(
          Text,
          {},
          "Welcome to my terminal portfolio. Shaper of spells, weaver of logic.",
        ),
      ),
    );
  }

  // Narrow terminal: stacked layout — ASCII art on top, bio below
  return React.createElement(
    Box,
    {
      flexDirection: "column",
      flexGrow: 1,
      alignItems: "center",
    },
    React.createElement(
      Box,
      {
        flexDirection: "column",
        width: Math.min(ASCII_WIDTH, termWidth - 4),
        flexShrink: 0,
      },
      React.createElement(
        Text,
        { color: ACCENT, wrap: "truncate" },
        ASCII_PLACEHOLDER,
      ),
    ),
    React.createElement(
      Box,
      { flexDirection: "column", marginTop: 1 },
      React.createElement(Text, { bold: true }, NAME_PLACEHOLDER),
      React.createElement(Text, { color: ACCENT, bold: true }, "Bio"),
      React.createElement(
        Text,
        {},
        "Welcome to my terminal portfolio. Shaper of spells, weaver of logic.",
      ),
    ),
  );
}
