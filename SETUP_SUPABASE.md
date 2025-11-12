# Hướng dẫn Setup Supabase

## Lỗi hiện tại
File `.env.local` của bạn đang có giá trị sai:
- `NEXT_PUBLIC_SUPABASE_URL` đang chứa JWT token (phải là URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` có thể đang chứa URL (phải là JWT token)

## Cách sửa đúng

### Bước 1: Vào Supabase Dashboard
1. Đăng nhập vào https://supabase.com
2. Chọn project của bạn (project reference: `nzsuqtdgczvzjwuicrxq`)

### Bước 2: Lấy Project URL
1. Vào **Project Settings** (icon bánh răng ở sidebar trái)
2. Chọn tab **API**
3. Tìm mục **Project URL** 
4. URL sẽ có dạng: `https://nzsuqtdgczvzjwuicrxq.supabase.co`
5. **Copy toàn bộ URL này** (bắt đầu bằng `https://`)

### Bước 3: Lấy Anon Key
1. Cùng trong tab **API**
2. Tìm mục **Project API keys**
3. Tìm key có label là **`anon`** hoặc **`public`**
4. **Copy key này** (sẽ là chuỗi JWT token dài, bắt đầu bằng `eyJ...`)

### Bước 4: Cập nhật file .env.local
Sửa file `.env.local` với format sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nzsuqtdgczvzjwuicrxq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3VxdGRnY3p2emp3dWljcnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4Nzc2OTksImV4cCI6MjA3NzQ1MzY5OX0.your-key-here
```

**Lưu ý quan trọng:**
- `NEXT_PUBLIC_SUPABASE_URL` phải bắt đầu bằng `https://` và kết thúc bằng `.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` là JWT token dài (không có khoảng trắng, không có xuống dòng)

### Bước 5: Restart Server
Sau khi sửa file `.env.local`:
1. Dừng server (Ctrl + C)
2. Xóa thư mục `.next` cache: `rm -rf .next` hoặc xóa thủ công
3. Chạy lại: `npm run dev`

## Kiểm tra xem đã đúng chưa
URL đúng sẽ có dạng: `https://[project-id].supabase.co`
Key đúng sẽ là JWT token dài, bắt đầu bằng `eyJ`

