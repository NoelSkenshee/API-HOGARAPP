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
import  {query_route}  from './routes/sql/queries';
import  {query_route_mongo}  from './routes/mongo/queries';
import  {diet}  from './routes/sql/diet';
import  message  from './routes/sql/message';
import  password  from './routes/sql/password';
import  config_product  from './routes/sql/config/product';
import  config_diet  from './routes/sql/config/diet';









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
 * API REST ROUTES QUERIES
 ****************************************************************************/
 app.use(query_route);// mariaDB
 app.use(query_route_mongo);//mongo db
/***************************************************************************
* END
****************************************************************************/

/***************************************************************************
 * API REST ROUTES DIETS MANAGER
 ****************************************************************************/
 app.use(diet);//mariaDB
/***************************************************************************
* END
****************************************************************************/


/***************************************************************************
 * API REST ROUTES PASSWORD MANAGER
 ****************************************************************************/
 app.use(password);//mariaDB
 /***************************************************************************
 * END
 ****************************************************************************/

 
/***************************************************************************
 * API REST ROUTES MESSAGE MANAGER
 ****************************************************************************/
 app.use(message);//mariaDB
 /***************************************************************************
 * END
 ****************************************************************************/
 
/***************************************************************************
 * API REST ROUTES PRODUCT_CONFIG MANAGER
 ****************************************************************************/
 app.use(config_product);//mariaDB
 /***************************************************************************
 * END
 ****************************************************************************/
 
 
/***************************************************************************
 * API REST ROUTES PRODUCT_CONFIG MANAGER
 ****************************************************************************/
 app.use(config_diet);//mariaDB
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
