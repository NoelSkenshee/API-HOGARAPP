import express from "express";
import Utils from "../../services/Utils";
import Diet from '../../models/sql/diet';
import Validator from "../../middleware/diet/diet";

const router = express.Router(),
  { httpResponse, codeList } = Utils;

router.route("/diet/:token").post(Validator.validateDiet, async (req:any, res:any, next) => {
  const {product,quantity,daysTime,initDate,endDate} = req.body,{token}=req.params;
  const donation =  Diet.initialize({product,quantity,daysTime,image:req.files?req:null,initDate,endDate,token});
  const {error,message,data}= await donation.createDiet();
  if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
  else httpResponse( res,<string>message,data, error, codeList().success)
})


.get(async (req, res, next) => {
   const {token}=req.params;
    const {error,message,data} = await Diet.initialize({token}).listDiets()
    if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
    else httpResponse( res,<string>message,data, error, codeList().success)
  })


router.route("/diet/:token").put(Validator.validCountDay ,async (req, res, next) => {
    const {id,countDay}= req.body,{token}=req.params;
    const {error,message,data} = await Diet.initialize({token,id,countDay}).incrementCountDay()
    if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
    else httpResponse( res,<string>message,data, error, codeList().success)
});

export const diet = router;