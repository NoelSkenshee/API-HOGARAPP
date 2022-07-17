import Utils from '../../services/Utils';
const {message,codeList}=Utils;
export default class ValidConsumption{ 
  static  validConsumption(req:any,res:any,next:Function){
        const {product,quantity }=req.body;
        const {field}=message(),{badrequest}=codeList();
        if(!product||!quantity)return Utils.httpResponse(res,field,null,true,badrequest,["product","quantity"])
        next()
    }
}