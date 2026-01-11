import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flex, Tag } from 'antd';
import { HomeOutlined, BankOutlined, BulbOutlined } from '@ant-design/icons';
import { ROUTES } from '@/constants/routes';
import { getContentSequence } from '@/config/contentSequence';

// 메뉴 구조 정의
const menuStructure = {
  home: {
    key: 'home',
    label: '홈',
    icon: <HomeOutlined />,
    path: ROUTES.HOME,
    children: null,
  },
  localTax: {
    key: 'local-tax',
    label: '지방세 기본정보',
    icon: <BankOutlined />,
    path: ROUTES.LOCAL_TAX.ACQUISITION.RATES,
    children: [
      {
        key: 'acquisition',
        label: '취득세',
        children: [
          { key: 'rates', label: '세율', path: ROUTES.LOCAL_TAX.ACQUISITION.RATES },
          { key: 'standard', label: '과세표준', path: ROUTES.LOCAL_TAX.ACQUISITION.STANDARD },
          { key: 'requirements', label: '과세요건', path: ROUTES.LOCAL_TAX.ACQUISITION.REQUIREMENTS },
          { key: 'special', label: '특례', path: ROUTES.LOCAL_TAX.ACQUISITION.SPECIAL },
        ],
      },
      {
        key: 'property',
        label: '재산세',
        children: [
          { key: 'p-rates', label: '세율', path: ROUTES.LOCAL_TAX.PROPERTY.RATES },
          { key: 'p-standard', label: '과세표준', path: ROUTES.LOCAL_TAX.PROPERTY.STANDARD },
          { key: 'p-special', label: '특례', path: ROUTES.LOCAL_TAX.PROPERTY.SPECIAL },
        ],
      },
    ],
  },
  localTaxTheme: {
    key: 'local-tax-theme',
    label: '테마별 지방세',
    icon: <BulbOutlined />,
    path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE,
    children: [
      {
        key: 'theme-acquisition',
        label: '취득세',
        children: [
          { key: 'family-trade', label: '가족간 유상거래', path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE },
          { key: 'family-gift', label: '가족간 무상거래', path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_GIFT },
          { key: 'reconstruction', label: '재건축 취득세', path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.RECONSTRUCTION },
          { key: 'tax-standard', label: '신축시 과세표준', path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.TAX_STANDARD },
        ],
      },
    ],
  },
};

const topMenuItems = [
  menuStructure.home,
  menuStructure.localTax,
  menuStructure.localTaxTheme,
];

const MobileNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTopMenu, setActiveTopMenu] = useState<string>('home');
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // URL 변경 감지 (replaceState 포함)
  const updateMenuFromPath = useCallback((path: string) => {
    setCurrentPath(path);
    if (path === '/') {
      setActiveTopMenu('home');
      setActiveSubMenu(null);
    } else if (path.startsWith('/local-tax-theme')) {
      setActiveTopMenu('local-tax-theme');
      if (path.includes('/acquisition')) {
        setActiveSubMenu('theme-acquisition');
      }
    } else if (path.startsWith('/local-tax') || path.startsWith('/tax-info')) {
      setActiveTopMenu('local-tax');
      if (path.includes('/acquisition')) {
        setActiveSubMenu('acquisition');
      } else if (path.includes('/property')) {
        setActiveSubMenu('property');
      }
    }
  }, []);

  // URL에 따라 활성 메뉴 설정
  useEffect(() => {
    updateMenuFromPath(location.pathname);
  }, [location.pathname, updateMenuFromPath]);

  // history.replaceState 변경 감지를 위한 폴링
  useEffect(() => {
    const checkPathChange = () => {
      const path = window.location.pathname;
      if (path !== currentPath) {
        updateMenuFromPath(path);
      }
    };

    const interval = setInterval(checkPathChange, 200);
    return () => clearInterval(interval);
  }, [currentPath, updateMenuFromPath]);

  const currentTopMenu = topMenuItems.find(item => item.key === activeTopMenu);
  const currentSubMenuItems = currentTopMenu?.children || [];
  const currentSubMenu = currentSubMenuItems.find(item => item.key === activeSubMenu);
  const currentThirdItems = currentSubMenu?.children || [];

  const handleTopMenuClick = (item: typeof topMenuItems[0]) => {
    setActiveTopMenu(item.key);
    if (item.children) {
      // 자식이 있으면 첫 번째 서브메뉴 선택
      setActiveSubMenu(item.children[0].key);
    } else {
      setActiveSubMenu(null);
      navigate(item.path);
    }
  };

  const handleSubMenuClick = (item: { key: string; label: string; children?: any[] }) => {
    setActiveSubMenu(item.key);
  };

  const handleThirdMenuClick = (path: string) => {
    navigate(path);
  };

  // 현재 경로와 일치하는지 확인 (정확한 일치 또는 시퀀스 내 일치)
  const isActivePath = (path: string) => {
    // 현재 경로와 정확히 일치하면 true
    if (currentPath === path) return true;

    // 스크롤로 이동한 콘텐츠의 경우, 해당 시퀀스의 첫 번째 아이템만 활성화
    const { sequence, currentIndex } = getContentSequence(currentPath);
    if (sequence.length > 0 && currentIndex >= 0) {
      const currentItem = sequence[currentIndex];
      return currentItem?.path === path;
    }

    return false;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* 로고 + 최상위 메뉴 */}
      <div style={{
        background: '#001529',
        padding: '8px 12px',
      }}>
        <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
          <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: 14 }}>G</span>
          <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: 14 }}>B</span>
          <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 14 }}>T</span>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>GanguBuyTax</span>
        </Flex>

        {/* 최상위 메뉴 - 가로 스크롤 */}
        <div style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <Flex gap={8}>
            {topMenuItems.map((item) => (
              <Tag
                key={item.key}
                color={activeTopMenu === item.key ? '#1890ff' : undefined}
                onClick={() => handleTopMenuClick(item)}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: 13,
                  margin: 0,
                  border: activeTopMenu === item.key ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  background: activeTopMenu === item.key ? '#1890ff' : 'transparent',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  flexShrink: 0,
                }}
              >
                {item.icon}
                {item.label}
              </Tag>
            ))}
          </Flex>
        </div>
      </div>

      {/* 2단계 서브메뉴 */}
      {currentSubMenuItems.length > 0 && (
        <div style={{
          background: '#f5f5f5',
          padding: '8px 12px',
          borderBottom: '1px solid #e8e8e8',
        }}>
          <div style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            <Flex gap={8}>
              {currentSubMenuItems.map((item) => (
                <Tag
                  key={item.key}
                  color={activeSubMenu === item.key ? 'blue' : 'default'}
                  onClick={() => handleSubMenuClick(item)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 10px',
                    fontSize: 12,
                    margin: 0,
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </Tag>
              ))}
            </Flex>
          </div>
        </div>
      )}

      {/* 3단계 메뉴 (컨텐츠 선택) */}
      {currentThirdItems.length > 0 && (
        <div style={{
          background: '#fff',
          padding: '8px 12px',
          borderBottom: '1px solid #e8e8e8',
        }}>
          <div style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}>
            <Flex gap={6}>
              {currentThirdItems.map((item) => (
                <Tag
                  key={item.key}
                  color={isActivePath(item.path) ? 'green' : undefined}
                  onClick={() => handleThirdMenuClick(item.path)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: 11,
                    margin: 0,
                    flexShrink: 0,
                    background: isActivePath(item.path) ? undefined : '#fafafa',
                    border: isActivePath(item.path) ? undefined : '1px solid #d9d9d9',
                  }}
                >
                  {item.label}
                </Tag>
              ))}
            </Flex>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
