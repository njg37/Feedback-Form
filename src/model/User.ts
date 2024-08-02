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
    isVerified: boolean,
    verifyCodeExpiry:Date,
    isAcceptingMessage: boolean,
    messages:Message[]
} 

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        requried: [true, "username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        requred:[true,"email is required"],
        unique: true,
        match:[/.+\@.+\..+/,'please enter a valid email address']
    },
    password:{
        type: String,
        required:[true,"password is required"]
    },
    verifyCode:{
        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required: [true, "verify code expiry is required"],
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]


})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;


