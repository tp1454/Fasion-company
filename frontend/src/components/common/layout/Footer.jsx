import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Fashion Company</h3>
                        <p className="text-gray-400">
                            Thời trang cao cấp cho mọi người
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-white">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Chính sách đổi trả
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Chính sách bảo mật
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Điều khoản sử dụng
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: info@fashion.com</li>
                            <li>Phone: 0901234567</li>
                            <li>Address: 123 Fashion Street, HCM City</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Fashion Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
