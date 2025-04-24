---
title: "[자바 기본] 패키지"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-24 22:44:27
series: 자바 기본
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/PuC6W)를 바탕으로 쓰여진 글입니다.

## 패키지 - 시작

우리가 간단한 어플리케이션을 만들 때는 파일 개수도 적고 해서 그냥 쭉 나열해서 생성해서 사용하면 된다. 하지만 대규모 어플리케이션을 만들 때는 파일 수도 많아지고 나중에는 어느 파일이 있는지 조차 파악하기 힘들다. 우리 컴퓨터 바탕화면에도 수 많은 파일이 있으면 찾기 힘든 것처럼 말이다. 그럴 때 우리는 폴더나 디렉토리를 만들어서 파일을 정리한다. 자바도 이런 폴더같은 개념을 지원하는데 그것이 바로 **패키지**이다.

### 패키지 사용

패키지를 사용법은 이전에 코드를 작성하면서 눈치를 챈 분도 있을 것이다. 그래도 한번 살펴보자. pack이라는 패키지를 만들고 그 안에 클래스를 만들어보자.

``` java
package pack;

public class Data {

    public Data() {
        System.out.println("패키지 pack Data 생성");
    }
}
```

패키지를 사용하는 경우 항상 코드 첫줄에 `package pack;`과 같은 패키지 이름을 제일 상단에 적어줘야 한다. 만약 이름이 다르거나 안 적어주면 자바에서 컴파일 에러가 나온다.

다음으로 pack 패키지 하위에 a라는 패키지를 만들어서 클래스를 만들어 보자.

``` java
package pack.a;

public class User {

    public User() {
        System.out.println("패키지 pack.a 회원 생성");
    }
}
```

위와 같이 패키지 하위 표시는 `.`으로 구분한다. 그런데 사실 우리는 이것을 크게 신경을 안 써도 되기는 하다. 왜냐하면 IDE에서 잘 만들어 주기 때문이다.

그러면 이제 pack 하위에 클래스를 만들고 위에서 만든 클래스를 사용해보자.

``` java
package pack;

public class PackageMain1 {
    public static void main(String[] args) {
        Data data = new Data();
        pack.a.User user = new pack.a.User();
    }
}
```

이렇게 사용하는 쪽에서 같은 위치의 클래스는 그냥 우리가 일반적으로 사용하 듯이 사용하면 된다. 하지만 다른 위치는 이렇게 `패키지명.클래스명`으로 작성하면 된다.

## 패키지 - import

패키지가 다르다고 항상 전체 경로를 적어주는 것은 불편하다. 이때는 `import` 를 사용하면 된다.

이전의 코드를 `import`를 사용해서 고쳐보자.

``` java
package pack;

import pack.a.User;

public class PackageMain1 {
    public static void main(String[] args) {
        Data data = new Data();
        User user = new User();
    }
}
```

이렇게 하니, 정말 깔끔해졌다. 물론, pack.a안에 다양한 클래스들이 존재하고 이 클래스들을 다 사용한다면 일일이 import를 할 께 아니라 아래와 같이 해주면 된다. 실무에서 사용하는 예시로 들어보자.

``` java
package com.mogakco.domain.member.controller;

import com.mogakco.domain.member.model.request.*;
import com.mogakco.global.controller.BaseControllerTest;
import com.mogakco.global.exception.GlobalExceptionCode;
import com.mogakco.global.util.redis.RedisUtil;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.util.stream.Stream;

import static com.mogakco.global.util.TestAuthUtil.performLoginAndGetCookies;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.http.HttpHeaders.SET_COOKIE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest extends BaseControllerTest {

    @Autowired
    private RedisUtil redisUtil;

    @AfterEach
    void after() {
        this.redisUtil.deleteAllData();
    }

    @Test
    @DisplayName("회원가입 통합 테스트 - 실패(잘못된 입력값)")
    void member_signup_integration_test_fail_caused_by_wrong_input() throws Exception {
        MemberSignupRequestDto requestDto = new MemberSignupRequestDto("김", "r", "email...", "1234", "12345", "010", LocalDate.of(2028, 1, 1));

        this.mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON + ";charset=UTF-8")
                        .accept(MediaType.APPLICATION_JSON + ";charset=UTF-8")
                        .content(this.objectMapper.writeValueAsString(requestDto)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("message").exists())
                .andExpect(jsonPath("status").value(GlobalExceptionCode.INVALID_REQUEST_PARAMETER.getHttpStatus().name()))
                .andExpect(jsonPath("code").value(GlobalExceptionCode.INVALID_REQUEST_PARAMETER.getCode()))
                .andExpect(jsonPath("errors").exists())
                .andExpect(jsonPath("errors").isNotEmpty())
                .andExpect(jsonPath("timestamp").exists());
    }

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
}
```

위의 코드는 테스트 코드를 가져온 것인데 이렇게만 봐도 `import`사용법은 마스터 할 수 있을 것이다.

### 클래스 이름 중복

패키지 덕분에 클래스 이름이 같아도 패키지 이름으로 구분해서 같은 이름의 클래스를 사용할 수 있다. 그런데 서로 다른 패키지의 같은 이름의 클래스를 사용할 때는 어떻게 해야 할까? 아래와 같이 해주면 된다. pack.a에 User와 pack.b의 User를 사용한다고 해보자.

``` java
package pack;

import pack.a.User;

public class PackageMain3 {
    public static void main(String[] args) {
        User userA = new User();
        pack.b.User userB = new pack.b.User();
    }
}
```

하나를 import를 해주면 다른 하나는 전체 패키지 경로를 작성해야 한다. 이럴 경우가 흔하지는 않지만 가끔 일어나면 실무에서는 주로 자주 사용하는 클래스를 import하고 자주 사용하지 않는 것은 풀패키지를 적어준다.

## 패키지 규칙

- 패키지의 이름과 위치는 폴더(디렉토리) 위치와 같아야 한다. (필수)
- 패키지 이름은 모두 소문자를 사용한다. (관례)
- 패키지 이름의 앞 부분에는 일반적으로 회사의 도메인 이름을 거꾸로 사용한다. 예를 들어, `com.company.myapp` 과 같이 사용한다. (관례)
    - 이 부분은 필수는 아니다. 하지만 수 많은 외부 라이브러리가 함께 사용되면 같은 패키지에 같은 클래스 이름이 존재할 수도 있다. 이렇게 도메인 이름을 거꾸로 사용하면 이런 문제를 방지할 수 있다.
    - 내가 오픈소스나 라이브러리를 만들어서 외부에 제공한다면 꼭 지키는 것이 좋다.
    - 내가 만든 애플리케이션을 다른 곳에 공유하지 않고, 직접 배포한다면 보통 문제가 되지 않는다.

### 패키지와 계층 구조

- a
    - b
    - c

위와 같은 패키지 구조가 있다고 하자. 이 경우 패키지의 개수는 총 몇개일까? 보통은 2개라고 착각하지만 정답은 3개이다. `a`, `a.b`, `a.c` 패키지가 존재한다. 서로 다른 패키지 간에 클래스를 사용하려면 import를 해줘야 한다. `a.b`가 `a`안에 있는 클래스를 써도 import를 해야하고 그 반대도 마찬가지다.

## 패키지 활용

실제 패키지는 어떻게 사용될까? 정말 직방으로 아는 방법은 오픈소스 프레임워크인 [스프링 프레임워크](https://github.com/spring-projects/spring-framework)를 보는게 직방이다. 하지만 [필자가 예전에 작성한 코드](https://github.com/crispindeity/warming-up-study-mini/tree/main/sungbin/mini)도 보여주면 좋을 것 같아서 공개한다. 필자가 작성한 방식을 DDD 아키텍쳐 방식이라고 한다. 이 외에도 **헥사고날 아키텍쳐**, **MSA**등 다양한 구조가 존재한다. 해당 개념은 너무 깊어서 해당 포스팅에는 따로 다루지는 않겠지만 궁금하면 한번 구글링을 통해 알아보자.

결론적으로 말하면 패키지를 구성할 때 서로 관련된 클래스는 하나의 패키지에 모으고, 관련이 적은 클래스는 다른 패키지로 분리하는 것이 좋다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!