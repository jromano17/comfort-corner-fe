"use client";

import Link from "next/link";
import { Sofa, Layers, Truck, Package, Palette, Ruler, ShoppingBasket, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const quickLinks = [
  {
    href: "/admin/chairs/new",
    label: "Create New Chair",
    description: "Add a new chair to the catalogue",
    icon: Sofa,
  },
  {
    href: "/admin/categories",
    label: "Manage Categories",
    description: "Add or view chair categories",
    icon: Layers,
  },
  {
    href: "/admin/suppliers",
    label: "Manage Suppliers",
    description: "Add or view suppliers",
    icon: Truck,
  },
  {
    href: "/admin/materials",
    label: "Manage Materials",
    description: "Add or view materials",
    icon: Package,
  },
  {
    href: "/admin/colors",
    label: "Manage Colors",
    description: "Add or view color options",
    icon: Palette,
  },
  {
    href: "/admin/dimensions",
    label: "Manage Dimensions",
    description: "Add or view dimension presets",
    icon: Ruler,
  },
  {
    href: "/admin/orders",
    label: "Manage Orders",
    description: "View order presets",
    icon: ShoppingBasket,
  },
  {
    href: "/admin/incomes",
    label: "Manage Incomes",
    description: "View income records",
    icon: DollarSign,
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your Comfort Corner inventory
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <link.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{link.label}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
