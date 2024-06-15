import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextRequest,NextResponse} from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/helpers/mailers";

connect()

export async function POST(request:NextRequest){


    try{
      const reqBody=  await request.json();
      const {userName,email,password}:any=reqBody;
      console.log(reqBody);

     const user= await User.findOne({email});
     if(user){
        return NextResponse.json({message:'User Already Exist'},{status:400});
     }
     const salt= await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(password,salt);

   const newUser=  new User({
        userName,
        email,
        password:hashedPassword
     })

    const savedUser= await newUser.save();
    console.log(savedUser);

    // Send Verification Email

    await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})


    return NextResponse.json({message:"User Registered Successfully",success:true,savedUser})






    }catch(error:any){
        return NextResponse.json({error:error.message , status:500})

    }

}