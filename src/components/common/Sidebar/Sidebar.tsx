import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiDollarSign,
  FiPercent,
  FiBookOpen,
  FiHome,
  FiLayers
} from 'react-icons/fi';

interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  category?: string;
  type?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['취득세 정보', '재산세 정보']);

  const menuItems: MenuItem[] = [
    {
      label: '취득세 정보',
      icon: FiDollarSign,
      children: [
        { 
          label: '세율', 
          icon: FiPercent, 
          path: '/tax-info/acquisition/rates',
          category: 'acquisition',
          type: 'rates'
        },
        { 
          label: '과세표준', 
          icon: FiLayers, 
          path: '/tax-info/acquisition/standard',
          category: 'acquisition', 
          type: 'standard'
        },
        { 
          label: '특례', 
          icon: FiBookOpen, 
          path: '/tax-info/acquisition/special',
          category: 'acquisition', 
          type: 'special'
        }
      ],
    },
    {
      label: '재산세 정보',
      icon: FiHome,
      children: [
        { 
          label: '세율', 
          icon: FiPercent, 
          path: '/tax-info/property/rates',
          category: 'property',
          type: 'rates'
        },
        { 
          label: '과세표준', 
          icon: FiLayers, 
          path: '/tax-info/property/standard',
          category: 'property', 
          type: 'standard'
        },
        { 
          label: '특례', 
          icon: FiBookOpen, 
          path: '/tax-info/property/special',
          category: 'property', 
          type: 'special'
        }
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => {
      const isExpanded = prev.includes(label);
      if (isExpanded) {
        // 현재 확장된 메뉴를 축소
        return prev.filter(item => item !== label);
      } else {
        // 새로운 메뉴를 확장
        return [...prev, label];
      }
    });
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.label} className="menu-group">
          {item.path ? (
            <div className="flex">
              <Link
                to={item.path}
                className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
                style={{ flex: 1, marginLeft: depth > 0 ? `${depth * 16}px` : '0' }}
              >
                {Icon && <Icon className="icon" />}
                <span>{item.label}</span>
              </Link>
              <button
                onClick={() => toggleMenu(item.label)}
                className="menu-group-header"
                style={{ width: 'auto', padding: '8px' }}
              >
                <span className="arrow">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => toggleMenu(item.label)}
              className={`menu-group-header ${isExpanded ? 'active' : ''}`}
            >
              <div className="flex items-center">
                {Icon && <Icon className="icon" />}
                <span>{item.label}</span>
              </div>
              <span className="arrow">
                {isExpanded ? '▼' : '▶'}
              </span>
            </button>
          )}
          {isExpanded && (
            <ul className="menu-list" style={{ display: 'block' }}>
              {item.children?.map(child => (
                <li key={child.label} className="menu-item" data-category={child.category} data-type={child.type}>
                  {renderMenuItem(child, depth + 1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.path || '#'}
        className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
        style={{ marginLeft: depth > 0 ? `${depth * 16}px` : '0' }}
      >
        {Icon && <Icon className="icon" />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className={`sidebar-section bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-0'
    } overflow-hidden`}>
      {/* Toggle Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-700">메뉴</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      </div>

      {/* 정보 박스 */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <h3 className="font-bold text-blue-900 mb-2">세금 정보 시스템</h3>
        <div className="text-sm text-blue-700">최종 업데이트: 2025.08.15</div>
        <div className="text-sm text-blue-700 mt-1">
          📊 총 항목: <strong>157</strong>개
        </div>
      </div>

      {/* 검색 박스 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="세금 정보 검색"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <nav className="space-y-2">
          {menuItems.map(item => (
            <div key={item.label}>{renderMenuItem(item)}</div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;