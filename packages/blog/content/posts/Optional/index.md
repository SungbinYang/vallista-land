---
title: "[자바 고급3] Optional"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-02 21:18:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 옵셔널이 필요한 이유

### NullPointerException(NPE) 문제

- 자바에서 `null`은 "값이 없음"을 표현하는 가장 기본적인 방법이다.
- 하지만 `null`을 잘못 사용하거나 `null` 참조에 대해 메서드를 호출하면 `NullPointerException`(NPE)이 발생하여 프로그램이 예기치 않게 종료될 수 있다.
- 특히 여러 메서드가 연쇄적으로 호출되어 내부에서 `null` 체크가 누락되면, 추적하기 어렵고 디버깅 비용이 증가 한다.

### 가독성 저하

- `null`을 반환하거나 사용하게 되면, 코드를 작성할 때마다 `null` 체크를 계속 확인해줘야 한다.
- 이러한 `null` 체크 로직이 누적되면 코드가 복잡해지고 가독성이 떨어진다.

### 의도가 드러나지 않음

- 메서드 시그니처만 보고서는 이 메서드가 `null`을 반환할 수도 있다는 사실을 명확히 알기 어렵다.
- 호출하는 입장에서는 "반드시 값이 존재할 것"이라고 가정했다가, 런타임에 `null`이 나와서 문제가 생길 수 있다.

### Optional 등장

- 이러한 문제를 해결하고자 자바 8부터 `Optional` 클래스를 도입했다.
- `Optional`은 "값이 있을 수도 있고 없을 수도 있음"을 명시적으로 표현해주어, 메서드의 계약(Contract)이나 호출 의도를 좀 더 분명하게 드러낸다.
- `Optional`을 사용하면 "빈 값"을 표현할 때, 더 이상 `null` 자체를 넘겨주지 않고 `Optional.empty()`처럼 의도를 드러내는 객체를 사용할 수 있다.
- 그 결과, `Optional` 을 사용하면 `null` 체크 로직을 간결하게 만들고, 특정 경우에 NPE가 발생할 수 있는 부분을 빌드 타임이나 IDE, 코드 리뷰에서 더 쉽게 파악할 수 있게 해준다.

그럼 `Optional`을 사용하지 않았을 때 예제와 사용한 예제를 비교해보면서 알아가보자.

``` java
package optional;

import java.util.HashMap;
import java.util.Map;

public class OptionalStartMain1 {

    private static final Map<Long, String> map = new HashMap<>();

    static {
        map.put(1L, "Kim");
        map.put(2L, "Seo");
    }

    public static void main(String[] args) {
        findAndPrint(1L);
        findAndPrint(3L);
    }

    private static void findAndPrint(Long id) {
        String name = findNameById(id);
//        System.out.println("name = " + name.toUpperCase());

        if (name != null) {
            System.out.println(id + ": " + name.toUpperCase());
        } else {
            System.out.println(id + ": " + "UNKNOWN");
        }
    }

    private static String findNameById(Long id) {
        return map.get(id);
    }
}
```

위의 코드를 보면 `map`에 존재하지 않는 id를 통해 이름을 얻을 수 있기에 `null` 위험이 있다. 그래서 `NPE` 발생 우려가 존재한다. 또한 가독성도 매우 떨어지게 된다. 위의 코드를 한번 `Optional`을 적용해보자.

``` java
package optional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class OptionalStartMain2 {

    private static final Map<Long, String> map = new HashMap<>();

    static {
        map.put(1L, "Kim");
        map.put(2L, "Seo");
    }

    public static void main(String[] args) {
        findAndPrint(1L);
        findAndPrint(3L);
    }

    private static void findAndPrint(Long id) {
        Optional<String> optName = findNameById(id);
        String name = optName.orElse("UNKNOWN");
        System.out.println(id + ": " + name.toUpperCase());
    }

    private static Optional<String> findNameById(Long id) {
        String findName = map.get(id);
        Optional<String> optName = Optional.ofNullable(findName);

        return optName;
    }
}
```

위의 코드는 `findNameById`에서 `String`타입을 반환하는 것이 아닌 `Option<String>`을 반환시켰다. `Optional.ofNullable(findId)`를 통해 `null`이 될 수도 있는 값을 `Optional`로 감싼다. 그러면 개발자가 눈으로 보더라도 이 부분은 `null`일 확률이 있겠구나라고 생각하고 로직을 작성할 것이다.

> `Optional.orElse("대체값")` : 옵셔널에 값이 있으면 해당 값을 반환하고, 값이 없다면 대체값을 반환한다.

이 방식은 "값이 없을 수도 있다"는 점을 호출하는 측에 명확히 전달하므로, 놓치기 쉬운 `null` 체크를 강제하고 코드의 안정성을 높인다.

### Optional 소개

- 이 방식은 "값이 없을 수도 있다"는 점을 호출하는 측에 명확히 전달하므로, 놓치기 쉬운 `null` 체크를 강제하고 코드의 안정성을 높인다.
- 내부적으로 `null`을 직접 다루는 대신, `Optional` 객체에 감싸서 `Optional.empty()` 또는 `Optional.of(value)` 형태로 다룬다.

> ✅ 참고
>
> - `Optional`은 "값이 없을 수도 있다"는 상황을 반환할 때 주로 사용된다.
> - "항상 값이 있어야 하는 상황"에서는 `Optional`을 사용할 필요 없이 그냥 해당 타입을 바로 사용하거나 예외를 던지는 방식이 더 좋을 수 있다.

## Optional의 생성과 값 획득

### Optional 생성 방법

- `Optional.of(T value)`
    - 내부 값이 확실히 `null`이 아닐 때 사용. `null`을 전달하면 `NullPointerException` 발생
- `Optional.ofNullable(T value)`
    - 값이 `null`일 수도 있고 아닐 수도 있을 때 사용. `null`이면 `Optional.empty()`를 반환한다.
- `Optional.empty()`
    - 명시적으로 "값이 없음"을 표현할 때 사용

### Optional 값 획득

- `isPresent()`,`isEmpty()`
    - 값이 있으면 `true`
    - 값이 없으면 `false`를 반환. 간단 확인용.
    - `isEmpty()` : 자바 11 이상에서 사용 가능, 값이 비어있으면 `true`, 값이 있으면 `false`를 반환
- `get()`
    - 값이 있는 경우 그 값을 반환
    - 값이 없으면 `NoSuchElementException` 발생.
    - 직접 사용 시 주의해야 하며, 가급적이면 `orElse`, `orElseXxx`계열 메서드를 사용하는 것이 안전.
- `orElse(T other)`
    - 값이 있으면 그 값을 반환
    - 값이 없으면 `other`를 반환.
- `orElseGet(Supplier<? extends T> supplier)`
    - 값이 있으면 그 값을 반환
    - 값이 없으면 `supplier` 호출하여 생성된 값을 반환.
- `orElseThrow(...)`
    - 값이 있으면 그 값을 반환
    - 값이 없으면 지정한 예외를 던짐.
- `or(Supplier<? extends Optional<? extends T>> supplier)`
    - 값이 있으면 해당 값의 `Optional`을 그대로 반환
    - 값이 없으면 `supplier`가 제공하는 다른 `Optional` 반환
    - 값 대신 `Optional`을 반환한다는 특징

## Optional 값 처리

`Optional`에서는 값이 존재할 때와 존재하지 않을 때를 처리하기 위한 다양한 메서드들을 제공한다. 이를 활용하면, `null` 체크 로직 없이도 안전하고 간결하게 값을 다룰 수 있다.

- `ifPresent(Consumer<? super T> action)`
    - 값이 존재하면 action 실행
    - 값이 없으면 아무것도 안 함
- `ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)`
    - 값이 존재하면 action 실행
    - 값이 없으면 emptyAction 실행
- `map(Function<? super T, ? extends U> mapper)`
    - 값이 있으면 `mapper`를 적용한 결과`(Optional<U>)` 반환
    - 값이 없으면 `Optional.empty()` 반환
- `flatMap(Function<? super T, ? extends Optional<? extends U>> mapper)`
    - map과 유사하지만, `Optional`을 반환할 때 중첩되지 않고 평탄화(flat)해서 반환
- `filter(Predicate<? super T> predicate)`
    - 값이 있고 조건을 만족하면 그대로 반환
    - 조건 불만족이거나 비어있으면 `Optional.empty()` 반환
- `stream()`
    - 값이 있으면 단일 요소를 담은 `Stream<T>` 반환
    - 값이 없으면 빈 스트림 반환

## 즉시 평가와 지연 평가1

`orElse()`와 `orElseGet()`의 차이가 잘 느껴지지 않을 수 있다. 둘의 차이를 제대로 이해하려면 즉시 평가와 지연 평가를 먼저 이해해야 한다.

- 즉시 평가
    - 값(혹은 객체)을 바로 생성하거나 계산해 버리는 것
- 지연 평가
    - 값이 실제로 필요할 때(즉, 사용될 때)까지 계산을 미루는 것

이 2개의 평가를 이해하기 위해 로거 예제를 통해 알아보도록 하자.

``` java
package optional.logger;

public class Logger {

    private boolean isDebug = false;

    public boolean isDebug() {
        return isDebug;
    }

    public void setDebug(boolean debug) {
        isDebug = debug;
    }

    public void debug(Object message) {
        if (isDebug) {
            System.out.println("[DEBUG] " + message);
        }
    }
}
```

위와 같은 로거 예제를 만든 후에 아래와 같이 사용하는 예제를 만들었다.

``` java
package optional.logger;

public class LogMain1 {
    public static void main(String[] args) {
        Logger logger = new Logger();
        logger.setDebug(true);
        logger.debug(10 + 20);

        System.out.println("=== 디버그 모드 끄기 ===");
        logger.setDebug(false);
        logger.debug(100 + 200);
    }
}
```

결과는 너무 쉽다. 처음에는 30이 출력이 될꺼고 디버그 모드를 끈 후에는 300은 출력이 되지를 않을 것이다. 하지만 이 부분에서 즉시 평가와 지연 평가를 상세히 알 수 있다. 자세히 살펴보자.

### 자바 언어의 연산 순서와 즉시 평가

``` java
logger.debug(10 + 20);
```

위의 코드는 자바 언어상 먼저 메서드 호출 전에 인자로 넘어온 값을 계산해야 한다. 그래서 10과 20을 더하여 30을 만든 후에 30이라는 인자를 `debug` 메서드에 넘겨서 로직을 처리한다. 즉, 즉시 평가가 진행이 된 것이다. 하지만 아래의 경우를 살펴보자.

``` java
System.out.println("=== 디버그 모드 끄기 ===");
logger.setDebug(false);
logger.debug(100 + 200);
```

`setDeug`라는 메서드를 통하여 디버그 모드를 껐다. 그 후에 `debug` 메서드를 호출하려고 한다. 그러면 먼저 인자로 넘어오는 100과 200을 CPU가 계산을 한다. 그리고 300이라는 결과가 나오면 그 값을 메서드 인자로 넘겨서 처리를 한다. 하지만 디버그 모드가 꺼졌기에 넘긴 인자는 사용되지도 않고 종료된다. 결과적으로 100 + 200 연산은 미래에 전혀 사용하지 않을 값을 계산해서 아까운 CPU 전기만 낭비한 것이다. 그런데 자바가 이렇게 단순할까? 뭔가 이것을 처리하지 않고 넘기는 것은 아닐까 궁금증이 든다. 이 부분을 살펴보자.

## 즉시 평가와 지연 평가2

100 + 200 연산을 메서드 호출로 변경해서, 실제 호출된 것인지 확인해보자.

``` java
package optional.logger;

public class LogMain2 {
    public static void main(String[] args) {
        Logger logger = new Logger();
        logger.setDebug(true);
        logger.debug(value100() + value200());

        System.out.println("=== 디버그 모드 끄기 ===");
        logger.setDebug(false);
        logger.debug(value100() + value200());
    }

    private static int value100() {
        System.out.println("value100 호출");
        return 100;
    }

    private static int value200() {
        System.out.println("value200 호출");
        return 200;
    }
}
```

로그를 보면 디버그 모드를 끈 경우에도 `value100()`, `value200()`이 실행된 것을 확인할 수 있다. 따라서 메서드를 호출하기 전에 괄호 안의 내용이 먼저 평가(계산)되는 것을 확인할 수 있다. 결과적으로 여기서도 `value100() + value200()`연산은 미래에 전혀 사용하지 않을 값을 계산해서 아까운 CPU 전기만 낭비한 것이다. 즉, 자바는 바보였다.

그렇다면 debug 모드가 켜져있을 때는 해당 연산을 처리하고, debug 모드가 꺼져있을 때는 해당 연산을 처리하지 않으려면 어떻게 해야 할까? 가장 간단한 방법은 디버그 모드를 출력할 때 마다 매번 if 문을 사용해서 체크하는 방법이 있다. 이러면 해결은 되겠지만 `if`문 지옥으로 코드가 매우 지저분해질 것이다. 그러면 조금 깔끔하게 하면서 문제를 해결하게 하는 방법은 없을까?

문제를 해결하고 깔끔하게 하려면 **연산을 정의하는 시점**과 해당 **연산을 실행하는 시점**을 **분리**해야 한다. 그래서 연산의 실행을 최대한 **지연해서 평가**(계산)해야 한다. 즉, `value100()`과 `value200()` 메서드를 `debug` 메서드 안에 실행할 때 넣어야 한다는 의미이다.

## 즉시 평가와 지연 평가3

자바 언어에서 연산을 정의하는 시점과 해당 연산을 실행하는 시점을 분리하는 방법은 여러 가지가 있다.

- 익명 클래스를 선언 후, 메서드를 나중에 호출
- 람다를 선언 후, 람다를 나중에 호출

여기서는 람다를 이용해서 해결해보자.

``` java
package optional.logger;

import java.util.function.Supplier;

public class Logger {

    private boolean isDebug = false;

    public boolean isDebug() {
        return isDebug;
    }

    public void setDebug(boolean debug) {
        isDebug = debug;
    }

    public void debug(Object message) {
        if (isDebug) {
            System.out.println("[DEBUG] " + message);
        }
    }

    public void debug(Supplier<?> supplier) {
        if (isDebug) {
            System.out.println("[DEBUG] " + supplier.get());
        }
    }
}
```

기존 로그 클래스에 `Supplier`를 받는 `debug` 메서드를 오버로딩하였다. 이제 아래와 같이 `main`메서드를 작성할 수 있다.

``` java
package optional.logger;

public class LogMain3 {
    public static void main(String[] args) {
        Logger logger = new Logger();
        logger.setDebug(true);
        logger.debug(() -> value100() + value200());

        System.out.println("=== 디버그 모드 끄기 ===");
        logger.setDebug(false);
        logger.debug(() -> value100() + value200());
    }

    private static int value100() {
        System.out.println("value100 호출");
        return 100;
    }

    private static int value200() {
        System.out.println("value200 호출");
        return 200;
    }
}
```

이제 비로소 디버그 모드를 껐을 때 `value100`과 `value200`의 연산이 실행이 안되었다는 것을 알 수 있다. 코드를 보면 메서드 인자로 람다를 전달할때 미리 계산을 하지 않고 생성만 한 후에 전달한다. 그리고 `get()`을 호출할 때 람다가 실행되어 평가가 된다.

람다를 사용해서 **연산을 정의하는 시점과 실행(평가)하는 시점을 분리**했다. 따라서 값이 실제로 필요할 때 까지 계산을 미룰 수 있었다. 람다를 활용한 지연 평가 덕분에 꼭 필요한 계산만 처리할 수 있었다.

## orElse() vs orElseGet()

`orElse()`는 보통 데이터를 받아서 인자가 즉시 평가되고, `orElseGet()`은 람다를 받아서 인자가 지연 평가된다.

``` java
package optional;

import java.util.Optional;
import java.util.Random;

public class OrElseGetMain {
    public static void main(String[] args) {
        Optional<Integer> optValue = Optional.of(100);
        Optional<Integer> optEmpty = Optional.empty();

        System.out.println("단순 계산");
        Integer i1 = optValue.orElse(10 + 20);
        Integer i2 = optEmpty.orElse(10 + 20);
        System.out.println("i1 = " + i1);
        System.out.println("i2 = " + i2);

        System.out.println("=== orElse ===");
        System.out.println("값이 있는 경우");
        Integer value1 = optValue.orElse(createData());
        System.out.println("value1 = " + value1);

        System.out.println("값이 없는 경우");
        Integer empty1 = optEmpty.orElse(createData());
        System.out.println("empty1 = " + empty1);

        System.out.println("=== orElseGet ===");
        System.out.println("값이 있는 경우");
        Integer value2 = optValue.orElseGet(OrElseGetMain::createData);
        System.out.println("value2 = " + value2);

        System.out.println("값이 없는 경우");
        Integer empty2 = optEmpty.orElseGet(OrElseGetMain::createData);
        System.out.println("empty2 = " + empty2);
    }

    public static int createData() {
        System.out.println("데이터를 생성합니다...");

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        int createValue = new Random().nextInt(100);
        System.out.println("데이터 생성이 완료되었습니다. 생성 값: " + createValue);

        return createValue;
    }
}
```

결과를 보면 `orElse`와 `orElseGet`의 차이를 극명히 알 수 있을 것이다.

- `orElse(T other)`는 "빈 값이면 `other`를 반환"하는데, `other`를 "항상" 미리 계산한다.
    - 따라서 `other`를 생성하는 비용이 큰 경우, 실제로 값이 있을 때도 쓸데없이 생성 로직이 실행될 수 있다.
    - 연산이 없는 상수나 변수의 경우 사용해도 괜찮다.
    - `orElse()`에 넘기는 표현식은 **호출 즉시 평가**하므로 **즉시 평가(eager evaluation)**가 적용된다.
- `orElseGet(Supplier supplier)`은 빈 값이면 `supplier`를 통해 값을 생성하기 때문에, **값이 있을 때는** `supplier`**가 호출되지 않는다.**
    - 생성 비용이 높은 객체를 다룰 때는 `orElseGet()`이 더 효율적이다.
    - `orElseGet()`에 넘기는 표현식은 **필요할 때만 평가**하므로 **지연 평가(lazy evaluation)**가 적용된다.

정리하면, **단순한 대체 값**을 전달하거나 코드가 매우 간단하다면 `orElse()`를 사용하고, **객체 생성 비용이 큰 로직**이 들어있고, **Optional에 값이 이미 존재할 가능성이 높다면** `orElseGet()`을 고려해볼 수 있다.

## 옵셔널 - 베스트 프랙티스

- `Optional`이 좋아보여도 무분별하게 사용하면 오히려 코드 가독성과 유지보수에 도움이 되지 않을 수 있다.
- `Optional`은 주로 **메서드의 반환값**에 대해 값이 없을 수도 있음을 표현하기 위해 도입되었다.
- 여기서 핵심은 메서드의 반환값에 `Optional`을 사용하라는 것이다.

### 반환 타입으로만 사용하고, 필드에는 가급적 쓰지 말기

- `Optional`은 주로 **메서드의 반환값**에 대해 "값이 없을 수도 있음"을 표현하기 위해 도입되었다.
- 클래스의 필드(멤버 변수)에 `Optional`을 직접 두는 것은 권장하지 않는다.

#### 잘못된 예시

``` java
public class Product {
    // 안티 패턴: 필드를 Optional로 선언
    private Optional<String> name;
}
```

- `Optional` 자체도 참조 타입이기 때문에, 혹시라도 개발자가 부주의로 `Optional` 필드에 `null`을 할당하면, 그 자체가 `NullPointerException`을 발생시킬 여지를 남긴다.
- 값이 없음을 명시하기 위해 사용하는 것이 `Optional`인데, 정작 필드 자체가 `null`이면 혼란이 가중된다.

#### 권장 예시

``` java
public class Product {
    // 필드는 원시 타입(혹은 일반 참조 타입) 그대로 둔다.
    private String name;
}

// name 값을 가져올 때, "필드가 null일 수도 있음"을 고려해야 한다면
// 다음 메서드에서 Optional로 변환해서 반환할 수 있다.
public Optional<String> getNameAsOptional() {
    return Optional.ofNullable(name);
}
```

- 만약 `Optional`로 `name` 값을 받고 싶다면, 필드는 `Optional`을 사용하지 않고, **반환하는 시점**에 `Optional`로 감싸주는 것이 일반적으로 더 나은 방법이다.

### 메서드 매개변수로 `Optional`을 사용하지 말기

- 자바 공식 문서에 `Optional`은 메서드의 **반환값**으로 사용하기를 권장하며, **매개변수**로 사용하지 말라고 명시되어 있다.
- 호출하는 측에서는 단순히 `null` 전달 대신 `Optional.empty()`를 전달해야 하는 부담이 생기며, 결국 `null`을 사용하든 `Optional.empty()`를 사용하든 큰 차이가 없어 가독성만 떨어진다.

#### 잘못된 예시

``` java
public void processOrder(Optional<Long> orderId) {
    if (orderId.isPresent()) {
        System.out.println("Order ID: " + orderId.get());
    } else {
        System.out.println("Order ID is empty!");
    }
}
```

- 호출하는 입장에서는 `processOrder(Optional.empty())`처럼 호출해야 하는데, 사실 `processOrder(null)`과 큰 차이가 없고, 오히려 `Optional.empty()`를 만드는 비용이 추가된다.

#### 권장 예시

- **오버로드**된 메서드를 만들거나,
- **명시적으로 `null` 허용 여부**를 문서화하는 방식을 택합니다.

어떤 방식이든 `Optional`을 매개변수로 받는 것은 지양하고, **오히려 반환 타입**을 `Optional`로 두는 것이 더 자연스러운 활용 방법이다.

### 컬렉션(Collection)이나 배열 타입을 `Optional`로 감싸지 말기

- `List<T>`,`Set<T>`,`Map<K,V>`등 **컬렉션(Collection)** 자체는 **비어있는 상태(empty)를 표현**할 수 있다.
- 따라서 `Optional<List<T>>`처럼 다시 감싸면 `Optional.empty()`와 "빈 리스트"(`Collections.emptyList()`)가 이중 표현이 되고, 혼란을 야기한다.

#### 잘못된 예시

``` java
public Optional<List<String>> getUserRoles(String userId) {
    List<String> userRolesList ...;
    if (foundUser) {
        return Optional.of(userRolesList);
    } else {
        return Optional.empty();
    }
}

Optional<List<String>> optList = getUserRoles("someUser");
if (optList.isPresent()) {
// ...
}
```

- 하지만 정작 내부의 리스트가 `empty`일 수도 있으므로, 한 번 더 체크해야 하는 모호함이 생긴다.
    - `Optional`이 비어있는지 체크해야 하고, `userRolesList`가 비어있는지 추가로 체크해야 한다.

#### 권장 예시

``` java
public List<String> getUserRoles(String userId) {
    // ...
    if (!foundUser) {
        // 권장: 빈 리스트 반환
        return Collections.emptyList();
    }
        return userRolesList;
}
```

- 빈 컬렉션을 반환하면, 호출 측에서는 단순히 `optList.isEmpty()`로 처리하면 된다.

### `isPresent()`와 `get()` 조합을 직접 사용하지 않기

- `Optional`의 `get()` 메서드는 가급적 사용하지 않아야 한다.
- `if (opt.isPresent()) { ... opt.get() ... } else { ... }`는 사실상 `null` 체크와 다를 바 없으며, 깜빡하면 `NoSuchElementException`같은 예외가 발생할 위험이 있다.
- 대신 `orElse`,`orElseGet`,`orElseThrow`,`ifPresentOrElse`,`map`,`filter`등의 메서드를 활용하면 간결하고 안전하게 처리할 수 있다.

#### 잘못된 예시

``` java
public static void main(String[] args) {
    Optional<String> optStr = Optional.ofNullable("Hello");
    if (optStr.isPresent()) {
        System.out.println(optStr.get());
    } else {
        System.out.println("Nothing");
    }
}
```

#### 권장 예시

``` java
public static void main(String[] args) {
    Optional<String> optStr = Optional.ofNullable("Hello");
    // 1) orElse
    System.out.println(optStr.orElse("Nothing"));
    // 2) ifPresentOrElse
    optStr.ifPresentOrElse(
        System.out::println,
        () -> System.out.println("Nothing")
    );
    // 3) map
    int length = optStr.map(String::length).orElse(0);
    System.out.println("Length: " + length);
}
```

- 각 메서드(`map`,`filter`,`ifPresentOrElse`,`orElse`,`orElseThrow`,`orElseGet`등)를 잘 조합하면, `get()`없이도 대부분의 로직을 처리할 수 있다.
- `get()` 메서드는 가급적 사용하지 말고, 예제 코드나, 간단한 테스트에서만 사용하는 것을 권장한다.
- 그럼에도 불구하고 `get()` 메서드를 사용해야 하는 상황이라면, 이럴 때는 반드시 `isPresent()`와 함께 사용 하는 것을 권장한다.

### `orElseGet()` vs `orElse()` 차이를 분명히 이해하기

- `orElse(T other)`는 **항상** `other`를 즉시 생성하거나 계산한다.
    - 즉, `Optional` 값이 존재해도 불필요한 연산/객체 생성이 일어날 수 있다. (**즉시 평가**)
- `orElseGet(Supplier<? extends T>)`는 **필요할 때만**(빈 `Optional`일 때만) `Supplier`를 호출한다.
    - 값이 이미 존재하는 경우에는 `Supplier`가 실행되지 않으므로, 비용이 큰 연산을 뒤로 미룰 수 있다(**지연 평가**).

### 무조건 `Optional`이 좋은 것은 아니다

- `Optional`은 분명히 편의성과 안전성을 높여주지만, 모든 곳에서 "무조건" 사용하는 것은 오히려 코드 복잡성을 증가시킬 수 있다.
- 다음과 같은 경우 **`Optional` 사용이 오히려 불필요**할 수 있다.
    - "항상 값이 있는" 상황
        - 비즈니스 로직상 `null`이 될 수 없는 경우, 그냥 일반 타입을 사용하거나, 방어적 코드로 예외를 던지는 편이 낫다.
    - "값이 없으면 예외를 던지는 것"이 더 자연스러운 상황
        - 예를 들어, ID 기반으로 무조건 존재하는 DB 엔티티를 찾아야 하는 경우, `Optional` 대신 예외를 던지는 게 API 설계상 명확할 수 있다. 물론 이런 부분은 비즈니스 상황에 따라 다를 수 있다.
    - "흔히 비는 경우"가 아니라 "흔히 채워져 있는" 경우
        - `Optional`을 쓰면 매번 `.get()`,`orElse()`,`orElseThrow()`등 처리가 강제되므로 오히려 코드가 장황해질 수 있다.
    - "성능이 극도로 중요한" 로우레벨 코드
        - `Optional` 은 래퍼 객체를 생성하므로, 수많은 객체가 단기간에 생겨나는 영역(예: 루프 내부)에서는 성능 영향을 줄 수 있다.(일반적인 비즈니스 로직에서는 문제가 되지 않는다. 극한 최적화가 필요한 코드라면 고려 대상)

`Optional` 은 **반환 타입**, 그리고 **지역 변수** 정도에 사용하는 것은 괜찮다. 이처럼 `Optional`을 적극적으로 사용하면 `null`을 직접 다루는 코드보다 가독성이 좋아지고, 런타임 오류(`NullPointerException`)를 줄이는 데 도움이 된다. 그러나 **"모든 상황에 마구 적용하면 오히려 복잡도를 높일 수 있다"**는 점을 고려하자.

### 클라이언트 메서드 vs 서버 메서드

사실 `Optional`을 고려할 때 가장 중요한 핵심은 `Optional`을 생성하고 반환하는 서버쪽 메서드가 아니라, `Optional`을 반환하는 코드를 호출하는 클라이언트 메서드에 있다. 결과적으로 `Optional`을 반환받는 클라이언트의 입장을 고려해서 하는 선택이, `Optional`을 가장 잘 사용하는 방법이다.

### Optional 기본형 타입 지원

`OptionalInt`,`OptionalLong`,`OptionalDouble`과 같은 기본형 타입의 `Optional`도 있지만 다음과 같은 이유로 잘 사용되지는 않는다.

- `Optional<T>` 와 달리 `map()` , `flatMap()` 등의 다양한 연산 메서드를 제공하지 않는다. 그래서 범용적으로활용하기보다는 특정 메서드(`isPresent()`,`getAsInt()`등)만 사용하게 되어, 일반 `Optional<T>`처럼 메서드 체인을 이어 가며 코드를 간결하게 작성하기 어렵다.
- 기존에 이미 `Optional<T>`를 많이 사용하고 있는 코드베이스에서, 특정 상황만을 위해 `OptionalInt`등을 섞어 쓰면 오히려 가독성을 떨어뜨린다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!