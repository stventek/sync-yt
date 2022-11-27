import { DataTypes} from 'sequelize'
import sequelize from '../databases/database'

const RoomHistory = sequelize.define('RoomHistory', {
    action: {
        type: DataTypes.STRING,
        allowNull: false
    }
    }, {updatedAt: false});

export default RoomHistory;