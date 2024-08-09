import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/utils/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
    
        if (!token) {
            return NextResponse.json({message: "Token is required"}, {status: 401})
        }
    
        const user = await User.findOne({verifyToken: token, verifyTokenExpires: {$gt: Date.now()}})
    
        if (!user) {
            return NextResponse.json({message: "Invalid token"}, {status: 401})
        }
    
        user.isVarified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpires = undefined;
    
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}