import Utils from "../../services/Utils";
const { httpResponse, message, codeList, encryp } = Utils;

export default class ValidChangePass {
  static async toPending(req: any, res: any, next: Function) {
    const {  email, password,new_password } = req.body;
    const {field,wrong}=message(),{badrequest}=codeList();
    if (!new_password || !email || !password)
      return httpResponse(res,field,null,true,badrequest, { fieldsRequired: [ "email", "password","new_password"] }  );
    else {
     const resultPassword = await encryp(new_password);
     if(!resultPassword) return httpResponse(res,wrong,null,true,badrequest );
     req.body.new_password=resultPassword; 
     next();
    }
  }


}