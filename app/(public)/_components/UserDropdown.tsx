"use client";

import {
  BookOpen,
  ChevronDownIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  BugPlayIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignout } from "@/hooks/use-signout";
import {
  Icon360View,
  IconArticleFilled,
  IconSettings,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

interface iAppProps {
  name: string;
  email: string;
  image: string;
}

export default function UserDropdown({ name, email, image }: iAppProps) {
  const { data: session } = authClient.useSession();
  const handleSignOut = useSignout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-48">
        {/* User info */}
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Main navigation */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <HomeIcon size={16} className="opacity-60" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/courses">
              <BookOpen size={16} className="opacity-60" />
              <span>Courses</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboardIcon size={16} className="opacity-60" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/blogs">
              <IconArticleFilled size={16} className="opacity-60" />
              <span>Articles</span>
            </Link>
          </DropdownMenuItem>

          {/* Submenu for 3D Models */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon360View size={16} className="opacity-60 mr-2" />
              <span>3D Models</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem asChild>
                <Link href="/3d_models/bohr_atom">Bohr Model</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/3d_models/solarSystem">Solar System</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/3d_models/superNova">Supernova</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/3d_models/atoms">Atom Models</Link>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Admin link only for admins */}
          {session?.user?.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <IconSettings size={16} className="opacity-60" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
