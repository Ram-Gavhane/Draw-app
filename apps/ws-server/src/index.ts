import { WebSocket, WebSocketServer } from "ws";
import { userValidation } from "./userValidation";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  userId: string,
  rooms: string[]
}
const users: User[] = [];

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = userValidation(token);

  if(userId==null){
    ws.send("No valid user");
    ws.close();
    return;
  }
  
  users.push({
    ws,
    userId,
    rooms:[]
  })

  ws.on('message', function message(data) {
    let parsedData;
    if(typeof data != "string"){
      parsedData = JSON.parse(data.toString());
    }else{
      parsedData = JSON.parse(data);
    }

    if(parsedData.type == "join-room"){
      const user = users.find(x=> x.ws === ws);
      if(!user){
        ws.send("User doesn't exist");
        return;
      }
      user.rooms.push(parsedData.roomId);
      ws.send("Joined")
    }

    if(parsedData.type == "leave-room"){
      const user = users.find(x=> x.ws === ws);
      if(!user){
        ws.send("User doesn't exist");
        return;
      }
      user.rooms = user.rooms.filter(x => x === parsedData.roomId)
      ws.send("Room left")
    }

    if(parsedData.type == "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      users.forEach(user=>{
        if(user.rooms.includes(roomId) && user.ws != ws){
          user.ws.send(JSON.stringify(message));
        }
      })
    }
  });

});