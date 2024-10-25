import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export const getServerSideProps = withPageAuthRequired();

const Home = () => {
    const { user } = useUser();
    return (
        <div>
            {user ? (
                <p>
                    Welcome {user.name}! <Link href="/api/auth/logout">Logout</Link>
                </p>
            ) : (
                <Link href="/api/auth/login">Login</Link>
            )}
        </div>
    );
};

export default Home;