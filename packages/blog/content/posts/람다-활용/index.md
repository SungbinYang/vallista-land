---
title: "[자바 고급3] 람다 활용"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-31 23:14:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 필터 만들기1

이제 람다를 바로 쓰기 보다는 활용하는 예제를 살펴보면서 익숙해지는 시간을 가져보자.

### 필터1

먼저 람다를 사용하지 않고, 짝수만 거르기, 홀수만 거르기 메서드를 각각 따로 작성해보자.

``` java
package lambda.lambda5.filter;

import java.util.ArrayList;
import java.util.List;

public class FilterMainV1 {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> evenNumbers = filterEvenNumber(numbers);
        System.out.println("evenNumbers = " + evenNumbers);

        List<Integer> oddNumbers = filterOddNumber(numbers);
        System.out.println("oddNumbers = " + oddNumbers);
    }

    private static List<Integer> filterEvenNumber(List<Integer> numbers) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer number : numbers) {
            boolean testResult = number % 2 == 0;

            if (testResult) {
                filtered.add(number);
            }
        }

        return filtered;
    }

    private static List<Integer> filterOddNumber(List<Integer> numbers) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer number : numbers) {
            boolean testResult = number % 2 == 1;

            if (testResult) {
                filtered.add(number);
            }
        }

        return filtered;
    }
}
```

지금 이제 독자들은 위의 코드를 보면 뭔가 중복되는게 보일 것이다. 이제 `filterEvenNumber` 메서드와 `filterOddNumber` 메서드를 하나의 메서드로 합쳐보면서 중복을 줄여보자.

### 필터2

``` java
package lambda.lambda5.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class FilterMainV2 {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        Predicate<Integer> evenPredicate = n -> n % 2 == 0;
        List<Integer> evenNumbers = filter(numbers, evenPredicate);
        System.out.println("evenNumbers = " + evenNumbers);

        Predicate<Integer> oddPredicate = n -> n % 2 == 1;
        List<Integer> oddNumbers = filter(numbers, oddPredicate);
        System.out.println("oddNumbers = " + oddNumbers);
    }

    private static List<Integer> filter(List<Integer> numbers, Predicate<Integer> predicate) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer number : numbers) {
            boolean testResult = predicate.test(number);

            if (testResult) {
                filtered.add(number);
            }
        }

        return filtered;
    }
}
```

우리가 이전에 배운 `Predicate` 함수형 인터페이스로 중복을 줄였다. 이제 코드를 조금 정리를 해보자.

### 필터3

``` java
package lambda.lambda5.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class FilterMainV3 {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> evenNumbers = filter(numbers, n1 -> n1 % 2 == 0);
        System.out.println("evenNumbers = " + evenNumbers);

        List<Integer> oddNumbers = filter(numbers, n -> n % 2 == 1);
        System.out.println("oddNumbers = " + oddNumbers);
    }

    private static List<Integer> filter(List<Integer> numbers, Predicate<Integer> predicate) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer number : numbers) {
            if (predicate.test(number)) {
                filtered.add(number);
            }
        }

        return filtered;
    }
}
```

필요 없는 변수도 제거하면서 가독성을 높였다.

> 람다의 경우 주로 간단한 식을 사용하므로, 복잡할 때를 제외하고는 변수를 잘 만들지 않는다.

## 필터 만들기2

앞서 만든 필터를 다른 곳에서도 사용할 수 있게 유틸성 클래스를 만들어보자.

``` java
package lambda.lambda5.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class IntegerFilter {

    public static List<Integer> filter(List<Integer> list, Predicate<Integer> predicate) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer num : list) {
            if (predicate.test(num)) {
                filtered.add(num);
            }
        }

        return filtered;
    }
}
```

위의 코드처럼 기존 `filter` 메서드를 유틸로 만들었다. 하지만 해당 코드의 아쉬운 점이 존재한다. 바로 `Integer` 타입밖에 사용할 수 없다는 점이다. 제네릭을 도입해서 여러 타입에서 쓸 수 있게 만들어보자.

``` java
package lambda.lambda5.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class GenericFilter {

    public static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
        List<T> filtered = new ArrayList<>();

        for (T num : list) {
            if (predicate.test(num)) {
                filtered.add(num);
            }
        }

        return filtered;
    }
}
```

`GenericFilter`는 제네릭을 사용할 수 있는 모든 타입의 리스트를 람다 조건으로 필터링 할 수 있다. 따라서 매우 유연한 필터링 기능을 제공한다. 즉, 기존의 메서드를 제네릭 메서드로 변경한 것이다. 이로써 다른 곳에서도 널리 쓸 수 있는 유틸을 우리가 만든 것이다.

## 맵 만들기1

맵(map)은 대응, 변환을 의미하는 매핑(mapping)의 줄임말이다. 매핑은 어떤 것을 다른 것으로 변환하는 과정을 의미한다. 프로그래밍에서는 각 요소를 다른 값으로 변환하는 작업을 매핑(mapping, map)이라 한다. 쉽게 이야기해서 어떤 하나의 데이터를 다른 데이터로 변환하는 작업이라고 생각하면 된다.

그러면 이제 필터처럼 직접 만들어보자. 처음에는 람다를 사용하지 말고 작성해보자.

``` java
package lambda.lambda5.map;

import java.util.ArrayList;
import java.util.List;

public class MapMainV1 {
    public static void main(String[] args) {
        List<String> list = List.of("1", "12", "123", "1234");

        List<Integer> numbers = mapStringToInteger(list);
        System.out.println("numbers = " + numbers);

        List<Integer> lengths = mapStringToLength(list);
        System.out.println("lengths = " + lengths);
    }

    private static List<Integer> mapStringToInteger(List<String> list) {
        List<Integer> numbers = new ArrayList<>();

        for (String s : list) {
            Integer value = Integer.valueOf(s);
            numbers.add(value);
        }

        return numbers;
    }

    private static List<Integer> mapStringToLength(List<String> list) {
        List<Integer> numbers = new ArrayList<>();

        for (String s : list) {
            Integer value = s.length();
            numbers.add(value);
        }

        return numbers;
    }
}
```

이제 위의 코드의 중복을 람다를 이용해서 제거해보자.

``` java
package lambda.lambda5.map;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class MapMainV2 {
    public static void main(String[] args) {
        List<String> list = List.of("1", "12", "123", "1234");

        Function<String, Integer> toNumber = Integer::valueOf;
        List<Integer> numbers = map(list, toNumber);
        System.out.println("numbers = " + numbers);

        Function<String, Integer> toLength = String::length;
        List<Integer> lengths = map(list, toLength);
        System.out.println("lengths = " + lengths);
    }

    private static List<Integer> map(List<String> list, Function<String, Integer> mapper) {
        List<Integer> numbers = new ArrayList<>();

        for (String s : list) {
            Integer value = mapper.apply(s);
            numbers.add(value);
        }

        return numbers;
    }
}
```

이제 사용하지 않는 변수를 정리하면서 마무리를 해보자.

``` java
package lambda.lambda5.map;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class MapMainV3 {
    public static void main(String[] args) {
        List<String> list = List.of("1", "12", "123", "1234");

        List<Integer> numbers = map(list, Integer::valueOf);
        System.out.println("numbers = " + numbers);

        List<Integer> lengths = map(list, String::length);
        System.out.println("lengths = " + lengths);
    }

    private static List<Integer> map(List<String> list, Function<String, Integer> mapper) {
        List<Integer> numbers = new ArrayList<>();

        for (String s : list) {
            numbers.add(mapper.apply(s));
        }

        return numbers;
    }
}
```

## 맵 만들기2

앞서 만든 `map()` 메서드는 매개변수가 `List<String> list, Function<String, Integer> mapper` 이다. 따라서 문자열 리스트를 숫자 리스트로 변환(매핑)할 때 사용할 수 있다. 다양한 곳에서 활용할 수 있으므로, 별도의 유틸리티 클래스로 만들어보자.

``` java
package lambda.lambda5.map;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class StringToIntegerMapper {

    public static List<Integer> map(List<String> list, Function<String, Integer> mapper) {
        List<Integer> results = new ArrayList<>();

        for (String s : list) {
            results.add(mapper.apply(s));
        }

        return results;
    }
}
```

이제 필터처럼 다양한 타입에 적용할 수 있게 제네릭 메서드를 도입해보자.

``` java
package lambda.lambda5.map;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class GenericMapper {

    public static <T, R> List<R> map(List<T> list, Function<T, R> mapper) {
        List<R> results = new ArrayList<>();

        for (T s : list) {
            results.add(mapper.apply(s));
        }

        return results;
    }
}
```

## 필터와 맵 활용1

필터와 맵을 이용하여 기존 리스트에 짝수를 분류하고 해당 짝수를 각각 2배 증가시키자!

아래의 예제는 우리가 이전에 만든 유틸을 이용한 방법과 순수 작성 방법 2가지를 만들어보자.

``` java
package lambda.lambda5.mystream;

import lambda.lambda5.filter.GenericFilter;
import lambda.lambda5.map.GenericMapper;

import java.util.ArrayList;
import java.util.List;

public class Ex1_Number {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> directResult = direct(numbers);
        System.out.println("directResult = " + directResult);

        List<Integer> lambdaResult = lambda(numbers);
        System.out.println("lambdaResult = " + lambdaResult);
    }

    private static List<Integer> direct(List<Integer> numbers) {
        List<Integer> result = new ArrayList<>();

        for (Integer number : numbers) {
            if (number % 2 == 0) {
                int numberX2 = number * 2;
                result.add(numberX2);
            }
        }

        return result;
    }

    private static List<Integer> lambda(List<Integer> numbers) {
        List<Integer> filteredList = GenericFilter.filter(numbers, n -> n % 2 == 0);
        List<Integer> mappedList = GenericMapper.map(filteredList, n -> n * 2);

        return mappedList;
    }
}
```

`direct()`와 `lambda()`는 서로 다른 프로그래밍 스타일을 보여준다.

`direct()`는 프로그램을 **어떻게** 수행해야 하는지 수행 절차를 명시한다.

- 쉽게 이야기해서 개발자가 로직 하나하나를 **어떻게** 실행해야 하는지 명시한다.
- 이런 프로그래밍 방식을 **명령형 프로그래밍**이라 한다.
- 명령형 스타일은 익숙하고 직관적이나, 로직이 복잡해질수록 반복 코드가 많아질 수 있다.

`lambda()`는 **무엇을** 수행해야 하는지 원하는 결과에 초점을 맞춘다.

- 쉽게 이야기해서 특정 조건으로 필터하고, 변환하라고 선언하면, 구체적인 부분은 내부에서 수행된다.
- 개발자는 필터하고 변환하는 것 즉 무엇을 해야 하는가에 초점을 맞춘다.
    - 예를 들어 실제 어떻게 for문과 if문 등을 사용해서 필터하고 변환할지를 개발자가 크게 신경쓰지 않는다.
- 이런 프로그래밍 방식을 **선언적 프로그래밍**이라 한다.
- 선언형 스타일은 **무엇**을 하고자 하는지가 명확히 드러난다. 따라서 코드 가독성과 유지보수가 쉬워진다.
    - 여기서는 필터하고 변환하는 것에만 초점을 맞춘다. 실제 어떻게 필터하고 변환할지는 해당 기능을 사용하는 입장에서는 신경쓰지 않는다.

### 명령형 vs 선언적 프로그래밍

- 명령형 프로그래밍 (Imperative Programming)
    - **정의:** 프로그램이 **어떻게(How)** 수행되어야 하는지, 즉 **수행 절차**를 명시하는 방식이다.
    - **특징:**
        - **단계별 실행:** 프로그램의 각 단계를 명확하게 지정하고 순서대로 실행한다.
        - **상태 변화:** 프로그램의 상태(변수 값 등)가 각 단계별로 어떻게 변화하는지 명시한다.
        - **낮은 추상화:** 내부 구현을 직접 제어해야 하므로 추상화 수준이 낮다.
        - **예시:** 전통적인 for 루프, while 루프 등을 명시적으로 사용하는 방식
    - **장점**: 시스템의 상태와 흐름을 세밀하게 제어할 수 있다.
- 선언적 프로그래밍 (Declarative Programming)
    - **정의:** 프로그램이 **무엇(What)**을 수행해야 하는지, 즉 **원하는 결과**를 명시하는 방식이다.
    - **특징:**
        - **문제 해결에 집중:** 어떻게(how) 문제를 해결할지보다 **무엇**을 원하는지에 초점을 맞춘다.
        - **코드 간결성:** 간결하고 읽기 쉬운 코드를 작성할 수 있다.
        - **높은 추상화:** 내부 구현을 숨기고 원하는 결과에 집중할 수 있도록 추상화 수준을 높인다.
        - **예시:** `filter`, `map` 등 람다의 고차 함수를 활용, HTML, SQL 등
    - **장점**: 코드가 간결하고, 의도가 명확하며, 유지보수가 쉬운 경우가 많다.

즉, 정리를 해보면 다음과 같다.

- **명령형 프로그래밍**은 프로그램이 수행해야 할 각 단계와 처리 과정을 상세하게 기술하여, **어떻게** 결과에 도달할지를 명시한다.
- **선언적 프로그래밍**은 원하는 결과나 상태를 기술하며, 그 결과를 얻기 위한 내부 처리 방식은 추상화되어 있어 개발자가 **무엇을** 원하는지에 집중할 수 있게 한다.
- 특히, **람다**와 같은 도구를 사용하면, 코드를 간결하게 작성하여 선언적 스타일로 문제를 해결할 수 있다.

나의 생각이지만 이런 선언적 프로그래밍이 객체지향 원칙과 함수형 프로그래밍의 핵심이라고 보인다. 이전에도 말했지만 **구체적인 것은 나중으로 미루자** 이것이 핵심인 것이다. 명령형은 구체적인 로직을 다 적는 방법이라면 선언적은 생성자의 의존성 주입처럼 구체화적인 로직에 신경쓰지 않고 무엇을 할지만 결정하는 것이다.

## 필터와 맵 활용2

그럼 조금 활용 예제를 만들어보자. 예제의 요구사항은 아래와 같다.

- 점수가 80점 이상인 학생의 이름을 추출해라.

그러면 `direct` 메서드는 명령형 프로그래밍 방식으로 `lambda`는 선언적 프로그래밍 방식으로 작성해보자.

``` java
package lambda.lambda5.mystream;

public class Student {

    private String name;

    private int score;

    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public int getScore() {
        return score;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", score=" + score +
                '}';
    }
}
```

일단 먼저 학생 클래스를 작성하였다. 이제 `main` 메서드를 작성해보자.

``` java
package lambda.lambda5.mystream;

import lambda.lambda5.filter.GenericFilter;
import lambda.lambda5.map.GenericMapper;

import java.util.ArrayList;
import java.util.List;

public class Ex2_Student {
    public static void main(String[] args) {
        List<Student> students = List.of(
                new Student("Apple", 100),
                new Student("Banana", 80),
                new Student("Berry", 50),
                new Student("Tomato", 40)
        );

        List<String> directResult = direct(students);
        System.out.println("directResult = " + directResult);

        List<String> lambdaResult = lambda(students);
        System.out.println("lambdaResult = " + lambdaResult);
    }

    private static List<String> direct(List<Student> students) {
        List<String> highScoreNames = new ArrayList<>();

        for (Student student : students) {
            if (student.getScore() >= 80) {
                String name = student.getName();
                highScoreNames.add(name);
            }
        }

        return highScoreNames;
    }

    private static List<String> lambda(List<Student> students) {
        List<Student> filtered = GenericFilter.filter(students, student -> student.getScore() >= 80);
        List<String> mapped = GenericMapper.map(filtered, Student::getName);

        return mapped;
    }
}
```

처음에는 먼저 학생의 리스트에 루프를 돌면서 점수가 80점 이상인지 확인한다. 80점 이상이면 해당 학생 객체를 새로운 리스트에 담는다. 그리고 그 리스트를 반환해서 해당 리스트의 학생의 이름을 출력하면 되는 것이다.

결론적으로 람다를 사용한 덕분에, 코드를 간결하게 작성하고, 선언적 스타일로 문제를 해결할 수 있었다.

## 스트림 만들기1

지금까지는 필터와 맵 기능을 별도의 유틸리티에서 각각 따로 제공했다. 그러다 보니, 각각 필터와 맵 메서드를 호출할 때마다 변수에 담아두고 매우 번거롭고 복잡한 과정을 거쳐야 했다. 필터와 맵을 어떻게 하나로 통합할 수 없을까?

### 스트림1

필터와 맵을 사용할 때를 떠올려보면 데이터들이 흘러가면서 필터되고, 매핑된다. 그래서 마치 데이터가 물 흐르듯이 흘러간다는 느낌을 받았을 것이다. 참고로 흐르는 좁은 시냇물을 영어로 스트림이라 한다.(IO에서 배운 스트림도 같은 뜻이다. 데이터가 흘러간다는 뜻이다. 하지만 여기서 설명하는 스트림이 IO 스트림은 아니다.) 이렇듯 데이터가 흘러가면서 필터도 되고, 매핑도 되는 클래스의 이름을 스트림(`Stream`)이라고 짓자.

``` java
package lambda.lambda5.mystream;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class MyStreamV1 {

    private List<Integer> internalList;

    public MyStreamV1(List<Integer> internalList) {
        this.internalList = internalList;
    }

    public MyStreamV1 filter(Predicate<Integer> predicate) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer element : internalList) {
            if (predicate.test(element)) {
                filtered.add(element);
            }
        }

        return new MyStreamV1(filtered);
    }

    public MyStreamV1 map(Function<Integer, Integer> mapper) {
        List<Integer> mapped = new ArrayList<>();

        for (Integer element : internalList) {
            mapped.add(mapper.apply(element));
        }

        return new MyStreamV1(mapped);
    }

    public List<Integer> toList() {
        return internalList;
    }
}
```

- 스트림은 자신의 데이터 리스트를 가진다. 여기서는 쉽게 설명하기 위해 `Integer`를 사용했다.
- 스트림은 자신의 데이터를 필터(`filter`)하거나 매핑(`map`)해서 새로운 스트림을 만들 수 있다.
    - 예를 들어서 필터를 하면 필터된 데이터를 기반으로 새로운 스트림이 만들어진다.
    - 예를 들어서 매핑을 하면 매핑된 데이터를 기반으로 새로운 스트림이 만들어진다.
- 스트림은 내부의 데이터 리스트를 `toList()`로 반환할 수 있다.

이제 이 스트림을 활용하는 코드를 작성해보자.

``` java
package lambda.lambda5.mystream;

import java.util.List;

public class MyStreamV1Main {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        returnValue(numbers);
    }

    private static void returnValue(List<Integer> numbers) {
        MyStreamV1 stream = new MyStreamV1(numbers);
        MyStreamV1 filteredStream = stream.filter(n -> n % 2 == 0);
        MyStreamV1 mappedStream = filteredStream.map(n -> n * 2);
        List<Integer> result = mappedStream.toList();
        System.out.println("result1 = " + result);
    }
}
```

``` java
MyStreamV1 stream = new MyStreamV1(numbers);
```

위의 코드의 플로우를 설명해보겠다. 먼저 위와 같이 스트림을 생성한다.

``` java
MyStreamV1 filteredStream = stream.filter(n -> n % 2 == 0);
```

다음으로 스트림에서 짝수만 필터를 적용한다. 그리고 필터링 된 리스트를 담은 스트림이 반환된다.

``` java
MyStreamV1 mappedStream = filteredStream.map(n -> n * 2);
```

다음으로 `map`을 적용하여 필터링된 요소마다 2배씩 곱한다. 그리고 그 리스트를 받은 새로운 스트림이 반환된다.

``` java
List<Integer> result = mappedStream.toList();
```

이제 해당 스트림의 내부 리스트를 반환한다.

뭔가 코드가 객체지향적으로 된 것을 볼 수 있다. 하지만 스트림 객체를 통해 필터와 맵을 편리하게 사용할 수 있는 것은 맞지만, 이전에 `GenericFilter`,`GenericMapper`와 비교해서 크게 편리해진 것 같지는 않다.

여기서 우리는 `filter`나 `map`에 반환 값으로 자기 자신을 반환시켰다. 이를 이용하면 메서드 체이닝으로 조금 더 간결하게 표현할 수 있다.

``` java
private static void methodChain(List<Integer> numbers) {
    List<Integer> result = new MyStreamV1(numbers)
        .filter(n -> n % 2 == 0)
        .map(n -> n * 2)
        .toList();

    System.out.println("result2 = " + result);
}
```

메서드 체이닝 덕분에 지저분한 변수들을 제거하고, 깔끔하게 필터와 맵을 사용할 수 있게 되었다.

## 스트림 만들기2

앞서 만든 스트림을 조금 더 다듬어보자. 여기서는 정적 팩토리(static factory) 메서드를 추가하자.

``` java
package lambda.lambda5.mystream;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class MyStreamV2 {

    private List<Integer> internalList;

    private MyStreamV2(List<Integer> internalList) {
        this.internalList = internalList;
    }

    public static MyStreamV2 of(List<Integer> internalList) {
        return new MyStreamV2(internalList);
    }

    public MyStreamV2 filter(Predicate<Integer> predicate) {
        List<Integer> filtered = new ArrayList<>();

        for (Integer element : internalList) {
            if (predicate.test(element)) {
                filtered.add(element);
            }
        }

        return MyStreamV2.of(filtered);
    }

    public MyStreamV2 map(Function<Integer, Integer> mapper) {
        List<Integer> mapped = new ArrayList<>();

        for (Integer element : internalList) {
            mapped.add(mapper.apply(element));
        }

        return MyStreamV2.of(mapped);
    }

    public List<Integer> toList() {
        return internalList;
    }
}
```

기존 `public` 생성자를 `private`으로 변경하고 `static` 메서드를 통하여 객체를 생성하게끔 변경하였다.

### 정적 팩토리 메서드

정적 팩토리 메서드는 객체 생성을 담당하는 static 메서드로, 생성자(constructor) 대신 인스턴스를 생성하고 반환하는 역할을 한다. 즉, 일반적인 생성자(Constructor) 대신에 클래스의 인스턴스를 생성하고 초기화하는 로직을 캡슐화하여 제공하는 정적(static) 메서드이다.

- **정적 메서드:** 클래스 레벨에서 호출되며, 인스턴스 생성 없이 접근할 수 있다.
- **객체 반환:** 내부에서 생성한 객체(또는 이미 존재하는 객체)를 반환한다.
- **생성자 대체:** 생성자와 달리 메서드 이름을 명시할 수 있어, 생성 과정의 목적이나 특징을 명확하게 표현할 수 있다.
- **유연한 구현:** 객체 생성 과정에서 캐싱, 객체 재활용, 하위 타입 객체 반환 등 다양한 로직을 적용할 수 있다.

생성자는 이름을 부여할 수 없다. 반면에 정적 팩토리 메서드는 의미있는 이름을 부여할 수 있어, 가독성이 더 좋아지는 장점이 있다. 참고로 인자들을 받아 간단하게 객체를 생성할 때는 주로 `of(...)`라는 이름을 사용한다.

그럼 언제 정적 팩토리 메서드를 사용하는게 좋을까? 만약 티켓이 있는데 골드 티켓이라면 추가적으로 포인트를 준다고 가정해보자. 그러면 일반 생성자로 작업한다면 아래와 같을 것이다.

``` java
Ticket normalTicket = new Ticket("일반");
Ticket goldTicket = new Ticket("골드", 2000);
```

이렇게 생성자만 보았을 때는 변수명을 봐야 어떤 티켓이고 이러한 정책이 있는지 예상이 간다. 하지만 개발자도 인간이기에 실수를 하여 잘못된 로직으로 흘러가게 할 수 있다. 그래서 이런 경우 정적 팩토리 메서드를 사용한다.

``` java
Ticket normalTicket = Ticket.createTicket("일반");
Ticket goldTicket = Ticket.createGoldTicket("골드", 2000);
```

정적 팩토리를 사용하면 메서드 이름으로 명확하게 티켓의 등급을 구분하여 실수를 조금아니마 방지할 수 있다.

> 추가로 객체를 생성하기 전에 이미 있는 객체를 찾아서 반환하는 것도 가능하다.
>
> 예)`Integer.valueOf()` : `-128 ~ 127` 범위는 내부에 가지고 있는 `Integer` 객체를 반환한다.

> ✅ 참고
>
> 정적 팩토리 메서드를 사용하면 생성자에 이름을 부여할 수 있기 때문에 보통 가독성이 더 좋아진다. 하지만 반대로 이야기하면 이름도 부여해야 하고, 준비해야 하는 코드도 더 많다. 객체의 생성이 단순한 경우에는 생성자를 직접 사용하는 것이 단순함의 관점에서 보면 더 나은 선택일 수 있다.

## 스트림 만들기3

이제 우리가 만든 스트림에 제네릭을 추가해보자.

``` java
package lambda.lambda5.mystream;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class MyStreamV3<T> {

    private List<T> internalList;

    private MyStreamV3(List<T> internalList) {
        this.internalList = internalList;
    }

    public static <T> MyStreamV3<T> of(List<T> internalList) {
        return new MyStreamV3<>(internalList);
    }

    public MyStreamV3<T> filter(Predicate<T> predicate) {
        List<T> filtered = new ArrayList<>();

        for (T element : internalList) {
            if (predicate.test(element)) {
                filtered.add(element);
            }
        }

        return MyStreamV3.of(filtered);
    }

    public <R> MyStreamV3<R> map(Function<T, R> mapper) {
        List<R> mapped = new ArrayList<>();

        for (T element : internalList) {
            mapped.add(mapper.apply(element));
        }

        return MyStreamV3.of(mapped);
    }

    public List<T> toList() {
        return internalList;
    }
}
```

이제 해당 스트림으로 필터와 맵을 연속해서 사용할 수 있다는 것을 보여주는 예를 보자. 아래의 코드를 보면 정말 메서드 체이닝의 신기함을 볼 수 있다. 확실히 간결해진 것을 알 수 있을 것이다.

``` java
private static List<String> ex2(List<Student> students) {
    return MyStreamV3.of(students)
        .filter(s -> s.getScore() >= 80)
        .filter(s -> s.getName().length() == 5)
        .map(Student::getName)
        .map(String::toUpperCase)
        .toList();
}
```

## 스트림 만들기4

이번에는 스트림의 최종 결과까지 스트림에서 함께 처리하도록 개선해보자. 아래와 같이 스트림의 최종 리스트를 반복문으로 출력하는 요구사항이 있다고 해보자. 그러면 우리는 아래와 같이 작성할 것이다.

``` java
package lambda.lambda5.mystream;

import java.util.List;

public class MyStreamLoopMain {
    public static void main(String[] args) {
        List<Student> students = List.of(
                new Student("Apple", 100),
                new Student("Banana", 80),
                new Student("Berry", 50),
                new Student("Tomato", 40)
        );

        List<String> result = MyStreamV3.of(students)
                .filter(s -> s.getScore() >= 80)
                .map(Student::getName)
                .toList();

        for (String s : result) {
            System.out.println("name: " + s);
        }
    }
}
```

그런데 생각해보면 `filter` , `map` 등도 스트림 안에서 데이터 리스트를 하나씩 처리(함수를 적용)하는 기능이다. 따라서 최종 결과를 출력하는 일도 스트림 안에서 처리할 수 있을 것 같다.

우리가 만들었던 스트림에 `forEach`라는 메서드를 통해 내부 반복으로 처리해보자.

``` java
public void forEach(Consumer<T> consumer) {
    for (T element : internalList) {
        consumer.accept(element);
    }
}
```

그리고 기존 `main` 메서드에 아래의 코드로 내부 반복을 할 수 있다.

``` java
MyStreamV3.of(students)
    .filter(s -> s.getScore() >= 80)
    .map(Student::getName)
    .forEach(name -> System.out.println("name: " + name));
```

`forEach()`에 함수를 전달해서 각각의 데이터 리스트를 출력하도록 했다. 이것은 최종 데이터이므로 반환할 것은 없고, 각각의 데이터를 받아서 소비만 하면 된다. 따라서 `Consumer`를 사용했다.

### 내부 반복 vs 외부 반복

스트림을 사용하기 전에 일반적인 반복 방식은 `for`문, `while`문과 같은 반복문을 직접 사용해서 데이터를 순회하는 **외부 반복(External Iteration)** 방식이었다. 스트림에서 제공하는 `forEach()` 메서드로 데이터를 처리하는 방식은 **내부 반복(Internal Iteration)** 이라고 부른다. 외부 반복처럼 직접 반복 제어문을 작성하지 않고, 반복 처리를 스트림 내부에 위임하는 방식이다. **스트림 내부에서** 요소들을 순회하고, 우리는 처리 로직(람다)만 정의해주면 된다.

- 내부 반복 방식은 반복의 제어를 스트림에게 위임하기 때문에 코드가 간결해진다. 즉, **개발자는 "어떤 작업"을 할지를 집중적으로 작성하고 "어떻게 순회할지"는 스트림이 담당**하도록 하여 생산성과 가독성을 높일 수 있다. 한마디로 **선언형 프로그래밍 스타일**이다.
- **외부 반복**은 개발자가 직접 반복 구조를 제어하는 반면, **내부 반복**은 반복을 내부에서 처리한다. 따라서 코드의 가독성과 유지보수성을 향상시킨다.

### 내부 반복 vs 외부 반복 선택

많은 경우 내부 반복을 사용할 수 있다면 내부 반복이 선언형 프로그래밍 스타일로 직관적이기 때문에 더 나은 선택이다. 다만 때때로 외부 반복을 선택하는 것이 더 나은 경우도 있다.

- 외부 반복을 선택하는 것이 더 나은 경우
    - 단순히 한두 줄 수행만 필요한 경우
        - 어떤 리스트를 순회하며 그대로 출력만 하면 되는 등의 매우 간단한 작업을 할 때
    - 반복 제어에 대한 복잡하고 세밀한 조정이 필요할 경우
        - 반복 중에 특정 조건을 만나면 바로 반복을 멈추거나, 일부만 건너뛰고 싶다면 `break`,`continue`등을 사용하는 외부 반복이 단순하다.

즉, 연속적인 필터링, 매핑, 집계가 필요할 때는 스트림을 사용한 내부 반복이 선언적이고 직관적이다. 하지만 아주 간단한 반복이거나, 중간에 `break`, `continue`가 들어가는 흐름 제어가 필요한 경우는 외부 반복이 더 간결하고 빠르게 이해될 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!