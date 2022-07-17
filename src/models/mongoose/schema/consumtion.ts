import mongo from "mongoose"
const {Schema}=mongo;

const schemaConsumption="Consumption";
const ConsumptionModel=new Schema({
    date:{
       type:Date,
       required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
     user:{
        type:String,
     },
     product:[{
        type:mongo.Types.ObjectId,
        ref:"_Product_"
     }],
     image:{
        type:String,
     }

},{timestamps:true})


export const ModelConsumption=mongo.model(schemaConsumption,ConsumptionModel)