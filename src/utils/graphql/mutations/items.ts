import { gql } from '@apollo/client';

export const CREATE_ITEM_MUTATION = gql`
    mutation CreateItem($title: String!, $description: String!, $imageUrl: String!, $price: Float!) {
        createItem(title: $title, description: $description, imageUrl: $imageUrl, price: $price) {
            id
            title
            description
            price
            imageUrl
        }
    }
`;

export const DELETE_ITEM_MUTATION = gql`
    mutation DeleteItem($id: ID!) {
        deleteItem(id: $id) {
            id
            title
            description
            price
            imageUrl
        }
    }
`;

export const EDIT_ITEM_MUTATION = gql`
    mutation EditItem($id: ID!, $title: String, $description: String, $price: Float, $imageUrl: String) {
        editItem(id: $id, title: $title, description: $description, price: $price, imageUrl: $imageUrl) {
            id
            title
            description
            price
            imageUrl
        }
    }
`;
