import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg ring-1 ring-slate-200">
      <h1 className="text-5xl font-semibold text-slate-900">404</h1>
      <p className="mt-4 text-slate-600">Page not found. Return to the dashboard to continue.</p>
      <Link
        to="/dashboard"
        className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
