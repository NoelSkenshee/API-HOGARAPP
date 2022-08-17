import express from "express";
import Utils from '../../../services/Utils';
import ConfigDiet from '../../../models/sql/config/diet';
import ValidDietConfig from '../../../middleware/config/diet';


const router = express.Router(),
  { httpResponse, codeList } = Utils;

router.route("/diet_config/:token").post(ValidDietConfig.validate,async (req, res, next) => {
   const {google_calendar,notify_by_mail} = req.body,params=req.params;
   const {error,message,data,token}= await ConfigDiet.initialize({google_calendar,notify_by_mail,token:params.token}).config();
   if (error) httpResponse(res, message, {data,token}, error, codeList().badrequest);
   else httpResponse(res,message,data, error, codeList().success)
}).get(async (req, res, next) => {
    const params=req.params;
    const {error,message,data,token}= await ConfigDiet.initialize({token:params.token}).getConfig();
    if (error) httpResponse(res, message, {data,token}, error, codeList().badrequest);
    else httpResponse(res,message,data, error, codeList().success)
 })
export default router