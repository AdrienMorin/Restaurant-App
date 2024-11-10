import Link from "next/link";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import {Card} from "@/components/ui/card";
import {TableProps} from "@/utils/interfaces";

export default function TableCard({table} : { table: TableProps }) {
    const localUrl = process.env.LOCAL_URL || 'http://localhost:3000';
    const productionUrl = process.env.PRODUCTION_URL || 'https://adrien-morin-sebastian-ruiz-restaurant.vercel.app';

    const baseUrl = process.env.NODE_ENV === 'production' ? productionUrl : localUrl;
    const url = `${baseUrl}/menu?tableId=${table.id}`;

    return (
        <Card className={"p-4 my-4 flex items-center justify-center gap-4"}>
            <div>
                <h2 className={"text-xl font-bold text-center"}>Mesa {table.number}</h2>
                <p className={"text-center"}>{table.id}</p>
            </div>
            <div>
                <Link href={url}>
                    <QRCodeGenerator url={url}/>
                </Link>
            </div>
        </Card>
    )
}