import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Tag, List } from 'antd';
import {
  BookOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOutlined style={{ fontSize: 24, color: '#fff' }} />,
      title: '세금 정보 조회',
      description: '취득세, 지방교육세, 농어촌특별세 등 다양한 세금 정보를 확인하세요.',
      link: '/tax-info',
      color: '#1890ff',
    },
    {
      icon: <CalculatorOutlined style={{ fontSize: 24, color: '#fff' }} />,
      title: '세금 계산기',
      description: '부동산 취득 시 필요한 세금을 간편하게 계산해보세요.',
      link: '/calculator',
      color: '#52c41a',
    },
    {
      icon: <LineChartOutlined style={{ fontSize: 24, color: '#fff' }} />,
      title: '세율 분석',
      description: '최신 세율 동향과 변경사항을 한눈에 파악하세요.',
      link: '/guide',
      color: '#722ed1',
    },
  ];

  const recentUpdates = [
    { title: '2024년 부동산 취득세율 변경', date: '2024.08.15', category: '정책변경' },
    { title: '조정대상지역 추가 지정', date: '2024.08.01', category: '지역정보' },
    { title: '농어촌특별세 감면 조건 완화', date: '2024.07.15', category: '세제혜택' },
  ];

  const quickLinks = [
    { title: '부동산 유상취득 세율', description: '주택, 토지 취득 시 적용되는 세율', link: '/tax-info/paid' },
    { title: '취득세 계산기', description: '간편하게 세금을 계산해보세요', link: '/calculator' },
    { title: '주택 관련 세율', description: '주택 수에 따른 차등 세율', link: '/tax-info/housing' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Hero Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: '48px 32px' }}
      >
        <Title level={1} style={{ color: '#fff', marginBottom: 16 }}>
          지방세 정보 포털
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 18, marginBottom: 0, maxWidth: 600 }}>
          지방세 정보를 쉽고 빠르게 확인하세요.
          <br />
          과세표준, 세율, 감면, 특례, 세금계산까지 모든 것을 한 곳에서.
        </Paragraph>
      </Card>

      {/* Features */}
      <Row gutter={[24, 24]}>
        {features.map((feature) => (
          <Col key={feature.title} xs={24} md={8}>
            <Link to={feature.link}>
              <Card hoverable style={{ height: '100%' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 0 }}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                  <Text style={{ color: '#1890ff' }}>
                    자세히 보기 <ArrowRightOutlined />
                  </Text>
                </Space>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Recent Updates & Quick Links */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="최근 업데이트" extra={<Link to="/guide">전체 보기 <ArrowRightOutlined /></Link>}>
            <List
              dataSource={recentUpdates}
              renderItem={(item) => (
                <List.Item
                  extra={<Tag color="blue">{item.category}</Tag>}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">{item.date}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="자주 찾는 정보">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {quickLinks.map((item) => (
                <Link key={item.title} to={item.link}>
                  <Card
                    size="small"
                    hoverable
                    style={{ background: '#fafafa' }}
                  >
                    <Text strong>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>{item.description}</Text>
                  </Card>
                </Link>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Home;
