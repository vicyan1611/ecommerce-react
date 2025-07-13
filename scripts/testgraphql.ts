import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3000/api/',
    cache: new InMemoryCache(),
});

client.query({
    query: gql`
        query Categories($limit: Int!) {
            categories(limit: $limit) {
                id
                name
            }
        }
    `
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.error("Error fetching products:", error);
})