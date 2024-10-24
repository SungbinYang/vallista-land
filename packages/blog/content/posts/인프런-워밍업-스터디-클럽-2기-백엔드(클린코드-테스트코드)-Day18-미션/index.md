---
title: 인프런 워밍업 스터디 클럽 2기 백엔드(클린코드, 테스트코드) Day18 미션
tags:
  - 스터디
image: ./assets/01.jpg
date: 2024-10-23 20:28:27
series: 인프런 워밍업 스터디 클럽 2기
draft: false
---

![banner](./assets/01.png)

> 이 블로그 글은 [박우빈님의 인프런 강의](https://inf.run/kHiWM)와 [워밍업클럽 2기](https://inf.run/zgJk5) 참조하여 작성한 글입니다.

## 미션

### 문제1

요구사항은 아래와 같다.

> @Mock, @MockBean, @Spy, @SpyBean, @InjectMocks 의 차이를 한번 정리해 봅시다.

모의 객체(Mock)는 실제 객체 대신 테스트에 필요한 동작만 수행하도록 가상으로 만들어주는 객체이다. 이러한 Mock 객체는 다양한 방법으로 생성되고 사용될 수 있으며, 각 어노테이션은 그 특성에 맞게 활용됩니다. 축구팀을 비유로 설명하면, 각 어노테이션은 다른 역할을 수행하는 선수처럼 생각할 수 있습니다. 각 선수의 역할을 확인해보자. 또한 예제 코드를 살펴보자.

@Mock

- 설명: `@Mock`은 테스트에서 **가짜 객체(Mock)**를 만들어서 실제 객체의 동작을 대신하는 어노테이션이다. 주로 메서드의 리턴값을 임의로 설정해서 테스트할 수 있다.
- 특징
  - DB나 외부 API 같은 외부 의존성 없이 테스트 대상 코드만 검증할 수 있다.
  - Application Context를 로드하지 않아서 테스트 속도가 빠르다.
  - 목 객체는 기본적으로 아무런 동작도 하지 않지만, 특정 메서드의 리턴값을 미리 정의할 수 있다.
- 비유: 축구 경기에서 훈련용 인형을 사용하는 것과 같다. 인형은 실제로 축구를 하지 않지만, 그 위치나 형태로 경기 상황을 시뮬레이션할 수 있다.
- 예제코드

```java
@ExtendWith(MockitoExtension.class)
class MockTest {

    @Mock
    private PlayerService playerService;  // PlayerService를 Mock으로 테스트

    @Test
    void testPlayerName() {
        // given
        when(playerService.getPlayerName()).thenReturn("메시");

        // when
        String playerName = playerService.getPlayerName();

        // then
        assertThat(playerName).isEqualTo("Lionel Messi");
    }
}
```

@MockBean

- 설명: `@MockBean`은 스프링 애플리케이션 컨텍스트 내의 특정 빈을 가짜로 대체하는 어노테이션이다. 통합 테스트에서 실제 빈 대신 가짜 빈을 사용하고 싶을 때 주로 사용한다.
- 특징
  - 스프링 애플리케이션 컨텍스트를 로드하면서도, 해당 빈을 가짜로 대체해서 외부 의존성 없이 테스트할 수 있다.
  - 실제 스프링 환경을 테스트할 수 있지만, 외부 의존성 없이 통합 테스트가 가능하다.
- 비유: 마치 축구 경기에서 대체 선수를 사용하는 것과 같다. 실제 팀에 등록된 선수를 대체하는 선수로 바꿔서 경기를 시뮬레이션하는 느낌이다.
- 예제코드

```java
@SpringBootTest
class MockBeanTest {

    @MockBean
    private PlayerService playerService;  // 실제 스프링 빈을 MockBean으로 대체

    @Test
    void testPlayerService() {
        // given: MockBean으로 해당 메서드 동작 정의
        when(playerService.getPlayerGoals()).thenReturn(30);

        // when
        int playerGoals = playerService.getPlayerGoals();

        // then
        assertThat(playerGoals).isEqualTo(30);
    }
}
```

@Spy

- 정의: `@Spy`는 실제 객체를 사용하면서도, 일부 메서드만 가짜로 동작하게 만드는 어노테이션이다. 즉, 객체의 대부분은 실제 동작을 유지하면서 필요한 부분만 가짜로 처리할 수 있다.
- 특징
  - 실제 객체의 동작을 유지하면서도 특정 메서드만 가짜로 처리할 수 있다.
  - Application Context를 로드하지 않아서 외부 의존성 없이 빠르게 테스트할 수 있다.
- 비유: 마치 실제 선수가 경기를 하다가 특정 순간에만 대체 선수로 교체하는 것과 같다. 대부분의 시간엔 실제 선수로 행동하다가, 특정 상황에서만 가짜 동작을 하게 됀다.
- 예제 코드

```java
@ExtendWith(MockitoExtension.class)
class SpyTest {

    @Spy
    private PlayerService playerService = new PlayerService();  // 실제 객체를 사용하면서 스파이 가능

    @Test
    void testPlayerNameWithSpy() {
        // given: 특정 메서드만 스파이 처리로 가짜 동작
        doReturn("호날두").when(playerService).getPlayerName();

        // when
        String playerName = playerService.getPlayerName();

        // then
        assertThat(playerName).isEqualTo("호날두");
    }
}
```

@SpyBean

- 정의: `@SpyBean`은 스프링 애플리케이션 컨텍스트 내의 빈을 스파이로 만들어서, 실제 객체의 대부분은 동작하게 두고 필요한 부분만 가짜로 처리하는 어노테이션이다.
- 특징
  - 스프링 컨텍스트를 유지한 상태에서, 특정 빈을 스파이로 만들어 외부 의존성 없이 필요한 부분만 테스트할 수 있다.
  - 빈의 대부분의 기능은 실제로 동작하고, 필요한 메서드만 가짜로 대체된다.
- 비유: 마치 경기 중에 특정 상황에서만 대체 선수를 사용하는 것과 비슷하다. 다른 모든 동작은 그대로 유지되지만, 필요한 순간에만 다른 행동을 하게 하는 것이다.
- 예제 코드

```java
@SpringBootTest
class SpyBeanTest {

    @SpyBean
    private PlayerService playerService;  // 스프링 빈을 스파이로 대체

    @Test
    void testPlayerGoalsWithSpyBean() {
        // given: 특정 메서드만 스파이 처리로 동작
        doReturn(20).when(playerService).getPlayerGoals();

        // when
        int playerGoals = playerService.getPlayerGoals();

        // then
        assertThat(playerGoals).isEqualTo(20);
    }
}
```

@InjectMocks

- 정의: `@InjectMocks`는 Mock이나 Spy 객체들을 주입받아서 의존성 설정을 자동으로 처리해주는 어노테이션이다. 이를 통해 객체가 필요로 하는 의존성을 자동으로 설정할 수 있다.
- 특징
  - Mock 또는 Spy 객체들을 자동으로 주입하여 의존성을 수동으로 설정할 필요가 없다.
  - Application Context를 로드하지 않아서 테스트가 빠르게 진행된다.
- 비유: 마치 감독이 선수에게 적합한 보조 선수들을 자동으로 배치해주는 것과 같다. 특정 선수에게 필요한 도움을 자동으로 설정하는 느낌이다.
- 예제 코드

```java
@ExtendWith(MockitoExtension.class)
class InjectMocksTest {

    @Mock
    private PlayerRepository playerRepository;

    @InjectMocks
    private PlayerService playerService;  // Mock 객체들이 자동으로 주입됨

    @Test
    void testPlayerWithInjectMocks() {
        // given: Mock 객체로 리포지토리 동작 정의
        when(playerRepository.findByName("손흥민")).thenReturn(new Player("손흥민"));

        // when
        Player player = playerService.getPlayerByName("손흥민");

        // then
        assertThat(player.getName()).isEqualTo("손흥민");
    }
}
```

### 문제2

요구사항은 아래와 같다.

> 아래 3개의 테스트가 있습니다.
> 내용을 살펴보고, 각 항목을 @BeforeEach, given절, when절에 배치한다면 어떻게 배치하고 싶으신가요?
> (@BeforeEach에 올라간 내용은 공통 항목으로 합칠 수 있습니다. ex. 1-1과 2-1을 하나로 합쳐서 @BeforeEach에 배치)

코드는 아래와 같다.

```java
@BeforeEach
void setUp() {
    ❓
}

@DisplayName("사용자가 댓글을 작성할 수 있다.")
@Test
void writeComment() {
    1-1. 사용자 생성에 필요한 내용 준비
    1-2. 사용자 생성
    1-3. 게시물 생성에 필요한 내용 준비
    1-4. 게시물 생성
    1-5. 댓글 생성에 필요한 내용 준비
    1-6. 댓글 생성

    // given
    ❓

    // when
    ❓

    // then
    검증
}

@DisplayName("사용자가 댓글을 수정할 수 있다.")
@Test
void updateComment() {
    2-1. 사용자 생성에 필요한 내용 준비
    2-2. 사용자 생성
    2-3. 게시물 생성에 필요한 내용 준비
    2-4. 게시물 생성
    2-5. 댓글 생성에 필요한 내용 준비
    2-6. 댓글 생성
    2-7. 댓글 수정

    // given
    ❓

    // when
    ❓

    // then
    검증
}

@DisplayName("자신이 작성한 댓글이 아니면 수정할 수 없다.")
@Test
void cannotUpdateCommentWhenUserIsNotWriter() {
    3-1. 사용자1 생성에 필요한 내용 준비
    3-2. 사용자1 생성
    3-3. 사용자2 생성에 필요한 내용 준비
    3-4. 사용자2 생성
    3-5. 사용자1의 게시물 생성에 필요한 내용 준비
    3-6. 사용자1의 게시물 생성
    3-7. 사용자1의 댓글 생성에 필요한 내용 준비
    3-8. 사용자1의 댓글 생성
    3-9. 사용자2가 사용자1의 댓글 수정 시도

    // given
    ❓

    // when
    ❓

    // then
    검증
}
```

일단 한번 정리해보자. 내가 정리한 사항은 아래와 같다.

- 공통적인 사용자, 게시물, 댓글 생성 로직을 `@BeforeEach`에 배치한다.
- 각 테스트의 고유 로직은 `given`, `when`, `then` 절에 분리한다.
- `@BeforeEach`에 포함될 수 있는 부분은 모든 테스트에 공통적으로 필요한 내용으로 합치고, 테스트 케이스별 행동과 상황 설정을 각 `given`, `when` 절에 넣습니다.

@BeforeEach에 배치할 내용

사용자 생성과 게시물 생성은 모든 테스트에서 공통적으로 필요하기 때문에 `@BeforeEach`에 배치될 수 있다. 이렇게 하면 각 테스트에서 중복 코드를 줄일 수 있다. 예를 들어, 사용자 생성에 필요한 내용 준비와 게시물 생성에 필요한 내용 준비는 반복적으로 나타나므로 공통화할 수 있다.

```java
@BeforeEach
void setUp() {
    // 1-1, 2-1, 3-1 공통: 사용자1 생성에 필요한 내용 준비
    사용자1 생성에 필요한 내용 준비

    // 1-3, 2-3, 3-5 공통: 게시물 생성에 필요한 내용 준비
    게시물 생성에 필요한 내용 준비

    // 1-2, 2-2, 3-2 공통: 사용자1 생성
    사용자1 생성

    // 1-4, 2-4, 3-6 공통: 사용자1의 게시물 생성
    사용자1의 게시물 생성
}
```

writeComment 테스트

이 테스트에서는 사용자가 댓글을 작성할 수 있는 시나리오이다. `@BeforeEach`에서 공통으로 사용자와 게시물을 생성했으니, 이제 given, when 절에서 각각의 고유 로직을 작성한다.

```java
@DisplayName("사용자가 댓글을 작성할 수 있다.")
@Test
void writeComment() {
    // given
    // 1-5: 댓글 생성에 필요한 내용 준비
    댓글 생성에 필요한 내용 준비

    // when
    // 1-6: 댓글 생성
    댓글 생성

    // then
    검증
}
```

- given: 댓글 생성에 필요한 내용을 준비한다.
- when: 사용자가 댓글을 생성한다.
- then: 검증 절에서는 댓글이 제대로 작성되었는지 확인한다.

updateComment 테스트

이 테스트는 사용자가 댓글을 수정할 수 있는 시나리오이다. 마찬가지로 `@BeforeEach`에서 사용자와 게시물을 생성했으니, `given`, `when` 절에서 각각의 고유 로직을 작성한다.

```java
@DisplayName("사용자가 댓글을 수정할 수 있다.")
@Test
void updateComment() {
    // given
    // 2-5: 댓글 생성에 필요한 내용 준비
    댓글 생성에 필요한 내용 준비

    // 2-6: 댓글 생성
    댓글 생성

    // when
    // 2-7: 댓글 수정
    댓글 수정

    // then
    검증
}
```

- given: 댓글 생성과 관련된 내용을 준비하고, 댓글을 생성한다.
- when: 사용자가 댓글을 수정한다.
- then: 댓글이 정상적으로 수정되었는지 검증한다.

cannotUpdateCommentWhenUserIsNotWriter 테스트

이 테스트는 댓글 작성자가 아닌 사용자가 댓글을 수정하려 할 때 수정이 불가능한 시나리오이다. @BeforeEach에서는 공통적으로 사용자1을 생성했으나, 사용자2를 추가로 생성하는 부분이 있다. 그리고 사용자1의 게시물과 댓글을 생성한 후, 사용자2가 그 댓글을 수정하려는 시도를 given, when 절에서 처리한다.

```java
@DisplayName("자신이 작성한 댓글이 아니면 수정할 수 없다.")
@Test
void cannotUpdateCommentWhenUserIsNotWriter() {
    // given
    // 3-3 사용자2 생성에 필요한 내용 준비
    사용자2 생성에 필요한 내용 준비

    // 3-4. 사용자2 생성
    사용자2 생성

    // 3-7: 사용자1의 댓글 생성에 필요한 내용 준비
    사용자1의 댓글 생성에 필요한 내용 준비

    // 3-8: 사용자1의 댓글 생성
    사용자1의 댓글 생성

    // when
    // 3-9: 사용자2가 사용자1의 댓글 수정 시도
    사용자2가 사용자1의 댓글 수정 시도

    // then
    검증 (수정 불가 확인)
}
```

최종적으로 코드는 다음과 같다.

```java
@BeforeEach
void setUp() {
    // 1-1, 2-1, 3-1 공통: 사용자1 생성에 필요한 내용 준비
    사용자1 생성에 필요한 내용 준비

    // 1-3, 2-3, 3-5 공통: 게시물 생성에 필요한 내용 준비
    게시물 생성에 필요한 내용 준비

    // 1-2, 2-2, 3-2 공통: 사용자1 생성
    사용자1 생성

    // 1-4, 2-4, 3-6 공통: 사용자1의 게시물 생성
    사용자1의 게시물 생성
}

@DisplayName("사용자가 댓글을 작성할 수 있다.")
@Test
void writeComment() {
    // given
    // 1-5: 댓글 생성에 필요한 내용 준비
    댓글 생성에 필요한 내용 준비

    // when
    // 1-6: 댓글 생성
    댓글 생성

    // then
    검증
}

@DisplayName("사용자가 댓글을 수정할 수 있다.")
@Test
void updateComment() {
    // given
    // 2-5: 댓글 생성에 필요한 내용 준비
    댓글 생성에 필요한 내용 준비

    // 2-6: 댓글 생성
    댓글 생성

    // when
    // 2-7: 댓글 수정
    댓글 수정

    // then
    검증
}

@DisplayName("자신이 작성한 댓글이 아니면 수정할 수 없다.")
@Test
void cannotUpdateCommentWhenUserIsNotWriter() {
    // given
    // 3-3. 사용자2 생성에 필요한 내용 준비
    사용자2 생성에 필요한 내용 준비

    // 3-4. 사용자2 생성
    사용자2 생성

    // 3-7: 사용자1의 댓글 생성에 필요한 내용 준비
    사용자1의 댓글 생성에 필요한 내용 준비

    // 3-8: 사용자1의 댓글 생성
    사용자1의 댓글 생성

    // when
    // 3-9: 사용자2가 사용자1의 댓글 수정 시도
    사용자2가 사용자1의 댓글 수정 시도

    // then
    검증 (수정 불가 확인)
}
```
