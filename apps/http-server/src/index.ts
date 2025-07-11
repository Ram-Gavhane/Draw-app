import express from "express";
import { userSchema, loginSchema } from "@repo/common/inputValidation";
import { middleware } from "./middleware/middleware";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config();
import { JWT_SECRET } from "@repo/common/config";
import { client } from "@repo/db/client";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async function (req,res){
    const body = req.body;
    const parsedData = userSchema.safeParse(body);
    if(parsedData.success){
        const hashedPassword = await bcrypt.hash(parsedData.data.password,3);
        const response = await client.user.create({
            data:{
                username: body.username,
                email: body.email,
                password: hashedPassword
            }
        })
    }else{
        res.json({
            "message":"Invalid inputs"
        })
        return;
    }
    res.json({
        "message":"Signed Up"
    });
});

app.post("/api/v1/login",async function(req, res){
    const body = req.body;
    const userData = loginSchema.safeParse(body);
    if(!userData.success){
        res.status(411).json({
            "message":"Invalid Inputs"
        });
    }else{
        const user = await client.user.findFirst({
            where:{
                username: userData.data.username
            }
        })
        if(!user){
            res.json({
                "message":"User with this username doesn't exist"
            });
            return;
        }
        const passCheck = await bcrypt.compare(userData.data.password,user.password)
        if(passCheck){
            const token = jwt.sign({userId:user.id}, JWT_SECRET);
            res.json({
                "message":"You are logged in",
                "Token":token
            });
        }else{
            res.status(411).json({
                "message":"Incorrect Password"
            });
        }
    }
});

app.use(middleware)

app.post("/create-room", async function(req, res){
    const userId = req.userId;
    const roomName = req.body.roomName;
    console.log(userId);
    if(!userId){
        res.json({
            "message":"Login in again and retry"
        })
        return; 
    }
    try{
        const response = await client.room.create({
            data:{
                slug: roomName,
                adminId: userId
            }
        })
        res.json({
        "message":"Room Created",
        "Room ID":response.id
        })
    }catch(e){
        console.log(e);
    }    
});

app.post("/join-room", function(req, res){
    const name = req.userId;
    res.json({
        "username":name
    });
});

app.listen(3001);