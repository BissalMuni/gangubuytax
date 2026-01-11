import React from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Menu, Card, Input, Statistic } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  getSidebarMenuItems,
  getSidebarSelectedKeys,
  getSidebarOpenKeys,
} from '@/config/menu.config';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();

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
              styles={{ content: { fontSize: 16, color: '#1890ff' } }}
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

      {/* 메뉴 - 경로에 따라 다른 메뉴 표시 */}
      <Menu
        mode="inline"
        selectedKeys={getSidebarSelectedKeys(location.pathname)}
        defaultOpenKeys={getSidebarOpenKeys(location.pathname)}
        items={getSidebarMenuItems(location.pathname)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
