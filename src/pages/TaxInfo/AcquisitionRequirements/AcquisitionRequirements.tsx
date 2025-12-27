import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Alert, Button, Collapse, message } from 'antd';
import { BookOutlined, FileTextOutlined, ArrowLeftOutlined, ReloadOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/tax_requirements/acquisitionRequirements.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();

        if (Array.isArray(jsonData)) {
          const validData = jsonData.filter(item => item && item.title);
          setDataList(validData);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error loading acquisition requirements data:', error);
        setError('과세요건 데이터를 불러오는 중 오류가 발생했습니다.');
        message.error('과세요건 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemSelect = (item: AcquisitionRequirementsData) => {
    setSelectedItem(item);
    setExpandedSections([]);

    if (item.content && item.content.length > 0) {
      setExpandedSections([item.content[0].title]);
    }
  };

  const handleBackToList = () => {
    setSelectedItem(null);
    setExpandedSections([]);
  };

  const isContentTextArray = (content: any): content is ContentText[] => {
    return Array.isArray(content) && content.length > 0 && 'text' in content[0];
  };

  const renderContent = (items: ContentText[] | ContentItem[]) => {
    if (isContentTextArray(items)) {
      return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {items.map((item, index) => (
            <Card key={index} size="small">
              <Paragraph style={{ marginBottom: item.basis && item.basis.length > 0 ? 8 : 0 }}>
                <span dangerouslySetInnerHTML={{ __html: item.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </Paragraph>
              {item.basis && item.basis.length > 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <strong>관련 규정:</strong> {item.basis.join(', ')}
                </Text>
              )}
            </Card>
          ))}
        </Space>
      );
    } else {
      return (
        <Collapse
          ghost
          expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
        >
          {(items as ContentItem[]).map((item, index) => (
            <Panel
              key={index}
              header={
                <div>
                  <Text strong>{item.title}</Text>
                  {item.description && (
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        <span dangerouslySetInnerHTML={{ __html: item.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </Text>
                    </div>
                  )}
                </div>
              }
            >
              {item.content && renderContent(item.content)}
            </Panel>
          ))}
        </Collapse>
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || dataList.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: 48 }}>
        <Space direction="vertical" size="large">
          <Text type="danger" style={{ fontSize: 18 }}>데이터 로드 실패</Text>
          <Text type="secondary">{error || '데이터가 없습니다.'}</Text>
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {!selectedItem ? (
        <>
          {/* 헤더 */}
          <Card>
            <Space align="center">
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>취득세 과세요건</Title>
                <Text type="secondary">취득세 과세요건에 대한 상세 정보를 확인하실 수 있습니다.</Text>
              </div>
            </Space>
          </Card>

          {/* 항목 선택 카드 */}
          <Card title="항목 선택">
            <Row gutter={[16, 16]}>
              {dataList.map((item, index) => (
                <Col key={index} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    onClick={() => handleItemSelect(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Space align="start">
                      <FileTextOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />
                      <div>
                        <Text strong>{item.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.description?.replace(/\*\*/g, '')}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 주의사항 */}
          <Card>
            <Alert
              type="warning"
              message="주의"
              description="실제 과세요건 판단 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다. 개별 사안의 특수성에 따라 과세요건의 적용이 달라질 수 있으므로, 전문가의 상담을 받으시기 바랍니다."
              showIcon
            />
          </Card>
        </>
      ) : (
        <>
          {/* Back 버튼 */}
          <Card size="small">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBackToList}>
              목록으로 돌아가기
            </Button>
          </Card>

          {/* 선택된 항목 헤더 */}
          <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Space align="center">
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div>
                <Title level={3} style={{ margin: 0, color: '#003a8c' }}>{selectedItem.title}</Title>
                <Text>
                  <span dangerouslySetInnerHTML={{
                    __html: selectedItem.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                </Text>
              </div>
            </Space>
          </Card>

          {/* 메인 콘텐츠 */}
          <Collapse
            defaultActiveKey={expandedSections}
            expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
          >
            {selectedItem.content.map((section, index) => (
              <Panel
                key={index}
                header={
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{section.title}</Title>
                    {section.description && (
                      <Text type="secondary">{section.description}</Text>
                    )}
                  </div>
                }
              >
                {section.content && renderContent(section.content)}
              </Panel>
            ))}
          </Collapse>

          {/* 주의사항 */}
          <Card>
            <Alert
              type="warning"
              message="주의"
              description="실제 과세요건 판단 시에는 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다. 개별 사안의 특수성에 따라 과세요건의 적용이 달라질 수 있으므로, 전문가의 상담을 받으시기 바랍니다."
              showIcon
            />
          </Card>
        </>
      )}
    </Space>
  );
};

export default AcquisitionRequirements;
