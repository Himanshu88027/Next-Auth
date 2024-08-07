import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/utils/mailer";


connect();

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json()
        console.log(reqBody);
        
        const {username, email, password} = reqBody

        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json({message: "Username is exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPass = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPass
        })

        const savedUser = await newUser.save()
        console.log(savedUser);
        

        //sendmail
        await sendEmail({email, emailType: 'VERIFY', userId: savedUser._id})

        return NextResponse.json({message: "User created successfully", success: true, savedUser}, {status: 201})
        
    } catch (error:any) {
        throw new Error(error.message);
    }
}