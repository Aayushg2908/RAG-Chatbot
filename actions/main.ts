"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const getMessages = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const userMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.userId, user.id));

  return userMessages;
};
