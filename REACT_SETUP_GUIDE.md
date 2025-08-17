# 🚀 React + TypeScript 세금 시스템 설정 가이드

## 📦 프로젝트 구조 요약

```
gangubaitax/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── common/         # 공통 컴포넌트 (Header, Sidebar, Footer)
│   │   ├── ui/             # UI 컴포넌트 (Button, Card, Table)
│   │   ├── tax/            # 세금 관련 컴포넌트
│   │   └── layout/         # 레이아웃 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── hooks/              # Custom Hooks
│   ├── services/           # API 서비스
│   ├── store/              # 상태 관리 (Zustand)
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   ├── data/               # 정적 데이터
│   └── styles/             # 스타일 파일
├── package.json            # 패키지 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── tailwind.config.js      # Tailwind CSS 설정
```

## 🛠️ 기술 스택

### Frontend Framework
- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript 5**: 타입 안정성 및 개발 생산성
- **Vite 5**: 빠른 번들러 및 개발 서버

### UI/스타일링
- **Tailwind CSS 3**: 유틸리티 기반 CSS 프레임워크
- **React Icons**: 아이콘 라이브러리
- **Framer Motion**: 애니메이션 라이브러리

### 상태 관리
- **Zustand**: 가벼운 상태 관리 라이브러리
- **React Query**: 서버 상태 관리

### 라우팅 & 폼
- **React Router 6**: 클라이언트 사이드 라우팅
- **React Hook Form**: 폼 관리

### 테스팅
- **Vitest**: 빠른 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트

## ⚡ 빠른 시작

### 1. 의존성 설치
```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install

# 또는 pnpm 사용
pnpm install
```

### 2. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

### 3. 브라우저에서 확인
```
http://localhost:3000
```

## 📝 주요 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# TypeScript 타입 체크
npm run type-check

# 테스트 실행
npm run test

# 코드 린트
npm run lint

# 코드 포맷팅
npm run format
```

## 🏗️ 주요 컴포넌트

### 1. Layout Components
- **MainLayout**: 전체 레이아웃 컴포넌트
- **Header**: 상단 네비게이션
- **Sidebar**: 사이드바 메뉴
- **Footer**: 하단 정보

### 2. Page Components
- **Home**: 메인 대시보드
- **TaxInfo**: 세금 정보 페이지
- **Calculator**: 세금 계산기
- **Guide**: 사용 가이드

### 3. Common Components
- **Button**: 버튼 컴포넌트
- **Card**: 카드 컴포넌트
- **Table**: 테이블 컴포넌트
- **Modal**: 모달 컴포넌트

## 📊 상태 관리

### Zustand Store 예시
```typescript
// src/store/useTaxStore.ts
import { create } from 'zustand';
import { TaxData, FilterOptions } from '@/types/tax.types';

interface TaxStore {
  taxData: TaxData | null;
  filters: FilterOptions;
  viewMode: 'list' | 'card' | 'table';
  setTaxData: (data: TaxData) => void;
  setFilters: (filters: FilterOptions) => void;
  setViewMode: (mode: 'list' | 'card' | 'table') => void;
}

export const useTaxStore = create<TaxStore>((set) => ({
  taxData: null,
  filters: { category: 'acquisition', type: 'all' },
  viewMode: 'list',
  setTaxData: (data) => set({ taxData: data }),
  setFilters: (filters) => set({ filters }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
```

## 🎨 스타일링 가이드

### Tailwind CSS 사용법
```tsx
// 기본 스타일링
<div className="bg-white p-6 rounded-lg shadow-sm border">
  <h2 className="text-xl font-semibold text-gray-900 mb-4">
    제목
  </h2>
  <p className="text-gray-600">
    내용
  </p>
</div>

// 반응형 디자인
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 카드들 */}
</div>

// 호버 효과
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
  버튼
</button>
```

### 커스텀 스타일 클래스
```css
/* globals.css에 정의된 유틸리티 클래스 */
.card { /* 기본 카드 스타일 */ }
.btn-primary { /* 주요 버튼 스타일 */ }
.input { /* 기본 입력 필드 스타일 */ }
.table { /* 테이블 스타일 */ }
```

## 🔧 TypeScript 타입 시스템

### 주요 타입 정의
```typescript
// src/types/tax.types.ts
export interface TaxRateInfo {
  취득세: string;
  지방교육세: string;
  농특세: string;
}

export interface TaxItem {
  id: string;
  path: string[];
  name: string;
  data: TaxRateInfo;
  category: string;
}

export type ViewMode = 'list' | 'card' | 'table';
export type TaxCategory = 'acquisition' | 'rate' | 'standard' | 'taxpayer';
```

### 컴포넌트 Props 타입
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  // 컴포넌트 구현
};
```

## 🧪 테스팅

### 컴포넌트 테스트 예시
```typescript
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📁 폴더별 설명

### `/src/components/`
- **common/**: 여러 페이지에서 재사용되는 컴포넌트
- **ui/**: 기본 UI 컴포넌트 (Button, Input, Modal 등)
- **tax/**: 세금 관련 특화 컴포넌트
- **layout/**: 페이지 레이아웃 컴포넌트

### `/src/pages/`
- 각 라우트에 대응하는 페이지 컴포넌트
- 페이지별 비즈니스 로직 포함

### `/src/hooks/`
- 재사용 가능한 커스텀 훅
- 예: `useTaxData`, `useLocalStorage`, `useDebounce`

### `/src/services/`
- API 통신 로직
- 외부 서비스와의 연동

### `/src/store/`
- Zustand를 사용한 전역 상태 관리
- 도메인별로 스토어 분리

### `/src/utils/`
- 순수 함수 유틸리티
- 포맷팅, 계산, 검증 등

## 🚀 배포

### 빌드
```bash
npm run build
```

### 배포 옵션
1. **Vercel** (추천)
2. **Netlify**
3. **GitHub Pages**
4. **AWS S3 + CloudFront**

## 🔄 마이그레이션 참고

### 기존 vanilla JS에서 React로 전환 시 주의사항
1. **상태 관리**: DOM 조작 → React state
2. **이벤트 처리**: addEventListener → React event handlers
3. **데이터 바인딩**: innerHTML → JSX
4. **스타일링**: CSS → Tailwind classes

## 📚 추가 리소스

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [Zustand 문서](https://github.com/pmndrs/zustand)
- [React Query 문서](https://tanstack.com/query/latest)

---

**다음 단계**: 필요한 페이지 컴포넌트와 기능을 점진적으로 추가하여 완성된 세금 정보 시스템을 구축하세요.