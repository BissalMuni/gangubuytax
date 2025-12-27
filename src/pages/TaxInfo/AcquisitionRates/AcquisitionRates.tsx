import LoadingSpinner from '@/components/common/LoadingSpinner';
import React, { useMemo, useState } from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import { TaxService } from '@/services/taxService';
import { Card, Button, Tag, Space, Table, Row, Col, Typography, Alert, message, Tabs } from 'antd';
import { ReloadOutlined, BookOutlined } from '@ant-design/icons';
import Tooltip from './Tooltip';

const { Title, Text } = Typography;

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
  케이스?: string;
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

interface TaxCaseData {
  case: string;
  case_code: string;
  effective_date: string;
  section: any[];
}

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
  const [activeTab, setActiveTab] = useState<string>('general');
  const [filters, setFilters] = useState<FilterState>({
    납세자: '',
    취득원인: '',
    거래유형: '',
    물건: '',
    주택수: '',
    지역구분: ''
  });

  // 케이스를 일반 취득세율과 사치성재산 취득세율로 분류
  const { generalCases, luxuryCases } = useMemo(() => {
    if (!taxData || !Array.isArray(taxData)) return { generalCases: [], luxuryCases: [] };

    const casesMap: Record<string, TaxCaseData> = {};

    taxData.forEach((section: any) => {
      if (section.originalCase) {
        if (!casesMap[section.originalCase]) {
          casesMap[section.originalCase] = {
            case: section.originalCase,
            case_code: section.originalCase.replace(/\s+/g, '_').toLowerCase(),
            effective_date: '2025-09-21',
            section: []
          };
        }
        casesMap[section.originalCase].section.push(section);
      }
    });

    const allCases = Object.values(casesMap);

    // 사치성 재산 관련 키워드로 분류
    const luxuryKeywords = ['골프장', '고급오락장', '고급주택', '사치성', '고급선박', '고급'];
    const general: TaxCaseData[] = [];
    const luxury: TaxCaseData[] = [];

    allCases.forEach(caseData => {
      const isLuxury = luxuryKeywords.some(keyword => caseData.case.includes(keyword));
      if (isLuxury) {
        luxury.push(caseData);
      } else {
        general.push(caseData);
      }
    });

    return { generalCases: general, luxuryCases: luxury };
  }, [taxData]);

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

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? '' : value
      };

      if (key === '물건' && value !== '주택') {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      if (key === '물건' && prev[key] === value) {
        newFilters.지역구분 = '';
        newFilters.주택수 = '';
      }

      return newFilters;
    });
  };

  // 선택된 탭에 따라 모든 케이스의 데이터를 합침
  const tableData = useMemo(() => {
    const cases = activeTab === 'general' ? generalCases : luxuryCases;
    if (cases.length === 0) return [];

    const rows: TaxRateRow[] = [];
    const addedRows = new Set<string>();

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

    // 모든 케이스를 순회
    cases.forEach((caseData) => {
      const parseDataRecursively = (data: any, context: any = {}, depth: number = 0) => {
        const currentContext = { ...context };

        if (data.title && (data.title.includes('6억원') || data.title === '9억원 초과')) {
          currentContext.가격대 = data.title;
        } else if (data.title && data.title.includes('㎡')) {
          currentContext.면적 = data.title;
        }

        if (Array.isArray(data.content) && data.content.some((d: any) => d.title === '취득세')) {
          const rates = extractTaxRates(data.content, currentContext.originalLegalBasis, currentContext.centralLegalBasis);
          const newRow = {
            케이스: caseData.case,
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

          const rowKey = `${caseData.case}_${newRow.납세자}_${newRow.취득원인}_${newRow.거래유형}_${newRow.물건}_${newRow.지역}_${newRow.가격대}_${newRow.면적}`;

          if (!addedRows.has(rowKey)) {
            addedRows.add(rowKey);
            rows.push(newRow);
          }
        }

        if (data.content && Array.isArray(data.content)) {
          data.content.forEach((detail: any) => {
            parseDataRecursively(detail, currentContext, depth + 1);
          });
        }
      };

      caseData.section.forEach((section: any) => {
        const 구분 = caseData.case;
        const originalFileLegalBasis = section.originalLegalBasis || [];
        const centralLegalBasis = section.centralLegalBasis || [];

        if (section.content && Array.isArray(section.content)) {
          section.content.forEach((subsection: any) => {
            let 납세자 = section.title || '';
            let 취득원인 = subsection.title || '';
            let 거래유형 = '';
            let 물건 = '';
            let 주택수 = '';

            if (subsection.content && Array.isArray(subsection.content)) {
              const 거래유형항목 = subsection.content[0];
              if (거래유형항목 && 거래유형항목.title) {
                거래유형 = 거래유형항목.title;
              }
            }

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

            if (subsection.content && Array.isArray(subsection.content)) {
              subsection.content.forEach((거래유형section: any) => {
                if (거래유형section.title &&
                  (거래유형section.title === '매매' || 거래유형section.title === '교환' ||
                    거래유형section.title === '증여' || 거래유형section.title === '상속' ||
                    거래유형section.title === '분할' || 거래유형section.title === '신축' || 거래유형section.title === '과점주주')) {

                  거래유형 = 거래유형section.title;

                  if (거래유형section.content && Array.isArray(거래유형section.content)) {
                    거래유형section.content.forEach((물건section: any) => {
                      let 물건_description = '';

                      if (물건section.title) {
                        물건_description = 물건section.description || '';

                        if (물건section.title.includes('주택')) {
                          물건 = 물건section.title;
                          주택수 = '';
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
                          물건 = 물건section.title;
                          주택수 = '';
                        }
                      }

                      if (물건section.content && Array.isArray(물건section.content)) {
                        물건section.content.forEach((지역section: any) => {
                          let 현재지역 = '';

                          if (지역section.title) {
                            if (지역section.title.includes('비조정대상지역')) {
                              현재지역 = '비조정대상지역';
                            } else if (지역section.title.includes('조정대상지역')) {
                              현재지역 = '조정대상지역';
                            } else if (지역section.title.includes('지역 구분 없음')) {
                              현재지역 = '';
                            } else {
                              현재지역 = 지역section.title;
                            }
                          }

                          const 최종컨텍스트 = {
                            납세자: 납세자,
                            취득원인: 취득원인,
                            거래유형: 거래유형,
                            물건: 물건,
                            물건_description: 물건_description,
                            지역: 현재지역,
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

                          parseDataRecursively(지역section, 최종컨텍스트, 1);
                        });
                      }
                    });
                  }
                }
              });
            } else {
              if (Array.isArray(subsection.content) && subsection.content.some((d: any) => d.title === '취득세')) {
                const rates = extractTaxRates(subsection.content, originalFileLegalBasis, centralLegalBasis);
                const newRow = {
                  케이스: caseData.case,
                  납세자: 납세자,
                  취득원인: 취득원인,
                  거래유형: 거래유형,
                  물건: subsection.title,
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

                const rowKey = `${caseData.case}_${newRow.납세자}_${newRow.취득원인}_${newRow.거래유형}_${newRow.물건}_${newRow.지역}_${newRow.가격대}_${newRow.면적}`;

                if (!addedRows.has(rowKey)) {
                  addedRows.add(rowKey);
                  rows.push(newRow);
                }
              }
            }
          });
        }
      });
    });

    // 그룹화
    const groupedRows = rows.reduce((acc: any[], row) => {
      const groupKey = `${row.케이스}_${row.납세자}_${row.취득원인}_${row.거래유형}_${row.물건}_${row.지역}_${row.주택수}_${row.가격대}`;
      let existingGroup = acc.find(group => group.groupKey === groupKey);

      if (!existingGroup) {
        existingGroup = {
          groupKey,
          케이스: row.케이스,
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
  }, [activeTab, generalCases, luxuryCases]);

  const filteredData: TaxRateRow[] = useMemo(() => {
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
          if (!group.물건.includes('농지') || group.물건.includes('농지외')) {
            matches = false;
          }
        } else if (filters.물건 === '농지외') {
          if (!group.물건.includes('농지외')) {
            matches = false;
          }
        } else if (filters.물건 === '토지건물') {
          if (!group.물건.includes('토지건물')) matches = false;
        } else if (filters.물건 === '주택') {
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
  }, [tableData, filters]);

  // 테이블 데이터 변환
  const flatTableData = useMemo(() => {
    const result: any[] = [];
    filteredData.forEach((group, groupIndex) => {
      (group.subRows || []).forEach((subRow: any, subIndex: number) => {
        result.push({
          key: `${groupIndex}-${subIndex}`,
          groupIndex,
          subIndex,
          isFirstInGroup: subIndex === 0,
          groupRowSpan: group.subRows?.length || 1,
          ...group,
          면적: subRow.면적,
          취득세: subRow.취득세,
          지방교육세: subRow.지방교육세,
          농특세: subRow.농특세,
          합계: subRow.합계,
          취득세_legal_basis: subRow.취득세_legal_basis,
          지방교육세_legal_basis: subRow.지방교육세_legal_basis,
          농특세_legal_basis: subRow.농특세_legal_basis,
        });
      });
    });
    return result;
  }, [filteredData]);

  const columns = [
    {
      title: '분류',
      dataIndex: '케이스',
      key: '케이스',
      width: 120,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '납세자',
      dataIndex: '납세자',
      key: '납세자',
      width: 80,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '취득원인',
      dataIndex: '취득원인',
      key: '취득원인',
      width: 80,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
    },
    {
      title: '거래유형',
      dataIndex: '거래유형',
      key: '거래유형',
      width: 80,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
    },
    {
      title: '물건',
      dataIndex: '물건',
      key: '물건',
      width: 100,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
      render: (text: string, record: any) => (
        record.물건_description ? (
          <Tooltip content={[record.물건_description]}>{text}</Tooltip>
        ) : text
      ),
    },
    {
      title: '지역',
      dataIndex: '지역',
      key: '지역',
      width: 110,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
      render: (text: string) => text && (
        <Tag color={text === '조정대상지역' ? 'red' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: '가격',
      dataIndex: '가격대',
      key: '가격대',
      width: 100,
      onCell: (record: any) => ({
        rowSpan: record.isFirstInGroup ? record.groupRowSpan : 0,
      }),
    },
    {
      title: '면적',
      dataIndex: '면적',
      key: '면적',
      width: 100,
    },
    {
      title: '합계',
      dataIndex: '합계',
      key: '합계',
      width: 100,
      render: (text: string) => <Text strong style={{ color: '#722ed1' }}>{text}</Text>,
    },
    {
      title: '취득세',
      dataIndex: '취득세',
      key: '취득세',
      width: 100,
      render: (text: string, record: any) => (
        <Tooltip content={record.취득세_legal_basis || []}>
          <Text style={{ color: '#1890ff', fontWeight: 500 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '지방교육세',
      dataIndex: '지방교육세',
      key: '지방교육세',
      width: 100,
      render: (text: string, record: any) => (
        <Tooltip content={record.지방교육세_legal_basis || []}>
          <Text style={{ color: '#52c41a', fontWeight: 500 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: '농특세',
      dataIndex: '농특세',
      key: '농특세',
      width: 100,
      render: (text: string, record: any) => (
        <Tooltip content={record.농특세_legal_basis || []}>
          <Text style={{ color: '#fa8c16', fontWeight: 500 }}>{text}</Text>
        </Tooltip>
      ),
    },
  ];

  // 필터 및 테이블 렌더링
  const renderFilterAndTable = () => (
    <>
      {/* 필터 섹션 */}
      <Card size="small">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* 납세자 구분 */}
          <Space wrap size="small">
            <Text type="secondary" style={{ width: 60 }}>납세자:</Text>
            {FILTER_OPTIONS.납세자.map((option) => (
              <Button
                key={option}
                size="small"
                type={filters.납세자 === option ? 'primary' : 'default'}
                onClick={() => updateFilter('납세자', option)}
              >
                {option}
              </Button>
            ))}
          </Space>

          {/* 취득원인 */}
          <Space wrap size="small">
            <Text type="secondary" style={{ width: 60 }}>취득원인:</Text>
            {FILTER_OPTIONS.취득원인.map((option) => (
              <Button
                key={option}
                size="small"
                type={filters.취득원인 === option ? 'primary' : 'default'}
                danger={filters.취득원인 === option}
                onClick={() => updateFilter('취득원인', option)}
              >
                {option}
              </Button>
            ))}
          </Space>

          {/* 거래 유형 */}
          <Space wrap size="small">
            <Text type="secondary" style={{ width: 60 }}>거래유형:</Text>
            {FILTER_OPTIONS.거래유형.map((option) => (
              <Button
                key={option}
                size="small"
                type={filters.거래유형 === option ? 'primary' : 'default'}
                onClick={() => updateFilter('거래유형', option)}
                style={filters.거래유형 === option ? { background: '#722ed1', borderColor: '#722ed1' } : {}}
              >
                {option}
              </Button>
            ))}
          </Space>

          {/* 물건 종류 */}
          <Space wrap size="small">
            <Text type="secondary" style={{ width: 60 }}>물건:</Text>
            {FILTER_OPTIONS.물건.map((option) => (
              <Button
                key={option}
                size="small"
                type={filters.물건 === option ? 'primary' : 'default'}
                onClick={() => updateFilter('물건', option)}
                style={filters.물건 === option ? { background: '#52c41a', borderColor: '#52c41a' } : {}}
              >
                {option}
              </Button>
            ))}
          </Space>

          {/* 주택 선택 시 추가 필터 */}
          {filters.물건 === '주택' && (
            <div style={{ paddingLeft: 68, borderLeft: '3px solid #52c41a', marginLeft: 0 }}>
              <Space wrap size="small">
                <Text type="secondary">주택수:</Text>
                {FILTER_OPTIONS.주택수.map((option) => (
                  <Button
                    key={option}
                    size="small"
                    type={filters.주택수 === option ? 'primary' : 'default'}
                    onClick={() => updateFilter('주택수', option)}
                    style={filters.주택수 === option ? { background: '#fa8c16', borderColor: '#fa8c16' } : {}}
                  >
                    {option}
                  </Button>
                ))}
                <Text type="secondary" style={{ marginLeft: 16 }}>지역:</Text>
                {FILTER_OPTIONS.지역구분.map((option) => (
                  <Button
                    key={option.value}
                    size="small"
                    type={filters.지역구분 === option.value ? 'primary' : 'default'}
                    onClick={() => updateFilter('지역구분', option.value)}
                    style={filters.지역구분 === option.value ? { background: '#faad14', borderColor: '#faad14' } : {}}
                  >
                    {option.label}
                  </Button>
                ))}
              </Space>
            </div>
          )}

          {/* 필터 초기화 */}
          <Space wrap size="small">
            <Button size="small" icon={<ReloadOutlined />} onClick={resetFilters}>
              초기화
            </Button>
            {filters.납세자 && <Tag color="blue">{filters.납세자}</Tag>}
            {filters.취득원인 && <Tag color="red">{filters.취득원인}</Tag>}
            {filters.거래유형 && <Tag color="purple">{filters.거래유형}</Tag>}
            {filters.물건 && <Tag color="green">{filters.물건}</Tag>}
            {filters.지역구분 && <Tag color="gold">{filters.지역구분 === '조정' ? '조정대상지역' : '비조정대상지역'}</Tag>}
            {filters.주택수 && <Tag color="orange">{filters.주택수}</Tag>}
            <Text type="secondary" style={{ marginLeft: 8 }}>총 {flatTableData.length}건</Text>
          </Space>
        </Space>
      </Card>

      {/* 세율 표 */}
      <Table
        columns={columns}
        dataSource={flatTableData}
        pagination={{ pageSize: 50, showSizeChanger: true, showTotal: (total) => `총 ${total}건` }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />
    </>
  );

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    message.error('취득세 세율 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <Card style={{ textAlign: 'center', padding: 48 }}>
        <Space direction="vertical" size="large">
          <Text type="danger" style={{ fontSize: 18 }}>데이터 로드 실패</Text>
          <Text type="secondary">취득세 세율 정보를 불러올 수 없습니다.</Text>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 헤더 */}
      <Card>
        <Space align="center">
          <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>취득세 세율</Title>
            <Text type="secondary">취득세 세율에 대한 상세 정보를 확인하실 수 있습니다.</Text>
          </div>
        </Space>
      </Card>

      {/* 탭으로 구분된 세율 테이블 */}
      <Card bodyStyle={{ padding: '12px 16px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            resetFilters();
          }}
          items={[
            {
              key: 'general',
              label: `취득세율 (${generalCases.length}개 분류)`,
              children: renderFilterAndTable(),
            },
            {
              key: 'luxury',
              label: `사치성재산 취득세율 (${luxuryCases.length}개 분류)`,
              children: renderFilterAndTable(),
            },
          ]}
        />
      </Card>

      {/* 범례 및 주의사항 */}
      <Card title="범례 및 주의사항" size="small">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Title level={5}>지역 구분</Title>
            <Space wrap>
              <Space><Tag color="red">조정대상지역</Tag><Text type="secondary">강남구, 서초구, 송파구, 용산구</Text></Space>
              <Space><Tag color="green">조정대상지역 외</Tag><Text type="secondary">일반 지역</Text></Space>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>세율 색상</Title>
            <Space wrap>
              <Space><div style={{ width: 14, height: 14, background: '#1890ff', borderRadius: 3 }} /><Text>취득세</Text></Space>
              <Space><div style={{ width: 14, height: 14, background: '#52c41a', borderRadius: 3 }} /><Text>지방교육세</Text></Space>
              <Space><div style={{ width: 14, height: 14, background: '#fa8c16', borderRadius: 3 }} /><Text>농특세</Text></Space>
              <Space><div style={{ width: 14, height: 14, background: '#722ed1', borderRadius: 3 }} /><Text strong>합계</Text></Space>
            </Space>
          </Col>
        </Row>
        <Alert
          type="warning"
          message="주의"
          description="실제 세율 적용 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다."
          showIcon
          style={{ marginTop: 12 }}
        />
      </Card>
    </Space>
  );
};

export default AcquisitionRates;
