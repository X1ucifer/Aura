const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "aurateam",
    host: "aura.chuhn0d0ldzx.us-west-2.rds.amazonaws.com",
    port: 5432,
    database: "aura" 
})

module.exports = pool;