import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common/config";

export function middleware(req:Request, res:Response, next:NextFunction){
    const token = req.headers.authorization;

    try{
        const decodeData = jwt.verify(token as string, JWT_SECRET);
        if(decodeData){
            req.userId = (decodeData as JwtPayload).userId;
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