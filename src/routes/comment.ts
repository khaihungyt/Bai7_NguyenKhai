import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import * as index from "../controllers/index";
router.get("/commentview", index.checklogin, index.commentView);
router.post("/addcomment", index.checklogin, index.addcomment);
export default router;