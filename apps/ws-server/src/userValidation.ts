import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/config"
 
export  function userValidation(token: string) : string | null {
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