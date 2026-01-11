/**
 * 콘텐츠 순서 정의
 * 스크롤 시 자동으로 다음/이전 콘텐츠로 이동할 때 사용
 */

import { ROUTES } from '@/constants/routes';

export interface ContentItem {
  key: string;
  path: string;
  title: string;
  category: 'local-tax' | 'local-tax-theme';
  subCategory: 'acquisition' | 'property';
  dataPath?: string; // JSON 데이터 경로 (테마별 지방세용)
}

// 지방세 기본정보 - 취득세
export const LOCAL_TAX_ACQUISITION_SEQUENCE: ContentItem[] = [
  {
    key: 'acquisition-rates',
    path: ROUTES.LOCAL_TAX.ACQUISITION.RATES,
    title: '취득세 세율',
    category: 'local-tax',
    subCategory: 'acquisition',
  },
  {
    key: 'acquisition-standard',
    path: ROUTES.LOCAL_TAX.ACQUISITION.STANDARD,
    title: '취득세 과세표준',
    category: 'local-tax',
    subCategory: 'acquisition',
  },
  {
    key: 'acquisition-requirements',
    path: ROUTES.LOCAL_TAX.ACQUISITION.REQUIREMENTS,
    title: '취득세 과세요건',
    category: 'local-tax',
    subCategory: 'acquisition',
  },
  {
    key: 'acquisition-special',
    path: ROUTES.LOCAL_TAX.ACQUISITION.SPECIAL,
    title: '취득세 특례',
    category: 'local-tax',
    subCategory: 'acquisition',
  },
];

// 지방세 기본정보 - 재산세
export const LOCAL_TAX_PROPERTY_SEQUENCE: ContentItem[] = [
  {
    key: 'property-rates',
    path: ROUTES.LOCAL_TAX.PROPERTY.RATES,
    title: '재산세 세율',
    category: 'local-tax',
    subCategory: 'property',
  },
  {
    key: 'property-standard',
    path: ROUTES.LOCAL_TAX.PROPERTY.STANDARD,
    title: '재산세 과세표준',
    category: 'local-tax',
    subCategory: 'property',
  },
  {
    key: 'property-special',
    path: ROUTES.LOCAL_TAX.PROPERTY.SPECIAL,
    title: '재산세 특례',
    category: 'local-tax',
    subCategory: 'property',
  },
];

// 테마별 지방세 - 취득세
export const LOCAL_TAX_THEME_ACQUISITION_SEQUENCE: ContentItem[] = [
  {
    key: 'family-trade',
    path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE,
    title: '가족간 유상거래',
    category: 'local-tax-theme',
    subCategory: 'acquisition',
    dataPath: '/data/tax_theme/family-trade.json',
  },
  {
    key: 'family-gift',
    path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_GIFT,
    title: '가족간 무상거래',
    category: 'local-tax-theme',
    subCategory: 'acquisition',
    dataPath: '/data/tax_theme/family-gift.json',
  },
  {
    key: 'reconstruction',
    path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.RECONSTRUCTION,
    title: '재건축 취득세',
    category: 'local-tax-theme',
    subCategory: 'acquisition',
    dataPath: '/data/tax_theme/reconstruction.json',
  },
  {
    key: 'tax-standard',
    path: ROUTES.LOCAL_TAX_THEME.ACQUISITION.TAX_STANDARD,
    title: '신축시 과세표준',
    category: 'local-tax-theme',
    subCategory: 'acquisition',
    dataPath: '/data/tax_theme/tax-standard.json',
  },
];

// 전체 시퀀스 (카테고리별)
export const CONTENT_SEQUENCES = {
  'local-tax': {
    acquisition: LOCAL_TAX_ACQUISITION_SEQUENCE,
    property: LOCAL_TAX_PROPERTY_SEQUENCE,
  },
  'local-tax-theme': {
    acquisition: LOCAL_TAX_THEME_ACQUISITION_SEQUENCE,
    property: [] as ContentItem[],
  },
};

// 현재 경로에서 콘텐츠 시퀀스 찾기
export function getContentSequence(path: string): {
  sequence: ContentItem[];
  currentIndex: number;
  current: ContentItem | null;
  next: ContentItem | null;
  prev: ContentItem | null;
} {
  // 모든 시퀀스 검색
  const allSequences = [
    LOCAL_TAX_ACQUISITION_SEQUENCE,
    LOCAL_TAX_PROPERTY_SEQUENCE,
    LOCAL_TAX_THEME_ACQUISITION_SEQUENCE,
  ];

  for (const sequence of allSequences) {
    const currentIndex = sequence.findIndex(item => item.path === path);
    if (currentIndex !== -1) {
      return {
        sequence,
        currentIndex,
        current: sequence[currentIndex],
        next: currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : null,
        prev: currentIndex > 0 ? sequence[currentIndex - 1] : null,
      };
    }
  }

  return {
    sequence: [],
    currentIndex: -1,
    current: null,
    next: null,
    prev: null,
  };
}

// 경로로 콘텐츠 아이템 찾기
export function findContentItem(path: string): ContentItem | null {
  const { current } = getContentSequence(path);
  return current;
}
