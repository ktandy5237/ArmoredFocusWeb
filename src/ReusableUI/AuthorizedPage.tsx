"use client";
import { ReactNode } from "react";
import NavigationBar from "./NavBar/NavigationBar";

interface AuthorizedPageProps {
  children: ReactNode;
  className?: string; // Optional className prop
}

export default function AuthorizedPage({
  children,
  className,
}: AuthorizedPageProps) {
  return (
    <div className="page">
      <NavigationBar />
      <div className={`page-container ${className}`}>{children}</div>
    </div>
  );
}
