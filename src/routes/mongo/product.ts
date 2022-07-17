import { Router } from "express";
import Utils from "../../services/Utils";
import ValidProduct from "../../middleware/product/valid_product";
import ProductMongo from '../../models/mongoose/product';
const conn = Utils.getConMONGO();

const route = Router();


route
  .route("/mongo/product/:token")
  .post(ValidProduct.validProduct, async (req, res, next) => {
    const { product, category, expiryDate, total, quantity, unit, price, alt }=
        req.body,
      { token } = req.params,
      producto = new ProductMongo(product,category, expiryDate,total,quantity,unit,price,req.files?req:null);
    try {
       await conn.connect()
      const { message, data, error } = await producto.insert(token);
      await conn.disconnect()
      if(!error)Utils.httpResponse(res, message, data, error, Utils.codeList().success);
      else Utils.httpResponse(res, message, null, true, Utils.codeList().badrequest);
    } catch (err: any) {
      Utils.httpResponse(res, err, null, true, Utils.codeList().badrequest);
    }
  });


  route
.route("/mongo/product/:token")
.get(async (req, res, next) => {
  const { token } = req.params;
  try {
    await conn.connect()
    const { message, data, error } = await ProductMongo.list_unexpired(token);
    await conn.disconnect()
    Utils.httpResponse(res, message, data, error, Utils.codeList().success);
  } catch (err: any) {
    Utils.httpResponse(res, err, null, true, Utils.codeList().badrequest);
  }
});


route
.route("/mongo/product/expired/:token")
.get(async (req, res, next) => {
  const { token } = req.params;
  try {
    await conn.connect()
    const { message, data, error } = await ProductMongo.list_expired(token);
    await conn.disconnect()
    Utils.httpResponse(res, message, data, error, Utils.codeList().success);
  } catch (err: any) {
    Utils.httpResponse(res, err, null, true, Utils.codeList().badrequest);
  }
});


export const route_product_mongo = route;