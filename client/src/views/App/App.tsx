import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import Docs from '../Docs';
import Home from '../Home';
import NotFound from '../NotFound';

const navigationLinks: Array<{ label: string; to: string; end?: boolean }> = [
  { label: 'Home', to: '/', end: true },
  { label: 'Docs', to: '/docs' },
];

function Layout() {
  return (
    <div>
      <header>
        <nav aria-label="Primary">
          <ul>
            {navigationLinks.map(({ label, to, end }) => (
              <li key={to}>
                <NavLink to={to} end={end}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<Docs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
