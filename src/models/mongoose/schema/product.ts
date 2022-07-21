import mongo from "mongoose";
import { model_IMG } from './product_image';
const {Schema}=mongo;

export const modelPorduct="Product";
const ProductSchema=new Schema({
    user:{
        type:String,
        required:true
    },
    product:{
          type:String,

         },
    
    category: {
        type:String,
        required:true,
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
    },
    price:{
        type:Number,
        required:true,
    },
    donate:{
        type:Number,
        required:true,
        default:0
    },
    consumption:{
        type:Number,
        default:0

    },
    trash:{
        type:Number,
        default:0,
        max:1
    },
    images:[{
        type:Schema.Types.ObjectId,
        ref:"ProductImage"
    }],
    consumptionId:{
        type:mongo.Types.ObjectId,
        ref:"Consumtion"
     }
},{timestamps:true})


export const ProductModel=mongo.model(modelPorduct,ProductSchema)
