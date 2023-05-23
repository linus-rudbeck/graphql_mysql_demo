const graphql = require('graphql')
const { getUsers, 
    getUserById, 
    getPurchases, 
    getPurchaseById, 
    getPurchasesByUserId, 
    addPurchase, 
    updatePurchase 
} = require('./mysql')
const {
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema
} = graphql


// PurchaseType is a type of data that will be returned by a query
// PurchaseType has a field called user that is a UserType
// UserType has a field called purchases that is an array of PurchaseType
// This is an example of how to create a recursive data structure
// A user has purchases, and a purchase has a user
// This is called a one-to-many relationship
const Purchase = new GraphQLObjectType({
    name: 'PurchaseType',
    fields: () => ({
        // purchase_id, product_name, price, purchase_time, user_id
        purchase_id: { type: GraphQLInt },
        product_name: { type: GraphQLString },
        price: { type: GraphQLInt },
        purchase_time: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        user: {
            type: User,
            resolve(parentValue, args) {
                const user_id = parentValue.user_id;
                return getUserById(user_id);
            }
        }
    })
})


// UserType is a type of data that will be returned by a query
// UserType has a field called purchases that is an array of PurchaseType
// PurchaseType has a field called user that is a UserType
// This is an example of how to create a recursive data structure
// A user has purchases, and a purchase has a user
// This is called a one-to-many relationship
const User = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        user_id: { type: GraphQLInt },
        username: { type: GraphQLString },
        user_role: { type: GraphQLString },
        profile_pic_url: { type: GraphQLString },
        purchases: {
            type: new GraphQLList(Purchase),
            resolve(parentValue, args) {
                const user_id = parentValue.user_id;
                return getPurchasesByUserId(user_id);
            }
        }
    })
})


// RootQuery is the entry point into the GraphQL API
// RootQuery has a field called users that is an array of UserType
// RootQuery has a field called user that is a UserType
// RootQuery has a field called purchases that is an array of PurchaseType
// RootQuery has a field called purchase that is a PurchaseType
// This is an example of how to create a recursive data structure
// A user has purchases, and a purchase has a user
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        users: {
            type: new GraphQLList(User),
            resolve(parentValue, args) {
                return getUsers();
            }
        },
        user: {
            type: User,
            args: {
                user_id: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                return getUserById(args.user_id);
            }
        },
        purchases: {
            type: new GraphQLList(Purchase),
            resolve(parentValue, args) {
                return getPurchases();
            }
        },
        purchase: {
            type: Purchase,
            args: {
                purchase_id: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                const purchase = getPurchaseById(args.purchase_id);
                return purchase
            }
        },
    }
})


// mutation is a way to modify data in the database
// mutation has a field called addPurchase that is a PurchaseType
// mutation has a field called updatePurchase that is a PurchaseType
// mutation has a field called deletePurchase that is a PurchaseType
// mutation has a field called addUser that is a UserType
// mutation has a field called updateUser that is a UserType
// mutation has a field called deleteUser that is a UserType
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addPurchase: {
            type: Purchase,
            args: {
                product_name: { type: GraphQLString },
                price: { type: GraphQLInt },
                user_id: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                const { product_name, price, user_id } = args;
                const purchase = {
                    product_name,
                    price,
                    purchase_time: Math.floor(Date.now()/1000),
                    user_id
                };
                return addPurchase(purchase);
            }
        },
        updatePurchase: {
            type: Purchase,
            args: {
                purchase_id: { type: GraphQLInt },
                product_name: { type: GraphQLString },
                price: { type: GraphQLInt },
                user_id: { type: GraphQLInt }
            },
            async resolve(parentValue, args) {
                const { purchase_id, product_name, price, user_id } = args;
                const purchase = await getPurchaseById(purchase_id);

                if (purchase) {
                    purchase.product_name = product_name;
                    purchase.price = price;
                    purchase.user_id = user_id;
                    
                    await updatePurchase(purchase);
                }

                return purchase;
            }
        },
    })
})


// GraphQLSchema is the entry point into the GraphQL API
// GraphQLSchema has a field called query that is a RootQuery
// GraphQLSchema has a field called mutation that is a mutation
// a RootQuery is a way to get data from the database
// a mutation is a way to modify data in the database
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})