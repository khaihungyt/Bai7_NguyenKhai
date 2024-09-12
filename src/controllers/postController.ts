import express, { Request, Response, NextFunction } from 'express';
import PostModel, { IPost } from '../models/postmodel';
export const postView = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let postList: IPost[] = await PostModel.find({})
            .populate('user') // Populate user của Post
            .populate({
                path: 'comments', // Populate comments
                populate: {
                    path: 'user', // Trong mỗi comment, populate user
                    model: 'account' // Model của user
                }
            });
        return res.json(postList);
    } catch (err) {
        console.log(err);
    }
}
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let PostID: string = req.body.PostID;
        await PostModel.deleteOne({ _id: PostID });
        return res.status(200).json({ "mess": "valid" });
    } catch (error) {
        res.status(500).json({ "mess": 'Error deleting user', error: error.message });
    }
}

export const updatepost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let PostID: string = req.body.PostID;
        let title: string = req.body.title;
        let content: string = req.body.content;
        await PostModel.updateOne({ _id: PostID }, {
            $set: {
                title: title,
                content: content
            }
        });
        return res.status(200).json({ "mess": "valid" });
    } catch (error) {
        res.status(500).json({ "mess": 'Error deleting user', error: error.message });
    }
}

export const addpost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let title: string = req.body.title;
        let content: string = req.body.content;
        let user = req.account;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        } else {
            const newPost = new PostModel({
                title: title,
                content: content,
                user: user.id
            })
            await newPost.save();
            return res.json({ "mess": "valid" });
        }
    } catch (error) {
        res.status(500).json({ "mess": 'Error deleting user', error: error.message });
    }
}