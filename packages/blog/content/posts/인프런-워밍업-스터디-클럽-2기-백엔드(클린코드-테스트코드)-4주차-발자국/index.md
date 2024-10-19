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

또한 해당 request DTO를 만들면서 하나의 DTO를 이용해서 presentation layer부터 Business Layer까지 쓰이곤 한다. 이런 점은 DTO를 두고 의존성을 둘 수 있다는 것이다. 이건 layered architecture에 어긋한다. 따라서 서비스용 DTO, 컨트롤용 DTO를 별도 개발해서 진행을 해보는 작업을 해보았다. 또한 컨트롤러에서는 최소한의 검증을 하고 그 외에는 서비스용으로 옮겨보는 법도 생각해보았다.

## 미션

이번 미션은 레이어 아키텍쳐에 관하여 설명과 테스트 방법에 대해 나만의 언어로 풀어쓰는 미션이다. 처음에는 내 언어로 표현한다는게 막막했지만 차근차근 정리를 해가다보니 금방 쉽게 풀어써졌다.

[미션 링크](<https://sungbin.kr/인프런-워밍업-스터디-클럽-2기-백엔드(클린코드-테스트코드)-Day15-미션/>)

## Mockito로 Stubbing하기

### 요구사항

현재 관리자 페이지에서 당일 매출에 대한 내역을 메일전송을 받고 싶어한다.

그래서 우리는 해당 요구사항을 바탕으로 비즈니스 로직을 작성하였다. 핵심은 테스트이다. 메일 전송은 외부 네트워크를 타고 전송이 되는 로직이라 매우 오랜 시간이 걸린다.(내 경험) 또한 메일을 계속 보내다보면 나중에 수 많은 테스트 메일이 쌓여 있는 것을 알 수 있다. 이럴때는 어떻게 할까? 메일 전송 행위자체를 mocking하면 되는데 이것을 **stubbing**이라고 한다. 우리는 메일 전송 로직을 mockBean을 이용해 mocking하고 행위 자체를 stubbing하여 테스트를 수행 할 수 있었다.

## Test Double

### 출처

배우 대역의 스턴트맨이 그 Test Double의 근원지이다.

### 관련 용어

- Dummy: 아무것도 하지 않는 깡통객체
- Fake: 단순한 형태로 동일한 기능은 수행하나 프로덕션에서 쓰기에는 부족한 객체(ex. FakeRepository)
- Stub: 테스트에서 요청한 것에 대해 미리 준비한 결과를 제공하는 객체. 그 외에는 응답X
- Spy: Stub이면서 호출된 내용을 기록하며 보여줄 수 있는 객체. 일부는 실제 객체러첨 동작시키고 일부만 stubbing
- Mock: 행위에 대한 기대를 명세하고 그에 따라 동작하도록 만들어진 객체

> Stub과 Mock을 헷갈려한다. 동일한거 아닌가? 결론부터 말하자면 Mock은 Stub이 아니다. Mock은 행위에 대한 검증을 할때 사용하고 Stub은 상태에 대한 검증을 할때 사용된다.

## @Mock, @Spy, @InjectMocks

순수 Mockito로 검증하는 시간을 가져보았다. 우리는 `@SpringBootTest`를 붙여서 통합 테스트를 가져보았는데 그렇게 하지 않고 순수 Mockito로 테스트할 수 있는 방법은 없을까?

그래서 우리는 기존에 MailService를 테스트를 가져보았다. 의존성으로 주입된 것들을 mock()을 이용하여 만들어주고 MailService를 해당 mock()으로 만든 것을 생성자에 넣어주어서 실행했다.

하지만 이렇게 하는것보다 더 좋은 방법은 `@Mock`과 `@InjectMocks`를 이용하는 방법이다. mock()으로 생성한 객체는 @Mock 어노테이션을 붙여서 사용이 가능하고 만들어진 mock 객체를 이용하여 생성한 객체 MockService는 @InjectMocks를 이용하여 더 간단히 사용이 가능하다. 추가적으로 해당 메서드 안에 특정메서드가 몇번 불렸는지 확인하는 것은 `verify`로 확인이 가능하다.

> @Mock을 사용할 때는 @ExtendWith(MockitoExtension.class)을 붙여줘야 한다.

또한 `@Spy`를 이용할건데 사용법은 @Mock과 유사하다. 다른점은 @Mock을 사용할때 `when().thenReturn()`식을 이용했는데 @Spy는 `doReturn().when().메서드()`를 이용하면 된다. @Mock과 비교해보자. @Mock을 사용하면 해당 메서드만 mocking을 하여 사용하고 그 외의 메서드들은 작동을 안 한다. 하지만 @Spy를 사용하면 해당 객체에 호출한 메서드들이 전부 작동이 된다. 그래서 일반적으로 @Mock을 사용하지만 @Spy를 이용할 때도 있으니 알아두자.

## BDDMockito

BDD는 행위주도개발로 이전에 한번 살펴본 적이 있다. 이전에 실습한 코드를 보면 뭔가 이상하다고 느낄 수 있을 것이다.

```java
// given
when(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString())).thenReturn(true);
```

분명 given절인데 when이 들어가져 있다. 그래서 만들어진 것이 BDDMockito다. BDDMockito의 given을 이용하면 아래와 같이 변경이 가능하다.

```java
given(mailSendClient.sendEmail(anyString(), anyString(), anyString(), anyString())).willReturn(true);
```

그럼 정확히 given에 given을 이용하니 명확해진다.

## Classicist VS. Mockist

Classicist입장은 다 mocking하면 실제 객체들의 동작 및 두 객체들이 합쳐서 동작할때 그에 따른 사이드 이펙트는 어떻게 검증할건데라는 입장이며 Mockist 입장은 모든 걸 다 mocking하면 각 객체들의 기능에 대한걸 보장하니 굳이 통합테스트를 할 필요가 없다라는 입장이다.

우리는 Persistence Layer에서 단위 테스트를 진행하고 Business Layer에서는 통합 테스트를 Presentation Layer에서 두 레이어를 모킹하여 진행했다. 이것을 Mockist가 본다면 굳이 시간낭비하고 있다고 할 것이다.

우빈님의 생각은 Classicist입장이시며 mocking을 할때는 외부시스템을 사용할 일이 있을때 사용한다고 하셨다.

즉 결론은 mocking을 했다 하더라도 실제 프로덕션 코드에서 런타임 시점에 일어날 일을 정확하게 stubbing했다 단언할 수 없으니 통합테스트를 해보자는 것 같다.

나의 입장은 이렇다. QuerDSL같은 외부자원을 사용할때 나는 해당 부분을 테스트할때 테스트를 진행하고 비즈니스 레이어에는 해당 부분을 mocking처리한다. 그리고 컨트롤러 부분에서 통합테스트를 사용하는데 이 부분은 한번 질문을 드려봐야겠다.
