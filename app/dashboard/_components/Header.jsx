"use client";
import React, { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  });
  return (
    <div className="flex p-4 items-center bg-secondary justify-between shadow-sm">
      <Link href="/">
      <Image src={"../../logo.svg"} width={50} height={50} alt="logo"></Image>
      </Link>
      
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold cursor-pointer transition  ${
            path == "/dashboard" && "text-primary font-bold"
          }`}
        >
          Dashboard
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
