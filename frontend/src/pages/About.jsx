import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Trang Giới thiệu
 * Công việc #2 - Fashion Company
 */
const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Fashion-company/backend/api/about.php');
      const result = await response.json();

      if (result.success) {
        setAboutData(result.data);
      } else {
        setError('Không thể tải thông tin giới thiệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error fetching about data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{aboutData?.title || 'Giới thiệu'} - Fashion Company</title>
        <meta name="description" content="Tìm hiểu về Fashion Company - Thương hiệu thời trang hàng đầu Việt Nam" />
        <meta name="keywords" content="giới thiệu, fashion company, thời trang, about us" />
      </Helmet>

      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              {aboutData?.title || 'Giới thiệu'}
            </h1>
            <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
              Khám phá câu chuyện của chúng tôi
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {aboutData?.content && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-12">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: aboutData.content }}
                />
              </div>
            )}

            {/* Images Gallery */}
            {aboutData?.images && aboutData.images.length > 0 && (
              <div className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutData.images.map((imageUrl, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={imageUrl}
                        alt={`Fashion Company ${index + 1}`}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          if (!e.target.dataset.errorHandled) {
                            e.target.dataset.errorHandled = 'true';
                            e.target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mission, Vision, History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Mission */}
              {aboutData?.mission && (
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Sứ mệnh</h2>
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: aboutData.mission }}
                  />
                </div>
              )}

              {/* Vision */}
              {aboutData?.vision && (
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Tầm nhìn</h2>
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: aboutData.vision }}
                  />
                </div>
              )}

              {/* Values */}
              {aboutData?.values && (
                <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 rounded-full p-3 mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Giá trị</h2>
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: aboutData.values }}
                  />
                </div>
              )}
            </div>

            {/* History */}
            {aboutData?.history && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Lịch sử hình thành</h2>
                </div>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: aboutData.history }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Hãy trở thành một phần của chúng tôi</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Khám phá bộ sưu tập thời trang mới nhất và trải nghiệm phong cách sống hiện đại
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Xem sản phẩm
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Liên hệ
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
