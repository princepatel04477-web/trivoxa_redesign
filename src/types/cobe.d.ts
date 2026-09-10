/**
 * cobe ships no ambient types for its ESM entry under `moduleResolution:
 * bundler`, so we declare the slice we use — deliberately narrow, and stricter
 * than `any`: an unknown option key is a compile error here, which is how the
 * globe stays honest about what it configures.
 */
declare module 'cobe' {
  export type COBEProps = {
    devicePixelRatio: number;
    width: number;
    height: number;
    phi: number;
    theta: number;
    dark: number;
    diffuse: number;
    mapSamples: number;
    mapBrightness?: number;
    mapBaseColor?: [number, number, number];
    baseColor: [number, number, number];
    markerColor: [number, number, number];
    glowColor: [number, number, number];
    markers: { location: [number, number]; size: number }[];
    scale?: number;
    onRender: (state: Record<string, number>) => void;
    opacity?: number;
    [key: string]: unknown;
  };

  export type Globe = { destroy: () => void };

  const createGlobe: (canvas: HTMLCanvasElement, props: COBEProps) => Globe;
  export default createGlobe;
}
