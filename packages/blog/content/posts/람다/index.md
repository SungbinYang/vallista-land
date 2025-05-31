---
title: "[자바 고급3] 람다"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-31 12:51:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 람다 정의

자바 8부터 도입된 람다는 자바에서 함수형 프로그래밍을 지원하기 위한 핵심 기능이다. 쉽게 이야기 해서 람다는 익명 함수라고 생각하면 좋을 것이다.

메서드나 함수는 보통 아래와 같이 표현하는게 정석이다.

``` java
반환타입 메서드명(매개변수) {
    본문
}
```

하지만 이런 메서드나 함수를 람다는 아래와 같이 간편히 적을 수 있다.

``` java
(매개변수) -> {본문}
```

살펴보면 람다는 메서드 이름이 없는 것을 알 수 있다. 또한 어떤 객체에도 속해져 있지 않는 형태이다. 그래서 우리가 일반적으로 람다를 익명 함수라고 부르는 것이다.

> 자바는 독립적인 함수를 지원하지 않으며, 메서드는 반드시 클래스나 인터페이스에 속한다. 하지만 람다는 겉으로 보기에 그렇지 않아 보여서 익명**함수**라고 부르는 것이다.

> 📚 용어 정리
>
> - **람다**: 익명 함수를 지칭하는 일반적인 용어다. 쉽게 이야기해서 개념이다.
> - **람다식**: (매개변수) -> { 본문 } 형태로 람다를 구현하는 구체적인 문법 표현을 지칭한다.
>
> 쉽게 이야기해서 람다는 개념을, 람다식은 자바에서 그 개념을 구현하는 구체적인 문법을 의미한다.

그럼 람다의 특징을 몇가지 살펴보자.

- 람다는 표현이 간결하다.
    - 익명 클래스를 이용하면 `new` 연산자로 인스턴스를 정의하고 그 안에 메서드를 정의를 해야하지만 람다는 그러지 않아도 된다.
    - 람다를 사용하면 이런 부분을 모두 생략하고, 매개변수와 본문만 적으면 된다.
- 람다는 변수처럼 다룰 수 있다.
    - 람다는 일종의 코드 블록이고 그 코드 블록을 참조형 변수같은 곳에 담을 수 있다.
- 람다도 사실은 익명 클래스처럼 클래스가 만들어지고 인스턴스가 생성이 된다.

``` java
package lambda.lambda1;

import lambda.Procedure;

public class InstanceMain {
    public static void main(String[] args) {
        Procedure procedure1 = new Procedure() {
            @Override
            public void run() {
                System.out.println("hello! lambda");
            }
        };

        System.out.println("class.class = " + procedure1.getClass());
        System.out.println("class.instance = " + procedure1);

        Procedure procedure2 = () -> {
            System.out.println("hello! lambda");
        };

        System.out.println("lambda.class = " + procedure2.getClass());
        System.out.println("lambda.instance = " + procedure2);
    }
}
```

- 익명 클래스의 경우 `$`로 구분하고 뒤에 숫자가 붙는다.
- 람다의 경우 `$$`로 구분하고 뒤에 복잡한 문자가 붙는다.

그럼 지금까지 내용을 한번 정리해보자.

- 람다를 사용하면 익명 클래스 사용의 보일러플레이트 코드를 크게 줄이고, 간결한 코드로 생산성과 가독성을 높일 수 있다.
- 대부분의 익명 클래스는 람다로 대체할 수 있다.
    - 참고로 람다가 익명 클래스를 완전히 대체할 수 있는 것은 아니다.
- 람다를 사용할 때 `new` 키워드를 사용하지 않지만, 람다도 익명 클래스처럼 인스턴스가 생성된다.

## 함수형 인터페이스

**함수형 인터페이스**는 정확히 하나의 추상 메서드를 가지는 인터페이스를 말한다. 람다는 추상 메서드가 하나인 **함수형 인터페이스**에만 사용이 가능하다.

> 단일 추상 메서드를 줄여서 **SAM**(Single Abstract Method)이라 한다.

> ✅ 참고
>
> 람다는 클래스, 추상 클래스에는 할당할 수 없다. 오직 단일 추상 메서드를 가지는 인터페이스에만 할당할 수 있다.

그럼 코드를 통해 함수형 인터페이스에 대해 살펴보자.

``` java
package lambda.lambda1;

public interface NotSamInterface {
    void run();

    void go();
}
```

위의 인터페이스는 추상 메서드가 2개가 존재하는 인터페이스이다. 따라서 SAM이 아니므로 람다 적용이 불가능하다.

``` java
package lambda.lambda1;

public interface SamInterface {
    void run();
}
```

위의 인터페이스는 추상 메서드가 하나만 존재하므로 SAM이다. 따라서 람다 적용이 가능하다. 그럼 해당 인터페이스를 사용하는 `main` 메서드를 작성해보자.

``` java
package lambda.lambda1;

public class SamMain {
    public static void main(String[] args) {
        SamInterface samInterface = () -> {
            System.out.println("sam");
        };

        samInterface.run();

//        NotSamInterface notSamInterface = () -> {
//            System.out.println("not sam");
//        };
//
//        notSamInterface.run();
//        notSamInterface.go();
    }
}
```

만약 위의 코드에 주석을 풀면 컴파일 에러가 발생한다. `NotSamInterface`가 함수형 인터페이스가 아니라는 에러 메세지가 출력이 된다. 그럼 왜 여러 추상 메서드가 정의된 인터페이스는 람다 적용이 불가능할까?

이유는 진짜 단순하다. 람다식을 정의할 때 우리는 코드 블럭 하나만 정의한다. 이 코드 블럭은 일종의 익명 함수라고 하였다. 그런데 만약 인터페이스의 여러 추상 메서드가 정의된다면 람다식으로 정의한 코드블럭이 어느 메서드에 들어가야 하는지 판별이 불가능하다. 따라서 자바에서는 컴파일 타임에 이를 방지해준다.

결론적으로 자바는 이러한 문제를 해결하기 위해, 단 하나의 추상 메서드(SAM: Single Abstract Method)만을 포함하는 **함수형 인터페이스에만 람다를 할당할 수 있도록 제한**했다. `SamInterface`은 `run()`이라는 단 하나의 추상 메서드만을 포함한다. 따라서 문제 없이 람다를 할당하고 실행할 수 있다.

### @FunctionalInterface

함수형 인터페이스는 이를 표기하기 위해 애노테이션을 자바에서 지원해준다. 이는 무슨 역할을 할까? 바로 `@Override`와 유사한 역할을 한다. 상속 관계에서 만약 `@Override`를 붙인 메서드가 부모 타입에 없는 메서드라면 컴파일 타임에 잘못된 재정의 메서드라고 알려준다. `@FunctionalInterface`도 마찬가지다. 이를 인터페이스에 붙일 수 있는데 이 애노테이션을 붙은 인터페이스에 추상 메서드가 여러개면 컴파일 시점에 알려준다.

정리하자면 함수형 인터페이스는 단 하나의 추상 메서드(SAM: Single Abstract Method)만을 포함하는 인터페이스이다. 그리고 람다는 함수형 인터페이스에만 할당할 수 있다. 그런데 단 하나의 추상 메서드만을 포함한다는 것을 어떻게 보장할 수 있을까? `@FunctionalInterface` 애노테이션을 붙여주면 된다. 이 애노테이션이 있으면 단 하나의 추상 메서드가 아니면 컴파일 단계에서 오류가 발생한다. 따라서 함수형 인터페이스임을 보장할 수 있다.

## 람다와 시그니처

람다를 함수형 인터페이스에 할당할 때는 메서드의 형태를 정의하는 요소인 메서드 시그니처가 일치해야 한다. 메서드 시그니처의 주요 구성 요소는 다음과 같다.

- 메서드 이름
- 매개 변수의 수와 타입(순서 포함)
- 반환 타입

그럼 예시코드를 살펴보자.

``` java
package lambda;

@FunctionalInterface
public interface MyFunction {
    int apply(int a, int b);
}
```

위와 같은 함수형 인터페이스가 존재한다고 해보자. 여기서 메서드 시그니쳐는 아래와 같다.

- 메서드 이름: apply
- 매개 변수의 수와 타입(순서 포함): int, int
- 반환 타입: int

그러면 이를 이용한 람다식은 아래와 같을 것이다.

``` java
MyFunction myFunction = (int a, int b) -> {
    return a + b;
};
```

람다식은 익명 함수이므로 메서드 시그니쳐 중 메서드 이름은 제외하고 나머지 2가지만 충족이 되면 되는 것이다.

- 매개 변수의 수와 타입(순서 포함): int, int
- 반환 타입: int

이 람다는 매개변수로 `int a`,`int b` 그리고 반환 값으로 `a + b`인 `int` 타입을 반환하므로 시그니처가 맞다. 따라서 람다를 함수형 인터페이스에 할당할 수 있다.

> ✅ 참고
>
> 람다의 매개변수 이름은 함수형 인터페이스에 있는 메서드 매개변수의 이름과 상관없이 자유롭게 작성해도 된다. 타입과 순서만 맞으면 된다.

## 람다와 생략

람다는 간결한 코드 작성을 위해 다양한 문법 생략을 지원한다.

``` java
package lambda.lambda1;

import lambda.MyFunction;

public class LambdaSimple1 {
    public static void main(String[] args) {
        MyFunction function1 = (int a, int b) -> {
            return a + b;
        };
        System.out.println("function1: " + function1.apply(1, 2));

        MyFunction function2 = (int a, int b) -> a + b;
        System.out.println("function2: " + function2.apply(1, 2));

        MyFunction function3 = (int a, int b) -> {
            System.out.println("람다 실행");
            return a + b;
        };
        System.out.println("function3: " + function3.apply(1, 2));
    }
}
```

위의 코드를 보면 알겠지만 코드의 생략이 가능하다는 것을 볼 수 있다.

``` java
MyFunction function1 = (int a, int b) -> {
    return a + b;
};
```

위의 코드처럼 본문이 1줄인 경우에는 아래와 같이 `return` 키워드와 `{}`를 생략할 수 있다. 즉, `a + b` 와 같이 간단한 단일 표현식은 중괄호(`{}` )와 `return` 을 함께 생략할 수 있다.

``` java
MyFunction function2 = (int a, int b) -> a + b;
```

> 📚 표현식이란?
>
> - 하나의 값으로 평가되는 코드 조각을 의미한다.
> - 표현식은 산술 논리 표현식, 메서드 호출, 객체 생성등이 있다.
> - 표현식이 아닌것은 제어문, 메서드 선언 같은 것이 있다.

그런데 만약 표현식이 여러개면 생략이 불가능하고 `{}`와 `return` 키워드까지 같이 적어줘야 한다.

이번에는 매개변수와 반환 값이 없는 경우를 살펴보자.

``` java
package lambda.lambda1;

import lambda.Procedure;

public class LambdaSimple2 {
    public static void main(String[] args) {
        Procedure procedure1 = () -> {
            System.out.println("hello! lambda");
        };
        procedure1.run();

        Procedure procedure2 = () -> System.out.println("hello! lambda");
        procedure2.run();
    }
}
```

위의 코드를 보면 이제는 알 수 있을 것이다. 표현식이 1개이고 반환타입과 매개변수가 존재하지 않으므로 아래와 같이 생략이 가능하다.

``` java
Procedure procedure2 = () -> System.out.println("hello! lambda");
```

### 타입 추론

``` java
MyFunction function1 = (int a, int b) -> a + b;
```

만약 위와 같은 람다식이 있다고 하자. 해당 람다식에서 더 생략이 가능하다. 바로 타입 추론 기능을 이용하여 매개변수의 타입을 아래처럼 생략할 수 있다.

``` java
MyFunction function1 = (a, b) -> a + b;
```

위의 코드처럼 람다는 타입추론이 가능하다. 자바는 해당 람다식을 볼 때 먼저 참조형 변수 타입을 통해 확인을 한다. 참조형 변수의 타입이 함수형 인터페이스이고 해당 함수형 인터페이스 안에 SAM이 존재하고 SAM에 타입이 명시가 되어 있기 때문에 타입 추론이 가능한 것이다.

> ⚠️ 주의
>
> 만약, 타입 추론을 할 거면 매개변수가 2개가 있다면 전부 해줘야 한다. 몇개는 하고 몇개는 하지 않으면 오류가 발생한다.

### 매개 변수 괄호 생략

``` java
package lambda.lambda1;

public class LambdaSimple4 {
    public static void main(String[] args) {
        MyCall call1 = (int value) -> value * 2;
        MyCall call2 = (value) -> value * 2;
        MyCall call3 = value -> value * 2;

        System.out.println("call3 = " + call3.call(10));
    }

    interface MyCall {
        int call(int value);
    }
}
```

- 매개변수가 정확히 하나이면서, 타입을 생략하고, 이름만 있는 경우 소괄호`()`를 생략할 수 있다.
- 매개변수가 없는 경우에는 `()`가 필수이다.
- 매개변수가 둘 이상이면 `()`가 필수이다.

정리를 하면 람다는 보통 간략하게 사용하는 것을 권장한다. 단일 표현식이면 중괄호와 리턴을 생략하고, 타입 추론을 통해 매개변수의 타입을 생략하자.

## 람다의 전달

람다는 함수형 인터페이스를 통해 변수에 대입하거나, 메서드에 전달하거나 반환할 수 있다.

### 람다를 변수에 대입

``` java
package lambda.lambda2;

import lambda.MyFunction;

public class LambdaPassMain1 {
    public static void main(String[] args) {
        MyFunction add = (a, b) -> a + b;
        MyFunction sub = (a, b) -> a - b;

        System.out.println("add.apply(1, 2) = " + add.apply(1, 2));
        System.out.println("sub.apply(1, 2) = " + sub.apply(1, 2));

        MyFunction cal = add;
        System.out.println("cal(add).apply(1, 2) = " + cal.apply(1, 2));

        cal = sub;
        System.out.println("cal(sub).apply(1, 2) = " + cal.apply(1, 2));
    }
}
```

위의 코드를 보면 알겠지만 람다를 마치 리터럴 값처럼 변수에 대입할 수 있다. 이는 마치 기본형 타입의 값 대입과 참조형 변수의 참조 값 대입과 유사하다. 일단 우리는 람다도 익명함수이기에 참조값을 할당 받는다라고 알면 좋을 것 같다.

### 람다를 메서드(함수)에 전달하기

같은 원리로 람다를 매개변수를 통해 메서드(함수)에 전달할 수 있다.

``` java
package lambda.lambda2;

import lambda.MyFunction;

public class LambdaPassMain2 {
    public static void main(String[] args) {
        MyFunction add = (a, b) -> a + b;
        MyFunction sub = (a, b) -> a - b;

        System.out.println("변수를 통해 전달");
        calculate(add);
        calculate(sub);

        System.out.println("람다를 직접 전달");
        calculate((a, b) -> a + b);
        calculate((a, b) -> a - b);
    }

    static void calculate(MyFunction function) {
        int a = 1;
        int b = 2;

        System.out.println("계산 시작");
        int result = function.apply(a, b);
        System.out.println("계산 결과: " + result);
    }
}
```

함수형 인터페이스를 매개변수로 하여 변수에 대입한 람다를 파라미터로 전달할 수 있고 람다를 직접 전달 할 수 있다. 자바스크립트를 알고 계신 독자분들이라면 뭔가 많이 친숙할 것이다. 이런 점을 자바는 람다로 지원을 해주는 것이다.

### 람다 반환

``` java
package lambda.lambda2;

import lambda.MyFunction;

public class LambdaPassMain3 {
    public static void main(String[] args) {
        MyFunction add = getOperation("add");
        System.out.println("add.apply(1, 2) = " + add.apply(1, 2));

        MyFunction sub = getOperation("sub");
        System.out.println("sub.apply(1, 2) = " + sub.apply(1, 2));

        MyFunction xxx = getOperation("xxx");
        System.out.println("xxx.apply(1, 2) = " + xxx.apply(1, 2));
    }

    static MyFunction getOperation(String operator) {
        return switch (operator) {
            case "add" -> (a, b) -> a + b;
            case "sub" -> (a, b) -> a - b;
            default -> (a, b) -> 0;
        };
    }
}
```

위의 코드처럼 함수형 인터페이스를 반환타입으로 하여 람다를 반환할 수 있다.

## 고차 함수

람다는 함수형 인터페이스를 구현한 익명 클래스 인스턴스와 같은 개념으로 이해하면 된다. 즉, 람다를 변수에 대입한다는 것은 **람다 인스턴스의 참조값을 대입**하는 것이고, 람다를 메서드(함수)의 매개변수나 반환값으로 넘긴다는 것 역시 **람다 인스턴스의 참조값을 전달, 반환**하는 것이다.

- 람다 변수 대입: 함수형 인터페이스 타입의 변수에 람다 인스턴스의 참조를 대입할 수 있다.
- 람다 메서드 매개변수에 전달: 메서드 호출 시 람다 인스턴스의 참조를 직접 넘기거나, 이미 람다 인스턴스를 담고 있는 변수를 전달한다.
- 람다를 메서드 반환타입으로 반환: 함수형 인터페이스 타입을 반환값으로 지정해 람다 인스턴스의 참조를 돌려줄 수 있다.

### 고차 함수

고차 함수는 함수를 값처럼 다루는 함수를 뜻한다. 일반적으로 다음 두 가지 중 하나를 만족하면 고차 함수라 한다.

- 함수를 인자로 받는 함수(메서드)
- 함수를 반환하는 함수(메서드)

즉 아래와 같은 메서드를 고차 함수라고 부른다.

``` java
static MyFunction calculate(MyFunction function) {
    return (a, b) -> a + b;
}
```

- 매개변수나 반환값에 함수(또는 람다)를 활용하는 함수가 고차 함수에 해당한다.
- 자바에서 람다(익명 함수)는 함수형 인터페이스를 통해서만 전달할 수 있다.
- **자바에서 함수를 주고받는다는 것**은 "함수형 인터페이스를 구현한 어떤 객체(람다든 익명 클래스든)를 주고받는 것"과 동의어이다. (함수형 인터페이스는 인터페이스이므로 익명 클래스, 람다 둘다 대입할 수 있다. 하지만 실질적으로 함수형 인터페이스에는 람다를 주로 사용한다.)

> 📚 용어 정리
>
> **고차 함수(Higher-Order Function)**라는 이름은 **함수를 다루는 추상화 수준**이 더 높다는 데에서 유래했다.
> - 보통의 (일반적인) 함수는 **데이터(값)**를 입력으로 받고, 값을 반환한다.
> - 이에 반해, 고차 함수는 **함수를 인자로 받거나 함수를 반환**한다.
> - 쉽게 이야기하면 일반 함수는 값을 다루지만, 고차 함수는 함수 자체를 다룬다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!