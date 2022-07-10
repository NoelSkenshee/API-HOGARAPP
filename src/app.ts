import  createError from 'http-errors';
import  express  from 'express';
import  path  from 'path';
import  logger from 'morgan';

import  {user_route}  from './routes/sql/users';
import  {user_route_mongo}  from './routes/mongo/user';


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



/***************************************************************************
 * API REST ROUTES
 ****************************************************************************/
  app.use(user_route);
  app.use(user_route_mongo);


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
