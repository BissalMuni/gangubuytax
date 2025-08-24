// 세금 관련 타입 정의

export interface TaxRate {
  acquisitionTax: string;
  localEducationTax: string;
  agriculturalTax: string;
}

// 새로운 JSON 구조를 위한 타입 정의
export interface TaxDetail {
  id: number;
  title: string;
  content: string;
  legal_basis: string | string[];
  details: string | TaxDetail[];
}

export interface TaxSection {
  id: number;
  title: string;
  content?: string;
  legal_basis?: string | string[];
  subsections?: TaxSubsection[];
  details?: TaxDetail[];
  items?: string[];
}

export interface TaxSubsection {
  id: number;
  title: string;
  content: string;
  legal_basis: string | string[];
  details?: TaxDetail[];
  items?: string[];
}

export interface TaxData {
  topic: string;
  topic_code: string;
  sections: TaxSection[];
  legal_references: string[];
  유상취득?: PaidAcquisition;
  무상취득?: FreeAcquisition;
  원시취득?: OriginalAcquisition;
  [key: string]: any; // 인덱스 시그니처 추가
}

export interface PaidAcquisition {
  주택?: HousingTax;
  건물?: BuildingTax;
  농지?: FarmlandTax;
  토지?: LandTax;
  특수_유상취득?: SpecialPaidAcquisition;
}

export interface FreeAcquisition {
  상속?: InheritanceTax;
  증여?: GiftTax;
}

export interface OriginalAcquisition {
  신축?: ConstructionTax;
  공유수면_매립?: LandReclamationTax;
  간척?: ReclamationTax;
}

export interface HousingTax {
  '1주택'?: HousingCategory;
  '2주택'?: MultiHousingCategory;
  '3주택'?: MultiHousingCategory;
  '4주택_이상'?: TaxRateInfo;
}

export interface HousingCategory {
  '6억원_이하'?: TaxRateInfo;
  '6억원_초과_9억원_이하'?: TaxRateInfo;
  '9억원_초과'?: TaxRateInfo;
}

export interface MultiHousingCategory {
  조정대상지역?: TaxRateInfo;
  비조정대상지역?: HousingCategory | TaxRateInfo;
}

export interface BuildingTax {
  일반_건물?: TaxRateInfo;
  사치성_재산?: LuxuryProperty;
}

export interface LuxuryProperty {
  고급주택?: TaxRateInfo;
  골프장?: TaxRateInfo;
  고급오락장?: TaxRateInfo;
}

export interface SpecialPaidAcquisition {
  공유물_분할?: TaxRateInfo;
  합유물_분할?: TaxRateInfo;
  총유물_분할?: TaxRateInfo;
  협의이혼_재산분할?: TaxRateInfo;
  지목변경?: TaxRateInfo;
  용도변경?: TaxRateInfo;
  개수?: RenovationTax;
  과점주주취득?: TaxRateInfo;
  건축물이전?: BuildingTransferTax;
}

export interface RenovationTax {
  면적증가?: TaxRateInfo;
  면적증가없음?: TaxRateInfo;
}

export interface BuildingTransferTax {
  가액증가분?: TaxRateInfo;
  가액증가없음?: TaxRateInfo;
}

export interface TaxRateInfo {
  취득세: string;
  지방교육세: string;
  농특세: string;
}

export interface InheritanceTax {
  농지?: TaxRateInfo;
  농지외?: TaxRateInfo;
  '1가구1주택'?: TaxRateInfo;
  지특법상_취득세_감면대상_농지?: TaxRateInfo;
}

export interface GiftTax {
  일반?: TaxRateInfo;
  조정대상지역_3억원_이상_주택?: AdjustedAreaHousing;
  비영리사업자?: TaxRateInfo;
}

export interface AdjustedAreaHousing {
  원칙?: TaxRateInfo;
  예외_1세대1주택_배우자_직계존비속?: TaxRateInfo;
}

export interface ConstructionTax extends TaxRateInfo {}
export interface LandReclamationTax extends TaxRateInfo {}
export interface ReclamationTax extends TaxRateInfo {}
export interface FarmlandTax extends TaxRateInfo {}
export interface LandTax extends TaxRateInfo {}

// UI 관련 타입
export type TaxCategory = 'acquisition' | 'rate' | 'standard' | 'taxpayer';
export type TaxType = 'all' | '유상취득' | '무상취득' | '원시취득' | '취득세' | '지방교육세' | '농특세' | '주택' | '건물' | '토지' | '농지' | '시가인정액';
export type ViewMode = 'list' | 'card' | 'table';

export interface TaxItem {
  id: string;
  path: string[];
  name: string;
  data: TaxRateInfo;
  category: string;
  subcategory?: string;
}

export interface FilterOptions {
  category: TaxCategory;
  type: TaxType;
  searchTerm?: string;
}