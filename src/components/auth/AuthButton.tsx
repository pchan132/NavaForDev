"use client";

// Client-side UI ตรงนี้เป็น presentation layer — เรียก signIn/signOut จาก next-auth เพื่อเปิด flow ของ provider

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <button disabled>Loading...</button>;
  }

  if (!session) {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  return (
    <div>
      <img
        src={session.user?.image ?? ""}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <span>{session.user?.name}</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
