require('dotenv').config();
import app from './app';
import './middlewares';
import './controllers';

app.listen(process.env.PORT);
