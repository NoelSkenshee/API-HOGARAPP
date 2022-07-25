import Utils from '../../services/Utils';
const {message,codeList}=Utils;
export default class ValidConsumption{ 
  static  validConsumption(req:any,res:any,next:Function){
        const {product,quantity,productId }=req.body;
        const {field}=message(),{badrequest}=codeList();
        if(product==undefined||!quantity||!productId)return Utils.httpResponse(res,field,null,true,badrequest,["product","quantity","productId"])
        next()
    }
}