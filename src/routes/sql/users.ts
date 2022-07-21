import express from "express";
import Utils from "../../services/Utils";
import Validuser from "../../middleware/users/validation";
import User from "../../models/sql/user";

const router = express.Router(),
  { httpResponse, message, codeList } = Utils;

router.route("/user").post(Validuser.valiBody, async (req, res, next) => {
  const { name, email, password } = req.body;
  const USER = new User(name, email, password);
 const {error,message}= await USER.insert();
 if (error) httpResponse(res, message, null, error, codeList().badrequest);
 else httpResponse( res,message,null, error, codeList().success)
});

router.route("/verify/:token").get(Validuser.validToVerify, async (req, res, next) => {
   const token_=req.params.token;
   const  {error,message,data}=await User.initialize().verifyUser(token_);
   if(error)httpResponse(res, message, null, error, codeList().badrequest)
   else httpResponse(res, message, data, error, codeList().success)
});

router.route("/login").post(Validuser.validLoginData, async (req, res, next) => {
  const {email,password}=req.body;
  const  {error,message,token}=await  User.initialize({email, password}).login();
  if(error)return httpResponse(res, message, null, error, codeList().badrequest)
  else httpResponse(res, message, token, error, codeList().success)
});

export const user_route = router;
