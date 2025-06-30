import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req:Request, res:Response, next:NextFunction){
    const token = req.headers.authorization;

    try{
        const decodeData = jwt.verify(token as string, "secret");
        if(decodeData){
            console.log(decodeData)
            req.userId = decodeData as string;
            next();
        }else{
            res.json({
                "message":"You are not logged in"
            });
        }
    }catch(e:any){
        if(e.name ==="TokenExpiredError"){
            res.json({
                message: "Session expired. Login again"
            })
        }else{
            res.json({
                message: "jwt verification error"
            })
        }
    }
};