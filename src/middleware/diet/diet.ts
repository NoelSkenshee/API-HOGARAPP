import Utils from '../../services/Utils';
const {message,codeList}=Utils;

export default class Validator{
    static  validateDiet(req:any,res:any,next:Function){
        const {product,quantity,daysTime,initDate,endDate} =req.body;
        const {field}=message(),{badrequest}=codeList();
        if(!product||!quantity||!endDate||daysTime.length<=0||!initDate)return Utils.httpResponse(res,field,null,true,badrequest,["product","quantity","durationDays","initDate","endDate"])
        next()
    }

    static validCountDay(req:any,res:any,next:Function){
        const {id} =req.body;
        const {field}=message(),{badrequest}=codeList();
        if(!id)return Utils.httpResponse(res,field,null,true,badrequest,["id"])
        next()
    }

}