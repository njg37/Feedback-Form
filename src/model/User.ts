import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema: Schema = new Schema({
    content: {
        type: String,
        requried: true
    },
    createdAt:{
        type: Date,
        requred:true,
        default:Date.now()
    }

})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode: string,
    verifyCodeExpiry:Date,
    messages:Message[]
} 

