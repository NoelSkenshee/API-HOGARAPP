import express from "express";
import Utils from "../../services/Utils";
import Expiry from '../../models/sql/expiry';
import ValidDonation from '../../middleware/expiry/donate';
import ValidTrash from '../../middleware/expiry/trash';
const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, codeList } = Utils;

router.route("/expiry/donate/:token").post(ValidDonation.validate, async (req, res, next) => {
  const {product, destination, quantity } = req.body,{token}=req.params;
  const donation = new Expiry(product, destination,quantity );
  const {error,message,data}= await donation.donate(token);
  if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
  else httpResponse( res,<string>message,data, error, codeList().success)
})
.get(async (req, res, next) => {
   const {token}=req.params;
    const {error,message,data} = await Expiry.initialize().listDonations(token)
    if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
    else httpResponse( res,<string>message,data, error, codeList().success)
  })


router.route("/expiry/trash/:token").put(ValidTrash.validate ,async (req, res, next) => {
    const {body } = req,{token}=req.params;
    const {error,message,data} = await Expiry.initialize({product:body}).throw(token)
    if (error) httpResponse(res, <string>message, null, error, codeList().badrequest);
    else httpResponse( res,<string>message,data, error, codeList().success)
});

export const expiry = router;