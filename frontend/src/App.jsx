import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Header from './components/common/layout/Header'
import Footer from './components/common/layout/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Posts from './pages/Posts'
import Contact from './pages/Contact'
import About from './pages/About'
import FAQ from './pages/FAQ'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User pages
import Profile from './pages/user/Profile'
import EditProfile from './pages/user/EditProfile'
import ChangePassword from './pages/user/ChangePassword'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import UserDetail from './pages/admin/UserDetail'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminAbout from './pages/admin/AdminAbout'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className='min-h-screen flex flex-col'>
          <Header />
          <main className='flex-1'>
            <Routes>
              {/* Public routes */}
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/products' element={<Products />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/posts' element={<Posts />} />
              <Route path='/faq' element={<FAQ />} />
              <Route path='/contact' element={<Contact />} />

              {/* Auth routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />

              {/* User protected routes */}
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path='/profile/edit' element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              <Route path='/profile/change-password' element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />

              {/* Admin protected routes */}
              <Route path='/admin/dashboard' element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path='/admin/users' element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path='/admin/users/:id' element={
                <ProtectedRoute adminOnly>
                  <UserDetail />
                </ProtectedRoute>
              } />
              <Route path='/admin/faqs' element={
                <ProtectedRoute adminOnly>
                  <AdminFAQ />
                </ProtectedRoute>
              } />
              <Route path='/admin/about' element={
                <ProtectedRoute adminOnly>
                  <AdminAbout />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
