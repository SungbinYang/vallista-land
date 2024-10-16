---
title: 인프런 워밍업 스터디 클럽 2기 백엔드(클린코드, 테스트코드) 4주차 발자국
tags:
  - 스터디
image: ./assets/01.png
date: 2024-10-17 04:25:27
series: 인프런 워밍업 스터디 클럽 2기
draft: false
---

![banner](./assets/01.png)

> 이 블로그 글은 [박우빈님의 인프런 강의](https://inf.run/kHiWM)를 참조하여 작성한 글입니다.

## Presentation Layer 테스트

- 외부세계의 요청을 가장 먼저 받는 계층
- 파라미터에 대한 최소한의 검증을 수행

### MockMVC

Mock 객체를 사용해 스프링 MVC 동작을 재현할 수 있는 테스트 프레임워크

### 요구사항

- 관리자 페이지에서 신규상품을 등록할 수 있다.
- 상품명, 상품타입, 판매상태, 가격등을 입력받는다.

그래서 해당 요구사항으로 비즈니스 로직을 작성 후 해당 부분 테스트를 해보았다. 여기서 잠깐 주목할만한 부분이라면 바로 `@Transactional(readOnly = true)`와 `@Transactional`이다. readOnly옵션은 읽기 전용이라는 뜻이다. 해당옵션에서는 CRUD중에 R만 기능동작을 하게 한다. 또한 JPA에서 CUD스냅샷 저장과 변경감지를 하지 않아 성능향상에 이점을 줄 수 있다. 또한 CQRS에서 Command부분과 Read부분을 나누자는 것처럼 우리의 비즈니스 로직중에 해당 클래스를 readOnly옵션을 전체로 주고 CUD에 해당되는 부분만 @Transactional을 사용하자!

또한 우리는 validation을 적용하고 예외를 처리하기 위해 spring-boot-starter-validation 의존성을 추가해주고 각 dto에 어노테이션들을 추가해주었다. 또한 각 예외상황에 맞게 처리할 RestControllerAdvice를 두었으며 공통응답객체를 만들어 진행을 해보았다. 여기서 유심히 볼 부분이 몇가지 존재한다.

> ⚠️ @NotBlank vs @NotNull vs @NotEmpty
>
> NotNull은 null값을 허용을 하지 않는 것이고 NotEmpty는 ""문자열만 허용을 하지 않으며 NotBlank는 이 둘을 다 포함하면서 " "문자열도 포함시키지 않는다.

또한 해당 request DTO를 만들면서 하나의 DTO를 이용해서 presentation layer부터 Business Layer까지 쓰이곤 한다. 이런 점은 DTO를 두고 의존성을 둘 수 있다는 것이다. 이건 layered architecture에 어긋한다. 따라서 서비스용 DTO, 컨트롤용 DTO를 별도 개발해서 진행을 해보는 작업을 해보았다.
