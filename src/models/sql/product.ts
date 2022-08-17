import Iproduct from "../Interfaces/Iproduct";
import { P_response, P_response_data } from "../Interfaces/Iproduct";
import Utils from "../../services/Utils";
import User from "./user";
import ConfigProduct from './config/product';

export default class Product  implements Iproduct {
  product: string;
  category: string;
  createdAt: Date;
  expiryDate: Date;
  total: number;
  quantity: number;
  unit: string;
  price: number;
  image?:any

  private constructor(
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


  /**
   * 
   * @param payload ?{product,category,expiryDate,total,quantity,unit, price,image}
   * @returns 
   */
  public static initialize(payload?:any){
    if(!payload)return new Product("","",new Date(),0,0,"", 0,"");
      const {product,category,expiryDate,total,quantity,unit, price,image}=payload;
      return new Product(product||"",category||"",expiryDate||Date,total||0,quantity||0,unit||"", price||0,image||"");
    }
    async  insertIamge(){
    const conn = await Utils.getConSQL()(),
    procedure = Utils.insertImagePP();    
    try {
     let file:any=this.product+".jpeg",alt=this.product;
     if(this.image && this.image.files){
     const {alt,product}=this.image.body;
     file=Utils.publicFile(this.image.files.image,product,Utils.staticFolders().image_product) .file    
     }
     const res=await conn.query(procedure,[this.product,file,alt]);
     return {error:false,message:null,data:res}
    } catch (err) {
     return {error:true,message:<string>err,data:null}
    }
  }

  async insert(token: string): Promise<P_response> {
   const
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
        const conn = await Utils.getConSQL()();
        let imageRes:{error:boolean,message:unknown,data:any}|null=null;
        imageRes=(await this.insertIamge())
        const user=await  User.initialize().validateUser(token);
        if(user.error)return {error:user.error,message:user.message,data:null,token:user.token};
        if(imageRes&&imageRes.error)return { error: true, message:<string>imageRes.message, data: null, token:user.token};
        await conn.query(procedure, [user.id, product, category, createdAt, new Date(expiryDate), total, quantity, unit,price]);
        const {added,objects}=Utils.message();
        return { error: false, message:added(objects.product), data: null,token:user.token };
    } catch (error: any) {
      return { error: true, message: error, data: null ,token:null};
    }
  }

  public  async list_expired(token: string): Promise<P_response_data> {
    const conn = await Utils.getConSQL()(),
      procedure = Utils.listExpiredPP();
    try {
      const user=await  User.initialize().validateUser(token);
      if(user.error)return {error:user.error,message:user.message,data:[],token:user.token};
      const {data}=await ConfigProduct.initialize({token}).getConfig()
      const actualDate=new Date();
      actualDate.setMonth((new Date).getMonth()+data.expired_before_n_month)
      const  res = await conn.query(procedure, [
          user.id,
          actualDate,
        ]);
        return { error: false, message: "", data: res[0] ,token:user.token};
    } catch (error: any) {
      return { error: false, message: error, data: [],token:null };
    }
  }

  public  async list_unexpired(token: string): Promise<P_response_data> {
    const conn = await Utils.getConSQL()(),
      procedure = Utils.listUnExpiredPP();
    try {
      const user=await  User.initialize().validateUser(token);
      if(user.error)return {error:user.error,message:user.message,data:[],token:user.token};
      const {data}=await ConfigProduct.initialize({token}).getConfig()
      const actualDate=new Date();
      actualDate.setMonth((new Date).getMonth()+data.expired_before_n_month)
       const  res = await conn.query(procedure, [
          user.id,
          actualDate,
        ]);        
        return { error: false, message: "", data: res[0] ,token:user.token};
    } catch (error: any) {
      return { error: true, message: error, data: [] ,token:null};
    }
  }
}
