import Utils from '../../services/Utils';
const {message,codeList}=Utils;
export default class ValidProduct{
     
  static  validProduct(req:any,res:any,next:Function){
        const {product, category, expiryDate,  total,quantity, unit, price}=req.body;
        const {field}=message(),{badrequest}=codeList();
        if(!product||!category||!expiryDate||!total||!quantity||!unit||!price)return Utils.httpResponse(res,field,null,true,badrequest,["product", "category", "expiryDate",  "total","quantity", "unit", "price"])
        next()
    }




}