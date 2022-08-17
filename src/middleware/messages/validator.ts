import Utils from '../../services/Utils';
const {codeList,message}=Utils;

export default class ValidMessage{
     
  static  validate(req: any, res: any, next: Function){    
        const {component,email,ratting}=req.body;
        const {field}=message(),{badrequest}=codeList();
        if(!req.body.message||!component||!email||!ratting)return Utils.httpResponse(res,field,null,true,badrequest,["message","component","email","ratting"])
        next()
    }

}