import { useState } from 'react';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Full-Stack TS Agents</h1>
      <p>Starter React view powered by Vite.</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        count is {count}
      </button>
    </main>
  );
}

export default App;
