import {z} from "zod"

export const verifySchema = z.object({
    code:z.string().length(6,'verifycode must be at least 6 characters long')
})