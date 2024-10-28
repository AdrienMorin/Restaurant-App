// resolvers.ts
import prisma from "../lib/prisma";

export const resolvers = {
    Query: {
        items: () => {
            return prisma.item.findMany();
        }
    },
};
