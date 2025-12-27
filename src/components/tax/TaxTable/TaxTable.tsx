import React from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TaxItem } from '@/types/tax.types';

const { Text } = Typography;

interface TaxTableProps {
  items: TaxItem[];
}

const TaxTable: React.FC<TaxTableProps> = ({ items }) => {
  // 모든 가능한 세금 종류 찾기
  const taxTypes = new Set<string>();
  items.forEach(item => {
    Object.keys(item.data).forEach(key => taxTypes.add(key));
  });

  const columns: ColumnsType<TaxItem> = [
    {
      title: '구분',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '항목',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    ...Array.from(taxTypes).map(type => ({
      title: type,
      key: type,
      width: 120,
      render: (_: unknown, record: TaxItem) => {
        const value = record.data[type as keyof typeof record.data];
        const color = type === '취득세' ? '#1890ff' : type === '지방교육세' ? '#52c41a' : '#fa8c16';
        return value ? (
          <Text style={{ color, fontWeight: 500 }}>{value}</Text>
        ) : (
          <Text type="secondary">-</Text>
        );
      },
    })),
  ];

  return (
    <Table
      columns={columns}
      dataSource={items}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `총 ${total}건` }}
      scroll={{ x: 'max-content' }}
      size="middle"
      bordered
    />
  );
};

export default TaxTable;
