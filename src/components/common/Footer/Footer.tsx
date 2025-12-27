import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: '#001529',
        padding: '24px 50px',
      }}
    >
      <Typography.Title level={5} style={{ color: '#fff', marginBottom: 16 }}>
        세금 정보 시스템
      </Typography.Title>
      <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
        © 2024 Tax Information System. All rights reserved.
      </Text>
      <br />
      <Text style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: 12 }}>
        본 시스템은 정보 제공 목적으로만 사용되며, 법적 효력은 없습니다.
      </Text>
      <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '16px 0' }} />
      <Space split={<Divider type="vertical" style={{ borderColor: 'rgba(255, 255, 255, 0.25)' }} />}>
        <Link style={{ color: 'rgba(255, 255, 255, 0.65)' }}>개인정보처리방침</Link>
        <Link style={{ color: 'rgba(255, 255, 255, 0.65)' }}>이용약관</Link>
        <Link style={{ color: 'rgba(255, 255, 255, 0.65)' }}>문의하기</Link>
      </Space>
    </AntFooter>
  );
};

export default Footer;
