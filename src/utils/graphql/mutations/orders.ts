import {gql} from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
    mutation CreateOrder($tableId: ID!, $itemId: ID!, $paymentId: ID) {
        createOrder(tableId: $tableId, itemId: $itemId, paymentId: $paymentId) {
            id
            status
            createdAt
        }
    }
`;

export const SET_ORDER_STATUS_MUTATION = gql`
    mutation SetOrderStatus($id: ID!, $status: OrderStatus!) {
        setOrderStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;

export const CANCEL_ORDER_MUTATION = gql`
    mutation CancelOrder($id: ID!) {
        cancelOrder(id: $id) {
            id
            status
        }
    }
`;

