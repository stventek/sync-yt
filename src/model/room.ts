type Player = {
    videoId: string,
    pause: boolean,
    startDate: Date,
    pauseDate: Date
}

type Message = {
    author: string,
    message: string
}

class RoomDocument{
    player: Player | null = null;
    messages: Message[] = [];
    constructor(public room: string){}
}

class Room{
    rooms: RoomDocument[] = [];
    
    create(room: RoomDocument){
        this.rooms.push(room);
    }

    findByCode(room: string){
        return this.rooms.find(roomDocument => roomDocument.room === room);
    }
}

export default new Room();
