import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiChevronDown, FiChevronRight, FiFileText, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ContentText {
  text: string;
  basis: string[];
}

interface ContentItem {
  title: string;
  description: string;
  content: ContentText[] | ContentItem[];
  basis?: string[];
}

interface AcquisitionRequirementsData {
  title: string;
  description: string;
  content: ContentItem[];
}

const AcquisitionRequirements: React.FC = () => {
  const [dataList, setDataList] = useState<AcquisitionRequirementsData[]>([]);
  const [selectedItem, setSelectedItem] = useState<AcquisitionRequirementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedSubSections, setExpandedSubSections] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/tax_requirements/acquisitionRequirements.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        
        // 배열 데이터 처리
        if (Array.isArray(jsonData)) {
          // 빈 객체 제거
          const validData = jsonData.filter(item => item && item.title);
          setDataList(validData);
          
          // 첫 번째 항목은 자동 선택하지 않음 (카드 목록 표시)
          // if (validData.length > 0) {
          //   setSelectedItem(validData[0]);
          //   if (validData[0].content && validData[0].content.length > 0) {
          //     setExpandedSections([validData[0].content[0].title]);
          //   }
          // }
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error loading acquisition requirements data:', error);
        setError('과세요건 데이터를 불러오는 중 오류가 발생했습니다.');
        toast.error('과세요건 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemSelect = (item: AcquisitionRequirementsData) => {
    setSelectedItem(item);
    setExpandedSections([]);
    setExpandedSubSections([]);
    
    // 선택한 항목의 첫 번째 섹션 자동 확장
    if (item.content && item.content.length > 0) {
      setExpandedSections([item.content[0].title]);
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setExpandedSections([]);
    setExpandedSubSections([]);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const toggleSubSection = (subSectionTitle: string) => {
    setExpandedSubSections(prev => 
      prev.includes(subSectionTitle) 
        ? prev.filter(title => title !== subSectionTitle)
        : [...prev, subSectionTitle]
    );
  };

  const isContentTextArray = (content: any): content is ContentText[] => {
    return Array.isArray(content) && content.length > 0 && 'text' in content[0];
  };

  const renderContent = (items: ContentText[] | ContentItem[], level: number = 0) => {
    if (isContentTextArray(items)) {
      // ContentText 배열 렌더링
      return (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg">
              <div 
                className="text-m text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
              {item.basis && item.basis.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">관련 규정: </span>
                    {item.basis.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      // ContentItem 배열 렌더링 (중첩된 구조)
      return (
        <div className="space-y-3">
          {(items as ContentItem[]).map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleSubSection(item.title)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                  {item.description && (
                    <div 
                      className="text-sm text-gray-600 mt-1"
                      dangerouslySetInnerHTML={{ __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  {expandedSubSections.includes(item.title) ? (
                    <FiChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <FiChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedSubSections.includes(item.title) && item.content && (
                <div className="px-4 pb-4">
                  {renderContent(item.content, level + 1)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || dataList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
        <p className="text-gray-600 mb-4">{error || '데이터가 없습니다.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selectedItem ? (
        // 카드 목록 표시
        <>
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FiBookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">취득세 과세요건</h1>
                <p className="text-gray-600 mt-1">취득세 과세요건에 대한 상세 정보를 확인하실 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 항목 선택 카드 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">항목 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataList.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemSelect(item)}
                  className="p-4 rounded-lg border-2 transition-all hover:shadow-md border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <FiFileText className="h-6 w-6 mr-3 flex-shrink-0 text-gray-400" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm mt-1 line-clamp-2 text-gray-600">
                        {item.description?.replace(/\*\*/g, '')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>주의:</strong> 실제 과세요건 판단 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.
                개별 사안의 특수성에 따라 과세요건의 적용이 달라질 수 있으므로, 전문가의 상담을 받으시기 바랍니다.
              </p>
            </div>
          </div>
        </>
      ) : (
        // 선택된 항목의 상세 내용 표시
        <>
          {/* Back 버튼과 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToList}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                목록으로 돌아가기
              </button>
            </div>
          </div>

          {/* 선택된 항목 헤더 */}
          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="flex items-center">
              <FiBookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-blue-900">{selectedItem.title}</h1>
                <div 
                  className="text-gray-700 mt-2"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedItem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }}
                />
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="space-y-4">
            {selectedItem.content.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* 섹션 헤더 */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    {section.description && (
                      <p className="text-gray-600 mt-1">{section.description}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {expandedSections.includes(section.title) ? (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* 섹션 내용 */}
                {expandedSections.includes(section.title) && section.content && (
                  <div className="border-t border-gray-200 p-6">
                    {renderContent(section.content)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>주의:</strong> 실제 과세요건 판단 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.
                개별 사안의 특수성에 따라 과세요건의 적용이 달라질 수 있으므로, 전문가의 상담을 받으시기 바랍니다.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AcquisitionRequirements;