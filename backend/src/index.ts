require('dotenv').config();
import app from './app';
import middlewares from './middlewares';
import authRouter from './controllers/auth';
import todoRouter from './controllers/todo';

app.useMiddleware(middlewares);
app.useRouter(authRouter)
app.useRouter(todoRouter)

app.listen(process.env.PORT);
