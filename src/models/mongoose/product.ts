import Iproduct, { P_response } from "../Interfaces/Iproduct";
import Utils from "../../services/Utils";
import { ProductModel } from "./schema/product";
import SessionManageR from '../../services/session/token_manager';
import { ModelImageProduct } from "./schema/product_image";
import { P_response_data } from "../Interfaces/Iproduct";
import mongoose from "mongoose";
import User from "./user";
import mongo from 'mongoose';

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


  public static initialize(payload?:any){
    if(!payload)return new ProductMongo("","",new Date(),0,0,"", 0,"");
    const {product,category,expiryDate,total,quantity,unit, price,image}=payload;
    return new ProductMongo(product||"",category||"",expiryDate||Date,total||0,quantity||0,unit||"", price||0,image||"");
    }
 

  private async insertImage(productId:mongo.Types.ObjectId): Promise<P_response> {
    const { body, files } = this.image, { added, objects, wrong } = Utils.message(), { image_product } = Utils.staticFolders();
    try {
      if (!files || !body) throw new Error("-");
      const { product, alt } = body;
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


  private async getImage(){
    const {notfound,objects}=Utils.message();
    try {      
          return ModelImageProduct.findOne({product:this.product}).then(async(res)=>{
          if(!res){
            return {error:true,message:notfound(objects.image),data:null}
          }
          return {error:false,message:"",data:res.image}
         }) 
    } catch (error) {
      return {error:true,message:error,data:null}
    }

   }



  async insert(token: string): Promise<P_response> {
    const
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
      const user=await User.initialize().validateUser(token),
      productId=new mongoose.Types.ObjectId();
      if(user.error)return { error: true, message:user.message, data: null };
      const  {data,error,message}=(await this.insertImage(productId));
      if(error)return { error: true, message, data: null };
      const Product=new ProductModel({...payload,_id:productId,user:user.id});
      Product.images[0]=data;
      await Product.save()
      return { error: false, message: added(objects.product), data: null };
    } catch (error) {
      return { error: true, message: <string>error, data: null };
    }
  }



  public  async list_expired(token: string): Promise<P_response_data> {
    try {
      const {error,id}=await User.initialize().validateUser(token)
      if(error)return { error: true, message:Utils.message().novalid_credential, data: [] };
      const res:any=(await ProductModel.find({user:id,trash:0})
      .populate(PPImageTporoduct.populate,PPImageTporoduct.fields))
      .filter(doc=>new Date(doc.expiryDate) <= new Date());
      return { error: false, message:"", data:res };
    } catch (error) {
      
      return { error: true, message:<string>error, data:[] };
    }

  }

  public  async list_unexpired(token: string): Promise<P_response_data> {
    try {
      const {error,id}=await User.initialize().validateUser(token)
      if(error)return { error: true, message:Utils.message().novalid_credential, data: [] };
      const res:any=(await ProductModel.find({user:id,trash:0})
      .populate(PPImageTporoduct.populate,PPImageTporoduct.fields))
      .filter(doc=>new Date(doc.expiryDate) > new Date());
      return { error: false, message:"", data:res };
    } catch (error) {
      return { error: true, message:<string>error, data:[] };
    }
  }


   public async setDonation(token:string,productId:any,{donation}:{donation:number}){
    const {not_exist,found,objects,added,enough}=Utils.message();
    try {
         const {error,id}=await User.initialize().validateUser(token)
         if(error)return {error:true,message:not_exist,data:null}
           const res= await  ProductModel.findOne({_id:productId,trash:0});
             if(!res)return  {error:true,message:found,data:null}
             if(res.quantity-(res.donate+res.consumption)>=donation){
             res.donate+=donation;
             await res.save()
             return {error:false,message:added(objects.donation),data:null}
            }else return  {error:true,message:enough,data:null}
        } catch (error) {
          return {error:true,message:<string>error,data:null}
        }

   }

  public  async updateProduct(token:string,productId:any,payload:any){
    const {not_exist,updated,objects,found,enough}=Utils.message();
    try {
      const {error,id}=await User.initialize().validateUser(token)
         if(error)return {error:true,message:not_exist,data:null}
           const res=await  ProductModel.findOne({_id:productId,trash:0})
             if(!res)return {error:true,message:found,data:null}
             if(res.quantity-(res.donate+res.consumption)>=payload.quantity){
              res.consumption+=payload.quantity;
               
              this.product=<string>res.product;
              const  {error,message,data}=await this.getImage();  
              if(error)return  {error:true,message,data:null}
              await res.save()
              return {error:false,message:updated(objects.product),data}
             }else return  {error:true,message:enough,data:null}
    } catch (error) {
      return {error:true,message:error,data:null}
    }
  }

}
