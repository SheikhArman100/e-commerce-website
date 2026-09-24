'use client'

import { useAuthStore } from "@/libs/zustand/authStore.js"
import useUpdateAT from "./useUpdateAT.js"
import { useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation.js"
import { axiosPrivate } from "@/libs/axios/config.js"
import { useEffect } from "react"
import { toast } from "react-toastify"

// Shown when the API tells us the access token is gone and the refresh cookie
// could not bring it back.
const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again."

const useAxiosPrivate = () => {
  const update = useUpdateAT()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const queryClient=useQueryClient()
  const router=useRouter()
  const pathname = usePathname();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        // Read the token from the store rather than from this render closure:
        // the refetches that follow a sign out start BEFORE this effect re-runs
        // with the cleared token, and they must not leave as "Bearer null"
        // (the API answers those with 403 "Invalid token format").
        const token = useAuthStore.getState().accessToken
        if (token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // The session is over for good: drop the token + every cached resource and
    // send the visitor to sign in with one single explanation.
    const endSession = (message) => {
      setAccessToken(null)
      queryClient.removeQueries()
      // A stable toastId: a failing burst must produce ONE explanation, not one
      // per request that happened to be in flight.
      toast.error(message || SESSION_EXPIRED_MESSAGE, { toastId: 'session-ended' })
      router.push(`/auth/signin?next=${pathname}`)
    }

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async error => {
        const prevRequest = error?.config
        const errorMessage = error?.response?.data?.message || ''
        const status = error?.response?.status

        // A retry issued on the quiet path below must never surface as a
        // second, user facing error.
        if (prevRequest?.silentRetry) return Promise.reject(error)

        // Was this request actually signed? One that left without a token
        // belongs to a visitor holding no session — a guest, or the moment
        // right after a sign out — so nothing here deserves an error toast.
        const sentWithToken = Boolean(prevRequest?.headers?.['Authorization'])

        if (!sentWithToken) {
          if (status !== 401 && status !== 403) return Promise.reject(error)
          if (prevRequest?.sent) return Promise.reject(error)

          // The refresh cookie can outlive the stored access token (local
          // storage wiped, another tab, …) → try ONE silent refresh. If that
          // fails we stay quiet: the guest UI is already on screen.
          prevRequest.sent = true
          try {
            const newAccessToken = await update()
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            prevRequest.silentRetry = true
            return axiosPrivate(prevRequest)
          } catch {
            return Promise.reject(error)
          }
        }

        // 401 Unauthorized → Sign out immediately
        if (status === 401) {
          endSession(errorMessage)
          return Promise.reject(error)
        }

        // 403 Forbidden
        if (status === 403 && !prevRequest?.sent) {
          // Check if it's specifically a token expiration
          if (errorMessage === 'Token has expired' || errorMessage === 'Invalid token format'  || errorMessage.toLowerCase().includes('expired')) {
            prevRequest.sent = true

            try {
              const newAccessToken = await update()

              if (!newAccessToken) {
                // Refresh failed, sign out
                endSession(errorMessage)
                return Promise.reject(error)
              }

              prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
              return axiosPrivate(prevRequest)
            } catch (refreshError) {
              // Refresh token failed or expired, sign out
              endSession(errorMessage)
              return Promise.reject(refreshError)
            }
          }

          // If it's "Insufficient permissions", don't refresh
          // Just reject and let the component handle it
          return Promise.reject(error)
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [accessToken, update, setAccessToken, queryClient, router, pathname])

  return axiosPrivate
}

export default useAxiosPrivate