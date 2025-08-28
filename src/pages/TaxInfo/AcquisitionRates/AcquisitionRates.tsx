import React, { useMemo, useState } from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiPercent, FiRefreshCw } from 'react-icons/fi';
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
  조건: string;
  legal_basis?: string[];
}

interface FilterState {
  납세자구분: string;
  부동산종류: string;
  거래유형: string;
}

const AcquisitionRates: React.FC = () => {
  const { data: taxData, isLoading, error } = useTaxData();

  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterState>({
    납세자구분: '',
    부동산종류: '',
    거래유형: ''
  });

  // 필터 리셋 함수
  const resetFilters = () => {
    setFilters({
      납세자구분: '',
      부동산종류: '',
      거래유형: ''
    });
  };

  // 필터 업데이트 함수
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value // 같은 버튼 클릭시 토글
    }));
  };

  // 새로운 tax_rates 구조에서 데이터를 표 형식으로 변환하는 함수
  const tableData = useMemo(() => {
    if (!taxData?.sections) return [];

    if (!taxData || !taxData.sections) {
      console.log('❌ taxData 또는 sections가 없습니다');
      return [];
    }
    console.log('=== 주택 세율 파싱 시작 ===', `총 ${taxData.sections.length}개 섹션`);

    const rows: TaxRateRow[] = [];

    // 새로운 구조에서 세율 데이터 추출
    const extractTaxRates = (details: any[]) => {
      const rates = {
        취득세: '',
        지방교육세: '',
        농특세: '',
        합계: ''
      };

      details.forEach((detail: any) => {
        if (detail.title === '취득세') {
          rates.취득세 = detail.details;
        } else if (detail.title === '지방교육세') {
          rates.지방교육세 = detail.details;
        } else if (detail.title === '농특세') {
          rates.농특세 = detail.details;
        } else if (detail.title === '합계') {
          rates.합계 = detail.details;
        }
      });

      return rates;
    };

    // 재귀적으로 데이터 구조를 파싱하는 함수
    const parseDataRecursively = (data: any, context: any = {}) => {
      // 먼저 현재 데이터의 title을 기준으로 컨텍스트 업데이트
      const currentContext = { ...context };
      if (data.title && (data.title.includes('6억원') || data.title === '9억원 초과')) {
        currentContext.가격대 = data.title;
      } else if (data.title && data.title.includes('㎡')) {
        currentContext.면적 = data.title;
      }

      // 세율 데이터가 있는지 확인 (취득세, 지방교육세, 농특세, 합계가 모두 있는 배열)
      if (Array.isArray(data.details) && data.details.some((d: any) => d.title === '취득세')) {
        const rates = extractTaxRates(data.details);
        console.log('✓ 세율 발견:', data.title, '→', currentContext, rates);
        rows.push({
          구분: currentContext.구분 || '개인 취득세',
          지역: currentContext.지역 || '',
          주택수: currentContext.주택수 || '',
          가격대: currentContext.가격대 || '',
          면적: currentContext.면적 || '',
          취득세: rates.취득세,
          지방교육세: rates.지방교육세,
          농특세: rates.농특세,
          합계: rates.합계,
          조건: data.content || '',
          legal_basis: Array.isArray(data.legal_basis) ? data.legal_basis :
            Array.isArray(currentContext.legal_basis) ? currentContext.legal_basis : []
        });
        return;
      }

      // 하위 구조가 있으면 계속 파싱
      if (data.details && Array.isArray(data.details)) {
        data.details.forEach((detail: any) => {
          parseDataRecursively(detail, currentContext);
        });
      }
    };

    // topic별로 데이터 파싱 (여러 개인 세율 파일의 데이터 처리)
    const topicMap: { [key: string]: string } = {
      '개인 주택 유상취득 세율': '개인 주택 유상취득',
      '개인 일반 건물 취득 세율': '개인 건물 취득',
      '개인 농지 유상취득 세율': '개인 농지 취득',
      '특수 유상취득 세율': '개인 특수 유상취득',
      '무상취득 세율': '개인 무상취득',
      '원시취득 세율': '개인 원시취득',
      '개인 주택 증여 세율': '개인 주택 증여',
      '개인 주택 상속 세율': '개인 주택 상속'
    };

    taxData.sections.forEach((section: any) => {
      console.log(`📂 ${section.title} 섹션 처리 중...`, 'section.legal_basis:', section.legal_basis);

      // 현재 section이 어떤 구분인지 결정 (originalTopic 기반)
      const originalTopic = section.originalTopic || taxData.topic;
      const 구분 = topicMap[originalTopic] || originalTopic || '개인 취득세';

      // 해당 원본 파일의 legal_basis 찾기
      const originalFileLegalBasis = taxData.legal_references || [];
      console.log('원본 파일 legal_basis:', originalFileLegalBasis);

      if (section.subsections) {
        section.subsections.forEach((subsection: any) => {
          console.log(`  📋 ${subsection.title} 하위섹션, legal_basis:`, subsection.legal_basis);
          const subsectionContext = {
            구분: 구분,
            지역: section.title, // 조정대상지역 또는 조정대상지역 외 (주택의 경우)
            주택수: subsection.title, // 1주택, 2주택, 3주택 등
            legal_basis: Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
              Array.isArray(section.legal_basis) ? section.legal_basis :
                originalFileLegalBasis
          };

          // subsection에 바로 세율 데이터가 있는지 확인 (2주택, 3주택 등의 경우)
          if (Array.isArray(subsection.details) && subsection.details.some((d: any) => d.title === '취득세')) {
            const rates = extractTaxRates(subsection.details);
            console.log(`✓ 직접 세율: ${subsection.title} →`, rates);
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
              조건: subsection.content || '',
              legal_basis: Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
                Array.isArray(section.legal_basis) ? section.legal_basis :
                  originalFileLegalBasis
            });
          } else {
            // 복잡한 구조인 경우 재귀 파싱 (1주택의 경우)
            console.log(`🔍 ${subsection.title} 하위 구조 파싱...`);
            parseDataRecursively(subsection, subsectionContext);
          }
        });
      }
    });

    console.log(`🎉 파싱 완료: 총 ${rows.length}개의 주택 세율 발견`);

    // 면적별 그룹핑을 위한 데이터 구조 변환
    const groupedRows = rows.reduce((acc: any[], row) => {
      // 같은 조건(지역, 주택수, 가격대)으로 그룹 찾기
      const groupKey = `${row.지역}_${row.주택수}_${row.가격대}`;
      let existingGroup = acc.find(group => group.groupKey === groupKey);

      if (!existingGroup) {
        // 새 그룹 생성
        existingGroup = {
          groupKey,
          구분: row.구분,
          지역: row.지역,
          주택수: row.주택수,
          가격대: row.가격대,
          조건: row.조건,
          legal_basis: Array.isArray(row.legal_basis) && row.legal_basis.length > 0 ? row.legal_basis :
            ['지방세법 제11조 (취득세의 세율)', '지방세법 제15조 (세율의 특례)'],
          subRows: []
        };
        acc.push(existingGroup);
      }

      // 서브행에 면적별 세율 정보 추가
      existingGroup.subRows.push({
        면적: row.면적,
        취득세: row.취득세,
        지방교육세: row.지방교육세,
        농특세: row.농특세,
        합계: row.합계
      });

      return acc;
    }, []);

    console.log('그룹핑된 데이터:', groupedRows);
    console.log('첫 번째 그룹의 legal_basis:', groupedRows[0]?.legal_basis);
    return groupedRows;
  }, [taxData]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!filters.납세자구분 && !filters.부동산종류 && !filters.거래유형) {
      return tableData; // 필터가 없으면 모든 데이터 반환
    }

    return tableData.filter(group => {
      let matches = true;

      // 납세자 구분 필터링
      if (filters.납세자구분) {
        if (filters.납세자구분 === '개인' && !group.구분.includes('개인')) matches = false;
        if (filters.납세자구분 === '법인' && !group.구분.includes('법인')) matches = false;
      }

      // 부동산 종류 필터링
      if (filters.부동산종류) {
        if (filters.부동산종류 === '주택' && !group.구분.includes('주택')) matches = false;
        if (filters.부동산종류 === '건물' && !group.구분.includes('건물')) matches = false;
        if (filters.부동산종류 === '토지' && !group.구분.includes('토지')) matches = false;
        if (filters.부동산종류 === '농지' && !group.구분.includes('농지')) matches = false;
      }

      // 거래 유형 필터링
      if (filters.거래유형) {
        if (filters.거래유형 === '유상' && !group.구분.includes('유상')) matches = false;
        if (filters.거래유형 === '무상' && !group.구분.includes('무상')) matches = false;
        if (filters.거래유형 === '상속' && !group.구분.includes('상속')) matches = false;
        if (filters.거래유형 === '증여' && !group.구분.includes('증여')) matches = false;
      }

      return matches;
    });
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
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FiPercent className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              취득세 세율 정보
            </h1>
          </div>
        </div>
      </div>

      {/* 쿼리 필터 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-4">

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            필터 초기화
          </button>
        </div>


        <div className="space-y-4">
          {/* 납세자 구분 */}
          <div>

            <div className="flex flex-wrap gap-2">
              {['개인', '법인'].map((option) => (
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

          {/* 부동산 종류 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {['주택', '건물', '토지', '농지'].map((option) => (
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

          {/* 거래 유형 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {['유상', '무상', '상속', '증여'].map((option) => (
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



          {/* 활성 필터 표시 */}
          {(filters.납세자구분 || filters.부동산종류 || filters.거래유형) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">

              <div className="flex flex-wrap gap-2">
                {filters.납세자구분 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    납세자: {filters.납세자구분}
                  </span>
                )}
                {filters.부동산종류 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    부동산: {filters.부동산종류}
                  </span>
                )}
                {filters.거래유형 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    거래: {filters.거래유형}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 세율 표 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">취득세율 상세 정보</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주택수</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격대</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">면적</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취득세</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지방교육세</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">농특세</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">합계</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조건</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((group, groupIndex) => {
                // 그룹별로 배경색 결정 (두 가지 색상으로 번갈아 표시)
                const isEven = groupIndex % 2 === 0;
                const groupBgColor = isEven ? 'bg-white' : 'bg-gray-50';
                const groupCellBgColor = isEven ? 'bg-gray-100' : 'bg-gray-200';

                return group.subRows.map((subRow: any, subIndex: number) => (
                  <tr key={`${groupIndex}-${subIndex}`} className={groupBgColor}>
                    {/* 첫 번째 서브행에만 그룹 정보 표시 (rowspan 적용) */}
                    {subIndex === 0 && (
                      <>
                        <td rowSpan={group.subRows.length} className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 ${groupCellBgColor}`}>{group.구분}</td>
                        <td rowSpan={group.subRows.length} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor}`}>
                          {group.지역 && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.지역 === '조정대상지역'
                              ? 'bg-red-200 text-red-900'
                              : 'bg-green-200 text-green-900'
                              }`}>
                              {group.지역}
                            </span>
                          )}
                        </td>
                        <td rowSpan={group.subRows.length} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor}`}>{group.주택수}</td>
                        <td rowSpan={group.subRows.length} className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor}`}>{group.가격대}</td>
                      </>
                    )}
                    {/* 면적과 세율 정보는 각 서브행마다 표시 */}
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium ${groupCellBgColor}`}>
                      {subRow.면적 || (group.subRows.length === 1 ? '-' : '')}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 ${groupCellBgColor}`}>{subRow.취득세}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600 ${groupCellBgColor}`}>{subRow.지방교육세}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-semibold text-orange-600 ${groupCellBgColor}`}>{subRow.농특세}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-purple-600 border border-purple-200 ${groupCellBgColor} relative`}>
                      <div className="flex items-center justify-between">
                        <span>{subRow.합계}</span>
                      </div>
                    </td>
                    {/* 조건은 첫 번째 서브행에만 표시 */}
                    {subIndex === 0 && (
                      <td rowSpan={group.subRows.length} className={`px-4 py-4 text-sm text-gray-500 max-w-xs truncate border-l border-gray-200 ${groupCellBgColor}`} title={group.조건}>{group.조건}</td>
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
                <span className="text-sm text-gray-600">투기과열지구, 조정대상지역</span>
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
                <span className="text-sm text-gray-600 font-bold">합계 (총 부담세액)</span>
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

      {/* 법적 근거 */}
      {taxData?.legal_basis && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">법적 근거</h3>
          <ul className="space-y-1">
            {taxData.legal_basis.map((ref: string, index: number) => (
              <li key={index} className="text-sm text-gray-600">• {ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AcquisitionRates;