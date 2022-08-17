import express from "express";
import Utils from '../../../services/Utils';
import ConfigProduct from '../../../models/sql/config/product';
import ValidProductConfig from '../../../middleware/config/product';


const router = express.Router(),
  { httpResponse, codeList } = Utils;

router.route("/product_config/:token").post(ValidProductConfig.validate,async (req, res, next) => {
   const {notify_before_expired,expired_before_n_month,notify_on_finishing} = req.body,params=req.params;
   const {error,message,data,token}= await ConfigProduct.initialize({notify_before_expired,expired_before_n_month,notify_on_finishing,token:params.token}).config();
   if (error) httpResponse(res, message, {data,token}, error, codeList().badrequest);
   else httpResponse(res,message,data, error, codeList().success)
}).get(async (req, res, next) => {
    const params=req.params;
    const {error,message,data,token}= await ConfigProduct.initialize({token:params.token}).getConfig();
    if (error) httpResponse(res, message, {data,token}, error, codeList().badrequest);
    else httpResponse(res,message,data, error, codeList().success)
 })
export default router