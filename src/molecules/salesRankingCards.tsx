import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {SalesRankingCardsProps} from "@/utils/interfaces";

export default function SalesRankingCards ({salesRanking}: { salesRanking: SalesRankingCardsProps[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salesRanking.map((item, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover"/>
                    </CardContent>
                    <CardFooter>
                        <CardDescription>
                            Promedio de ventas diarias: {item.averageSales.toFixed(2)}
                        </CardDescription>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}