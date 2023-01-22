const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const {readdirSync} = require('fs');
const preRequestValidation = require('./middleware/preRequestValidation');
require('dotenv').config();

// Applying Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(preRequestValidation);
// Ending Middleware

const port = process.env.PORT;
readdirSync('./routers').map((r)=>app.use("/api",require(`./routers/${r}`)));
app.listen(port,()=>{
    console.log(`Server is runing on port http://localhost:${port}`);
});
