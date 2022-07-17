import mongo from "mongoose";
import { model_IMG } from './product_image';
const {Schema}=mongo;

export const modelPorduct="_Product_";
const ProductSchema=new Schema({
    user:{
        type:String,
        required:true
    },
    product:{
          type:String,
          max:20
    },
    
    category: {
        type:String,
        required:true,
        max:20
    },
    expiryDate: {
        type:Date,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    },
    quantity: {
        type:Number,
        required:true,
    },
    unit: {
        type:String,
        required:true,
        max:10
    },
    price:{
        type:String,
        required:true,
        max:10
    },
    consumption:{
        type:Number,
        min:1
    },
    images:[{
        type:Schema.Types.ObjectId,
        ref:"_ProductImage_"
    }],
    consumptionId:{
        type:mongo.Types.ObjectId,
        ref:"Consumtion"
     }
},{timestamps:true})


export const ProductModel=mongo.model(modelPorduct,ProductSchema)
