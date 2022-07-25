import express from "express";
import Utils from "../../services/Utils";
import Consumption from "../../models/sql/consumption";
import ValidConsumption from '../../middleware/consumption/valid_consumtion';
const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/consumption/:token").post(ValidConsumption.validConsumption, async (req, res, next) => {
  const {product,quantity,productId } = req.body,{token}=req.params;
  const {error,message,data}= await Consumption.initialize({product,quantity,productId}).insert(token);
  await conn.disconnect()
  if (error) httpResponse(res, message, null, error, codeList().badrequest);
  else httpResponse( res,message,data, error, codeList().success)
});


router.route("/consumption/:token").get( async (req, res, next) => {
   const token_=req.params.token;
   const  {error,message,data}=await Consumption.initialize().listConsumtion(token_);
   await conn.disconnect()
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message,data, error, codeList().success)
});

export const consumtion_route_sql = router;