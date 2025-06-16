import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoleColor(role: string): string {
  const colors = {
    student: "hsl(123, 44%, 38%)", // #28a745
    staff: "hsl(354, 70%, 54%)",   // #dc3545
    management: "hsl(211, 100%, 50%)", // #007bff
    admin: "hsl(263, 55%, 52%)",   // #6f42c1
  };
  return colors[role as keyof typeof colors] || colors.student;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getStatusColor(status: string): string {
  const colors = {
    submitted: "bg-blue-100 text-blue-800",
    "under review": "bg-yellow-100 text-yellow-800", 
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };
  return colors[status as keyof typeof colors] || colors.submitted;
}

export function getPriorityColor(priority: string): string {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
}

export function generateGrievanceId(): string {
  return "#GR" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}
