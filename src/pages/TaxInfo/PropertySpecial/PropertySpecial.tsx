import React from 'react';
import { Card, Row, Col, Typography, Space, Table, Steps } from 'antd';
import { BookOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PropertySpecial: React.FC = () => {
  const columns = [
    { title: '구분', dataIndex: 'category', key: 'category', width: 100 },
    { title: '대상', dataIndex: 'target', key: 'target', width: 200 },
    {
      title: '감면율',
      dataIndex: 'rate',
      key: 'rate',
      width: 80,
      render: (text: string, record: any) => (
        <Text strong style={{ color: record.color }}>{text}</Text>
      )
    },
    { title: '기준', dataIndex: 'standard', key: 'standard', width: 150 },
  ];

  const dataSource = [
    { key: '1', category: '1세대 1주택', target: '1세대가 1주택만 소유', rate: '25%', standard: '공시가격 6억원 이하', color: '#52c41a' },
    { key: '2', category: '농지', target: '농업인 직접 경작 농지', rate: '50%', standard: '농업경영체 등록', color: '#1890ff' },
    { key: '3', category: '임야', target: '산림소유자 보유 임야', rate: '50%', standard: '임업경영체 등록', color: '#fa8c16' },
    { key: '4', category: '소상공인', target: '소상공인 사업장', rate: '50%', standard: '매출액 기준', color: '#722ed1' },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 헤더 */}
      <Card>
        <Space align="center">
          <BookOutlined style={{ fontSize: 32, color: '#52c41a' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>재산세 특례</Title>
            <Text type="secondary">재산세 감면 및 특례 적용 기준을 확인하세요</Text>
          </div>
        </Space>
      </Card>

      {/* 주요 재산세 특례 */}
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
                  <Text type="secondary">주택 재산세 감면</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text>공시가격 6억원 이하: 25% 감면</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /><Text>고령자·장애인 추가 감면</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>1세대가 1주택만 보유하는 경우</Text>
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
                  <Text strong style={{ fontSize: 16 }}>농지 감면</Text>
                  <br />
                  <Text type="secondary">농업용 토지 감면</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#1890ff' }} /><Text>농지: 50% 감면</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#1890ff' }} /><Text>축사·농업용 창고: 50% 감면</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>농업인이 직접 농업에 사용하는 농지</Text>
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
                  <Text strong style={{ fontSize: 16 }}>소상공인 특례</Text>
                  <br />
                  <Text type="secondary">소상공인 사업장 감면</Text>
                </div>
              </Space>
              <Space direction="vertical" size={4}>
                <Space><CheckCircleOutlined style={{ color: '#722ed1' }} /><Text>소상공인 사업장: 50% 감면</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#722ed1' }} /><Text>영세사업자 추가 혜택</Text></Space>
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>일정 규모 이하 소상공인 사업장</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 감면 대상 및 비율 */}
      <Card title="감면 대상 및 비율">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          bordered
        />
      </Card>

      {/* 특례 적용 조건 */}
      <Card title="특례 적용 조건">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Title level={5}>필수 요건</Title>
            <Space direction="vertical" size="middle">
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>거주 요건</Text>
                  <br />
                  <Text type="secondary">1세대 1주택의 경우 실제 거주 필요</Text>
                </div>
              </Space>
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>소유 기간</Text>
                  <br />
                  <Text type="secondary">일정 기간 이상 소유 필요</Text>
                </div>
              </Space>
              <Space align="start">
                <CheckCircleOutlined style={{ color: '#52c41a', marginTop: 4 }} />
                <div>
                  <Text strong>용도 제한</Text>
                  <br />
                  <Text type="secondary">해당 용도로만 사용해야 함</Text>
                </div>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>신청 절차</Title>
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                { title: '신청서 작성', description: '감면신청서 및 구비서류 준비' },
                { title: '제출', description: '해당 지방자치단체에 제출' },
                { title: '심사·승인', description: '요건 심사 후 감면 적용' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      {/* 신청 기한 및 유의사항 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Space align="start">
              <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div>
                <Text strong style={{ color: '#003a8c' }}>신청 기한</Text>
                <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: '#1890ff' }}>
                  <li>과세기준일로부터 60일 이내</li>
                  <li>부과고지를 받은 날로부터 30일 이내</li>
                  <li>사유 발생일로부터 60일 이내</li>
                </ul>
                <Text type="secondary" style={{ fontSize: 12 }}>※ 지자체별로 다를 수 있음</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ background: '#fffbe6', borderColor: '#ffe58f' }}>
            <Space align="start">
              <WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <div>
                <Text strong style={{ color: '#ad6800' }}>주의사항</Text>
                <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: '#d48806' }}>
                  <li>허위 신청 시 3배 추징</li>
                  <li>용도 변경 시 감면 취소</li>
                  <li>매년 재신청 필요한 경우 있음</li>
                </ul>
                <Text type="secondary" style={{ fontSize: 12 }}>※ 정확한 정보는 해당 지자체 확인</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 필요 서류 */}
      <Card title="필요 서류">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <Text strong>1세대 1주택</Text>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>감면신청서</li>
                <li>주민등록등본</li>
                <li>건물등기부등본</li>
                <li>거주사실확인서</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <Text strong>농지 감면</Text>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>감면신청서</li>
                <li>농업경영체증명서</li>
                <li>농지원부</li>
                <li>직접경작확인서</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" style={{ background: '#fafafa' }}>
              <Text strong>소상공인</Text>
              <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
                <li>감면신청서</li>
                <li>사업자등록증</li>
                <li>매출액증명서</li>
                <li>임대차계약서</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default PropertySpecial;
