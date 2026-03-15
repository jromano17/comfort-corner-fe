"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Armchair,
  LayoutDashboard,
  Sofa,
  Layers,
  Palette,
  Ruler,
  Package,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/chairs", label: "Chairs", icon: Sofa },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { href: "/admin/materials", label: "Materials", icon: Package },
  { href: "/admin/colors", label: "Colors", icon: Palette },
  { href: "/admin/dimensions", label: "Dimensions", icon: Ruler },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Armchair className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Back to Store
          </Link>
        </div>
      </div>
    </aside>
  );
}
