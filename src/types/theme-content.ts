/**
 * 테마별 지방세 콘텐츠 블록 타입 정의
 * 블록 기반 JSON 구조를 위한 TypeScript 타입
 */

// ============================================
// 메타데이터
// ============================================
export interface ThemeMeta {
  id: string;
  title: string;
  description: string;
  category: 'acquisition' | 'property';
  lastUpdated: string;
  version: string;
}

// ============================================
// 블록 타입 정의
// ============================================
export type BlockType =
  | 'info'
  | 'alert'
  | 'table'
  | 'list'
  | 'criteria'
  | 'comparison'
  | 'cases'
  | 'steps'
  | 'references';

// 기본 블록 인터페이스
interface BaseBlock {
  id: string;
  type: BlockType;
  title: string;
  icon?: string;
}

// ============================================
// Info 블록 - 정보 표시
// ============================================
export interface InfoBlock extends BaseBlock {
  type: 'info';
  content: {
    items: Array<{
      label: string;
      value: string;
    }>;
  };
}

// ============================================
// Alert 블록 - 강조/경고
// ============================================
export interface AlertBlock extends BaseBlock {
  type: 'alert';
  variant: 'info' | 'warning' | 'success' | 'error';
  content: {
    text: string;
    emphasis?: string;
  };
}

// ============================================
// Table 블록 - 테이블
// ============================================
export interface TableColumn {
  key: string;
  title: string;
  width?: string;
}

export interface TableRow {
  [key: string]: string | boolean | number | undefined;
  highlight?: boolean;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  content: {
    columns: TableColumn[];
    rows: TableRow[];
  };
}

// ============================================
// List 블록 - 목록
// ============================================
export interface ListItem {
  id: string;
  text?: string;
  title?: string;
  description?: string;
  legalBasis?: string;
  subItems?: Array<{
    id: string;
    text: string;
  }>;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  content: {
    variant: 'bullet' | 'numbered';
    items: ListItem[];
  };
}

// ============================================
// Criteria 블록 - 기준/조건
// ============================================
export interface CriteriaCondition {
  id: string;
  condition: string;
  result: string;
  resultType: 'positive' | 'negative';
}

export interface CriteriaBlock extends BaseBlock {
  type: 'criteria';
  content: {
    description: string;
    legalBasis?: string;
    conditions: CriteriaCondition[];
    note?: string;
  };
}

// ============================================
// Comparison 블록 - 비교
// ============================================
export interface ComparisonItem {
  id: string;
  title: string;
  value: string;
  description: string;
  legalBasis?: string;
  variant: 'primary' | 'secondary';
}

export interface ComparisonBlock extends BaseBlock {
  type: 'comparison';
  content: {
    items: ComparisonItem[];
  };
}

// ============================================
// Cases 블록 - 사례
// ============================================
export interface CaseAnalysis {
  label: string;
  value: string;
}

export interface CaseItem {
  id: string;
  title: string;
  scenario: string;
  analysis: CaseAnalysis[];
  result: string;
  resultType: 'success' | 'error' | 'warning';
  note?: string;
}

export interface CasesBlock extends BaseBlock {
  type: 'cases';
  content: {
    items: CaseItem[];
  };
}

// ============================================
// Steps 블록 - 단계별 가이드
// ============================================
export interface StepItem {
  step: number;
  title: string;
  description: string;
}

export interface StepsBlock extends BaseBlock {
  type: 'steps';
  content: {
    items: StepItem[];
  };
}

// ============================================
// References 블록 - 관련 법조문
// ============================================
export interface ReferenceItem {
  law: string;
  article: string;
  title: string;
}

export interface ReferencesBlock extends BaseBlock {
  type: 'references';
  content: {
    items: ReferenceItem[];
  };
}

// ============================================
// 블록 유니온 타입
// ============================================
export type ContentBlock =
  | InfoBlock
  | AlertBlock
  | TableBlock
  | ListBlock
  | CriteriaBlock
  | ComparisonBlock
  | CasesBlock
  | StepsBlock
  | ReferencesBlock;

// ============================================
// 테마 콘텐츠 전체 구조
// ============================================
export interface ThemeContent {
  meta: ThemeMeta;
  sections: ContentBlock[];
}

// ============================================
// 블록 타입 가드 함수
// ============================================
export function isInfoBlock(block: ContentBlock): block is InfoBlock {
  return block.type === 'info';
}

export function isAlertBlock(block: ContentBlock): block is AlertBlock {
  return block.type === 'alert';
}

export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === 'table';
}

export function isListBlock(block: ContentBlock): block is ListBlock {
  return block.type === 'list';
}

export function isCriteriaBlock(block: ContentBlock): block is CriteriaBlock {
  return block.type === 'criteria';
}

export function isComparisonBlock(block: ContentBlock): block is ComparisonBlock {
  return block.type === 'comparison';
}

export function isCasesBlock(block: ContentBlock): block is CasesBlock {
  return block.type === 'cases';
}

export function isStepsBlock(block: ContentBlock): block is StepsBlock {
  return block.type === 'steps';
}

export function isReferencesBlock(block: ContentBlock): block is ReferencesBlock {
  return block.type === 'references';
}
