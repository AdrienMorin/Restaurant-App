import {
    Table,
    TableBody,
    TableCell, TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {OrderProps} from "@/utils/interfaces";

interface OrdersTableProps {
    orders: OrderProps[];
}

export function OrdersTable({ orders }: OrdersTableProps) {

    const calculateTotalPrice = (orders: OrderProps[]): number => {
        return orders?.reduce((total, order) => {
            return total + order.item.price;
        }, 0);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-4/5 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Título</TableHead>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Precio</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders && orders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-gray-100">
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">{order.item.title}</TableCell>
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">${order.item.price} COP</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                        Total
                    </TableCell>
                    <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                        ${calculateTotalPrice(orders)} COP
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}