# 도구 작업실 (hyoki-toolkit-workspace)

> **관련 저장소 구분** — 이 저장소는 **경량판**입니다: 도구 데이터를 `data/tools.json`으로 분리해 직접 추가·수정하기 쉽고, 검색·메모·칸반만 담았습니다.
> 프로젝트별 적용 매핑과 JSON 백업까지 필요하면 **정식판** [tool-catalog-workspace](https://github.com/MetaSonGi/tool-catalog-workspace)를 쓰세요.


대화에서 정리한 62개 도구를 검색하고, 내 적용 메모를 남기고, 개발 작업을 칸반 보드로 관리하는 웹 페이지예요.

## 기능

- 이름·용도 검색, 분류 필터, "적용 후보만" 보기
- 도구별 적용 메모 (브라우저에 저장)
- 작업 보드: 할 일 → 진행 중 → 검토 → 완료, 완료 조건 기록

## 실행

```bash
python -m http.server 8000
# 브라우저에서 http://localhost:8000/web/ 열기
```

`fetch`로 데이터를 읽기 때문에 파일을 더블클릭하지 말고 위처럼 로컬 서버로 열어야 해요.

## 데이터 수정

`data/tools.json`에 항목을 추가하면 돼요. 필수 필드: `name`, `category`, `use`, `license`. 선택 필드: `note`(주의 사항), `apply`(적용 아이디어).

## 테스트

```bash
python -m pytest
```

## 주의

무료·오픈소스 표기는 정리 시점 기준이에요. 실제로 쓰기 전에 각 도구의 라이선스와 요금제를 다시 확인하세요.
