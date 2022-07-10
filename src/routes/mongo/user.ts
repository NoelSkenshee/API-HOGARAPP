import express from "express";
import Utils from "../../services/Utils";
import Validuser from "../../middleware/users/validation";
import User from "../../models/mongoose/user";
 const conn = Utils.getConMONGO();

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/mongo/user").post(Validuser.valiBody, async (req, res, next) => {
  const { name, email, password } = req.body;
  const USER = new User(name, email, password);
  await conn.connect()
 const {error,message}= await USER.insert();
 await conn.disconnect()
 if (error) httpResponse(res, message, null, error, codeList().badrequest);
 else httpResponse( res,message,null, error, codeList().success)
});


router.route("/mongo/verify/:token").get(Validuser.validToVerify, async (req, res, next) => {
   await conn.connect()
  const token_=req.params.token;
   const  {error,message,token}=await User.verifyUser(token_);
   await conn.disconnect()
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message, token, error, codeList().success)
});

router.route("/mongo/login").post(Validuser.validLoginData, async (req, res, next) => {
  const {email,password}=req.body;
  await conn.connect()
  const  {error,message,token}=await User.login(password,email);
  await conn.disconnect()
  if(error)return httpResponse(res, message, null, error, codeList().badrequest)
  else httpResponse(res, message, token, error, codeList().success)
});

export const user_route_mongo = router;