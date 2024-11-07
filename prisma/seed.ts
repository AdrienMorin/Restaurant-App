import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.item.createMany(
        {
            data: [
                {
                    title: 'Burrito',
                    description: 'A giant burrito',
                    price: 17000,
                    imageUrl: 'https://www.cocinafacil.lat/_astro/burritos-de-carne.w4b9rDnX_Z1JNsgL.webp'
                },
                {
                    title: '3 tacos',
                    description: 'Traditional mexican tacos',
                    price: 14500,
                    imageUrl: 'https://www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg'
                },
                {
                    title: 'Quesadillas',
                    description: 'Quesadillas with cheese and meat',
                    price: 15800,
                    imageUrl: 'https://mandolina.co/wp-content/uploads/2023/06/quesadilla.png'
                }
            ]
        }
    )
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
