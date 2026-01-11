/**
 * 애플리케이션 라우트 상수
 * 모든 경로를 중앙에서 관리하여 일관성 유지
 */

export const ROUTES = {
  // 홈
  HOME: '/',

  // 지방세정보 (기존 메뉴)
  LOCAL_TAX: {
    BASE: '/local-tax',
    // 취득세
    ACQUISITION: {
      BASE: '/local-tax/acquisition',
      RATES: '/local-tax/acquisition/rates',
      STANDARD: '/local-tax/acquisition/standard',
      REQUIREMENTS: '/local-tax/acquisition/requirements',
      SPECIAL: '/local-tax/acquisition/special',
    },
    // 재산세
    PROPERTY: {
      BASE: '/local-tax/property',
      RATES: '/local-tax/property/rates',
      STANDARD: '/local-tax/property/standard',
      SPECIAL: '/local-tax/property/special',
    },
  },

  // 테마별 지방세 (새 메뉴)
  LOCAL_TAX_THEME: {
    BASE: '/local-tax-theme',
    // 취득세
    ACQUISITION: {
      BASE: '/local-tax-theme/acquisition',
      FAMILY_TRADE: '/local-tax-theme/acquisition/family-trade',      // 가족간 유상거래
      FAMILY_GIFT: '/local-tax-theme/acquisition/family-gift',        // 가족간 무상거래
      RECONSTRUCTION: '/local-tax-theme/acquisition/reconstruction',  // 재건축 취득세
      TAX_STANDARD: '/local-tax-theme/acquisition/tax-standard',      // 신축시 과세표준
    },
    // 재산세
    PROPERTY: {
      BASE: '/local-tax-theme/property',
    },
  },

  // 기존 경로 (호환성)
  LEGACY: {
    TAX_INFO: '/tax-info',
    ACQUISITION: {
      RATES: '/tax-info/acquisition/rates',
      STANDARD: '/tax-info/acquisition/standard',
      REQUIREMENTS: '/tax-info/acquisition/requirements',
      SPECIAL: '/tax-info/acquisition/special',
    },
    PROPERTY: {
      RATES: '/tax-info/property/rates',
      STANDARD: '/tax-info/property/standard',
      SPECIAL: '/tax-info/property/special',
    },
  },

  // 404
  NOT_FOUND: '*',
} as const;

// 메뉴 키 상수
export const MENU_KEYS = {
  HOME: '/',
  LOCAL_TAX: '/local-tax',
  LOCAL_TAX_THEME: '/local-tax-theme',
  ACQUISITION: 'acquisition',
  PROPERTY: 'property',
  // 테마별 지방세 서브메뉴 키
  THEME_ACQUISITION: 'theme-acquisition',
  THEME_PROPERTY: 'theme-property',
} as const;
