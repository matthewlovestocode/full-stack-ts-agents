import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './views/App';

const { createRootMock, renderMock } = vi.hoisted(() => {
  const render = vi.fn();
  const createRoot = vi.fn(() => ({ render }));

  return { createRootMock: createRoot, renderMock: render };
});

vi.mock('react-dom/client', () => ({
  __esModule: true,
  default: {
    createRoot: createRootMock,
  },
  createRoot: createRootMock,
}));

describe('client entrypoint', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('mounts the app inside React.StrictMode on the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    const root = document.getElementById('root');
    expect(createRootMock).toHaveBeenCalledWith(root);
    expect(renderMock).toHaveBeenCalledTimes(1);

    const renderedTree = renderMock.mock.calls[0][0] as React.ReactElement;
    expect(renderedTree.type).toBe(React.StrictMode);

    const routerTree = renderedTree.props.children as React.ReactElement;
    expect(routerTree.type).toBe(BrowserRouter);
    expect(routerTree.props.children.type).toBe(App);
  });
});
