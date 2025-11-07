// เป็น "interface" ให้ client เรียกกใช้ API Route นี้ได้

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
