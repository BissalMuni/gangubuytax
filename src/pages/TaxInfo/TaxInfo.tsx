import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTaxData } from '@/hooks/useTaxData';
import { useTaxStore } from '@/store/useTaxStore';
import { TaxItem, FilterOptions, ViewMode } from '@/types/tax.types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import TaxList from '@/components/tax/TaxList';
import TaxCard from '@/components/tax/TaxCard';
import TaxTable from '@/components/tax/TaxTable';
import { FiList, FiGrid, FiTable } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TaxInfo: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const { data: taxData, isLoading, error } = useTaxData();
  
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
  }, [error]);

  // 데이터 필터링 및 변환
  const filteredItems = useMemo(() => {
    if (!taxData) return [];

    const items: TaxItem[] = [];
    
    function extractItems(obj: any, path: string[] = []): void {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (obj[key]['취득세'] !== undefined) {
            // 세율 정보가 있는 항목
            const item: TaxItem = {
              id: [...path, key].join('-'),
              path: [...path, key],
              name: key,
              data: {
                취득세: obj[key]['취득세'],
                지방교육세: obj[key]['지방교육세'],
                농특세: obj[key]['농특세'],
              },
              category: path[0] || '',
              subcategory: path[1] || '',
            };

            // 필터링 조건 확인
            let shouldInclude = true;

            if (filters.category === 'acquisition' && filters.type !== 'all') {
              shouldInclude = item.category === filters.type;
            } else if (filters.category === 'rate') {
              shouldInclude = item.data[filters.type as keyof typeof item.data] !== undefined;
            } else if (filters.category === 'standard') {
              shouldInclude = item.subcategory === filters.type || item.name === filters.type;
            }

            // 검색어 필터
            if (searchTerm && shouldInclude) {
              const searchString = JSON.stringify(item).toLowerCase();
              shouldInclude = searchString.includes(searchTerm.toLowerCase());
            }

            if (shouldInclude) {
              items.push(item);
            }
          } else {
            // 중첩 객체 탐색
            extractItems(obj[key], [...path, key]);
          }
        }
      }
    }

    extractItems(taxData);
    return items;
  }, [taxData, filters, searchTerm]);

  // 페이지네이션 제거 - 모든 아이템 표시
  const displayItems = filteredItems;

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.type === 'all' ? '전체 세금 정보' : filters.type}
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

        {/* 검색 및 필터 */}
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="세금 정보 검색..."
            className="input flex-1"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="input w-48">
            <option value="">전체 기간</option>
            <option value="2024">2024년</option>
            <option value="2023">2023년</option>
          </select>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {displayItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <>
            {viewMode === 'list' && <TaxList items={displayItems} />}
            {viewMode === 'card' && <TaxCard items={displayItems} />}
            {viewMode === 'table' && <TaxTable items={displayItems} />}
          </>
        )}
      </div>
    </div>
  );
};

export default TaxInfo;