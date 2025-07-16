import axios from "axios";
import { BACKEND_URL } from "../config";

type Shape = {
    type:"rect";
    x:number;
    y:number;
    width:number;
    height:number;
} | {
    type:"circle";
    centerX:number;
    centerY:number;
    radius:number;
}

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){
    
            const ctx = canvas.getContext("2d");

            if(!ctx){
                return;
            }
            let existingShape : Shape[] = await getExistingShapes(roomId);

            socket.onmessage = (event)=>{
                const message = JSON.parse(event.data);
                console.log(message);
                if(message.type == "chat"){
                    const parsedShape = JSON.parse(message.message)
                    console.log(parsedShape);
                    existingShape.push(parsedShape);
                    clearCanvas(existingShape, canvas);
                }
            }

            clearCanvas(existingShape, canvas);
            let clicked = false;
            let startX = 0;
            let startY =0;

            canvas.addEventListener("mousedown", (e)=>{
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            });

            canvas.addEventListener("mouseup", (e)=>{
                clicked = false;
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                const shape : Shape = {
                    type:"rect",
                    x:startX,
                    y:startY,
                    width,
                    height
                }
                existingShape.push(shape);
                const message = JSON.stringify(shape);
                const socketMessage =JSON.stringify({
                    type:"chat", 
                    roomId,
                    message
                }) ;
                socket.send(socketMessage);
            });

            canvas.addEventListener("mousemove", (e)=>{
                if(clicked){
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    clearCanvas(existingShape, canvas);
                    ctx.strokeStyle = "rgb(255,255,255)";
                    ctx.strokeRect(startX, startY, width, height);
                }
            });
}

function clearCanvas(existingShape:Shape[], canvas: HTMLCanvasElement){
    const ctx = canvas.getContext("2d");
    if(!ctx){
        return;
    }
    ctx. clearRect(0, 0, canvas.width, canvas.height);
    ctx. fillRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape)=>{

        if(shape.type== "rect"){
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }

    })
    
}

async function getExistingShapes(roomId:string){
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`, {headers:{
        Authorization:localStorage.getItem('token')
    }});
    const messages = Array.isArray(res.data.messages) ? res.data.messages : [];
    // console.log(messages);
    const shapes = messages.map((x:{message:string})=>{
        const messageData = JSON.parse(x.message);
        return messageData;
    })
    return shapes;
}