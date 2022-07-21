import  createError from 'http-errors';
import  express  from 'express';
import  path  from 'path';
import  logger from 'morgan';

import  {user_route}  from './routes/sql/users';
import  {user_route_mongo}  from './routes/mongo/user';
import  {route_product}  from './routes/sql/product';
import  {route_product_mongo}  from './routes/mongo/product';
import  {consumtion_route_mongo}  from './routes/mongo/consumption';
import  {consumtion_route_sql}  from './routes/sql/consumption';
import  {expiry}  from './routes/sql/expiry';
import  {expiry_mongo}  from './routes/mongo/expiry';




import expressFile from "express-fileupload";

import cors from "cors";

var app = express();

app.use(logger('dev'));
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressFile());

/***************************************************************************
 * API REST ROUTES PRODUCT
 ****************************************************************************/

 app.use(route_product);// mariaDB
 app.use(route_product_mongo);//mongo db

/***************************************************************************
* END
****************************************************************************/

/***************************************************************************
 * API REST ROUTES USER
 ****************************************************************************/
 app.use(user_route);// mariaDB
 app.use(user_route_mongo);//mongo db
/***************************************************************************
* END
****************************************************************************/
/***************************************************************************
 * API REST ROUTES CONSUMTION
 ****************************************************************************/
 app.use(consumtion_route_sql);// mariaDB
 app.use(consumtion_route_mongo);//mongo db
/***************************************************************************
* END
****************************************************************************/
/***************************************************************************
 * API REST ROUTES EXPIRY
 ****************************************************************************/
 app.use(expiry);// mariaDB
 app.use(expiry_mongo);//mongo db
/***************************************************************************
* END
****************************************************************************/
/***************************************************************************
 * ERROR MANAGER
 ****************************************************************************/
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err:any, req:any, res:any, next:Function) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  next()
});

/***************************************************************************
 * END
 ****************************************************************************/

export const app_=app;
