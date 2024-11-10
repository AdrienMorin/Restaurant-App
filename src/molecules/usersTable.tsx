import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useMutation } from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import {UserProps} from "@/utils/enums";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Icons} from "@/components/ui/icons";
import * as React from "react";

interface UsersTableProps {
    users: UserProps[];
    refetch: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, refetch }) => {
    const [deleteUser] = useMutation(DELETE_USER_MUTATION);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteUser({ variables: { id } });
        refetch();
        setDeletingId(null);
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/editUser?id=${id}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                    <TableHead>{user.name}</TableHead>
                    <TableHead>{user.email}</TableHead>
                    <TableHead>{user.role}</TableHead>
                    <TableHead>
                        <Button variant="secondary" onClick={() => handleEdit(user.id)}>
                            <Edit />
                        </Button>
                        <Button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            variant="destructive"
                        >
                            {deletingId === user.id ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : <Trash2 />}
                        </Button>
                    </TableHead>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    );
};
