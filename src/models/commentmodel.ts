import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho Comment
export  interface IComment extends Document {
    post: mongoose.Types.ObjectId;    // Tham chiếu đến Post (kiểu ObjectId)
    user: mongoose.Types.ObjectId;    // Tham chiếu đến User (kiểu ObjectId)
    text: string;                     // Nội dung bình luận
    date?: Date;                      // Ngày tạo bình luận (tùy chọn, có giá trị mặc định)
}

// Định nghĩa schema cho Comment
const CommentSchema: Schema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true },  // Tham chiếu đến Post
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true },  // Tham chiếu đến User
    text: { type: String, required: true },  // Nội dung bình luận
    date: { type: Date, default: Date.now }  // Ngày tạo bình luận
}, {
    collection: 'comment'  // Tên collection trong MongoDB
});

// Tạo model Comment
const CommentModel = mongoose.model<IComment>('comment', CommentSchema);

// Export model
export default CommentModel;
