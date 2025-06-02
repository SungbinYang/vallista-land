---
title: "[자바 고급3] 스트림 API3 - 컬렉터"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-02 17:03:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 컬렉터1

스트림이 중간 연산을 거쳐 최종 연산으로써 데이터를 처리할 때, 그 결과물이 필요한 경우가 많다. 대표적으로 "리스트나 맵 같은 자료 구조에 담고 싶다"거나 "통계 데이터를 내고 싶다"는 식의 요구가 있을 때, 이 최종 연산에 `Collectors`를 활용한다. collect 연산(예: `stream.collect(...)` )은 **반환값**을 만들어내는 최종 연산이다. `collect(Collector<? super T, A, R> collector)`형태를 주로 사용하고, `Collectors` 클래스 안에 준비된 여러 메서드를 통해서 다양한 수집 방식을 적용할 수 있다.

> ✅ 참고
>
> `Collectors`에 이미 구현되어 있기 때문에, `Collector` 인터페이스를 직접 구현하는 것보다는 `Collectors`의 사용법을 익히는 것이 중요하다.

### Collectors의 주요 기능 표 정리

<table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <thead>
        <tr style="background-color: slateblue; color: white;">
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">기능</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">메서드 예시</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">설명</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">반환 타입</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">List로 수집</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toList()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toUnmodifiableList()</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">스트림 요소를 List로 모은다.<br>toUnmodifiableList()는<br>불변 리스트를 만든다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">List&lt;T&gt;</code></td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">Set으로 수집</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toSet()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toCollection(HashSet::new)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">스트림 요소를 Set으로 모은다. 중복 요소는 자동으로 제거된다. 특정 Set 타입으로 모으려면<br>toCollection() 사용.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Set&lt;T&gt;</code></td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">Map으로 수집</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toMap(keyMapper, valueMapper)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">toMap(keyMapper, valueMapper, mergeFunction, mapSupplier)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">스트림 요소를 Map에 (키, 값) 형태로 수집한다. 중복 키가 생기면<br>mergeFunction으로 해결하고, mapSupplier로 맵 타입을 지정할 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Map&lt;K, V&gt;</code></td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">그룹화</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">groupingBy(classifier)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">groupingBy(classifier, downstreamCollector)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">특정 기준 함수(classifier)에 따라 그룹별로 스트림 요소를 묶는다. 각 그룹에 대해 추가로 적용할 다운스트림 컬렉터를 지정할 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Map&lt;K, List&lt;T&gt;&gt;</code> 또는 <code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Map&lt;K, R&gt;</code></td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">분할</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">partitioningBy(predicate)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">partitioningBy(predicate, downstreamCollector)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">predicate 결과가 true와 false 두 가지로 나뉘어, 2개 그룹으로 분할한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Map&lt;Boolean, List&lt;T&gt;&gt;</code> 또는 <code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Map&lt;Boolean, R&gt;</code></td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">통계</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">counting()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">summingInt()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">averagingInt()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">summarizingInt()</code> 등</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">요소의 개수, 합계, 평균, 최소, 최댓값 등을 구하거나,<br>IntSummaryStatistics같은 통계 객체로 모을 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Long</code>, <code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Integer</code>, <code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Double</code>,<br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">IntSummaryStatistics</code> 등</td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">리듀싱</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">reducing(...)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">스트림의 reduce()와 유사하게, Collector 환경에서 요소를 하나로 합치는 연산을 할 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Optional&lt;T&gt;</code> 혹은 다른 타입</td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">문자열 연결</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">joining(delimiter, prefix, suffix)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">문자열 스트림을 하나로 합쳐서 연결한다. 구분자(delimiter), 접두사(prefix), 접미사(suffix)등을 붙일 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">String</code></td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">매핑</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">mapping(mapper, downstream)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">각 요소를 다른 값으로 변환(mapper)한 뒤 다운스트림 컬렉터로 넘긴다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">다운스트림 결과 타입에 따름</td>
        </tr>
    </tbody>
</table>

> ✅ 참고
>
> `Collectors.toList()` 대신에 자바 16 부터는 `stream.toList()`를 바로 호출할 수 있다. 이 기능은 불변 리스트를 제공한다.

## 컬렉터2

### 그룹 분할 수집

``` java
package stream.collectors;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Collectors3Group {
    public static void main(String[] args) {
        List<String> names = List.of("Apple", "Avocado", "Banana", "Blueberry", "Cherry");
        Map<String, List<String>> grouped = names.stream()
                .collect(Collectors.groupingBy(name -> name.substring(0, 1)));
        System.out.println("grouped = " + grouped);

        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
        Map<Boolean, List<Integer>> partitioned = numbers.stream()
                .collect(Collectors.partitioningBy(n -> n % 2 == 0));
        System.out.println("partitioned = " + partitioned);
    }
}
```

- `groupingBy(...)`는 특정 **기준**(예: 첫 글자)에 따라 스트림 **요소**를 여러 그룹으로 묶는다. 결과는 `Map<기준, List<요소>>` 형태다.
- `partitioningBy(...)`는 단순하게 `true`와 `false` 두 그룹으로 나눈다.

### 최솟값과 최댓값 수집

``` java
package stream.collectors;

import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Collectors4MinMax {
    public static void main(String[] args) {
        Integer max1 = Stream.of(1, 2, 3)
                .collect(Collectors.maxBy((i1, i2) -> i1.compareTo(i2)))
                .get();
        System.out.println("max1 = " + max1);

        Integer max2 = Stream.of(1, 2, 3)
                .max((i1, i2) -> i1.compareTo(i2))
                .get();
        System.out.println("max2 = " + max2);

        Integer max3 = Stream.of(1, 2, 3)
                .max(Integer::compareTo)
                .get();
        System.out.println("max3 = " + max3);

        int max4 = IntStream.of(1, 2, 3)
                .max().getAsInt();
        System.out.println("max4 = " + max4);
    }
}
```

- `Collectors.maxBy(...)`나 `Collectors.minBy(...)`를 통해 최소, 최댓값을 구할 수 있다.
- 다만 스트림 자체가 제공하는 `max()`,`min()` 메서드를 쓰면 더 간단하다.
- 기본형 특화 스트림(`IntStream` 등)을 쓰면 `.max().getAsInt()`처럼 바로 기본형으로 결과를 얻을 수 있다.

### 통계 수집

``` java
package stream.collectors;

import java.util.IntSummaryStatistics;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Collectors4Summing {
    public static void main(String[] args) {
        long count1 = Stream.of(1, 2, 3)
                .collect(Collectors.counting());
        System.out.println("count1 = " + count1);

        long count2 = Stream.of(1, 2, 3)
                .count();
        System.out.println("count2 = " + count2);

        double average1 = Stream.of(1, 2, 3)
                .collect(Collectors.averagingInt(i -> i));
        System.out.println("average1 = " + average1);

        double average2 = Stream.of(1, 2, 3)
                .mapToInt(i -> i)
                .average()
                .getAsDouble();
        System.out.println("average2 = " + average2);

        double average3 = IntStream.of(1, 2, 3)
                .average()
                .getAsDouble();
        System.out.println("average3 = " + average3);

        IntSummaryStatistics stats = Stream.of("Apple", "Banana", "Tomato")
                .collect(Collectors.summarizingInt(String::length));
        System.out.println(stats.getCount());
        System.out.println(stats.getSum());
        System.out.println(stats.getMin());
        System.out.println(stats.getMax());
        System.out.println(stats.getAverage());
    }
}
```

- `counting()`은 요소 개수를 구한다.
- `averagingInt()`는 요소들의 평균을 구한다.
- `summarizingInt()`는 합계, 최솟값, 최댓값, 평균 등 다양한 통계 정보를 담은 `IntSummaryStatistics` 객체를 얻는다.
- 자주 쓰이는 통계 메서드로 `summingInt()`,`maxBy()`,`minBy()`,`counting()`등이 있다.

### 리듀싱 수집

``` java
package stream.collectors;

import java.util.List;
import java.util.stream.Collectors;

public class Collectors5Reducing {
    public static void main(String[] args) {
        List<String> names = List.of("a", "b", "c", "d");

        String joined1 = names.stream()
                .collect(Collectors.reducing((s1, s2) -> s1 + ", " + s2))
                .get();
        System.out.println("joined1 = " + joined1);

        String joined2 = names.stream()
                .reduce((s1, s2) -> s1 + ", " + s2)
                .get();
        System.out.println("joined2 = " + joined2);

        String joined3 = names.stream()
                .collect(Collectors.joining(","));
        System.out.println("joined3 = " + joined3);

        String joined4 = String.join(",", names);
        System.out.println("joined4 = " + joined4);
    }
}
```

- `Collectors.reducing(...)`은 최종적으로 하나의 값으로 요소들을 합치는 방식을 지정한다. 
- 스트림 자체의 `reduce(...)` 메서드와 유사한 기능이다.
- 문자열을 이어 붙일 때는 `Collectors.joining()`이나 `String.join()`을 쓰는 게 더 간편하다.

## 다운 스트림 컬렉터1

### 다운 스트림이 필요한 이유

- `groupingBy(...)`를 사용하면 일단 요소가 그룹별로 묶이지만, 그룹 내 요소를 구체적으로 어떻게 처리할지는 기본적으로 `toList()` 만 적용된다.
- 그런데 실무에서는 "그룹별 **총합**, **평균**, **최대/최솟값**, **매핑된 결과**, **통계**" 등을 바로 얻고 싶을 때가 많다.
- 보통 지역별의 가계별 매출을 통계내는 프로그램을 배치로 돌릴때 많이 사용된다.
- 이런 경우는 지역별 가계를 그룹화하고 그 가계의 매출을 내서 통계내면 되는 것이다.
- 이처럼 **그룹화된 이후 각 그룹 내부에서 추가적인 연산 또는 결과물(예: 평균, 합계, 최댓값, 최솟값, 통계, 다른 타입으로 변환 등)을 정의하는** 역할을 하는 것이 바로 다운 스트림 컬렉터(Downstream Collector)이다.
- 이때 **다운 스트림 컬렉터를 활용**하면 "그룹 내부"를 다시 한번 모으거나 집계하여 원하는 결과를 얻을 수 있다.
  - 예: `groupingBy(분류함수, counting())` -> 그룹별 개수
  - 예: `groupingBy(분류함수, summingInt(Student::getScore))` -> 그룹별 점수 합계
  - 예: `groupingBy(분류함수, mapping(Student::getName, toList()))`-> 그룹별 학생 이름 리스트

### 다운 스트림 컬렉터란?

- `Collectors.groupingBy(...)` 또는 `Collectors.partitioningBy(...)`에서 **두 번째 인자**로 전달되는 `Collector` 를 가리켜 "다운 스트림 컬렉터"라 한다.
- 예를 들어 `Collectors.groupingBy(classifier, downstreamCollector)` 형태로 사용될 때, `downstreamCollector`는 `classifier` 에 의해 분류된 각 그룹 내부의 요소들을 **다시 한 번** 어떻게 처리할지를 정의하는 역할을 한다.
- 만약 다운 스트림 컬렉터를 명시하지 않으면, 기본적으로 `Collectors.toList()` 가 적용되어서 **그룹별 요소들을 List**로 모은다.
- 그러나 그룹별 **개수를 세거나**, **평균을 구하거나**, **특정 필드를 뽑아서 맵핑**하거나 등등의 작업이 필요하다면, 적절한 다운 스트림 컬렉터를 추가로 지정해야 한다.
- 다운 스트림 컬렉터는 그룹화(또는 분할)를 먼저 한 뒤, 각 그룹(또는 파티션) 내부의 요소들을 어떻게 처리할 것인가? 를 지정하는 데 사용된다.
  - 예를 들어, `groupingBy(분류 함수, counting())`라면 "각 그룹에 속한 요소들의 **개수**"를 구하는 다운 스트림 컬렉터가 된다.
  - 또 `groupingBy(분류 함수, averagingInt(속성))`라면 "각 그룹에 속한 요소들의 **속성 평균**"을 구하게 된다.
  - 여러 `Collector`를 중첩할 수도 있다. 예: `groupingBy(분류 함수, mapping(다른 함수, toList()))`처럼 "각 그룹에서 특정 속성만 매핑한 뒤 List로 수집하기" 등을 할 수 있다.

### 다운 스트림 컬렉터의 종류

<table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <thead>
        <tr style="background-color: slateblue; color: white;">
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">Collector</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">사용 메서드 예시</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">설명</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">예시 반환 타입</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">counting()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.counting()</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내(혹은 스트림 내) 요소들의 개수를 센다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Long</code></td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">summingInt() 등</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.summingInt(...)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.summingLong(...)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내 요소들의 특정 정수형 속성을 모두 합산한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Integer, Long</code> 등</td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">averagingInt() 등</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.averagingInt(...)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.averagingDouble(...)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내 요소들의 특정 속성 평균값을 구한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Double</code></td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">minBy(), maxBy()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.minBy(Comparator)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.maxBy(Comparator)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내 최소, 최댓값을 구한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Optional&lt;T&gt;</code></td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">summarizingInt() 등</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.summarizingInt(...)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.summarizingLong(...)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">개수, 합계, 평균, 최소, 최댓값을 동시에 구할 수 있는<br>SummaryStatistics 객체를 반환한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">IntSummaryStatistics</code> 등</td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">mapping()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.mapping(변환 함수, 다운스트림)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">각 요소를 다른 값으로 변환한 뒤, 변환된 값들을 다시 다른 Collector로 수집할 수 있게 한다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">다운스트림 반환 타입에 따라 달라짐</td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">collectingAndThen()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.collectingAndThen(다른 컬렉터, 변환 함수)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">다운 스트림 컬렉터의 결과를 최종적으로 한 번 더 가공(후처리)할 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">후처리 후의 타입</td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">reducing()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.reducing(초깃값, 변환 함수, 누적 함수)</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.reducing(누적 함수)</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">스트림의 reduce()와 유사하게, 그룹 내 요소들을 하나로 합치는 로직을 정의할 수 있다.</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">누적 로직에 따라 달라짐</td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">toList(), toSet()</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.toList()</code><br><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">Collectors.toSet()</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내(혹은 스트림 내) 요소를 리스트나 집합으로 수집한다.<br>toCollection(...)으로 구현체 지정 가능</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">List&lt;T&gt;, Set&lt;T&gt;</code></td>
        </tr>
    </tbody>
</table>

그럼 예제코드를 살펴보자. 예제는 학생의 학년과 성적을 바탕으로 그룹핑하여 활용하는 예제를 볼 것이다.

``` java
package stream.collectors;

public class Student {

    private String name;

    private int grade;

    private int score;

    public Student(String name, int grade, int score) {
        this.name = name;
        this.grade = grade;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public int getGrade() {
        return grade;
    }

    public int getScore() {
        return score;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", grade=" + grade +
                ", score=" + score +
                '}';
    }
}
```

위와 같이 학생 객체를 정의한다. 다음으로 해당 객체를 활용하는 `main` 부분을 작성해보자.

``` java
package stream.collectors;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DownStreamMain1 {
    public static void main(String[] args) {
        List<Student> students = List.of(
                new Student("Kim", 1, 85),
                new Student("Park", 1, 70),
                new Student("Lee", 2, 70),
                new Student("Han", 2, 90),
                new Student("Hoon", 3, 90),
                new Student("Ha", 3, 89)
        );

        Map<Integer, List<Student>> collect1_1 = students.stream()
                .collect(Collectors.groupingBy(Student::getGrade, Collectors.toList()));
        System.out.println("collect1_1 = " + collect1_1);

        Map<Integer, List<Student>> collect1_2 = students.stream()
                .collect(Collectors.groupingBy(Student::getGrade));
        System.out.println("collect1_2 = " + collect1_2);

        Map<Integer, List<String>> collect2 = students.stream()
                .collect(Collectors.groupingBy(
                        Student::getGrade,
                        Collectors.mapping(Student::getName, Collectors.toList())
                ));
        System.out.println("collect2 = " + collect2);

        Map<Integer, Long> collect3 = students.stream()
                .collect(Collectors.groupingBy(Student::getGrade, Collectors.counting()));
        System.out.println("collect3 = " + collect3);

        Map<Integer, Double> collect4 = students.stream()
                .collect(Collectors.groupingBy(
                        Student::getGrade,
                        Collectors.averagingInt(Student::getScore)
                ));
        System.out.println("collect4 = " + collect4);
    }
}
```

코드를 보면 어떤 로직이고 어떤 역할인지 또한, 다운스트림의 필요성에 대해서도 충분히 알 수 있을 것이다.

## 다운 스트림 컬렉터2

이번에는 다른 예시로 다운 스트림 컬렉터를 알아보자.

``` java
package stream.collectors;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class DownStreamMain2 {
    public static void main(String[] args) {
        List<Student> students = List.of(
                new Student("Kim", 1, 85),
                new Student("Park", 1, 70),
                new Student("Lee", 2, 70),
                new Student("Han", 2, 90),
                new Student("Hoon", 3, 90),
                new Student("Ha", 3, 89)
        );

        Map<Integer, List<Student>> collect1 = students.stream()
                .collect(Collectors.groupingBy(Student::getGrade));
        System.out.println("collect1 = " + collect1);

        Map<Integer, Optional<Student>> collect2 = students.stream()
                .collect(Collectors.groupingBy(
                        Student::getGrade,
                        Collectors.reducing((s1, s2) -> s1.getScore() > s2.getScore() ? s1 : s2)
                ));
        System.out.println("collect2 = " + collect2);

        Map<Integer, Optional<Student>> collect3 = students.stream()
                .collect(Collectors.groupingBy(
                        Student::getGrade,
//                        Collectors.maxBy((s1, s2) -> s1.getScore() > s2.getScore() ? 1 : -1)
//                        Collectors.maxBy(Comparator.comparingInt(student -> student.getScore()))
                        Collectors.maxBy(Comparator.comparingInt(Student::getScore))
                ));
        System.out.println("collect3 = " + collect3);

        Map<Integer, String> collect4 = students.stream()
                .collect(Collectors.groupingBy(
                        Student::getGrade,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(Comparator.comparingInt(Student::getScore)),
                                sOpt -> sOpt.get().getName()
                        )
                ));
        System.out.println("collect4 = " + collect4);
    }
}
```

### mapping() vs collectingAndThen()

- `mapping()` : 그룹화(또는 분할)된 각 그룹 내의 **개별 요소들**을 **다른 값으로 변환**(mapping)한 뒤, 그 변환된 값들을 다시 **다른 Collector**로 수집할 수 있게 해준다.
- `collectingAndThen()` : 다운 스트림 컬렉터가 **최종 결과를 만든 뒤**에 **한 번 더 후처리**할 수 있도록 해준다. 즉, "1차 Collector -> 후처리 함수" 순서로 작업한다.

<table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <thead>
        <tr style="background-color: slateblue; color: white;">
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">구분</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">mapping()</th>
            <th style="padding: 16px; text-align: left; font-weight: 600; border: 1px solid #3a7bc8;">collectingAndThen()</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">주된 목적</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내 개별 요소를 변환한 뒤, 해당 변환 결과를 다른 Collector로 수집</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">그룹 내 요소들을 이미 한 번 수집한 결과를 추가 가공하거나 최종 타입으로 변환</td>
        </tr>
        <tr style="background-color: #f8f9fa; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">처리 방식</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">(1) 그룹화 → (2) 각 요소를 변환 → (3) 리스트나 Set 등으로 수집</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;">(1) 그룹화 → (2) 최댓값/최소값/합계 등 수집 → (3) 결과를 후처리(예: Optional → String)</td>
        </tr>
        <tr style="background-color: white; color: black;">
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0; font-weight: 600;">대표 예시</td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">mapping(Student::getName, toList())</code></td>
            <td style="padding: 14px 16px; border: 1px solid #e0e0e0;"><code style="background-color: #f1f3f5; padding: 3px 8px; border-radius: 4px; font-family: Consolas, Monaco, monospace; color: #d63384;">collectingAndThen(maxBy(...), optional → optional.map(...) ...)</code></td>
        </tr>
    </tbody>
</table>

`mapping()`은 **그룹화된 요소 하나하나를 변환**하는 데 유용하고, `collectingAndThen()`은 이미 만들어진 **전체 그룹의 결과**를 **최종 한 번 더** 손보는 데 사용한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!