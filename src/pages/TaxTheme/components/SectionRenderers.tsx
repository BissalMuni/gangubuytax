import React from 'react';
import { Card, Table, Tag, Alert, Typography, Steps, Space, Row, Col } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalculatorOutlined,
  PercentageOutlined,
  DiffOutlined,
  FileSearchOutlined,
  OrderedListOutlined,
  FolderOutlined,
  BookOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// 아이콘 매핑
const iconMap: Record<string, React.ReactNode> = {
  FileTextOutlined: <FileTextOutlined />,
  TeamOutlined: <TeamOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  CalculatorOutlined: <CalculatorOutlined />,
  PercentageOutlined: <PercentageOutlined />,
  DiffOutlined: <DiffOutlined />,
  FileSearchOutlined: <FileSearchOutlined />,
  OrderedListOutlined: <OrderedListOutlined />,
  FolderOutlined: <FolderOutlined />,
  BookOutlined: <BookOutlined />,
  UsergroupDeleteOutlined: <UsergroupDeleteOutlined />,
};

// 공통 props
interface CommonProps {
  isMobile?: boolean;
}

// 섹션 타입 정의
interface BaseSection {
  id: string;
  type: string;
  title: string;
  icon?: string;
}

interface InfoSection extends BaseSection {
  type: 'info';
  content: {
    items: Array<{ label: string; value: string }>;
  };
}

interface AlertSection extends BaseSection {
  type: 'alert';
  variant: 'warning' | 'success' | 'error' | 'info';
  content: {
    text: string;
    emphasis?: string;
  };
}

interface TableSection extends BaseSection {
  type: 'table';
  content: {
    columns: Array<{ key: string; title: string; width?: string }>;
    rows: Array<Record<string, any>>;
  };
}

interface ListSection extends BaseSection {
  type: 'list';
  content: {
    variant: 'numbered' | 'bullet';
    items: Array<{
      id: string;
      title?: string;
      text?: string;
      description?: string;
      legalBasis?: string;
      note?: string;
      subItems?: Array<{ id: string; text: string }>;
    }>;
  };
}

interface CriteriaSection extends BaseSection {
  type: 'criteria';
  content: {
    description: string;
    legalBasis?: string;
    conditions: Array<{
      id: string;
      condition: string;
      result: string;
      resultType: 'positive' | 'negative';
    }>;
    note?: string;
  };
}

interface ComparisonSection extends BaseSection {
  type: 'comparison';
  content: {
    items: Array<{
      id: string;
      title: string;
      value: string;
      description: string;
      legalBasis?: string;
      variant: 'primary' | 'secondary';
    }>;
  };
}

interface CasesSection extends BaseSection {
  type: 'cases';
  content: {
    items: Array<{
      id: string;
      title: string;
      scenario: string;
      analysis: Array<{ label: string; value: string }>;
      result: string;
      resultType: 'success' | 'error';
      note?: string;
    }>;
  };
}

interface StepsSection extends BaseSection {
  type: 'steps';
  content: {
    items: Array<{
      step: number;
      title: string;
      description: string;
    }>;
  };
}

interface ReferencesSection extends BaseSection {
  type: 'references';
  content: {
    items: Array<{
      law: string;
      article: string;
      title: string;
      description?: string;
    }>;
  };
}

type Section =
  | InfoSection
  | AlertSection
  | TableSection
  | ListSection
  | CriteriaSection
  | ComparisonSection
  | CasesSection
  | StepsSection
  | ReferencesSection;

// Info 섹션 렌더러
export const InfoRenderer: React.FC<{ section: InfoSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="small">
      {section.content.items.map((item, idx) => (
        <div key={idx}>
          <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>{item.label}: </Text>
          <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>{item.value}</Text>
        </div>
      ))}
    </Space>
  </Card>
);

// Alert 섹션 렌더러
export const AlertRenderer: React.FC<{ section: AlertSection } & CommonProps> = ({ section, isMobile }) => (
  <Alert
    type={section.variant}
    message={<Text strong style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</Text>}
    description={
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: isMobile ? 13 : 14, wordBreak: 'keep-all', lineHeight: 1.6 }}>
          {section.content.text}
        </div>
        {section.content.emphasis && (
          <Tag color={section.variant === 'warning' ? 'orange' : 'green'} style={{ marginTop: 8 }}>
            {section.content.emphasis}
          </Tag>
        )}
      </div>
    }
    showIcon
    style={{ width: '100%' }}
  />
);

// Table 섹션 렌더러
export const TableRenderer: React.FC<{ section: TableSection } & CommonProps> = ({ section, isMobile }) => {
  const columns = section.content.columns.map((col) => ({
    title: col.title,
    dataIndex: col.key,
    key: col.key,
    width: isMobile ? undefined : col.width,
    render: (text: string, record: any) => {
      if (col.key === 'included') {
        return text === 'O' ? (
          <Tag color="green">O</Tag>
        ) : (
          <Tag color="red">X</Tag>
        );
      }
      if (record.highlight) {
        return <Text strong style={{ color: '#1890ff', fontSize: isMobile ? 12 : 14 }}>{text}</Text>;
      }
      return <span style={{ fontSize: isMobile ? 12 : 14 }}>{text}</span>;
    },
  }));

  const dataSource = section.content.rows.map((row, idx) => ({
    key: idx,
    ...row,
  }));

  return (
    <Card
      size="small"
      title={
        <Space>
          {section.icon && iconMap[section.icon]}
          <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        bordered
        scroll={isMobile ? { x: 'max-content' } : undefined}
      />
    </Card>
  );
};

// List 섹션 렌더러
export const ListRenderer: React.FC<{ section: ListSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size={isMobile ? 'small' : 'middle'} style={{ width: '100%' }}>
      {section.content.items.map((item, idx) => (
        <div key={item.id}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space wrap>
              {section.content.variant === 'numbered' && (
                <Tag color="blue">{idx + 1}</Tag>
              )}
              <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{item.title || item.text}</Text>
            </Space>
            {item.description && (
              <Text
                type="secondary"
                style={{
                  marginLeft: section.content.variant === 'numbered' ? (isMobile ? 24 : 32) : 0,
                  fontSize: isMobile ? 12 : 14,
                }}
              >
                {item.description}
              </Text>
            )}
            {item.legalBasis && (
              <Text
                type="secondary"
                style={{
                  fontSize: isMobile ? 11 : 12,
                  marginLeft: section.content.variant === 'numbered' ? (isMobile ? 24 : 32) : 0,
                }}
              >
                ({item.legalBasis})
              </Text>
            )}
            {item.note && (
              <Alert
                type="info"
                message={<div style={{ wordBreak: 'keep-all', lineHeight: 1.5 }}>{item.note}</div>}
                showIcon
                style={{
                  marginLeft: section.content.variant === 'numbered' ? (isMobile ? 24 : 32) : 0,
                  fontSize: isMobile ? 12 : 14,
                  width: '100%',
                }}
              />
            )}
            {item.subItems && (
              <ul style={{ marginLeft: isMobile ? 32 : 48, marginTop: 8, paddingLeft: 0 }}>
                {item.subItems.map((sub) => (
                  <li key={sub.id} style={{ fontSize: isMobile ? 12 : 14 }}>
                    <Text>{sub.text}</Text>
                  </li>
                ))}
              </ul>
            )}
          </Space>
        </div>
      ))}
    </Space>
  </Card>
);

// Criteria 섹션 렌더러
export const CriteriaRenderer: React.FC<{ section: CriteriaSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size={isMobile ? 'small' : 'middle'} style={{ width: '100%' }}>
      <Paragraph style={{ fontSize: isMobile ? 13 : 14, margin: 0 }}>{section.content.description}</Paragraph>
      {section.content.legalBasis && (
        <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
          ({section.content.legalBasis})
        </Text>
      )}
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        {section.content.conditions.map((cond) => (
          <Col key={cond.id} xs={24} sm={12}>
            <Card
              size="small"
              style={{
                borderColor: cond.resultType === 'negative' ? '#ff4d4f' : '#52c41a',
                backgroundColor: cond.resultType === 'negative' ? '#fff2f0' : '#f6ffed',
              }}
            >
              <Space direction="vertical" size="small">
                <Text strong style={{ fontSize: isMobile ? 13 : 14 }}>{cond.condition}</Text>
                <Tag color={cond.resultType === 'negative' ? 'red' : 'green'}>
                  {cond.result}
                </Tag>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      {section.content.note && (
        <Alert
          type="info"
          message={<div style={{ wordBreak: 'keep-all', lineHeight: 1.5 }}>{section.content.note}</div>}
          showIcon
          style={{ fontSize: isMobile ? 12 : 14, width: '100%' }}
        />
      )}
    </Space>
  </Card>
);

// Comparison 섹션 렌더러
export const ComparisonRenderer: React.FC<{ section: ComparisonSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
      {section.content.items.map((item) => (
        <Col key={item.id} xs={24} sm={12}>
          <Card
            size="small"
            style={{
              borderColor: item.variant === 'primary' ? '#1890ff' : '#722ed1',
              borderWidth: 2,
            }}
          >
            <Space direction="vertical" size="small">
              <Text strong style={{ color: item.variant === 'primary' ? '#1890ff' : '#722ed1', fontSize: isMobile ? 13 : 14 }}>
                {item.title}
              </Text>
              <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>{item.value}</Title>
              <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>{item.description}</Text>
              {item.legalBasis && (
                <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                  ({item.legalBasis})
                </Text>
              )}
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </Card>
);

// Cases 섹션 렌더러
export const CasesRenderer: React.FC<{ section: CasesSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size={isMobile ? 'small' : 'middle'} style={{ width: '100%' }}>
      {section.content.items.map((item) => (
        <Card
          key={item.id}
          size="small"
          title={<span style={{ fontSize: isMobile ? 13 : 14 }}>{item.title}</span>}
          extra={
            <Tag color={item.resultType === 'success' ? 'green' : 'red'} style={{ fontSize: isMobile ? 11 : 12 }}>
              {item.result}
            </Tag>
          }
          style={{
            borderColor: item.resultType === 'success' ? '#52c41a' : '#ff4d4f',
          }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Alert
              type="info"
              message={<div style={{ fontSize: isMobile ? 12 : 14, wordBreak: 'keep-all', lineHeight: 1.5 }}>{item.scenario}</div>}
              icon={<InfoCircleOutlined />}
              showIcon
              style={{ width: '100%' }}
            />
            <Row gutter={[isMobile ? 4 : 8, isMobile ? 4 : 8]}>
              {item.analysis.map((a, idx) => (
                <Col key={idx} xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center', padding: isMobile ? 4 : 8 }}>
                    <Text type="secondary" style={{ fontSize: isMobile ? 10 : 12 }}>{a.label}</Text>
                    <br />
                    <Text strong style={{ fontSize: isMobile ? 11 : 14 }}>{a.value}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            {item.note && (
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 14 }}>
                {item.resultType === 'success' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                {' '}{item.note}
              </Text>
            )}
          </Space>
        </Card>
      ))}
    </Space>
  </Card>
);

// Steps 섹션 렌더러
export const StepsRenderer: React.FC<{ section: StepsSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Steps
      direction="vertical"
      size="small"
      current={-1}
      items={section.content.items.map((item) => ({
        title: <span style={{ fontSize: isMobile ? 13 : 14 }}>{item.title}</span>,
        description: <span style={{ fontSize: isMobile ? 12 : 14 }}>{item.description}</span>,
      }))}
    />
  </Card>
);

// References 섹션 렌더러
export const ReferencesRenderer: React.FC<{ section: ReferencesSection } & CommonProps> = ({ section, isMobile }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span style={{ fontSize: isMobile ? 14 : 16 }}>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      {section.content.items.map((item, idx) => (
        <Card key={idx} size="small" style={{ background: '#fafafa' }}>
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Space wrap size={isMobile ? 'small' : 'middle'}>
              <Tag color="blue" style={{ fontSize: isMobile ? 11 : 12 }}>{item.law}</Tag>
              <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>{item.article}</Text>
            </Space>
            <Text style={{ fontSize: isMobile ? 12 : 14 }}>{item.title}</Text>
            {item.description && (
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>{item.description}</Text>
            )}
          </Space>
        </Card>
      ))}
    </Space>
  </Card>
);

// 메인 섹션 렌더러
export const SectionRenderer: React.FC<{ section: Section } & CommonProps> = ({ section, isMobile = false }) => {
  switch (section.type) {
    case 'info':
      return <InfoRenderer section={section as InfoSection} isMobile={isMobile} />;
    case 'alert':
      return <AlertRenderer section={section as AlertSection} isMobile={isMobile} />;
    case 'table':
      return <TableRenderer section={section as TableSection} isMobile={isMobile} />;
    case 'list':
      return <ListRenderer section={section as ListSection} isMobile={isMobile} />;
    case 'criteria':
      return <CriteriaRenderer section={section as CriteriaSection} isMobile={isMobile} />;
    case 'comparison':
      return <ComparisonRenderer section={section as ComparisonSection} isMobile={isMobile} />;
    case 'cases':
      return <CasesRenderer section={section as CasesSection} isMobile={isMobile} />;
    case 'steps':
      return <StepsRenderer section={section as StepsSection} isMobile={isMobile} />;
    case 'references':
      return <ReferencesRenderer section={section as ReferencesSection} isMobile={isMobile} />;
    default:
      return null;
  }
};

export default SectionRenderer;
