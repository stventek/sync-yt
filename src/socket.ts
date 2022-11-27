import http from "http";
import socketio from 'socket.io';
import Room, {RoomDocument} from './models/room';

type sendRoom = (room: string) => void;
type sendStatus = (status: number) => void;

export default (server: http.Server) => {

    const io = new socketio.Server(server, {cors: {origin: '*'}});

    io.on('connection', (socket) => {
        console.log(`socket ${socket.id} connected`);

        socket.on('create-room', (sendRoom: sendRoom | undefined) => {
            if(!sendRoom) return socket.disconnect();
            const room = Math.floor(Math.random() * 10**6).toString();
            Room.create(new RoomDocument(room));
            sendRoom(room);
        });

        socket.on('join-room', (username: string | undefined, room: string | undefined, color: any, sendStatus: sendStatus | undefined) => {
            console.log(!(username && room && sendStatus && color))
            if(!(username && room && sendStatus && color)) return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.joinUser(username, color, socket.id);
                socket.join(room);
                console.log('joining to room', room);
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
            })
        });

        socket.on('leave', (room: string | undefined) => {
            if(!room)
                return;
            console.log(socket.id, ' just left the room ', room);
            const roomDocument = Room.findByCode(room);
            if(roomDocument)
                roomDocument.userLeave(socket.id);
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
