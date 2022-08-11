import Iconsumption from "../Interfaces/Iconsumption";
import { TresponseConsumtion } from "../types/Tconsume";
import Utils from "../../services/Utils";
import UserMongo from "./user";
import { ModelConsumption } from "./schema/consumtion";
import mongo from "mongoose";
import ProductMongo from "./product";
export default class ConsumptionMONGO implements Iconsumption {
  productId: number|string;
  product:string
  quantity: number;
  date: Date;
  
   constructor(productId: string, quantity: number,product:string) {
    this.date = new Date();
    this.quantity = quantity;
    this.productId = productId;
    this.product=product;
  }

  public static initialize(payload?:any){
    if(!payload)return new ConsumptionMONGO("",0,"")
    const {productId,quantity,product}=payload;
    return new ConsumptionMONGO(productId||"",quantity||0,product||"")
   }


   private async updateConsumption(){
    const {found}=Utils.message();
   const consumption=await ModelConsumption.findOne({date:this.date,product:this.product});
   if(!consumption)return {error:true,message:found,data:null};
    consumption.quantity+=this.quantity;
    consumption.save()
    return {error:false,message:"",data:consumption._id};
   }


  async insert(token: string): Promise<TresponseConsumtion> {
    const { added, objects } = Utils.message(),
      { date, quantity, product } = this;

    try {
      const  user=await UserMongo.initialize().validateUser(token)
      if(user.error)return { error: true, message:user.message, data:[],token:user.token };
      const consumptionId = new mongo.Types.ObjectId();
      const res_update = await ProductMongo.initialize().updateProduct(token, product, { consumption: consumptionId, quantity, });
      const res_up_consumption=await this.updateConsumption()
      if (res_update.error || !res_up_consumption.error)return { error: true, message: <string>res_update.message , data: [] ,token:user.token };
        const consumption = new ModelConsumption({ _id: consumptionId,  date, quantity});
        consumption.user = <any>user.id;
        consumption.image = <any>res_update.data;
        consumption.productId[0] = <any>product;
      await consumption.save();
      return { error: false, message: added(objects.consumtion), data: [] ,token:user.token };
    } catch (error) {
      return { error: true, message: <string>error, data: [],token:null };
    }
  }

  public  async listConsumtion(token: string) {
    const { added, objects } = Utils.message();
    try {
      const { error, id,message } = await UserMongo.initialize().validateUser(token);
      if (error) return { error: true, message, data: [] };
      const res = await ModelConsumption.find({ user:id }).populate(
        "product",
        "product"
      );
      return { error: false, message: "", data: res || [] };
    } catch (error) {
      return { error: true, message: <string>error, data: [] };
    }
  }
}
