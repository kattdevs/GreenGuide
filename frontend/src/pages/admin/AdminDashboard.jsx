import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { itemsService } from "../../services/items.service.js";
import { usersService } from "../../services/users.service.js";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ items: 0, users: 0 });
  useEffect(() => {
    Promise.all([itemsService.getAll(), usersService.getAll()])
      .then(([itemsRes, usersRes]) =>
        setStats({ items: itemsRes.data.length, users: usersRes.data.length }),
      )
      .catch(console.error);
  }, []);
  const cards = [
    {
      label: "Total Items",
      value: stats.items,
      emoji: "&#128230;",
      link: "/admin/items",
      color: "from-brand-500 to-brand-600",
    },
    {
      label: "Total Users",
      value: stats.users,
      emoji: "&#128101;",
      link: "/admin/users",
      color: "from-emerald-500 to-emerald-600",
    },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-500 mb-8">
        Overview of your application's data.
      </p>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.link}
            className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}
          >
            <div
              className="text-4xl mb-3"
              dangerouslySetInnerHTML={{ __html: c.emoji }}
            />
            <p className="text-white/70 text-sm font-medium">{c.label}</p>
            <p className="text-4xl font-bold mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      {/* Quick-action links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            to: "/admin/items",
            label: "Manage Items",
            desc: "Create, edit, and delete catalogue items.",
          },
          {
            to: "/admin/users",
            label: "Manage Users",
            desc: "View all users and change their roles.",
          },
        ].map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <h3 className="font-semibold text-slate-900 text-lg">{a.label}</h3>
            <p className="text-slate-500 text-sm mt-1">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
