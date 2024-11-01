// src/hooks/useMiddleware.ts
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import {ME_QUERY} from "@/utils/graphql/queries/auth";

export default function useMiddleware() {
    const router = useRouter();
    try {
        const { data, loading } = useQuery(ME_QUERY);
        useEffect(() => {
            if (!loading && !data?.me) {
                router.push('/auth/login');
            }
        }, [data, loading, router]);
    } catch (e) {
        console.error("Error fetching user data:", e);
        router.push('/auth/login');
    }
}
