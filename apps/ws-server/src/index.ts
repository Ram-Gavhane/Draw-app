import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/config"
 
const wss = new WebSocketServer({ port: 8080 });

function userValidation(token: string) : string | null {
  try {
    const decode = jwt.verify(token, JWT_SECRET);
    if(typeof decode == "string"){
      return null;
    }
    if(!decode || !decode.userId){
      return null;
    }
    return decode.userId;
  }catch(e){
    console.log(e);
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  console.log(token);
  const userId = userValidation(token);
  if(userId==null){
    ws.send("No valid user");
    ws.close();
    return;
  }
  console.log(token);
  ws.on('message', function message(data) {
    ws.send(userId);
  });

});