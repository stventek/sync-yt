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
    users: {name: string, socketId: string}[] = [];  
    player?: Player;
    messages: Message[] = [];
    constructor(public room: string){}

    joinUser(name: string, socketId: string){
        this.users.push({name, socketId});
    }

    userLeave(socketId: string){
        const index = this.users.findIndex(user => user.socketId === socketId);
        if(index !== -1)
            this.users.splice(index);
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

    getPlayerInfo(){
        if(this.player){
            const pause = this.player.pause;
            const videoId = this.player.videoId;
            const timeElapsed = this.getTimeElapsed();
            return {videoId, pause, timeElapsed}
        }
    }

    getTimeElapsed(){
        if(this.player){
            if(this.player.pause){
                return (this.player.pauseDate.getTime() - this.player.startDate.getTime());
            }
            else{
                return (new Date().getTime() - this.player.startDate.getTime());
            }
        }
    }

    seekTo(start: number){
        if(this.player){
            this.player.startDate = new Date(new Date().getTime() - start);
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
