import Utils from '../../services/Utils';
const {message,codeList}=Utils;
export default class ValidTrash{
     
  static  validate(req:any,res:any,next:Function){
        const {id,quantity,unit,image}=req.body;
        const {field}=message(),{badrequest}=codeList();
        if((id==undefined)||!quantity||!unit||!image)return Utils.httpResponse(res,field,null,true,badrequest,["product{quantity, unit, image,id}"])
        next()
    }




}