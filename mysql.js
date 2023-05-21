const mysql = require('mysql')

// getDb returns a connection to the database
// getDb is used by all the functions below
const getDb = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'multitier_shop'
    })

    connection.connect()

    return connection;
}

// dbQueryCallback is a helper function that is used by all the functions below
// dbQueryCallback is a callback function that is passed to the db.query function
// dbQueryCallback is called when the db.query function is finished
// dbQueryCallback calls resolve or reject depending on whether there was an error
// dbQueryCallback also converts the result into a single object if single is true
// this is because the result of db.query is always an array
const dbQueryCallback = (resolve, reject, single = false) => (err, result) => {
    if (err) {
        reject(err)
    }

    if(single && result.length > 0) {
        result = result[0]
    }
    else if(single && result.length === 0) {
        result = null
    }

    resolve(result)
}

// getUsers returns all the users in the database
// getUsers returns a promise that resolves to an array of users
// getUsers is used by the RootQuery and accessible with graphql
module.exports.getUsers = async () => {
    const db = getDb()

    const users = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users', dbQueryCallback(resolve, reject));
    });

    return users
}

// getUserById returns a user with the given id
// getUserById returns a promise that resolves to a single user
// getUserById is used by the RootQuery and accessible with graphql
module.exports.getUserById = async (id) => {
    const db = getDb()

    const user = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE user_id = ${id}`,dbQueryCallback(resolve, reject, true))
    });

    return user
}

// getPurchases returns all the purchases in the database
// getPurchases returns a promise that resolves to an array of purchases
// getPurchases is used by the RootQuery and accessible with graphql
module.exports.getPurchases = async () => {
    const db = getDb()

    const purchases = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM purchases', dbQueryCallback(resolve, reject));
    });

    return purchases
}

// getPurchaseById returns a purchase with the given id
// getPurchaseById returns a promise that resolves to a single purchase
// getPurchaseById is used by the RootQuery and accessible with graphql
module.exports.getPurchasesByUserId = async (userId) => {
    const db = getDb()

    const purchases = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM purchases WHERE user_id = ${userId}`, dbQueryCallback(resolve, reject));
    });

    return purchases
}

// getPurchaseById returns a purchase with the given id
// getPurchaseById returns a promise that resolves to a single purchase
// getPurchaseById is used by the RootQuery and accessible with graphql
module.exports.getPurchaseById = async (id) => {
    const db = getDb()

    const user = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM purchases WHERE purchase_id = ${id}`,dbQueryCallback(resolve, reject, true))
    });

    return user
}

// addPurchase adds a purchase to the database
// addPurchase returns a promise that resolves to the result of the insert query
// addPurchase is used by the RootQuery and accessible with graphql
module.exports.addPurchase = async (purchase) => {
    const db = getDb()

    const result = await new Promise((resolve, reject) => {
        db.query(`INSERT INTO purchases SET ?`, purchase, dbQueryCallback(resolve, reject))
    });

    return result
}

// updatePurchase updates a purchase in the database
// updatePurchase returns a promise that resolves to the result of the update query
// updatePurchase is used by the RootQuery and accessible with graphql
module.exports.updatePurchase = async (purchase) => {
    const db = getDb()

    const result = await new Promise((resolve, reject) => {
        db.query(`UPDATE purchases SET ? WHERE purchase_id = ${purchase.purchase_id}`, purchase, dbQueryCallback(resolve, reject))
    });

    return result
}
