import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiDollarSign,
  FiGift,
  FiTool,
  FiPercent,
  FiBookOpen,
  FiHome,
  FiLayers,
  FiUsers
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['acquisition']);

  const menuItems: MenuItem[] = [
    {
      label: '취득세 정보',
      icon: FiBookOpen,
      children: [
        { label: '전체보기', path: '/tax-info', category: 'acquisition', type: 'all' },
        { 
          label: '유상취득', 
          icon: FiDollarSign, 
          path: '/tax-info/paid', 
          category: 'acquisition', 
          type: '유상취득',
          children: [
            { label: '일반과세', path: '/tax-info/paid/general', category: 'acquisition', type: '유상취득' },
            { label: '다주택자', path: '/tax-info/paid/multi-home', category: 'acquisition', type: '유상취득' },
            { label: '법인', path: '/tax-info/paid/corporation', category: 'acquisition', type: '유상취득' },
            { label: '조정대상지역', path: '/tax-info/paid/adjustment-area', category: 'acquisition', type: '유상취득' },
          ]
        },
        { 
          label: '무상취득', 
          icon: FiGift, 
          path: '/tax-info/free', 
          category: 'acquisition', 
          type: '무상취득',
          children: [
            { label: '상속', path: '/tax-info/free/inheritance', category: 'acquisition', type: '무상취득' },
            { label: '증여', path: '/tax-info/free/gift', category: 'acquisition', type: '무상취득' },
            { label: '유증', path: '/tax-info/free/bequest', category: 'acquisition', type: '무상취득' },
          ]
        },
        { 
          label: '원시취득', 
          icon: FiTool, 
          path: '/tax-info/original', 
          category: 'acquisition', 
          type: '원시취득',
          children: [
            { label: '시효취득', path: '/tax-info/original/prescription', category: 'acquisition', type: '원시취득' },
            { label: '공용징수', path: '/tax-info/original/expropriation', category: 'acquisition', type: '원시취득' },
            { label: '법원경매', path: '/tax-info/original/auction', category: 'acquisition', type: '원시취득' },
          ]
        },
      ],
    },
    {
      label: '세율 구분',
      icon: FiPercent,
      children: [
        { label: '취득세', path: '/tax-info/acquisition-tax', category: 'rate', type: '취득세' },
        { label: '지방교육세', path: '/tax-info/education-tax', category: 'rate', type: '지방교육세' },
        { label: '농어촌특별세', path: '/tax-info/agricultural-tax', category: 'rate', type: '농특세' },
      ],
    },
    {
      label: '과세표준',
      icon: FiLayers,
      children: [
        { label: '주택', icon: FiHome, path: '/tax-info/housing', category: 'standard', type: '주택' },
        { label: '건물', path: '/tax-info/building', category: 'standard', type: '건물' },
        { label: '토지', path: '/tax-info/land', category: 'standard', type: '토지' },
        { label: '농지', path: '/tax-info/farmland', category: 'standard', type: '농지' },
        { label: '시가인정액', path: '/tax-info/market-recognition-price', category: 'standard', type: '시가인정액' },
      ],
    },
    {
      label: '납세의무자',
      icon: FiUsers,
      children: [
        { label: '개인', path: '/tax-info/individual', category: 'taxpayer', type: '개인' },
        { label: '법인', path: '/tax-info/corporation', category: 'taxpayer', type: '법인' },
        { label: '비영리단체', path: '/tax-info/nonprofit', category: 'taxpayer', type: '비영리' },
      ],
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
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
        <div className="text-sm text-blue-700">최종 업데이트: 2024.08.15</div>
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