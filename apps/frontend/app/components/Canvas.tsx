import { useEffect, useRef } from "react";
import initDraw from "../draw";

export default function Canvas({roomId, socket}:{roomId:string, socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    console.log(roomId);
        useEffect(()=>{
            if(canvasRef.current){
                const canvas = canvasRef.current;
                initDraw(canvas, roomId, socket);
            }
        },[canvasRef])
    
        return <div>
            <canvas ref={canvasRef} width={1440} height={800} ></canvas>
        </div>
}