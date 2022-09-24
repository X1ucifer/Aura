const { Pool, Client } = require("pg");
const credentials = {
    user: "postgres",
    host: "aura.chuhn0d0ldzx.us-west-2.rds.amazonaws.com",
    database: "aura",
    password: "aurateam",
    port:5432,
};
exports.pool = new Pool(credentials);
