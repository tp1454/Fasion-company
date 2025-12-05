import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import FAQItem from '../components/FAQItem';
import FAQSearch from '../components/FAQSearch';
import Pagination from '../components/Pagination';

/**
 * Trang Hỏi/Đáp (FAQ)
 * Công việc #2 - Fashion Company
 */
const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqId, setOpenFaqId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFAQs();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(
        `http://localhost/Fashion-company/backend/api/faqs.php?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setFaqs(result.data);
        setCategories(result.categories || []);

        if (result.pagination) {
          setCurrentPage(result.pagination.page);
          setTotalPages(result.pagination.totalPages);
          setTotal(result.pagination.total);
        }
      } else {
        setError('Không thể tải danh sách câu hỏi');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setOpenFaqId(null); // Close all accordions when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (faqId) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  return (
    <>
      <Helmet>
        <title>Câu hỏi thường gặp - Fashion Company</title>
        <meta name="description" content="Tìm câu trả lời cho các câu hỏi thường gặp về sản phẩm, dịch vụ và chính sách của Fashion Company" />
        <meta name="keywords" content="faq, câu hỏi thường gặp, hỏi đáp, fashion company" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
              Tìm câu trả lời nhanh chóng cho các thắc mắc của bạn
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Search Component */}
            <FAQSearch
              onSearch={handleSearch}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* FAQ List */}
            {!loading && !error && (
              <>
                {/* Results Info */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600">
                    {total > 0 ? (
                      <>
                        Tìm thấy <span className="font-semibold text-gray-900">{total}</span> câu hỏi
                        {searchTerm && (
                          <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchTerm}</span>"</span>
                        )}
                        {selectedCategory && (
                          <span> trong danh mục "<span className="font-semibold text-blue-600">{selectedCategory}</span>"</span>
                        )}
                      </>
                    ) : (
                      <span className="text-red-600">Không tìm thấy câu hỏi nào</span>
                    )}
                  </p>

                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                        setCurrentPage(1);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                {/* FAQ Items */}
                {faqs.length > 0 ? (
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isOpen={openFaqId === faq.id}
                        onToggle={() => toggleFaq(faq.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Không tìm thấy câu hỏi
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                        setCurrentPage(1);
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Xem tất cả câu hỏi
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {faqs.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ với chúng tôi
              </a>
              <a
                href="tel:1900xxxx"
                className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Hotline: 1900-xxxx
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;
