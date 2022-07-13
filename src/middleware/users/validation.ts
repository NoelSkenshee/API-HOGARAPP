import Utils from "../../services/Utils";
const { httpResponse, message, codeList, encryp } = Utils;

export default class Validuser {
  static async valiBody(req: any, res: any, next: Function) {
    const { name, email, password } = req.body;
    const {field,wrong}=message(),{badrequest}=codeList();
    if (!name || !email || !password)
      return httpResponse(res,field,null,true,badrequest, { fieldsRequired: ["name", "email", "password"] }  );
    else {
     const resultPassword = await encryp(password);
     if(!resultPassword) return httpResponse(res,wrong,null,true,badrequest );
     req.body.password=resultPassword; 
     next();
    }
  }

 static validToVerify(req:any,res:any,next:Function){
    const {field}=message(),{badrequest}=codeList();
     if(req.params.token)next();
     else return httpResponse( res,field, null,  true,badrequest, { fieldsRequired: ["token"] }
    );
  }

  static validLoginData(req:any,res:any,next:Function){
    const { email, password } = req.body;
    const {field}=message(),{badrequest}=codeList();
    if ( !email || !password)  return httpResponse(res,field,null,true,badrequest, { fieldsRequired: ["email", "password"] }  );
    next()
  }




}
