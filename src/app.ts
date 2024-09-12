// Import các thư viện cần thiết
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import accountRouter from './routes/account';  // Import routes từ thư mục routes
import commentRouter from './routes/comment';
import postRouter from './routes/post';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
const SECRET_KEY = "Khaideptrai1972";
// Khởi tạo ứng dụng Express
const app: Application = express();
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Bai2');
        console.log('Connected to MongoDB');
        // Bây giờ bạn có thể sử dụng AccountModel, PostModel, và CommentModel
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}
main();
// cookie - session 
app.use(
    cookieSession({
        name: 'session',
        keys: [SECRET_KEY], // Sử dụng để mã hóa cookie
        // Các tùy chọn khác
        maxAge: 10 * 60 * 1000, // Thời gian sống của cookie: 24 giờ
        httpOnly: true, // Ngăn JavaScript truy cập cookie
        secure: false, // Chỉ gửi cookie qua HTTPS
    })
);
// Sử dụng các middleware cần thiết
app.use(bodyParser.json());    // Middleware để parse JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Các route của ứng dụng
app.use('/account', accountRouter);
app.use('/comment', commentRouter);
app.use('/post', postRouter); // Sử dụng route đã định nghĩa trong folder routes
// Xử lý lỗi 404 - không tìm thấy trang
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not Found'
    });
});
// Xử lý lỗi server
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
});

// Xuất ứng dụng để có thể sử dụng trong file server.ts
export default app;