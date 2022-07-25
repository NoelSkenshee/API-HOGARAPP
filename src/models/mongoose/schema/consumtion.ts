import mongo from "mongoose"
const {Schema}=mongo;

const schemaConsumption="Consumption";
const ConsumptionModel=new Schema({
    product:{
      type:String,
      required:true
    },
    date:{
       type:Date,
       required:true,
       unique:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
     user:{
        type:String,
     },
     productId:[{
        type:mongo.Types.ObjectId,
        ref:"Product"
     }],
     image:{
        type:String,
     }

},{timestamps:true})


export const ModelConsumption=mongo.model(schemaConsumption,ConsumptionModel)