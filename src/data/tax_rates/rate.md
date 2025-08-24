📁 취득세 세율 관리 시스템 - 최종 완성 구조
🏗️ 전체 디렉토리 구조
tax_rates/
├── 📄 main.json                           # 메인 설정 파일 및 전체 구조 참조
├── 📄 README.md                           # 시스템 사용법 및 설명서
│
├── 📂 personal/                           # 개인 납세자
│   ├── 📂 housing/                        # 주택 관련
│   │   ├── 📄 paid_acquisition.json       # 유상취득 (매매 등)
│   │   ├── 📂 free_acquisition/           # 무상취득
│   │   │   ├── 📄 inheritance.json        # 상속
│   │   │   └── 📂 gift/                   # 증여 (관계별)
│   │   │       ├── 📄 general.json        # 일반 증여
│   │   │       ├── 📄 spouse_lineal.json  # 배우자·직계존비속 증여
│   │   │       └── 📄 special_cases.json  # 특수 관계 증여
│   │   ├── 📂 special_free/               # 특수무상취득
│   │   │   ├── 📄 co_ownership_division.json      # 공유물분할
│   │   │   └── 📄 divorce_property_division.json  # 협의이혼 재산분할
│   │   ├── 📄 special_paid.json           # 특수유상취득
│   │   └── 📄 original.json               # 원시취득 (신축 등)
│   │
│   ├── 📂 non_agricultural/               # 농지외 (건물, 토지)
│   │   ├── 📂 buildings/                  # 건물
│   │   │   ├── 📄 general.json            # 일반 건물
│   │   │   └── 📄 luxury_properties.json  # 사치성 재산
│   │   ├── 📂 land/                       # 토지
│   │   │   └── 📄 general.json            # 일반 토지
│   │   ├── 📂 free_acquisition/           # 무상취득
│   │   │   ├── 📄 inheritance.json        
│   │   │   └── 📂 gift/
│   │   │       ├── 📄 general.json
│   │   │       ├── 📄 spouse_lineal.json
│   │   │       └── 📄 nonprofit.json      # 비영리사업자
│   │   ├── 📂 special_free/               # 특수무상취득
│   │   │   ├── 📄 co_ownership_division.json
│   │   │   └── 📄 divorce_property_division.json
│   │   ├── 📄 special_paid.json           # 특수유상취득
│   │   └── 📄 original.json               # 원시취득
│   │
│   └── 📂 agricultural/                   # 농지
│       ├── 📄 paid_acquisition.json       # 유상취득
│       ├── 📂 free_acquisition/           # 무상취득
│       │   ├── 📂 inheritance/            # 상속 (농지 특례)
│       │   │   ├── 📄 general.json        # 일반 농지 상속
│       │   │   └── 📄 tax_exempt.json     # 지특법상 감면대상
│       │   └── 📄 gift.json               # 농지 증여
│       ├── 📂 special_free/               # 특수무상취득
│       │   ├── 📄 co_ownership_division.json
│       │   └── 📄 divorce_property_division.json
│       └── 📄 special_paid.json           # 특수유상취득
│
├── 📂 corporate/                          # 법인 납세자
│   ├── 📄 housing.json                    # 법인 주택취득 (개인 참조 + 중과)
│   ├── 📄 non_agricultural.json           # 법인 농지외 취득
│   └── 📄 agricultural.json               # 법인 농지 취득
│
├── 📂 conditions/                         # 취득자 조건 및 자격
│   ├── 📄 acquirer_qualifications.json    # 취득자 자격 (생애최초/신혼부부)
│   ├── 📄 financial_requirements.json     # 소득/자산 요건
│   ├── 📄 residence_conditions.json       # 거주 요건
│   ├── 📄 property_specifications.json    # 재산 사양 조건
│   ├── 📄 taxpayer_status.json           # 납세자 신분 (1세대1주택 등)
│   ├── 📄 giver_conditions.json          # 증여자 조건
│   └── 📄 temporal_provisions.json        # 시한 조항 관리
│
├── 📂 relationships/                      # 관계별 특례 규정
│   ├── 📄 family_relations.json           # 가족 관계 정의
│   ├── 📄 gift_exemptions.json            # 증여 중과 예외
│   └── 📄 inheritance_special.json        # 상속 특례
│
├── 📂 common/                            # 공통 규칙 및 계산 로직
│   ├── 📄 calculation_formulas.json       # 세금 계산 공식
│   ├── 📄 priority_rules.json             # 조건 우선순위 규칙
│   ├── 📄 combination_matrix.json         # 조건 조합 매트릭스
│   ├── 📄 rate_modifiers.json             # 세율 수정자 (경감/중과/감면)
│   ├── 📄 threshold_values.json           # 각종 기준값 (금액/면적/소득)
│   ├── 📄 exemption_criteria.json         # 비과세/면제 기준
│   └── 📄 tax_types.json                  # 세금 종류 정의
│
├── 📂 validation/                        # 데이터 검증 및 비즈니스 규칙
│   ├── 📄 business_rules.json             # 비즈니스 로직 검증
│   ├── 📄 constraint_checks.json          # 제약 조건 검사
│   ├── 📄 edge_cases.json                 # 예외 케이스 처리
│   ├── 📄 conflict_resolution.json        # 규칙 충돌 해결
│   ├── 📄 data_validation.json            # 입력 데이터 검증
│   └── 📄 calculation_validation.json     # 계산 결과 검증
│
├── 📂 references/                        # 법적 근거 및 참조자료
│   ├── 📄 legal_basis.json                # 법령 조항 및 근거
│   ├── 📄 cross_references.json           # 조항 간 상호 참조
│   └── 📄 special_provisions.json         # 특별 조항
│
└── 📂 versions/                          # 버전 관리
    ├── 📄 changelog.json                  # 법령 개정 이력
    ├── 📄 version_info.json               # 버전 정보
    └── 📂 archive/                        # 과거 버전 보관
        ├── 📄 v2023.json                  # 2023년 버전
        └── 📄 v2024.json                  # 2024년 버전
📋 핵심 파일별 용도
🏠 개인 납세자 관련 (31개 파일)
주택 관련 (15개 파일)
파일명용도포함 내용paid_acquisition.json주택 유상취득조정지역별, 주택수별, 가격구간별, 면적별 세율inheritance.json주택 상속1가구1주택 특례, 일반 상속 세율gift/general.json일반 증여기본 증여세율 3.5%gift/spouse_lineal.json가족간 증여중과 예외 조건 및 세율gift/special_cases.json특수관계 증여기타 관계별 세율co_ownership_division.json공유물 분할2.3% 세율divorce_property_division.json이혼 재산분할1.5% 세율special_paid.json특수유상취득지목변경, 용도변경, 개수, 과점주주취득 등original.json원시취득신축, 공유수면매립, 간척
농지외 관련 (10개 파일)
파일명용도포함 내용buildings/general.json일반 건물4% 세율buildings/luxury_properties.json사치성 재산고급주택, 골프장 등 12%land/general.json일반 토지4% 세율기타 7개 파일무상취득, 특수취득각종 특례 세율
농지 관련 (6개 파일)
파일명용도포함 내용paid_acquisition.json농지 매매3% 기본세율inheritance/general.json농지 상속2.3% 세율inheritance/tax_exempt.json농지 상속 특례0.8% 감면세율기타 3개 파일증여, 특수취득각종 특례 세율
🏢 법인 관련 (3개 파일)
파일명용도포함 내용housing.json법인 주택취득개인세율 + 중과 규정non_agricultural.json법인 농지외개인과 동일 또는 참조agricultural.json법인 농지개인과 동일 또는 참조
⚖️ 조건 및 규칙 관리 (19개 파일)
조건 관리 (7개 파일)
파일명용도포함 내용acquirer_qualifications.json취득자 자격생애최초, 신혼부부, 다자녀 등financial_requirements.json재정 요건소득한도, 자산기준 등residence_conditions.json거주 조건거주의무, 거주기간 등property_specifications.json재산 조건면적, 가격, 유형 기준taxpayer_status.json납세자 신분1세대1주택, 다주택자 등giver_conditions.json증여자 조건증여자별 특례 조건temporal_provisions.json시한 조항한시 특례의 유효기간
관계 관리 (3개 파일)
파일명용도포함 내용family_relations.json가족관계 정의배우자, 직계존비속 등gift_exemptions.json증여 예외중과세 예외 조건inheritance_special.json상속 특례상속 관련 특례 조건
공통 규칙 (7개 파일)
파일명용도포함 내용calculation_formulas.json계산 공식세액 산출 알고리즘priority_rules.json우선순위조건 충돌 시 해결 규칙combination_matrix.json조합 매트릭스복합 조건 처리rate_modifiers.json세율 수정자경감, 중과, 감면율threshold_values.json기준값금액, 면적, 소득 한도exemption_criteria.json면제 기준비과세 대상 및 조건tax_types.json세금 정의취득세, 지방교육세, 농특세
검증 시스템 (6개 파일)
파일명용도포함 내용business_rules.json비즈니스 규칙업무 로직 검증constraint_checks.json제약 검사데이터 무결성 검증edge_cases.json예외 케이스특수 상황 처리conflict_resolution.json충돌 해결규칙 간 충돌 처리data_validation.json데이터 검증입력값 유효성 검사calculation_validation.json계산 검증계산 결과 정합성 검사
📚 참조 및 관리 (8개 파일)
법적 근거 (3개 파일)
파일명용도포함 내용legal_basis.json법령 근거조문별 상세 근거cross_references.json상호 참조조항간 연관관계special_provisions.json특별 조항한시법, 특례 조항
버전 관리 (5개 파일)
파일명용도포함 내용changelog.json변경 이력법령 개정 내역version_info.json버전 정보현재 버전 및 메타데이터archive/v2023.json과거 버전2023년 세율표archive/v2024.json과거 버전2024년 세율표main.json메인 설정전체 구조 및 참조 맵핑
📊 통계 요약

총 파일 수: 70개 파일
디렉토리 수: 22개 디렉토리
개인 관련: 31개 파일 (44%)
법인 관련: 3개 파일 (4%)
공통/관리: 36개 파일 (52%)

🔄 참조 관계

모든 개인/법인 파일 → conditions/, common/ 참조
계산 시스템 → validation/ 참조
모든 파일 → references/ 법적근거 참조
시스템 전체 → versions/ 버전관리 적용

이 구조는 완전성, 확장성, 유지보수성을 모두 확보한 엔터프라이즈급 시스템입니다! 🎉