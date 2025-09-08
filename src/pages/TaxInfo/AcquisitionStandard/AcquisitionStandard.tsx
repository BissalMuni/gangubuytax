import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiRefreshCw, FiLayers, FiExternalLink } from 'react-icons/fi';

import React, { useMemo, useState, useEffect } from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import toast from 'react-hot-toast';
import { fetchLawProvision, parseLawReference } from '@/utils/lawParser';
// Import removed - will fetch from public folder instead

interface AcquisitionStandardRow {
  취득원인: string;
  거래유형: string;
  납세자: string;
  물건: string;
  가액: string;
  관계: string;
  적용과세표준: string;
  관련규정: string[];
}

interface FilterState {
  취득원인: '유상' | '무상' | '원시' | '의제' | '';
  납세자: string;
  물건: string;
  거래유형: string;
}

interface LegalProvisionInfo {
  article: string;
  title: string;
  content: string;
  url?: string;
}

interface ContentItem {
  물건: string;
  가액: string;
  관계: string;
  적용과세표준: string;
  관련규정: string[];
}

interface SubCategory {
  id: number;
  title: string;
  description: string;
  content: ContentItem[];
}

interface Category {
  id: number;
  title: string;
  description: string;
  content: SubCategory[];
}

interface Section {
  id: number;
  title: string;
  description: string;
  content: Category[];
}

interface LegalBasis {
  code: string;
  title: string;
  content: string;
}

interface AcquisitionStandardData {
  case: string;
  case_code: string;
  effective_date: string;
  section: Section[];
  legal_basis: LegalBasis[];
}

const FILTER_OPTIONS = {
  납세자: ['모두', '개인', '법인'],
  취득원인: ['유상', '무상', '원시', '의제'],
  거래유형: {
    유상: ['매매', '교환', '양도담보', '대물변제', '특수거래'],
    무상: ['상속', '증여', '부담부증여', '합병/분할'],
    원시: ['신축', '매립/간척', '특수거래'],
    의제: ['과점주주', '사실상 지목변경', '종류변경', '개수']
  },
  물건: ['부동산등', '건축물', '토지', '차량', '차량/기계', '선박/차량/기계']
};

// 법조항 툴팁 컴포넌트
const LegalProvisionTooltip: React.FC<{
  provision: string;
  children: React.ReactNode;
}> = ({ provision, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [provisionInfo, setProvisionInfo] = useState<LegalProvisionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProvisionInfo = async (provision: string) => {
    setIsLoading(true);
    try {
      const lawData = await fetchLawProvision(provision);

      if (lawData && lawData.조문내용) {
        setProvisionInfo({
          article: provision,
          title: lawData.법령명_한글 || "법조항 정보",
          content: lawData.조문내용 || lawData.항내용 || lawData.호내용 || lawData.목내용 || "내용을 찾을 수 없습니다.",
          url: `https://www.law.go.kr/법령/${lawData.법령명_한글}/${lawData.조문키}`
        });
      } else {
        const reference = parseLawReference(provision);
        let defaultContent = "법조항 내용을 불러올 수 없습니다.";

        if (reference?.lawName === '법' || reference?.lawName === '지방세법') {
          if (reference.article === '10' && reference.paragraph === '3') {
            defaultContent = "취득세의 과세표준은 취득 당시의 가액으로 한다. 다만, 연부로 취득하는 경우 취득세의 과세표준은 연부금액으로 한다.";
          } else if (reference.article === '18') {
            defaultContent = "영 제18조의 내용입니다.";
          }
        }

        setProvisionInfo({
          article: provision,
          title: reference?.lawName || "법조항 정보",
          content: defaultContent,
          url: "https://www.law.go.kr/"
        });
      }

    } catch (error) {
      console.error('Failed to fetch legal provision:', error);
      setProvisionInfo({
        article: provision,
        title: "법조항 정보",
        content: "법조항 내용을 불러오는 중 오류가 발생했습니다.",
        url: undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (!provisionInfo && !isLoading) {
      fetchProvisionInfo(provision);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (provisionInfo?.url) {
      window.open(provisionInfo.url, '_blank');
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      <span
        className="text-blue-600 hover:text-blue-800 cursor-pointer underline decoration-dotted inline-flex items-center gap-1"
        onClick={handleClick}
      >
        {children}
        <FiExternalLink className="w-3 h-3" />
      </span>

      {isVisible && (
        <div className="absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-md bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
            </div>
          ) : provisionInfo ? (
            <div>
              <div className="font-semibold text-gray-900 mb-2">
                {provisionInfo.article}
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">
                {provisionInfo.title}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {provisionInfo.content}
              </div>
              {provisionInfo.url && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">클릭하면 법령정보센터로 이동합니다</span>
                </div>
              )}
            </div>
          ) : null}

          {/* 화살표 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-200 mt-[-1px]"></div>
        </div>
      )}
    </div>
  );
};

const AcquisitionStandard: React.FC = () => {
  const { isLoading, error } = useTaxData();
  const [data, setData] = useState<AcquisitionStandardRow[]>([]);
  const [legalBasisData, setLegalBasisData] = useState<LegalBasis[]>([]);

  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterState>({
    취득원인: '',
    납세자: '',
    물건: '',
    거래유형: ''
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/tax_price/acquisitionstandard.json');
        const acquisitionStandardData: AcquisitionStandardData[] = await response.json();

        if (acquisitionStandardData && acquisitionStandardData[0]) {
          const flatData: AcquisitionStandardRow[] = [];
          const standardData = acquisitionStandardData[0];

          // legal_basis 데이터 저장
          if (standardData.legal_basis) {
            setLegalBasisData(standardData.legal_basis);
          }

          // section 데이터 파싱
          standardData.section.forEach((section: Section) => {
            const 납세자 = section.title;

            section.content.forEach((category: Category) => {
              const 취득원인 = category.title;

              category.content.forEach((subCategory: SubCategory) => {
                const 거래유형 = subCategory.title;

                subCategory.content.forEach((item: ContentItem) => {
                  flatData.push({
                    납세자: 납세자,
                    취득원인: 취득원인,
                    거래유형: 거래유형,
                    물건: item.물건,
                    가액: item.가액,
                    관계: item.관계,
                    적용과세표준: item.적용과세표준,
                    관련규정: Array.isArray(item.관련규정) ? item.관련규정 : [item.관련규정]
                  });
                });
              });
            });
          });

          setData(flatData);
        }
      } catch (error) {
        console.error('Error loading acquisition standard data:', error);
        toast.error('과세표준 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, []);

  // 필터 리셋 함수
  const resetFilters = () => {
    setFilters({
      취득원인: '',
      납세자: '',
      물건: '',
      거래유형: ''
    });
  };

  // 필터 업데이트 함수
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? '' : value
      };

      // 취득원인이 변경되면 거래유형 초기화
      if (key === '취득원인') {
        newFilters.거래유형 = '';
      }

      return newFilters;
    });
  };

  // 필터링된 데이터
  const filteredData: AcquisitionStandardRow[] = useMemo(() => {
    if (!filters.취득원인 && !filters.납세자 && !filters.물건 && !filters.거래유형) {
      return data;
    }

    return data.filter(row => {
      let matches = true;

      if (filters.취득원인 && !row.취득원인.includes(filters.취득원인)) {
        matches = false;
      }

      if (filters.납세자 && !row.납세자.includes(filters.납세자)) {
        matches = false;
      }

      if (filters.물건 && !row.물건.includes(filters.물건)) {
        matches = false;
      }

      if (filters.거래유형 && !row.거래유형.includes(filters.거래유형)) {
        matches = false;
      }

      return matches;
    });
  }, [data, filters]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    toast.error('취득세 과세표준 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
        <p className="text-gray-600 mb-4">취득세 과세표준 정보를 불러올 수 없습니다.</p>
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


      {/* 쿼리 필터 섹션 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">

          {/* 헤더 */}
          <div className="flex items-center">
            <FiLayers className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                취득세 과세표준
              </h1>
            </div>
          </div>

          {/* 납세자 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.납세자.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('납세자', option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.납세자 === option
                    ? 'bg-green-600 text-white shadow-md'
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
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 거래유형 - 취득원인 선택시만 표시 */}
          {filters.취득원인 && FILTER_OPTIONS.거래유형[filters.취득원인] && (
            <div className="pl-4 border-l-4 border-blue-200">
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.거래유형[filters.취득원인].map((option: string) => (
                  <button
                    key={option}
                    onClick={() => updateFilter('거래유형', option)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors 
                      ${filters.거래유형 === option
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 물건 */}
          <div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.물건.map((option) => (
                <button
                  key={option}
                  onClick={() => updateFilter('물건', option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filters.물건 === option
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

        {/* 필터 초기화 및 현재 필터 현황 */}
        <div className="flex items-center gap-4 mb-2 mt-4">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            필터 초기화
          </button>

          {/* 활성 필터 표시 */}
          {(filters.취득원인 || filters.납세자 || filters.물건 || filters.거래유형) && (
            <div className="p-3 bg-blue-50 rounded-md">
              <div className="flex flex-wrap gap-2">
                {filters.취득원인 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filters.취득원인}
                  </span>
                )}
                {filters.납세자 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {filters.납세자}
                  </span>
                )}
                {filters.거래유형 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {filters.거래유형}
                  </span>
                )}
                {filters.물건 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {filters.물건}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 과세표준 표 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead className="bg-blue-200">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">납세자</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">취득원인</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래유형</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물건</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가액</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관계</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bold">적용 과세표준</th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관련 규정</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, index) => {
                const isEven = index % 2 === 0;
                const rowBgColor = isEven ? 'bg-white' : 'bg-gray-50';

                return (
                  <tr key={index} className={rowBgColor}>
                    <td className="px-2 py-4 text-sm text-gray-900 break-words">{row.납세자}</td>
                    <td className="px-2 py-4 text-sm font-medium text-gray-900 break-words">{row.취득원인}</td>
                    <td className="px-2 py-4 text-sm text-gray-900 break-words">{row.거래유형}</td>
                    <td className="px-2 py-4 text-sm text-gray-900 break-words">{row.물건}</td>
                    <td className="px-2 py-4 text-sm text-gray-900 break-words">{row.가액}</td>
                    <td className="px-2 py-4 text-sm text-gray-900 break-words">{row.관계}</td>
                    <td className="px-2 py-4 text-sm font-bold text-purple-600 break-words">
                      <div dangerouslySetInnerHTML={{ __html: row.적용과세표준 }} />
                    </td>
                    <td className="px-2 py-4 text-sm text-gray-500 break-words">
                      <div>
                        {row.관련규정 && row.관련규정.map((provision, idx) => {
                          const trimmedProvision = provision ? String(provision).trim() : '';
                          return (
                            <div key={idx}>
                              {trimmedProvision && (
                                <LegalProvisionTooltip provision={trimmedProvision}>
                                  {trimmedProvision}
                                </LegalProvisionTooltip>
                              )}
                              {idx < row.관련규정.length - 1 && <br />}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 범례 및 특례 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">특례 및 평가기간</h3>
        <div className="space-y-4">
          {legalBasisData.map((basis, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">{basis.title}</h4>
              <p className="text-sm text-gray-600">{basis.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주의사항</h3>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>주의:</strong> 실제 과세표준 적용 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.
            특례나 감면 적용 여부에 따라 실제 과세표준이 달라질 수 있습니다.
          </p>
        </div>
      </div>

    </div >
  );
};

export default AcquisitionStandard;