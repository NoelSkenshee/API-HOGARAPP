import express from "express";
import Utils from "../../services/Utils";
import ConsumptionMONGO from '../../models/mongoose/consumtions';
import ValidConsumption from '../../middleware/consumption/valid_consumtion';
import { Connection } from 'mariadb';
 const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/mongo/consumption/:token").post(ValidConsumption.validConsumption, async (req, res, next) => {
   const {product,quantity } = req.body,{token}=req.params;
   const CONSUMPTION = new ConsumptionMONGO(product,quantity);
   await conn.connect()
   const {error,message,data}= await CONSUMPTION.insert(token);
   await conn.disconnect()
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/mongo/consumption/:token").get(async (req, res, next) => {
   const token_=req.params.token;
   await conn.connect()
   const  {error,message,data}=await ConsumptionMONGO.initialize().listConsumtion(token_);
   await conn.disconnect()
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message,data, error, codeList().success)
});

export const consumtion_route_mongo = router;