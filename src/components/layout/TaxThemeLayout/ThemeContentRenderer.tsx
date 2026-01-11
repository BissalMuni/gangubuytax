import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Alert, Tag, Flex } from 'antd';
import { TeamOutlined, CalendarOutlined, GiftOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { SectionRenderer } from '@/pages/TaxTheme/components/SectionRenderers';

const { Title, Text } = Typography;

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

interface ThemeContentRendererProps {
  dataPath: string;
  isMobile: boolean;
  contentKey: string;
}

// 콘텐츠 키에 따른 아이콘 매핑
const getIconByKey = (key: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'family-trade': <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    'family-gift': <GiftOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    'reconstruction': <HomeOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    'tax-standard': <FileTextOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
  };
  return iconMap[key] || <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
};

const ThemeContentRenderer: React.FC<ThemeContentRendererProps> = ({
  dataPath,
  isMobile,
  contentKey,
}) => {
  const [data, setData] = useState<ThemeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(dataPath);
        if (!response.ok) {
          throw new Error('데이터를 불러올 수 없습니다.');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataPath]);

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
        type="warning"
        message="준비 중"
        description={error || '이 콘텐츠는 아직 준비 중입니다.'}
        showIcon
      />
    );
  }

  const { meta, sections } = data;

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <Flex vertical gap={8} style={{ width: '100%' }}>
        {/* 간략한 헤더 */}
        <Card size="small" styles={{ body: { padding: 12 } }}>
          <Flex align="center" gap={8}>
            {getIconByKey(contentKey)}
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

        {/* 모든 섹션 */}
        {sections.map((section) => (
          <div key={section.id} id={`${contentKey}-${section.id}`} style={{ width: '100%' }}>
            <SectionRenderer section={section} isMobile={true} />
          </div>
        ))}
      </Flex>
    );
  }

  // 데스크탑 레이아웃
  return (
    <Flex vertical gap={16} style={{ width: '100%' }}>
      {/* 헤더 */}
      <Card>
        <Flex align="flex-start" gap={16}>
          {React.cloneElement(getIconByKey(contentKey) as React.ReactElement, {
            style: { fontSize: 48, color: (getIconByKey(contentKey) as React.ReactElement).props.style?.color || '#1890ff', flexShrink: 0 }
          })}
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

      {/* 섹션 컨텐츠 */}
      {sections.map((section) => (
        <div key={section.id} id={`${contentKey}-${section.id}`} style={{ width: '100%' }}>
          <SectionRenderer section={section} isMobile={false} />
        </div>
      ))}
    </Flex>
  );
};

export default ThemeContentRenderer;
