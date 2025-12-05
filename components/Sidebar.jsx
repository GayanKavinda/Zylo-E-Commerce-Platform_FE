//components/Sidebar.tsx

import React from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/authStore";

export default function Sidebar() {
  const [mounted, setMounted] = React.useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted || !user) return null;

  console.log("[Sidebar] Current user:", user);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      roles: ["superadmin", "admin", "customer"],
    },
    { label: "Admin Panel", path: "/admin", roles: ["superadmin", "admin"] },
    {
      label: "Customer Dashboard",
      path: "/dashboard/customer",
      roles: ["customer"],
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold">My App</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          if (!item.roles.includes(user.role.toLowerCase())) return null;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
