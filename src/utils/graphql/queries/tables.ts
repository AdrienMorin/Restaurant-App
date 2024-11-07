import {gql} from "@apollo/client";

export const GET_ALL_TABLES = gql`
query Tables {
    tables {
        id
        number
    }
}
`;

export const GET_TABLE_BY_ID = gql`
    query GetTableById($id: ID!) {
        getTableById(id: $id) {
            id
            number
            orders {
                id
                createdAt
                status
                item {
                    id
                    title
                    description
                    price
                    imageUrl
                }
            }
        }
    }
`;