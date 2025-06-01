---
title: "[자바 고급3] 메서드 참조"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-01 12:44:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 메서드 참조가 필요한 이유

이번에는 특정 상황에서 람다를 좀 더 편리하게 사용할 수 있는 **메서드 참조(Method References)**에 대해 알아보자.

``` java
package methodref.start;

import java.util.function.BinaryOperator;

public class MethodRefStartV1 {
    public static void main(String[] args) {
        BinaryOperator<Integer> add1 = (x, y) -> x + y;
        BinaryOperator<Integer> add2 = (x, y) -> x + y;

        Integer result1 = add1.apply(1, 2);
        System.out.println("result1 = " + result1);

        Integer result2 = add1.apply(1, 2);
        System.out.println("result2 = " + result2);
    }
}
```

위와 같은 코드가 있다고 해보자. 그런데 지금 `add1`과 `add2`는 중복된 코드인 것을 확인할 수 있다. 즉, 동일한 기능을 하는 람다를 여러 번 작성해야 하며, 코드가 중복되어 있어 유지보수가 어려울 수 있다. 그럼 이런 중복을 한번 해결해보자.

``` java
package methodref.start;

import java.util.function.BinaryOperator;

public class MethodRefStartV2 {
    public static void main(String[] args) {
        BinaryOperator<Integer> add1 = (x, y) -> add(x, y);
        BinaryOperator<Integer> add2 = (x, y) -> add(x, y);

        Integer result1 = add1.apply(1, 2);
        System.out.println("result1 = " + result1);

        Integer result2 = add1.apply(1, 2);
        System.out.println("result2 = " + result2);
    }

    private static int add(int x, int y) {
        return x + y;
    }
}
```

람다의 본문 내용을 메서드로 추출하고 람다에서는 해당 메서드만 호출하는 형식으로 변경을 하였다. 덕분에 로직이 한 곳으로 모여 유지보수가 쉬워졌다. 하지만 여전히 아쉬운 점이 존재한다. 람다를 작성할 때마다 `(x, y) -> add(x, y)` 형태의 코드를 반복해서 작성해야 하며, 매개변수를 전달하는 부분이 장황하다는 것이다. 그러면 이런 문제를 어떻게 해결할까? 바로 메서드 참조를 통해 해결이 가능하다.

``` java
package methodref.start;

import java.util.function.BinaryOperator;

public class MethodRefStartV3 {
    public static void main(String[] args) {
        BinaryOperator<Integer> add1 = MethodRefStartV3::add;
        BinaryOperator<Integer> add2 = MethodRefStartV3::add;

        Integer result1 = add1.apply(1, 2);
        System.out.println("result1 = " + result1);

        Integer result2 = add1.apply(1, 2);
        System.out.println("result2 = " + result2);
    }

    private static int add(int x, int y) {
        return x + y;
    }
}
```

**메서드 참조(Method Reference)** 문법인 `클래스명::메서드명`을 사용하여 `(x, y) -> add(x, y)`라는 람다를 더욱 간단하게 표현했다.

### 메서드 참조 장점

- 메서드 참조를 사용하면 코드가 더욱 간결해지고, 가독성이 향상된다.
- 더 이상 매개변수를 명시적으로 작성할 필요가 없다.
    - 컴파일러가 자동으로 매개변수를 매칭한다.
- 별도의 로직 분리와 함께 재사용성 역시 높아진다.

메서드 참조는 쉽게 말해서, **"이미 정의된 메서드를 그대로 참조하여 람다 표현식을 더 간결하게 작성하는 방법"** 이라고 할 수 있다. 예를 들어 `(x, y) -> add(x, y)`라는 람다는 사실상 매개변수 `x`,`y`를 그대로 `add` 메서드에 전달하기만 하는 코드이므로, `클래스명::메서드명` 형태의 메서드 참조로 간단히 표현할 수 있다. 이렇게 하면 불필요한 매개변수 선언 없이 코드가 깔끔해지고, 가독성도 높아진다.

## 메서드 참조1 - 시작

메서드 참조(Method Reference)는 **"이미 정의된 메서드를 람다처럼 간결하게 표현"** 할 수 있게 해주는 문법이다. 즉, 람다 내부에서 단순히 어떤 메서드(정적/인스턴스/생성자 등)를 호출만하고 있을 경우, 다음과 같은 형태로 **메서드 참조**를 사용할 수 있다.

``` java
(x, y) -> 클래스명.메서드명(x, y) // 기존 람다
클래스명::메서드명 // 메서드 참조
```

람다의 동작과 메서드 참조의 동작은 동일하다. 그냥 메서드 참조기 기존 람다를 더욱 축약해준다는 느낌을 받으면 좋을 것 같다.

### 메서드 참조의 유형

#### 정적 메서드 참조

- 설명: 이름 그대로 정적(static) 메서드를 참조한다.
- 문법: `클래스명::메서드명`
- 예: `Math::max`,`Integer::parseInt`등

#### 특정 객체의 인스턴스 메서드 참조

- 설명: 이름 그대로 특정 객체의 인스턴스 메서드를 참조한다.
- 문법: `객체명::인스턴스메서드명`
- 예: `person::introduce`,`person::getName`등

#### 생성자 참조

- 설명: 이름 그대로 생성자를 참조한다.
- 문법: `클래스명::new`
- 예: `Person::new`

#### 임의의 객체의 인스턴스 참조

- 설명: 첫 번째 매개변수(또는 해당 람다가 받을 대상)가 그 메서드를 호출하는 객체가 된다.
- 문법: `클래스명::인스턴스메서드명`
- 예: `Person::introduce` , 같은 람다: `(Person p) -> p.introduce()`

그러면 코드로 한번 살펴보자.

``` java
package methodref;

public class Person {

    private String name;

    public Person() {
        this("Unknown");
    }

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static String greeting() {
        return "Hello";
    }

    public static String greetingWithName(String name) {
        return "Hello " + name;
    }

    public String introduce() {
        return "I am " + name;
    }

    public String introduceWithNumber(int number) {
        return "I am " + name + ", my number is " + number;
    }
}
```

위와 같은 코드가 있다고 하자. 이를 활용한 메서드 참조 코드를 아래와 같이 작성했다. 딱 보면 람다와 메서드 참조 2가지 경우로 나누었으니 한번 살펴보면 이해가 될 것이다.

``` java
package methodref;

import java.util.function.Supplier;

public class MethodRefEx1 {
    public static void main(String[] args) {
        Supplier<String> staticMethod1 = () -> Person.greeting();
        Supplier<String> staticMethod2 = Person::greeting;

        System.out.println("staticMethod1 = " + staticMethod1.get());
        System.out.println("staticMethod2 = " + staticMethod2.get());

        Person person = new Person("Kim");
        Supplier<String> instanceMethod1 = () -> person.introduce();
        Supplier<String> instanceMethod2 = person::introduce;

        System.out.println("instanceMethod1 = " + instanceMethod1.get());
        System.out.println("instanceMethod2 = " + instanceMethod2.get());

        Supplier<Person> newPerson1 = () -> new Person();
        Supplier<Person> newPerson2 = Person::new;

        System.out.println("newPerson1 = " + newPerson1.get());
        System.out.println("newPerson2 = " + newPerson2.get());
    }
}
```

### 메서드 참조에서 `()`를 사용하지 않는 이유

- 메서드 참조의 문법을 잘 보면 뒤에 메서드 명 뒤에 `()`가 없다.
- `()`는 메서드를 즉시 호출한다는 의미를 가진다. 여기서 `()` 가 없는 것은 메서드 참조를 하는 시점에는 메서드를 호출하는게 아니라 단순히 **메서드의 이름으로 해당 메서드를 참조만 한다는 뜻**이다.
    - 해당 메서드의 실제 호출 시점은 함수형 인터페이스를 통해서 이후에 이루어진다.

## 메서드 참조2 - 매개변수1

메서드에 매개변수가 있는 경우 메서드 참조로 변환할때 어떻게 하는지 살펴보자.

``` java
package methodref;

import java.util.function.Function;

public class MethodRefEx2 {
    public static void main(String[] args) {
        Function<String, String> staticMethod1 = name -> Person.greetingWithName(name);
        Function<String, String> staticMethod2 = Person::greetingWithName;

        System.out.println("staticMethod1 = " + staticMethod1.apply("Kim"));
        System.out.println("staticMethod2 = " + staticMethod2.apply("Kim"));

        Person instance = new Person("Kim");
        Function<Integer, String> instanceMethod1 = n -> instance.introduceWithNumber(n);
        Function<Integer, String> instanceMethod2 = instance::introduceWithNumber;

        System.out.println("instanceMethod1 = " + instanceMethod1.apply(1));
        System.out.println("instanceMethod2 = " + instanceMethod2.apply(1));

        Function<String, Person> supplier1 = name -> new Person(name);
        Function<String, Person> supplier2 = Person::new;

        System.out.println("newPerson = " + supplier1.apply("Kim"));
        System.out.println("newPerson = " + supplier2.apply("Lee"));
    }
}
```

여기서 보면 기존 매개변수가 없는 메서드 참조형태랑 완전히 같다. 그러면 자바는 이를 어떻게 매개변수가 있는 메서드라고 인식할 수 있을까? 바로 타입 타켓팅을 통해 함수형 인터페이스 타입을 보고 확인이 가능하다.

### 메서드 참조에서 매개변수를 생략하는 이유

함수형 인터페이스의 시그니처(매개변수와 반환 타입)가 이미 정해져 있고, 컴파일러가 그 시그니처를 바탕으로 메서드 참조와 연결해 주기 때문에 명시적으로 매개변수를 작성하지 않아도 자동으로 추론되어 호출된다.

## 메서드 참조3 - 임의 객체의 인스턴스 메서드 참조

예제 코드를 먼저 살펴보자.

``` java
package methodref;

import java.util.function.Function;

public class MethodRefEx3 {
    public static void main(String[] args) {
        Person person1 = new Person("Kim");
        Person person2 = new Person("Park");
        Person person3 = new Person("Lee");

        Function<Person, String> fun1 = (Person person) -> person.introduce();
        System.out.println("person1.introduce = " + fun1.apply(person1));
        System.out.println("person2.introduce = " + fun1.apply(person2));
        System.out.println("person3.introduce = " + fun1.apply(person3));

        // 메서드 참조, 타입이 첫 번째 매개변수가 됨, 그리고 첫 번째 매개변수의 메서드를 호출, 나머지는 순서대로 매개변수에 전달
        Function<Person, String> fun2 = Person::introduce;
        System.out.println("person1.introduce = " + fun2.apply(person1));
        System.out.println("person2.introduce = " + fun2.apply(person2));
        System.out.println("person3.introduce = " + fun2.apply(person3));
    }
}
```

먼저 코드를 하나하나 분석해보자. 먼저 람다식을 분석하자.

``` java
Function<Person, String> fun1 = (Person person) -> person.introduce()
```

- 해당 람다는 `Person`이라는 파라미터를 받아서 해당 인스턴스 메서드를 호출하는 형태이다.

``` java
System.out.println("person1.introduce = " + fun1.apply(person1));
System.out.println("person2.introduce = " + fun1.apply(person2));
System.out.println("person3.introduce = " + fun1.apply(person3));
```

그리고 사용하는 쪽에서는 `apply`메서드 인자로 `Person` 인스턴스를 넘겨줌으로 해당 인스턴스 메서드를 호출한다. 이 람다는 **매개변수로 지정한 특정 타입의 객체에 대해 동일한 메서드를 호출**하는 패턴을 보인다. 조금 더 풀어서 이야기하면 매개변수로 지정한 **특정 타입의 임의 객체의 인스턴스 메서드를 참조**한다.

- **매개변수로 지정한 특정 타입**: `Person`
- **임의 객체**: `person1`,`person2`,`person3` 또는 `Person` 타입을 구현한 어떠한 객체든 해당 람다에 전달할 수 있음
- **인스턴스 메서드**: `introduce()`

이렇게 특정 타입의 임의 객체에 대해 동일한 인스턴스 메서드를 호출하는 패턴을 메서드 참조로 손쉽게 표현할 수 있다.

``` java
Function<Person, String> fun2 = Person::introduce;
```

### 임의 객체의 인스턴스 메서드 참조

임의 객체의 인스턴스 참조는 `클래스명::인스턴스메서드` 예) `Person::introduce`와 같이 사용한다.

> ⚠️ 주의
>
> 왼쪽이 **클래스명**이고, 오른쪽이 **인스턴스 메서드**이다!

즉, `Person::introduce`와 같이 선언하면 다음과 같은 람다가 된다.

``` java
Person::introduce
1. 왼쪽에 지정한 클래스를 람다의 첫 번째 매개변수로 사용한다.
(Person person)

2. 오른쪽에 지정한 '인스턴스 메서드'를 첫 번째 매개변수를 통해 호출한다.
(Person person) -> person.introduce()
```

그럼 전체적으로 한번 정리해보자.

- 정적 메서드 참조 `클래스명::클래스메서드(Person::greeting)`
- 특정 객체의 인스턴스 메서드 참조: `객체명::인스턴스메서드(person::introduce)`
- 생성자 참조: `클래스명::new(Person::new)`
- 임의 객체의 인스턴스 메서드 참조: `클래스명::인스턴스메서드(Person::introduce)`

여기서 헷갈리만한게 바로 '특정 객체의 인스턴스 메서드 참조'와 '임의 객체의 인스턴스 메서드 참조'이다.

**특정 객체의 인스턴스 메서드 참조**는 메서드 참조를 선언할 때 부터 이름 그대로 특정 객체(인스턴스)를 지정해야 하므로, 특정 객체의 인스턴스 메서드 참조는 선언 시점부터 이미 인스턴스가 지정되어 있다. 따라서 람다를 실행하는 시점에 인스턴스를 변경할 수 없다.

**임의 객체의 인스턴스 메서드 참조**는 선언 시점에 호출할 인스턴스를 지정하지 않는다. 대신에 호출 대상을 매개변수로 선언해두고, 실행 시점에 호출할 인스턴스를 받는다. **실행 시점이 되어야 어떤 객체가 호출되는지 알 수 있으므로 "임의 객체의 인스턴스 메서드 참조"라 한다.**

즉 둘의 차이점은 간략히 말하면 다음과 같다.

- **특정 객체의 인스턴스 메서드 참조**는 선언 시점에 메서드를 호출할 **특정 객체**가 고정된다.
- **임의 객체의 인스턴스 메서드 참조**는 선언 시점에 메서드를 호출할 특정 객체가 고정되지 않는다. 대신에 실행 시점에 인자로 넘긴 **임의의 객체**가 사용된다.

그런데 임의 객체의 인스턴스 메서드 참조는 꼭 필요해 보이지는 않는데, 왜 이런 기능을 자바가 제공할까? 사실 메서드 참조 중에는 이 기능이 가장 많이 사용된다.

## 메서드 참조4 - 활용1

임의 객체의 인스턴스 메서드 참조가 실제 어떻게 사용되는지 알아보자.

``` java
package methodref;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class MethodRefEx4 {
    public static void main(String[] args) {
        List<Person> personList = List.of(
                new Person("Kim"),
                new Person("Park"),
                new Person("Lee")
        );

        List<String> result1 = mapPersonToString(personList, (Person p) -> p.introduce());
        List<String> result2 = mapPersonToString(personList, Person::introduce);

        System.out.println("result1 = " + result1);
        System.out.println("result2 = " + result2);

        List<String> upperResult1 = mapStringToString(result1, (String s) -> s.toUpperCase());
        List<String> upperResult2 = mapStringToString(result2, String::toUpperCase);

        System.out.println("upperResult1 = " + upperResult1);
        System.out.println("upperResult2 = " + upperResult2);
    }

    private static List<String> mapPersonToString(List<Person> personList, Function<Person, String> fun) {
        List<String> result = new ArrayList<>();

        for (Person p : personList) {
            String applied = fun.apply(p);
            result.add(applied);
        }

        return result;
    }

    private static List<String> mapStringToString(List<String> strings, Function<String, String> fun) {
        List<String> result = new ArrayList<>();

        for (String s : strings) {
            String applied = fun.apply(s);
            result.add(applied);
        }

        return result;
    }
}
```

람다 대신에 메서드 참조를 사용한 덕분에 코드가 더 간결해지고, 의도가 더 명확하게 드러나는 것을 확인할 수 있다. 우리가 앞서 만든 스트림을 사용하면 리스트에 들어있는 다양한 데이터를 더 쉽게 변환할 수 있을 것 같다. 한 번 시도해 보자.

## 메서드 참조5 - 활용2

이번에는 스트림에 메서드 참조를 활용해보자.

``` java
package methodref;

import lambda.lambda5.mystream.MyStreamV3;

import java.util.List;

public class MethodRefEx5 {
    public static void main(String[] args) {
        List<Person> personList = List.of(
                new Person("Kim"),
                new Person("Park"),
                new Person("Lee")
        );

        List<String> result1 = MyStreamV3.of(personList)
                .map(person -> person.introduce())
                .map(str -> str.toUpperCase())
                .toList();

        System.out.println("result1 = " + result1);

        List<String> result2 = MyStreamV3.of(personList)
                .map(Person::introduce)
                .map(String::toUpperCase)
                .toList();

        System.out.println("result2 = " + result2);
    }
}
```

메서드 참조를 통해 람다식 보다 더 간결하게 표현할 수 있는 것을 알 수 있다.

### 메서드 참조 장점

서드 참조를 사용하면 람다 표현식을 더욱 직관적으로 표현할 수 있으며, 각 처리 단계에서 호출되는 메서드가 무엇인지 쉽게 파악할 수 있다. 이처럼 **람다**로도 충분히 표현할 수 있지만, 내부적으로 호출만 하는 간단한 람다라면 **메서드 참조**가 더 짧고 명확하게 표현될 수 있다. 이런 방식은 코드 가독성을 높이는 장점이 있다.

그리고 메서드 참조가 익숙하지 않는다면 IDE의 도움을 받자! 람다로 표현하면 인텔리제이 같은 IDE에서 경고표시로 메서드 참조로 변경하라고 해준다.

## 메서드 참조6 - 매개변수2

이번에는 임의 객체의 인스턴스 메서드 참조에서 매개변수가 늘어나면 어떻게 되는지 알아보자.

``` java
package methodref;

import java.util.function.BiFunction;

public class MethodRefEx6 {
    public static void main(String[] args) {
        Person person = new Person("Kim");

        BiFunction<Person, Integer, String> fun1 = (Person p, Integer number) -> p.introduceWithNumber(number);
        System.out.println("person.introduceWithNumber = " + fun1.apply(person, 1));

        BiFunction<Person, Integer, String> fun2 = Person::introduceWithNumber;
        System.out.println("person.introduceWithNumber = " + fun2.apply(person, 1));
    }
}
```

여기서 유심히 봐야할 부분은 `fun2`에서는 `Person::introduceWithNumber`라는 메서드 참조를 사용한다. 첫 번째 매개변수(`Person`)가 메서드를 호출하는 객체가 되고, 두 번째 매개변수(`Integer`)가 `introduceWithNumber()`의 실제 인자로 전달된다. 첫 번째 이후의 매개변수는 모두 순서대로 실제 인자로 전달된다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!