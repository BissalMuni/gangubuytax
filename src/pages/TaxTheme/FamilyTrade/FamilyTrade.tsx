import React, { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Spin, Alert, Tag, Anchor, Row, Col, Modal, Grid, Flex } from 'antd';
import { TeamOutlined, CalendarOutlined, CloseOutlined } from '@ant-design/icons';
import { SectionRenderer } from '../components/SectionRenderers';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface ThemeMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  version: string;
}

interface ThemeData {
  meta: ThemeMeta;
  sections: any[];
}

const FamilyTrade: React.FC = () => {
  const [data, setData] = useState<ThemeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const screens = useBreakpoint();

  // 모바일 여부 (md 미만)
  const isMobile = !screens.md;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/tax_theme/family-trade.json');
        if (!response.ok) {
          throw new Error('데이터를 불러올 수 없습니다.');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 데스크탑에서만 클릭 시 모달 열기
  const handleSectionClick = useCallback((section: any) => {
    if (!isMobile) {
      setSelectedSection(section);
      setModalOpen(true);
    }
  }, [isMobile]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedSection(null);
  }, []);

  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: isMobile ? 24 : 48 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">데이터를 불러오는 중...</Text>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Alert
        type="error"
        message="데이터 로드 실패"
        description={error || '데이터를 불러올 수 없습니다.'}
        showIcon
      />
    );
  }

  const { meta, sections } = data;

  // 모바일 레이아웃: 단일 페이지 스크롤
  if (isMobile) {
    return (
      <Flex vertical gap={8} style={{ width: '100%' }}>
        {/* 간략한 헤더 */}
        <Card size="small" styles={{ body: { padding: 12 } }}>
          <Flex align="center" gap={8}>
            <TeamOutlined style={{ fontSize: 24, color: '#1890ff', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Flex align="center" gap={6} wrap="wrap">
                <Title level={5} style={{ margin: 0, wordBreak: 'keep-all' }}>{meta.title}</Title>
                <Tag color="blue" style={{ margin: 0 }}>취득세</Tag>
              </Flex>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {meta.lastUpdated}
              </Text>
            </div>
          </Flex>
        </Card>

        {/* 모든 섹션을 스크롤로 표시 */}
        {sections.map((section) => (
          <div key={section.id} id={section.id} style={{ width: '100%' }}>
            <SectionRenderer section={section} isMobile={true} />
          </div>
        ))}
      </Flex>
    );
  }

  // 데스크탑 레이아웃
  // 앵커 아이템 생성
  const anchorItems = sections.map((section) => ({
    key: section.id,
    href: `#${section.id}`,
    title: section.title,
  }));

  return (
    <>
      <Flex vertical gap={16} style={{ width: '100%' }}>
        {/* 헤더 */}
        <Card>
          <Flex align="flex-start" gap={16}>
            <TeamOutlined style={{ fontSize: 48, color: '#1890ff', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Flex align="center" gap={8} wrap="wrap">
                <Title level={2} style={{ margin: 0 }}>{meta.title}</Title>
                <Tag color="blue">{meta.category === 'acquisition' ? '취득세' : meta.category}</Tag>
              </Flex>
              <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                {meta.description}
              </Text>
              <Flex align="center" gap={8} style={{ marginTop: 8 }}>
                <CalendarOutlined />
                <Text type="secondary">최종 업데이트: {meta.lastUpdated}</Text>
                <Tag>v{meta.version}</Tag>
              </Flex>
            </div>
          </Flex>
        </Card>

        {/* 메인 컨텐츠 */}
        <Row gutter={24}>
          {/* 사이드 네비게이션 */}
          <Col md={6} lg={5} xl={4}>
            <Anchor
              offsetTop={80}
              items={anchorItems}
              style={{ position: 'sticky', top: 80 }}
            />
          </Col>

          {/* 섹션 컨텐츠 */}
          <Col md={18} lg={19} xl={20}>
            <Flex vertical gap={16} style={{ width: '100%' }}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  onClick={() => handleSectionClick(section)}
                  style={{ cursor: 'pointer', width: '100%' }}
                >
                  <SectionRenderer section={section} isMobile={false} />
                </div>
              ))}
            </Flex>
          </Col>
        </Row>
      </Flex>

      {/* 데스크탑 전용 Modal */}
      <Modal
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        width="90vw"
        style={{ top: 20, maxWidth: 1200 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 120px)',
            overflow: 'auto',
            padding: 24,
          },
        }}
        closeIcon={
          <CloseOutlined
            style={{
              fontSize: 20,
              color: '#666',
              padding: 8,
              borderRadius: '50%',
              background: '#f5f5f5',
            }}
          />
        }
        maskClosable={true}
        destroyOnClose
      >
        {selectedSection && (
          <div onClick={(e) => e.stopPropagation()}>
            <SectionRenderer section={selectedSection} isMobile={false} />
          </div>
        )}
      </Modal>
    </>
  );
};

export default FamilyTrade;
