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

## 한 문단에 한 주제

이전 강의인 Readable Code에서도 배웠고 학창시절 영어독해시간에도 배웠듯이 한 문단에는 하나의 주제로 이루어져야 한다. 테스트도 문서다. 즉, 각각 하나의 테스트는 하나의 문단이고 그 테스트 코드는 하나의 주제를 가져야 한다.

## 완벽하게 제어하기

테스트 코드를 작성할 때는 모든 조건들을 완벽히 제어가 가능해야 한다. 우리는 이전에 `LocalDateTime.now()`을 사용하면서 현재시간에 따라 테스트가 성공할때도 있고 실패할때도 있는 경우를 보았다. 그래서 우리는 이를 해결하기 위해 이 현재시간을 상위에 넘기고 파라미터로 받는 방식을 택하였다.

그러면 만약에 `LocalDateTime.now()`를 사용해도 테스트가 무조건 성공한다면 사용해도 되나? 우빈님께서는 지양한다고 하셨다. 그 이유는 그 테스트는 성공할진 몰라도 팀 단위에서 해당 코드를 사용하면 그게 프로젝트에 번져서 빈번히 사용할 확률이 높기때문이라고 하셨다. 나도 이점을 한번 주의해야겠다.

## 테스트 환경의 독립성을 보장하자

테스트 환경은 대부분 given절에서 환경을 세팅한다. 그런데 이런 given절에서 다른 API를 사용하게 된다면 어떻게 될까? 해당 API와 테스트 코드가 결합도가 생기게 된다. 이런 부분을 방지하고 테스트코드 독립성을 보장시켜야 한다.

```java
@Test
@DisplayName("재고가 부족한 상품으로 주문을 생성하려는 경우 예외가 발생한다.")
void createOrderWithNoStock() {
    // given
    LocalDateTime registeredDateTime = LocalDateTime.now();

    Product product1 = createProduct(BOTTLE, "001", 1000);
    Product product2 = createProduct(BAKERY, "002", 3000);
    Product product3 = createProduct(HANDMADE, "003", 5000);
    productRepository.saveAll(List.of(product1, product2, product3));

    Stock stock1 = Stock.create("001", 2);
    Stock stock2 = Stock.create("002", 2);
    stock1.deductQuantity(1); // @todo
    stockRepository.saveAll(List.of(stock1, stock2));

    OrderCreateServiceRequest request = OrderCreateServiceRequest.builder()
            .productNumbers(List.of("001", "001", "002", "003"))
            .build();

    // when & then
    assertThatThrownBy(() -> orderService.createOrder(request, registeredDateTime))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("재고가 부족한 상품이 있습니다.");
}
```

위의 코드에서 todo부분을 살펴보자. 해당 코드는 주문생성관련 로직이다. 그런데 deductQuantity를 현재 재고보다 많이 차감시키면 해당 메서드에서 예외를 던질 것이다. 그러면 given절에서 테스트가 실패되고 내가 위에서 말했던 결합도가 생긴 케이스이다. 또한 이건 내 생각이지만 주문생성로직에 재고차감로직이 들어가 있으니 하나의 테스트코드에 주제가 2개가 되버리는 상황이 생긴다. 이런것을 방지하는 것이 좋다.

## 테스트 간 독립성을 보장하자

테스트는 각각 수행되어야 하고 테스트 순서가 무작위여도 같은 결과가 나와야 한다. 하지만 만약 테스트에 공유자원을 사용하게 되면 예상치 못한 결과가 나올 우려가 있기에 테스트가 실패할 경우도 있을 것이다. 이런 점때문에 공유자원 사용은 지양하자.

## 한 눈에 들어오는 Test Fixture 구성하기

### Test Fixture

- Fixture: 고정 틀, 고정되어 있는 물체 (given절에 생성한 객체들)
- 테스트를 위해 원하는 상태로 고정시킨 일련의 객체

우리는 이에 관련해서 `@BeforeEach` `BeforeAll`에 대해 알아보았다. 그런데 @BeforeEach같은 경우 given절에서 만든 데이터를 넣는 행위는 지양하다고 하셨다. 결국 이것은 이전에 봤던 공유자원과 같은 역할을 한다. 또한 테스트는 문서인데 given절을 보려니 없어서 스크롤로 위로 왔다갔다 하는 상황이 발생하기 때문에 테스트 문서의 파편화가 일어난다.

그러면 언제 @BeforeEach를 쓸까? 각 테스트 입장에서 봤을 때 아예 몰라도 테스트 내용을 이해하는데 문제가 없는가?라는 물음과 수정해도 모든 테스트에 영향을 주지 않는가?라는 물음에 괜찮다면 사용하자! 그렇지 않다면 지양하자.

또한 data.sql을 이용해 미리 쿼리를 생성해 given절을 작성하는 행위는 지양하자. 왜냐하면 테스트 파편화가 일어나기도 하고 나중에 실무에 가면 수십개의 컬럼과 수십개의 테이블이 있고 이 테이블이나 컬럼이 바뀔때마다 수정을 해줘야 하기때문에 관리포인트가 늘어나기 때문이다.

또한 given절에 객체를 생성 시, 필요한 파라미터만 주입받는것을 고려하면 작성하자. 해당 파라미터를 보고 이 파라미터는 테스트에 전혀 영향을 주지 않을 것 같은 것은 고정값으로 두고 파라미터를 빼는 것처럼 말이다.

마지막으로 builder와 같이 given절에 들어가는 것을 하나의 테스트 config 클래스에 모아두는 행위는 지양하자. 왜냐하면 나중에 실무에서 작성하다보면 새로운 빌더가 생기고 메서드 오버로딩때문에 파라미터 순서만 바뀌는 빌더도 많이 생길 수 있으며 테스트 문서 파편화로 인해 더 불편해질 것 같다. 그래서 클래스마다 필요한 파라미터만 받아서 작성하는 것이 좋다.

## Test Fixture 클렌징

`deleteAll()`과 `deleteAllInBatch()`에 차이에 대해 알아보자. 우빈님은 `deleteAllInBatch()`를 더 선호하신다고 하셨다. 그 이유에 대해 알아보자.

`deleteAllInBatch()`는 delete from~ 절만 나가는 순수 테이블 전체 삭제에 용이하다. 하자민 단점이라하면 순서를 잘 생각해야 한다. 만약 A라는 테이블과 B라는 테이블이 M:N 연관관계를 맺어 중간테이블 AB라는 테이블이 있을때 AB부터 테이블을 삭제해주고 A, B순서대로 삭제를 해줘야 한다. 그렇지 않으면 예외가 발생한다.

`deleteAll()`은 굳이 중간테이블을 삭제할 필요없이 중간테이블을 알고 있는 테이블만 삭제해도 알아서 삭제해준다. 하지만 단점은 해당 메서드를 실행하면 해당 엔티티를 먼저 전체 select를 하고 다음으로 delete from where 절이 나간다. 그리고 해당 절은 테이블에 있는 데이터 수 만큼 나가기 때문에 수많은 데이터가 존재하면 성능이 매우 떨어질 것이다.

그래서 `deleteAllInBatch()`가 더 선호하는 이유를 알 것 같다. 하지만 이런것보다 side effect를 잘 고려해서 `@Transactional`을 잘 사용하는 것이 베스트일 것 같다.

## @ParameterizedTest

테스트 코드에 if-else나 for문같이 조건문, 반복문등 읽는 사람의 생각이 들어가는 것을 지양해야한다고 말했다. 그래서 여러가지 테스트 로직이 하나의 테스트 코드에 있다면 분리하자고 하였다. 그런데 만약 단순히 값 여러개로 하나의 테스트를 하고 싶은경우 테스트를 나누는 것보다 `@ParameterizedTest`를 사용하는 것이 깔끔해진다.

대표적인 예시로 내가 사이드프로젝트에서 작성했던 코드를 들 수 있을 것 같다.

```java
@ParameterizedTest
@MethodSource("providedTestDataForSignup")
@DisplayName("회원가입 통합 테스트 - 실패(유효하지 않은 회원가입 폼)")
void member_signup_integration_test_fail_caused_by_invalid_signup_form(String name, String nickname, String email, String password, String confirmPassword, String phoneNumber, LocalDate birthday) throws Exception {
    MemberSignupRequestDto requestDto = new MemberSignupRequestDto(name, nickname, email, password, confirmPassword, phoneNumber, birthday);

    this.mockMvc.perform(post("/api/auth/signup")
                  .contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8")
                    .accept(MediaType.APPLICATION_JSON + ";charset=UTF-8")
                    .content(this.objectMapper.writeValueAsString(requestDto)))
            .andDo(print())
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("message").exists())
            .andExpect(jsonPath("status").value(GlobalExceptionCode.INVALID_REQUEST_PARAMETER.getHttpStatus().name()))
            .andExpect(jsonPath("code").value(GlobalExceptionCode.INVALID_REQUEST_PARAMETER.getCode()))
            .andExpect(jsonPath("timestamp").exists());
}

private static Stream<Arguments> providedTestDataForSignup() {
    return Stream.of(
            Arguments.of("양성빈", "tester", "email@email.com", "1q2w3e4r5t!", "1q2w3e4r5t!", "010-1234-1234", LocalDate.of(1999, 1, 1)),
            Arguments.of("양성빈", "robert", "test@email.com", "1q2w3e4r5t!", "1q2w3e4r5t!", "010-1234-1234", LocalDate.of(1999, 1, 1)),
            Arguments.of("양성빈", "robert", "email@email.com", "1q2w3e4r5t!", "t5r4e3w2q1@", "010-1234-1234", LocalDate.of(1999, 1, 1)),
            Arguments.of("양성빈", "robert", "email@email.com", "1q2w3e4r5t!", "1q2w3e4r5t!", "010-1111-1111", LocalDate.of(1999, 1, 1))
    );
}
```

이렇게 `@MethodSource`를 사용하는 경우 이외에오 `@CsvSource`를 이용하는 경우도 있고 다른 방법도 있으니 한번 찾아보면 좋을 것 같다.

## @DynamicTest

공유변수를 가지고 여러개의 테스트가 사용하는 것은 지양하자고 하였다. 왜냐하면 테스트의 순서가 생겨버리고 서로 강결합이 되기 때문이다. 하지만 환경 설정 후 시나리오 테스트를 하는 경우가 있을 것이다. 그럴 경우 `@DynamicTest`를 이용하자. 사용법은 아래와 같다.

```java
@TestFactory
@DisplayName("")
Collection<DynamicTest> dynamicTests() {
    // given

    return List.of(
            DynamicTest.dynamicTest("", () -> {
                // given


                // when


                // then

            }),
            DynamicTest.dynamicTest("", () -> {
                // given


                // when

                // then

            })
        );
    }
```

## 테스트 수행도 비용이다. 환경 통합하기

이제 전체 테스트를 돌려보자. 지금 테스트를 전체 돌려보면 2.x초라는 시간이 걸리고 spring boot 서버가 6번 뜨는 불필요한 행위가 발생한다.

테스트 코드를 작성하는 이유가 인간의 수동화된 검증에 대한 불신도 있지만 가장 큰 이유는 시간을 아끼기 위해서이다. 하지만 테스트를 돌렸는데 2.x초라는 행위는 너무 아깝다. 그래서 우리는 하나의 통합추상 클래스를 만들어 service와 repository부분을 하나의 추상클래스를 상속받게 함으로 테스트 띄우는 횟수를 줄였다. 그리거 마지막 controller부분도 별도의 추상클래스를 만들어 해당 클래스를 상속받게 함으로 서버 띄우는 횟수를 줄여갔다. 결론적으로 총 서버는 2번 띄워졌고 2.x초에서 1.x초로 속도가 줄어갔다.

## Q. private 메서드의 테스트는 어떻게 하나요?

정답은 할 필요도 없고 하려고 해서도 안된다. 클라이언트 입장에서는 제공되는 public 메서드만 알 수 있고 알아야하며 그 외의 내부 메서드는 알 필요가 없다. 또한 public 메서드를 테스트한다는 것은 내부 private 메서드도 자동으로 같이 테스트하는 것이므로 따로 테스트를 할 필요가 없다. 다만 만약 이렇게 해도 계속 위의 물음이 생각나면 객체를 분리할 시점인가를 검토해야한다. 그리고 객체를 분리시켜 해당 private 메서드를 해당 객체의 public 메서드로 두고 단위 테스트를 진행해야 할 것이다.

나는 미션을 진행하면서 이런 물음이 생각났고 private 메서드를 리플렉션을 통해 테스트를 한 경우가 있는데 위의 해답을 듣고 나니 괜히 테스트를 한것이구나라는 생각이 들어 조금은 반성하게 된 계기였다.

## Q. 테스트에서만 필요한 메서드가 생겼는데 프로덕션 코드에서는 필요 없다면?

답변은 만들어도 된다. 다만 **보수적**으로 접근해야 한다. 즉, 어떤 객체가 마땅히 가져도 되고 미래지향적이면 만들어도 상관없다.
