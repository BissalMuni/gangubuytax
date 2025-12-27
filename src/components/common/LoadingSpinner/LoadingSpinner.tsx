import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  text = '로딩 중...',
}) => {
  const iconSize = {
    small: 16,
    default: 32,
    large: 48,
  };

  const antIcon = <LoadingOutlined style={{ fontSize: iconSize[size] }} spin />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 12,
      }}
    >
      <Spin indicator={antIcon} size={size} />
      {text && (
        <Text type="secondary" style={{ fontSize: size === 'small' ? 12 : 14 }}>
          {text}
        </Text>
      )}
    </div>
  );
};

export default LoadingSpinner;
