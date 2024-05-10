import Image from "next/image";
import { Dashboard } from "@/components/blocks/dashboard";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  Sheet,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetTrigger, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function Homepage() {
  const links = [
    { href: "#", icon: Home, label: "Products" },
    { href: "#", icon: Package2, label: "Orders" },
    // { href: "#", icon: ShoppingCart, label: "Cart" },
  ];

  const header = (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full flex-row items-center justify-between">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:text-foreground"
        >
          <Package2 className="h-6 w-6" />
          Acme Inc
        </Link>
      </div>
      <div className="flex w-full items-center justify-end gap-6 ml-auto">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* <link.icon className="h-5 w-5" /> */}
            {link.label}
          </Link>
        ))}
        <Link
          href="#"
          className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingCart className="h-5 w-5" />
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <CircleUser className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      {header}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12 lg:mb-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Discover Our Latest Products
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Browse through our carefully curated selection of high-quality
              products.
            </p>
          </div>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
            {[0, 1, 2, 3, 4, 5, 6].map((p, i) => (
              <div
                key={i}
                className="rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2"
              >
                <Link className="block" href="#">
                  <img
                    alt="Product 1"
                    className="rounded-t-lg object-cover w-full h-60"
                    height="300"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: "400/300",
                      objectFit: "cover",
                    }}
                    width="400"
                  />
                  <div className="p-4 bg-white dark:bg-gray-950">
                    <h3 className="font-bold text-xl">Stylish Sunglasses</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Protect your eyes in style
                    </p>
                    <p className="font-semibold text-lg">$29.99</p>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        </div>
      </section>
    </div>
  );
}
