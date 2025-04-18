---
title: "[99클럽] 면접반 7일차"
tags:
  - 면접
image: ./assets/banner.png
date: 2025-04-17 10:17:27
series: 면접
draft: false
---

![배너 이미지](./assets/banner.png)

> 📖 질문
>
> 로그/모니터링 시스템 구축
>
> 시스템 안정성을 높이기 위해 로그 수집이나 모니터링 체계를 구축한 경험이 있다면, 사용 도구와 적용 방식, 효과를 함께 설명해 주세요.
>
> 힌트: 이 질문은 무슨 문제를 감지하고 대응하기 위해 어떤 구조를 만들었는지가 핵심입니다. 수집 → 필터링 → 시각화 → 알림까지의 흐름이 드러나면 설득력 있는 답변이 됩니다.

## 답변

회의실 예약 시스템 및 사내 백오피스 통합 인증 시스템을 개발하면서 시스템 안정성 확보를 위한 로그 수집 및 모니터링 체계를 구축했던 경험이 있습니다.

### 수집

Spring Boot Actuator를 활용하여 어플리케이션 상태, 메트릭, 헬스 체크 데이터 수집을 진행하였습니다. 또한 Logback을 통한 구조화된 JSON 형식 로깅을 구현하였습니다. 특히 회의실 예약 시스템에서는 동시성 문제과 같은 ERROR레벨과 같은 critical한 로그들을 상세히 남기도록 설계한 경험이 있습니다.

### 필터링

Logstash를 통해 로그 데이터 필터링 및 전처리를 진행하였습니다. ERROR 레벨 로그와 성능 병목 관련 로그는 우선순위를 높여서 별도 처리를 진행하였습니다. 예를 들어 동시 예약 시도, JWT 인증 실패등 주요 비즈니스 이벤트를 필터링 하였습니다.

### 시각화

Grafana로 API 응답 시간, 메모리 사용량, 동시 접속자 수등 실시간 대시보드를 구성하였습니다. 대표적으로 회의실 예약 시스템에서 동시 예약 시도 패턴을 시각화하여 비관적 락 적용 이후 모니터링을 통하여 이상유무를 확인하였습니다.

### 알림

Microsoft Teams 웹 훅 연동으로 주요 에러 및 시스템 부하 발생 시 즉시 알림이 오도록 설계하였습니다.

이렇게 로그/모니터링 시스템을 구축을 하면서 안정성이 향상되었고 응답시간이 느린 병목 지점을 확인하여 개선할 수 있는 계기도 만들게 되었습니다.