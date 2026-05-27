import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return format(new Date(date), "MMMM d, yyyy");
}

export function formatDateShort(
  date: string | Date | null | undefined,
): string {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isDeadlinePassed(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return isPast(new Date(deadline));
}

export function getRsvpColor(status: string): string {
  switch (status) {
    case "YES":
      return "bg-green-100 text-green-700";
    case "NO":
      return "bg-red-100 text-red-700";
    case "MAYBE":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-green-100 text-green-700";
    case "DRAFT":
      return "bg-gray-100 text-gray-600";
    case "CLOSED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getInviteUrl(slug: string): string {
  return `${window.location.origin}/invite/${slug}`;
}
