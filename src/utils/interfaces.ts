export interface DailySales {
    date: string;
    total: number;
}

export interface SalesRankingCardsProps {
    title: string;
    imageUrl: string;
    averageSales: number;
}

export interface ItemCardProps {
    item: ItemProps;
    tableId?: string | string[];
}

export interface ItemProps {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    price: number
}

export interface OrderProps {
    id: string;
    createdAt: string;
    status: string;
    table: TableProps;
    item: ItemProps;
    payment: PaymentProps;
}

export interface TableProps {
    id: string;
    number: number;
}

interface PaymentProps {
    id: string;
    createdAt: string;
    type: string;
}

