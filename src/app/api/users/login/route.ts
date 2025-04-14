import { connectDB } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest , NextResponse } from "next/server";
import bcrypt from 'bcrypt';

connectDB();

export async function POST(request: NextRequest) {
    try {
        
        const reqBody = await request.json()
        const { email, username, password } = reqBody

        console.log('Request body:', reqBody);

        // Check if the user exists
        const user = await User.findOne({ email })

        if(user){
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })


        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);
        

        return NextResponse.json({ 
            message: 'User created successfully',
            success: true,
            savedUser
         });


    } catch (error:any) {
        console.log('Error in login:', error);
        return NextResponse.json({ message: 'Error in login' }, { status: 500 });
    }
}