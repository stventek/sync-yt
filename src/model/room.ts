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

export class RoomDocument{
    users: string[] = [];  
    player?: Player;
    messages: Message[] = [];
    constructor(public room: string){}

    joinUser(user: string){
        const userExists = this.users.find(e => e === user);
        if(userExists)
            return;
        this.users.push(user);
    }

    playNewVid(videoId: string){
        if(this.player){
            this.player.pause = false;
            this.player.startDate = new Date();
            this.player.videoId = videoId;
        }
        else{
            this.player = {
                videoId,
                pause: false,
                startDate: new Date(),
                pauseDate: new Date()
            }
        }
    }

    pauseVid(){
        if(this.player){
            this.player.pause = true;
            this.player.pauseDate = new Date();
        }
    }
    
    resumeVideo(){
        if(this.player){
            this.player.pause = false;
            //current time in millisecs 
            const now = new Date().getTime();
            //how many milliseconds the video has elapsed
            const length = this.player.pauseDate.getTime() - this.player.startDate.getTime();
            const startDate = new Date(now - length); 
            this.player.startDate = startDate;
        }
    }
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
