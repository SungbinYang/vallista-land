---
title: "[스프링 배치] 개요 및 소개"
tags:
  - 스프링
  - 스프링 배치
image: ./assets/banner.png
date: 2025-07-23 18:23:27
series: 스프링 배치
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [정수원님의 인프런 강의](https://inf.run/fDUHu)를 바탕으로 쓰여진 글입니다.

## 개요 및 아키텍쳐

### 스프링 배치 탄생 배경

- 자바 기반 표준 배치 기술 부재
  - 배치 처리에서 요구하는 재사용 가능한 자바 기반 배치 아키텍처 표준의 필요성이 대두
- 스프링 배치는 SpringSource(현재는 Pivotal)와 Accenture(경영 컨설팅 기업)의 합작품
- Accenture는 이전에 소유했던 배치 처리 아키텍처 프레임워크를 Spring Batch 프로젝트에 기증함

### 배치 핵심 패턴

- Read: 데이터베이스, 파일, 큐에서 다량의 데이터 조회한다.
- Process: 특정 방법으로 데이터를 가공한다.
- Write: 데이터를 수정된 양식으로 다시 저장한다.

### 배치 시나리오

- 배치 프로세스를 주기적으로 커밋
- 동시 다발적인 Job 의 배치 처리, 대용량 병렬 처리
- 실패 후 수동 또는 스케줄링에 의한 재시작
- 의존관계가 있는 step 여러 개를 순차적으로 처리
- 조건적 Flow 구성을 통한 체계적이고 유연한 배치 모델 구성
- 반복, 재시도, Skip 처리

### 아키텍쳐

![image1](./assets/01.png)

- Application
  - 스프링 배치 프레임워크를 통해 개발자가 만든 모든 배치 Job 과 커스텀 코드를 포함한다.
  - 개발자는 업무로직의 구현에만 집중하고 공통적인 기반기술은 프레임웍이 담당하게 한다.
- Batch Core
  - Job을 실행, 모니터링, 관리하는 API로 구성되어 있다.
  - JobLauncher, Job, Step, Flow 등이 속한다.
- Batch Infrastructure
  - Application, Core 모두 공통 Infrastructure 위에서 빌드한다.
  - Job 실행의 흐름과 처리를 위한 틀을 제공함.
  - Reader, Processor Writer, Skip, Retry등이 속한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!