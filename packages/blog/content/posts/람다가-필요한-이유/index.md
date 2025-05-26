---
title: "[자바 고급3] 람다가 필요한 이유"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-26 17:11:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 프로젝트 환경 구성

프로젝트 환경 구성은 필자가 쓴 [자바 입문편 내용](https://sungbin.kr/Hello-World/#%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95)을 참고 바란다.

## 람다가 필요한 이유1

람다를 본격적으로 학습하기 전에, 먼저 람다가 필요한 이유에 대해서 알아보자. 람다를 이해하려면 먼저 내부 클래스에 대한 개념을 확실히 알아두어야 한다. 혹시 까먹었다면 강의를 다시 듣거나 [필자의 포스팅](https://sungbin.kr/중첩-클래스-내부-클래스1/)을 참고 바란다.

그럼 간단한 코드로 먼저 시작해보겠다. 아래와 같이 코드가 있다고 하자.

``` java
package lambda.start;

public class Ex0Main {
    public static void main(String[] args) {
        helloJava();
        helloSpring();
    }

    public static void helloJava() {
        System.out.println("프로그램 시작");
        System.out.println("Hello Java");
        System.out.println("프로그램 종료");
    }

    public static void helloSpring() {
        System.out.println("프로그램 시작");
        System.out.println("Hello Spring");
        System.out.println("프로그램 종료");
    }
}
```

이제 독자들은 딱 알 것이다. 코드의 중복이 보이니 막 리팩토링하고 싶은 욕구가 생길 것이다. 그럼 리팩토링을 진행해보자.

``` java
package lambda.start;

public class Ex0RefMain {
    public static void main(String[] args) {
        hello("hello Java");
        hello("hello Spring");
    }

    public static void hello(String str) {
        System.out.println("프로그램 시작");
        System.out.println(str);
        System.out.println("프로그램 종료");
    }
}
```

우리는 위와 같이 리팩토링을 진행하면서 중복되는 부분과 변하는 부분을 분리하여서 리팩토링 작업을 진행했을 것이다. 위의 코드에서는 "hello java"같은 문자열이 변하는 부분이다. 그래서 해당 부분을 외부에서 전달받기로 진행하였다. 이렇게 변하는 부분과 변하지 않는 부분을 분리하고, 변하는 부분을 외부에서 전달 받으면, 메서드(함수)의 재사용성을 높일 수 있다.

### 값 매개변수화(Value Parameterization)

이전 코드에서 변하는 것들은 "hello Java"와 같은 문자열이다. 문자값(**Value**), 숫자값(**Value**)처럼 구체적인 값을 메서드(함수) 안에 두는 것이 아니라, **매개변수**(파라미터)를 통해 외부에서 전달 받도록 해서, 메서드의 동작을 달리하고, 재사용성을 높이는 방법을 **값 매개변수화(Value Parameterization)**라 한다.

## 람다가 필요한 이유2

그럼 이제 비슷한 예제를 하나 더 보자.

``` java
package lambda.start;

import java.util.Random;

public class Ex1Main {
    public static void main(String[] args) {
        helloDice();
        helloSum();
    }

    public static void helloDice() {
        long startNs = System.nanoTime();

        int randomValue = new Random().nextInt(6) + 1;
        System.out.println("주사위 = " + randomValue);

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }

    public static void helloSum() {
        long startNs = System.nanoTime();

        for (int i = 1; i <= 3; i++) {
            System.out.println("i = " + i);
        }

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }
}
```

여기서 공통적인 부분은 성능 측정 로직이고 그 외의 비즈니스 로직이 다른 부분이다. 이 비즈니스 로직을 외부로부터 주입받으면 좋을 것 같은데 어떻게 주입을 받을 수 있을까? 한번 다형성의 원리로 풀어보자.

``` java
package lambda;

public interface Procedure {
    void run();
}
```

위와 같이 인터페이스를 하나 정의하고

``` java
package lambda.start;

import lambda.Procedure;

import java.util.Random;

public class Ex1RefMain {
    public static void main(String[] args) {
        Procedure dice = new Dice();
        Procedure sum = new Sum();

        hello(dice);
        hello(sum);
    }

    public static void hello(Procedure procedure) {
        long startNs = System.nanoTime();

        procedure.run();

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }

    static class Dice implements Procedure {

        @Override
        public void run() {
            int randomValue = new Random().nextInt(6) + 1;
            System.out.println("주사위 = " + randomValue);
        }
    }

    static class Sum implements Procedure {

        @Override
        public void run() {
            for (int i = 1; i <= 3; i++) {
                System.out.println("i = " + i);
            }
        }
    }
}
```

정적 중첩 클래스를 정의하여 정의한 인테페이스를 구현받아 해당 부분에 비즈니스 로직을 구현하고 인터페이스를 파라미터로 받아 로직을 수행하게끔 구현하였다. 즉, 비즈니스 로직은 보통 메서드(함수)에 정의한다. 따라서 비즈니스 로직을 전달하기 위해서는 메서드가 필요하다. 그런데 지금까지 학습한 내용으로는 메서드만 전달할 수 있는 방법이 없다. 대신에 인스턴스를 전달하고, 인스턴스에 있는 메서드를 호출하면 된다.

정리하면 문자열, 숫자 같은 값 데이터를 메서드에 전달할 때는 `String`,`int`와 같은 각 데이터에 맞는 값을 전달하면 된다. 비즈니스 로직을 메서드에 전달할 때는 인스턴스를 전달하고 해당 인스턴스에 있는 메서드를 호출하면 된다.

### 동작 매개변수화(Behavior Parameterization)

#### 값 매개변수화

- 문자값(**Value**), 숫자값(**Value**)처럼 구체적인 값을 메서드(함수) 안에 두는 것이 아니라, **매개변수**(파라미터)를 통해 외부에서 전달 받도록 해서, 메서드의 동작을 달리하고, 재사용성을 높이는 방법을 **값 매개변수화**라 한다.
- 값 매개변수화, 값 파라미터화 등으로 부른다.

#### 동작 매개변수화

- 코드 조각(코드의 동작 방법, 로직, **Behavior**)을 메서드(함수) 안에 두는 것이 아니라, **매개변수**(파라미터)를 통해서 외부에서 전달 받도록 해서, 메서드의 동작을 달리하고, 재사용성을 높이는 방법을 동작 매개변수화라 한다.
- 동작 매개변수화, 동작 파라미터화, 행동 매개변수화(파라미터화), 행위 파라미터화 등으로 부른다.

그런데 값 매개변수화에 비해 동작 매개변수화는 인스턴스를 생성하고 해당 인스턴스의 메서드를 호출해야한다는 단계가 너무 까다롭다. 다른 방법이 없을까? 바로 익명 클래스로 사용하면 더 효과적일 것이다.

## 람다가 필요한 이유3

이번에는 익명 클래스를 사용해서 위의 예제 코드를 리팩토링 해보자.

``` java
package lambda.start;

import lambda.Procedure;

import java.util.Random;

public class Ex1RefMainV2 {
    public static void main(String[] args) {
        Procedure dice = new Procedure() {
            @Override
            public void run() {
                int randomValue = new Random().nextInt(6) + 1;
                System.out.println("주사위 = " + randomValue);
            }
        };

        Procedure sum = new Procedure() {
            @Override
            public void run() {
                for (int i = 1; i <= 3; i++) {
                    System.out.println("i = " + i);
                }
            }
        };

        hello(dice);
        hello(sum);
    }

    public static void hello(Procedure procedure) {
        long startNs = System.nanoTime();

        procedure.run();

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }
}
```

그런데 위의 코드의 변수를 따로 뽑을 필요가 없다. 익명 클래스의 참조값을 지역 변수에 담아둘 필요 없이, 매개변수에 직접 전달해보자.

``` java
package lambda.start;

import lambda.Procedure;

import java.util.Random;

public class Ex1RefMainV3 {
    public static void main(String[] args) {
        hello(new Procedure() {
            @Override
            public void run() {
                int randomValue = new Random().nextInt(6) + 1;
                System.out.println("주사위 = " + randomValue);
            }
        });

        hello(new Procedure() {
            @Override
            public void run() {
                for (int i = 1; i <= 3; i++) {
                    System.out.println("i = " + i);
                }
            }
        });
    }

    public static void hello(Procedure procedure) {
        long startNs = System.nanoTime();

        procedure.run();

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }
}
```

### 람다(lambda)

자바에서 메서드의 매개변수에 인수로 전달할 수 있는 것은 크게 2가지이다.

- `int`,`double`과 같은 기본형 타입
- `Procedure`, `Member`와 같은 참조형 타입(인스턴스)

결국 메서드에 인수로 전달할 수 있는 것은 간단한 값이나, 인스턴스의 참조이다.

그런데 이런 과정은 매우 복잡하다. 인스턴스 생성 후 그 참조값을 인스턴스에 넘기는게 너무 불편하다. 그냥 로직만 넘길 수 없을까? 자바8에 들어서면서 큰 변화가 있었는데, 바로 람다는 것을 통해 코드 블럭을 인수로 전달할 수 있게 되었다. 다음 코드로 확인해보자.

``` java
package lambda.start;

import lambda.Procedure;

import java.util.Random;

public class Ex1RefMainV4 {
    public static void main(String[] args) {
        hello(() -> {
            int randomValue = new Random().nextInt(6) + 1;
            System.out.println("주사위 = " + randomValue);
        });

        hello(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println("i = " + i);
            }
        });
    }

    public static void hello(Procedure procedure) {
        long startNs = System.nanoTime();

        procedure.run();

        long endNs = System.nanoTime();

        System.out.println("실행 시간: " + (endNs - startNs) + " ns");
    }
}
```

- `() -> {...}` 부분이 람다를 사용한 코드이다.
- 람다를 사용한 코드를 보면 클래스나 인스턴스를 정의하지 않고, 매우 간편하게 코드 블럭을 직접 정의하고, 전달하는 것을 확인할 수 있다.

이제 본격적으로 람다를 학습해보자.

## 함수 vs 메서드

함수(Function)와 메서드(Method)는 둘 다 어떤 작업(로직)을 수행하는 코드의 묶음이다. 하지만 일반적으로 **객체지향 프로그래밍(OOP)** 관점에서 다음과 같은 차이가 있다. 예시를 살펴보자.

### 예시

#### C언어

``` c
// C에서는 클래스나 객체가 없으므로, 모든 것이 함수
int add(int x, int y) {
    return x + y;
}
```

#### Java

``` java
// 자바에서는 클래스 내부에 함수를 정의 -> 메서드
public class Calculator {
    // 인스턴스 메서드
    public int add(int x, int y) {
        return x + y;
    }
}
```

#### Python

``` python
# 함수: 클래스 밖에서 독립적으로 정의
def add(x, y):
    return x + y

# 메서드: 클래스(객체) 내부에 정의
class Calculator:
    def add(self, x, y):
        return x + y

# 사용 예
print(add(2, 3)) # 함수 호출

cal = Calculator()
print(cal.add(2, 3)) # 메서드 호출
```

### 객체(클래스)와의 관계

- 함수
    - 독립적으로 존재하며, 클래스(객체)와 직접적인 연관이 없다.
    - 객체지향 언어가 아닌 C 등의 절차적 언어에서는 모든 로직이 함수 단위로 구성된다.
    - 객체지향 언어라 하더라도, 예를 들어 Python이나 JavaScript처럼 클래스 밖에서도 정의할 수 있는 "함수" 개념을 지원하는 경우, 이를 그냥 함수라고 부른다.
- 메서드
    - 클래스(또는 객체)에 속해 있는 "함수"이다.
    - 객체의 상태(필드, 프로퍼티 등)에 직접 접근하거나, 객체가 제공해야 할 기능을 구현할 수 있다.
    - Java, C++, C#, Python 등 대부분의 객체지향 언어에서 **클래스 내부에 정의된 함수**는 보통 "메서드"라고 부른다.

### 호출방식과 스코프

- 함수
    - 호출 시에 객체 인스턴스가 필요 없다.
    - 보통 `이름(매개변수)` 형태로 호출된다.
    - 지역 변수, 전역 변수 등과 함께 동작하며, 클래스나 객체 특유의 속성(인스턴스 변수 등)은 다루지 못한다.
- 메서드
    - 보통 `객체(인스턴스).메서드이름(매개변수)` 형태로 호출한다.
    - 호출될 때, 해당 객체의 필드(속성)나 다른 메서드에 접근 가능하며, 이를 이용해 로직을 수행한다.
    - 인스턴스 메서드, 클래스(정적) 메서드, 추상 메서드 등 다양한 형태가 있을 수 있다.

즉, 메서드는 기본적으로 객체와 관련이 있으며 클래스 내부의 함수라고 보면 된다. 반면, 함수는 클래스와 상관없이 독립적으로 호출할 수 있는 단위이다.

## 람다 시작

이론적인 부분을 알아보기 전에 간단히 익명 클래스와 람다를 코드로 만들어보자.

``` java
package lambda.lambda1;

import lambda.Procedure;

public class ProcedureMain1 {
    public static void main(String[] args) {
        Procedure procedure = new Procedure() {
            @Override
            public void run() {
                System.out.println("hello! lambda");
            }
        };

        procedure.run();
    }
}
```

위의 매개변수가 없는 익명 클래스 예제는 다음과 같이 람다로 작성할 수 있다.

``` java
package lambda.lambda1;

import lambda.Procedure;

public class ProcedureMain2 {
    public static void main(String[] args) {
        Procedure procedure = () -> System.out.println("hello! lambda");

        procedure.run();
    }
}
```

- 람다는 `() -> {}`와 같이 표현한다. `()` 부분이 메서드의 매개변수라 생각하면 되고, `{}` 부분이 코드 조각이 들어가는 본문이다.
- 람다를 사용할 때는 이름, 반환 타입은 생략하고, 매개변수와 본문만 간단하게 적으면 된다.
    - `(매개변수) -> { 본문 }` , 여기서는 매개변수가 없으므로 `() -> {본문}`
    - 심지어 본문이 1줄이면 `{}`도 생략 가능하다.
- 쉽게 이야기해서 익명 클래스를 만들기 위한 모든 부분을 생략하고, 꼭 필요한 매개변수와 본문만 작성하면 된다.
- 즉, 익명 클래스에 비해 매우 간편해졌다.

그러면 파라미터가 있고 반환 값이 있는 부분을 익명 클래스에서 람다로 변경해보겠다.

``` java
package lambda;

public interface MyFunction {
    int apply(int a, int b);
}
```

파라미터가 있고 반환 타입이 있는 인터페이스를 정의하였다. 이제 이 인터페이스를 이용하여 익명클래스를 만들어 보자.

``` java
package lambda.lambda1;

import lambda.MyFunction;

public class MyFunctionMain1 {
    public static void main(String[] args) {
        MyFunction myFunction = new MyFunction() {
            @Override
            public int apply(int a, int b) {
                return a + b;
            }
        };

        int result = myFunction.apply(1, 2);
        System.out.println("result = " + result);
    }
}
```

이제 위의 코드를 람다로 변경해보자.

``` java
package lambda.lambda1;

import lambda.MyFunction;

public class MyFunctionMain2 {
    public static void main(String[] args) {
        MyFunction myFunction = (a, b) -> a + b;

        int result = myFunction.apply(1, 2);
        System.out.println("result = " + result);
    }
}
```

- 람다는 `() -> {}`와 같이 표현한다.
- 람다를 사용할 때는 이름, 반환 타입은 생략하고, 매개변수와 본문만 간단하게 적으면 된다.
- 이번에는 매개변수가 있으므로 `(int a, int b) -> {본문}`과 같이 작성하면 된다.
- 여기서도 본문이 1줄이라 `{}`를 생략할 수 있다.
- 해당 코드에서는 나중에 배울 **메서드 레퍼런스** 개념을 도입할 수 있다. 메서드 레퍼런스를 이용하면 위의 코드가 아래처럼 더욱 간결해진다.

``` java
package lambda.lambda1;

import lambda.MyFunction;

public class MyFunctionMain2 {
    public static void main(String[] args) {
        MyFunction myFunction = Integer::sum;

        int result = myFunction.apply(1, 2);
        System.out.println("result = " + result);
    }
}
```

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!