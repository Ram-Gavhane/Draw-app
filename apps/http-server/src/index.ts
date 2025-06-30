import express from "express";
import * as z from "zod/v4"
import { userSchema } from "./utils/zodSchema";
import { middleware } from "./middleware/middleware";
import jwt from "jsonwebtoken";


const app = express();
app.use(express.json());

app.post("/api/v1/signup",function (req,res){
    const body = req.body;
    const User =  z.object({
        username:z.string(),
        email:z.email(),
        password:z.string()
    });
    try{
        User.parse(body);
        res.json({
            "message":"Signed Up"
        });
    }catch(err){
        if(err instanceof z.ZodError){
        console.log(err.issues);
        console.log(err);
        }
    }
});

app.post("/api/v1/login",function(req, res){
    const body = req.body;
    const User =  z.object({
        username:z.string(),
        password:z.string()
    });
    const userData = User.safeParse(body);
    if(! userData.success){
        res.send(userData.error);
    }else{
        const token = jwt.sign(userData.data.username, "secret");
        res.json({
            "message":"You are logged in",
            "Token":token
        });
    }

});

app.use(middleware)

app.get("/", function(req, res){
    const name = req.userId;
    res.json({
        "username":name
    });
});

app.listen(3001);