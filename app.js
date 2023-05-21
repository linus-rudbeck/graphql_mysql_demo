const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

// graphqlHTTP is a function that takes a schema and returns a middleware
// The middleware is a function that takes a request and returns a response
// The response is a JSON object with the data from the query
// The middleware is used by the express app
// this is how we connect graphql to express
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// start the server
app.listen(8000, () => {
    console.log('http://localhost:8000/graphql');
})
