"use client";
import { usePathname, useRouter } from "next/navigation.js";
import useUserDetails from "@/hooks/useUserDetails.js";
import { useEffect } from "react";

/**
 * Gate for the signed-in pages (cart, check-out, orders, wishlist).
 *
 * A visitor without a session is sent to sign in and comes straight back here
 * afterwards: the current path travels as `?next=`, which the sign-in form and
 * the Google callback already honour — so landing on `/checkout` while logged
 * out no longer dumps the customer on the home page afterwards.
 *
 * The redirect runs in an effect (never during render) and the gate holds its
 * own frame until it happens, so protected content is not flashed at a visitor
 * who is about to be turned away.
 */
const StatusChecker = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isPending, error, data } = useUserDetails();

  useEffect(() => {
    // Only a 401/403 means the session is genuinely gone. Any other failure —
    // a 500, a timeout, a blip while the network is still coming back — is not
    // a sign-out, and bouncing the customer to the sign-in form for it would
    // eject them from a perfectly valid session.
    const status = error?.response?.status;
    if (!error || (status !== 401 && status !== 403)) return;

    const next = encodeURIComponent(pathname || "/");
    router.replace(`/auth/signin?next=${next}`);
  }, [error, pathname, router]);

  if (isPending || error ) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bgColor">
        <span className="loading loading-spinner text-accentColor" />
      </div>
    );
  }

  // `data ? children : null` rather than `data && children`: should /auth/user
  // ever resolve to something falsy, the latter paints a stray `0` (or an empty
  // page with no error to explain it) instead of simply showing nothing.
  return <>{data ? children : null}</>;
};

export default StatusChecker;
