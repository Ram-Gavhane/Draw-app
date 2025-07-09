import * as z from "zod/v4"

export const userSchema = z.object({
    username:z.string().min(3),
    email:z.email(),
    password:z.string().min(4)
})

export const loginSchema = z.object({
    username:z.string().min(3),
    password:z.string().min(4)
})