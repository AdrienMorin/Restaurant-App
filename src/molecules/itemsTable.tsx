import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useMutation} from "@apollo/client";
import {DELETE_ITEM_MUTATION} from "@/utils/graphql/mutations/items";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/router";
import Link from "next/link";

interface ItemProps {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    price: number
}

interface ItemsTableProps {
    items: ItemProps[];
    refetch: () => void;
}

export function ItemsTable({ items, refetch }: ItemsTableProps) {
    const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);
    const router = useRouter();

    const handleDelete = async (id: number) => {
        try {
            await deleteItem({ variables: { id } });
            toast({
                title: "Elemento eliminado",
                description: "El elemento se ha eliminado correctamente del menú",
            });
            refetch();
        } catch (err) {
            toast({
                title: "Error",
                description: "Hubo un problema al eliminar el elemento",
                variant: "destructive"
            });
        }
    };
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Título</TableHead>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Descripción</TableHead>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Precio</TableHead>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Imagen</TableHead>
                    <TableHead className=" px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-gray-100">
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">{item.title}</TableCell>
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">{item.description}</TableCell>
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">{item.price}</TableCell>
                        <TableCell className=" px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"><img src={item.imageUrl} width={160} alt={item.title}/></TableCell>
                        <TableCell className="flex items-center justify-center gap-2">
                            <Link href={"/admin/editItem?id="+item.id}>
                                <Button variant="outline">Editar</Button>
                            </Link>
                            <Dialog>
                                <DialogTrigger><Button variant="destructive">Eliminar</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>¿Está completamente seguro?</DialogTitle>
                                        <DialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el elemento.
                                        </DialogDescription>
                                        <DialogFooter>
                                            <DialogClose>
                                                <Button variant="secondary">Cancelar</Button>
                                            </DialogClose>
                                            <DialogClose>
                                                <Button variant="destructive" onClick={() => {handleDelete(item.id)}}>Eliminar</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}