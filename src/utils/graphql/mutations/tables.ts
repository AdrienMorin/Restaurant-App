import { gql } from '@apollo/client';

export const ADD_TABLE_MUTATION = gql`
    mutation AddTable {
        addTable {
            id
            number
        }
    }
`;

export const REMOVE_TABLE_MUTATION = gql`
    mutation RemoveTable {
        removeTable {
            id
            number
        }
    }
`;