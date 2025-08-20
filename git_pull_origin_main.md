# GitHub 협업 가이드: 두 컴퓨터에서 작업하기

## 📋 목차
- [초기 설정](#초기-설정)
- [일상 작업 플로우](#일상-작업-플로우)
- [충돌 해결](#충돌-해결)
- [베스트 프랙티스](#베스트-프랙티스)
- [유용한 Git 명령어](#유용한-git-명령어)

## 🚀 초기 설정

### 1. 저장소 클론 (각 컴퓨터에서 한 번만)

```bash
# 저장소 복제
git clone https://github.com/BissalMuni/gangubuytax.git
cd gangubuytax

# 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 2. 원격 저장소 확인

```bash
# 원격 저장소 URL 확인
git remote -v
```

## 💼 일상 작업 플로우

### 작업 시작 전 (필수!)

```bash
# 최신 변경사항 받기
git pull origin main

# 또는 더 안전하게
git fetch origin
git merge origin/main
```

### 작업 중

```bash
# 현재 상태 확인
git status

# 변경사항 확인
git diff
```

### 작업 완료 후

```bash
# 1. 변경사항 스테이징
git add .
# 또는 특정 파일만
git add src/App.tsx

# 2. 커밋
git commit -m "feat: 새로운 기능 추가"

# 3. GitHub에 푸시
git push origin main
```

## 🔄 실제 시나리오

### 시나리오 1: 컴퓨터 A → 컴퓨터 B

**컴퓨터 A에서:**
```bash
git pull origin main
# 코드 수정...
git add .
git commit -m "feat: 로그인 기능 구현"
git push origin main
```

**컴퓨터 B에서:**
```bash
git pull origin main  # A의 변경사항 받기
# 이제 A에서 작업한 내용이 B에도 반영됨
# 코드 수정...
git add .
git commit -m "fix: 로그인 버그 수정"
git push origin main
```

### 시나리오 2: 동시 작업 (브랜치 활용)

**컴퓨터 A에서:**
```bash
git checkout -b feature/payment
# 결제 기능 작업...
git add .
git commit -m "feat: 결제 모듈 추가"
git push origin feature/payment
```

**컴퓨터 B에서:**
```bash
git checkout -b feature/ui-update
# UI 개선 작업...
git add .
git commit -m "style: UI 디자인 개선"
git push origin feature/ui-update
```

## ⚠️ 충돌 해결

### 충돌 발생 상황

```bash
git push origin main
# error: failed to push some refs to 'origin'
```

### 해결 방법

```bash
# 1. 원격 변경사항 가져오기
git pull origin main

# 2. 충돌 파일 확인
git status

# 3. 충돌 파일 수정
# <<<<<<< HEAD
# 내 변경사항
# =======
# 원격 변경사항
# >>>>>>> origin/main

# 4. 충돌 해결 후 커밋
git add .
git commit -m "merge: 충돌 해결"
git push origin main
```

## ✅ 베스트 프랙티스

### 1. 커밋 메시지 규칙

```bash
# 좋은 예
git commit -m "feat: 사용자 인증 기능 추가"
git commit -m "fix: 로그인 버튼 오류 수정"
git commit -m "docs: README 업데이트"
git commit -m "style: 코드 포맷팅"
git commit -m "refactor: 함수 구조 개선"

# 나쁜 예
git commit -m "수정"
git commit -m "asdf"
git commit -m "작업 완료"
```

### 2. 작업 규칙

- ✅ **항상 pull 먼저**: 작업 시작 전 `git pull`
- ✅ **자주 커밋**: 작은 단위로 자주 커밋
- ✅ **명확한 커밋 메시지**: 무엇을 왜 변경했는지 명시
- ✅ **푸시 전 테스트**: 코드가 정상 작동하는지 확인
- ❌ **직접 main에 푸시 금지**: 중요한 프로젝트는 브랜치 사용

### 3. 브랜치 전략

```bash
# 기능 개발
git checkout -b feature/기능명

# 버그 수정
git checkout -b fix/버그명

# 긴급 수정
git checkout -b hotfix/이슈명
```

## 🛠 유용한 Git 명령어

### 상태 확인

```bash
# 변경사항 확인
git status

# 커밋 히스토리
git log --oneline --graph

# 최근 5개 커밋
git log -5

# 변경 내용 상세 확인
git diff
```

### 되돌리기

```bash
# 스테이징 취소
git reset HEAD 파일명

# 마지막 커밋 수정
git commit --amend

# 변경사항 임시 저장
git stash
git stash pop
```

### 브랜치 관리

```bash
# 브랜치 목록
git branch -a

# 브랜치 전환
git checkout 브랜치명

# 브랜치 병합
git merge 브랜치명

# 브랜치 삭제
git branch -d 브랜치명
```

## 🔍 문제 해결

### 1. push 거부될 때

```bash
git pull --rebase origin main
git push origin main
```

### 2. 실수로 커밋했을 때

```bash
# 마지막 커밋 취소 (파일은 유지)
git reset --soft HEAD~1

# 마지막 커밋 완전 취소
git reset --hard HEAD~1
```

### 3. 잘못된 브랜치에서 작업했을 때

```bash
git stash
git checkout 올바른브랜치
git stash pop
```

## 📌 체크리스트

작업 전:
- [ ] `git pull origin main` 실행
- [ ] 현재 브랜치 확인 (`git branch`)

작업 후:
- [ ] 코드 테스트 완료
- [ ] `git add .` 실행
- [ ] 명확한 커밋 메시지 작성
- [ ] `git push origin 브랜치명` 실행

## 🔗 추가 자료

- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)