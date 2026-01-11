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
};

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
export const InfoRenderer: React.FC<{ section: InfoSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="small">
      {section.content.items.map((item, idx) => (
        <div key={idx}>
          <Text type="secondary">{item.label}: </Text>
          <Text strong>{item.value}</Text>
        </div>
      ))}
    </Space>
  </Card>
);

// Alert 섹션 렌더러
export const AlertRenderer: React.FC<{ section: AlertSection }> = ({ section }) => (
  <Alert
    type={section.variant}
    message={<Text strong>{section.title}</Text>}
    description={
      <Space direction="vertical" size="small">
        <Text>{section.content.text}</Text>
        {section.content.emphasis && (
          <Tag color={section.variant === 'warning' ? 'orange' : 'green'}>
            {section.content.emphasis}
          </Tag>
        )}
      </Space>
    }
    showIcon
  />
);

// Table 섹션 렌더러
export const TableRenderer: React.FC<{ section: TableSection }> = ({ section }) => {
  const columns = section.content.columns.map((col) => ({
    title: col.title,
    dataIndex: col.key,
    key: col.key,
    width: col.width,
    render: (text: string, record: any) => {
      if (col.key === 'included') {
        return text === 'O' ? (
          <Tag color="green">O</Tag>
        ) : (
          <Tag color="red">X</Tag>
        );
      }
      if (record.highlight) {
        return <Text strong style={{ color: '#1890ff' }}>{text}</Text>;
      }
      return text;
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
          <span>{section.title}</span>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        bordered
      />
    </Card>
  );
};

// List 섹션 렌더러
export const ListRenderer: React.FC<{ section: ListSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {section.content.items.map((item, idx) => (
        <div key={item.id}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              {section.content.variant === 'numbered' && (
                <Tag color="blue">{idx + 1}</Tag>
              )}
              <Text strong>{item.title || item.text}</Text>
            </Space>
            {item.description && (
              <Text type="secondary" style={{ marginLeft: section.content.variant === 'numbered' ? 32 : 0 }}>
                {item.description}
              </Text>
            )}
            {item.legalBasis && (
              <Text type="secondary" style={{ fontSize: 12, marginLeft: section.content.variant === 'numbered' ? 32 : 0 }}>
                ({item.legalBasis})
              </Text>
            )}
            {item.subItems && (
              <ul style={{ marginLeft: 48, marginTop: 8 }}>
                {item.subItems.map((sub) => (
                  <li key={sub.id}>
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
export const CriteriaRenderer: React.FC<{ section: CriteriaSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Paragraph>{section.content.description}</Paragraph>
      {section.content.legalBasis && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          ({section.content.legalBasis})
        </Text>
      )}
      <Row gutter={16}>
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
                <Text strong>{cond.condition}</Text>
                <Tag color={cond.resultType === 'negative' ? 'red' : 'green'}>
                  {cond.result}
                </Tag>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      {section.content.note && (
        <Alert type="info" message={section.content.note} showIcon />
      )}
    </Space>
  </Card>
);

// Comparison 섹션 렌더러
export const ComparisonRenderer: React.FC<{ section: ComparisonSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Row gutter={16}>
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
              <Text strong style={{ color: item.variant === 'primary' ? '#1890ff' : '#722ed1' }}>
                {item.title}
              </Text>
              <Title level={4} style={{ margin: 0 }}>{item.value}</Title>
              <Text type="secondary">{item.description}</Text>
              {item.legalBasis && (
                <Text type="secondary" style={{ fontSize: 12 }}>
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
export const CasesRenderer: React.FC<{ section: CasesSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {section.content.items.map((item) => (
        <Card
          key={item.id}
          size="small"
          title={item.title}
          extra={
            <Tag color={item.resultType === 'success' ? 'green' : 'red'}>
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
              message={item.scenario}
              icon={<InfoCircleOutlined />}
              showIcon
            />
            <Row gutter={[8, 8]}>
              {item.analysis.map((a, idx) => (
                <Col key={idx} xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{a.label}</Text>
                    <br />
                    <Text strong>{a.value}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            {item.note && (
              <Text type="secondary">
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
export const StepsRenderer: React.FC<{ section: StepsSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Steps
      direction="vertical"
      size="small"
      current={-1}
      items={section.content.items.map((item) => ({
        title: item.title,
        description: item.description,
      }))}
    />
  </Card>
);

// References 섹션 렌더러
export const ReferencesRenderer: React.FC<{ section: ReferencesSection }> = ({ section }) => (
  <Card
    size="small"
    title={
      <Space>
        {section.icon && iconMap[section.icon]}
        <span>{section.title}</span>
      </Space>
    }
  >
    <Space direction="vertical" size="small">
      {section.content.items.map((item, idx) => (
        <div key={idx}>
          <Tag color="blue">{item.law}</Tag>
          <Text strong>{item.article}</Text>
          <Text type="secondary"> - {item.title}</Text>
        </div>
      ))}
    </Space>
  </Card>
);

// 메인 섹션 렌더러
export const SectionRenderer: React.FC<{ section: Section }> = ({ section }) => {
  switch (section.type) {
    case 'info':
      return <InfoRenderer section={section as InfoSection} />;
    case 'alert':
      return <AlertRenderer section={section as AlertSection} />;
    case 'table':
      return <TableRenderer section={section as TableSection} />;
    case 'list':
      return <ListRenderer section={section as ListSection} />;
    case 'criteria':
      return <CriteriaRenderer section={section as CriteriaSection} />;
    case 'comparison':
      return <ComparisonRenderer section={section as ComparisonSection} />;
    case 'cases':
      return <CasesRenderer section={section as CasesSection} />;
    case 'steps':
      return <StepsRenderer section={section as StepsSection} />;
    case 'references':
      return <ReferencesRenderer section={section as ReferencesSection} />;
    default:
      return null;
  }
};

export default SectionRenderer;
