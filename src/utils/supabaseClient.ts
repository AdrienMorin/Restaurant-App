import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseOptions {
    global?: {
        headers: {
            Authorization: string
        }
    }
}

const getSupabase = (access_token?: string): SupabaseClient => {
    const options: SupabaseOptions = {}

    if (access_token) {
        options.global = {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        options
    )

    return supabase
}

export { getSupabase }
