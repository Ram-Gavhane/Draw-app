"use client";
import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import   { Canvas } from "./Canvas";
 "./Canvas";

export default function RoomCanvas({roomId}:{roomId:string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}/?token=${localStorage.getItem('token')}`);
        ws.onopen = ()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join-room",
                roomId
            }))
        }
    },[])


    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
       <Canvas roomId={roomId} socket={socket}></Canvas>
    </div>
}