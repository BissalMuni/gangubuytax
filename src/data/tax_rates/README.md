# 취득세 세율 관리 시스템

## 개요
이 시스템은 대한민국의 취득세 관련 모든 세율 정보를 체계적으로 관리하는 포괄적인 데이터 구조입니다.

## 디렉토리 구조

### 📂 personal/ - 개인 납세자
- **housing/**: 주택 관련 세율 (15개 파일)
- **non_agricultural/**: 농지외 재산 (건물, 토지) (10개 파일)
- **agricultural/**: 농지 관련 세율 (6개 파일)

### 📂 corporate/ - 법인 납세자
- **housing.json**: 법인 주택 취득
- **non_agricultural.json**: 법인 농지외 취득
- **agricultural.json**: 법인 농지 취득

### 📂 conditions/ - 조건 및 자격
- 취득자 자격, 재정 요건, 거주 조건 등

### 📂 relationships/ - 관계별 특례
- 가족 관계, 증여 예외, 상속 특례 등

### 📂 common/ - 공통 규칙
- 계산 공식, 우선순위, 세율 수정자 등

### 📂 validation/ - 검증 시스템
- 비즈니스 규칙, 데이터 검증, 충돌 해결 등

### 📂 references/ - 법적 근거
- 법령 조항, 상호 참조, 특별 조항

### 📂 versions/ - 버전 관리
- 변경 이력, 과거 버전 보관

## 파일 구조 특징

### JSON 표준 구조
```json
{
  "id": "unique_identifier",
  "title": "세율 구분명",
  "description": "상세 설명",
  "legal_basis": ["법적 근거"],
  "effective_date": "2024-01-01",
  "rates": {
    "acquisition_tax": "세율값",
    "local_education_tax": "세율값", 
    "agricultural_tax": "세율값"
  },
  "conditions": {
    // 적용 조건들
  },
  "exemptions": {
    // 면제/감면 조건들
  }
}
```

## 사용 방법

1. **기본 세율 조회**: `personal/` 또는 `corporate/` 하위 파일
2. **조건 확인**: `conditions/` 파일들
3. **계산 로직**: `common/calculation_formulas.json`
4. **법적 근거**: `references/legal_basis.json`

## 확장성

- 새로운 세율 추가 시 해당 카테고리 하위에 파일 추가
- 새로운 조건 추가 시 `conditions/` 하위에 파일 추가
- 모든 변경사항은 `versions/changelog.json`에 기록

## 데이터 무결성

- 모든 파일은 `validation/` 규칙에 의해 검증
- 법적 근거는 `references/` 파일과 연동
- 버전 관리는 `versions/` 시스템으로 관리

## 업데이트 일자
2024년 8월 24일

---
📊 **통계**
- 총 70개 파일
- 22개 디렉토리  
- 개인 관련: 31개 파일 (44%)
- 법인 관련: 3개 파일 (4%)
- 공통/관리: 36개 파일 (52%)