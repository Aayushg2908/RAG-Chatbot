"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema } from "@/lib/schema";

export async function signup(values: z.infer<typeof LoginSchema>) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(values);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return redirect("/");
}

export async function login(values: z.infer<typeof LoginSchema>) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(values);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    return redirect("/error");
  }

  revalidatePath("/", "layout");
  return redirect("/login");
}
