import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { sign ,verify,decode} from "jsonwebtoken";
import Utils from "../Utils";
import User from "../../models/sql/user";

export type userToken={
    id:number, email:string, name:string,verified:boolean
}



export default class SessionManageR extends Utils {
  public static dbConnetionType: "mariaDB" | "mongo" = "mongo";

  constructor() {
    super();
  }

  public static genToken(name: string, id: number, email: string) {
    const { seed, expire } = this.getTokenConfig();
    return sign({ id, email, name }, seed, { expiresIn: expire });
  }

  public static decodToken(token: string) {
    const { seed, expire } = this.getTokenConfig();
    return new Promise<userToken>((resolve,reject)=>{
        verify(token,seed,(error,user)=>{          
            if(error)return reject(error)
            return resolve(<userToken>user)
        })
    })
  }



}
