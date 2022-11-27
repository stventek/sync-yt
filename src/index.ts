//dependencies
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import webSocket from './socket'
import http from 'http'
import userRouter from './routes/user.router'
import adminRouter from './routes/admin.router'
import sequelize from './databases/database'
import './models/user.model'
import './models/room-history.model'
import errorHandler from './utils/error-handler'

const app = express()
const server = new http.Server(app)

//setup websocket
webSocket(server)

//connect to db
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
connectToDatabase()

//config
app.set('port', process.env.PORT || 5000)
app.set('json spaces', 2)

//middlewares
if(process.env.NODE_ENV !== 'PROD'){
    console.log('dev mode')
    const morgan = require('morgan')
    app.use(morgan('dev'))
}

//parsers 
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//cors
app.use(cors())

//routes
app.use(userRouter)
app.use(adminRouter)

//error handler middleware
app.use(errorHandler);

//start server
server.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`)
});
