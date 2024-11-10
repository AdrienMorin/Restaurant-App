import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/utils/graphql/queries/auth";

export default function useMiddleware(): boolean {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { data, loading: queryLoading } = useQuery(ME_QUERY);

    useEffect(() => {
        if (!queryLoading && !data?.me) {
            router.push('/auth/login');
        } else if (!queryLoading && data?.me) {
            setLoading(false);
        }
    }, [data, queryLoading, router]);

    return loading;
}
