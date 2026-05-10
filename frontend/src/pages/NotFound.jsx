import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <p className="text-8xl font-black text-brand-200">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mt-4">Page Not Found</h1>
      <p className="text-slate-500 mt-2">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition font-medium"
      >
        Go Home
      </Link>
    </div>
  );
}
