import http from "http";
import WebSocket from 'ws';

export default (server: http.Server) => {

    const wss = new WebSocket.Server({server});

};
