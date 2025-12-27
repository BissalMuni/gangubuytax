import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Header from '@components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Layout>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
          <Content
            style={{
              margin: '24px',
              padding: '24px',
              minHeight: 280,
              background: '#f5f5f5',
            }}
          >
            {/* 사이드바가 완전히 닫혔을 때 토글 버튼 (모바일용) */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden"
              style={{
                position: 'fixed',
                top: 80,
                left: 16,
                zIndex: 1000,
                display: 'none',
              }}
            />
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
