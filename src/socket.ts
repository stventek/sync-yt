import http from "http";
import socketio from 'socket.io';
import Room, {RoomDocument} from './models/room';
import RoomHistory from "./models/room-history.model";

type sendRoom = (room: string) => void;
type sendStatus = (status: number) => void;
type sendRes = (stats: number, res: any) => void;
type req = {}

export default (server: http.Server) => {

    const io = new socketio.Server(server, {cors: {origin: '*'}});

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);

        socket.on('userUpdate', (req: any, sendRes: sendRes) => {
            if(req && req.room && req.color && req.username){
                const roomDocument = Room.findByCode(req.room)
                if(roomDocument){
                    const user = roomDocument.getUser(socket.id)
                    if(user){
                        user.color = req.color
                        user.name = req.username
                        return sendRes(200, {})
                    }
                }
            }
            return sendRes(400, {})
        })

        socket.on('create-room', async(sendRoom: sendRoom | undefined) => {
            if(!sendRoom) return socket.disconnect();
            const room = Math.floor(Math.random() * 10**6).toString();
            Room.create(new RoomDocument(room));
            await RoomHistory.create({action: 'CREATE'})
            sendRoom(room);
        });

        socket.on('join-room', async(username: string | undefined, room: string | undefined, color: any, sendStatus: sendStatus | undefined) => {
            if(!(username && room && sendStatus && color)) return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.joinUser(username, color, socket.id);
                socket.join(room);
                console.log('joining to room', room);
                await RoomHistory.create({action: 'JOIN'})
                sendStatus(1);
                if(roomDocument.player)
                    socket.emit('update', roomDocument.getPlayerInfo());
                if(roomDocument.messages.length >= 1)
                    socket.emit('join-chat', roomDocument.messages);
                io.to(room).emit('message-recive', {message: `${username} has joined the room`, author: 'server', color: '#F'})
            }
            else
                sendStatus(0);
        });

        socket.on('play', (room: string | undefined, videoId: string | undefined) => {
            if(!(room && videoId))
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.playNewVid(videoId);
                io.to(room).emit('play-recive', videoId);
            }
            else
                socket.disconnect();
        });

        socket.on('pause', (room: string | undefined) => {
            if(!room)
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument && roomDocument.player){
                roomDocument.pauseVid();
                io.to(room).emit('pause-recive');
            }
            else
                socket.disconnect();
        });
        
        socket.on('resume', (room: string | undefined) => {
            if(!room)
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument && roomDocument.player){
                roomDocument.resumeVideo();
                io.to(room).emit('resume-recive', roomDocument.getTimeElapsed());
            }
            else
                socket.disconnect();
        });

        socket.on('seekTo', (room: string | undefined, start: number | undefined) => {
            if(!(room && start && typeof start === 'number' && start >= 0))
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument && roomDocument.player){
                roomDocument.seekTo(start);
                io.to(room).emit('seekTo-recive', roomDocument.getTimeElapsed());
            }
            else{
                socket.disconnect();
            }
        });

        socket.on('disconnecting', () => {
            console.log('disconnecting', socket.id);
            const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);
            rooms.forEach(room => {
                const roomDocument = Room.findByCode(room);
                if(roomDocument)
                    roomDocument.userLeave(socket.id);
                    if(roomDocument?.users &&  roomDocument.users.length === 0)
                        Room.rooms.splice(Room.rooms.indexOf(roomDocument), 1)
            })
        });

        socket.on('leave', (room: string | undefined) => {
            if(!room)
                return;
            console.log(socket.id, ' just left the room ', room);
            const roomDocument = Room.findByCode(room);
            if(roomDocument)
                roomDocument.userLeave(socket.id);
            console.log(roomDocument?.users.length)
            if(roomDocument?.users &&  roomDocument.users.length === 0)
                Room.rooms.splice(Room.rooms.indexOf(roomDocument), 1)
            socket.leave(room);
        });

        socket.on('message', (room: string | undefined, message: string | undefined) => {
            if(!(room && message)) return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.addMessage(message, socket.id);
                const user = roomDocument.getUser(socket.id)
                io.to(room).emit('message-recive', {message, author: user?.name, color: user?.color})
            }
        })
    })
};
