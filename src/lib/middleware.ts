import {useUser} from "@auth0/nextjs-auth0/client";
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function useMiddleware () {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/api/auth/login');
        }
    }, [user, isLoading, router]);

}