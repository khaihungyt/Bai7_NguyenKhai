import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho Post
export interface IPost extends Document {
    title: string;
    content: string;
    user: mongoose.Types.ObjectId;  // Tham chiếu đến User (Account)
    comments?: mongoose.Types.ObjectId[];  // Tham chiếu đến Comment (sử dụng virtual)
}

// Định nghĩa schema cho Post
const postSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'account', required: true }  // Tham chiếu đến User
}, {
    toJSON: { virtuals: true },  // Kích hoạt virtuals khi chuyển đổi sang JSON
    toObject: { virtuals: true },  // Kích hoạt virtuals khi chuyển đổi sang Object
    collection: 'post'  // Chỉ định tên collection trong MongoDB
});

// Tạo virtual field cho comments
postSchema.virtual('comments', {
    ref: 'comment',  // Tên mô hình comment sẽ tham chiếu
    localField: '_id',  // Trường trong Post sẽ được sử dụng để so sánh
    foreignField: 'post'  // Trường trong Comment liên kết với Post
});
// Tạo model Post
const PostModel = mongoose.model<IPost>('post', postSchema);
// Export model
export default PostModel;
