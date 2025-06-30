import * as z from "zod/v4";

export const userSchema = z.object({
    username:z.string(),
    email:z.email(),
    password:z.string()
});