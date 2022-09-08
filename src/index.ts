import express, { Application } from "express";
import serverless from 'serverless-http';
import compression from "compression";
import Route  from './routes';
import morgan from 'morgan';
require('dotenv').config();
require('./connection');

const app: Application = express();

app.use(express.urlencoded({ extended: true }));     
app.use(morgan('tiny'));
app.use(express.json()); 
app.use(compression());

app.use('/api/v1', Route.IndexRoutes);
app.use('/api/v1/client', Route.ClientRoutes);
app.use('/api/v1/influencer', Route.InfluencerRoutes);
app.use('/api/v1/proposal', Route.ProposalRoutes);
app.use('/api/v1/review', Route.ReviewRoutes);
app.use('/api/v1/feedback', Route.FeedbackRoutes);

app.listen(process.env.PORT, () => { console.log(`🚀 Server Running On PORT => ${process.env.PORT} 🖥️ !!`) });
module.exports.handler = serverless(app);