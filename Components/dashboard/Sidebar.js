import {
  Cake,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessagesSquare,
  PlusCircle,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import Logo from "../header/Logo";

export const sidebarAccountItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} className="stroke-purple-500" />,
    href: "",
  },
  {
    name: "Orders",
    icon: <ShoppingBag size={20} className="stroke-yellow-500" />,
    href: "",
  },
  {
    name: "Payment",
    icon: <CreditCard size={20} className="stroke-blue-500" />,
    href: "",
  },
  {
    name: "Users",
    icon: <Users size={20} className="stroke-indigo-500" />,
    href: "",
  },
  {
    name: "Chat",
    icon: <MessageCircle size={20} className="stroke-green-500" />,
    href: "",
  },
  {
    name: "Reviews",
    icon: <MessagesSquare size={20} className="stroke-red-500" />,
    href: "",
  },
];
export const sidebarProductItems = [
  {
    name: "Add new",
    icon: <PlusCircle size={20} className="stroke-orange-500" />,
    href: "/admin/products/create_new",
  },
  {
    name: "My products",
    icon: <Cake size={20} className="stroke-rose-500" />,
    href: "",
  },
];

const Sidebar = () => {
  return (
    <article className="hidden md:flex h-screen flex-col items-center md:w-[13rem] lg:w-[15rem] h-full border-r border-gray-500 py-5 ">
      <Logo />
      <section className="w-full flex-1 flex flex-col gap-y-8 py-8 px-6">
        <div className="">
          <h6 className="text-sm text-gray-400">Account</h6>
          <ul className=" flex flex-col gap-y-0.5">
            {sidebarAccountItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center gap-x-2 p-2 hover:[background:hsl(0,0%,20%)] rounded-lg"
                >
                  {item.icon}
                  <span className="text-sm text-gray-300 font-semibold">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h6 className="text-sm text-gray-400">Product</h6>
          <ul className=" flex flex-col gap-y-0.5">
            {sidebarProductItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center gap-x-2 p-2  hover:[background:hsl(0,0%,20%)] rounded-lg"
                >
                  {item.icon}
                  <span className="text-sm text-gray-300 font-semibold">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h6 className="text-sm text-gray-400">Admin</h6>
          <Link
            href=""
            className="flex items-center p-2  hover:[background:hsl(0,0%,20%)] rounded-lg  gap-x-2"
          >
            <LogOut size={20} className="stroke-white" />
            <span className="text-sm text-300 font-semibold">Logout</span>
          </Link>
        </div>
      </section>
    </article>
  );
};

export default Sidebar;
