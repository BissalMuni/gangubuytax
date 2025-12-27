import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Card, Input, Statistic } from 'antd';
import {
  PercentageOutlined,
  KeyOutlined,
  BookOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: 'acquisition',
      icon: <KeyOutlined />,
      label: '취득세',
      children: [
        {
          key: '/local-tax/acquisition/rates',
          icon: <PercentageOutlined />,
          label: <Link to="/local-tax/acquisition/rates">세율</Link>,
        },
        {
          key: '/local-tax/acquisition/standard',
          icon: <AppstoreOutlined />,
          label: <Link to="/local-tax/acquisition/standard">과세표준</Link>,
        },
        {
          key: '/local-tax/acquisition/requirements',
          icon: <BookOutlined />,
          label: <Link to="/local-tax/acquisition/requirements">과세요건</Link>,
        },
        {
          key: '/local-tax/acquisition/special',
          icon: <FileTextOutlined />,
          label: <Link to="/local-tax/acquisition/special">특례</Link>,
        },
      ],
    },
    {
      key: 'property',
      icon: <HomeOutlined />,
      label: '재산세',
      children: [
        {
          key: '/local-tax/property/rates',
          icon: <PercentageOutlined />,
          label: <Link to="/local-tax/property/rates">세율</Link>,
        },
        {
          key: '/local-tax/property/standard',
          icon: <AppstoreOutlined />,
          label: <Link to="/local-tax/property/standard">과세표준</Link>,
        },
        {
          key: '/local-tax/property/special',
          icon: <FileTextOutlined />,
          label: <Link to="/local-tax/property/special">특례</Link>,
        },
      ],
    },
  ];

  const getSelectedKeys = () => {
    // 기존 tax-info 경로도 지원
    const path = location.pathname.replace('/tax-info/', '/local-tax/');
    return [path];
  };

  const getOpenKeys = () => {
    if (location.pathname.includes('/acquisition')) return ['acquisition'];
    if (location.pathname.includes('/property')) return ['property'];
    return ['acquisition', 'property'];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={256}
      collapsedWidth={80}
      trigger={null}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {!collapsed && (
        <>
          {/* 정보 카드 */}
          <Card
            size="small"
            style={{ margin: 16, background: '#e6f7ff', border: 'none' }}
          >
            <Statistic
              title="지방세 정보 시스템"
              value={157}
              suffix="개 항목"
              valueStyle={{ fontSize: 16, color: '#1890ff' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              최종 업데이트: 2025.08.15
            </div>
          </Card>

          {/* 검색 */}
          <div style={{ padding: '0 16px 16px' }}>
            <Input
              placeholder="세금 정보 검색"
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
            />
          </div>
        </>
      )}

      {/* 메뉴 */}
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
