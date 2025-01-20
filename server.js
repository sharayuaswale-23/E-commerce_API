require('dotenv').config()
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port,()=>{console.log("App are running on localhost:"+port)});
