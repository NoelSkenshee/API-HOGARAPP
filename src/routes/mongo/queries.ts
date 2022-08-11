import express from "express";
import Utils from "../../services/Utils";
import QueriesMONGO from '../../models/mongoose/queries/product';
import Validator from "../../middleware/queries/validator";
 const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;



router.route("/mongo/queries/reamaining/:token").get(Validator.validateRemaining, async (req, res, next) => {
   const {product} = req.body,{token}=req.params;
   await conn.connect()
   const {error,message,data}= await QueriesMONGO.instance({token,product}).remaining();
   await conn.disconnect()
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/mongo/queries/durationsdays/:token").get(Validator.validateDuration, async (req, res, next) => {
   const {product,expiryDate } = req.body,{token}=req.params;
   await conn.connect()
   const days= await QueriesMONGO.instance({token,product}).diferenceDate(new Date(),expiryDate);
   await conn.disconnect()
   httpResponse( res,"",days, false, codeList().success)
});


router.route("/mongo/queries/wast/:token").get(Validator.validateWast, async (req, res, next) => {
   const {product,quantity,expiryDate } = req.body,{token}=req.params;
   await conn.connect()
   const {error,message,data}= await QueriesMONGO.instance({token,product}).wast(quantity,expiryDate);
   await conn.disconnect()
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});



router.route("/mongo/queries/consumptiondays/:token").get(Validator.validateConumptionD, async (req, res, next) => {
   const {product,quantity} = req.body,{token}=req.params;
   await conn.connect()
   const {error,message,data}= await QueriesMONGO.instance({token,product}).consumptionDays(quantity);
   await conn.disconnect()
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/mongo/queries/recomendation/:token").get(Validator.validateConumptionD, async (req, res, next) => {
   const {product,expiryDate } = req.query,{token}=req.params;
   const {error,message,data}= await QueriesMONGO.instance({token,product}).recomendation(new Date(<string>expiryDate));
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});

export const query_route_mongo = router;