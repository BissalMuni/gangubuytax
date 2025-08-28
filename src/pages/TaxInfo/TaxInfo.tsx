import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaxData, useMarketRecognitionPrice } from '@/hooks/useTaxData';
import { useTaxStore } from '@/store/useTaxStore';
import { TaxItem, FilterOptions, ViewMode, TaxType } from '@/types/tax.types';
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

  // 계층적 필터 상태 관리
  const [selectedAcquisitionType, setSelectedAcquisitionType] = useState<string>('');
  const [selectedSubType, setSelectedSubType] = useState<string>('');
  const [selectedSubSubType, setSelectedSubSubType] = useState<string>('');
  const [availableSubTypes, setAvailableSubTypes] = useState<string[]>([]);
  const [availableSubSubTypes, setAvailableSubSubTypes] = useState<string[]>([]);
  const [availableTaxTypes, setAvailableTaxTypes] = useState<Record<string, string>>({});

  // 데이터가 로드되면 스토어에 저장
  useEffect(() => {
    if (taxData) {
      console.log('Loaded taxData:', taxData); // 디버깅용
      setTaxData(taxData);
    }
  }, [taxData, setTaxData]);

  // 취득 유형 선택 시 하위 유형 업데이트
  useEffect(() => {
    if (selectedAcquisitionType && taxData) {
      const acquisitionData = taxData[selectedAcquisitionType];
      if (acquisitionData && typeof acquisitionData === 'object') {
        const subTypes = Object.keys(acquisitionData).filter(key => 
          typeof acquisitionData[key] === 'object'
        );
        setAvailableSubTypes(subTypes);
        setSelectedSubType('');
        setSelectedSubSubType('');
        setAvailableSubSubTypes([]);
        setAvailableTaxTypes({});
      }
    } else {
      setAvailableSubTypes([]);
      setSelectedSubType('');
      setSelectedSubSubType('');
      setAvailableSubSubTypes([]);
      setAvailableTaxTypes({});
    }
  }, [selectedAcquisitionType, taxData]);

  // 하위 유형 선택 시 하위하위 유형 또는 세금 정보 업데이트
  useEffect(() => {
    if (selectedAcquisitionType && selectedSubType && taxData) {
      const subTypeData = taxData[selectedAcquisitionType]?.[selectedSubType];
      if (subTypeData && typeof subTypeData === 'object') {
        // 세금 정보가 직접 있는지 확인
        if (subTypeData['취득세']) {
          setAvailableTaxTypes(subTypeData as Record<string, string>);
          setAvailableSubSubTypes([]);
        } else {
          // 하위하위 유형이 있는 경우
          const subSubTypes = Object.keys(subTypeData).filter(key => 
            typeof subTypeData[key] === 'object'
          );
          setAvailableSubSubTypes(subSubTypes);
          setAvailableTaxTypes({});
        }
        setSelectedSubSubType('');
      }
    } else {
      setAvailableSubSubTypes([]);
      setAvailableTaxTypes({});
      setSelectedSubSubType('');
    }
  }, [selectedSubType, selectedAcquisitionType, taxData]);

  // 하위하위 유형 선택 시 세금 정보 업데이트
  useEffect(() => {
    if (selectedAcquisitionType && selectedSubType && selectedSubSubType && taxData) {
      const subSubTypeData = taxData[selectedAcquisitionType]?.[selectedSubType]?.[selectedSubSubType];
      if (subSubTypeData && typeof subSubTypeData === 'object') {
        if (subSubTypeData['취득세']) {
          setAvailableTaxTypes(subSubTypeData as Record<string, string>);
        } else {
          // 더 깊은 레벨이 있을 수 있음
          const deepestData = Object.values(subSubTypeData).find(val => 
            typeof val === 'object' && val !== null && (val as any)['취득세']
          );
          if (deepestData) {
            setAvailableTaxTypes(deepestData as Record<string, string>);
          }
        }
      }
    }
  }, [selectedSubSubType, selectedSubType, selectedAcquisitionType, taxData]);

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


  // 로딩 상태 - 시가인정액 페이지인 경우 해당 데이터의 로딩 상태 확인
  if (isMarketRecognitionPage ? isMarketLoading : isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 상태 - 시가인정액 페이지인 경우 해당 데이터의 에러 상태 확인
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {taxData?.topic || (filters.type === 'all' ? '전체 세금 정보' : filters.type)}
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



        {/* 계층적 필터 버튼 네비게이션 */}
        <div className="mt-6 space-y-4">
          {/* 취득 유형 선택 (1단계) */}
          <div className="flex items-start space-x-3">
            <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">취득유형</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedAcquisitionType('');
                  setFilters({ category: 'acquisition', type: 'all' });
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedAcquisitionType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {taxData && Object.keys(taxData).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedAcquisitionType(type);
                    setFilters({ category: 'acquisition', type: type as TaxType });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAcquisitionType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 하위 유형 선택 (2단계 - 취득유형 선택 시 표시) */}
          {availableSubTypes.length > 0 && (
            <div className="flex items-start space-x-3 pl-4 border-l-2 border-blue-200">
              <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">하위유형</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedSubType('');
                    setFilters({ category: 'acquisition', type: selectedAcquisitionType as TaxType });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedSubType
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                {availableSubTypes.map(subType => (
                  <button
                    key={subType}
                    onClick={() => {
                      setSelectedSubType(subType);
                      setFilters({ 
                        category: 'standard', 
                        type: subType as TaxType 
                      });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubType === subType
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subType}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 하위하위 유형 선택 (3단계 - 하위유형 선택 시 표시) */}
          {availableSubSubTypes.length > 0 && (
            <div className="flex items-start space-x-3 pl-8 border-l-2 border-green-200">
              <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">세부유형</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedSubSubType('');
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedSubSubType
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  전체
                </button>
                {availableSubSubTypes.map(subSubType => (
                  <button
                    key={subSubType}
                    onClick={() => {
                      setSelectedSubSubType(subSubType);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSubSubType === subSubType
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subSubType.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 세금 정보 표시 (선택된 항목의 세금 정보) */}
          {Object.keys(availableTaxTypes).length > 0 && (
            <div className="flex items-start space-x-3 pl-8 border-l-2 border-orange-200">
              <span className="text-sm font-medium text-gray-700 min-w-[80px] mt-2">세금정보</span>
              <div className="flex flex-wrap gap-3">
                {Object.entries(availableTaxTypes).map(([taxType, rate]) => (
                  <div 
                    key={taxType}
                    className="px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-300"
                  >
                    <span className="text-sm font-medium text-gray-700">{taxType}: </span>
                    <span className="text-sm font-bold text-orange-600">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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