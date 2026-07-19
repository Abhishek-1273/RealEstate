import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

/**
 * LottieIcon — loads a Lottie animation from a URL.
 * Props:
 *   src        — URL to the .json Lottie file
 *   hoverPlay  — play animation only on hover (default: false)
 *   autoplay   — autoplay on load (default: true)
 *   loop       — loop the animation (default: true)
 *   className  — CSS classes for the wrapper div
 *   style      — inline styles for the wrapper div
 */
const LottieIcon = ({
  src,
  hoverPlay = false,
  autoplay = true,
  loop = true,
  className = '',
  style = {},
}) => {
  const [animationData, setAnimationData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setAnimationData(data); })
      .catch(() => {}); // silently fail — fallback to nothing
    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    if (!lottieRef.current || !hoverPlay) return;
    if (isHovered) {
      lottieRef.current.goToAndPlay(0, true);
    } else {
      lottieRef.current.goToAndStop(0, true);
    }
  }, [isHovered, hoverPlay]);

  if (!animationData) {
    // Render an empty placeholder while loading so layout doesn't jump
    return <span className={className} style={style} />;
  }

  return (
    <div
      className={className}
      style={style}
      onMouseEnter={() => hoverPlay && setIsHovered(true)}
      onMouseLeave={() => hoverPlay && setIsHovered(false)}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={hoverPlay ? false : autoplay}
        loop={loop}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieIcon;
