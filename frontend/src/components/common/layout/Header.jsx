import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">Fashion Co.</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Trang chủ
                        </Link>
                        <Link to="/products" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Sản phẩm
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Giới thiệu
                        </Link>
                        <Link to="/faq" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                            FAQ
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Liên hệ
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative ml-3">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`http://localhost/Fashion-company/backend/uploads/avatars/${user.avatar}`}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                            {user.full_name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                    <span>{user.full_name}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Thông tin cá nhân
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Quản trị
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-indigo-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <Link to="/" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Trang chủ
                        </Link>
                        <Link to="/products" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Sản phẩm
                        </Link>
                        <Link to="/about" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Giới thiệu
                        </Link>
                        <Link to="/faq" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                            FAQ
                        </Link>
                        <Link to="/contact" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                            Liên hệ
                        </Link>
                        {user ? (
                            <>
                                <Link to="/profile" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                                    Thông tin cá nhân
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                                        Quản trị
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="block text-gray-700 hover:text-indigo-600 px-3 py-2">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
