import express from "express"
import { getSales } from "../contollers/sales.controller.js";

const router = express.Router();
router.get("/sales", getSales)


export default router;