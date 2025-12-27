import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Guide: React.FC = () => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <QuestionCircleOutlined style={{ fontSize: 32, color: '#1890ff', marginRight: 16 }} />
        <div>
          <Title level={3} style={{ margin: 0 }}>사용 가이드</Title>
          <Text type="secondary">시스템 사용 방법과 세금 정보 가이드</Text>
        </div>
      </div>
      <Empty
        description="사용 가이드가 곧 추가될 예정입니다."
        style={{ padding: 48 }}
      />
    </Card>
  );
};

export default Guide;
