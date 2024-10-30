export const typeDefs = `
  type Item {
    id: ID
    title: String
    description: String
    price: Float
    imageUrl: String
    orders: [Order!]
  }

  type Table {
    id: ID
    number: Int
    orders: [Order!]
  }

  type Order {
    id: ID
    createdAt: String
    table: Table
    item: Item
    payment: Payment
    status: OrderStatus
  }
  
  enum OrderStatus {
    PENDING
    PREPARING
    READY
    DELIVERED
    PAID
    CANCELLED
   }

  type Payment {
    id: ID
    createdAt: String
    type: PaymentType
    orders: [Order!]!
  }

  enum PaymentType {
    CASH
    CARD
    OTHER
  }

  type Query {
    items: [Item!]!
    getItemById(id: ID!): Item
    tables: [Table!]!
    getTableById(id: ID!): Table
    orders: [Order!]!
    getOrdersByTableId(tableId: ID!): [Order!]
    payments: [Payment!]!
    getPaymentById(id: ID!): Payment
  }

  type Mutation {
    createItem(title: String!, description: String!, price: Float!, imageUrl: String!): Item
    deleteItem(id: ID!): Item
    editItem(id: ID!, title: String, description: String, price: Float, imageUrl: String): Item
    createOrder(tableId: ID!, itemId: ID!, paymentId: ID): Order
    deleteOrder(id: ID!): Order
    setOrderStatus(id: ID!, status: OrderStatus!): Order
    cancelOrder(id: ID!): Order
    createPaymentForOrder(type: PaymentType!, orderId: ID!): Payment
    createPaymentForTable(type: PaymentType!, tableId: ID!): Payment
    deletePayment(id: ID!): Payment
    addTable: Table
    removeTable: Table
  }
`;
