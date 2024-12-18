"use client";

import { usePathname } from "next/navigation";
import { List, Plus } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Plus className="w-5 h-5" />, label: "Add Site", href: "/site" },
    { icon: <List className="w-5 h-5" />, label: "Lists", href: "/listSite" },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-slate-900 text-white p-4 flex flex-col shadow-lg">
        <div className="mb-8">
          <h1 className="text-xl font-bold px-4">ASTRAL GRID</h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`${pathname === item.href ? "bg-blue-900 font-semibold text-white" : "hover:bg-slate-800"} flex items-center gap-3 px-4 py-2 text-gray-300  rounded-md transition-colors`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
