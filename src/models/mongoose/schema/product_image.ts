import mongo from "mongoose";
import { modelPorduct } from "./product";
const { Schema } = mongo;

export const  model_IMG = "_ProductImage_";

const SchemaProductImge = new Schema(
  {

    productId:{
        type: Schema.Types.ObjectId,
        ref: "_Product_",
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

//ModelImageProduct.remove()