# Hướng Dẫn Deploy Recipe Sharing App

## ⚠️ QUAN TRỌNG: Test Local Trước Khi Deploy!

**TRƯỚC KHI DEPLOY**, hãy đảm bảo app chạy được ở local:
1. Tạo file `.env.local` với Supabase credentials
2. Chạy `npm run dev`
3. Test tất cả chức năng: xem, tạo, sửa, xóa recipes
4. Chỉ khi app chạy OK ở local thì mới deploy

## Bước 1: Setup Supabase Database

### 1.1. Lấy Supabase Credentials

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com)
2. Chọn project của bạn
3. Vào **Project Settings** (icon bánh răng) > **API**
4. Copy 2 giá trị sau:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: JWT token dài bắt đầu bằng `eyJ...`

### 1.2. Tạo Database Table

**⚠️ RẤT QUAN TRỌNG**: Phải chạy SQL schema trước khi deploy!

1. Trong Supabase Dashboard, click **SQL Editor** (icon code ở sidebar)
2. Click **New query**
3. Mở file `supabase-schema.sql` trong project của bạn
4. Copy **TOÀN BỘ** nội dung trong file
5. Paste vào SQL Editor
6. Click **Run** (hoặc Ctrl+Enter)
7. Bạn sẽ thấy message "Success. No rows returned"

**✅ Phải chạy SQL này để tạo table `recipes` với RLS policies đúng!**

## Bước 2: Deploy trên Vercel

### 2.1. Deploy từ GitHub

1. **Push code lên GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Tạo Vercel Account**: Vào [vercel.com](https://vercel.com) và đăng ký

3. **Import Repository**:
   - Click "Import Project" trong Vercel dashboard
   - Chọn GitHub repository của bạn
   - Click "Import"

4. **Cấu hình Environment Variables**:
   - Vercel sẽ tự detect Next.js project
   - Trước khi click "Deploy", scroll xuống **Environment Variables**
   - Thêm 2 biến sau:
     
     **Variable 1:**
     - Key: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://your-project-id.supabase.co` (URL từ bước 1)
     - Environment: Production, Preview, Development (chọn cả 3)
     
     **Variable 2:**
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Value: `eyJ...` (JWT token từ bước 1)
     - Environment: Production, Preview, Development (chọn cả 3)

5. **Deploy**:
   - Click "Deploy" button
   - Đợi 2-3 phút để build
   - Xong! URL sẽ hiển thị dạng `https://your-app.vercel.app`

6. **Kiểm tra**:
   - Mở URL của app
   - App sẽ hoạt động bình thường nếu environment variables đúng

### 2.2. Sửa Environment Variables sau khi deploy

Nếu quên cấu hình hoặc sai environment variables:

1. Vào Vercel Dashboard > chọn project
2. Click **Settings** > **Environment Variables**
3. Thêm hoặc sửa các biến:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Save**
5. Vào tab **Deployments**
6. Click **⋯** > **Redeploy** cho deployment mới nhất
7. Hoặc đơn giản: push code mới lên GitHub (Vercel auto-deploy)

## Bước 3: Deploy trên Render

### 3.1. Tạo Render Account

1. Vào [render.com](https://render.com)
2. Đăng ký bằng GitHub

### 3.2. Tạo Web Service

1. Click **New** > **Web Service**
2. Connect GitHub repository
3. Cấu hình:
   - **Name**: Tên app của bạn
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Branch**: `main`
   - **Root Directory**: `.` (để trống)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. **Environment Variables**:
   - Click **Advanced** > **Add Environment Variable**
   - Thêm:
     - Key: `NEXT_PUBLIC_SUPABASE_URL`, Value: `https://...`
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: `eyJ...`

5. Click **Create Web Service**
6. Đợi build (5-10 phút)
7. URL: `https://your-app.onrender.com`

## Bước 4: Deploy trên Netlify

### 4.1. Tạo Netlify Account

1. Vào [netlify.com](https://netlify.com)
2. Đăng ký bằng GitHub

### 4.2. Deploy

1. Click **Add new site** > **Import an existing project**
2. Chọn GitHub repository
3. Cấu hình build:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

4. **Environment Variables**:
   - Click **Advanced** > **Add variable**
   - Thêm:
     - Key: `NEXT_PUBLIC_SUPABASE_URL`, Value: `https://...`
     - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: `eyJ...`

5. Click **Deploy site**
6. URL: `https://random-name-123.netlify.app`

## Troubleshooting

### Lỗi "Error fetching recipes: TypeError: fetch failed"

**Nguyên nhân**: Environment variables chưa được cấu hình đúng HOẶC database chưa setup

**Cách sửa**:
1. ✅ **Bước 1**: Kiểm tra đã chạy SQL schema trong Supabase chưa (xem Bước 1.2)
2. ✅ **Bước 2**: Kiểm tra environment variables đã được thêm chưa
3. ✅ **Bước 3**: Đảm bảo `NEXT_PUBLIC_SUPABASE_URL` bắt đầu bằng `https://`
4. ✅ **Bước 4**: Đảm bảo `NEXT_PUBLIC_SUPABASE_ANON_KEY` là JWT token hợp lệ
5. ✅ **Bước 5**: Redeploy lại app sau khi sửa environment variables

### Lỗi "Failed to collect page data"

**Nguyên nhân**: Environment variables thiếu hoặc sai

**Cách sửa**:
1. Xem logs build trong Vercel/Render dashboard
2. Kiểm tra console có log "Missing environment variables"
3. Thêm đúng environment variables
4. Redeploy

### App build thành công nhưng không load được data

**Nguyên nhân 1**: Environment variables sai hoặc không được apply

**Cách sửa**:
1. ✅ Vào Settings > Environment Variables
2. ✅ Xóa tất cả environment variables cũ
3. ✅ Thêm lại đúng 2 biến
4. ✅ Redeploy lại

**Nguyên nhân 2**: Chưa tạo database table

**Cách sửa**:
1. ✅ Vào Supabase Dashboard > SQL Editor
2. ✅ Chạy lại SQL từ `supabase-schema.sql`
3. ✅ Verify table `recipes` đã được tạo: Supabase > Table Editor

### Lỗi "permission denied" hoặc RLS error

**Nguyên nhân**: Row Level Security chưa được cấu hình đúng

**Cách sửa**:
1. Vào Supabase Dashboard > SQL Editor
2. Chạy lại SQL từ `supabase-schema.sql` (đặc biệt phần CREATE POLICY)
3. Verify RLS: Table Editor > Authentication > Policies

### Không có môi trường Development/Preview

**Cách sửa**:
1. Vào Settings > Environment Variables
2. Click vào từng biến
3. Chọn **All Environments** (Production + Preview + Development)
4. Save và redeploy

## Checklist Deploy

- [ ] Tạo Supabase project
- [ ] Run SQL schema (`supabase-schema.sql`) trong Supabase dashboard
- [ ] Lấy được Project URL và anon key
- [ ] Push code lên GitHub
- [ ] Tạo Vercel/Render/Netlify account
- [ ] Import repository
- [ ] **Thêm đúng 2 environment variables**
- [ ] Deploy
- [ ] Test app trên URL deploy

## Nhắc Nhở Quan Trọng

⚠️ **KHÔNG BAO GIỜ** commit file `.env.local` vào GitHub!

⚠️ Environment variables **PHẢI** được cấu hình trong platform deploy (Vercel/Render/Netlify)

⚠️ Sau khi sửa environment variables, **PHẢI** redeploy app

⚠️ Supabase credentials phải đúng định dạng:
- URL: `https://xxxxxxxxxxxxx.supabase.co`
- Key: JWT token dài, không có khoảng trắng

## Liên Hệ

Nếu gặp vấn đề khi deploy, vui lòng:
1. Check logs trong Vercel/Render dashboard
2. Xem console trong browser
3. Đọc kỹ hướng dẫn trên

