import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-orange-500">
      <Card className="w-full max-w-3xl mx-auto text-center rounded-lg overflow-hidden shadow-lg border-4 border-orange-700">
        <div className="relative h-[500px]">
          <Image
            src="/mexican.webp" // Asegúrate de que esta ruta sea correcta
            alt="Delicious Mexican Food"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>
        <CardHeader className="bg-orange-800 bg-opacity-60 p-6">
          <CardTitle className="text-white text-5xl font-bold tracking-wide">
            Bienvenido a La Casa Mexicana
          </CardTitle>
          <p className="text-yellow-100 text-lg mt-2">
            Sabores auténticos mexicanos, directo de nuestra cocina a tu mesa.
          </p>
        </CardHeader>
        <CardContent className="p-8 bg-orange-50 flex justify-center space-x-6">
          <Button asChild variant="outline" className="px-8 py-4 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
            <Link href="/menu">Ver Menú</Link>
          </Button>
          <Button asChild variant="secondary" className="px-8 py-4 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
            <Link href="/directions">Cómo Llegar</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
