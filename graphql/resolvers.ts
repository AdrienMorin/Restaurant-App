// resolvers.ts
import prisma from "../lib/prisma";

export const resolvers = {
    Query: {
        items: () => {
            return prisma.item.findMany();
        }
    },
    Mutation: {
        createItem: async (_: any, { title, description, price, imageUrl }: { title: string, description: string, price: number, imageUrl: string }) => {
            return prisma.item.create({
                data: {
                    title,
                    description,
                    price,
                    imageUrl,
                },
            });
        },
        deleteItem: async (_: any, { id }: { id: string }) => {
            return prisma.item.delete({
                where: { id: Number(id) },
            });
        },
    },
};
