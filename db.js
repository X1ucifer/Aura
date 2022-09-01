const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "aura",
    host: "localhost",
    port: 5432,
    database: "aura" 
})

module.exports = pool;