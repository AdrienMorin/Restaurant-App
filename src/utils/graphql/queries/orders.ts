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

export const GET_ORDERS_BY_TABLE_ID = gql`
    query GetOrdersByTableId($tableId: ID!) {
        getOrdersByTableId(tableId: $tableId) {
            id
            createdAt
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
            status
        }
    }
`;

