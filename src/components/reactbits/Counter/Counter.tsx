'use client';

import type { MotionValue} from 'motion/react';
import { motion, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

type PlaceValue = number | '.';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, latest => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return <motion.span style={{ ...baseStyle, y }}>{number}</motion.span>;
}

function normalizeNearInteger(num: number): number {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value: number, place: number): number {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

/**
 * idle  — server render / before hydration: digits show the real value (no-JS safe)
 * armed — hydrated, off screen: digits parked at 0, ready to roll
 * live  — scrolled into view (or reduced motion): digits roll to the real value
 */
type CounterPhase = 'idle' | 'armed' | 'live';

interface DigitProps {
  place: PlaceValue;
  value: number;
  height: number;
  phase: CounterPhase;
  digitStyle?: React.CSSProperties;
}

function DecimalDigit({ height, digitStyle }: { height: number; digitStyle?: React.CSSProperties }) {
  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ height, width: 'fit-content', ...digitStyle }}
    >
      .
    </span>
  );
}

function NumericDigit({ place, value, height, phase, digitStyle }: { place: number; value: number; height: number; phase: CounterPhase; digitStyle?: React.CSSProperties }) {
  const valueRoundedToPlace = getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    if (phase === 'armed') animatedValue.jump(0);
    else if (phase === 'live') animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace, phase]);

  const defaultStyle: React.CSSProperties = {
    height,
    position: 'relative',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums'
  };

  return (
    <span className="relative inline-flex overflow-hidden" style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

function Digit({ place, value, height, phase, digitStyle }: DigitProps) {
  if (place === '.') {
    return <DecimalDigit height={height} digitStyle={digitStyle} />;
  }
  return <NumericDigit place={place} value={value} height={height} phase={phase} digitStyle={digitStyle} />;
}

interface CounterProps {
  value: number;
  fontSize?: number;
  padding?: number;
  /**
   * An array of place values that determines which digit positions
   * should be displayed. For decimal places, use "." to represent
   * the decimal point. Leave this prop empty to enable automatic
   * detection based on the current value.
   */
  places?: PlaceValue[];
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: React.CSSProperties['fontWeight'];
  containerStyle?: React.CSSProperties;
  counterStyle?: React.CSSProperties;
  digitStyle?: React.CSSProperties;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: React.CSSProperties;
  bottomGradientStyle?: React.CSSProperties;
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [...value.toString()].map((ch, i, a) => {
    if (ch === '.') {
      return '.';
    }

    const dotIndex = a.indexOf('.');
    const isInteger = dotIndex === -1;

    const exponent = isInteger ? a.length - i - 1 : i < dotIndex ? dotIndex - i - 1 : -(i - dotIndex);

    return 10 ** exponent;
  }),
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = 'inherit',
  fontWeight = 'inherit',
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 16,
  gradientFrom = 'black',
  gradientTo = 'transparent',
  topGradientStyle,
  bottomGradientStyle
}: CounterProps) {
  const height = fontSize + padding;
  const rootRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<CounterPhase>('idle');

  useEffect(() => {
    const el = rootRef.current;
    if (reducedMotion || !el || typeof IntersectionObserver === 'undefined') {
      setPhase('live');
      return;
    }
    setPhase('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase('live');
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  const defaultContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  };

  const defaultCounterStyle: React.CSSProperties = {
    fontSize,
    display: 'flex',
    gap,
    overflow: 'hidden',
    borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight,
    direction: "ltr"
  };

  const gradientContainerStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const defaultTopGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
  };

  const defaultBottomGradientStyle: React.CSSProperties = {
    height: gradientHeight,
    background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`
  };

  return (
    <span ref={rootRef} style={{ ...defaultContainerStyle, ...containerStyle }}>
      <span style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place, idx) => (
          <Digit key={`${place}-${idx}`} place={place} value={value} height={height} phase={phase} digitStyle={digitStyle} />
        ))}
      </span>
      <span style={gradientContainerStyle}>
        <span style={topGradientStyle ?? defaultTopGradientStyle} />
        <span style={bottomGradientStyle ?? defaultBottomGradientStyle} />
      </span>
    </span>
  );
}
