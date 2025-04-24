import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // only for accessing cookies from server to user browser (CRUD on user COOKIE);

const app = express(); 

// configuration 
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true,
}));
// body parser is bydefault in node js 
app.use(express.json({limit : "22kb"}));
app.use(express.urlencoded({extended : true, limit : "22kb"}));// data comming form url 
app.use(express.static("public"));
app.use(cookieParser());



// routes

import  userRouter from "./routes/user.routes.js";

// routes declaration 
app.use("/api/v1/users", userRouter);






export { app }

