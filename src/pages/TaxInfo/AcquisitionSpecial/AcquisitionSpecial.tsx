import React from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, Row, Col, Typography, Space, Alert, Button, Steps, message } from 'antd';
import { BookOutlined, CheckCircleOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AcquisitionSpecial: React.FC = () => {
  const { isLoading, error } = useTaxData();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    message.error('취득세 특례 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <Card style={{ textAlign: 'center', padding: 48 }}>
        <Space direction="vertical" size="large">
          <Text type="danger" style={{ fontSize: 18 }}>데이터 로드 실패</Text>
          <Text type="secondary">취득세 특례 정보를 불러올 수 없습니다.</Text>
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
            <Title level={3} style={{ margin: 0 }}>취득세 특례</Title>
            <Text type="secondary">취득세 감면 및 특례 적용 기준을 확인하세요</Text>
          </div>
        </Space>
      </Card>

      {/* 주요 특례 카드들 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8 }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>1세대 1주택 특례</Text>
                  <br />
                  <Text type="secondary">주택 취득세 감면</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text>취득세율: 0.8%</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text>농특세 비과세</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>상속으로 1세대 1주택을 취득하는 경우</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>농지 취득 특례</Text>
                  <br />
                  <Text type="secondary">농업인 농지 취득</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#1890ff' }} /><Text>취득세율: 2.3%</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#1890ff' }} /><Text>농특세: 0.46%</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>농업인이 직접 농업에 사용할 농지 취득</Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f9f0ff', padding: 12, borderRadius: 8 }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>서민주택 특례</Text>
                  <br />
                  <Text type="secondary">85㎡ 이하 주택</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#722ed1' }} /><Text>농특세 비과세</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#722ed1' }} /><Text>지방교육세 감면</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>주거전용면적 85㎡ 이하 서민주택</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 특례 적용 조건 */}
      <Card title="특례 적용 조건">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={5}>감면 대상</Title>
            <Space direction="vertical" size="middle">
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>1세대 1주택자</Text>
                  <br />
                  <Text type="secondary">상속으로 주택을 취득하는 경우</Text>
                </div>
              </Space>
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>농업인</Text>
                  <br />
                  <Text type="secondary">직접 농업에 사용할 농지 취득</Text>
                </div>
              </Space>
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>서민주택</Text>
                  <br />
                  <Text type="secondary">85㎡ 이하 주택 취득자</Text>
                </div>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>제외 대상</Title>
            <Space direction="vertical" size="middle">
              <Space align="start">
                <WarningOutlined style={{ color: '#ff4d4f', marginTop: 4 }} />
                <div>
                  <Text strong>투기지역 다주택</Text>
                  <br />
                  <Text type="secondary">2주택 이상 보유 시 중과세</Text>
                </div>
              </Space>
              <Space align="start">
                <WarningOutlined style={{ color: '#ff4d4f', marginTop: 4 }} />
                <div>
                  <Text strong>고급주택</Text>
                  <br />
                  <Text type="secondary">시가 9억원 초과 주택</Text>
                </div>
              </Space>
              <Space align="start">
                <WarningOutlined style={{ color: '#ff4d4f', marginTop: 4 }} />
                <div>
                  <Text strong>사치성 재산</Text>
                  <br />
                  <Text type="secondary">골프장, 고급오락장 등</Text>
                </div>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 신청 절차 */}
      <Card title="특례 신청 절차">
        <Steps
          current={-1}
          items={[
            { title: '요건 확인', description: '특례 적용 요건 사전 확인' },
            { title: '서류 준비', description: '필요 서류 및 증명서 준비' },
            { title: '신고·신청', description: '세무서 또는 온라인 신고' },
            { title: '승인·확정', description: '특례 적용 승인 및 세액 확정' },
          ]}
        />
      </Card>

      {/* 주의사항 */}
      <Card>
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message="특례 적용 시 주의사항"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>특례 적용 요건을 충족하지 않을 경우 추징될 수 있습니다.</li>
              <li>특례 신청은 취득일로부터 60일 이내에 해야 합니다.</li>
              <li>관련 증빙서류를 반드시 구비하여 신청하시기 바랍니다.</li>
              <li>법령 변경에 따라 특례 내용이 달라질 수 있으니 최신 정보를 확인하세요.</li>
            </ul>
          }
          showIcon
        />
      </Card>
    </Space>
  );
};

export default AcquisitionSpecial;
