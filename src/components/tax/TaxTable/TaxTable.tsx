import React from 'react';
import { TaxItem } from '@/types/tax.types';

interface TaxTableProps {
  items: TaxItem[];
}

const TaxTable: React.FC<TaxTableProps> = ({ items }) => {
  // 모든 가능한 세금 종류 찾기
  const taxTypes = new Set<string>();
  items.forEach(item => {
    Object.keys(item.data).forEach(key => taxTypes.add(key));
  });

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>구분</th>
          <th>항목</th>
          {Array.from(taxTypes).map(type => (
            <th key={type}>{type}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.category}</td>
            <td>{item.name}</td>
            {Array.from(taxTypes).map(type => (
              <td key={type}>{item.data[type as keyof typeof item.data] || '-'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaxTable;