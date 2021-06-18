type Player = {
    videoId: string,
    pause: boolean,
    startDate: Date,
    pauseDate: Date
}

type Message = {
    user: string,
    message: string
}

class RoomDocument{
    users: string[] = [];  
    player?: Player;
    messages: Message[] = [];
    constructor(public room: number){}
}

class Room{
    rooms: RoomDocument[] = [];
    
    create(room: RoomDocument){
        this.rooms.push(room);
    }

    findByCode(room: number){
        return this.rooms.find(roomDocument => roomDocument.room === room);
    }
}

export default new Room();
