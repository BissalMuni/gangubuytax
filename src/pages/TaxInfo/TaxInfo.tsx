import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTaxData, useMarketRecognitionPrice } from '@/hooks/useTaxData';
import { useTaxStore } from '@/store/useTaxStore';
import { TaxItem, FilterOptions, ViewMode, TaxType, ProcessedTaxSection } from '@/types/tax.types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TaxList from '@/components/tax/TaxList';
import TaxCard from '@/components/tax/TaxCard';
import TaxTable from '@/components/tax/TaxTable';
import MarketRecognitionPrice from '@/components/tax/MarketRecognitionPrice';
import { FiList, FiGrid, FiTable } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TaxInfo: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { data: taxData, isLoading, error } = useTaxData();
  const { data: marketRecognitionData, isLoading: isMarketLoading, error: marketError } = useMarketRecognitionPrice();
  
  // 시가인정액 페이지인지 확인
  const isMarketRecognitionPage = category === 'market-recognition-price';
  
  const {
    viewMode,
    filters,
    searchTerm,
    setTaxData,
    setFilters,
    setViewMode,
  } = useTaxStore();

  // 데이터가 로드되면 스토어에 저장
  useEffect(() => {
    if (taxData) {
      setTaxData(taxData);
    }
  }, [taxData, setTaxData]);

  // URL 파라미터에 따른 필터 설정
  useEffect(() => {
    if (category) {
      let newFilters: FilterOptions = { ...filters };
      
      switch (category) {
        case 'paid':
          newFilters = { category: 'acquisition', type: '유상취득' };
          break;
        case 'free':
          newFilters = { category: 'acquisition', type: '무상취득' };
          break;
        case 'original':
          newFilters = { category: 'acquisition', type: '원시취득' };
          break;
        case 'acquisition-tax':
          newFilters = { category: 'rate', type: '취득세' };
          break;
        case 'education-tax':
          newFilters = { category: 'rate', type: '지방교육세' };
          break;
        case 'agricultural-tax':
          newFilters = { category: 'rate', type: '농특세' };
          break;
        case 'housing':
          newFilters = { category: 'standard', type: '주택' };
          break;
        case 'building':
          newFilters = { category: 'standard', type: '건물' };
          break;
        case 'land':
          newFilters = { category: 'standard', type: '토지' };
          break;
        case 'farmland':
          newFilters = { category: 'standard', type: '농지' };
          break;
        case 'market-recognition-price':
          newFilters = { category: 'standard', type: '시가인정액' as TaxType };
          break;
        default:
          newFilters = { category: 'acquisition', type: 'all' };
      }
      
      setFilters(newFilters);
    }
  }, [category, setFilters]);

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast.error('세금 데이터를 불러오는 중 오류가 발생했습니다.');
    }
    if (marketError) {
      toast.error('시가인정액 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  }, [error, marketError]);

  // ProcessedTaxSection[]에서 TaxItem[] 추출
  const extractTaxItemsFromSections = (sections: ProcessedTaxSection[]): TaxItem[] => {
    const items: TaxItem[] = [];

    const extractTaxRatesFromContent = (content: any[]): any => {
      const rates: any = {};
      
      content.forEach((item: any) => {
        if (item.title === '취득세') rates.취득세 = item.content;
        else if (item.title === '지방교육세') rates.지방교육세 = item.content;
        else if (item.title === '농특세') rates.농특세 = item.content;
      });

      return rates;
    };

    const processContent = (content: any[], path: string[], originalCase: string) => {
      content.forEach((item: any) => {
        if (Array.isArray(item.content)) {
          // 세율 데이터인지 확인 (취득세, 지방교육세, 농특세가 모두 있는 배열)
          const hasTaxRates = item.content.some((subItem: any) => 
            ['취득세', '지방교육세', '농특세'].includes(subItem.title)
          );

          if (hasTaxRates) {
            const rates = extractTaxRatesFromContent(item.content);
            const taxItem: TaxItem = {
              id: [...path, item.title || item.description || 'unnamed'].join('-'),
              path: [...path, item.title || item.description || 'unnamed'],
              name: item.title || item.description || 'unnamed',
              data: rates,
              category: originalCase,
              subcategory: path.join(' > '),
            };
            items.push(taxItem);
          } else {
            // 더 깊은 레벨 탐색
            processContent(item.content, [...path, item.title || item.description || 'unnamed'], originalCase);
          }
        }
      });
    };

    sections.forEach((section: ProcessedTaxSection) => {
      processContent(section.content, [section.title || section.description], section.originalCase);
    });

    return items;
  };

  // 데이터 필터링 및 변환
  const filteredItems = useMemo(() => {
    if (!taxData || !Array.isArray(taxData)) return [];

    const items = extractTaxItemsFromSections(taxData);

    return items.filter((item: TaxItem) => {
      let shouldInclude = true;

      // 카테고리별 필터링
      if (filters.category === 'acquisition' && filters.type !== 'all') {
        shouldInclude = item.category.includes(filters.type.replace('취득', '')) || 
                      item.category.includes(filters.type);
      } else if (filters.category === 'rate') {
        shouldInclude = item.data[filters.type as keyof typeof item.data] !== undefined;
      } else if (filters.category === 'standard') {
        shouldInclude = item.category.includes(filters.type) || 
                      item.name.includes(filters.type) ||
                      Boolean(item.subcategory && item.subcategory.includes(filters.type));
      }

      // 검색어 필터
      if (searchTerm && shouldInclude) {
        const searchString = JSON.stringify(item).toLowerCase();
        shouldInclude = searchString.includes(searchTerm.toLowerCase());
      }

      return shouldInclude;
    });
  }, [taxData, filters, searchTerm]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 로딩 상태
  if (isMarketRecognitionPage ? isMarketLoading : isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태
  if (isMarketRecognitionPage ? marketError : error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">데이터를 불러올 수 없습니다</div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 시가인정액 페이지인 경우 전용 컴포넌트 렌더링
  if (isMarketRecognitionPage && marketRecognitionData) {
    return <MarketRecognitionPrice data={marketRecognitionData} />;
  }

  // 사용 가능한 카테고리 추출
  const availableCategories = useMemo(() => {
    if (!taxData || !Array.isArray(taxData)) return [];
    
    const categories = new Set<string>();
    taxData.forEach((section: ProcessedTaxSection) => {
      categories.add(section.originalCase);
    });
    
    return Array.from(categories);
  }, [taxData]);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {(filters.type === 'all' ? '전체 세금 정보' : filters.type)}
            </h1>
            <p className="text-gray-600 mt-1">
              총 {filteredItems.length}개의 항목
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="목록형"
            >
              <FiList className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('card')}
              className={`p-2 rounded-md ${
                viewMode === 'card'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="카드형"
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('table')}
              className={`p-2 rounded-md ${
                viewMode === 'table'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="테이블형"
            >
              <FiTable className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 카테고리 필터 버튼 */}
        <div className="mt-6">
          <div className="flex items-start space-x-3">
            <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">카테고리</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilters({ category: 'acquisition', type: 'all' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.type === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setFilters({ category: 'acquisition', type: category as TaxType });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.type === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <>
            {viewMode === 'list' && <TaxList items={filteredItems} />}
            {viewMode === 'card' && <TaxCard items={filteredItems} />}
            {viewMode === 'table' && <TaxTable items={filteredItems} />}
          </>
        )}
      </div>
    </div>
  );
};

export default TaxInfo;