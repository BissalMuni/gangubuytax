import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Badge } from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { headerMenuItems, getHeaderSelectedKey } from '@/config/menu.config';
import { ROUTES } from '@/constants/routes';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <AntHeader
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#001529',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onToggle && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#fff',
            }}
          />
        )}
        <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', marginRight: 24 }}>
          <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '18px' }}>G</span>
          <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '18px' }}>B</span>
          <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '18px', marginRight: '8px' }}>T</span>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>GanguBuyTax</span>
        </Link>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getHeaderSelectedKey(location.pathname)}
        items={headerMenuItems}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
          borderBottom: 'none',
        }}
      />

      <Space size="middle">
        <Badge count={0} showZero={false}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ color: 'rgba(255, 255, 255, 0.65)' }}
          />
        </Badge>
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{ color: 'rgba(255, 255, 255, 0.65)' }}
        />
      </Space>
    </AntHeader>
  );
};

export default Header;
