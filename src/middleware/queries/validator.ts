import Utils from '../../services/Utils';
const {message,codeList}=Utils;

export default class Validator{

    static validateRemaining(req:any,res:any,next:Function){
        const {product}=req.query;
        const {field}=message(),{badrequest}=codeList();
        if(!product)return Utils.httpResponse(res,field,null,true,badrequest,["product"])
        next()
       }
    

  static validateWast(req:any,res:any,next:Function){
    const {product,quantity,expiryDate}=req.query;
    const {field}=message(),{badrequest}=codeList();
    if(!product||!expiryDate||!quantity)return Utils.httpResponse(res,field,null,true,badrequest,["product","quantity","expiryDate"])
    next()
   }


   static validateDuration(req:any,res:any,next:Function){
    const {product,expiryDate}=req.query;
    const {field}=message(),{badrequest}=codeList();
    if(!product||!expiryDate)return Utils.httpResponse(res,field,null,true,badrequest,["product","expiryDate"])
    next()
   }

   static validateConumptionD(req:any,res:any,next:Function){
    const {product,quantity}=req.query;
    const {field}=message(),{badrequest}=codeList();
    if(!product||!quantity)return Utils.httpResponse(res,field,null,true,badrequest,["product","quantity"])
    next()
   }



   static validateRecomendation(req:any,res:any,next:Function){
    const {product,expiryDate}=req.query;
    const {field}=message(),{badrequest}=codeList();
    if(!product||!expiryDate)return Utils.httpResponse(res,field,null,true,badrequest,["product","expiryDate"])
    next()
   }

}