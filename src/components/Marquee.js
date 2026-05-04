import React from 'react';
import { Text } from 'ink';

const MARQUEE_TEXT = '[ under construction ]';
const PADDING = '    ';
const FULL_TEXT = PADDING + MARQUEE_TEXT + PADDING;
const INTERVAL_MS = 200;

export default function Marquee() {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setOffset((prev) => (prev + 1) % FULL_TEXT.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const visible = (FULL_TEXT + FULL_TEXT).slice(offset, offset + MARQUEE_TEXT.length + 2);
  return React.createElement(Text, { color: '#FF5F00' }, visible);
}
