import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { globalErrorHanlder } from './middlewares/errorMiddleware';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api" , routes)

app.use(globalErrorHanlder)

export default app;