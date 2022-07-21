import IUser from "../Interfaces/Iuser";
import Utils from "../../services/Utils";
import { userModel } from "./schema/user";
import SessionManageR from "../../services/session/token_manager";
import Mail from "../../services/email/sendmail";

export default class UserMongo implements IUser {
  name: string;
  email: string;
  password: string;
  verified: boolean;

  /**
   * @param name
   * @param email
   * @param password
   */
  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.verified = false;
  }

  public static initialize(payload?:any){
    if(!payload)return new UserMongo("", "","");
      const {name, email, password}=payload;
      return new UserMongo(name||"", email||"", password||"");
    }
 


  /**
   *
   * @returns
   */
  insert(): Promise<{ error: boolean; message: string }> {
    const { name, email, password } = this;
    const { added, objects } = Utils.message();
    return userModel
      .create({ name, email, password })
      .then(async (res) => {
        const token = SessionManageR.genToken(name, res.id, email);
        await Mail.verify_user_mail(name, email, token);
        return { error: false, message: added(objects.user) };
      })
      .catch((err) => ({ error: true, message: err }));
  }

  /**
   *
   * @param id
   * @param name
   * @param email_
   * @returns
   */

  public  getUser(id: number) {
    const { not_exist } = Utils.message();
    return userModel
      .findOne({ _id: id, name:this.name, email: this.email })
      .then((data) => {
      if (!data) return { error: true, message: not_exist, user: null };
        const { id, name, email, verified } = data;
        return {
          error: false,
          message: null||"",
         user: { id, name, email, verified },
        };
      })
    .catch((err) =>{
     return { error: true, message:<string>err, user: null }
    });
  }


  /**
   *
   * @param token
   * @returns
   */
  public verifyUser(token: string) {
    const { not_exist, readyVerified } = Utils.message();
    return SessionManageR.decodToken(token)
      .then(async ({ id, name, email }) => {
        this.name=name;this.email=email;
        const { error, message, user } = await this.getUser(id);
        if (error) return { error: true, message, token: null };
        if (user?.verified)
          return { error: true, message: readyVerified, token: null };
        return userModel
          .findByIdAndUpdate(id, { verified: true })
          .then((data) => {
            if (!data) return { error: true, message: not_exist, token: null };
            const { name, id, email } = data,
              token = SessionManageR.genToken(name, id, email);
            return { error: false, message: "", token };
          })
          .catch((err) => ({ error: true, message: err, token: null }));
      })
      .catch((err) => ({ error: true, message: err, token: null }));
  }




  /**
   *
   * @param passwordIn
   * @param email
   * into initialize
   * @returns
   */
   login() {
    const { not_exist, unverified, novalid_credential } = Utils.message();
    return userModel
      .findOne({ email:this.email })
      .then(async (data) => {
        if (!data) return { error: true, message: not_exist, token: null };
        const { email, password, id, verified, name } = data;
        if (!verified) return { error: true, message: unverified, token: null };
        const validpassword = await Utils.compare(this.password, password);
        if (!validpassword)
          return { error: true, message: novalid_credential, token: null };
        const token = SessionManageR.genToken(name, id, email);
        return { error: false, message: "", token };
      })
      .catch((err) => ({ error: true, message: err, token: null }));
  }




    async validateUser(token:string){
    try {
    const {id,name,email}=await SessionManageR.decodToken(token);
    this.name=name;this.email=email;
   const {error,message}= await this.getUser(id);
    return {error,message,id:id||null}
    }
    catch (error) {
      return {error:true,message:<string>error,id:null}
    }
  }
}
