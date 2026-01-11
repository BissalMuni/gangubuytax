/**
 * 메뉴 설정 파일
 * 헤더와 사이드바 메뉴를 중앙에서 관리
 */
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  BankOutlined,
  KeyOutlined,
  TeamOutlined,
  GiftOutlined,
  BuildOutlined,
  AuditOutlined,
  PercentageOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BulbOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ROUTES, MENU_KEYS } from '@/constants/routes';

type MenuItem = Required<MenuProps>['items'][number];

/**
 * 헤더 메뉴 아이템
 */
export const headerMenuItems: MenuProps['items'] = [
  {
    key: MENU_KEYS.HOME,
    icon: <HomeOutlined />,
    label: <Link to={ROUTES.HOME}>홈</Link>,
  },
  {
    key: MENU_KEYS.LOCAL_TAX,
    icon: <BankOutlined />,
    label: <Link to={ROUTES.LOCAL_TAX.ACQUISITION.RATES}>지방세 기본정보</Link>,
  },
  {
    key: MENU_KEYS.LOCAL_TAX_THEME,
    icon: <BulbOutlined />,
    label: <Link to={ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE}>테마별 지방세</Link>,
  },
];

/**
 * 사이드바 메뉴 아이템 - 지방세정보 (기존)
 */
export const sidebarMenuItems: MenuItem[] = [
  {
    key: MENU_KEYS.ACQUISITION,
    icon: <KeyOutlined />,
    label: '취득세',
    children: [
      {
        key: ROUTES.LOCAL_TAX.ACQUISITION.RATES,
        icon: <PercentageOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.ACQUISITION.RATES}>세율</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX.ACQUISITION.STANDARD,
        icon: <AppstoreOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.ACQUISITION.STANDARD}>과세표준</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX.ACQUISITION.REQUIREMENTS,
        icon: <BookOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.ACQUISITION.REQUIREMENTS}>과세요건</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX.ACQUISITION.SPECIAL,
        icon: <FileTextOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.ACQUISITION.SPECIAL}>특례</Link>,
      },
    ],
  },
  {
    key: MENU_KEYS.PROPERTY,
    icon: <HomeOutlined />,
    label: '재산세',
    children: [
      {
        key: ROUTES.LOCAL_TAX.PROPERTY.RATES,
        icon: <PercentageOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.PROPERTY.RATES}>세율</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX.PROPERTY.STANDARD,
        icon: <AppstoreOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.PROPERTY.STANDARD}>과세표준</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX.PROPERTY.SPECIAL,
        icon: <FileTextOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX.PROPERTY.SPECIAL}>특례</Link>,
      },
    ],
  },
];

/**
 * 사이드바 메뉴 아이템 - 테마별 지방세 (신규)
 */
export const sidebarThemeMenuItems: MenuItem[] = [
  {
    key: MENU_KEYS.THEME_ACQUISITION,
    icon: <KeyOutlined />,
    label: '취득세',
    children: [
      {
        key: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE,
        icon: <TeamOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_TRADE}>가족간 유상거래</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_GIFT,
        icon: <GiftOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX_THEME.ACQUISITION.FAMILY_GIFT}>가족간 무상거래</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX_THEME.ACQUISITION.RECONSTRUCTION,
        icon: <BuildOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX_THEME.ACQUISITION.RECONSTRUCTION}>재건축 취득세</Link>,
      },
      {
        key: ROUTES.LOCAL_TAX_THEME.ACQUISITION.TAX_STANDARD,
        icon: <AuditOutlined />,
        label: <Link to={ROUTES.LOCAL_TAX_THEME.ACQUISITION.TAX_STANDARD}>신축시 과세표준</Link>,
      },
    ],
  },
  {
    key: MENU_KEYS.THEME_PROPERTY,
    icon: <HomeOutlined />,
    label: '재산세',
    children: [],
  },
];

/**
 * 헤더 메뉴 선택 키 결정
 */
export const getHeaderSelectedKey = (pathname: string): string[] => {
  if (pathname === ROUTES.HOME) return [MENU_KEYS.HOME];
  if (pathname.startsWith('/local-tax-theme')) {
    return [MENU_KEYS.LOCAL_TAX_THEME];
  }
  if (pathname.startsWith('/local-tax') || pathname.startsWith('/tax-info')) {
    return [MENU_KEYS.LOCAL_TAX];
  }
  return [pathname];
};

/**
 * 사이드바 메뉴 선택 키 결정
 */
export const getSidebarSelectedKeys = (pathname: string): string[] => {
  const normalizedPath = pathname.replace('/tax-info/', '/local-tax/');
  return [normalizedPath];
};

/**
 * 사이드바 메뉴 열림 키 결정
 */
export const getSidebarOpenKeys = (pathname: string): string[] => {
  // 테마별 지방세
  if (pathname.startsWith('/local-tax-theme')) {
    if (pathname.includes('/acquisition')) return [MENU_KEYS.THEME_ACQUISITION];
    if (pathname.includes('/property')) return [MENU_KEYS.THEME_PROPERTY];
    return [MENU_KEYS.THEME_ACQUISITION, MENU_KEYS.THEME_PROPERTY];
  }
  // 지방세정보
  if (pathname.includes('/acquisition')) return [MENU_KEYS.ACQUISITION];
  if (pathname.includes('/property')) return [MENU_KEYS.PROPERTY];
  return [MENU_KEYS.ACQUISITION, MENU_KEYS.PROPERTY];
};

/**
 * 현재 경로에 맞는 사이드바 메뉴 반환
 */
export const getSidebarMenuItems = (pathname: string): MenuItem[] => {
  if (pathname.startsWith('/local-tax-theme')) {
    return sidebarThemeMenuItems;
  }
  return sidebarMenuItems;
};
