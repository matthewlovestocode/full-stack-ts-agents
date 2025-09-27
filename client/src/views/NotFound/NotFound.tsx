import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist in this workspace.</p>
      <p>
        <Link to="/">Return to the dashboard</Link> to continue exploring the project guides.
      </p>
    </section>
  );
}

export default NotFound;
