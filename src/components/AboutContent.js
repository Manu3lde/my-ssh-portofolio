import React from "react";
import { Box, Text } from "ink";
import { exec } from "child_process";

const ACCENT = "#FF5F00";

//to be replaced with higher res ascii  art
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
░█▀█░█▀▄░▀█▀░█▀█░█▀▄░▀█▀░█▀█░█▀█
░█▀█░█▀▄░░█░░█░█░█▀▄░░█░░█▀█░█░█
░▀░▀░▀░▀░░▀░░▀▀▀░▀░▀░▀▀▀░▀░▀░▀░▀
`;

const asciiLines = ASCII_PLACEHOLDER.split("\n");
const ASCII_WIDTH = asciiLines.reduce(
  (max, line) => (line.length > max ? line.length : max),
  0,
);
const BIO_WIDTH = 40;
const GAP = 6;

export default function AboutContent() {
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

      { flexDirection: "column", width: ASCII_WIDTH, flexShrink: 0 },
      React.createElement(Text, { color: ACCENT }, ASCII_PLACEHOLDER),
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
