import {gql} from "@apollo/client";

export const GET_ALL_TABLES = gql`
query Tables {
    tables {
        id
        number
    }
}
`;