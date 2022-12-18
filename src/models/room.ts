type Player = {
    videoId: string,
    pause: boolean,
    startDate: Date,
    pauseDate: Date
}

type Message = {
    author: string,
    message: string,
    color: string
}

export class RoomDocument{
    users: {name: string, socketId: string, color: string}[] = [];  
    player?: Player;
    messages: Message[] = [];
    constructor(public room: string){}

    getUser(socketId: string){
        const index = this.users.findIndex(user => user.socketId === socketId);
        if(index !== -1)
            return this.users[index];
    }

    addMessage(message: string, socketId: string){
        const index = this.users.findIndex(user => user.socketId === socketId);
        if(index !== -1){
            this.messages.push({message, author: this.users[index].name, color: this.users[index].color});
            if(this.messages.length > 51)
                this.messages.shift();
        }
    }

    joinUser(name: string, color: string, socketId: string){
        this.users.push({name, socketId, color});
    }

    userLeave(socketId: string){
        const index = this.users.findIndex(user => user.socketId === socketId);
        if(index !== -1)
            this.users.splice(index, 1);
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
