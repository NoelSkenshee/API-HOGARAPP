import Utils from '../../services/Utils';
const {codeList,message}=Utils;

export default class ValidDietConfig{
     
  static  validate(req: any, res: any, next: Function){    
        const {google_calendar,notify_by_mail} =req.body;
        //const {field}=message(),{badrequest}=codeList();
        //if(google_calendar==undefined||notify_by_mail==undefined)return Utils.httpResponse(res,field,null,true,badrequest,["google_calendar","notify_by_mail"])
        next()
    }

}