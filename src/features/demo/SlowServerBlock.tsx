// src/features/demo/SlowServerBlock.tsx
async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export async function SlowServerBlock() {
    await wait(1600);
  
    return (
      <article className="app-surface app-stack app-muted-copy">
        <span className="app-badge">server component</span>
        <h2>Slow server block resolved</h2>
        <p>
          This block waited on the server before rendering. The page shell can
          stream first while this boundary finishes.
        </p>
        <div className="app-cluster">
          <span className="app-chip">RSC</span>
          <span className="app-chip">Suspense boundary</span>
          <span className="app-chip">streamed later</span>
        </div>
      </article>
    );
  }
  