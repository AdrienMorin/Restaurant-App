interface Item {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

interface Table {
    id: string;
    number: number;
}

interface Payment {
    id: string;
    createdAt: string;
    type: string;
}

interface Order {
    id: string;
    createdAt: string;
    status: string;
    table: Table;
    item: Item;
    payment: Payment;
}

interface DailySales {
    date: string;
    total: number;
}

interface SalesRanking {
    title: string;
    imageUrl: string;
    averageSales: number;
}

export const transformData = (orders: Order[]): DailySales[] => {
    const salesMap = new Map<string, number>();

    orders.forEach(order => {
        const date = new Date(parseInt(order.createdAt));
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const price = order.item.price;

        if (salesMap.has(formattedDate)) {
            salesMap.set(formattedDate, salesMap.get(formattedDate)! + price);
        } else {
            salesMap.set(formattedDate, price);
        }
    });

    const dailySales: DailySales[] = [];
    salesMap.forEach((total, date) => {
        dailySales.push({ date, total });
    });

    return dailySales;
};

export const calculateSalesRanking = (orders: Order[]): SalesRanking[] => {
    const itemSalesMap = new Map<string, number>();
    const itemCountMap = new Map<string, number>();

    orders.forEach(order => {
        const itemId = order.item.id;
        const price = order.item.price;

        if (itemSalesMap.has(itemId)) {
            itemSalesMap.set(itemId, itemSalesMap.get(itemId)! + price);
            itemCountMap.set(itemId, itemCountMap.get(itemId)! + 1);
        } else {
            itemSalesMap.set(itemId, price);
            itemCountMap.set(itemId, 1);
        }
    });

    const salesRanking: SalesRanking[] = [];
    itemSalesMap.forEach((total, itemId) => {
        const item = orders.find(order => order.item.id === itemId)?.item;
        if (item) {
            const averageSales = total / itemCountMap.get(itemId)!;
            salesRanking.push({
                title: item.title,
                imageUrl: item.imageUrl,
                averageSales: averageSales
            });
        }
    });

    return salesRanking.sort((a, b) => b.averageSales - a.averageSales);
};