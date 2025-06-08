"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log("Session data:", session.user);
    }
  }, [session]);

  return session ? (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      <div className="flex gap-10">
        <button onClick={() => router.push("/auth/login")}>Sign In </button>
        <button onClick={() => router.push("/auth/signup")}>Sign Up </button>
      </div>
    </div>
  );
}
