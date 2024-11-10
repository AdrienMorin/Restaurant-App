import prisma from "../lib/prisma";
import {GraphQLContext} from "@/lib/context";
import {compare, genSaltSync, hash, hashSync} from "bcryptjs";
import {logout, requireAuth} from "@/lib/auth";
import {Role} from "@/utils/enums";

enum OrderStatus {
    PENDING="PENDING",
    PREPARING="PREPARING",
    READY="READY",
    DELIVERED="DELIVERED",
    PAID="PAID",
    CANCELLED="CANCELLED",
}

enum NewOrderStatus {
    PENDING="PENDING",
    PREPARING="PREPARING",
    READY="READY",
    DELIVERED="DELIVERED",
}

enum PaymentType {
    CASH="CASH",
    CARD="CARD",
    OTHER="OTHER",
}

const generateRandomKey = (length: number = 64): string => {
    const salt = genSaltSync(10);
    const hash = hashSync(salt, 10);
    return hash.slice(0, length);
};

const createDateOneDayLater = (): Date => {
    const now = new Date();
    const oneDayLater = new Date(now);
    oneDayLater.setDate(now.getDate() + 1);
    return oneDayLater;
};

const createSession = async (userId: number): Promise<string> => {
    const token = generateRandomKey(64);
    const storedToken = await prisma.session.create({
        data: {
            token,
            userId,
            expiresAt: createDateOneDayLater(),
        },
        include: { user: true },
    });

    return storedToken.token;
};

export const resolvers = {
    Query: {
        me: (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return context.currentUser;
        },
        users: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.user.findMany();
        },
        user: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.user.findUnique({
                where: { id: Number(id) },
            });
        },
        items: async () => {
            return prisma.item.findMany({ orderBy: { id: 'asc' } });
        },
        getItemById: async (_: any, { id }: { id: string }) => {
            return prisma.item.findUnique({
                where: { id: Number(id) },
            });
        },
        tables: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.table.findMany({ orderBy: { number: 'asc' } });
        },
        getTableById: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.table.findUnique({
                where: { id },
                include: {
                    orders: {
                        where: {
                            status: {
                                notIn: ['PAID', 'CANCELLED'],
                            },
                        },
                        include: {
                            item: true,
                            payment: true,
                        },
                    },
                },
            });
        },
        orders: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.order.findMany({ include: { table: true, item: true, payment: true } });
        },
        getOrdersByTableId: async (_: any, { tableId }: { tableId: string }) => {
            return prisma.order.findMany({
                where: { tableId, status: { notIn: ['PAID', 'CANCELLED'] } },
                include: { table: true, item: true, payment: true },
            });
        },
        payments: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.payment.findMany({ include: { orders: true } });
        },
        getPaymentById: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.payment.findUnique({
                where: { id: Number(id) },
            });
        },
    },
    Mutation: {
        signup: async (
            parent: unknown,
            args: { email: string; password: string; name: string, role: Role },
            context: GraphQLContext
        ) => {
            requireAuth(context, Role.ADMIN);
            const password = await hash(args.password, 10);

            const user = await context.prisma.user.create({
                data: { ...args, password },
            });

            const sessionToken = await createSession(user.id);

            return {
                sessionToken,
                user,
            };
        },
        login: async (
            parent: unknown,
            args: { email: string; password: string },
            context: GraphQLContext
        ) => {
            const user = await context.prisma.user.findUnique({
                where: { email: args.email },
            });
            if (!user) {
                throw new Error("No such user found");
            }

            const valid = await compare(args.password, user.password);
            if (!valid) {
                throw new Error("Invalid password");
            }

            const userId = user.id;

            const sessionToken = await createSession(userId);

            return {
                token: sessionToken,
                user,
            };
        },
        updateUser: async (parent: unknown, { id, name, email, password, role }: { id: string, name?: string, email?: string, password?: string, role?: Role }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const data: Record<string, unknown> = {};
            if (name) {
                data.name = name;
            }
            if (email) {
                data.email = email;
            }
            if (role) {
                data.role = role;
            }
            if (password) {
                data.password = await hash(password, 10);
            }
            return prisma.user.update({
                where: { id: Number(id) },
                data,
            });
        },
        deleteUser: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.$transaction(async (prisma) => {
                // Supprimer les sessions associées à l'utilisateur
                await prisma.session.deleteMany({
                    where: { userId: Number(id) },
                });

                // Supprimer l'utilisateur
                return prisma.user.delete({
                    where: { id: Number(id) },
                });
            });
        },
        logout: async (parent: unknown, args: {}, context: GraphQLContext) => {
            await logout(context);
            return true;
        },
        createItem: async (parent: unknown, { title, description, price, imageUrl }: { title: string, description: string, price: number, imageUrl: string }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.item.create({
                data: {
                    title,
                    description,
                    price,
                    imageUrl,
                },
            });
        },
        deleteItem: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.item.delete({
                where: { id: Number(id) },
            });
        },
        editItem: async (parent: unknown, { id, title, description, price, imageUrl }: { id: string, title?: string, description?: string, price?: number, imageUrl?: string }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.item.update({
                where: { id: Number(id) },
                data: {
                    title,
                    description,
                    price,
                    imageUrl,
                },
            });
        },
        createOrder: async (_: any, { tableId, itemId, paymentId }: { tableId: string, itemId: string, paymentId?: string }) => {
            return prisma.order.create({
                data: {
                    tableId,
                    itemId: Number(itemId),
                    paymentId: paymentId ? Number(paymentId) : undefined,
                },
            });
        },
        deleteOrder: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            return prisma.order.delete({
                where: { id: Number(id) },
            });
        },
        setOrderStatus: async (parent: unknown, { id, status }: { id: string, status: NewOrderStatus }, context: GraphQLContext) => {
            requireAuth(context, Role.USER);
            const order = await prisma.order.findUnique({
                where: { id: Number(id) }
            })
            if (!order) {
                throw new Error('Order not found');
            }
            if (order!.status === OrderStatus.PAID || order!.status === OrderStatus.CANCELLED) {
                throw new Error('Cannot change status of a paid or cancelled order');
            }
            return prisma.order.update({
                where: { id: Number(id) },
                data: { status },
            });
        },
        cancelOrder: async (_: any, { id }: { id: string }) => {
            const order = await prisma.order.findUnique({
                where: { id: Number(id) }
            })
            if (!order) {
                throw new Error('Order not found');
            }
            if (order!.status !== OrderStatus.PENDING) {
                throw new Error('Your order is already being prepared or is ready, you cannot cancel it');
            }
            return prisma.order.update({
                where: { id: Number(id) },
                data: { status: OrderStatus.CANCELLED },
            });
        },
        createPaymentForOrder: async (parent: unknown, { type, orderId }: { type: PaymentType, orderId: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const order = await prisma.order.findUnique({
                where: { id: Number(orderId) },
            });

            if (!order) {
                throw new Error("Order not found");
            }

            const payment = await prisma.payment.create({
                data: {
                    type: type,
                },
            });

            return prisma.order.update({
                where: { id: Number(orderId) },
                data: {
                    paymentId: payment.id,
                    status: 'PAID',
                },
            });
        },
        createPaymentForTable: async (parent: unknown, { tableId, type }: { tableId: string, type: PaymentType }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const payment = await prisma.payment.create({
                data: {
                    type: type,
                },
            });

            const orders = await prisma.order.findMany({
                where: {
                    tableId,
                    status: { notIn: ['PAID', 'CANCELLED'] },
                },
            });

            return prisma.$transaction(
                orders.map((order) =>
                    prisma.order.update({
                        where: { id: order.id },
                        data: {
                            paymentId: payment.id,
                            status: 'PAID',
                        },
                    })
                )
            );
        },
        deletePayment: async (parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            return prisma.payment.delete({
                where: { id: Number(id) },
            });
        },
        addTable: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const maxNumber = await prisma.table.findFirst({
                orderBy: { number: 'desc' },
                select: { number: true },
            });

            const newNumber = maxNumber ? maxNumber.number + 1 : 1;

            return prisma.table.create({
                data: {
                    number: newNumber,
                },
            });
        },
        removeTable: async (parent: unknown, args: {}, context: GraphQLContext) => {
            requireAuth(context, Role.ADMIN);
            const maxNumber = await prisma.table.findFirst({
                orderBy: { number: 'desc' },
                select: { number: true },
            });

            return prisma.table.delete({
                where: {number: maxNumber!.number},
            });
        },
    },
};
