import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const originalAdapter = PrismaAdapter(prisma) as any;

  return {
    ...originalAdapter,
    createUser: async (data: any) => {
      const user = await originalAdapter.createUser(data);
      return { ...user, id: user.id };
    },
    getUser: async (id: string) => {
      const user = await originalAdapter.getUser(id);
      return user ? { ...user, id: user.id } : null;
    },
    getUserByEmail: async (email: string) => {
      const user = await originalAdapter.getUserByEmail(email);
      return user ? { ...user, id: user.id } : null;
    },
    getUserByAccount: async (account: any) => {
      const user = await originalAdapter.getUserByAccount(account);
      return user ? { ...user, id: user.id } : null;
    },
    updateUser: async (user: any) => {
      const updatedUser = await originalAdapter.updateUser(user);
      return { ...updatedUser, id: updatedUser.id };
    },
    deleteUser: async (userId: string) => {
      const user = await originalAdapter.deleteUser(userId);
      return user ? { ...user, id: user.id } : null;
    },
  };
}