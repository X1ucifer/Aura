const express = require("express");
const app = express();
const cors = require('cors');
const {readdirSync}= require('fs');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');



require('dotenv').config();


//middleware
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());


const port = process.env.port || 8000


readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));


app.listen(port,()=>{
    console.log(`Server is runing on port http://localhost:${port}`)
})