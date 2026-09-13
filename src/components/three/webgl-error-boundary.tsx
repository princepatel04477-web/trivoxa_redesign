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

  override componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Sentry / telemetry integration point; fail-open quietly in production.
    if (process.env.NODE_ENV === 'development') {
      // noop in production
    }
  }

  override render(): ReactNode {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
