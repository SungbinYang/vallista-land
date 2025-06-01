---
title: "[자바 고급3] 스트림 API1 - 기본"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-01 14:24:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 스트림 API 시작

우리가 만들었던 `MyStreamV3`처럼 자바도 **스트림 API**라는 이름으로 스트림 관련 기능들을 제공한다. (I/O 스트림이 아니다.) 그럼 한번 자바가 제공하는 스트림 API에 대해 코드로 살펴보자.

``` java
package stream.start;

import java.util.List;
import java.util.stream.Stream;

public class StreamStartMain {
    public static void main(String[] args) {
        List<String> names = List.of("Apple", "Banana", "Berry", "Tomato");
        Stream<String> stream = names.stream();
        List<String> result = stream
                .filter(name -> name.startsWith("B"))
                .map(s -> s.toUpperCase())
                .toList();

        System.out.println("=== 외부 반복 ===");
        for (String s : result) {
            System.out.println(s);
        }

        System.out.println("=== forEach, 내부 반복 ===");
        names.stream()
                .filter(name -> name.startsWith("B"))
                .map(s -> s.toUpperCase())
                .forEach(s -> System.out.println(s));

        System.out.println("=== 메서드 참조 ===");
        names.stream()
                .filter(name -> name.startsWith("B"))
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
```

### 스트림 생성

``` java
List<String> names = List.of("Apple", "Banana", "Berry", "Tomato");
Stream<String> stream = names.stream();
```

- 과일 리스트에 `stream`이라는 메서드를 사용하면 스트림을 생성할 수 있다.

### 중간 연산 - filter, map

``` java
.filter(name -> name.startsWith("B"))
.map(s -> s.toUpperCase())
```

- **중간 연산**은 스트림에서 요소를 걸러내거나(필터링), 다른 형태로 변환(매핑)하는 기능이다.

### 최종 연산 - toList

``` java
List<String> result = stream
    .filter(name -> name.startsWith("B"))
    .map(s -> s.toUpperCase())
    .toList();
```

- `toList()`는 **최종 연산**이다. 중간 연산에서 정의한 연산을 기반으로 최종 결과를 `List`로 만들어 반환한다.

### 내부 반복 - forEach

``` java
System.out.println("=== forEach, 내부 반복 ===");
    names.stream()
        .filter(name -> name.startsWith("B"))
        .map(s -> s.toUpperCase())
        .forEach(s -> System.out.println(s));
```

- 스트림에 대해 `forEach()`를 호출하면, 스트림에 담긴 요소들을 **내부적으로** 반복해가며 람다 표현식(또는 메서드 참조)에 지정한 동작을 수행한다.
- **내부 반복**을 사용하면 스트림이 알아서 반복문을 수행해주기 때문에, 개발자가 직접 for/while 문을 작성하지 않아도 된다.

그럼 한번 정리를 해보자.

- **중간 연산**(`filter`,`map` 등)은 데이터를 걸러내거나 형태를 변환하며, **최종 연산**(`toList()`,`forEach` 등)을 통해 최종 결과를 모으거나 실행할 수 있다.
- 스트림의 내부 반복을 통해, "어떻게 반복할지(for 루프, while 루프 등) 직접 신경 쓰기보다는, 결과가 어떻게 변환되어야 하는지"에만 집중할 수 있다. 이런 특징을 **선언형 프로그래밍**(Declarative Programming) 스타일이라 한다.
- 메서드 참조는 람다식을 더 간결하게 표현하며, 가독성을 높여준다.

## 스트림 API란?

- **스트림(Stream)**은 자바 8부터 추가된 기능으로, **데이터의 흐름을 추상화**해서 다루는 도구이다.
- **컬렉션(Collection) 또는 배열 등**의 요소들을 **연산 파이프라인**을 통해 **연속적인 형태**로 처리할 수 있게 해준다.
    - 연산 파이프라인: 여러 연산(중간 연산, 최종 연산)을 **체이닝**해서 데이터를 변환, 필터링, 계산하는 구조

> 📚 용어 정리
>
> 스트림이 여러 단계를 거쳐 변환되고 처리되는 모습이 **마치 물이 여러 파이프(관)를 타고 이동하면서 정수 시설이나 필터를 거치는 과정**과 유사하다. 각 파이프 구간마다(=중간 연산) 데이터를 가공하고, 마지막 종착지(=종료 연산)까지 흐른다는 개념이 비슷하기 때문에 '파이프라인'이라는 용어를 사용한다.

### 특징

- 데이터 소스를 변경하지 않음(Immutable)
    - 스트림에서 제공하는 연산들은 원본 컬렉션(예: `List`,`Set`)을 변경하지 않고 **결과만 새로 생성**한다.
- 일회성(1회 소비)
    - 한 번 사용(소비)된 스트림은 다시 사용할 수 없으며, 필요하다면 **새로 스트림을 생성**해야 한다.
- 파이프라인(Pipeline) 구성
    - **중간 연산**(map, filter 등)들이 이어지다가, **최종 연산**(forEach, collect, reduce 등)을 만나면 연산이 수행되고 종료된다.
- 지연 연산(Lazy Operation)
    - 중간 연산은 필요할 때까지 실제로 동작하지 않고, 최종 연산이 실행될 때 한 번에 처리된다.
- 병렬 처리(Parallel) 용이
    - 스트림으로부터 **병렬 스트림(Parallel Stream)** 을 쉽게 만들 수 있어서, 멀티코어 환경에서 병렬 연산을 비교적 단순한 코드로 작성할 수 있다.

그럼 위의 특징들을 코드로 하나씩 살펴보자.

``` java
package stream.basic;

import java.util.List;

public class ImmutableMain {
    public static void main(String[] args) {
        List<Integer> originList = List.of(1, 2, 3, 4, 5);
        System.out.println("originList = " + originList);

        List<Integer> filteredList = originList.stream()
                .filter(n -> n % 2 == 0)
                .toList();
        System.out.println("filteredList = " + filteredList);
        System.out.println("originList = " + originList);
    }
}
```

위의 코드를 보면 알겠지만 스트림을 이용해 필터링을 해서 리스트를 반환해도 원본 리스트는 변경이 안된다는 것을 알 수 있다.

``` java
package stream.basic;

import java.util.List;
import java.util.stream.Stream;

public class DuplicateExecutionMain {
    public static void main(String[] args) {
        Stream<Integer> stream = Stream.of(1, 2, 3);
        stream.forEach(System.out::println);

        stream.forEach(System.out::println);

        List<Integer> list = List.of(1, 2, 3);
        Stream.of(list).forEach(System.out::println);
        Stream.of(list).forEach(System.out::println);
    }
}
```

위의 코드를 보면 알겠지만 스트림을 생성하여 한번 최종연산을 하면 그 이후에 해당 스트림은 재사용이 불가능하다. 쉽게 생각해서 어떤 음식점에 음식을 재활용할 수 없는 것이라고 생각하면 쉬울 것이다.

## 파이프라인 구성

먼저 예제를 통해 우리가 만든 스트림과 자바가 제공하는 스트림이 어떻게 다른지 살펴보자.

``` java
package stream.basic;

import lambda.lambda5.mystream.MyStreamV3;

import java.util.List;

public class LazyEvalMain1 {
    public static void main(String[] args) {
        List<Integer> data = List.of(1, 2, 3, 4, 5, 6);
        ex1(data);
        ex2(data);
    }

    private static void ex1(List<Integer> data) {
        System.out.println("== MyStreamV3 시작 ==");

        List<Integer> result = MyStreamV3.of(data)
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                })
                .toList();

        System.out.println("result = " + result);
        System.out.println("== MyStreamV3 종료 ==");
    }

    private static void ex2(List<Integer> data) {
        System.out.println("== Stream API 시작 ==");

        List<Integer> result = data.stream()
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                })
                .toList();

        System.out.println("result = " + result);
        System.out.println("== Stream API 종료 ==");
    }
}
```

`ex1` 메서드는 우리가 만든 `MyStreamV3`로 로직을 구현한 것이고 `ex2`는 자바에서 제공해주는 `Stream` API를 통하여 로직을 구현한 것이다. 코드로만 보았을 때는 코드가 매우 유사하다. 하지만 동작과정에서 엄청 큰 차이가 존재한다.

### 일괄 처리 vs 파이프 라인

**MyStreamV3**는 **일괄 처리** 방식이고, **자바 Stream API**는 **파이프라인** 방식이다.

두 방식을 살짝 비유로 들어보자면 테스트 코드를 작성할때 어떤 A개발자는 비즈니스 로직을 전부 다 작성한 다음에 한번에 테스트 코드를 작성하는 개발자이고, B개발자는 하나의 파일을 작성하면 해당 파일에 대한 테스트 코드를 작성하는 개발자이다. 여기서 A개발자가 일괄처리 방식을 하는 개발자이고 B개발자가 파이프 라인 방식을 하는 개발자이다.

풀어서 말하면 일괄 처리는 공정(중간 연산)을 단계별로 쪼개서 **데이터 전체**를 한 번에 처리하고, 결과를 저장해두었다가 다음 공정을 또 한번에 수행한다. 반면, 파이프라인 처리는 한 요소(제품)가 한 공정을 마치면, **즉시** 다음 공정으로 넘어가는 구조이다. 그래서 코드상에서도 우리가 만든 `MyStreamV3`는 필터 단계에서 일단 리스트 전부를 필터 한 후에 필터된 리스트를 기반으로 매핑 과정을 거치는 반면에 자바에서 제공해주는 `Stream` API는 필터를 하다가 필터 조건에 맞는 요소를 바로 매핑하는 과정을 볼 수 있다.

또한 필자는 궁금해서 두 방식을 성능 테스트를 진행을 해보았고 성능상도 확실히 자바에서 제공해주는 `Stream` API가 뛰어난 것을 볼 수 있었다.

## 지연 연산

파이프라인의 장점을 설명하기 전에 먼저 지연 연산에 대해 알아보자.

자바 스트림은 `toList()`와 같은 최종 연산을 수행할 때만 작동한다.

``` java
package stream.basic;

import lambda.lambda5.mystream.MyStreamV3;

import java.util.List;

public class LazyEvalMain2 {
    public static void main(String[] args) {
        List<Integer> data = List.of(1, 2, 3, 4, 5, 6);
        ex1(data);
        ex2(data);
    }

    private static void ex1(List<Integer> data) {
        System.out.println("== MyStreamV3 시작 ==");

        MyStreamV3.of(data)
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                });
        System.out.println("== MyStreamV3 종료 ==");
    }

    private static void ex2(List<Integer> data) {
        System.out.println("== Stream API 시작 ==");

        data.stream()
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                });

        System.out.println("== Stream API 종료 ==");
    }
}
```

위의 코드는 이전 코드에서 `toList`만 제외한 코드이다. 즉, 최종연산을 수행하지 않는 코드이다. 그리고 결과를 보면 `MyStreamV3`는 실행이 되버리지만, 자바에서 제공해주는 `Stream` API는 수행되지 않는다. 이것이 **스트림 API의 지연 연산**을 가장 극명하게 보여주는 예시이다.

- 중간 연산들은 "이런 일을 할 것이다"라는 파이프라인 설정을 해놓기만 하고, 정작 **실제 연산은 최종 연산이 호출되기 전까지 전혀 진행되지 않는다.**
- 쉽게 이야기해서 스트림은 `filter` , `map` 을 호출할 때 전달한 람다를 내부에 저장만 해두고 실행하지는 않는 것이다. 이후에 최종 연산(`toList()`, `forEach()`)이 호출되면 그때 각각의 항목을 꺼내서 저장해 둔 람다를 실행한다.

## 지연 연산과 최적화

자바의 스트림은 지연 연산, 파이프라인 방식 등 왜 이렇게 복잡하게 설계되어 있을까? 실제로 지연 연산과 파이프라인을 통해 어떤 최적화를 할 수 있는지 알아보자.

그럼 코드를 살펴보기 전에 우리가 이전에 만든 `MyStreamV3`에 메서드를 하나 추가해보자.

``` java
public T getFirst() {
    return internalList.getFirst();
}
```

이제 본 코드를 살펴보자.

``` java
package stream.basic;

import lambda.lambda5.mystream.MyStreamV3;

import java.util.List;

public class LazyEvalMain3 {
    public static void main(String[] args) {
        List<Integer> data = List.of(1, 2, 3, 4, 5, 6);
        ex1(data);
        ex2(data);
    }

    private static void ex1(List<Integer> data) {
        System.out.println("== MyStreamV3 시작 ==");

        Integer result = MyStreamV3.of(data)
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                })
                .getFirst();

        System.out.println("result = " + result);
        System.out.println("== MyStreamV3 종료 ==");
    }

    private static void ex2(List<Integer> data) {
        System.out.println("== Stream API 시작 ==");

        Integer result = data.stream()
                .filter(i -> {
                    boolean isEven = i % 2 == 0;
                    System.out.println("filter() 실행: " + i + "(" + isEven + ")");
                    return isEven;
                })
                .map(i -> {
                    int mapped = i * 10;
                    System.out.println("map() 실행: " + i + " -> " + mapped);
                    return mapped;
                })
                .findFirst().get();

        System.out.println("result = " + result);
        System.out.println("== Stream API 종료 ==");
    }
}
```

우리가 만든 `MyStreamV3`는 즉시 연산으로 인해 리스트에 있는 요소를 전부 필터링을 거친 후에 매핑을 전부 진행 후, 첫번째 요소를 반환한다. 반면, `Stream` API는 지연 연산때문에 `findFirst()`라는 **최종 연산**을 만나면, 조건을 만족하는 요소를 찾는 순간 연산을 멈추고 바로 반환한다. 이를 **"단축 평가"**(short-circuit)라고 하며, 조건을 만족하는 결과를 찾으면 더 이상 연산을 진행하지 않는 방식이다.

- **지연 연산**과 **파이프라인 방식**이 있기 때문에 가능한 최적화 중 하나이다.

### 즉시 연산과 지연 연산

- `MyStreamV3`는 중간 연산이 호출될 때마다 즉시 연산을 수행하는, 일종의 **즉시(Eager) 연산** 형태이다.
- **자바 스트림 API**는 **지연(Lazy) 연산**을 사용하므로,
    - 최종 연산이 호출되기 전까지는 실제로 연산이 일어나지 않고,
    - 필요할 때(또는 중간에 결과를 얻으면 종료해도 될 때)는 **단축 평가**를 통해 불필요한 연산을 건너뛸 수 있다.

### 지연 연산 정리

스트림 API에서 **지연 연산**(Lazy Operation, 게으른 연산)이란, `filter`,`map` 같은 **중간 연산**들은 `toList`와 같은 **최종 연산(Terminal Operation)** 이 호출되기 전까지 실제로 실행되지 않는다는 의미이다.

- 즉, 중간 연산들은 결과를 **바로 계산**하지 않고, "무엇을 할지"에 대한 **설정만** 저장해 둔다.
    - 쉽게 이야기해서 람다 함수만 내부에 저장해두고, 해당 함수를 실행하지는 않는다.
- 그리고 최종 연산(예: `toList()`,`forEach()`,`findFirst()` 등)이 실행되는 순간, **그때서야** 중간 연산이 순차적으로 **한 번에** 수행된다. (저장해둔 람다들을 실행한다.)

이를 통해 지연 연산은 다음과 같은 장점을 가진다.

- **불필요한 연산의 생략(단축, Short-Circuiting)**
    - 스트림이 실제로 데이터를 처리하기 직전에, "이후 연산 중에 어차피 건너뛰어도 되는 부분"을 알아내 **불필요한 연산을 피할 수 있게** 한다.
- **메모리 사용 효율**
    - 중간 연산 결과를 매 단계마다 별도의 자료구조에 저장하지 않고, 최종 연산 때까지 **필요할 때만 가져와서 처리**한다.
- **파이프라인 최적화**
    - 스트림은 요소를 하나씩 꺼내면서(=순차적으로) `filter`,`map`등 연산을 **묶어서** 실행할 수 있다.
    - 이렇게 하면 메모리를 절약할 수 있고, 짜잘짜잘하게 중간 단계를 저장하지 않아도 되므로, 내부적으로 효율적으로 동작한다.

따라서 **스트림의 지연 연산** 개념과 **단축 평가** 방식을 잘 이해해두면, 실무에서 대량의 컬렉션/데이터를 효율적으로 다룰 때 도움이 된다. 정리하면, **스트림 API의 핵심은 "어떤 연산을 할지" 파이프라인으로 정의해놓고, 최종 연산이 실행될 때 한 번에 처리**한다는 점이다. 이를 통해 "필요한 시점에만 데이터를 처리하고, 필요 이상으로 처리하지 않는다"는 효율성을 얻을 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!