import mongo from "mongoose";
const { Schema } = mongo;

export const  model_IMG = "_ProductImage_";

const SchemaProductImge = new Schema(
  {

    productId:{
        type: Schema.Types.ObjectId,
        ref: "_Product_",
      },
      consumptionId:{
        type:mongo.Types.ObjectId,
        ref:"Consumtion"
     },
    image: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



export const ModelImageProduct=mongo.model(model_IMG,SchemaProductImge);
