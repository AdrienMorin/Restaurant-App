import Link from "next/link";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import {Card} from "@/components/ui/card";
import {TableProps} from "@/utils/interfaces";

export default function TableCard({table} : { table: TableProps }) {
    return (
        <Card className={"p-4 my-4 flex items-center justify-center gap-4"}>
            <div>
                <h2 className={"text-xl font-bold text-center"}>Mesa {table.number}</h2>
                <p className={"text-center"}>{table.id}</p>
            </div>
            <div>
                <Link href={"http://localhost:3000/menu?tableId=" + table.id}>
                    <QRCodeGenerator url={"http://localhost:3000/menu?tableId=" + table.id}/>
                </Link>
            </div>
        </Card>
    )
}