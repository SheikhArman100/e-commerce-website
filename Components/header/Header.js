import Marquee from "./Marquee.js";
import MobileNav from "./MobileNav.js";
import NavBar from "./NavBar.js";

const Header = () => {
  return (
    <div className="md:absolute left-0 top-0 w-full flex flex-col z-50 bg-bgColor">
      <Marquee />
      <MobileNav />
      <NavBar />
    </div>
  );
};

export default Header;



