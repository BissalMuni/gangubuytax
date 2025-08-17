import React from 'react';
import { TaxItem } from '@/types/tax.types';

interface TaxCardProps {
  items: TaxItem[];
}

const TaxCard: React.FC<TaxCardProps> = ({ items }) => {
  return (
    <div className="data-cards">
      {items.map((item) => (
        <div key={item.id} className="data-card">
          <div className="card-header">
            <div className="card-title">{item.name}</div>
            <span className="card-badge">{item.category}</span>
          </div>
          
          <div className="card-body">
            {Object.entries(item.data).map(([key, value]) => (
              <div key={key} className="tax-info">
                <div className="tax-label">{key}</div>
                <div className="tax-value">{value}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {item.path.join(' > ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaxCard;