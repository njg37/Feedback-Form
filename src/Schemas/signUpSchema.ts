import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'invalid email'}),
    password: z.string().min(6,{message:'password must be at least 6 characters long'})

})