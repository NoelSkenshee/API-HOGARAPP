import Iproduct, { P_response } from "../Interfaces/Iproduct";
import Utils from "../../services/Utils";
import { ProductModel } from "./schema/product";
import SessionManageR from "../../services/session/token_manager";
import { ModelImageProduct } from "./schema/product_image";
import { P_response_data } from "../Interfaces/Iproduct";
import mongoose from "mongoose";
import User from "./user";

const PPImageTporoduct={//Populate 
  populate:"images",
  fields:["image","alt"]
}



export default class ProductMongo implements Iproduct {
  product: string;
  category: string;
  createdAt: Date;
  expiryDate: Date;
  total: number;
  quantity: number;
  unit: string;
  price: number;
  image?: any;
  constructor(
    product: string,
    category: string,
    expiryDate: Date,
    total: number,
    quantity: number,
    unit: string,
    price: number,
    image?: any
  ) {
    this.product = product;
    this.category = category;
    this.createdAt = new Date();
    this.expiryDate = expiryDate;
    this.total = total;
    this.quantity = quantity;
    this.unit = unit;
    this.price = price;
    this.image = image;
  }

  private async insertImage(image: any,productId:any): Promise<P_response> {
    const conn = Utils.getConMONGO(),{ body, files } = image, { added, objects, wrong } = Utils.message(), { image_product } = Utils.staticFolders();
    try {
      if (!files || !body) throw new Error("-");
      const { product, alt } = body;
      await conn.connect();

      return ModelImageProduct.findOne({ product }).then(async (res) => {
        if (res) return { error: false, message: added(objects.image), data: res._id };
        else {
        const  { file, message } = Utils.publicFile( files.image, product, image_product);
          if (!file) return { error: true, message, data: null };
            const {_id}=(await  ModelImageProduct.create({ image: file, alt,product,productId}))
            return { error: false, message: added(objects.image), data: _id };
        }
      }).catch((err)=>({ error: true, message: err, data: null }));
    } catch (error) {
       return { error: true, message: <string>error, data: null };
    }
  }





  async insert(token: string): Promise<P_response> {
    const conn = Utils.getConMONGO(),
      {
        product,
        category,
        createdAt,
        expiryDate,
        total,
        quantity,
        unit,
        price,
        image,
      } = this,
      payload = {
        product,
        category,
        createdAt,
        expiryDate,
        total,
        quantity,
        unit,
        price,
      },
      { added, objects } = Utils.message();
    try {
      await conn.connect();

      const { id,email,name } = await SessionManageR.decodToken(token),
      productId=new mongoose.Types.ObjectId(),
      user=(await User.getUser(id,name,email));
      if(!user.user)return { error: true, message:user.message, data: null };
     const  {data,error,message}=(await this.insertImage(image,productId));
      if(error)return { error: true, message, data: null };
      const Product=new ProductModel({...payload,_id:productId,user:id});
      Product.images[0]=data;
      await Product.save()
      return { error: false, message: added(objects.product), data: null };
    } catch (error) {
      await conn.disconnect();
      return { error: true, message: <string>error, data: null };
    }
  }



  public static async list_expired(token: string): Promise<P_response_data> {
    const conn = Utils.getConMONGO();
    try {
      await conn.connect()
      const { id,email,name } = await SessionManageR.decodToken(token),
      {user}=(await User.getUser(id,name,email));
      if(!user)return { error: true, message:Utils.message().novalid_credential, data: [] };
      const res:any=(await ProductModel.find({user:id}).populate(PPImageTporoduct.populate,PPImageTporoduct.fields)).map((doc)=>{
        if(doc && new Date(doc.expiryDate) < new Date())return doc;
      });
      await conn.disconnect()
      return { error: false, message:"", data:res };
    } catch (error) {
      
      await conn.disconnect()
      return { error: true, message:<string>error, data:[] };
    }

  }

  public static async list_unexpired(token: string): Promise<P_response_data> {
    const conn = Utils.getConMONGO();
    try {
      await conn.connect()
      const { id,email,name } = await SessionManageR.decodToken(token),
      {user}=(await User.getUser(id,name,email));
      if(!user)return { error: true, message:Utils.message().novalid_credential, data: [] };
      const res:any=(await ProductModel.find({user:id}).populate(PPImageTporoduct.populate,PPImageTporoduct.fields)).map((doc)=>{
       if(doc && new Date(doc.expiryDate) > new Date())return doc;
      });
      await conn.disconnect()
      return { error: false, message:"", data:res };
    } catch (error) {
      await conn.disconnect()
      return { error: true, message:<string>error, data:[] };
    }
  }

}
