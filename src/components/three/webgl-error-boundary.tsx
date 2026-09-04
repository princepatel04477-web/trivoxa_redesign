'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { fallback: ReactNode; children: ReactNode };
type State = { failed: boolean };

/**
 * Every WebGL scene sits inside one of these (P20).
 *
 * A killed WebGL context, a driver blacklisted mid-session, an out-of-memory
 * tab — all of them must degrade to the designed poster, never to a blank
 * section or a white screen. The audit's audience is procurement teams on
 * airport wifi; this boundary is what they never notice.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // P21 wires this to Sentry; until then it is at least loud in the console.
    console.error('[webgl] scene failed, falling back to poster:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
