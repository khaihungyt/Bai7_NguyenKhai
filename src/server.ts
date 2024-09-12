import app from './app'; // Import ứng dụng từ app.ts
// Đặt cổng từ biến môi trường hoặc mặc định là 3000
const PORT = 3001;
// Khởi chạy server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Port", PORT);