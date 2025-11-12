# Hướng Dẫn Cài Đặt Supabase

## ⚠️ QUAN TRỌNG: Bạn PHẢI tạo file `.env.local` trước khi chạy ứng dụng!

## Bước 1: Tạo file `.env.local`

Trong thư mục gốc của project (cùng cấp với `package.json`), tạo file tên là `.env.local` với nội dung sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Bước 2: Lấy Supabase Credentials

1. **Tạo tài khoản Supabase** (nếu chưa có):
   - Vào https://supabase.com
   - Click "Start your project"
   - Đăng ký bằng GitHub/Email

2. **Tạo Project mới**:
   - Click "New Project"
   - Điền tên project và mật khẩu database
   - Chọn region gần bạn nhất
   - Click "Create new project"
   - Đợi 2-3 phút để project được tạo

3. **Lấy API Credentials**:
   - Vào Project Settings (biểu tượng bánh răng bên trái)
   - Chọn tab "API"
   - Copy 2 giá trị sau:
     - **Project URL** (giống như `https://abcdefghijklmnop.supabase.co`)
     - **anon public** key (chuỗi rất dài bắt đầu bằng `eyJ...`)

4. **Cập nhật file `.env.local`**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   Thay thế bằng URL và key thực của bạn!

## Bước 3: Tạo Database Table

1. Trong Supabase dashboard, click vào **SQL Editor** (icon code ở sidebar)
2. Click **New query**
3. Mở file `supabase-schema.sql` trong project của bạn
4. Copy TOÀN BỘ nội dung trong file
5. Paste vào SQL Editor
6. Click **Run** (hoặc Ctrl+Enter)
7. Bạn sẽ thấy message "Success. No rows returned"

## Bước 4: Restart Development Server

1. **Dừng server hiện tại** (nếu đang chạy):
   - Trong terminal, nhấn `Ctrl+C`

2. **Xóa cache Next.js**:
   ```bash
   rm -rf .next
   ```
   (Trên Windows PowerShell: `Remove-Item -Recurse -Force .next`)

3. **Chạy lại server**:
   ```bash
   npm run dev
   ```

## Bước 5: Kiểm Tra

Mở trình duyệt tại http://localhost:3000

Nếu thấy trang Recipe Sharing App mà không có lỗi, nghĩa là bạn đã setup thành công! 🎉

## Troubleshooting

### Lỗi "Invalid supabaseUrl"
- ✅ Đảm bảo file `.env.local` tồn tại trong thư mục gốc
- ✅ Kiểm tra URL có đúng định dạng `https://xxx.supabase.co`
- ✅ Kiểm tra không có dấu cách thừa trong file `.env.local`
- ✅ Restart server sau khi tạo/sửa `.env.local`

### Lỗi khi chạy SQL
- ✅ Đảm bảo bạn đã tạo project trước
- ✅ Copy TOÀN BỘ nội dung từ `supabase-schema.sql`
- ✅ Nếu báo lỗi "table already exists", có thể bỏ qua (table đã được tạo)

### Không thấy recipes
- ✅ Kiểm tra đã chạy SQL schema chưa
- ✅ Thử tạo recipe mới xem có được không
- ✅ Kiểm tra Supabase dashboard > Table Editor xem có table `recipes` chưa

## Video Hướng Dẫn (nếu cần)

1. Tạo Supabase project: https://supabase.com/docs/guides/getting-started
2. Lấy API keys: https://supabase.com/docs/guides/api

