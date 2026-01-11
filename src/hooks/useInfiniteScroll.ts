import { useEffect, useRef, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ContentItem, getContentSequence } from '@/config/contentSequence';

interface UseInfiniteScrollOptions {
  threshold?: number; // 다음 콘텐츠 로드 트리거 거리 (px)
  onContentChange?: (item: ContentItem) => void;
}

interface UseInfiniteScrollReturn {
  loadedItems: ContentItem[];
  containerRef: React.RefObject<HTMLDivElement>;
  currentItem: ContentItem | null;
  isLoading: boolean;
}

export function useInfiniteScroll(
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 200, onContentChange } = options;
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedItems, setLoadedItems] = useState<ContentItem[]>([]);
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);

  // 초기 콘텐츠 로드
  useEffect(() => {
    const { current, sequence, currentIndex } = getContentSequence(location.pathname);
    if (current) {
      setCurrentItem(current);
      // 현재 아이템부터 시작
      setLoadedItems(sequence.slice(currentIndex));
    }
  }, [location.pathname]);

  // 스크롤 핸들러
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loadingRef.current) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // 하단에 도달했을 때 다음 콘텐츠 로드
    if (scrollBottom < threshold) {
      const { next } = getContentSequence(loadedItems[loadedItems.length - 1]?.path || '');
      if (next && !loadedItems.find(item => item.key === next.key)) {
        loadingRef.current = true;
        setIsLoading(true);

        // 다음 콘텐츠 추가
        setLoadedItems(prev => [...prev, next]);

        setTimeout(() => {
          loadingRef.current = false;
          setIsLoading(false);
        }, 100);
      }
    }

    // 현재 보이는 콘텐츠 업데이트 (URL 변경용)
    const sections = container.querySelectorAll('[data-content-key]');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 섹션이 뷰포트 상단 근처에 있으면 현재 콘텐츠로 설정
      if (rect.top <= containerRect.top + 100 && rect.bottom > containerRect.top) {
        const key = section.getAttribute('data-content-key');
        const item = loadedItems.find(i => i.key === key);
        if (item && item.key !== currentItem?.key) {
          setCurrentItem(item);
          onContentChange?.(item);
          // URL 업데이트 (히스토리에 추가하지 않음)
          window.history.replaceState(null, '', item.path);
        }
      }
    });
  }, [loadedItems, currentItem, threshold, onContentChange]);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    loadedItems,
    containerRef,
    currentItem,
    isLoading,
  };
}

export default useInfiniteScroll;
