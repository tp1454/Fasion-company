/**
 * Form validation utilities
 */

export const validation = {
    // Validate email
    email: (email) => {
        if (!email) return 'Email không được để trống';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Email không hợp lệ';
        return null;
    },

    // Validate password
    password: (password) => {
        if (!password) return 'Mật khẩu không được để trống';
        if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
        return null;
    },

    // Validate required field
    required: (value, fieldName = 'Trường này') => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return `${fieldName} không được để trống`;
        }
        return null;
    },

    // Validate phone number
    phone: (phone) => {
        if (!phone) return null; // Phone is optional
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(phone)) return 'Số điện thoại không hợp lệ';
        return null;
    },

    // Validate password match
    passwordMatch: (password, confirmPassword) => {
        if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu';
        if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
        return null;
    }
};
