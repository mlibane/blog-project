import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const originalAdapter = PrismaAdapter(prisma);
  
  return {
    ...originalAdapter,
    createUser: async (data: any) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          slug: data.id, // Use the generated id as the slug
        },
      });
      return { ...user, id: user.slug };
    },
    getUser: async (id: string) => {
      const user = await prisma.user.findUnique({ where: { slug: id } });
      return user ? { ...user, id: user.slug } : null;
    },
    getUserByEmail: async (email: string) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? { ...user, id: user.slug } : null;
    },
    getUserByAccount: async ({ providerAccountId, provider }: any) => {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      });
      return account?.user ? { ...account.user, id: account.user.slug } : null;
    },
    updateUser: async ({ id, ...data }: any) => {
      const user = await prisma.user.update({ where: { slug: id }, data });
      return { ...user, id: user.slug };
    },
    deleteUser: async (id: string) => {
      const user = await prisma.user.delete({ where: { slug: id } });
      return { ...user, id: user.slug };
    },
  };
}