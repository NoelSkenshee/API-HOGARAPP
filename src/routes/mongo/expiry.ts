import express from "express";
import Utils from "../../services/Utils";
import ValidDonation from '../../middleware/expiry/donate';
import ExpiryMONGO from '../../models/mongoose/expiry';
import ValidTrash from '../../middleware/expiry/trash';
const conn = Utils.getConMONGO();

const router = express.Router(),{ httpResponse, codeList } = Utils;

router.route("/mongo/expiry/donate/:token").post(ValidDonation.validate, async (req, res, next) => {
   const {product, destination, quantity } = req.body,{token}=req.params;
   const donation = new ExpiryMONGO(product, destination, quantity);
   await conn.connect()
   const {error,message,data}= await donation.donate(token);
   await conn.disconnect()
   if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
   else httpResponse( res,<string>message,data, error, codeList().success)
})
.get(async (req, res, next) => {
    const {token}=req.params;
    await conn.connect()
    const {error,message,data} = await ExpiryMONGO.initialize().listDonations(token)
    await conn.disconnect()
    if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
    else httpResponse( res,<string>message,data, error, codeList().success)
  })


  router.route("/mongo/expiry/trash/:token").put(ValidTrash.validate,async (req, res, next) => {
     const {body } = req,{token}=req.params;
     await conn.connect()
     const {error,message,data} = await ExpiryMONGO.initialize({product:body}).throw(token)
     await conn.disconnect()
     if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
     else httpResponse(res,<string>message,data, error, codeList().success)
});

export const expiry_mongo = router;