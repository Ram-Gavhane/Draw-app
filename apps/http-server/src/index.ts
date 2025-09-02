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
import cors from "cors";
import { number } from "zod/v4";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async function (req,res){
    const body = req.body;
    const parsedData = userSchema.safeParse(body);
    if(parsedData.success){
        const hashedPassword = await bcrypt.hash(parsedData.data.password,3);
        await client.user.create({
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
                "token": token
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
    const roomName = req.body.slug;
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

app.get("/chats/:roomId", async function (req, res){
     try {
        const roomId = Number(req.params.roomId);
        const messages = await client.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
})

app.post("/join-room", async function(req, res){
    const slug = req.body.slug;

    try{
        const response = await client.room.findFirst({
            where:{
                slug
            }
        })

        if(!response){
            res.json({
                "message":"Canvas doesn't exist",
                "id":null
            });
            return;
        }
        res.json({
            "message":"Canvas created",
            "roomId":response.id
        })
    }catch(e){
        console.log(e);
    }
    
});

app.get("/rooms", async function (req, res) {
    const userId = req.userId;
    const response = await client.room.findMany({
        where:{
            adminId: userId
        }
    })
    
    res.json({
        "rooms": response
    });
})

app.listen(3001);