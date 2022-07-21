import mongo from "mongoose";
const {Schema}=mongo;

export const modelExpiry="Donation";
const ExpirySchema=new Schema({
    user:{
        type:String,
        required:true
    },
    product:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    expiryDate: {
        type:Date,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    unit: {
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true
    },
},{timestamps:true})


export const ExpiryModel=mongo.model(modelExpiry,ExpirySchema)
