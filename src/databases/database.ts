import {Sequelize} from 'sequelize'

const logging = process.env.ENV === 'PROD' ? false : console.log

var sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || '', {logging})
    
export default sequelize;