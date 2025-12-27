import React from 'react';
import { Card, Tag, Typography, Space, Badge, Collapse } from 'antd';
import { TaxItem } from '@/types/tax.types';

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface TaxListProps {
  items: TaxItem[];
}

const TaxList: React.FC<TaxListProps> = ({ items }) => {
  // 아이템을 취득 유형별로 그룹화
  const groupedItems = items.reduce((acc, item) => {
    const acquisitionType = item.path[0] || '기타';
    if (!acc[acquisitionType]) {
      acc[acquisitionType] = [];
    }
    acc[acquisitionType].push(item);
    return acc;
  }, {} as Record<string, TaxItem[]>);

  // 취득 유형 순서 정의
  const typeOrder = ['유상취득', '무상취득', '원시취득'];
  const sortedTypes = Object.keys(groupedItems).sort((a, b) => {
    const aIndex = typeOrder.indexOf(a);
    const bIndex = typeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 16 }}>
      {sortedTypes.map((type) => (
        <Card
          key={type}
          title={
            <Space>
              <Title level={5} style={{ margin: 0 }}>{type}</Title>
              <Badge count={groupedItems[type].length} style={{ backgroundColor: '#52c41a' }} />
            </Space>
          }
          style={{ borderLeft: '4px solid #52c41a' }}
        >
          <Collapse defaultActiveKey={[]} ghost>
            {groupedItems[type].map((item) => (
              <Panel
                key={item.id}
                header={
                  <Space wrap>
                    <Text strong style={{ fontSize: 15 }}>
                      {item.path[1] || '일반'}
                    </Text>
                    {item.path.slice(2).map((path, pathIndex) => (
                      <Tag key={pathIndex} color="green">{path}</Tag>
                    ))}
                    <Tag color="blue">{item.category}</Tag>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {Object.entries(item.data).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#fafafa',
                        borderRadius: 4,
                      }}
                    >
                      <Text type="secondary">{key}</Text>
                      <Text
                        strong
                        style={{
                          color: key === '취득세' ? '#1890ff' : key === '지방교육세' ? '#52c41a' : '#fa8c16',
                        }}
                      >
                        {value}
                      </Text>
                    </div>
                  ))}
                </Space>
              </Panel>
            ))}
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default TaxList;
