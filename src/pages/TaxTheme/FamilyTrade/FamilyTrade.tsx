import React, { useEffect, useState, useCallback } from 'react';
import { Card, Typography, Space, Spin, Alert, Tag, Anchor, Row, Col, Modal, Grid, Drawer } from 'antd';
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

  const handleSectionClick = useCallback((section: any) => {
    setSelectedSection(section);
    setModalOpen(true);
  }, []);

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

  // 앵커 아이템 생성
  const anchorItems = sections.map((section) => ({
    key: section.id,
    href: `#${section.id}`,
    title: section.title,
  }));

  // 모바일용 Drawer / 데스크탑용 Modal 공통 컨텐츠
  const popupContent = selectedSection && (
    <div onClick={(e) => e.stopPropagation()}>
      <SectionRenderer section={selectedSection} />
    </div>
  );

  return (
    <>
      <Space direction="vertical" size={isMobile ? 'small' : 'middle'} style={{ width: '100%' }}>
        {/* 헤더 */}
        <Card styles={{ body: { padding: isMobile ? 16 : 24 } }}>
          {isMobile ? (
            // 모바일 헤더 레이아웃
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>{meta.title}</Title>
              </Space>
              <Tag color="blue">{meta.category === 'acquisition' ? '취득세' : meta.category}</Tag>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {meta.description}
              </Text>
              <Space size="small">
                <CalendarOutlined style={{ fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {meta.lastUpdated} | v{meta.version}
                </Text>
              </Space>
            </Space>
          ) : (
            // 데스크탑 헤더 레이아웃
            <Space align="start" size="large">
              <TeamOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <div>
                <Space>
                  <Title level={2} style={{ margin: 0 }}>{meta.title}</Title>
                  <Tag color="blue">{meta.category === 'acquisition' ? '취득세' : meta.category}</Tag>
                </Space>
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  {meta.description}
                </Text>
                <Space style={{ marginTop: 8 }}>
                  <CalendarOutlined />
                  <Text type="secondary">최종 업데이트: {meta.lastUpdated}</Text>
                  <Tag>v{meta.version}</Tag>
                </Space>
              </div>
            </Space>
          )}
        </Card>

        {/* 메인 컨텐츠 */}
        <Row gutter={isMobile ? 0 : 24}>
          {/* 사이드 네비게이션 - 모바일에서 숨김 */}
          <Col xs={0} sm={0} md={6} lg={5} xl={4}>
            <Anchor
              offsetTop={80}
              items={anchorItems}
              style={{ position: 'sticky', top: 80 }}
            />
          </Col>

          {/* 섹션 컨텐츠 */}
          <Col xs={24} sm={24} md={18} lg={19} xl={20}>
            <Space direction="vertical" size={isMobile ? 'small' : 'middle'} style={{ width: '100%' }}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  onClick={() => handleSectionClick(section)}
                  style={{ cursor: 'pointer' }}
                >
                  <SectionRenderer section={section} isMobile={isMobile} />
                </div>
              ))}
            </Space>
          </Col>
        </Row>
      </Space>

      {/* 모바일: Drawer (하단에서 올라옴) / 데스크탑: Modal */}
      {isMobile ? (
        <Drawer
          open={modalOpen}
          onClose={handleModalClose}
          placement="bottom"
          height="90vh"
          title={selectedSection?.title}
          closeIcon={
            <CloseOutlined
              style={{
                fontSize: 18,
                color: '#666',
                padding: 6,
                borderRadius: '50%',
                background: '#f5f5f5',
              }}
            />
          }
          styles={{
            body: {
              padding: 16,
              overflow: 'auto',
            },
          }}
        >
          {popupContent}
        </Drawer>
      ) : (
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
          {popupContent}
        </Modal>
      )}
    </>
  );
};

export default FamilyTrade;
