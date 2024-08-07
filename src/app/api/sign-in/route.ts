import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { tree } from "next/dist/build/templates/app-page";

export async function POST(request:Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json();
        const exitingUserVerifiedByUsername = await
        UserModel.findOne({ 
            username,
            isVerified:true,
        })
        if (exitingUserVerifiedByUsername){
            return Response.json(
                {
                    success:false,
                    message: 'User already exists and is verified',
                },
                {
                    status: 400
                }
            )
        }
         const existsUserByEmail = await UserModel.findOne({ email})
         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
         if (existsUserByEmail){
            if(existsUserByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message: 'User already exist with this email'
                    },
                    {
                        status: 400
                    }
                )
            }
            else{
                const hasedPassword = await bcrypt.hash(password,10)
                existsUserByEmail.password=hasedPassword;
                existsUserByEmail.verifyCode=verifyCode;
                existsUserByEmail.verifyCodeExpiry=new Date(Date.now()+ 3600000)
                await existsUserByEmail.save()
            }
        }
        else{
            const hasedPassword = await bcrypt.hash(password,10)
            const expiryDate= new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser=new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage: true,
                messages:[]
            })
            await newUser.save()
        }
        // send verification email
        const emailResponse= await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse){
            return Response.json(
                {
                    success:false,
                    message: 'emailResponse.message'
                },
                {
                    status: 500
                }
            )
        }
        return Response.json(
            { 
                success:true,
                message: 'user registered successfully. Please verify your email',
                
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.error('error registering user', error)
        return Response.json(
            {
                success:false,
                message: 'error registering user',
        
    },
    {
        status: 500
    }
    )
 }
}

