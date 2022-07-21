import Iconsumption from "../Interfaces/Iconsumption";
import { TresponseConsumtion } from "../types/Tconsume";
import Utils from "../../services/Utils";
import UserMongo from "./user";
import { ModelConsumption } from "./schema/consumtion";
import mongo from "mongoose";
import ProductMongo from "./product";
export default class ConsumptionMONGO implements Iconsumption {
  product: number;
  quantity: number;
  date: Date;

   constructor(product: number, quantity: number) {
    this.date = new Date();
    this.quantity = quantity;
    this.product = product;
  }

  public static initialize(payload?:any){
    if(!payload)return new ConsumptionMONGO(0,0)
    const {product,quantity}=payload;
    return new ConsumptionMONGO(product||0,quantity||0)
   }

  async insert(token: string): Promise<TresponseConsumtion> {
    const { added, objects } = Utils.message(),
      { date, quantity, product } = this;

    try {
      const { error, id, message } = await UserMongo.initialize().validateUser(token);
      if (error) return { error: true, message, data: [] };
      const consumptionId = new mongo.Types.ObjectId();
      const consumption = new ModelConsumption({
        _id: consumptionId,
        date,
        quantity,
      });
      consumption.user = <any>id;
      const res_update = await ProductMongo.initialize().updateProduct(token, product, {
        consumption: consumptionId,
        quantity,
      });
      if (res_update.error)
        return { error: true, message: <string>res_update.message, data: [] };
      consumption.image = <any>res_update.data;
      consumption.product[0] = <any>product;
      await consumption.save();
      return { error: false, message: added(objects.consumtion), data: [] };
    } catch (error) {
      return { error: true, message: <string>error, data: [] };
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
