import { createClient } from "@/lib/supabase/server";
import Message from "./message";
import SignOutButton from "./signout-button";
import { redirect } from "next/navigation";
import { getMessages } from "@/actions/main";

async function MainPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const messages = await getMessages();
  const userMessages = messages.map((m) => ({
    role: m.role as "system" | "user",
    content: m.content,
  }));

  return (
    <div className="flex flex-col h-screen w-full">
      <nav className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Chatbot</h1>
        <SignOutButton />
      </nav>
      <Message userMessages={userMessages} />
    </div>
  );
}

export default MainPage;
