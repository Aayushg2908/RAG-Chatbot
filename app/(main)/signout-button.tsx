"use client";

import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

const SignOutButton = () => {
  return (
    <Button
      onClick={async () => {
        try {
          await signOut();
        } catch (error) {
          console.log(error);
        }
      }}
      variant="outline"
      className="ml-auto gap-1.5"
    >
      <LogOutIcon className="size-4" /> Sign Out
    </Button>
  );
};

export default SignOutButton;
