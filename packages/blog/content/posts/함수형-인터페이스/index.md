---
title: "[자바 고급3] 함수형 인터페이스"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-31 16:59:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 함수형 인터페이스와 제네릭1

함수형 인터페이스도 인터페이스이기 때문에 제네릭을 도입할 수 있다. 먼저 함수형 인터페이스에 제네릭이 필요한 이유를 알아보자. 우리가 제네릭을 공부했을 때 제네릭이 왜 필요한지 그 플로우처럼 똑같이 가보겠다.

``` java
package lambda.lambda3;

public class GenericMain1 {
    public static void main(String[] args) {
        StringFunction upperCase = s -> s.toUpperCase();
        String result1 = upperCase.apply("hello");
        System.out.println("result1 = " + result1);

        NumberFunction square = n -> n * n;
        Integer result2 = square.apply(3);
        System.out.println("result2 = " + result2);
    }

    @FunctionalInterface
    interface StringFunction {
        String apply(String s);
    }

    @FunctionalInterface
    interface NumberFunction {
        Integer apply(Integer n);
    }
}
```

위의 코드처럼 람다를 이용해서 정수를 반환하는 함수형 인터페이스 1개, 숫자를 반환하는 함수형 인터페이스 1개를 만들어서 로직을 작성했다. 하지만 해당 코드의 불편한 점이 존재한다. 바로 새로운 타입을 정의할 때마다 해당 인터페이스를 추가해줘야 한다는 점이다. 즉, 코드 재사용성이 떨어진다. 그러면 어떻게 해결할 수 있을까? 바로 `Object`를 이용하는 것이다.

``` java
package lambda.lambda3;

public class GenericMain2 {
    public static void main(String[] args) {
        ObjectFunction upperCase = s -> ((String) s).toUpperCase();
        String result1 = (String) upperCase.apply("hello");
        System.out.println("result1 = " + result1);

        ObjectFunction square = n -> (Integer) n * (Integer) n;
        Integer result2 = (Integer) square.apply(3);
        System.out.println("result2 = " + result2);
    }

    @FunctionalInterface
    interface ObjectFunction {
        Object apply(Object o);
    }
}
```

`Object`를 이용하니 이제 모든 타입을 하나의 함수형 인터페이스를 활용하여 로직을 작성할 수 있다. 다만, 문제점은 타입 캐스팅을 하나하나 해줘야 한다는 점이다. 즉, 타입 안전성이 떨어진다.

## 함수형 인터페이스와 제네릭2

이제 함수형 인터페이스에 제네릭을 도입해서 코드 재사용도 늘리고, 타입 안전성까지 높여보자.

``` java
package lambda.lambda3;

public class GenericMain4 {
    public static void main(String[] args) {
        GenericFunction<String, String> upperCase = new GenericFunction<String, String>() {
            @Override
            public String apply(String s) {
                return s.toUpperCase();
            }
        };
        String result1 = upperCase.apply("hello");
        System.out.println("result1 = " + result1);

        GenericFunction<Integer, Integer> square = new GenericFunction<Integer, Integer>() {
            @Override
            public Integer apply(Integer s) {
                return s * s;
            }
        };
        Integer result2 = square.apply(3);
        System.out.println("result2 = " + result2);
    }

    @FunctionalInterface
    interface GenericFunction<T, R> {
        R apply(T s);
    }
}
```

함수형 인터페이스에 제네릭을 도입한 덕분에 메서드 `apply()`의 매개변수와 반환 타입을 유연하게 변경할 수 있다. 이제 위의 익명 클래스들을 람다로 변경해보자.

``` java
package lambda.lambda3;

public class GenericMain5 {
    public static void main(String[] args) {
        GenericFunction<String, String> upperCase = String::toUpperCase;
        String result1 = upperCase.apply("hello");
        System.out.println("result1 = " + result1);

        GenericFunction<Integer, Integer> square = s -> s * s;
        Integer result2 = square.apply(3);
        System.out.println("result2 = " + result2);
    }

    @FunctionalInterface
    interface GenericFunction<T, R> {
        R apply(T s);
    }
}
```

`GenericFunction`은 **매개변수가 1개이고, 반환값이 있는 모든 람다에 사용**할 수 있다. 매개변수의 타입과 반환값은 사용시점에 제네릭을 활용해서 얼마든지 변경할 수 있기 때문이다. 제네릭이 도입된 함수형 인터페이스는 재사용성이 매우 높다.

- 제네릭을 사용하면 동일한 구조의 함수형 인터페이스를 다양한 타입에 재사용할 수 있다.
- `T`는 입력 타입을, `R`은 반환 타입을 나타내며, 실제 사용할 때 구체적인 타입을 지정하면 된다.
- 이렇게 제네릭을 활용하면 타입 안정성을 보장하면서도 유연한 코드를 작성할 수 있다.
- 컴파일 시점에 타입 체크가 이루어지므로 런타임 에러를 방지할 수 있다.
- 제네릭을 사용하지 않았다면 각각의 경우에 대해 별도의 함수형 인터페이스를 만들어야 했을 것이다.
- 이는 코드의 중복을 줄이고 유지보수성을 높이는데 큰 도움이 된다.

## 람다와 타겟 타입

우리가 만든 `GenericFunction`은 코드 중복을 줄이고 유지보수성을 높여주지만 2가지 문제가 있다.

- 모든 개발자들이 비슷한 함수형 인터페이스를 개발해야 한다.
- 개발자A가 만든 함수형 인터페이스와 개발자B가 만든 함수형 인터페이스는 서로 호환되지 않는다.
    - 왜냐하면 실제 타입이 다르기 때문이다. 예를들어 개발자A가 만든 함수형 인터페이스 `FunctionA`와 개발자B가 만든 함수형 인터페이스 `FunctionB`는 서로 타입이 다르다. 그런데 `FunctionB b = a;`와 같은 짓을 한다면 컴파일 오류가 발생한다.
    - 그 이유는 단순하다. 서로 타입이 다르기 때문이다. 이런 경우는 마치 `String str = 1;`과 같은 경우라고 보면 좋을 것이다.

### 람다와 타겟 타입

람다는 그 자체만으로는 구체적인 타입이 정해져 있지 않고, **타겟 타입(target type)**이라고 불리는 맥락(대입되는 참조형)에 의해 타입이 결정된다.

``` java
FunctionA functionA = i -> "value = " + i;
```

이 코드에서 `i -> "value = " + i` 라는 람다는 `FunctionA` 라는 타겟 타입을 만나서 비로소 `FunctionA` 타입으로 결정된다. 즉, 람다 자체만으로는 타입이 없다. 해당 람다를 참조하는 참조형 변수의 타입을 보고 그제서야 타입이 결정되는 형태인 것이다.

이렇게 타입이 결정되고 나면 이후에는 다른 타입에 대입하는 것이 불가능하다. 이후 함수형 인터페이스를 다른 함수형 인터페이스에 대입하는 것은 타입이 서로 다르기 때문에, 메서드의 시그니처가 같아도 대입이 되지 않는다.

- 람다는 익명 함수로서 특정 타입을 가지지 않고, 대입되는 참조 변수가 어떤 함수형 인터페이스를 가리키느냐에 따라 타입이 결정된다.
- 한편 이미 대입된 변수(`functionA`)는 엄연히 `FunctionA` 타입의 객체가 되었으므로, 이를 `FunctionB` 참조 변수에 그대로 대입할 수는 없다. 두 인터페이스 이름이 다르기 때문에 자바 컴파일러는 다른 타입으로 간주한다.
- 따라서 시그니처가 똑같은 함수형 인터페이스라도, 타입이 다르면 상호 대입이 되지 않는 것이 자바의 타입 시스템 규칙이다.

### 자바가 기본으로 제공하는 함수형 인터페이스

자바는 이런 문제들을 해결하기 위해 필요한 함수형 인터페이스 대부분을 기본으로 제공한다. 자바가 제공하는 함수형 인터페이스를 사용하면, 비슷한 함수형 인터페이스를 불필요하게 만드는 문제는 물론이고, 함수형 인터페이스의 호환성 문제까지 해결할 수 있다.

``` java
package java.util.function;

@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
    ...
}
```

자바는 `java.util.function` 패키지에 다양한 기본 함수형 인터페이스들을 제공한다. 그럼 예제를 살펴보자.

``` java
package lambda.lambda3;

import java.util.function.Function;

public class TargetType2 {
    public static void main(String[] args) {
        Function<String, String> upperCase = String::toUpperCase;
        String result1 = upperCase.apply("hello");
        System.out.println("result1 = " + result1);

        Function<Integer, Integer> square = n -> n * n;
        Integer result2 = square.apply(3);
        System.out.println("result2 = " + result2);
    }
}
```

우리가 만든 함수형 인터페이스와 같은 기능을 제공한다. 또한 아래와 같이 대입도 같은 타입이라 가능해졌다.

``` java
package lambda.lambda3;

import java.util.function.Function;

public class TargetType3 {
    public static void main(String[] args) {
        Function<Integer, String> functionA = i -> "value = " + i;
        System.out.println(functionA.apply(10));

        Function<Integer, String> functionB = functionA;
        System.out.println(functionB.apply(20));
    }
}
```

**따라서 자바가 기본으로 제공하는 함수형 인터페이스를 사용하자!**

## 기본 함수형 인터페이스

자바가 기본적으로 제공해주는 함수형 인터페이스들을 살펴보자.

### Function

``` java
package java.util.function;

@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

- 하나의 매개변수를 받고, 결과를 반환하는 함수형 인터페이스이다.
- 입력값(`T`)을 받아서 다른 타입의 출력값(`R`)을 반환하는 연산을 표현할 때 사용한다. 물론 같은 타입의 출력 값도 가능하다.
- 일반적인 함수(Function)의 개념에 가장 가깝다.
- 예: 문자열을 받아서 정수로 변환, 객체를 받아서 특정 필드 추출 등

### Consumer

``` java
package java.util.function;

@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

- 입력 값(T)만 받고, 결과를 반환하지 않는(`void`) 연산을 수행하는 함수형 인터페이스이다.
- 입력값(T)을 받아서 처리하지만 결과를 반환하지 않는 연산을 표현할 때 사용한다.
- 입력 받은 데이터를 기반으로 내부적으로 처리만 하는 경우에 유용하다.
    - 예) 컬렉션에 값 추가, 콘솔 출력, 로그 작성, DB 저장 등

### Supplier

``` java
package java.util.function;

@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

- 입력을 받지 않고(`()`) 어떤 데이터를 공급(supply)해주는 함수형 인터페이스이다.
- 객체나 값 생성, 지연 초기화 등에 주로 사용된다.
- 랜덤 값을 제공할 때도 사용한다.

### Runnable

``` java
package java.lang;

@FunctionalInterface
public interface Runnable {
    void run();
}
```

- 입력값도 없고 반환값도 없는 함수형 인터페이스이다. 자바에서는 원래부터 스레드 실행을 위한 인터페이스로 쓰였지만, 자바 8 이후에는 람다식으로도 많이 표현된다. 자바8로 업데이트 되면서 `@FunctionalInterface` 애노테이션도 붙었다.
- `java.lang` 패키지에 있다. 자바의 경우 원래부터 있던 인터페이스는 하위 호환을 위해 그대로 유지한다.
- 주로 멀티스레딩에서 스레드의 작업을 정의할 때 사용한다.
- 입력값도 없고, 반환값도 없는 함수형 인터페이스가 필요할 때 사용한다.

## 특화 함수형 인터페이스

특화 함수형 인터페이스는 의도를 명확하게 만든 조금 특별한 함수형 인터페이스다.

### Predicate

``` java
package java.util.function;

@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);
}
```

- 입력 값(T)을 받아서 `true` 또는 `false`로 구분(판단)하는 함수형 인터페이스이다.
- 조건 검사, 필터링 등의 용도로 많이 사용된다(스트림 API에서 필터 조건을 지정할 때 자주 등장한다.)

#### Predicate가 꼭 필요할까?

`Predicate`는 입력이 `T`, 반환이 `boolean`이기 때문에 결과적으로 `Function<T, Boolean>`으로 대체할 수 있다. 그럼에도 불구하고 `Predicate`를 별도로 만든 이유는 다음과 같다.

- 의미의 명확성
    - `Predicate<T>`를 사용하면 "이 함수는 조건을 검사하거나 필터링 용도로 쓰인다"라는 **의도가 더 분명**해진다.
    - `Function<T, Boolean>`을 쓰면 "이 함수는 무언가를 계산해 `Boolean`을 반환한다"라고 볼 수도 있지만, "조건 검사"라는 목적이 분명히 드러나지 않을 수 있다.
- 가독성 및 유지보수성
    - 여러 사람과 협업하는 프로젝트에서, "조건을 판단하는 함수"는 `Predicate<T>`라는 패턴을 사용함으로써 의미 전달이 명확해진다.
    - `boolean` 판단 로직이 들어가는 부분에서 `Predicate<T>`를 사용하면 코드 가독성과 유지보수성이 향상된다.
        - 이름도 명시적이고, 제네릭에 `<Boolean>` 을 적지 않아도 된다.

### Operator

Operator는 `UnaryOperator`,`BinaryOperator` 2가지 종류가 제공된다.

#### UnaryOperator(단항 연산)

``` java
package java.util.function;

@FunctionalInterface
public interface UnaryOperator<T> extends Function<T, T> {
    T apply(T t);
}
```

- 단항 연산은 **하나의 피연산자(operand)**에 대해 연산을 수행하는 것을 말한다.
    - 예) 숫자의 부호 연산(`-x`), 논리 부정 연산(`!x`) 등
- 입력(피연산자)과 결과(연산 결과)가 **동일한 타입**인 연산을 수행할 때 사용한다.
    - 예) 숫자 5를 입력하고 그 수를 제곱한 결과를 반환한다.
    - 예) `String`을 입력받아 다시 `String`을 반환하면서, 내부적으로 문자열을 대문자로 바꾼다든지, 앞뒤에 추가 문자열을 붙이는 작업을 할 수 있다.
- `Function<T, T>`를 상속받는데, 입력과 반환을 모두 같은 `T`로 고정한다. 따라서 `UnaryOperator`는 입력과 반환 타입이 반드시 같아야 한다.

#### BinaryOperator(이항 연산)

``` java
package java.util.function;

@FunctionalInterface
public interface BinaryOperator<T> extends BiFunction<T,T,T> {
    T apply(T t1, T t2);
}
```

- 이항 연산은 **두 개의 피연산자(operand)**에 대해 연산을 수행하는 것을 말한다.
    - 예: 두 수의 덧셈(`x + y`), 곱셈(`x * y`) 등
- **같은 타입**의 두 입력을 받아, **같은 타입**의 결과를 반환할 때 사용된다.
    - 예) `Integer` 두 개를 받아서 더한 값을 반환
    - 예) `Integer` 두 개를 받아서 둘 중에 더 큰 값을 반환
- `BiFunction<T,T,T>`를 상속받는 방식으로 구현되어 있는데, 입력값 2개와 반환을 모두 같은 T로 고정한다. 따라서 `BinaryOperator`는 모든 입력값과 반환 타입이 반드시 같아야 한다.

#### Operator를 제공하는 이유

- 의도(목적)의 명시성
    - `UnaryOperator<T>`는 입력과 출력 타입이 **동일**한 "단항 연산"을 수행한다는 것을 한눈에 보여준다.
    - `BinaryOperator<T>`는 같은 타입을 **두 개** 입력받아 같은 타입을 결과로 반환하는 "이항 연산"을 수행한다는 것을 명확히 드러낸다.
    - 만약 모두 `Function<T, R>`나 `BiFunction<T, U, R>` 만으로 처리한다면, "타입이 같은 연산"임을 코드만 보고 즉시 파악하기 조금 힘들다.
- 가독성과 유지보수성
    - 코드에 `UnaryOperator<T>`가 등장하면, "이건 단항 연산이구나"를 바로 알 수 있다.
    - `BinaryOperator<T>`의 경우도, "같은 타입 두 개를 받아 같은 타입으로 결과를 내는 연산"이라는 사실이 명확하게 전달된다.
    - 제네릭을 적는 코드의 양도 하나로 줄일 수 있다.
    - 여러 사람이 협업하는 프로젝트에서는 이런 명시성이 **코드 가독성**과 **유지보수성**에 큰 도움이 된다.

## 기타 함수형 인터페이스

### 입력 값이 2개 이상

매개변수가 2개 이상 필요한 경우에는 `BiXxx` 시리즈를 사용하면 된다. Bi는 Binary(이항, 둘)의 줄임말이다.

``` java
package lambda.lambda4;

import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.BiPredicate;

public class BiMain {
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        System.out.println("Sum: " + add.apply(5, 10));

        BiConsumer<String, Integer> repeat = (c, n) -> {
            for (int i = 0; i < n; i++) {
                System.out.print(c);
            }
            System.out.println();
        };
        repeat.accept("*", 5);

        BiPredicate<Integer, Integer> isGreater = (a, b) -> a > b;
        System.out.println("isGreater: " + isGreater.test(10, 5));
    }
}
```

### 입력 값 3개

입력값이 3개라면 `TriXxx` 가 있으면 좋겠지만, 이런 함수형 인터페이스는 기본으로 제공하지 않는다. 보통 함수형 인터페이스를 사용할 때 3개 이상의 매개변수는 잘 사용하지 않기 때문이다. 만약 입력값이 3개일 경우라면 다음과 같이 직접 만들어서 사용하면 된다.

### 기본형 지원 함수형 인터페이스

#### 기본형 지원 함수형 인터페이스가 존재하는 이유

- 오토박싱/언박싱(auto-boxing/unboxing)으로 인한 성능 비용을 줄이기 위해
- 자바 제네릭의 한계(제네릭은 primitive 타입을 직접 다룰 수 없음)를 극복하기 위해
    - 자바의 제네릭은 기본형(primitive) 타입을 직접 다룰 수 없어서, `Function<int, R>`같은 식으로는 선언할 수 없다.

``` java
package lambda.lambda4;

import java.util.function.IntFunction;
import java.util.function.IntToLongFunction;
import java.util.function.IntUnaryOperator;
import java.util.function.ToIntFunction;

public class PrimitiveFunction {
    public static void main(String[] args) {
        IntFunction<String> function = x -> "숫자: " + x;
        System.out.println("function.apply(100) = " + function.apply(100));

        ToIntFunction<String> toIntFunction = s -> s.length();
        System.out.println("toIntFunction = " + toIntFunction.applyAsInt("hello"));

        IntToLongFunction intToLongFunction = x -> x * 100L;
        System.out.println("intToLongFunction = " + intToLongFunction.applyAsLong(10));

        IntUnaryOperator intUnaryOperator = x -> x * 100;
        System.out.println("intUnaryOperator = " + intUnaryOperator.applyAsInt(10));
    }
}
```

- `IntFunction`은 매개변수가 기본형 `int`이다.
- `ToIntFunction`은 반환 타입이 기본형 `int`이다.
- `IntToLongFunction`은 매개변수가 `int`,반환 타입이 `long`이다.
    - `IntToIntFunction`은 없는데, `IntOperator`를 사용하면 된다.
- `IntOperator` : Operator는 매개변수와 반환 타입이 같다. 따라서 이 경우 `int`입력, `int`반환이다.
- `IntConsumer` : 매개변수만 존재한다. `int` 입력
- `IntSupplier` : 반환값만 존재한다. `int` 반환
- `IntPredicate` : 반환값은 `boolean`으로 고정이다. `int` 입력, `boolean` 반환

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!