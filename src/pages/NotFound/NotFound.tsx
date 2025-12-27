import React from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="페이지를 찾을 수 없습니다. 요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
      extra={
        <Link to="/">
          <Button type="primary" icon={<HomeOutlined />}>
            홈으로 돌아가기
          </Button>
        </Link>
      }
    />
  );
};

export default NotFound;
