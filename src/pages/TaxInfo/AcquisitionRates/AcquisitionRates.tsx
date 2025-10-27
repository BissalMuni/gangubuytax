import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiRefreshCw, FiFileText, FiArrowLeft, FiBookOpen } from 'react-icons/fi';

import React, { useMemo, useState } from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import { TaxService } from '@/services/taxService';
import toast from 'react-hot-toast';
import Tooltip from './Tooltip';

interface TaxRateRow {
  납세자: string;
  취득원인: string;
  거래유형: string;
  물건: string;
  물건_description?: string;
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
  납세자: string;
  취득원인: string;
  거래유형: string;
  물건: string;
  지역구분?: string;
  주택수?: string;
}

// 취득세율 케이스 데이터 구조
interface TaxCaseData {
  case: string;
  case_code: string;
  effective_date: string;
  section: any[];
}

// 필터 옵션 상수 정의
const FILTER_OPTIONS = {
  납세자: ['개인', '법인', '비영리사업자'],
  취득원인: ['유상', '무상', '원시', '의제'],
  거래유형: ['매매', '교환', '상속', '증여', '분할', '신축', '과점주주'],
  물건: ['주택', '농지', '농지외', '골프장', '고급오락장', '고급주택'],
  지역구분: [
    { label: '조정대상지역', value: '조정' },
    { label: '비조정대상지역', value: '비조정' }
  ],
  주택수: ['1주택', '2주택', '3주택', '4주택 이상']
};

const AcquisitionRates: React.FC = () => {
  const { data: taxData, isLoading, error } = useTaxData();

  // 케이스별 데이터 상태
  const [selectedCase, setSelectedCase] = useState<TaxCaseData | null>(null);

  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterState>({
    납세자: '',
    취득원인: '',
    거래유형: '',
    물건: '',
    주택수: '',
    지역구분: ''
  });

  // 케이스 목록 데이터 추출
  const casesList = useMemo(() => {
    if (!taxData || !Array.isArray(taxData)) return [];
    console.log("==========전체 taxData 개수:", taxData.length);
    // 원본 데이터에서 케이스별로 그룹화
    const cases: TaxCaseData[] = [];

    taxData.forEach((section: any) => {
      console.log("📌 section.title:", section.title, "| originalCase:", section.originalCase);
      if (section.originalCase) {
        // 같은 케이스가 이미 있는지 확인
        let existingCase = cases.find(c => c.case === section.originalCase);

        if (!existingCase) {
          // 새로운 케이스 생성
          existingCase = {
            case: section.originalCase,
            case_code: section.originalCase.replace(/\s+/g, '_').toLowerCase(),
            effective_date: '2025-09-21',
            section: []
          };
          cases.push(existingCase);
        }

        // 섹션 추가
        existingCase.section.push(section);
      }
    });

    return cases;
  }, [taxData]);

  // 필터 리셋 함수
  const resetFilters = () => {
    setFilters({
      납세자: '',
      취득원인: '',
      거래유형: '',
      물건: '',
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

      // 물건이 주택이 아니면 지역구분과 주택수 초기화
      if (key === '물건' && value !== '주택') {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      // 물건이 비어있으면 지역구분과 주택수 초기화
      if (key === '물건' && prev[key] === value) {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      return newFilters;
    });
  };

  // 케이스 선택 핸들러
  const handleCaseSelect = (caseData: TaxCaseData) => {
    setSelectedCase(caseData);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedCase(null);
  };

  // 데이터를 표 형식으로 변환하는 함수
  const tableData = useMemo(() => {
    if (!selectedCase) return [];

    const rows: TaxRateRow[] = [];
    const addedRows = new Set<string>(); // 중복 체크용

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
      const currentContext = { ...context };

      // console.log(`${'  '.repeat(depth)}🔍 parseData 호출: ${data.title}, 지역=${context.지역}`);

      // 컨텍스트 정보 업데이트
      if (data.title && (data.title.includes('6억원') || data.title === '9억원 초과')) {
        currentContext.가격대 = data.title;
        // console.log(`${'  '.repeat(depth)}  💰 가격대 설정: ${data.title}`);
      } else if (data.title && data.title.includes('㎡')) {
        currentContext.면적 = data.title;
        // console.log(`${'  '.repeat(depth)}  📏 면적 설정: ${data.title}`);
      }

      // 세율 데이터가 있는지 확인
      if (Array.isArray(data.content) && data.content.some((d: any) => d.title === '취득세')) {
        console.log(`${'  '.repeat(depth)}  ✨ 세율 발견! 지역=${currentContext.지역}`);
        const rates = extractTaxRates(data.content, currentContext.originalLegalBasis, currentContext.centralLegalBasis);
        const newRow = {
          납세자: currentContext.납세자 || '',
          취득원인: currentContext.취득원인 || '',
          거래유형: currentContext.거래유형 || '',
          물건: currentContext.물건 || '',
          물건_description: currentContext.물건_description || '',
          지역: currentContext.지역 || '',
          주택수: currentContext.주택수 || '',
          가격대: currentContext.가격대 || '',
          면적: currentContext.면적 || '',
          취득세: rates.취득세,
          지방교육세: rates.지방교육세,
          농특세: rates.농특세,
          합계: rates.합계,
          비고: data.description || '',
          legal_basis: Array.isArray(data.legal_basis) ? data.legal_basis :
            Array.isArray(currentContext.legal_basis) ? currentContext.legal_basis : [],
          취득세_legal_basis: rates.취득세_legal_basis,
          지방교육세_legal_basis: rates.지방교육세_legal_basis,
          농특세_legal_basis: rates.농특세_legal_basis
        };

        // 중복 체크를 위한 키 생성
        const rowKey = `${newRow.납세자}_${newRow.취득원인}_${newRow.거래유형}_${newRow.물건}_${newRow.지역}_${newRow.가격대}_${newRow.면적}`;

        console.log('새로운 행 생성:', newRow); // 디버깅 로그

        // 중복이 아닌 경우에만 추가
        if (!addedRows.has(rowKey)) {
          addedRows.add(rowKey);
          rows.push(newRow);
          console.log('행 추가됨:', rowKey); // 디버깅 로그
        } else {
          console.log('중복으로 제외됨:', rowKey); // 디버깅 로그
        }
        // return 제거 - forEach 루프를 계속 진행해야 함
      }

      // 하위 구조가 있으면 계속 파싱
      if (data.content && Array.isArray(data.content)) {
        data.content.forEach((detail: any) => {
          parseDataRecursively(detail, currentContext, depth + 1);
        });
      }
    };

    // 선택된 케이스의 섹션들 파싱
    selectedCase.section.forEach((section: any) => {
      const 구분 = selectedCase.case;
      const originalFileLegalBasis = section.originalLegalBasis || [];
      const centralLegalBasis = section.centralLegalBasis || [];

      // console.log('🔵 섹션 파싱 시작:', section.title);

      if (section.content && Array.isArray(section.content)) {
        section.content.forEach((subsection: any) => {
          // console.log('  🟢 subsection:', subsection.title);
          // 데이터 구조에서 정보 추출
          let 납세자 = section.title || '';
          let 취득원인 = subsection.title || '';
          let 거래유형 = '';
          let 물건 = '';
          let 주택수 = '';  // 주택수 정보도 더 깊은 레벨에서 추출

          // 거래유형 추출: subsection의 content에서 거래유형 찾기
          if (subsection.content && Array.isArray(subsection.content)) {
            // subsection.content의 첫 번째 항목이 거래유형 (매매, 교환, 증여 등)
            const 거래유형항목 = subsection.content[0];
            if (거래유형항목 && 거래유형항목.title) {
              거래유형 = 거래유형항목.title;
            }
          }

          // 취득원인에서 거래유형 추출
          if (취득원인 === '유상') {
            취득원인 = '유상';
          } else if (취득원인 === '무상') {
            취득원인 = '무상';
          } else if (취득원인 === '원시') {
            취득원인 = '원시';
          } else if (취득원인 === '의제') {
            취득원인 = '의제';
          }

          // case 이름에서 물건 종류 추출
          if (구분.includes('주택')) {
            물건 = '주택';
          } else if (구분.includes('농지외')) {
            물건 = '농지외';
          } else if (구분.includes('농지')) {
            물건 = '농지';
          } else if (구분.includes('골프장')) {
            물건 = '골프장';
          } else if (구분.includes('고급오락장')) {
            물건 = '고급오락장';
          }

          // subsection이 거래유형 레벨인지 확인하고 처리
          if (subsection.content && Array.isArray(subsection.content)) {
            subsection.content.forEach((거래유형section: any) => {
              // console.log('거래유형section.title:', 거래유형section.title); // 디버깅 로그
              if (거래유형section.title &&
                (거래유형section.title === '매매' || 거래유형section.title === '교환' ||
                  거래유형section.title === '증여' || 거래유형section.title === '상속' ||
                  거래유형section.title === '분할' || 거래유형section.title === '신축' || 거래유형section.title === '과점주주')) {
                // console.log('거래유형 감지됨:', 거래유형section.title); // 디버깅 로그

                거래유형 = 거래유형section.title;

                // 거래유형 하위에서 물건, 지역, 주택수 정보 찾기
                if (거래유형section.content && Array.isArray(거래유형section.content)) {
                  거래유형section.content.forEach((물건section: any) => {
                    // console.log('물건section.title:', 물건section.title); // 디버깅 로그
                    let 물건_description = '';

                    // 물건 종류 식별 (주택수를 물건으로 설정)
                    if (물건section.title) {
                      물건_description = 물건section.description || '';

                      if (물건section.title.includes('주택')) {
                        물건 = 물건section.title; // "1주택", "2주택" 등을 물건으로 설정
                        주택수 = ''; // 주택수는 별도로 사용하지 않음
                      } else if (물건section.title.includes('농지외')) {
                        물건 = '농지외';
                        주택수 = '';
                      } else if (물건section.title.includes('농지')) {
                        물건 = '농지';
                        주택수 = '';
                      } else if (물건section.title.includes('골프장')) {
                        물건 = '골프장';
                        주택수 = '';
                      } else if (물건section.title.includes('고급')) {
                        물건 = '고급주택';
                        주택수 = '';
                      } else if (물건section.title.includes('물건 구분 없음')) {
                        물건 = '';
                        주택수 = '';
                      } else {
                        물건 = 물건section.title; // 기본적으로 title을 물건으로 사용
                        주택수 = '';
                      }
                    }

                    // 물건 하위에서 지역 정보 찾기
                    if (물건section.content && Array.isArray(물건section.content)) {
                      // console.log(`${거래유형} → ${물건} 하위 지역 개수:`, 물건section.content.length); // 디버깅 로그
                      // console.log(`${거래유형} → ${물건} 하위 지역 목록:`, 물건section.content.map((item: any) => item.title)); // 추가 디버깅
                      물건section.content.forEach((지역section: any) => {
                        // 각 지역section마다 별도의 지역 변수 생성
                        let 현재지역 = '';

                        if (지역section.title) {
                          // console.log(`${거래유형} → ${물건} → 지역[${index}]:`, 지역section.title); // 디버깅 로그
                          // "비조정대상지역"에 "조정대상지역"이 포함되므로 순서 중요!
                          if (지역section.title.includes('비조정대상지역')) {
                            현재지역 = '비조정대상지역';
                            // console.log('✅ 설정된 지역: 비조정대상지역'); // 디버깅 로그
                          } else if (지역section.title.includes('조정대상지역')) {
                            현재지역 = '조정대상지역';
                            // console.log('✅ 설정된 지역: 조정대상지역'); // 디버깅 로그
                          } else if (지역section.title.includes('지역 구분 없음')) {
                            현재지역 = '';
                            // console.log('✅ 설정된 지역: 지역 구분 없음'); // 디버깅 로그
                          } else {
                            // 다른 지역 정보가 있다면 그대로 사용
                            현재지역 = 지역section.title;
                            console.log('설정된 지역: 기타 -', 현재지역); // 디버깅 로그
                          }
                        }

                        console.log(`🔥 최종컨텍스트 생성 - 지역: ${현재지역}, 물건: ${물건}`); // 최종 컨텍스트 확인
                        const 최종컨텍스트 = {
                          납세자: 납세자,
                          취득원인: 취득원인,
                          거래유형: 거래유형,
                          물건: 물건,
                          물건_description: 물건_description,
                          지역: 현재지역,  // 현재지역 변수 사용
                          주택수: 주택수,
                          legal_basis: Array.isArray(지역section.legal_basis) ? 지역section.legal_basis :
                            Array.isArray(물건section.legal_basis) ? 물건section.legal_basis :
                              Array.isArray(거래유형section.legal_basis) ? 거래유형section.legal_basis :
                                Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
                                  Array.isArray(section.legal_basis) ? section.legal_basis :
                                    originalFileLegalBasis,
                          originalLegalBasis: originalFileLegalBasis,
                          centralLegalBasis: centralLegalBasis
                        };

                        // 항상 재귀 파싱 사용 (가격대, 면적 등의 하위 구조 처리)
                        parseDataRecursively(지역section, 최종컨텍스트, 1);
                      });
                    }
                  });
                }
              }
            });
          } else {
            // subsection에 바로 세율 데이터가 있는지 확인 (backward compatibility)
            if (Array.isArray(subsection.content) && subsection.content.some((d: any) => d.title === '취득세')) {
              const rates = extractTaxRates(subsection.content, originalFileLegalBasis, centralLegalBasis);
              const newRow = {
                납세자: 납세자,
                취득원인: 취득원인,
                거래유형: 거래유형,
                물건: subsection.title, // subsection.title을 물건으로 사용
                지역: '',
                주택수: '',
                가격대: '',
                면적: '',
                취득세: rates.취득세,
                지방교육세: rates.지방교육세,
                농특세: rates.농특세,
                합계: rates.합계,
                비고: subsection.description || '',
                legal_basis: Array.isArray(subsection.legal_basis) ? subsection.legal_basis :
                  Array.isArray(section.legal_basis) ? section.legal_basis :
                    originalFileLegalBasis,
                취득세_legal_basis: rates.취득세_legal_basis,
                지방교육세_legal_basis: rates.지방교육세_legal_basis,
                농특세_legal_basis: rates.농특세_legal_basis
              };

              // 중복 체크를 위한 키 생성
              const rowKey = `${newRow.납세자}_${newRow.취득원인}_${newRow.거래유형}_${newRow.물건}_${newRow.지역}_${newRow.가격대}_${newRow.면적}`;

              // 중복이 아닌 경우에만 추가
              if (!addedRows.has(rowKey)) {
                addedRows.add(rowKey);
                rows.push(newRow);
              }
            }
          }
        });
      }
    });

    // 면적별 그룹핑
    const groupedRows = rows.reduce((acc: any[], row) => {
      const groupKey = `${row.납세자}_${row.취득원인}_${row.거래유형}_${row.물건}_${row.지역}_${row.주택수}_${row.가격대}`;
      let existingGroup = acc.find(group => group.groupKey === groupKey);

      if (!existingGroup) {
        existingGroup = {
          groupKey,
          납세자: row.납세자,
          취득원인: row.취득원인,
          거래유형: row.거래유형,
          물건: row.물건,
          물건_description: row.물건_description,
          지역: row.지역,
          주택수: row.주택수,
          가격대: row.가격대,
          비고: row.비고,
          legal_basis: Array.isArray(row.legal_basis) && row.legal_basis.length > 0 ? row.legal_basis : [],
          subRows: []
        };
        acc.push(existingGroup);
      }

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

    return groupedRows;
  }, [selectedCase]);

  // 필터링된 데이터
  const filteredData: TaxRateRow[] = useMemo(() => {
    if (!selectedCase) return [];

    // console.log('전체 tableData:', tableData); // 전체 데이터 확인
    // console.log('지역별 데이터 개수:', tableData.filter(item => item.지역 === '조정대상지역').length, '조정대상지역');
    // console.log('지역별 데이터 개수:', tableData.filter(item => item.지역 === '비조정대상지역').length, '비조정대상지역');

    if (!filters.납세자 && !filters.취득원인 && !filters.거래유형 && !filters.물건 && !filters.지역구분 && !filters.주택수) {
      return tableData;
    }

    return tableData.filter(group => {
      let matches = true;

      if (filters.납세자 && !group.납세자.includes(filters.납세자)) {
        matches = false;
      }

      if (filters.취득원인 && !group.취득원인.includes(filters.취득원인)) {
        matches = false;
      }

      if (filters.거래유형 && !group.거래유형.includes(filters.거래유형)) {
        matches = false;
      }

      if (filters.물건) {
        if (filters.물건 === '농지') {
          // "농지" 정확히 일치 (농지외 제외)
          if (!group.물건.includes('농지') || group.물건.includes('농지외')) {
            matches = false;
          }
        } else if (filters.물건 === '농지외') {
          // "농지외" 포함
          if (!group.물건.includes('농지외')) {
            matches = false;
          }
        } else if (filters.물건 === '토지건물') {
          if (!group.물건.includes('토지건물')) matches = false;
        } else if (filters.물건 === '주택') {
          // 주택 관련 필터링 (1주택, 2주택 등 포함)
          if (!group.물건.includes('주택')) matches = false;
        } else if (!group.물건.includes(filters.물건)) {
          matches = false;
        }
      }

      if (filters.지역구분 && (group.물건.includes('주택') || filters.물건 === '주택')) {
        if (filters.지역구분 === '조정' && group.지역 !== '조정대상지역') matches = false;
        if (filters.지역구분 === '비조정' && group.지역 !== '비조정대상지역') matches = false;
      }

      if (filters.주택수 && (group.물건.includes('주택') || filters.물건 === '주택')) {
        if (filters.주택수 === '1주택' && !group.물건.includes('1주택')) matches = false;
        if (filters.주택수 === '2주택' && !group.물건.includes('2주택')) matches = false;
        if (filters.주택수 === '3주택' && !group.물건.includes('3주택')) matches = false;
        if (filters.주택수 === '4주택 이상' && !group.물건.includes('4주택')) matches = false;
      }

      return matches;
    });
  }, [tableData, filters, selectedCase]);

  // 모바일 카드 렌더링 함수
  const renderCards = (data: TaxRateRow[]) => {
    return (
      <div className="space-y-4">
        {data.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-4">
            {/* 기본 정보 */}
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">납세자</span>
                <span className="text-sm font-medium text-gray-900">{group.납세자}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">취득원인</span>
                <span className="text-sm font-medium text-gray-900">{group.취득원인}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">거래유형</span>
                <span className="text-sm font-medium text-gray-900">{group.거래유형}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">물건</span>
                <span className="text-sm font-medium text-gray-900">
                  {group.물건_description ? (
                    <Tooltip content={[group.물건_description]}>
                      {group.물건}
                    </Tooltip>
                  ) : (
                    group.물건
                  )}
                </span>
              </div>
              {group.지역 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">지역</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${group.지역 === '조정대상지역'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {group.지역}
                  </span>
                </div>
              )}
              {group.가격대 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">가격대</span>
                  <span className="text-sm font-medium text-gray-900">{group.가격대}</span>
                </div>
              )}
            </div>

            {/* 세율 정보 */}
            <div className="space-y-3">
              {(group.subRows || []).map((subRow: any, subIndex: number) => (
                <div key={subIndex} className="bg-gray-50 rounded-lg p-3">
                  {subRow.면적 && (
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      📏 {subRow.면적}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-gray-500 mb-1">취득세</div>
                      <div className="text-sm font-semibold text-blue-600">
                        <Tooltip content={subRow.취득세_legal_basis || []}>
                          {subRow.취득세}
                        </Tooltip>
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-gray-500 mb-1">지방교육세</div>
                      <div className="text-sm font-semibold text-green-600">
                        <Tooltip content={subRow.지방교육세_legal_basis || []}>
                          {subRow.지방교육세}
                        </Tooltip>
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-xs text-gray-500 mb-1">농특세</div>
                      <div className="text-sm font-semibold text-orange-600">
                        <Tooltip content={subRow.농특세_legal_basis || []}>
                          {subRow.농특세}
                        </Tooltip>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded p-2 border border-purple-200">
                      <div className="text-xs text-gray-500 mb-1">합계</div>
                      <div className="text-sm font-bold text-purple-600">
                        {subRow.합계}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      {!selectedCase ? (
        // 케이스 목록 표시 (AcquisitionRequirements 스타일)
        <>
          {/* 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FiBookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">취득세 세율</h1>
                <p className="text-gray-600 mt-1">취득세 세율에 대한 상세 정보를 확인하실 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 케이스 선택 카드 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">케이스 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {casesList.map((caseData, index) => (
                <button
                  key={index}
                  onClick={() => handleCaseSelect(caseData)}
                  className="p-4 rounded-lg border-2 transition-all hover:shadow-md border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                >
                  <div className="flex items-start">
                    <FiFileText className="h-6 w-6 mr-3 flex-shrink-0 text-gray-400" />
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        {caseData.case}
                      </h3>
                      <p className="text-sm mt-1 line-clamp-2 text-gray-600">
                        {caseData.section.length}개 섹션
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
                <strong>주의:</strong> 실제 세율 적용 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.
                특례나 감면 적용 여부에 따라 실제 부담세액이 달라질 수 있습니다.
              </p>
            </div>
          </div>
        </>
      ) : (
        // 선택된 케이스의 세율 표시
        <>
          {/* Back 버튼과 헤더 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
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

          {/* 선택된 케이스 헤더 */}
          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
            <div className="flex items-center">
              <FiFileText className="h-8 w-8 text-blue-600 mr-3" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-blue-900">{selectedCase.case}</h1>
                <p className="text-gray-700 mt-2">
                  {selectedCase.section.length}개 섹션의 세율 정보
                </p>
              </div>
            </div>
          </div>

          {/* 필터 섹션 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {/* 납세자 구분 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.납세자.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFilter('납세자', option)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.납세자 === option
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 취득원인 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.취득원인.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFilter('취득원인', option)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.취득원인 === option
                        ? 'bg-red-600 text-white shadow-md'
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

              {/* 물건 종류 */}
              <div>

                <div className="flex flex-wrap gap-2">
                  {FILTER_OPTIONS.물건.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFilter('물건', option)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.물건 === option
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* 주택 선택 시 추가 필터 */}
              {filters.물건 === '주택' && (
                <div className="space-y-4 pl-4 border-l-4 border-green-200">
                  {/* 주택수 구분 */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-1">주택수</h4>
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

                  {/* 지역 구분 */}
                  <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-1">지역구분</h4>
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
              {(filters.납세자 || filters.취득원인 || filters.거래유형 || filters.물건 || filters.지역구분 || filters.주택수) && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="flex flex-wrap gap-2">
                    {filters.납세자 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.납세자}
                      </span>
                    )}
                    {filters.취득원인 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {filters.취득원인}
                      </span>
                    )}
                    {filters.거래유형 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {filters.거래유형}
                      </span>
                    )}
                    {filters.물건 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {filters.물건}
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
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 데스크탑: 세율 표 */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">납세자</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취득원인</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래유형</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물건</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지역</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">면적</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">합계</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취득세</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지방교육세</th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">농특세</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((group, groupIndex) => {
                    // console.log(`그룹 ${groupIndex} 지역 값:`, group.지역); // 지역 값 확인
                    const isEven = groupIndex % 2 === 0;
                    const groupBgColor = isEven ? 'bg-white' : 'bg-gray-50';
                    const groupCellBgColor = isEven ? 'bg-gray-100' : 'bg-gray-200';

                    return (group.subRows || []).map((subRow: any, subIndex: number) => (
                      <tr key={`${groupIndex}-${subIndex}`} className={groupBgColor}>
                        {subIndex === 0 && (
                          <>
                            <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.납세자}</td>
                            <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.취득원인}</td>
                            <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.거래유형}</td>
                            <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>
                              {group.물건_description ? (
                                <Tooltip content={[group.물건_description]}>
                                  {group.물건}
                                </Tooltip>
                              ) : (
                                group.물건
                              )}
                            </td>
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
                            {/* <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.주택수}</td> */}
                            <td rowSpan={group.subRows?.length || 1} className={`px-2 py-4 text-sm text-gray-900 border-r border-gray-200 ${groupCellBgColor} break-words`}>{group.가격대}</td>
                          </>
                        )}
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
                      </tr>
                    ))
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 모바일: 카드 뷰 */}
          <div className="block md:hidden">
            {renderCards(filteredData)}
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
                    <span className="text-sm text-gray-600">강남구, 서초구, 송파구, 용산구</span>
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
        </>
      )}
    </div>
  );
};

export default AcquisitionRates;