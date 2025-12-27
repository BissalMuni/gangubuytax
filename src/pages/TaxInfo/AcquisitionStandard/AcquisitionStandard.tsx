import React, { useMemo, useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Alert, Button, Table, Tag, Tooltip, Spin, message } from 'antd';
import { BlockOutlined, ReloadOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTaxData } from '@/hooks/useTaxData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { fetchLawProvision, parseLawReference } from '@/utils/lawParser';

const { Title, Text } = Typography;

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
  } as Record<string, string[]>,
  물건: ['부동산등', '건축물', '토지', '차량', '차량/기계', '선박/차량/기계']
};

// 법조항 툴팁 컴포넌트
const LegalProvisionTooltip: React.FC<{
  provision: string;
  children: React.ReactNode;
}> = ({ provision, children }) => {
  const [provisionInfo, setProvisionInfo] = useState<LegalProvisionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchProvisionInfo = async (provision: string) => {
    if (hasLoaded) return;
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
      setHasLoaded(true);
    } catch (error) {
      console.error('Failed to fetch legal provision:', error);
      setProvisionInfo({
        article: provision,
        title: "법조항 정보",
        content: "법조항 내용을 불러오는 중 오류가 발생했습니다.",
        url: undefined
      });
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (provisionInfo?.url) {
      window.open(provisionInfo.url, '_blank');
    }
  };

  const tooltipContent = isLoading ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 14 }} spin />} />
      <Text style={{ color: '#fff' }}>로딩 중...</Text>
    </div>
  ) : provisionInfo ? (
    <div style={{ maxWidth: 360 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{provisionInfo.article}</div>
      <div style={{ fontWeight: 500, marginBottom: 8, color: '#fadb14' }}>{provisionInfo.title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.6 }}>{provisionInfo.content}</div>
      {provisionInfo.url && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: 11 }}>
          클릭하면 법령정보센터로 이동합니다
        </div>
      )}
    </div>
  ) : null;

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      overlayStyle={{ maxWidth: 400 }}
      onOpenChange={(visible) => {
        if (visible && !hasLoaded) {
          fetchProvisionInfo(provision);
        }
      }}
    >
      <a
        href="#"
        onClick={handleClick}
        style={{ color: '#1890ff', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
      >
        {children} <LinkOutlined style={{ fontSize: 12 }} />
      </a>
    </Tooltip>
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
      } catch (err) {
        console.error('Error loading acquisition standard data:', err);
        message.error('과세표준 데이터를 불러오는 중 오류가 발생했습니다.');
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

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '납세자',
      dataIndex: '납세자',
      key: '납세자',
      width: '8%',
    },
    {
      title: '취득원인',
      dataIndex: '취득원인',
      key: '취득원인',
      width: '8%',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '거래유형',
      dataIndex: '거래유형',
      key: '거래유형',
      width: '12%',
    },
    {
      title: '물건',
      dataIndex: '물건',
      key: '물건',
      width: '12%',
    },
    {
      title: '가액',
      dataIndex: '가액',
      key: '가액',
      width: '10%',
    },
    {
      title: '관계',
      dataIndex: '관계',
      key: '관계',
      width: '10%',
    },
    {
      title: '적용 과세표준',
      dataIndex: '적용과세표준',
      key: '적용과세표준',
      width: '20%',
      render: (text: string) => (
        <Text strong style={{ color: '#722ed1' }}>
          <span dangerouslySetInnerHTML={{ __html: text }} />
        </Text>
      ),
    },
    {
      title: '관련 규정',
      dataIndex: '관련규정',
      key: '관련규정',
      width: '20%',
      render: (provisions: string[]) => (
        <Space direction="vertical" size={4}>
          {provisions && provisions.map((provision, idx) => {
            const trimmedProvision = provision ? String(provision).trim() : '';
            return trimmedProvision ? (
              <div key={idx}>
                <LegalProvisionTooltip provision={trimmedProvision}>
                  {trimmedProvision}
                </LegalProvisionTooltip>
              </div>
            ) : null;
          })}
        </Space>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    message.error('취득세 과세표준 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <Card style={{ textAlign: 'center', padding: 48 }}>
        <Space direction="vertical" size="large">
          <Text type="danger" style={{ fontSize: 18 }}>데이터 로드 실패</Text>
          <Text type="secondary">취득세 과세표준 정보를 불러올 수 없습니다.</Text>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 필터 섹션 */}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* 헤더 */}
          <Space align="center">
            <BlockOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            <Title level={3} style={{ margin: 0 }}>취득세 과세표준</Title>
          </Space>

          {/* 납세자 필터 */}
          <div>
            <Space wrap>
              {FILTER_OPTIONS.납세자.map((option) => (
                <Button
                  key={option}
                  type={filters.납세자 === option ? 'primary' : 'default'}
                  style={filters.납세자 === option ? { background: '#52c41a', borderColor: '#52c41a' } : {}}
                  onClick={() => updateFilter('납세자', option)}
                >
                  {option}
                </Button>
              ))}
            </Space>
          </div>

          {/* 취득원인 필터 */}
          <div>
            <Space wrap>
              {FILTER_OPTIONS.취득원인.map((option) => (
                <Button
                  key={option}
                  type={filters.취득원인 === option ? 'primary' : 'default'}
                  onClick={() => updateFilter('취득원인', option)}
                >
                  {option}
                </Button>
              ))}
            </Space>
          </div>

          {/* 거래유형 필터 - 취득원인 선택시만 표시 */}
          {filters.취득원인 && FILTER_OPTIONS.거래유형[filters.취득원인] && (
            <div style={{ paddingLeft: 16, borderLeft: '4px solid #91d5ff' }}>
              <Space wrap>
                {FILTER_OPTIONS.거래유형[filters.취득원인].map((option: string) => (
                  <Button
                    key={option}
                    type={filters.거래유형 === option ? 'primary' : 'default'}
                    style={filters.거래유형 === option ? { background: '#722ed1', borderColor: '#722ed1' } : {}}
                    onClick={() => updateFilter('거래유형', option)}
                  >
                    {option}
                  </Button>
                ))}
              </Space>
            </div>
          )}

          {/* 물건 필터 */}
          <div>
            <Space wrap>
              {FILTER_OPTIONS.물건.map((option) => (
                <Button
                  key={option}
                  type={filters.물건 === option ? 'primary' : 'default'}
                  style={filters.물건 === option ? { background: '#fa8c16', borderColor: '#fa8c16' } : {}}
                  onClick={() => updateFilter('물건', option)}
                >
                  {option}
                </Button>
              ))}
            </Space>
          </div>

          {/* 필터 초기화 및 현재 필터 현황 */}
          <Row align="middle" gutter={16}>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={resetFilters}
                style={{ background: '#595959', color: '#fff', borderColor: '#595959' }}
              >
                필터 초기화
              </Button>
            </Col>
            <Col flex={1}>
              {(filters.취득원인 || filters.납세자 || filters.물건 || filters.거래유형) && (
                <div style={{ padding: 12, background: '#e6f7ff', borderRadius: 6 }}>
                  <Space wrap>
                    {filters.취득원인 && (
                      <Tag color="blue">{filters.취득원인}</Tag>
                    )}
                    {filters.납세자 && (
                      <Tag color="green">{filters.납세자}</Tag>
                    )}
                    {filters.거래유형 && (
                      <Tag color="purple">{filters.거래유형}</Tag>
                    )}
                    {filters.물건 && (
                      <Tag color="orange">{filters.물건}</Tag>
                    )}
                  </Space>
                </div>
              )}
            </Col>
          </Row>
        </Space>
      </Card>

      {/* 과세표준 테이블 */}
      <Card>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey={(record, index) => `${record.납세자}-${record.취득원인}-${record.거래유형}-${index}`}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `총 ${total}건` }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* 범례 및 특례 */}
      <Card title="특례 및 평가기간">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {legalBasisData.map((basis, index) => (
            <div key={index} style={{ borderLeft: '4px solid #1890ff', paddingLeft: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 4 }}>{basis.title}</Text>
              <Text type="secondary">{basis.content}</Text>
            </div>
          ))}
        </Space>
      </Card>

      {/* 주의사항 */}
      <Card>
        <Alert
          type="warning"
          message="주의사항"
          description="실제 과세표준 적용 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다. 특례나 감면 적용 여부에 따라 실제 과세표준이 달라질 수 있습니다."
          showIcon
        />
      </Card>
    </Space>
  );
};

export default AcquisitionStandard;
