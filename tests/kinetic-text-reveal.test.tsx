import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KineticTextReveal } from '@/components/motion/kinetic-text-reveal';

// Mock GSAP to prevent window/RAF execution in node/jsdom
vi.mock('@/components/motion/use-gsap', () => ({
  useGSAP: vi.fn(),
}));

describe('KineticTextReveal — Accessible text content (Prompt 01)', () => {
  it('preserves real whitespace in textContent and does not concatenate words', () => {
    const headingText = 'What we hold, what we are applying for, and when.';
    const { container } = render(
      <KineticTextReveal as="h1">{headingText}</KineticTextReveal>,
    );

    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toBe(headingText);
    expect(h1?.textContent).not.toBe('Whatwehold,whatweareapplyingfor,andwhen.');
  });

  it('handles multi-line headings, punctuation, and ampersands with intact spacing', () => {
    const text = 'Textile & Apparel · Surat, Gujarat & Beyond.';
    const { container } = render(
      <KineticTextReveal as="h2" isHero={true}>{text}</KineticTextReveal>,
    );

    const h2 = container.querySelector('h2');
    expect(h2).not.toBeNull();
    expect(h2?.textContent).toBe(text);
  });

  it('renders clean plain text for non-string children without errors', () => {
    const { container } = render(
      <KineticTextReveal as="h3">
        <span>Custom Span</span>
      </KineticTextReveal>,
    );

    const h3 = container.querySelector('h3');
    expect(h3?.textContent).toBe('Custom Span');
  });
});
