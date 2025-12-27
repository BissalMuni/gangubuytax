import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Calculator: React.FC = () => {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <CalculatorOutlined style={{ fontSize: 32, color: '#1890ff', marginRight: 16 }} />
        <div>
          <Title level={3} style={{ margin: 0 }}>세금 계산기</Title>
          <Text type="secondary">부동산 취득 시 필요한 세금을 간편하게 계산해보세요</Text>
        </div>
      </div>
      <Empty
        description="세금 계산기 기능이 곧 추가될 예정입니다."
        style={{ padding: 48 }}
      />
    </Card>
  );
};

export default Calculator;
