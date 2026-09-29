"use client";

import { useQuery } from "@tanstack/react-query";

import { axiosPublic } from "@/libs/axios/config.js";

/**
 * The signed-in customer, read from the session cookie (hence `axiosPublic`
 * with `withCredentials` — no bearer token, so it is unaffected by access-token
 * expiry and always tells the truth about whether a session exists).
 *
 * One `["user"]` cache entry feeds every consumer (NavBar, MobileNav,
 * StatusChecker, usePendingReviews), so however many of them mount, a single
 * request is made and shared.
 *
 * A GUEST IS CHECKED ONCE, NOT POLLED. `refetchInterval` is a function of the
 * query, so it can key off the result: no data yet means "not signed in", and a
 * visitor who never signs in should not cost an API call every 30 seconds for
 * as long as they browse. Once a session exists the poll starts, which is what
 * keeps a signed-in customer accurate — signing out server-side, or a role or
 * profile change, lands within 30s without a reload.
 *
 * The flip to "polling" depends on the ["user"] cache being refreshed after a
 * sign-in, because a guest's cached entry is an ERROR (401), not data — so
 * there is nothing for the interval to key off. `SignInForm` and the Google
 * callback therefore invalidate ["user"] explicitly rather than relying on a
 * remount to notice.
 */
const useUserDetails = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosPublic.get("/auth/user", {
        withCredentials: true,
      });

      return response.data.data;
    },
    enabled: true,
    // refetchOnWindowFocus: true,
    // refetchOnMount: true,
    // refetchOnReconnect: true,
    staleTime: 1000 * 30, // 30 seconds
    // `false` disables the interval. A guest gets exactly one check on mount;
    // a signed-in customer is then polled to stay in sync.
    refetchInterval: (query) => (query.state.data ? 1000 * 30 : false),
  });
};

export default useUserDetails;
