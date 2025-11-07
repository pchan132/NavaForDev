// ตัวอย่าง helper ที่ใช้ใน API route หรือ server component เพื่อบล็อกผู้ที่ไม่ได้ล็อกอิน
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requestCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  return session.user;
}
