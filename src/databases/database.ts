import {Sequelize} from 'sequelize'

const logging = process.env.ENV === 'PROD' ? false : console.log
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || '', {logging})

export default sequelize;