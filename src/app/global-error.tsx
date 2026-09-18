'use client';

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#171210', color: '#fbfaf8', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ maxWidth: '38rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c99a4a' }}>
              System Notice
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
              Something interrupted this view.
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#c5b8b1', lineHeight: 1.6, margin: 0 }}>
              We encountered an unexpected error while preparing this application route.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => reset()}
                style={{
                  backgroundColor: '#c99a4a',
                  color: '#171210',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Try again
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#fbfaf8',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(251, 250, 248, 0.2)',
                  cursor: 'pointer'
                }}
              >
                Return to home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
