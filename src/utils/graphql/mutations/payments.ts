import { gql } from '@apollo/client';

export const CREATE_PAYMENT_FOR_TABLE_MUTATION = gql`
    mutation CreatePaymentForTable($type: PaymentType!, $tableId: ID!) {
        createPaymentForTable(type: $type, tableId: $tableId) {
            id
            createdAt
            type
        }
    }
`;

export const CREATE_PAYMENT_FOR_ORDER_MUTATION = gql`
    mutation CreatePaymentForOrder($type: PaymentType!, $orderId: ID!) {
        createPaymentForOrder(type: $type, orderId: $orderId) {
            id
            createdAt
            type
        }
    }
`;