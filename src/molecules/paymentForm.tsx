import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useQuery} from "@apollo/client";
import {GET_TABLE_BY_ID} from "@/utils/graphql/queries/tables";

export default function PaymentForm({tableId} : {tableId: string}) {

    const {data} = useQuery(GET_TABLE_BY_ID, {
        variables: { id: tableId },
        skip: !tableId,
    })

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="flex w-full ">
                <TabsTrigger value="account" className={"w-full"}>Pagar toda la mesa</TabsTrigger>
                <TabsTrigger value="password" className={"w-full"}>Pagar separados</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Ordenes de la mesa</CardTitle>
                        <CardDescription>
                            Aquí puedes ver todas las ordenes de la mesa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {data?.getTableById && data.getTableById.orders.map((order: any) => (
                            <div key={order.id} className="flex justify-between">
                                <div>
                                    <p>{order.item.title}</p>
                                    <p>{order.item.price}</p>
                                </div>
                                <div>
                                    <Button>Pay</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button>Save changes</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    );
}