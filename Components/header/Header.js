import Marquee from "./Marquee.js";
import MobileNav from "./MobileNav.js";
import NavBar from "./NavBar.js";
import { fetchFeaturedMessages } from "@/libs/animation/marquee.js";

/**
 * Server component: the featured coupons are fetched here rather than in the
 * marquee's useEffect, so the banner is part of the initial HTML. Marquee stays
 * a client component — it only needs the finished strings to animate them.
 */
const Header = async () => {
  const messages = await fetchFeaturedMessages();

  return (
    <div className="md:absolute left-0 top-0 w-full flex flex-col z-50 bg-bgColor">
      <Marquee messages={messages} />
      <MobileNav />
      <NavBar />
    </div>
  );
};

export default Header;



