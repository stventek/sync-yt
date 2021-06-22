import http from "http";
import socketio from 'socket.io';
import Room, {RoomDocument} from './model/room';

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

        socket.on('join-room', (username: string | undefined, room: string | undefined, sendStatus: sendStatus | undefined) => {
            if(!(username && room && sendStatus)) return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.joinUser(username);
                socket.join(room);
                sendStatus(1);
                if(roomDocument.player)
                    socket.emit('update', roomDocument.getPlayerInfo())
            }
            else
                sendStatus(0);
        });

        socket.on('play', (room: string, videoId: string) => {
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

        socket.on('pause', (room: string) => {
            if(!room)
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.pauseVid();
                io.to(room).emit('pause-recive');
            }
            else
                socket.disconnect();
        });
        
        socket.on('resume', (room: string) => {
            if(!room)
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument){
                roomDocument.resumeVideo();
                io.to(room).emit('resume-recive', roomDocument.getTimeElapsed());
            }
            else
                socket.disconnect();
        });

        socket.on('seekTo', (room: string, start: number) => {
            console.log(room, start);
            if(!(room && start >= 0))
                return socket.disconnect();
            const roomDocument = Room.findByCode(room);
            if(roomDocument && roomDocument.player){
                roomDocument.seekTo(start);
                io.to(room).emit('seekTo-recive', roomDocument.getTimeElapsed());
            }
            else{
                console.log('disconected');
                socket.disconnect();
            }
        })
    })
};
