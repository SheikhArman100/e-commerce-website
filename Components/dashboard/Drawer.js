import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import Logo from "../header/Logo";
import { sidebarAccountItems, sidebarProductItems } from "./Sidebar";

const Drawer = () => {
  return (
    <div className="drawer md:hidden z-10">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className=" drawer-button">
          <Menu size={28} className="stroke-white"/>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <article className="menu  w-[15rem] h-screen [background:hsl(0,0%,8%)] border border-gray-600 flex flex-col items-center py-5">
          <Logo />
          <section className="w-full flex-1 flex flex-col mt-5 px-4 gap-y-10">
            <div className="">
              <h6 className="text-sm text-gray-400">Account</h6>
              <ul className=" flex flex-col  gap-y-0.5">
                {sidebarAccountItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex items-center p-2 gap-x-2 hover:[background:hsl(0,0%,20%)] rounded-lg"
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
              <ul className=" flex flex-col ">
                {sidebarProductItems.map((item, index) => (
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
              <h6 className="text-sm text-gray-400">Admin</h6>
              <Link
                href=""
                className="flex items-center mt-1 p-2  gap-x-2 hover:[background:hsl(0,0%,20%)] rounded-lg"
              >
                <LogOut size={20} className="stroke-white" />
                <span className="text-sm text-gray-300 font-semibold">
                  Logout
                </span>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Drawer;
