import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = await NextAuth(await authOptions);

export { handler as GET, handler as POST };
