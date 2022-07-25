import ConnectDB_SQL from './db/connection_db_sql';
import crypto from "bcrypt"
import ConnectDB_MONGO from './db/connection_db_mongo';
import { ReqImage, image } from '../models/types/Tproduct';
export default class Utils{

  private static  connect_mongo= ConnectDB_MONGO;
  private  static SEED:string=process.env.SEED_HOGARAPP||"";
  private  static EXPIRE=process.env.EXPIRE_HOGARAPP||"";
  private static  inset_user_procedure=()=>`call insert_user(?,?,?,?)`;
  private static  getUseR="call get_user(?,?,?)";
  private static  verify_user="call verify_user(?)";
  private static  login="call login(?)";
  private static  insert_p="call insert_product(?,?,?,?,?,?,?,?,?)";
  private static  list_unexpired_p="call list_product_unexpired(?,?)";
  private static  list_expired_p="call list_expired_product(?,?)";
  private static  insert_image="call insert_image(?,?,?)";
  private static  insert_consumtion="call consumption(?,?,?,?)";
  private static  list_consumtion="call list_consumption(?)";
  private static  donate="call donate(?,?,?,?,?,?,?,?,?)";
  private static  list_donations="call list_donations(?)";
  private static  trash="call trash(?,?)";
  private static  product_remaining="call product_remaining(?,?,?)";
  private static  consumption_average="call consumption_average(?,?)";


  private static  welcome_mail_subject=()=>`Bienvenido a HOGARADMIN`;
  private  static welcome_mail_text=(name:string,token:string)=>`<h2>Hola ${name}</h2> 
                                             <div>
                                             <p>
                                             Apreciamos que hayas tomado la desicion de 
                                             registrarte en esta app para disfrutar de los
                                             servicios que ofrecemos.
                                             </p>
                                             <p>
                                              Te invitamos a precionar este link para verificarte
                                             </p>
                                             <a href="http://localhost:9090/verify/${token}">VERIFY</a>
                                          </div>`;

  /**
   * 
   * @returns 
   */                                        
  static getConSQL(){
    return ConnectDB_SQL.instance;
   }

   static getConMONGO(){
    return this.connect_mongo;
   }

   
   static getMialPayload(){
    return {subject:this.welcome_mail_subject,text:this.welcome_mail_text}
   }


 static getTokenConfig(){
    return {expire:this.EXPIRE,seed:this.SEED}
  }

  /**
   * 
   * @returns 
   */
  static getInsertUserP(){
    return this.inset_user_procedure()
   }


  static getUserP(){
    return this.getUseR
  }


  static verifyUserP(){
    return this.verify_user
  }


  static loginP(){
    return this.login
  }

  static insertPP(){
    return this.insert_p
  }

  
   
/**
 * //id,product,destination,date,expiry_date,quantity,unit,image
 * @returns 
 */
  static donateP(){
    return this.donate
  }

  static listDonationsP(){
    return this.list_donations
  }
/**
 * id,product,trash
 * @returns 
 */
  static trashP(){
    return this.trash
  }
/**
 * the query require 3 parameters the product name,the image and the alternativ text
 * This procedure validate if the image are ready exist before insert the image in the DB
 * @returns  string
 */
  static insertImagePP(){
    return this.insert_image
  }

  static listUnExpiredPP(){
    return this.list_unexpired_p
  }

  static listExpiredPP(){
    return this.list_expired_p
  }

  /**
   * `user``product``date``quantity`
   * @returns 
   */
  static insertConsumtionP(){
    return this.insert_consumtion
  }

    /**
   * `user``product``date``quantity`
   * @returns 
   */
     static listConsumtionP(){
      return this.list_consumtion
    }

    static product_remainingP(){
      return this.product_remaining
    } 

    static consumption_averageP(){
      return this.consumption_average
    } 
  static message(){
    return {
        field:"Required field missing",
        objects:{"user":"user","product":"product","image":"image","consumtion":"consumtion","donation":"donation"},
        added:(object_:string)=>`${object_} added succsessfuly`,
        updated:(object_:string)=>`${object_} updated succsessfuly`,
        notfound:(object_:string)=>`${object_} not found succsessfuly`,
        readyVerified:"This user are ready verified",
        unverified:"Unverified user are detected",
       not_exist:"Noexistent user",
       novalid_credential:"Invalid Credentials",
       wrong:"Sory someing was wrong, try again in some minutes",
       enough:"Ther's not enough",
       trash:"In the trash",
       found:"Not found",


    }
  }

 static codeList(){
  return {
    success:200,
    created:201,
    badrequest:400,
    deleted:301,
    nomodified:304,
    server:505
  }
}

static httpResponse(res:any,message:string,data:any,error:boolean,code:number,required?:any){
  res.statusCode=code;
  res.setHeader("Content-Type","application/json")
  res.json({message,data,error,required,code})
 }

static async encryp(password:string){ 
 const salt=crypto.genSaltSync(12),hash=crypto.hashSync(password,salt),res=await Utils.compare(password,hash);
 if(res)return hash
 else return ""
}

static compare(passwordIn:string,passwordStored:string){ 
  return crypto.compare(passwordIn,passwordStored)
 }

static mimeTFiles(){
  return {
   "image/jpeg":"jpeg",
   "image/jpg":"jpg",
   "image/png":"png",
   "image/gif":"gif",
  }
}


static publicFile(image:any,name:string,dir:string):{error:boolean,message:string,file:string|null}{
  if(image){
    const file= <ReqImage>image,extentions=<any>Utils.mimeTFiles();
    ;let ext=<string>extentions[file.mimetype];
    if(!ext)return  {error:true,message:"Invalid file extention" ,file:null};
    ext=name+"."+ext;
    file.mv(`${__dirname}../../public/${dir}/${ext}`)
    return  {error:false,message:"Insertion Success",file:ext};
}else return {error:true,message:"File not detected",file:null}
}

static staticFolders(){
  return {
    image_product:"images/products"

  }
}

}