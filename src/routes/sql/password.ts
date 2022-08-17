import express from "express";
import Utils from "../../services/Utils";
import Password from '../../models/sql/password_manager';
import ValidChangePass from '../../middleware/users/password';

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/change_password").put(ValidChangePass.toPending, async (req, res, next) => {
  const { name, email, password ,new_password} = req.body;
  const {error,message}= await Password.initialize({new_password,email,password}).change();
 if (error) httpResponse(res, message, null, error, codeList().badrequest);
 else httpResponse( res,message,null, error, codeList().success)
});

router.route("/change_password/status/:token").get(async (req, res, next) => {
    const token_=req.params.token;
    const  {error,message,data}=await Password.initialize({token:token_}).verifyStatus();
    if(error)httpResponse(res, message, null, error, codeList().badrequest)
    else httpResponse(res, message, data, error, codeList().success)
  });

router.route("/change_password/verify/:token").get(async (req, res, next) => {
   const token_=req.params.token;
   const  {error,message,data}=await Password.initialize({token:token_}).verifyChange();
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message, data, error, codeList().success)
});



export default router;