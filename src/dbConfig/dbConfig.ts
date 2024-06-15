import mongoose from "mongoose";


export async function connect(){
    try{

        mongoose.connect(process.env.MONGO_URL!);
        const connection=mongoose.connection
        connection.on('connected',()=>{
            console.log('MongoDb Connected');
        })
        connection.on('error',(err)=>{
            console.log('Mongodb Connection Error,please make sure db is up and running '+err);
            process.exit()
        })
    }catch(error){
        console.log(`Soething Went Wrong Connecting To DB`);
        console.log(error);
    }
}