import { Bell } from "lucide-react";
import Drawer from "./Drawer";

const Navbar = () => {
  return (
    <nav className="h-16 md:h-12 w-full border-b border-gray-500 flex md:flex-row-reverse items-center justify-between px-8">
      <Drawer />
      <div className="flex items-center  gap-x-2 md:gap-x-5">
        <div className="p-1  rounded-full relative">
          <div className="h-4 w-4 rounded-full absolute right-0 top-0 text-xs bg-yellow-500 flex items-center  justify-center text-white">3</div>
          <Bell size={24} className="text-white"/>
        </div>
        <div className="flex items-center gap-x-2 right-0 top-0">
          <div className="hidden md:flex flex-col ">
            <p className="text-white text-xs whitespace-nowrap">Sheikh Arman</p>
            <span className="text-xs text-gray-300 text-right">Admin</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-violet-400 flex items-center justify-center">
            <p className="text-sm text-white">SA</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
