---
title: "[99클럽] 면접반 10일차"
tags:
  - 면접
image: ./assets/banner.png
date: 2025-04-22 09:40:27
series: 면접
draft: false
---

![배너 이미지](./assets/banner.png)

> 📖 질문
>
> 실시간 데이터 스트리밍
>
> 실시간 데이터 스트리밍 환경에서 지연(latency) 문제를 해결하거나, 처리 안정성을 높이기 위해 어떤 설계를 했는지 설명해 주세요.
>
> 힌트: Kafka, Redis Streams, SSE 등 실시간 처리 기술을 어떤 기준으로 선택했는지와, 지연 최소화를 위해 어떤 구조로 설계했는지를 중심으로 답변하시면 좋습니다.

## 답변

안녕하세요, 실시간 데이터 스트리밍 환경에서의 지연 문제 해결과 처리 안정성에 관한 질문에 답변드리겠습니다. 저는 사내 회의실 예약 시스템 개발 경험을 중심으로 답변드리겠습니다.

회의실 예약 시스템에서는 여러 사용자가 동시에 예약을 시도할 수 있는 환경이었기 때문에 실시간성과 데이터 정합성이 매우 중요했습니다. 이를 위해 다음과 같은 설계 방식과 기술을 적용했습니다.

### SSE

저는 SSE 방식을 선택했습니다. 선택한 기준은 다음과 같습니다.

- 단방향 통신의 적합성: 회의실 예약 시스템은 서버에서 클라이언트로의 단방향 데이터 전송이 주요 요구사항이였습니다. SSE는 이러한 단방향 통신에 최적화되어 있어서 선택하게 되었습니다.
- 낮은 오버헤드: WebSocket과 비교했을 때 SSE는 HTTP 프로토콜을 기반으로 하기 때문에 기존 인프라와 호환성이 높고 추가 설정이나 오버헤드가 적었습니다.
- HTTP 기반 간결함: 프로젝트 규모와 요구사항을 고려했을 때 Kafka나 Redis Streams 같은 복잡한 메시징 시스템보다 Spring의 기본 기능으로 구현 가능한 SSE가 더 효율적이라고 판단했습니다.

### 지연 최소화를 위한 구조 설계

- 비관적 락 적용
  - 동시에 여러 사용자가 같은 시간대의 회의실을 예약하려는 경우 발생하는 충돌 문제를 방지하기 위해 비관적 락을 적용하였습니다.
  - 사용자가 예약 과정을 시작할 때 해당 시간대에 락을 걸어 다른 사용자의 접근을 일시적으로 제한함으로써 데이터 일관성을 유지했습니다.
- 쿼리 최적화
  - 예약 조회 쿼리의 성능을 30% 개선하여 사용자가 실시간으로 예약 가능한 회의실을 확인하는 과정에서의 지연을 최소화했습니다.
  - 특히 자주 조회되는 데이터에 대해서는 인덱스를 적절히 설계하여 조회 속도를 개선했습니다.
- 이메일 알림 비동기 처리
  - 예약 확정 시 발송되는 인증 메일의 처리 시간을 4.x초에서 4.xms로 대폭 개선했습니다.
  - 이메일 발송 로직을 별도의 비동기 스레드로 분리하여 메인 예약 프로세스의 지연을 방지했습니다.
- SSE 연결 관리 최적화
  - SSE 연결을 효율적으로 관리하기 위해 클라이언트 연결 풀을 구현했습니다.
  - 유휴 상태의 연결을 주기적으로 정리하고, 필요 시 자동 재연결되는 메커니즘을 구현하여 안정성을 높였습니다.
  - 데이터 갱신 이벤트가 발생했을 때만 메시지를 전송하도록 설계하여 불필요한 네트워크 트래픽을 줄였습니다.

### 처리 안정성 개선 방안

- 철저한 테스트 커버리지
  - 단위 테스트와 통합 테스트를 작성하여 테스트 커버리지 100%를 달성했습니다.
  - 특히 동시성 이슈와 관련된 시나리오를 중점적으로 테스트하여 시스템 안정성을 확보했습니다.
- 예외처리 강화
  - SSE 연결 중단, 네트워크 지연 등 다양한 예외 상황에 대한 처리 로직을 구현했습니다.
  - 클라이언트 측에서는 연결 오류 시 지수 백오프(exponential backoff) 방식으로 재시도하도록 설계했습니다.
- 모니터링 시스템 구축
  - 실시간 연결 상태, 메시지 전송 지연 시간 등을 모니터링할 수 있는 시스템을 구축했습니다.
  - 지연이 임계값을 초과할 경우 알림을 보내는 기능을 추가하여 신속하게 대응할 수 있도록 했습니다.