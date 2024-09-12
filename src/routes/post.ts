import * as index from '../controllers/index';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
router.get('/postview', index.postView);
router.post('/addpost', index.checklogin, index.addpost);
router.delete('/deletepost', index.checklogin, index.deletePost);
router.patch('/updatepost', index.checklogin, index.updatepost);
export default router;