import { Request, Response } from 'express'
import Room from '../models/room'
import RoomHistory from '../models/room-history.model';
import sequelize from 'sequelize'

const getGraph = async(fromDate: string, toDate: string, groupBy: string) => {
    console.log(groupBy)
    const col1Alias =  `trunc${groupBy}`;

    const totalCreateResult = await RoomHistory.findAll({where: {action: 'CREATE'},attributes: 
    [
        [sequelize.fn('date_trunc', `${groupBy}`, sequelize.col('createdAt')), col1Alias],
        [sequelize.fn('count', sequelize.col('*')), 'totalCreate']
    ], group: [col1Alias]})

    const totalJoinResult = await RoomHistory.findAll({where: {action: 'JOIN'},attributes: 
    [
        [sequelize.fn('date_trunc', `${groupBy}`, sequelize.col('createdAt')), col1Alias],
        [sequelize.fn('count', sequelize.col('*')), 'totalJoin']
    ], group: [col1Alias]})

    const totalCreate = {
        data: totalCreateResult.map(e => e.get('totalCreate')),
        labels: totalCreateResult.map(e => e.get(col1Alias))
    }
    const totalJoin = {
        data: totalJoinResult.map(e => e.get('totalJoin')),
        labels: totalJoinResult.map(e => e.get(col1Alias))
    }
    return {totalCreate, totalJoin}
}

export const adminController = async (req: Request, res: Response) => {
    return res.json({msg: `Welcome back ${req.user.name}`})
};

export const dashboardController = async (req: Request, res: Response) => {
    const {fromDate, toDate, groupBy}  = req.query as {[key: string]: string}
    const activeRooms = Room.rooms.length
    var activeUsers = 0;
    Room.rooms.forEach(e => {
        activeUsers += e.users.length
    })
    const welcomeMessage = `Welcome back ${req.user.name}`
    const graph = await getGraph(fromDate, toDate, groupBy)
    return res.json({activeRooms, activeUsers, welcomeMessage, graph})
};
