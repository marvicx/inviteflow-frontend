import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true, autoConnect: true });
  }
  return socket;
}

/**
 * Joins an invitation room and listens for RSVP events.
 * Calls `onNewRsvp` or `onUpdatedRsvp` when events are received.
 */
export function useInvitationSocket(
  invitationId: string | undefined,
  callbacks: {
    onNewRsvp?: (guest: any) => void;
    onUpdatedRsvp?: (guest: any) => void;
    onCheckin?: (data: { guestId: string; checkedIn: boolean }) => void;
  },
) {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    if (!invitationId) return;
    const s = getSocket();

    s.emit("join:invitation", invitationId);

    const handleNew = (data: any) =>
      callbacksRef.current.onNewRsvp?.(data.guest);
    const handleUpdate = (data: any) =>
      callbacksRef.current.onUpdatedRsvp?.(data.guest);
    const handleCheckin = (data: any) => callbacksRef.current.onCheckin?.(data);

    s.on("rsvp:new", handleNew);
    s.on("rsvp:updated", handleUpdate);
    s.on("guest:checkin", handleCheckin);

    return () => {
      s.emit("leave:invitation", invitationId);
      s.off("rsvp:new", handleNew);
      s.off("rsvp:updated", handleUpdate);
      s.off("guest:checkin", handleCheckin);
    };
  }, [invitationId]);
}
