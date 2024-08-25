import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import clientRoutes from "./routes/client.route.js"
import generalRoutes from "./routes/general.route.js"
import managementRoutes from "./routes/management.route.js"
import salesRoutes from "./routes/sales.route.js"
import User from "./models/user.model.js";
import { dataAffiliateStat, dataOverallStat, dataProduct, dataProductStat, dataTransaction, dataUser } from "./data/index.js";
import Product from "./models/product.model.js";
import ProductStat from "./models/productStat.model.js";
import Transaction from "./models/transaction.model.js";
import OverallStat from "./models/overAllStat.model.js";
import AffiliateStat from "./models/affiliateStat.model.js";

// CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy(
    { policy: "cross-origin" }
))
app.use(morgan("common"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

//Routes
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes)

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on PORT:", PORT);
        console.log("DataBase connected...!");
        // AffiliateStat.insertMany(dataAffiliateStat)
        // OverallStat.insertMany(dataOverallStat)
        // User.insertMany(dataUser)
        // Product.insertMany(dataProduct)
        // ProductStat.insertMany(dataProductStat)
        // Transaction.insertMany(dataTransaction)
    })
}).catch((error) => {
    console.log("Error connecting with DataBase:", error)
})