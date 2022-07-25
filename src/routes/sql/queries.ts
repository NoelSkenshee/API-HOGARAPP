import express from "express";
import Utils from "../../services/Utils";
import ValidConsumption from '../../middleware/consumption/valid_consumtion'
import Queries from '../../models/sql/queries/product';
import Validator from '../../middleware/queries/validator';

const router = express.Router(),
  { httpResponse, codeList } = Utils;



router.route("/queries/remaining/:token").get(Validator.validateRemaining, async (req, res, next) => {
   const {product} = req.query,{token}=req.params;
   const {error,message,data}= await Queries.instance({token,product}).remaining();
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/queries/durationsdays/:token").get(Validator.validateDuration, async (req, res, next) => {
   const {product,expiryDate } = req.query,{token}=req.params;
   const days= await Queries.instance({token,product}).durationDays(new Date(<string>expiryDate));
   httpResponse( res,"",days, false, codeList().success)
});


router.route("/queries/wast/:token").get(Validator.validateWast, async (req, res, next) => {
   const {product,quantity,expiryDate } = req.query,{token}=req.params;
   const {error,message,data}= await Queries.instance({token,product}).wast(parseFloat(<string>quantity),new Date(<string>expiryDate));
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/queries/consumptiondays/:token").get(Validator.validateConumptionD, async (req, res, next) => {
   const {product,quantity } = req.query,{token}=req.params;
   const {error,message,data}= await Queries.instance({token,product}).consumptionDays(parseFloat(<string>quantity));
   if (error) httpResponse(res, message, data, error, codeList().badrequest);
   else httpResponse( res,message,data, error, codeList().success)
});


router.route("/queries/recomendation/:token").get(Validator.validateRecomendation, async (req, res, next) => {
    const {product,expiryDate } = req.query,{token}=req.params;
    const {error,message,data}= await Queries.instance({token,product}).recomendation(new Date(<string>expiryDate));
    if (error) httpResponse(res, message, data, error, codeList().badrequest);
    else httpResponse( res,message,data, error, codeList().success)
 });
 

export const query_route = router;