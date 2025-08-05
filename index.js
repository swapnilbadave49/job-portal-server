// old way of doing it const express= require('express');

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './Routes/user.route.js';
import companyRoute from './Routes/company.route.js';

import jobRoute from './Routes/job.route.js'; // Import job routes  

import applicationRoute from './Routes/application.route.js';

import path from 'path';


const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
dotenv.config({});
//middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // for local dev
  "https://job-portal-gxb80fin5-swapnilbadave49s-projects.vercel.app/*", // ✅ deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Important if you're using cookies
  })
);


const PORT = process.env.PORT || 3000;


//api's

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);

app.use("/api/v1/job", jobRoute); // Use job routes

app.use("/api/v1/application", applicationRoute); // Use application routes


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
