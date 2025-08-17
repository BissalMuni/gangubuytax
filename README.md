# 📊 Tax Information System (세금 정보 시스템)

한국의 각종 세금 정보를 체계적으로 관리하고 조회할 수 있는 웹 애플리케이션입니다.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

## 🌟 주요 기능

### 📋 세금 정보 조회
- **취득세**: 유상취득, 무상취득, 원시취득
- **지방교육세**: 세율 및 과세표준
- **농어촌특별세**: 지역별 세율 정보
- **기타 세금**: 재산세, 소득세 등 (추가 예정)

### 🔍 검색 및 필터링
- 세금 종류별 필터링
- 키워드 검색
- 지역별 세율 조회

### 📱 반응형 디자인
- 데스크톱, 태블릿, 모바일 지원
- 다양한 뷰 모드 (리스트, 카드, 테이블)

### 💾 데이터 관리
- JSON 기반 데이터 저장
- 실시간 데이터 업데이트
- 데이터 내보내기 기능 (개발 중)

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 16.0 이상
- npm 또는 yarn
- 모던 웹 브라우저 (Chrome, Firefox, Safari, Edge)

### 설치 방법

1. **저장소 클론**
```bash
git clone https://github.com/your-username/tax-info-system.git
cd tax-info-system
```

2. **의존성 설치**
```bash
npm install
# 또는
yarn install
```

3. **개발 서버 실행**
```bash
npm start
# 또는
npm run dev  # Vite 사용 시
```

4. **브라우저에서 확인**
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
gangubaitax/
├── index.html          # 메인 페이지
├── styles.css          # 스타일시트
├── script.js           # JavaScript 로직
├── acq_rate2.json      # 세금 데이터
├── package.json        # 프로젝트 설정
└── README.md          # 프로젝트 문서
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **스타일링**: CSS Grid, Flexbox
- **데이터**: JSON
- **빌드 도구**: Vite (선택사항)
- **패키지 매니저**: npm/yarn

## 📖 사용 방법

### 메뉴 네비게이션
1. 왼쪽 사이드바에서 원하는 카테고리 선택
2. 세부 항목 클릭하여 정보 확인
3. 상단 검색창으로 특정 정보 검색

### 뷰 모드 변경
- 📋 리스트형: 상세 정보를 목록으로 표시
- 🎴 카드형: 카드 레이아웃으로 표시
- 📊 테이블형: 표 형식으로 데이터 비교

## 🔧 설정 및 커스터마이징

### 데이터 추가/수정
`acq_rate2.json` 파일을 편집하여 세금 정보를 추가하거나 수정할 수 있습니다.

```json
{
  "새로운_세금": {
    "항목1": {
      "취득세": "1.0%",
      "지방교육세": "0.1%"
    }
  }
}
```

### 스타일 커스터마이징
`styles.css` 파일에서 색상, 폰트, 레이아웃을 수정할 수 있습니다.

```css
:root {
  --primary-color: #03C75A;  /* 메인 색상 */
  --text-color: #333;         /* 텍스트 색상 */
}
```

## 📊 API 문서 (개발 중)

향후 REST API를 통한 데이터 접근이 가능할 예정입니다.

```javascript
// 예시
GET /api/taxes           // 모든 세금 정보
GET /api/taxes/:type     // 특정 세금 정보
POST /api/calculate      // 세금 계산
```

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# E2E 테스트 (개발 중)
npm run test:e2e
```

## 📝 개발 로드맵

- [x] 기본 UI/UX 구현
- [x] 데이터 조회 기능
- [x] 검색 및 필터링
- [ ] 세금 계산기
- [ ] PDF 리포트 생성
- [ ] 사용자 인증
- [ ] 다국어 지원
- [ ] 모바일 앱

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면:

1. 이 저장소를 Fork 하세요
2. 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 📞 문의

- 이메일: your.email@example.com
- 이슈: [GitHub Issues](https://github.com/your-username/tax-info-system/issues)

## 🙏 감사의 말

이 프로젝트는 대한민국 국세청의 공개 자료를 참고하여 제작되었습니다.

---

**⚠️ 법적 고지**: 이 시스템은 정보 제공 목적으로만 사용되며, 실제 세무 상담이나 법적 조언을 대체할 수 없습니다. 정확한 세무 정보는 전문가와 상담하시기 바랍니다.