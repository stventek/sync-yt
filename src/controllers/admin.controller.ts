import { Request, Response } from 'express'
import Room from '../models/room'
import RoomHistory from '../models/room-history.model';
import sequelize from 'sequelize'
import { Op }  from 'sequelize'

const getGraph = async(fromDate: string, toDate: string, groupBy: string) => {
    const col1Alias =  `trunc${groupBy}`;

    const totalCreateResult = await RoomHistory.findAll({order:[col1Alias], where: {action: 'CREATE', createdAt: {[Op.gte]: fromDate, [Op.lte]: toDate}}, attributes: 
    [
        [sequelize.fn('date_trunc', `${groupBy}`, sequelize.col('createdAt')), col1Alias],
        [sequelize.fn('count', sequelize.col('*')), 'totalCreate']
    ], group: [col1Alias]})

    const totalJoinResult = await RoomHistory.findAll({order:[col1Alias], where: {action: 'JOIN', createdAt: {[Op.gte]: fromDate, [Op.lte]: toDate}}, attributes: 
    [
        [sequelize.fn('date_trunc', `${groupBy}`, sequelize.col('createdAt')), col1Alias],
        [sequelize.fn('count', sequelize.col('*')), 'totalJoin']
    ], group: [col1Alias]})

    const datasets = []
    const labels = totalCreateResult.map(e => e.get(col1Alias))
    datasets.push({label: 'created', data: totalCreateResult.map(e => e.get('totalCreate'))})
    datasets.push({label: 'joined', data: totalJoinResult.map(e => e.get('totalJoin'))})
    return {labels, datasets}
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
    const totalCreated = await RoomHistory.count({where: {action: 'CREATE'}})
    const totalJoin = await RoomHistory.count({where: {action: 'JOIN'}})
    return res.json({activeRooms, activeUsers, welcomeMessage, totalCreated, totalJoin, graph})
};
