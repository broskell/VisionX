import React from 'react';
import {Canvas, RadialGradient, Rect, vec, ColorMatrix} from '@shopify/react-native-skia';
import {useWindowDimensions} from 'react-native';

export function OpticalOverlay({diopter, pupil}: {diopter: number; pupil: number}) {
  const {width, height} = useWindowDimensions();
  const absD = Math.abs(diopter);
  if (absD < 0.01) return null;
  const blur = Math.min(20, absD * 2.5 * (pupil / 1.5));
  const alpha = Math.min(0.5, absD * 0.07);
  return (
    <Canvas style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height} opacity={alpha}>
        <RadialGradient c={vec(width/2, height/2)} r={Math.max(width, height)}
          colors={['rgba(0,0,0,0)', `rgba(0,0,0,${alpha})`]} />
      </Rect>
    </Canvas>
  );
}

export function GlaucomaOverlay({severity}: {severity: number}) {
  const {width, height} = useWindowDimensions();
  if (severity < 0.01) return null;
  const cx = width / 2, cy = height / 2;
  const clearR = Math.min(width, height) * (1 - severity) * 0.48;
  const darkR = Math.max(width, height) * 0.75;
  return (
    <Canvas style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient c={vec(cx, cy)} r={darkR}
          colors={['transparent', 'rgba(0,0,0,0.95)']}
          positions={[clearR / darkR, 1]} />
      </Rect>
    </Canvas>
  );
}

export function MacularOverlay({severity}: {severity: number}) {
  const {width, height} = useWindowDimensions();
  if (severity < 0.01) return null;
  const cx = width / 2, cy = height / 2;
  const spotR = severity * 140;
  const blurR = spotR * 2.5;
  return (
    <Canvas style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient c={vec(cx, cy)} r={blurR}
          colors={['rgba(90,90,90,0.85)', 'rgba(50,50,50,0.25)', 'transparent']}
          positions={[0, spotR / blurR, 1]} />
      </Rect>
    </Canvas>
  );
}

export function DryEyeOverlay({active}: {active: boolean}) {
  const {width, height} = useWindowDimensions();
  const [opacity, setOpacity] = React.useState(0);
  React.useEffect(() => {
    if (!active) { setOpacity(0); return; }
    const t = setInterval(() => {
      if (Math.random() > 0.55) {
        setOpacity(0.3 + Math.random() * 0.3);
        setTimeout(() => setOpacity(0), 800 + Math.random() * 600);
      }
    }, 3500);
    return () => clearInterval(t);
  }, [active]);
  if (opacity < 0.01) return null;
  return (
    <Canvas style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height} color={`rgba(170,185,195,${opacity})`} opacity={opacity * 0.6} />
    </Canvas>
  );
}

export function ColorBlindOverlay({mode}: {mode: string}) {
  const {width, height} = useWindowDimensions();
  const matrices: Record<string, number[]> = {
    protanopia: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
    deuteranopia: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
    tritanopia: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
    monochromacy: [0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0],
  };
  const m = matrices[mode];
  if (!m) return null;
  return (
    <Canvas style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}} pointerEvents="none">
      <Rect x={0} y={0} width={width} height={height}>
        <ColorMatrix matrix={m} />
      </Rect>
    </Canvas>
  );
}

import {ColorMatrix, Blur, Paint} from '@shopify/react-native-skia';
