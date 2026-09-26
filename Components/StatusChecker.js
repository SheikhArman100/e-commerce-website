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
    if (!error) return;

    const next = encodeURIComponent(pathname || "/");
    router.replace(`/auth/signin?next=${next}`);
  }, [error, pathname, router]);

  if (isPending || error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bgColor">
        <span className="loading loading-spinner text-accentColor" />
      </div>
    );
  }

  return <>{data && children}</>;
};

export default StatusChecker;
