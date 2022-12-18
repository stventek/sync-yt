import 'dotenv/config'
import sequelize from '../databases/database'
import User from '../models/user.model'
import '../models/room-history.model'
import yargs  from 'yargs/yargs'
import { hideBin } from  'yargs/helpers'

const argv = yargs(hideBin(process.argv)).usage('Create super admin user').options({
    username: { type: 'string', demandOption: true  },
    password: { type: 'string', demandOption: true },
    email: { type: 'string', demandOption: true },
    name: { type: 'string', demandOption: true },
  }).parseSync()

const {username, password, email, name} = argv

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Connection has been established successfully.')
        User.create({username, password, email, name}).then(e => {
            console.log('User created successfully')
        }).catch(e => {
            throw e;
        })
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
connectToDatabase()