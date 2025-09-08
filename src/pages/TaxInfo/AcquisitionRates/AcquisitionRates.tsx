import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiRefreshCw, FiFileText } from 'react-icons/fi'; //imoji

import React, { useMemo, useState } from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import { TaxService } from '@/services/taxService'; //json Loader
import toast from 'react-hot-toast';

interface TaxRateRow {
  구분: string;
  지역: string;
  주택수: string;
  가격대: string;
  면적: string;
  취득세: string;
  지방교육세: string;
  농특세: string;
  합계: string;
  비고: string;
  legal_basis?: string[];
  취득세_legal_basis?: string[];
  지방교육세_legal_basis?: string[];
  농특세_legal_basis?: string[];
  subRows?: TaxRateRow[];
}

interface FilterState {
  납세자구분: string;
  부동산종류: string;
  거래유형: string;
  지역구분?: string;
  주택수?: string;
}

interface TooltipProps {
  content: string[];
  children: React.ReactNode;
}

// 필터 옵션 상수 정의
const FILTER_OPTIONS = {
  납세자구분: ['개인', '법인', '비영리사업자'],
  거래유형: ['유상', '상속', '증여'],
  지역구분: [
    { label: '조정대상지역', value: '조정' },
    { label: '비조정대상지역', value: '비조정' }
  ],
  부동산종류: ['주택', '토지건물', '농지'],
  주택수: ['1주택', '다주택']
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content || content.length === 0) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative inline-block cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg max-w-xs bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="space-y-1">
            {content.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          {/* 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

const AcquisitionRates: React.FC = () => {
  const { data: taxData, isLoading, error } = useTaxData();

  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterState>({
    납세자구분: '',
    부동산종류: '',
    거래유형: '',
    지역구분: '',
    주택수: ''
  });

  // 필터 리셋 함수
  const resetFilters = () => {
    setFilters({
      납세자구분: '',
      부동산종류: '',
      거래유형: '',
      지역구분: '',
      주택수: ''
    });
  };

  // 필터 업데이트 함수
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? '' : value // 같은 버튼 클릭시 토글
      };

      // 부동산종류가 주택이 아니면 지역구분과 주택수 초기화
      if (key === '부동산종류' && value !== '주택') {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      // 부동산종류가 비어있으면 지역구분과 주택수 초기화
      if (key === '부동산종류' && prev[key] === value) {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      return newFilters;
    });
  };

  // 데이터를 표 형식으로 변환하는 함수
  const tableData = useMemo(() => {
    if (!taxData || !Array.isArray(taxData)) return [];

    if (!taxData || taxData.length === 0) {
      console.log('❌ taxData가 없거나 빈 배열입니다');
      return [];
    }

    const rows: TaxRateRow[] = [];

    // 세율 데이터 추출
    const extractTaxRates = (details: any[], parentLegalBasisData?: any[], centralLegalBasis?: any[]) => {
      const rates = {
        취득세: '',
        지방교육세: '',
        농특세: '',
        합계: '',
        취득세_legal_basis: [] as string[],
        지방교육세_legal_basis: [] as string[],
        농특세_legal_basis: [] as string[]
      };

      details.forEach((detail: any) => {
        if (detail.title === '취득세') {
          rates.취득세 = detail.content;
          // legal_basis 처리
          if (detail.legal_basis && detail.legal_basis !== '') {
            const legalDataToUse = centralLegalBasis || parentLegalBasisData;
            if (legalDataToUse) {
              const basisInfo = TaxService.parseLegalBasisInfo(legalDataToUse, detail.legal_basis);
              rates.취득세_legal_basis = basisInfo || [];
            } else if (Array.isArray(detail.legal_basis)) {
              rates.취득세_legal_basis = detail.legal_basis;
            }
          }
        } else if (detail.title === '지방교육세') {
          rates.지방교육세 = detail.content;
          // legal_basis 처리
          if (detail.legal_basis && detail.legal_basis !== '') {
            const legalDataToUse = centralLegalBasis || parentLegalBasisData;
            if (legalDataToUse) {
              const basisInfo = TaxService.parseLegalBasisInfo(legalDataToUse, detail.legal_basis);
              rates.지방교육세_legal_basis = basisInfo || [];
            } else if (Array.isArray(detail.legal_basis)) {
              rates.지방교육세_legal_basis = detail.legal_basis;
            }
          }
        } else if (detail.title === '농특세') {
          rates.농특세 = detail.content;
          // legal_basis 처리
          if (detail.legal_basis && detail.legal_basis !== '') {
            const legalDataToUse = centralLegalBasis || parentLegalBasisData;
            if (legalDataToUse) {
              const basisInfo = TaxService.parseLegalBasisInfo(legalDataToUse, detail.legal_basis);
              rates.농특세_legal_basis = basisInfo || [];
            } else if (Array.isArray(detail.legal_basis)) {
              rates.농특세_legal_basis = detail.legal_basis;
            }
          }
        } else if (detail.title === '합계') {
          rates.합계 = detail.content;
        }
      });

      return rates;
    };

    // 재귀적으로 데이터 구조를 파싱하는 함수
    const parseDataRecursively = (data: any, context: any = {}, depth: number = 0) => {
      // 먼저 현재 데이터의 title을 기준으로 컨텍스트 업데이트
      const currentContext = { ...context };
      if (data.title && (data.title.includes('6억원') || data.title === '9억원 초과')) {
        currentContext.가격대 = data.title;
      } else if (data.title && data.title.includes('㎡')) {
        currentContext.면적 = data.title;
      }



      // 세율 데이터가 있는지 확인 (취득세, 지방교육세, 농특세, 합계가 모두 있는 배열)
      if (Array.isArray(data.content) && data.content.some((d: any) => d.title === '취득세')) {
        const rates = extractTaxRates(data.content, currentContext.originalLegalBasis, currentContext.centralLegalBasis);
        const newRow = {
          구분: currentContext.구분 || '개인 취득세',
          지역: currentContext.지역 || '',
          주택수: currentContext.주택수 || '',
          가격대: currentContext.가격대 || '',
          면적: currentContext.면적 || '',
          취득세: rates.취득세,
          지방교육세: rates.지방교육세,
          농특세: rates.농특세,
          합계: rates.합계,
          비고: data.content || '',
          legal_basis: Array.isArray(data.legal_basis) ? data.legal_basis :
            Array.isArray(currentContext.legal_basis) ? currentContext.legal_basis : [],
          취득세_legal_basis: rates.취득세_legal_basis,
          지방교육세_legal_basis: rates.지방교육세_legal_basis,
          농특세_legal_basis: rates.농특세_legal_basis
        };


        rows.push(newRow);
        return;
      }

      // 하위 구조가 있으면 계속 파싱
      if (data.content && Array.isArray(data.content)) {
        data.content.forEach((detail: any) => {
          parseDataRecursively(detail, currentContext, depth + 1);
        });
      }
    };


    taxData.forEach((section: any) => {
      // 현재 section이 어떤 구분인지 결정 (originalCase를 사용)
      const originalCase = section.originalCase;
      const 구분 = originalCase || '개인 취득세';


      // 해당 원본 파일의 legal_basis 찾기
      const originalFileLegalBasis = section.originalLegalBasis || [];
      const centralLegalBasis = section.centralLegalBasis || [];

      if (section.content && Array.isArray(section.content)) {
        section.content.forEach((subsection: any) => {
          let 지역 = section.title || '';
          let 주택수 = subsection.title || '';
          let 부동산종류 = '';

          // 모든 데이터 타입에 대해 동일한 원칙 적용
          // case 이름에서 부동산 종류 추출
          if (구분.includes('주택')) {
            부동산종류 = '주택';
          } else if (구분.includes('토지건물')) {
            부동산종류 = '토지건물';
          } else if (구분.includes('농지')) {
            부동산종류 = '농지';
          }



          const subsectionContext = {
            구분: 구분,
            지역: 지역,
            주택수: 주택수,
            부동산종류: 부동산종류,
            legal_basis: Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
              Array.isArray(section.legal_basis) ? section.legal_basis :
                originalFileLegalBasis,
            originalLegalBasis: originalFileLegalBasis,
            centralLegalBasis: centralLegalBasis
          };

          // subsection에 바로 세율 데이터가 있는지 확인 (2주택, 3주택 등의 경우)
          if (Array.isArray(subsection.content) && subsection.content.some((d: any) => d.title === '취득세')) {
            const rates = extractTaxRates(subsection.content, originalFileLegalBasis, centralLegalBasis);
            rows.push({
              구분: 구분,
              지역: section.title.includes('조정') ? section.title : '',
              주택수: subsection.title,
              가격대: '',
              면적: '',
              취득세: rates.취득세,
              지방교육세: rates.지방교육세,
              농특세: rates.농특세,
              합계: rates.합계,
              비고: subsection.content || '',
              legal_basis: Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
                Array.isArray(section.legal_basis) ? section.legal_basis :
                  originalFileLegalBasis,
              취득세_legal_basis: rates.취득세_legal_basis,
              지방교육세_legal_basis: rates.지방교육세_legal_basis,
              농특세_legal_basis: rates.농특세_legal_basis
            });
          } else {
            // 복잡한 구조인 경우 재귀 파싱 (1주택의 경우)
            parseDataRecursively(subsection, subsectionContext, 1);
          }
        });
      }
    });


    // 디버그: 처리된 rows 확인
    console.log('📊 총 생성된 rows:', rows.length);
    const inheritanceRows = rows.filter(row => row.구분.includes('상속'));
    console.log('🔍 상속 관련 rows:', inheritanceRows.length);
    inheritanceRows.forEach((row, index) => {
      console.log(`  ${index + 1}. 구분: "${row.구분}", 지역: "${row.지역}", 주택수: "${row.주택수}", 면적: "${row.면적}"`);
      // 토지건물 row 상세 정보
      if (row.구분.includes('토지건물')) {
        console.log('    🎯 토지건물 row 상세:', {
          구분: row.구분,
          지역: row.지역,
          주택수: row.주택수,
          가격대: row.가격대,
          면적: row.면적
        });
      }
    });

    // 면적별 그룹핑을 위한 데이터 구조 변환
    console.log('🔄 groupedRows 변환 시작...');
    const groupedRows = rows.reduce((acc: any[], row) => {
      // 토지건물/농지외 행 처리 로그
      if (row.구분.includes('토지건물') || row.구분.includes('농지외')) {
        console.log('🔄 토지건물/농지외 그룹핑 처리:', row);
      }
      // 같은 비고(구분, 지역, 주택수, 가격대)으로 그룹 찾기 (구분 추가로 케이스별 분리)
      const groupKey = `${row.구분}_${row.지역}_${row.주택수}_${row.가격대}`;
      let existingGroup = acc.find(group => group.groupKey === groupKey);

      if (!existingGroup) {
        // 새 그룹 생성
        existingGroup = {
          groupKey,
          구분: row.구분,
          지역: row.지역,
          주택수: row.주택수,
          가격대: row.가격대,
          비고: row.비고,
          legal_basis: Array.isArray(row.legal_basis) && row.legal_basis.length > 0 ? row.legal_basis :
            [],
          subRows: []
        };
        acc.push(existingGroup);
      }

      // 서브행에 면적별 세율 정보 및 legal_basis 정보 추가
      existingGroup.subRows.push({
        면적: row.면적,
        취득세: row.취득세,
        지방교육세: row.지방교육세,
        농특세: row.농특세,
        합계: row.합계,
        취득세_legal_basis: row.취득세_legal_basis,
        지방교육세_legal_basis: row.지방교육세_legal_basis,
        농특세_legal_basis: row.농특세_legal_basis
      });

      return acc;
    }, []);

    console.log('📊 최종 groupedRows:', groupedRows.length);
    const inheritanceGroups = groupedRows.filter(group => group.구분.includes('상속'));
    console.log('🔍 상속 관련 groups:', inheritanceGroups.length);
    inheritanceGroups.forEach((group, index) => {
      console.log(`  ${index + 1}. 구분: "${group.구분}", groupKey: "${group.groupKey}"`);
      // 토지건물 그룹 발견시 상세 로그
      if (group.구분.includes('토지건물')) {
        console.log('    🎯 토지건물 그룹 발견!', group);
      }
    });

    return groupedRows;
  }, [taxData]);

  // 필터링된 데이터
  const filteredData: TaxRateRow[] = useMemo(() => {
    console.log('🔍 현재 필터:', filters);

    if (!filters.납세자구분 && !filters.부동산종류 && !filters.거래유형 && !filters.지역구분 && !filters.주택수) {
      console.log('✅ 필터 없음 - 모든 데이터 반환');
      return tableData; // 필터가 없으면 모든 데이터 반환
    }

    return tableData.filter(group => {
      let matches = true;

      // 납세자 구분 필터링
      if (filters.납세자구분 && !group.구분.includes(filters.납세자구분)) {
        matches = false;
      }

      // 부동산 종류 필터링
      if (filters.부동산종류) {
        if (filters.부동산종류 === '농지') {
          // "농지" 필터링: "농지"는 포함하되 "농지외"와 "토지건물"은 제외
          if (!group.구분.includes('농지') || group.구분.includes('농지외') || group.구분.includes('토지건물')) matches = false;
        } else if (filters.부동산종류 === '토지건물') {
          // "토지건물" 필터링: "토지건물"만 포함
          if (!group.구분.includes('토지건물')) matches = false;
        } else if (filters.부동산종류 === '농지외') {
          // "농지외" 필터링: "농지외"만 포함 (하위호환성)
          if (!group.구분.includes('농지외')) matches = false;
        } else if (!group.구분.includes(filters.부동산종류)) {
          matches = false;
        }
      }

      // 거래 유형 필터링
      if (filters.거래유형 && !group.구분.includes(filters.거래유형)) {
        matches = false;
      }

      // 지역 구분 필터링 (주택일 때만)
      if (filters.지역구분 && filters.부동산종류 === '주택') {
        if (filters.지역구분 === '조정' && group.지역 !== '조정대상지역') matches = false;
        if (filters.지역구분 === '비조정' && group.지역 === '조정대상지역') matches = false;
      }

      // 주택수 필터링 (주택일 때만)
      if (filters.주택수 && filters.부동산종류 === '주택') {
        if (filters.주택수 === '1주택' && !group.주택수.includes('1주택')) matches = false;
        if (filters.주택수 === '다주택' && group.주택수.includes('1주택')) matches = false;
      }

      // 상속 토지건물/농지외 디버깅
      if (group.구분.includes('토지건물') || group.구분.includes('농지외')) {
        console.log('🔍 토지건물/농지외 필터링 체크:', {
          구분: group.구분,
          matches: matches,
          부동산종류필터: filters.부동산종류,
          거래유형필터: filters.거래유형
        });
      }

      return matches;
    });

    return filteredData;
  }, [tableData, filters]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    toast.error('취득세 세율 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
        <p className="text-gray-600 mb-4">취득세 세율 정보를 불러올 수 없습니다.</p>
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
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <FiFileText className="h-8 w-8 text-blue-600   mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              취득세 세율
            </h1>
          </div>

        </div>
      </div>

      {/* 쿼리 필터 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">

          {/* 납세자 구분 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.납세자구분.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('납세자구분', option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.납세자구분 === option
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 거래 유형 필터 옵션*/}
          <div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.거래유형.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('거래유형', option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.거래유형 === option
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 부동산 종류 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.부동산종류.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('부동산종류', option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.부동산종류 === option
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 주택 선택 시 추가 필터 옵션 */}
          {filters.부동산종류 === '주택' && (
            <div className="space-y-4 pl-4 border-l-4 border-green-200">
              {/* 지역 구분 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.지역구분.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('지역구분', option.value)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.지역구분 === option.value
                        ? 'bg-yellow-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 주택수 구분 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.주택수.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFilter('주택수', option)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.주택수 === option
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>


        {/* 필터 초기화 및 현재 필터 현황 */}
        <div className="flex items-center gap-4 mb-2 mt-2">

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            필터 초기화
          </button>

          {/* 활성 필터 표시 */}
          {(filters.납세자구분 || filters.부동산종류 || filters.거래유형 || filters.지역구분 || filters.주택수) && (
            <div className="p-3 bg-blue-50 rounded-md">

              <div className="flex flex-wrap gap-2">
                {filters.납세자구분 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.납세자구분}
                  </span>
                )}
                {filters.부동산종류 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filters.부동산종류}
                  </span>
                )}
                {filters.지역구분 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {filters.지역구분 === '조정' ? '조정대상지역' : '비조정대상지역'}
                  </span>
                )}
                {filters.주택수 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {filters.주택수}
                  </span>
                )}
                {filters.거래유형 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.거래유형}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 세율 표 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead className="bg-blue-200">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주택수</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격대</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">면적</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">합계</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취득세</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지방교육세</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">농특세</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((group, groupIndex) => {
                // 그룹별로 배경색 결정 (두 가지 색상으로 번갈아 표시)
                const isEven = groupIndex % 2 === 0;
                const groupBgColor = isEven ? 'bg-white' : 'bg-gray-50';
                const groupCellBgColor = isEven ? 'bg-gray-100' : 'bg-gray-200';

                return (group.subRows || []).map((subRow: any, subIndex: number) => (
                  <tr key={`${groupIndex}-${subIndex}`} className={groupBgColor}>
                    {/* 첫 번째 서브행에만 그룹 정보 표시 (rowspan 적용) */}
                    {subIndex === 0 && (
                      <>
                        <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.구분}</td>
                        <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor}`}>
                          {group.지역 && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${group.지역 === '조정대상지역'
                              ? 'bg-red-200 text-red-900'
                              : 'bg-green-200 text-green-900'
                              }`}>
                              {group.지역}
                            </span>
                          )}
                        </td>
                        <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.주택수}</td>
                        <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.가격대}</td>
                      </>
                    )}
                    {/* 면적과 세율 정보는 각 서브행마다 표시 */}
                    <td className={`px-2 py-4 text-sm text-gray-900 font-medium ${groupCellBgColor} break-words`}>
                      {subRow.면적 || ((group.subRows?.length || 1) === 1 ? '-' : '')}
                    </td>
                    <td className={`px-2 py-4 text-sm font-bold text-purple-600 border border-purple-200 ${groupCellBgColor} relative break-words`}>
                      <div className="flex items-center justify-between">
                        <span>{subRow.합계}</span>
                      </div>
                    </td>
                    <td className={`px-2 py-4 text-sm font-semibold text-blue-600 ${groupCellBgColor} break-words`}>
                      <Tooltip content={subRow.취득세_legal_basis || []}>
                        {subRow.취득세}
                      </Tooltip>
                    </td>
                    <td className={`px-2 py-4 text-sm font-semibold text-green-600 ${groupCellBgColor} break-words`}>
                      <Tooltip content={subRow.지방교육세_legal_basis || []}>
                        {subRow.지방교육세}
                      </Tooltip>
                    </td>
                    <td className={`px-2 py-4 text-sm font-semibold text-orange-600 ${groupCellBgColor} break-words`}>
                      <Tooltip content={subRow.농특세_legal_basis || []}>
                        {subRow.농특세}
                      </Tooltip>
                    </td>

                    {/* 비고는 첫 번째 서브행에만 표시 */}
                    {subIndex === 0 && (
                      <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-500 border-l border-gray-200 ${groupCellBgColor} break-words`} title={group.비고}></td>
                    )}
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 범례 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">범례 및 주의사항</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">지역 구분</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                  조정대상지역
                </span>
                <span className="text-sm text-gray-600">강남구, 서초구, 송파구,용산구</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  조정대상지역 외
                </span>
                <span className="text-sm text-gray-600">일반 지역</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">세율 색상</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">취득세</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">지방교육세</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">농어촌특별세</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600 font-bold">합계세액</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>주의:</strong> 실제 세율 적용 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.
            특례나 감면 적용 여부에 따라 실제 부담세액이 달라질 수 있습니다.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AcquisitionRates;