import React from 'react';
import { Tooltip as AntTooltip, Typography } from 'antd';

const { Text } = Typography;

interface TooltipProps {
  content: string[];
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  if (!content || content.length === 0) {
    return <>{children}</>;
  }

  const tooltipContent = (
    <div style={{ maxWidth: 360 }}>
      {content.map((item, index) => (
        <div
          key={index}
          style={{
            borderBottom: index < content.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            paddingBottom: index < content.length - 1 ? 8 : 0,
            marginBottom: index < content.length - 1 ? 8 : 0,
          }}
        >
          {typeof item === 'string' ? (
            <Text style={{ color: '#fff', fontSize: 12 }}>{item}</Text>
          ) : typeof item === 'object' && item !== null ? (
            (item as any).clause ? (
              <div>
                <Text strong style={{ color: '#fadb14', fontSize: 12 }}>
                  {(item as any).clause}
                </Text>
                <div style={{ marginTop: 4, paddingLeft: 8 }}>
                  {Array.isArray((item as any).content) ? (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {((item as any).content as string[]).map((contentItem: string, idx: number) => (
                        <li key={idx} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>
                          {contentItem}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>
                      {(item as any).content || ''}
                    </Text>
                  )}
                </div>
              </div>
            ) : (
              <Text style={{ color: '#fff', fontSize: 12 }}>{JSON.stringify(item)}</Text>
            )
          ) : (
            <Text style={{ color: '#fff', fontSize: 12 }}>{String(item)}</Text>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AntTooltip title={tooltipContent} placement="top" overlayStyle={{ maxWidth: 400 }}>
      <span style={{ cursor: 'help' }}>{children}</span>
    </AntTooltip>
  );
};

export default Tooltip;
