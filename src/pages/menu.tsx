import { gql, useQuery } from '@apollo/client'
import type { Item } from '@prisma/client'

const AllItemsQuery = gql`
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

const Home = ({ users }: any) => {
    const { data, loading, error } = useQuery(AllItemsQuery)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Oh no... {error.message}</p>

    return (
        <div>
            <h1>Home</h1>
            {data.items.map((item: Item) => (
                <div key={item.id}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <p>{item.price}</p>
                    <img src={item.imageUrl} alt={item.title} />
                </div>
            ))}
        </div>
    );
};

export default Home;