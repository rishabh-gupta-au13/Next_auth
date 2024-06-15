import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailers";
import jwt from 'jsonwebtoken';
import { getDataFromToken } from "@/helpers/getDatFromToken";

connect()



export async function GET(request: NextRequest) {
    try {

        // extract data from token 
      const userId=  await getDataFromToken(request);
     const user= User.findOne({"_id":userId}).select('-password');

     if(!user){
        return NextResponse.json({ error: "Invalid User" }, 
        
        { status: 402 })

     }
        
      return NextResponse.json({ message: "User Found", user });

       
    
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}