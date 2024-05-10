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
  ShoppingCart,
  Users,
} from "lucide-react";

export default function Homepage() {
  return (
    <Dashboard
      links={[
        { href: "#", icon: Home, label: "Dashboard" },
        { href: "#", icon: ShoppingCart, label: "Orders" },
        { href: "#", icon: Package, label: "Products" },
        { href: "#", icon: Users, label: "Customers" },
        { href: "#", icon: LineChart, label: "Analytics" },
      ]}
    >
      hello
    </Dashboard>
  );
}
