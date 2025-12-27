import React from 'react';
import { Card, Row, Col, Typography, Space, Alert, Steps } from 'antd';
import { PercentageOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PropertyRates: React.FC = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 헤더 */}
      <Card>
        <Space align="center">
          <PercentageOutlined style={{ fontSize: 32, color: '#52c41a' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>재산세 세율</Title>
            <Text type="secondary">재산세 세율 정보를 확인하세요</Text>
          </div>
        </Space>
      </Card>

      {/* 재산세 세율 카드들 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8 }}>
                  <PercentageOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>주택 재산세</Text>
                  <br />
                  <Text type="secondary">주택에 대한 재산세율</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">6천만원 이하</Text>
                  <Text strong>0.1%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">1.5억원 이하</Text>
                  <Text strong>0.15%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">3억원 이하</Text>
                  <Text strong>0.25%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">3억원 초과</Text>
                  <Text strong style={{ color: '#ff4d4f' }}>0.4%</Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
                  <PercentageOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>토지 재산세</Text>
                  <br />
                  <Text type="secondary">토지에 대한 재산세율</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">종합합산</Text>
                  <Text strong>0.2% ~ 0.4%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">별도합산</Text>
                  <Text strong>0.2% ~ 0.5%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">분리과세</Text>
                  <Text strong>0.07% ~ 2.0%</Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f9f0ff', padding: 12, borderRadius: 8 }}>
                  <PercentageOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>건축물 재산세</Text>
                  <br />
                  <Text type="secondary">건축물에 대한 재산세율</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">일반건축물</Text>
                  <Text strong>0.25%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">주거용</Text>
                  <Text strong>0.1% ~ 0.4%</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">상업용</Text>
                  <Text strong>0.25% ~ 0.5%</Text>
                </div>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 재산세 과세 기준일 */}
      <Card title="재산세 과세 기준일">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card size="small" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
              <Text strong style={{ color: '#003a8c' }}>주택·건축물·선박</Text>
              <br />
              <Text style={{ color: '#1890ff' }}>매년 6월 1일 현재 재산 상황</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>납세고지: 7월 / 납부기한: 9월 30일</Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
              <Text strong style={{ color: '#135200' }}>토지</Text>
              <br />
              <Text style={{ color: '#52c41a' }}>매년 6월 1일 현재 재산 상황</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>납세고지: 9월 / 납부기한: 11월 30일</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 재산세 계산 방법 */}
      <Card title="재산세 계산 방법">
        <div style={{ background: '#fafafa', padding: 24, borderRadius: 8, textAlign: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ marginBottom: 8 }}>재산세 = 과세표준 × 세율</Title>
          <Text type="secondary">과세표준: 공시가격 × 공정시장가액비율</Text>
        </div>
        <Steps
          current={-1}
          items={[
            { title: '1단계', description: '과세표준 산정' },
            { title: '2단계', description: '해당 세율 적용' },
            { title: '3단계', description: '재산세액 산출' },
          ]}
        />
      </Card>

      {/* 주의사항 */}
      <Card>
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message="재산세 관련 주의사항"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>재산세는 매년 과세기준일 현재의 재산 상황에 따라 과세됩니다.</li>
              <li>지역별로 세율이나 과세기준이 다를 수 있으니 해당 지자체에 확인하시기 바랍니다.</li>
              <li>재산세 감면이나 특례 적용 여부를 미리 확인하시기 바랍니다.</li>
            </ul>
          }
          showIcon
        />
      </Card>
    </Space>
  );
};

export default PropertyRates;
