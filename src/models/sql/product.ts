import Iproduct from "../Interfaces/Iproduct";
import { P_response, P_response_data } from "../Interfaces/Iproduct";
import Utils from "../../services/Utils";
import SessionManageR from "../../services/session/token_manager";
import { image } from '../types/Tproduct';
import User from "./user";

export default class Product implements Iproduct {
  product: string;
  category: string;
  createdAt: Date;
  expiryDate: Date;
  total: number;
  quantity: number;
  unit: string;
  price: number;
  image?:any
  constructor(
    product: string,
    category: string,
    expiryDate: Date,
    total: number,
    quantity: number,
    unit: string,
    price: number,
    image?:any
  ) {
    this.product = product;
    this.category = category;
    this.createdAt = new Date();
    this.expiryDate = expiryDate;
    this.total = total;
    this.quantity = quantity;
    this.unit = unit;
    this.price = price;
    this.image=image
  }


  private static async  insertIamge(image_:any){
    const conn = await Utils.getConSQL()(),
    procedure = Utils.insertImagePP();    
    try {
     if(!image_ || !image_.files)return {error:true,message:null,data:null}
     const {alt,product}=image_.body;
     const {error,message,file}=Utils.publicFile(image_.files.image,product,Utils.staticFolders().image_product)     
     if(error)return {error:true,message,data:null}
     const res=await conn.query(procedure,[product,file,alt]);
     return {error:false,message:null,data:res}
    } catch (err) {

     return {error:true,message:err,data:null}
    }
  }

  async insert(token: string): Promise<P_response> {
    const conn = await Utils.getConSQL()(),
      procedure = Utils.insertPP(),
      {
        product,
        category,
        createdAt,
        expiryDate,
        total,
        quantity,
        unit,
        price,
        image
      } = this;
    try { 
         let imageRes:{error:boolean,message:unknown,data:any}|null=null;
        if(image) imageRes=(await Product.insertIamge(image))
        const { id,email,name } = await SessionManageR.decodToken(token),
        {user}=(await User.getUser(id,name,email));
      if(!user)return { error: true, message:Utils.message().novalid_credential, data: null };
      if(imageRes&&imageRes.error)return { error: true, message:<string>imageRes.message, data: null };
        await conn.query(procedure, [id, product, category, createdAt, new Date(expiryDate), total, quantity, unit,price]);
        const {added,objects}=Utils.message();
        return { error: false, message:added(objects.product), data: null };
    } catch (error: any) {      
      return { error: true, message: error, data: null };
    }
  }

  public static async list_expired(token: string): Promise<P_response_data> {
    const conn = await Utils.getConSQL()(),
      procedure = Utils.listExpiredPP();
    try {
      const { id,email,name } = await SessionManageR.decodToken(token),
      {user}=(await User.getUser(id,name,email));
      if(!user)return { error: true, message:Utils.message().novalid_credential, data: [] };
       const  res = await conn.query(procedure, [
          id,
          new Date(),
        ]);
      return { error: false, message: "", data: res[0] };
    } catch (error: any) {
      return { error: false, message: error, data: [] };
    }
  }

  public static async list_unexpired(token: string): Promise<P_response_data> {
    const conn = await Utils.getConSQL()(),
      procedure = Utils.listUnExpiredPP();
    try {
      const { id,email,name } = await SessionManageR.decodToken(token),
      {user}=(await User.getUser(id,name,email));
      if(!user)return { error: true, message:Utils.message().novalid_credential, data: [] };
       const  res = await conn.query(procedure, [
          id,
          new Date(),
        ]);
        return { error: false, message: "", data: res[0] };
    } catch (error: any) {
      return { error: true, message: error, data: [] };
    }
  }
}
