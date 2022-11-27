//dependencies
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import webSocket from './socket';
import http from 'http';
import testRoute from './routes/test.route';

const app = express();
const server = new http.Server(app);
webSocket(server);

//config
app.set('port', process.env.PORT || 5000);
app.set('json spaces', 2);

//middlewares
if(process.env.NODE_ENV !== 'production'){
    console.log('dev mode');
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

//parsers 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cors
app.use(cors());

//routes
app.use(testRoute)

//start server
server.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
});
