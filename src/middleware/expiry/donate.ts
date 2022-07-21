import Utils from '../../services/Utils';
const {message,codeList}=Utils;
export default class ValidDonation{
     
  static  validate(req:any,res:any,next:Function){
        const {product, destination, quantity}=req.body;
        const {unit, image,id,expiryDate}=product,{field}=message(),{badrequest}=codeList();
        if((id==undefined)||!quantity||!unit||!image||!expiryDate)return Utils.httpResponse(res,field,null,true,badrequest,["product{ unit, image,id,expiryDate}", "destination","quantity" ])
        if(!destination||!quantity)return Utils.httpResponse(res,field,null,true,badrequest,["product{quantity, unit, image,id}", "destination"])
        next()
    }




}