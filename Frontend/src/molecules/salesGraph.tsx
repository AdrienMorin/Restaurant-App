import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {DailySales} from "@/utils/interfaces";

export interface SalesGraphProps {
    dailySales: DailySales[];
    loading: boolean;
    error: any;
}

export default function SalesGraph ({dailySales, loading, error}: SalesGraphProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className={"mx-auto"}>Gráfico de ventas diarias</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && <p>Loading...</p>}
                {error && <p>Error…</p>}
                {!loading && !error && (
                    <LineChart
                        className={"mx-auto"}
                        width={700}
                        height={400}
                        data={dailySales}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                )}
            </CardContent>
        </Card>
    )
}