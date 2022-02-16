import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useSpring, animated } from 'react-spring';

const SpringPlayground: NextPage = () => {
  const [isFlip, setIsFlip] = useState(false);
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 200,
    reset: true,
    reverse: isFlip,
    onRest: () => setIsFlip((prev) => !prev),
  });
  return (
    <>
      <Head>
        <title>Spring Playground</title>
      </Head>
      <animated.div style={props}>I will fade in</animated.div>
    </>
  );
};

export default SpringPlayground;
