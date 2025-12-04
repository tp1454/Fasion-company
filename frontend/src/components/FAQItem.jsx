import React from 'react';

/**
 * Component hiển thị từng FAQ item với accordion
 * Công việc #2 - Fashion Company
 */
const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
        aria-expanded={isOpen}
      >
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {faq.question}
          </h3>
          {faq.category && (
            <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {faq.category}
            </span>
          )}
        </div>
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
          {faq.views > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{faq.views} lượt xem</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
