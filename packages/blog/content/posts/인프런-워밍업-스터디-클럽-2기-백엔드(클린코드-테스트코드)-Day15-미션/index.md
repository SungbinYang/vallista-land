---
title: 인프런 워밍업 스터디 클럽 2기 백엔드(클린코드, 테스트코드) Day15 미션
tags:
  - 스터디
image: ./assets/01.jpg
date: 2024-10-18 04:28:27
series: 인프런 워밍업 스터디 클럽 2기
draft: false
---

![banner](./assets/01.png)

> 이 블로그 글은 [박우빈님의 인프런 강의](https://inf.run/kHiWM)와 [워밍업클럽 2기](https://inf.run/zgJk5) 참조하여 작성한 글입니다.

## 미션

미션의 요구사항은 다음과 같다.

> Layered Architecture에서 레이어별로 **어떤 특징**이 있고 **어떻게 테스트**를 하면 좋을지에 대해 나만의 언어로 표현하자.

그래서 다시 한번 해당 개념에 대해 고민을 하였다. 그리고 한번 정리를 해보았다.

### Persistence Layer

#### 특징

이 레이어는 데이터베이스와의 상호작용을 책임진다. Data Access역할을 하며 데이터 저장, 조회, 업데이트, 삭제와 같은 CRUD 작업이 이 레이어에서 처리된다.(비즈니스 가공로직 포함X) `Spring Data JPA` 같은 기술을 사용해 엔티티와 데이터베이스 간의 매핑을 처리하며, 비즈니스 로직에서 발생한 데이터 변화를 반영한다. 이 레이어는 축구 경기에서 공을 상대 골문으로 직접 전달하는 미드필더처럼, 데이터를 정확하게 주고받는 역할을 한다.

#### 테스트 방법

Persistence Layer 테스트에서는 실제 데이터베이스와 상호작용하는 코드를 검증한다. 이를 위해 통합테스트와 단위테스트를 나눌 수 있다.

- 단위 테스트: Mock을 사용하여 데이터베이스에 의존하지 않으면서 테스트를 진행한다. `@MockBean`을 통해 Repository를 Mocking하고, 메서드가 올바르게 호출되는지 검증한다. 예를 들어, findById 같은 메서드가 예상된 데이터를 반환하는지 확인한다.

```java
@MockBean
private UserRepository userRepository;

@Test
void testFindUserById() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(new User("양성빈")));
    User user = userService.findUserById(1L);
    assertEquals("양성빈", user.getName());
}
```

- 통합 테스트: 실제 데이터베이스와 통합하여 데이터를 삽입하고 조회하는 등의 작업을 확인한다. `@DataJpaTest`를 사용해 JPA 관련 기능만 로드하여 테스트할 수 있으며, 이때는 H2 같은 인메모리 데이터베이스를 사용할 수 있다.

```java
@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFind() {
        User user = new User("양성빈");
        userRepository.save(user);

        Optional<User> foundUser = userRepository.findById(user.getId());
        assertTrue(foundUser.isPresent());
        assertEquals("양성빈", foundUser.get().getName());
    }
}
```

### Business Layer

#### 특징

이 레이어는 애플리케이션의 핵심 로직을 처리한다. 사용자 요청에 따라 데이터 처리와 관련된 비즈니스 규칙을 구현하고, 도메인 규칙을 따른다. 예를 들어, 특정 조건에 따라 데이터를 가공하거나 결정을 내리는 부분이 이 레이어에서 수행된다. 축구 경기의 감독이 전략을 세우고 팀을 운영하듯, 이 레이어는 애플리케이션의 전반적인 동작을 결정하는 두뇌이다.

또한 비즈니스 로직이 여러 데이터베이스 작업을 포함하고 있다면, `@Transactional` 어노테이션을 사용해 트랜잭션을 적용한다. 예를 들어, 주문 처리 과정에서 결제와 재고 업데이트가 모두 성공적으로 처리되어야 할 때 트랜잭션이 필요하다. 중간에 실패가 발생하면 모든 작업이 롤백된다. 하지만 이 롤백할지 여부는 기본전략을 사용하는 대신에 우리가 `@Transactional`의 rollbackFor 옵션을 통해 지정할 수 도 있다.

#### 테스트 방법

단위 테스트와 통합 테스트를 통해 비즈니스 로직이 정상적으로 작동하는지 확인한다.

- 단위 테스트

Persistence Layer를 Mocking하여 비즈니스 로직의 동작을 검증한다. `@MockBean`을 사용해 Persistence Layer와의 의존성을 제거하고 순수한 비즈니스 로직을 테스트한다.

```java
@MockBean
private UserRepository userRepository;

@Test
void testCalculateDiscount() {
    User user = new User("양성빈", 5); // 5회 구매
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));

    double discount = discountService.calculateDiscount(1L);
    assertEquals(10.0, discount);
}
```

- 통합 테스트

비즈니스 로직과 Persistence Layer가 함께 작동하는지 확인하며, 트랜잭션도 검증한다. `@SpringBootTest`를 사용하여 애플리케이션 컨텍스트를 로드하고, 트랜잭션이 올바르게 작동하는지 확인한다.

```java
@SpringBootTest
class OrderServiceIntegrationTest {
    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    @Transactional
    void testOrderProcessing() {
        Product product = new Product("맥북", 5); // 재고 5
        productRepository.save(product);

        orderService.processOrder(product.getId(), 3); // 3개 주문

        Product updatedProduct = productRepository.findById(product.getId()).get();
        assertEquals(2, updatedProduct.getStock()); // 재고 2개 남음
    }
}
```

### Presentation Layer

#### 특징

사용자의 요청을 받아 비즈니스 레이어로 전달하고, 그 결과를 사용자에게 반환하는 역할을 한다. 주로 컨트롤러에서 사용자의 요청을 처리하고 적절한 응답을 제공한다. 이 레이어는 웹 브라우저나 API 요청과 직접적으로 상호작용하며, JSON, HTML, XML과 같은 포맷으로 데이터를 응답한다. 프레젠테이션 레이어는 축구 경기에서 관중과 가장 가까이 있는 공격수처럼, 사용자와 직접적으로 상호작용하는 역할을 한다.

#### 테스트 방법

프레젠테이션 레이어는 컨트롤러 테스트를 통해 HTTP 요청과 응답이 정상적으로 처리되는지 확인한다.

- 단위 테스트

`MockMvc`를 사용해 컨트롤러를 단위 테스트하며, 외부 종속성은 모두 Mocking한다.

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testGetUser() throws Exception {
        when(userService.findUserById(1L)).thenReturn(new User("양성빈"));

        mockMvc.perform(get("/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("양성빈"));
    }
}
```

- 통합 테스트

실제 애플리케이션 전반을 통합하여, 컨트롤러와 비즈니스 로직이 함께 동작하는지 확인한다. 이 테스트에서는 전체 애플리케이션 컨텍스트를 로드한다.

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testUserCreation() throws Exception {
        //given
        UserCreateRequest request = UserCreateRequest.builder()
                .name("양성빈")
                .build();

        // when & then
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.name").value("양성빈"));
    }
}
```
