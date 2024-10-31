import {gql} from "@apollo/client";

export const GET_ORDERS_QUERY = gql`
    query GetOrders {
        orders {
            id
            createdAt
            status
            table {
                id
                number
            }
            item {
                id
                title
                description
                price
                imageUrl
            }
            payment {
                id
                createdAt
                type
            }
        }
    }
`;
