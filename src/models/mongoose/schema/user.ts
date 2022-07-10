import mongo from "mongoose";

const usermodel="User"
const { Schema } = mongo;

const User= new Schema(
  {
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true,
     },
     verified:{
        type:Boolean,
        default:false
     }
  },
  {
  
    timestamps: true,
  }
);
export const userModel=mongo.model(usermodel,User)
