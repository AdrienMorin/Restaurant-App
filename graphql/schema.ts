export const typeDefs = `
  type Item {
    id: ID
    title: String
    description: String
    price: Float
    imageUrl: String
  }
  
  type Query {
    items: [Item!]!
  }
`
