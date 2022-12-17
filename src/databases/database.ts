import {Sequelize} from 'sequelize'

const logging = process.env.ENV === 'PROD' ? false : console.log

if(process.env.ENV == 'LOCAL')
    var sequelize = new Sequelize('sqlite::memory:', {logging})
else
    var sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || '', {logging})
    
export default sequelize;