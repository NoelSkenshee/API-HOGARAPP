import express from "express";
import Utils from "../../services/Utils";
import Validuser from "../../middleware/users/validation";
import Consumption from "../../models/sql/consumption";
import ValidConsumption from '../../middleware/consumption/valid_consumtion';
const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/consumption/:token").post(ValidConsumption.validConsumption, async (req, res, next) => {
  const {product,quantity } = req.body,{token}=req.params;
  const CONSUMPTION = new Consumption(product,quantity);
  const {error,message,data}= await CONSUMPTION.insert(token);
  await conn.disconnect()
  if (error) httpResponse(res, message, null, error, codeList().badrequest);
  else httpResponse( res,message,data, error, codeList().success)
});


router.route("/consumption/:token").get( async (req, res, next) => {
   const token_=req.params.token;
   const  {error,message,data}=await Consumption.listConsumtion(token_);
   await conn.disconnect()
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message,data, error, codeList().success)
});

export const consumtion_route_sql = router;