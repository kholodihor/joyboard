import { getAuthSession } from "@/lib/auth";

export const authenticateUser = async () => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
