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

  /**
   * Insert  an new user
   * @returns Promise<boolean>
   */
  async insert() {
    const db = await Utils.getConSQL()(),
      { name, email, password } = this,
      query = Utils.getInsertUserP(),
      { added, objects } = Utils.message();
    try {
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
  public static async getUser(id: number,name: string,email: string) {
    const db = await Utils.getConSQL()(),
      query = Utils.getUserP();
    try {
      const res = await db.query(query, [id, email, name]);
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
   *
   * @param token
   * @returns
   */
  public static async verifyUser(token: string) {
    const query = Utils.verifyUserP();
    return SessionManageR.decodToken(token)
      .then(async ({ id, email, name }) => {
        return User.getUser(id,name,email)
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
   *
   * @param password
   * @param email_
   * @returns
   */
  public static async login(passwordIn: string, email_: string) {
    const query = Utils.loginP(),{not_exist,novalid_credential,unverified}=Utils.message();
    try {
      const db = await Utils.getConSQL()(), res = await db.query(query, [email_]);
      if(!res[0][0]) return { error: true, message: not_exist+" or "+unverified, token: null }; 
      const { name, id, email, password,verified } = res[0][0];
      if (!id)  return { error: true, message: not_exist, token: null };
      if(!verified) return { error: true, message: unverified, token: null };
      const validPassword = await Utils.compare(passwordIn, password);
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


  





}
