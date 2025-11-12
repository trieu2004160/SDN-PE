'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Đăng nhập
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast.success('Đăng nhập thành công!')
        router.push('/')
        router.refresh()
      } else {
        // Đăng ký
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.')
        setIsLogin(true)
        setEmail('')
        setPassword('')
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-header">
          <h1>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h1>
          <p>{isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
            {!isLogin && (
              <small>Mật khẩu phải có ít nhất 6 ký tự</small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setEmail('')
                setPassword('')
              }}
              className="link-button"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
          <Link href="/" className="back-link">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

