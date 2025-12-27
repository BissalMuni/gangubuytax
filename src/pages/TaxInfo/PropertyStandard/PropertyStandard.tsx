import React from 'react';
import { Card, Row, Col, Typography, Space, Table, Alert, Steps } from 'antd';
import { AppstoreOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PropertyStandard: React.FC = () => {
  const columns = [
    { title: '연도', dataIndex: 'year', key: 'year', width: 80 },
    { title: '주택', dataIndex: 'housing', key: 'housing', width: 100 },
    { title: '토지', dataIndex: 'land', key: 'land', width: 100 },
    { title: '건축물', dataIndex: 'building', key: 'building', width: 100 },
  ];

  const dataSource = [
    { key: '1', year: '2024', housing: '60%', land: '70%', building: '70%' },
    { key: '2', year: '2023', housing: '60%', land: '70%', building: '70%' },
    { key: '3', year: '2022', housing: '60%', land: '70%', building: '70%' },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 헤더 */}
      <Card>
        <Space align="center">
          <AppstoreOutlined style={{ fontSize: 32, color: '#52c41a' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>재산세 과세표준</Title>
            <Text type="secondary">재산세 과세표준 산정 기준을 확인하세요</Text>
          </div>
        </Space>
      </Card>

      {/* 과세표준 산정 원칙 */}
      <Card title="과세표준 산정 원칙">
        <div style={{ background: '#e6f7ff', padding: 24, borderRadius: 8, textAlign: 'center' }}>
          <Title level={4} style={{ color: '#003a8c', marginBottom: 8 }}>
            과세표준 = 공시가격 × 공정시장가액비율
          </Title>
          <Text style={{ color: '#1890ff' }}>재산세 과세표준의 기본 산정 공식</Text>
        </div>
      </Card>

      {/* 재산 유형별 과세표준 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8 }}>
                  <AppstoreOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>주택 과세표준</Text>
                  <br />
                  <Text type="secondary">주택 재산세 과세표준</Text>
                </div>
              </Space>
              <div style={{ borderLeft: '4px solid #52c41a', paddingLeft: 12 }}>
                <Text strong>공시가격 기준</Text>
                <br />
                <Text type="secondary">개별주택가격 × 공정시장가액비율</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>공정시장가액비율: 60% (2024년 기준)</Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
                  <AppstoreOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>토지 과세표준</Text>
                  <br />
                  <Text type="secondary">토지 재산세 과세표준</Text>
                </div>
              </Space>
              <div style={{ borderLeft: '4px solid #1890ff', paddingLeft: 12 }}>
                <Text strong>공시지가 기준</Text>
                <br />
                <Text type="secondary">개별공시지가 × 면적 × 공정시장가액비율</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>공정시장가액비율: 70% (2024년 기준)</Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#fff7e6', padding: 12, borderRadius: 8 }}>
                  <AppstoreOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>건축물 과세표준</Text>
                  <br />
                  <Text type="secondary">건축물 재산세 과세표준</Text>
                </div>
              </Space>
              <div style={{ borderLeft: '4px solid #fa8c16', paddingLeft: 12 }}>
                <Text strong>시가표준액</Text>
                <br />
                <Text type="secondary">건물신축가격기준액 × 구조지수 × 용도지수 × 위치지수</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>공정시장가액비율: 70%</Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <div style={{ background: '#f9f0ff', padding: 12, borderRadius: 8 }}>
                  <AppstoreOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>선박 과세표준</Text>
                  <br />
                  <Text type="secondary">선박 재산세 과세표준</Text>
                </div>
              </Space>
              <div style={{ borderLeft: '4px solid #722ed1', paddingLeft: 12 }}>
                <Text strong>신조선박</Text>
                <br />
                <Text type="secondary">건조가격 또는 수입가격</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 공정시장가액비율 변화 */}
      <Card title="공정시장가액비율 변화">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          bordered
        />
      </Card>

      {/* 과세표준 산정 절차 */}
      <Card title="과세표준 산정 절차">
        <Steps
          current={-1}
          items={[
            { title: '재산 분류', description: '주택, 토지, 건축물, 선박 구분' },
            { title: '공시가격 확정', description: '해당 연도 공시가격 적용' },
            { title: '비율 적용', description: '공정시장가액비율 곱하기' },
            { title: '과세표준 확정', description: '최종 과세표준 산출' },
          ]}
        />
      </Card>

      {/* 주의사항 */}
      <Card>
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message="과세표준 관련 주의사항"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>공정시장가액비율은 매년 변경될 수 있습니다.</li>
              <li>재산의 실제 거래가격과 과세표준은 다를 수 있습니다.</li>
              <li>특례나 감면 적용 시 과세표준이 조정될 수 있습니다.</li>
              <li>정확한 과세표준은 과세통지서를 통해 확인하시기 바랍니다.</li>
            </ul>
          }
          showIcon
        />
      </Card>
    </Space>
  );
};

export default PropertyStandard;
