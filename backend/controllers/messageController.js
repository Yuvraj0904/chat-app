import Chat from "../models/Message.js";

export const getMessages=async(req,res)=>{
    try {
       const messages=await Chat.find().sort({createdAt:1}) 
          res.json({
            success: true,
            messages,
          });
    } catch (error) {
        res.json({sucess:false,message:error.message})
    }
}
