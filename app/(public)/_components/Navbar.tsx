"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo2.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import UserDropdown from "./UserDropdown";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Articles", href: "/blogs" },
    { name: "3D Models" },
  ];

  if (session?.user?.role === "admin") {
    navigationItems.push({ name: "Admin", href: "/admin" });
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="logo" className="size-9" />
          <span className="font-bold">PhysiVerse</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="flex flex-1 items-center justify-between max-md:justify-end">
          <div className="hidden md:flex items-center space-x-6 relative">
            {navigationItems.map((item) =>
              item.name === "3D Models" ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  {/* Trigger */}
                  <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="text-sm font-medium transition-colors cursor-pointer hover:text-primary"
                  >
                    {item.name}
                  </button>

                  {/* Dropdown menu */}
                  {open && (
                    <div className="absolute left-0 mt-2 w-40 rounded-md bg-white dark:bg-neutral-900 shadow-md">
                      <ul className="py-2 text-sm">
                        <li>
                          <Link
                            href="/3d_models/bohr_atom"
                            className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() => setOpen(false)}
                          >
                            Bohr Model
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/3d_models/solarSystem"
                            className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() => setOpen(false)}
                          >
                            Solar System
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/3d_models/superNova"
                            className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() => setOpen(false)}
                          >
                            Supernova
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/3d_models/atoms"
                            className="block px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            onClick={() => setOpen(false)}
                          >
                            Atom Models
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href ?? "#"}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Right side (Theme + User) */}
          <div className="flex space-x-4 items-center">
            <ThemeToggle />
            {isPending ? null : session ? (
              <UserDropdown
                email={session.user.email}
                image={
                  session?.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
                name={
                  session.user.name && session.user.name.length > 0
                    ? session.user.name
                    : session?.user.email
                }
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link href="/login" className="max-md:hidden">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
