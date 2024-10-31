import prisma from "../lib/prisma";

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

export const resolvers = {
    Query: {
        items: async () => {
            return prisma.item.findMany({ orderBy: { id: 'asc' } });
        },
        getItemById: async (_: any, { id }: { id: string }) => {
            return prisma.item.findUnique({
                where: { id: Number(id) },
            });
        },
        tables: async () => {
            return prisma.table.findMany({ orderBy: { number: 'asc' } });
        },
        getTableById: async (_: any, { id }: { id: string }) => {
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
        orders: async () => {
            return prisma.order.findMany({ include: { table: true, item: true, payment: true } });
        },
        getOrdersByTableId: async (_: any, { tableId }: { tableId: string }) => {
            return prisma.order.findMany({
                where: { tableId },
                include: { table: true, item: true, payment: true },
            });
        },
        payments: async () => {
            return prisma.payment.findMany({ include: { orders: true } });
        },
        getPaymentById: async (_: any, { id }: { id: string }) => {
            return prisma.payment.findUnique({
                where: { id: Number(id) },
            });
        },
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
        editItem: async (_: any, { id, title, description, price, imageUrl }: { id: string, title?: string, description?: string, price?: number, imageUrl?: string }) => {
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
        deleteOrder: async (_: any, { id }: { id: string }) => {
            return prisma.order.delete({
                where: { id: Number(id) },
            });
        },
        setOrderStatus: async (_: any, { id, status }: { id: string, status: NewOrderStatus }) => {
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
        createPaymentForOrder: async (_: any, { type, orderId }: { type: PaymentType, orderId: string }) => {
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
        createPaymentForTable: async (_: any, { tableId, type }: { tableId: string, type: PaymentType }) => {
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

            return await prisma.$transaction(
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
        deletePayment: async (_: any, { id }: { id: string }) => {
            return prisma.payment.delete({
                where: { id: Number(id) },
            });
        },
        addTable: async () => {
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
        removeTable: async () => {
            const maxNumber = await prisma.table.findFirst({
                orderBy: { number: 'desc' },
                select: { number: true },
            });

            return prisma.table.delete({
                where: {number: maxNumber!.number},
            });;
        },
    },
};
