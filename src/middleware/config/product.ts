import Utils from '../../services/Utils';
const {codeList,message}=Utils;

export default class ValidProductConfig{
     
  static  validate(req: any, res: any, next: Function){    
        const {notify_before_expired,expired_before_n_month,notify_on_finishing} =req.body;
        const {field}=message(),{badrequest}=codeList();
        if(notify_before_expired==undefined ||expired_before_n_month==undefined||notify_on_finishing==undefined)return Utils.httpResponse(res,field,null,true,badrequest,["notify_before_expired","expired_before_n_month","notify_on_finishing"])
        next()
    }

}