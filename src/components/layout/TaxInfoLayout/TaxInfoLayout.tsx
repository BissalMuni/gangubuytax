import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, Spin, Typography, Divider, Grid, Card, Anchor, Row, Col } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ContentItem, getContentSequence, LOCAL_TAX_ACQUISITION_SEQUENCE, LOCAL_TAX_PROPERTY_SEQUENCE } from '@/config/contentSequence';

const { Text } = Typography;
const { useBreakpoint } = Grid;

// 지방세 기본정보 페이지 동적 임포트
const AcquisitionRates = lazy(() => import('@/pages/TaxInfo/AcquisitionRates'));
const AcquisitionStandard = lazy(() => import('@/pages/TaxInfo/AcquisitionStandard'));
const AcquisitionRequirements = lazy(() => import('@/pages/TaxInfo/AcquisitionRequirements'));
const AcquisitionSpecial = lazy(() => import('@/pages/TaxInfo/AcquisitionSpecial'));
const PropertyRates = lazy(() => import('@/pages/TaxInfo/PropertyRates'));
const PropertyStandard = lazy(() => import('@/pages/TaxInfo/PropertyStandard'));
const PropertySpecial = lazy(() => import('@/pages/TaxInfo/PropertySpecial'));

// 콘텐츠 키에 따른 컴포넌트 매핑
const contentComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'acquisition-rates': AcquisitionRates,
  'acquisition-standard': AcquisitionStandard,
  'acquisition-requirements': AcquisitionRequirements,
  'acquisition-special': AcquisitionSpecial,
  'property-rates': PropertyRates,
  'property-standard': PropertyStandard,
  'property-special': PropertySpecial,
};

const TaxInfoLayout: React.FC = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedItems, setLoadedItems] = useState<ContentItem[]>([]);
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const initialLoadDone = useRef(false);

  // 현재 경로가 속한 시퀀스 결정
  const getCurrentSequence = useCallback(() => {
    if (location.pathname.includes('/property')) {
      return LOCAL_TAX_PROPERTY_SEQUENCE;
    }
    return LOCAL_TAX_ACQUISITION_SEQUENCE;
  }, [location.pathname]);

  // 초기 콘텐츠 로드
  useEffect(() => {
    if (initialLoadDone.current) return;

    const { current, sequence, currentIndex } = getContentSequence(location.pathname);
    if (current && sequence.length > 0) {
      setCurrentItem(current);
      // 현재 아이템부터 끝까지 로드
      setLoadedItems(sequence.slice(currentIndex));
      initialLoadDone.current = true;
    }
  }, [location.pathname]);

  // URL 변경 시 해당 위치로 스크롤
  useEffect(() => {
    const { current } = getContentSequence(location.pathname);
    if (current && loadedItems.length > 0) {
      const element = document.querySelector(`[data-content-key="${current.key}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname, loadedItems]);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (loadingRef.current || loadedItems.length === 0) return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // 하단에 도달했을 때 다음 콘텐츠 로드
    if (scrollBottom < 300) {
      const lastItem = loadedItems[loadedItems.length - 1];
      const { next } = getContentSequence(lastItem?.path || '');

      if (next && !loadedItems.find(item => item.key === next.key)) {
        loadingRef.current = true;
        setIsLoading(true);
        setLoadedItems(prev => [...prev, next]);

        setTimeout(() => {
          loadingRef.current = false;
          setIsLoading(false);
        }, 300);
      }
    }

    // 현재 보이는 콘텐츠 업데이트
    const sections = document.querySelectorAll('[data-content-key]');
    let foundCurrent = false;

    sections.forEach((section) => {
      if (foundCurrent) return;

      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom > 100) {
        const key = section.getAttribute('data-content-key');
        const item = loadedItems.find(i => i.key === key);
        if (item && item.key !== currentItem?.key) {
          setCurrentItem(item);
          window.history.replaceState(null, '', item.path);
          foundCurrent = true;
        }
      }
    });
  }, [loadedItems, currentItem]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 컴포넌트 렌더링
  const renderContent = (item: ContentItem) => {
    const Component = contentComponents[item.key];
    if (!Component) return null;

    return (
      <Suspense fallback={
        <Flex justify="center" align="center" style={{ minHeight: 200 }}>
          <Spin size="large" />
        </Flex>
      }>
        <Component />
      </Suspense>
    );
  };

  const currentSequence = getCurrentSequence();

  // 앵커 아이템 생성 (데스크탑용)
  const anchorItems = loadedItems.map((item) => ({
    key: item.key,
    href: `#content-${item.key}`,
    title: item.title,
  }));

  if (loadedItems.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 200 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // 모바일 레이아웃
  if (isMobile) {
    return (
      <div ref={containerRef}>
        <Flex vertical gap={16} style={{ width: '100%' }}>
          {loadedItems.map((item, index) => (
            <div
              key={item.key}
              data-content-key={item.key}
              id={`content-${item.key}`}
              style={{ width: '100%' }}
            >
              {renderContent(item)}

              {/* 다음 콘텐츠 안내 */}
              {index < loadedItems.length - 1 && (
                <Card
                  size="small"
                  style={{
                    marginTop: 16,
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                    textAlign: 'center',
                  }}
                >
                  <Text type="secondary">
                    <DownOutlined style={{ marginRight: 8 }} />
                    스크롤하여 다음 주제 보기: {loadedItems[index + 1].title}
                  </Text>
                </Card>
              )}

              {index < loadedItems.length - 1 && (
                <Divider style={{ margin: '24px 0' }} />
              )}
            </div>
          ))}

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <Flex justify="center" style={{ padding: 24 }}>
              <Spin />
              <Text type="secondary" style={{ marginLeft: 12 }}>다음 콘텐츠 로딩 중...</Text>
            </Flex>
          )}

          {/* 마지막 콘텐츠 안내 */}
          {!isLoading && loadedItems.length === currentSequence.length && (
            <Card
              size="small"
              style={{
                marginTop: 8,
                background: '#f0f5ff',
                textAlign: 'center',
              }}
            >
              <Text type="secondary">
                {location.pathname.includes('/property') ? '재산세' : '취득세'} 기본정보의 모든 콘텐츠를 확인했습니다.
              </Text>
            </Card>
          )}
        </Flex>
      </div>
    );
  }

  // 데스크탑 레이아웃
  return (
    <div ref={containerRef}>
      <Row gutter={24}>
        {/* 사이드 네비게이션 */}
        <Col md={6} lg={5} xl={4}>
          <Anchor
            offsetTop={100}
            items={anchorItems}
            style={{ position: 'sticky', top: 100 }}
          />
        </Col>

        {/* 메인 콘텐츠 */}
        <Col md={18} lg={19} xl={20}>
          <Flex vertical gap={32} style={{ width: '100%' }}>
            {loadedItems.map((item, index) => (
              <div
                key={item.key}
                data-content-key={item.key}
                id={`content-${item.key}`}
                style={{ width: '100%' }}
              >
                {renderContent(item)}

                {/* 다음 콘텐츠 안내 */}
                {index < loadedItems.length - 1 && (
                  <>
                    <Card
                      size="small"
                      style={{
                        marginTop: 24,
                        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const nextElement = document.querySelector(`[data-content-key="${loadedItems[index + 1].key}"]`);
                        nextElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <Text type="secondary">
                        <DownOutlined style={{ marginRight: 8 }} />
                        스크롤하여 다음 주제 보기: {loadedItems[index + 1].title}
                      </Text>
                    </Card>
                    <Divider style={{ margin: '32px 0' }} />
                  </>
                )}
              </div>
            ))}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <Flex justify="center" style={{ padding: 32 }}>
                <Spin />
                <Text type="secondary" style={{ marginLeft: 12 }}>다음 콘텐츠 로딩 중...</Text>
              </Flex>
            )}

            {/* 마지막 콘텐츠 안내 */}
            {!isLoading && loadedItems.length === currentSequence.length && (
              <Card
                size="small"
                style={{
                  marginTop: 16,
                  background: '#f0f5ff',
                  textAlign: 'center',
                }}
              >
                <Text type="secondary">
                  {location.pathname.includes('/property') ? '재산세' : '취득세'} 기본정보의 모든 콘텐츠를 확인했습니다.
                </Text>
              </Card>
            )}
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default TaxInfoLayout;
