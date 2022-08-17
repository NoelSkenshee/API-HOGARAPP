import express from "express";
import Utils from "../../services/Utils";
import { Message } from '../../models/sql/message';
import ValidMessage from '../../middleware/messages/validator';

const router = express.Router(),
  { httpResponse, codeList } = Utils;



router.route("/message/:token").post(ValidMessage.validate,async (req, res, next) => {
   const {component,email,ratting} = req.body,params=req.params;
   const {error,message,data,token}= await Message.initialize({token:params.token,component,email,message:req.body.message,ratting}).insertMessage();
   if (error) httpResponse(res, message, {data,token}, error, codeList().badrequest);
   else httpResponse(res,message,data, error, codeList().success)
});
export default router

