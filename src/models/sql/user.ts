import Mail from "../../services/email/sendmail";
import Utils from "../../services/Utils";
import IUser from "../Interfaces/Iuser";
import SessionManageR from "../../services/session/token_manager";
import { userToken } from "../../services/session/token_manager";

export default class User implements IUser {

  name: string;
  email: string;
  password: string;
  verified: boolean;

  /**
   *
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
   if(!payload)return new User("", "","");
     const {name, email, password}=payload;
     return new User(name||"", email||"", password||"");
   }


  /**
   * Insert  an new user
   * @returns Promise<boolean>
   */
  async insert() {
   const
      { name, email, password } = this,
      query = Utils.getInsertUserP(),
      { added, objects } = Utils.message();
    try {
      const db = await Utils.getConSQL()();
      const res = await db.query(query, [name, email, false, password]),
        { id } = res[0][0],
        token = SessionManageR.genToken(name, id, email);
         await Mail.verify_user_mail(name, email, token);
         return { error: false, message: added(objects.user) };
    } catch (error: any) {
      return { error: true, message: error };
    }
  }

  /**
   *
   * @param id
   * @param email
   * @param name
   * @returns
   */
   async getUser(id: number) {
    const db = await Utils.getConSQL()(),
      query = Utils.getUserP();
    try {
      const res = await db.query(query, [id, this.email, this.name]);
      if (!res[0][0])
        return {
          error: true,
          message: Utils.message().not_exist,
          user: <userToken>res[0][0],
        };
      return { error: false, message: "", user: <userToken>res[0][0] };
    } catch (error: any) {
      return { error: true, message: error, user: null };
    }
  }

  /**
   * User.initialize({email, name})
   * @param token
   * @returns
   */
  public async verifyUser(token: string) {
    const query = Utils.verifyUserP();
    return SessionManageR.decodToken(token)
      .then(async ({ id, email, name }) => {
         this.email=email;this.name=name;
        return this.getUser(id)
          .then(async ({ error, user, message }) => {
              
            if (error) return { error: true, message, token: null };
            else
              try {
                if (!user?.verified) {
                  const db = await Utils.getConSQL()();
                  await db.query(query, id);
                  //const token_ = SessionManageR.genToken(name, id, email); //AUTO LOGIN
                  return { error: false, message: "", data:{name,email}};
                } else
                  return {
                    error: true,
                    message: Utils.message().readyVerified,
                    data: "",
                  };
              } catch (error: any) {

                return { error: true, message: error, data: null };
              }
          })
          .catch((err) => ({ error: true, message: err, data: null }));
      })
      .catch((err) => ({ error: true, message: err, data: null }));
  }

  /**
   *User.initialize({email, password})
   * @param password
   * @param email_
   * @returns
   */
  public async login() {
    const query = Utils.loginP(),{not_exist,novalid_credential,unverified}=Utils.message();
    try {      
      const db = await Utils.getConSQL()(), res = await db.query(query, [this.email]);
      if(!res[0][0]) return { error: true, message: not_exist+" or "+unverified, token: null }; 
      const { name, id, email, password,verified } = res[0][0];
      if (!name)  return { error: true, message: not_exist, token: null };
      if(!verified) return { error: true, message: unverified, token: null };
      const validPassword = await Utils.compare(this.password, password);
      if (validPassword) {
        const token = SessionManageR.genToken(name, id, email);
        return { error: false, message: "", token };
      } else
        return {
          error: true,
          message: novalid_credential,
          token: null,
        };
    } catch (error: any) {
      return { error: true, message: error, token: null };
    }
  }

/**
 * 
 * @param token 
 * @returns 
 */
  public  async validateUser(token:string){
    try {
    const {id,name,email}=await SessionManageR.decodToken(token);
     this.email=email;this.name=name;
    const{error,message}= await this.getUser(id);
    return {error,message,id:id==undefined?null:id}
    }
    catch (error) {
      return {error:true,message:error,id:null}
    }
  }

}
