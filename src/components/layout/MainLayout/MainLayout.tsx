import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Grid } from 'antd';
import Header from '@components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import Footer from '@/components/common/Footer';
import MobileNav from '@/components/common/MobileNav';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <MobileNav />
        <Content
          style={{
            marginTop: 140, // MobileNav 높이에 맞춤
            padding: '12px',
            minHeight: 'calc(100vh - 140px)',
            background: '#f5f5f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    );
  }

  // 데스크탑 레이아웃
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Layout>
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
          <Content
            style={{
              margin: '88px 24px 24px',
              padding: '24px',
              minHeight: 280,
              background: '#f5f5f5',
            }}
          >
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
