import Link from "next/link";
import {PrismaClient} from "@prisma/client";
import safeJsonStringify from 'safe-json-stringify';
import {useUser} from "@auth0/nextjs-auth0/client";


export async function getServerSideProps() {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    return {
        props: {
            users: safeJsonStringify(users),
        },
    };
}

const Home = ({ users }: any) => {
    const { user } = useUser();
    console.log('session', user, users);
    return (
        <div>
            {user ? (
                <div>
                    <p>
                        Welcome {user.name}! <Link href="/api/auth/logout">Logout</Link>
                    </p>
                </div>
            ) : (
                <Link href="/api/auth/login">Login</Link>
            )}
        </div>
    );
};

export default Home;