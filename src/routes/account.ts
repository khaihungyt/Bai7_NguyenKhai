import * as index from '../controllers/index';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
router.post('/login', index.LogOut, index.login);
router.post('/register', index.register);
router.get('/accountview', index.accountView);
router.patch('/deleteuser', index.checklogin, index.deleteAccount);
export default router;