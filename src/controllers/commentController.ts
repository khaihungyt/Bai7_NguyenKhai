import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import CommentModel, { IComment } from '../models/commentmodel';

export const addcomment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user = req.account;
        let text: string = req.body.text;
        let post: string = req.body.post;
        let currentDate: Date = new Date();
        // Tạo một đối tượng mới của CommentModel
        const newComment: IComment = new CommentModel({
            post: new mongoose.Types.ObjectId(post),
            user: new mongoose.Types.ObjectId(user?.id),
            text: text,
            date: currentDate
        });

        // Lưu đối tượng mới vào cơ sở dữ liệu
        await newComment.save();
        // Phản hồi thành công
        return res.status(201).json({ "mess": 'valid' });
    } catch (err) {
        console.log("Khai1" + err);
    }
};

export let commentView = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postID = req.body.postID;
        let commentList = await CommentModel.find({
            post: postID
        }).populate('user');
        return res.json(commentList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ "mess": 'Error deleting user' });
    }
}