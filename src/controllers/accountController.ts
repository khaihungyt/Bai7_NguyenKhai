import jwt from 'jsonwebtoken';
import AccountModel, { IAccount } from "../models/accountmodel";
import express, { Request, Response, NextFunction } from 'express';
const SECRET_KEY = "Khaideptrai1972";

interface Account {
    id: string;
    username: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            account?: Account
        }
    }
}

export let checklogin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.token) {
        return res.json({ error: "invalid token" });
    }
    let token = req.session.token;
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as Account;

        // Add the account to the request object
        req.account = decoded;

        // Continue to the next middleware
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired session token' });
    }
}

// Middleware để xóa tất cả session cookies
export const LogOut = (req: Request, res: Response, next: NextFunction): void => {
    const cookies = req.cookies;
    // Kiểm tra xem có cookies nào không
    if (cookies) {
        // Duyệt qua tất cả các cookies và xóa từng cookie
        Object.keys(cookies).forEach((cookieName) => {
            res.clearCookie(cookieName, {
                path: '/',  
                expires: new Date(0),
                httpOnly: false, 
                secure: false, 
            });
        });
    }
    next();
};
export let login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let username: string = req.body.username;
        let password: string = req.body.password;
        // Chờ kết quả từ cơ sở dữ liệu
        let data = await AccountModel.findOne({
            username: username,
            password: password,
            ishidden: true
        }).exec();

        // Kiểm tra xem dữ liệu có tồn tại không
        if (data) {
            const user = {
                id: data.id,
                username: data.username,
                role: data.role
            }
            const token: string = jwt.sign(user, SECRET_KEY);
            req.session.token = token;
            if (data.role === "admin") {
                return res.json({
                    "mess": "valid admin",
                    "token": token
                });
            } else {
                return res.json({
                    "mess": "valid customer",
                    "token": token
                });
            }
        } else {
            return res.json({ "mess": "invalid" });
        }
    } catch (error) {
        // Xử lý lỗi
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export let register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let account: {
            username: string,
            password: string,
            fullname: string
        } = req.body;
        const data = await AccountModel.findOne({
            username: account.username
        });
        if (data) {
            return res.json({ "mess": "invalid" });
        } else {
            const newAccount = new AccountModel({
                username: account.username,
                password: account.password,
                fullname: account.fullname,
                role: "customer",
                ishidden: true
            });
            await newAccount.save();
            // Phản hồi thành công
            return res.status(201).json({ "mess": 'valid' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export let accountView = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await AccountModel.find({
            ishidden: true
        });
        return res.json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
export let deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.body.userID;
        let result = await AccountModel.findById(userId);
        if (result?.role === 'admin') {
            return res.json({ "mess": "invalid" });
        } else {
            await AccountModel.updateOne({ _id: userId }, { $set: { ishidden: false } });
            return res.status(200).json({ "mess": "valid" });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ "mess": 'Error deleting user' });
    }
};