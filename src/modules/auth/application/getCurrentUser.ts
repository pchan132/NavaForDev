// แยก logic การดึง user เป็น use-case ทำให้เรียกจากหลายที่ได้ เช่น server component, API route, middleware
// ใช้ getServerSession จาก next-auth แทนการดึง session จาก request โดยตรง
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "../infrastructure/prismaAdapter";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  // session.user.id ถูกแนบใน callback ของ NextAuth
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });
  return user;
}
