import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiBookOpen, FiDollarSign, FiInfo } from 'react-icons/fi';

interface MarketRecognitionPriceProps {
  data: {
    topic: string;
    topic_code: string;
    sections: Array<{
      id: number;
      title: string;
      subsections: Array<{
        id: number;
        title: string;
        content: string;
        legal_basis: string;
        items?: string[];
        details?: Array<{
          id: number;
          title: string;
          content: string;
          legal_basis: string;
          items?: string[];
        }>;
      }>;
    }>;
    legal_references: string[];
  };
}

const MarketRecognitionPrice: React.FC<MarketRecognitionPriceProps> = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubsection = (key: string) => {
    setExpandedSubsections(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.topic}</h1>
            <p className="text-gray-600 text-sm">코드: {data.topic_code}</p>
            <div className="mt-4 flex items-center space-x-2 text-sm text-blue-700">
              <FiInfo className="w-4 h-4" />
              <span>총 {data.sections.length}개 섹션, {data.legal_references.length}개 법적 근거</span>
            </div>
          </div>
        </div>
      </div>

      {/* 목차 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiBookOpen className="w-5 h-5 mr-2 text-blue-600" />
          목차
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(`section-${section.id}`);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-colors"
            >
              <div className="font-medium text-gray-900">{section.id}. {section.title}</div>
              <div className="text-sm text-gray-600 mt-1">{section.subsections.length}개 세부 항목</div>
            </button>
          ))}
        </div>
      </div>

      {/* 섹션들 */}
      <div className="space-y-4">
        {data.sections.map((section) => (
          <div
            key={section.id}
            id={`section-${section.id}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* 섹션 헤더 */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between hover:from-blue-50 hover:to-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {section.id}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              {expandedSections.includes(section.id) ? (
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <FiChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* 섹션 내용 */}
            {expandedSections.includes(section.id) && (
              <div className="p-6 space-y-4">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="border border-gray-100 rounded-lg">
                    {/* 서브섹션 헤더 */}
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {section.id}.{subsection.id} {subsection.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed mb-3">{subsection.content}</p>
                      <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                        법적근거: {subsection.legal_basis}
                      </div>
                    </div>

                    {/* 항목들 */}
                    {subsection.items && subsection.items.length > 0 && (
                      <div className="p-4 bg-yellow-50 border-t border-gray-100">
                        <ul className="space-y-2">
                          {subsection.items.map((item, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></span>
                              <span className="text-gray-700 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 세부사항들 */}
                    {subsection.details && subsection.details.length > 0 && (
                      <div className="border-t border-gray-100">
                        {subsection.details.map((detail) => {
                          const detailKey = `${section.id}-${subsection.id}-${detail.id}`;
                          const isExpanded = expandedSubsections.includes(detailKey);

                          return (
                            <div key={detail.id} className="border-b border-gray-100 last:border-b-0">
                              <button
                                onClick={() => toggleSubsection(detailKey)}
                                className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                              >
                                <div>
                                  <h5 className="font-medium text-gray-800">{detail.title}</h5>
                                  <p className="text-sm text-gray-600 mt-1">{detail.content}</p>
                                  <div className="text-xs text-blue-600 mt-2">
                                    법적근거: {detail.legal_basis}
                                  </div>
                                </div>
                                {detail.items && detail.items.length > 0 && (
                                  <>
                                    {isExpanded ? (
                                      <FiChevronDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <FiChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                  </>
                                )}
                              </button>

                              {isExpanded && detail.items && detail.items.length > 0 && (
                                <div className="px-4 pb-4 bg-green-50">
                                  <ul className="space-y-1">
                                    {detail.items.map((item, index) => (
                                      <li key={index} className="flex items-start space-x-2">
                                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></span>
                                        <span className="text-gray-700 text-xs">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 법적 근거 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiDollarSign className="w-5 h-5 mr-2 text-blue-600" />
          관련 법령
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.legal_references.map((reference, index) => (
            <div
              key={index}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800"
            >
              {reference}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketRecognitionPrice;