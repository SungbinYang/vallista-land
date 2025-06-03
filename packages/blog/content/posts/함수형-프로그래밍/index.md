---
title: "[자바 고급3] 함수형 프로그래밍"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-03 16:57:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 프로그래밍 패러다임

프로그래밍 패러다임이란 프로그램을 구성하고 구현하는 사상이나 접근법을 말한다.

### 명령형 프로그래밍

- **핵심 개념**: 어떻게(How) 할 것인지 구체적으로 명령(Instruction)을 내리는 방식
- **특징**
    - 프로그램이 어떤 순서와 단계로 동작해야 하는지를 구체적인 제어 흐름(조건문, 반복문 등)으로 기술
    - 변수의 값이 바뀌면서 상태(state)가 변해감
    - CPU의 동작 방식(메모리 수정, 제어 흐름에 따른 실행)과 유사하여, 전통적인 하드웨어와의 직관적인 일치
    - 예시: C, C++, Java 등 대부분의 언어가 명령형 특성을 지님
- **장단점**
    - 장점: 컴퓨터의 동작 방식과 매우 유사해 이해하기 직관적, 제어 흐름을 상세히 제어하기 쉽다.
    - 단점: 프로그램 규모가 커지면 상태 변경에 따른 복잡도가 증가

### 절차 지향형 프로그래밍

- **핵심 개념**: 명령형 프로그래밍의 대표적인 형태로, 프로그램을 절차(Procedure)나 함수(Function) 단위로 나누어 순서대로 실행
- **특징**
    - 명령형 패러다임의 하위 개념으로 볼 수 있음
    - 공통된 로직을 재사용하기 위해 함수나 프로시저를 만들어 사용
    - "데이터와 절차가 분리되어 있다"라는 말로도 자주 설명됨. 즉, 함수(절차)는 별도로 정의해 두고, 여러 데이터에 대해 같은 절차를 적용
    - 예시: C, Pascal 등
- **장단점**
    - 장점: 구조적 프로그래밍 기법(모듈화, 함수화)으로 코드 가독성 상승, 코드 재사용성 향상
    - 단점: 데이터와 로직이 명확히 분리되지 않을 때, 코드 유지 보수가 어렵고 대형 프로젝트에서 복잡성 증가

> ✅ 참고
>
> - **프로시저(Procedure)**: 일련의 명령문들을 하나의 단위로 묶은 것으로, 특정 작업이나 행동을 수행하는 데 중점을 둔다. 프로시저는 반드시 값을 반환할 필요가 없으며, 주로 상태 변경이나 특정 동작 수행에 초점을 맞춘다. 일종의 `void` 반환 타입 메서드(함수)라고 생각하자.
> - **함수(Function)**: 수학적 함수의 개념에서 유래했으며, 입력값을 받아 처리하고 결과값을 반환하는 것이 주 목적이다. 함수는 보통 값을 계산하고 반환하는 데 중점을 둔다.

### 객체 지향 프로그래밍

- **핵심 개념**: 프로그램을 객체(Object)라는 추상화된 단위로 구성. 각 객체는 상태(필드, 속성)와 행동(메서드)을 갖고 있으며, 메시지 교환(메서드 호출)을 통해 상호작용
- **특징**
    - 캡슐화(Encapsulation), 추상화(Abstraction), 상속(Inheritance), 다형성(Polymorphism)과 같은 특징이 있음
    - 데이터와 해당 데이터를 처리하는 함수를 하나의 객체로 묶어서 관리해 유지보수성과 확장성을 높인다.
    - 예시: Java, C++, C#
- **장단점**
    - 장점: 객체라는 단위로 묶이므로 코드 재사용성, 확장성, 유지보수성 우수. 대규모 시스템 설계에 적합
    - 단점: 과도한 객체 분리나 복잡한 상속 구조 등으로 인해 오히려 복잡도가 증가할 수 있음

### 선언형 프로그래밍

- **핵심 개념**: "무엇을(What) 할 것인지"를 기술하고, "어떻게(How)" 구현, 실행될지는 위임하는 방식
- **특징**
    - 구체적인 제어 흐름(조건문, 반복문 등)을 직접 작성하기보다, 원하는 결과나 조건을 선언적으로 표현
    - 상태 변화보다는 결과에 초점을 맞추어 코드를 작성
    - 예시: SQL, HTML
    - 함수형 프로그래밍 등이 선언형 패러다임에 속하거나 밀접하게 관련됨
- **장단점**
    - 장점: 구현의 복잡한 로직을 많이 숨길 수 있어, 높은 수준에서 문제 해결에 집중 가능. 비즈니스 로직을 직관적으로 표현하기 쉬움
    - 단점: 언어나 환경이 제공하는 추상화 수준에 의존적이며, 내부 동작이 보이지 않을 경우 디버깅이 어려울 수 있음. 낮은 수준의 최적화나 세밀한 제어가 필요한 상황에서는 제약이 생길 수도 있음

### 함수형 프로그래밍

- **핵심 개념**: 무엇(What)을 할 것인지를 수학적 함수(Function)들로 구성하고, 부수 효과(Side Effect) 최소화 및 불변성(Immutable State)을 강조하는 프로그래밍 방식
- **특징**
    - 선언형(Declarative) 접근에 가까움: "어떻게"가 아니라, "어떤 결과"를 원한다고 선언
    - 순수 함수(Pure Function)를 중시: 같은 입력이 주어지면 항상 같은 출력
    - 데이터는 불변(Immutable)하게 처리: 재할당 대신 새로운 데이터를 만들어 반환
    - 함수가 일급 시민(First-Class Citizen)으로 취급: 고차 함수(Higher-Order Function), 함수를 인자로 넘기거나 반환 가능
    - 예시: Haskell, Clojure, Scala, Java(람다와 함수형 인터페이스를 통한 부분 지원)
- **장단점**
    - 장점: 상태 변화가 없거나 최소화되므로 디버깅과 테스트 용이, 병렬 처리 및 동시성 처리가 간단해지는 경향
    - 단점: 명령형 사고방식에 익숙한 프로그래머에게는 초기 접근이 어려울 수 있음, 계산 과정에서의 메모리 사용이 증가할 수 있음

## 함수형 프로그래밍이란?

함수형 프로그래밍(Functional Programming)은 프로그램을 함수(수학적 함수)를 조합해 만드는 방식에 초점을 두는 프로그래밍 패러다임이다. 명령형 프로그래밍(Imperative Programming)처럼 **어떻게(How)** 할 것인지(절차와 상태 변화를 명시)보다는, 필요한 결과를 얻기 위해 **무엇(What)**을 계산할 것인가를 강조한다. 함수를 일급 시민(First-class Citizen)으로 취급하고, 불변(Immutable) 상태를 지향하며, 순수 함수(Pure Function)를 중심에 두는 것이 주요 특징이다.

### 특징

- **순수 함수(Pure Function)**
    - 같은 인자를 주면 항상 같은 결과를 반환하는 함수이다.
    - 외부 상태(변할 수 있는 전역 변수 등)에 의존하거나, 외부 상태를 변경하는 부수 효과(Side Effect)가 없는 함수를 의미한다.
- **부수 효과(Side Effect) 최소화**
    - 함수형 프로그래밍에서는 상태 변화를 최소화하기 위해 변수나 객체를 변경하는 것을 지양한다.
    - 이로 인해 프로그램의 버그가 줄어들고, 테스트나 병렬 처리(Parallelism), 동시성(Concurrency) 지원이 용이해진다.
- **불변성(Immutable State) 지향**
    - 데이터는 생성된 후 가능한 한 변경하지 않고, 변경이 필요한 경우 새로운 값을 생성해 사용한다.
    - 가변 데이터 구조에서 발생할 수 있는 오류를 줄이고, 프로그램의 예측 가능성을 높여준다.
- **일급 시민(First-class Citizen) 함수**
    - 함수가 일반 값(숫자, 문자열, 객체(자료구조)등)과 동일한 지위를 가진다.
    - 함수를 변수에 대입하거나, 다른 함수의 인자로 전달하거나, 함수에서 함수를 반환하는 고차 함수(Higher-order Function)를 자유롭게 사용할 수 있다.
- **선언형(Declarative) 접근**
    - **어떻게**가 아닌 **무엇**을 계산할지 기술한다.
    - 복잡한 제어 구조나 상태 관리를 함수의 합성과 함수 호출로 대체하여 간결하고 가독성 높은 코드를 작성한다.
- **함수 합성(Composition)**
    - 간단한 함수를 조합해 더 복잡한 함수를 만드는 것을 권장한다.
    - 작은 단위의 함수들을 체이닝(Chaining)하거나 파이프라이닝(Pipelining)해서 재사용성을 높이고, 코드 이해도를 높인다.
- **Lazy Evaluation(지연 평가) (선택적 특징)**
    - 필요한 시점까지 계산을 미루는 평가 전략이다.
    - 불필요한 계산 비용을 줄인다.

대표적인 순수 함수형 프로그래밍 언어로는 Haskell이 있다. Java, JavaScript, Python 등의 전통적인 언어들은 순수한 함수형 프로그래밍 언어는 아니지만, 람다 표현식, 고차 함수 등 함수형 스타일을 점진적으로 지원함으로써, 함수형 프로그래밍의 장점을 활용한다.

## 자바와 함수형 프로그래밍1

이제 함수형 프로그래밍의 특징을 예제로 살펴보자.

### 순수 함수

- 같은 인자를 주면 항상 같은 결과를 반환하는 함수이다.
- 외부 상태(변할 수 있는 전역 변수 등)에 의존하거나, 외부 상태를 변경하는 부수 효과(Side Effect)가 없는 함수를 의미한다.

``` java
package functional;

import java.util.function.Function;

public class PureFunctionMain1 {
    public static void main(String[] args) {
        Function<Integer, Integer> func = x -> x * 2;
        System.out.println("result1 = " + func.apply(10));
        System.out.println("result2 = " + func.apply(10));
    }
}
```

위의 코드처럼 같은 입력을 넣었을 때 항상 같은 결과가 나온다. 즉, 우리가 수학시간때 배웠던 그 함수를 떠오르면 된다.

### 부수 효과 최소화

- 함수형 프로그래밍에서는 상태 변화를 최소화하기 위해 변수나 객체를 변경하는 것을 지양한다.
- 이로 인해 프로그램의 버그가 줄어들고, 테스트나 병렬 처리(Parallelism), 동시성(Concurrency) 지원이 용이해 진다.

``` java
package functional;

import java.util.function.Function;

public class SideEffectMain3 {
    public static void main(String[] args) {
        Function<Integer, Integer> func = x -> x * 2;
        int x = 10;

        Integer result = func.apply(10);

        System.out.println("x = " + x + ", result = " + result);
    }
}
```

이 예제에서는 **연산을 담당하는 함수(func)가 외부 상태를 전혀 수정하지 않는 순수 함수**이고, 출력(부수 효과)은 필요한 시점에만 별도로 수행한다. 이렇게 **연산(순수 함수)과 외부 동작(부수 효과)을 명확히 분리함으로써** 순수 함수를 유지할 수 있다.

또 다른 예시를 보자.

``` java
package functional;

import java.util.ArrayList;
import java.util.List;

public class SideEffectListMain {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        list1.add("apple");
        list1.add("banana");

        System.out.println("before list1 = " + list1);
        changeList1(list1);
        System.out.println("after list1 = " + list1);

        List<String> list2 = new ArrayList<>();
        list2.add("apple");
        list2.add("banana");

        System.out.println("before list2 = " + list2);
        List<String> result = changeList2(list2);
        System.out.println("after list2 = " + list2);
        System.out.println("result = " + result);
    }

    private static void changeList1(List<String> list) {
        for (int i = 0; i < list.size(); i++) {
            list.set(i, list.get(i) + "_complete");
        }
    }

    private static List<String> changeList2(List<String> list) {
        List<String> newList = new ArrayList<>();

        for (String s : list) {
            newList.add(s + "_complete");
        }

        return newList;
    }
}
```

여기서 `changeList2` 메서드가 순수 함수인 것이다.

> ✅ 참고
>
> 콘솔도 외부이다. 그래서 함수 내에 콘솔을 출력하는 기능이 있다면 부수효과로 순수함수에 어긋난다. 왜냐하면 해당 함수를 호출할때마다 콘솔이라는 세상에 영향을 미치기 때문이다.

## 자바와 함수형 프로그래밍2

### 불변성 지향

- 데이터는 생성된 후 가능한 한 변경하지 않고, 변경이 필요한 경우 새로운 값을 생성해서 사용한다.
- 가변 데이터 구조에서 발생할 수 있는 오류를 줄이고, 프로그램의 예측 가능성을 높여준다.
- 불변성은 데이터를 변경하지 않기 때문에 부수 효과와도 관련이 있다.

그럼 예제를 살펴보자. 이 예제는 이전에 불변 객체에서 많이 보았던 예제일 것이다.

``` java
package functional;

public final class MutablePerson {

    private String name;

    private int age;

    public MutablePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "MutablePerson{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

``` java
package functional;

public final class ImmutablePerson {

    private final String name;

    private final int age;

    public ImmutablePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    public ImmutablePerson withAge(int newAge) {
        return new ImmutablePerson(name, newAge);
    }

    @Override
    public String toString() {
        return "MutablePerson{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

위와 같이 값을 변경할 수 있는 객체와 불변 객체를 만들었다. 그럼 이를 사용하는 예제를 보자.

``` java
package functional;

public class ImmutableMain1 {
    public static void main(String[] args) {
        MutablePerson m1 = new MutablePerson("Kim", 10);
        MutablePerson m2 = m1;
        m2.setAge(20);
        System.out.println("m1 = " + m1);
        System.out.println("m2 = " + m2);

        ImmutablePerson i1 = new ImmutablePerson("Lee", 20);
        ImmutablePerson i2 = i1.withAge(21);
        System.out.println("i1 = " + i1);
        System.out.println("i2 = " + i2);
    }
}
```

m1과 m2는 같은 참조 값을 공유하기 때문에 사이드 이펙트가 발생하지만 i1과 i2는 새 객체를 생성하기에 사이드 이펙트가 터지지 않는다.

그럼 또 다른 예제를 살펴보자.

``` java
package functional;

import java.util.List;

public class ImmutableMain2 {
    public static void main(String[] args) {
        MutablePerson m1 = new MutablePerson("Kim", 10);
        MutablePerson m2 = new MutablePerson("Lee", 20);

        List<MutablePerson> originList = List.of(m1, m2);
        System.out.println("originList = " + originList);
        List<MutablePerson> resultList = originList.stream()
                .map(p -> {
                    p.setAge(p.getAge() + 1);
                    return p;
                })
                .toList();

        System.out.println("=== 실행 후 ===");
        System.out.println("originList = " + originList);
        System.out.println("resultList = " + resultList);
    }
}
```

위의 코드를 보면 사이드 이펙트가 터진다. 왜냐하면 기존 원본 리스트에 요소의 값을 변경하기에 원본 리스트가 변경된다. 즉, 순수 함수도 아니고 사이드 이펙트가 터지는 안 좋은 결과가 발생한다.

``` java
package functional;

import java.util.List;

public class ImmutableMain3 {
    public static void main(String[] args) {
        ImmutablePerson i1 = new ImmutablePerson("Kim", 10);
        ImmutablePerson i2 = new ImmutablePerson("Lee", 20);

        List<ImmutablePerson> originList = List.of(i1, i2);
        System.out.println("originList = " + originList);
        List<ImmutablePerson> resultList = originList.stream()
                .map(p -> p.withAge(p.getAge() + 1))
                .toList();

        System.out.println("=== 실행 후 ===");
        System.out.println("originList = " + originList);
        System.out.println("resultList = " + resultList);
    }
}
```

위와 같이 작성하면 원본 리스트는 변경 안되고 새로운 리스트로 반환되는 것이다. 이런 사항을 실무에서도 엄청 주의해야 한다. DB와 연동하는 부분에서는 더더욱 말이다.

## 자바와 함수형 프로그래밍3

### 일급 시민(First-class Citizen) 함수

- 함수가 일반 값(숫자, 문자열, 객체(자료구조) 등)과 동일한 지위를 가진다.
- 함수를 변수에 대입하거나, 다른 함수의 인자로 전달하거나, 함수에서 함수를 반환하는 고차 함수(Higher-order Function)를 자유롭게 사용할 수 있다.

``` java
package functional;

import java.util.function.UnaryOperator;

public class FirstClassCitizenMain {
    public static void main(String[] args) {
        UnaryOperator<Integer> func = x -> x * 2;

        applyFunction(10, func);
        getFunc().apply(10);
    }

    public static Integer applyFunction(Integer input, UnaryOperator<Integer> func) {
        return func.apply(input);
    }

    public static UnaryOperator<Integer> getFunc() {
        return x -> x * 2;
    }
}
```

### 선언형(Declarative) 접근

- **어떻게**가 아닌 **무엇**을 계산할지 기술한다.
- 복잡한 제어 구조나 상태 관리를 함수의 합성과 함수 호출로 대체하여 간결하고 가독성 높은 코드를 작성한다.

``` java
package functional;

import java.util.ArrayList;
import java.util.List;

public class DeclarativeMain {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> result1 = new ArrayList<>();
        for (int number : numbers) {
            if (number % 2 == 0) {
                result1.add(number * number);
            }
        }
        System.out.println("Imperative Result: " + result1);

        List<Integer> result2 = numbers.stream()
                .filter(number -> number % 2 == 0)
                .map(number -> number * number)
                .toList();
        System.out.println("Declarative Result: " + result2);
    }
}
```

스트림 API를 통해 추상화를 하여 무엇을 하느냐에 집중하는 코드를 만들었다. 즉, 선언적 프로그래밍에 표본을 보였다고 할 수 있다.

### 함수 합성

- 간단한 함수를 조합해 더 복잡한 함수를 만드는 것을 권장한다.
- 작은 단위의 함수들을 체이닝(Chaining)하거나 파이프라이닝(Pipelining)해서 재사용성을 높이고, 코드 이해도를 높인다.

그럼 예제를 살펴보자.

``` java
package functional;

import java.util.function.Function;
import java.util.function.UnaryOperator;

public class CompositionMain1 {
    public static void main(String[] args) {
        UnaryOperator<Integer> square = x -> x * x;
        UnaryOperator<Integer> add = x -> x + 1;

        Function<Integer, Integer> newFunc1 = square.compose(add);
        System.out.println("newFunc1 결과: " + newFunc1.apply(2));

        Function<Integer, Integer> newFunc2 = square.andThen(add);
        System.out.println("newFunc2 결과: " + newFunc2.apply(2));
    }
}
```

- `compose`는 **뒤쪽 함수 -> 앞쪽 함수** 순으로 적용한다.
- `andThen`은 **앞쪽 함수 -> 뒤쪽 함수** 순으로 적용한다.
- 이렇게 작은 함수를 여러 개 조합해 새로운 함수를 만들어내는 것이 **함수 합성**이다.

### Lazy Evaluation(지연 평가) (선택적 특징)

- 필요한 시점까지 계산을 미루는 평가 전략이다.
- 불필요한 계산 비용을 줄인다.

우리가 이전에 배운 스트림 API를 생각하면 쉬울 것이다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!