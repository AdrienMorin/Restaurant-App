import {gql} from "@apollo/client";

export const GET_ITEM_BY_ID = gql`
    query GetItemById($id: ID!) {
        getItemById(id: $id) {
            id
            title
            description
            price
            imageUrl
        }
    }
`;

export const AllItemsQuery = gql`
    query {
        items {
            id
            title
            description
            price
            imageUrl
        }
    }
`

