// require("dotenv").config({path : "./env"})
import dotenv from "dotenv"
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js"
import connectDB from "./db/db.js"
import express from "express";

dotenv.config({
    path : "./env"
})
connectDB();



