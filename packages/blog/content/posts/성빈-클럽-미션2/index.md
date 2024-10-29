---
title: 성빈 클럽 미션2
tags:
  - 스터디
image: ./assets/01.png
date: 2024-10-29 20:41:27
series: 성빈클럽-자바입문
draft: false
---

![썸네일](./assets/01.png)

이번 미션을 통해 나는 변수에 따른 JVM 메모리 영역에 따른 위치에 대해 조금 더 자세히 알게 된 계기가 되지 않았을까 싶다. 그러면 한번 진행해보자.

## 초급

### 문제1

> 변수를 선언하는 방법에 대해 설명하세요. 예를 들어 정수형 변수를 선언하고 초기화하는 코드와 함께 설명해 보세요.

변수 선언은 프로그램에서 값을 저장하기 위해 특정 데이터 타입과 이름을 지정하는 작업입니다. 예를 들어, `int number;`는 정수형 데이터를 저장할 변수 number를 선언하는 코드입니다. 변수를 선언할 때는 데이터 타입과 변수 이름을 포함해야 합니다.

### 문제2

> 다음 조건에 맞는 코드를 작성하세요.
>
> - `String` 타입의 변수 `greeting`을 선언하고, 초기값으로 "Hello, SungbinClub!"를 할당하세요.
> - 변수 `greeting`을 출력하세요.

``` java
String message = "Welcome to Java!";
System.out.println(message);
```

### 문제3

> 변수명을 지을 때 지켜야 하는 세 가지 명명 규칙을 제시하고, 적절한 변수 이름의 예시와 부적절한 변수 이름의 예시 각각 두 가지를 작성하세요.

- 첫 글자는 숫자로 시작할 수 없습니다.
- 대소문자를 구별합니다.
- 변수에는 공백이 들어가서는 안된다.
- 특수문자는 _와 $만 사용 가능합니다.
- 예시: 적절한 변수명 - count, maxValue; 부적절한 변수명 - 1count, max-Value

## 중급

### 문제1

> 다음 조건에 맞는 코드를 작성하세요.
>
> - `final` 키워드를 사용하여 상수 변수 `DEFAULT_LIMIT`를 `int` 타입으로 선언하고 초기값을 50으로 설정하세요.
> - `DEFAULT_LIMIT` 값을 출력하고, 값을 변경하려 할 때 발생하는 에러 메시지를 확인하세요.

``` java
final int DEFAULT_LIMIT = 50;
System.out.println(DEFAULT_LIMIT);
// DEFAULT_LIMIT = 100;  // 컴파일 에러 발생: cannot assign a value to 
```

### 문제2

> 다음 코드에서 각 변수(localValue, instanceValue, staticValue)가 JVM 메모리의 어느 영역에 저장되는지 설명하세요.

``` java
public class VariableExample {
    public static int staticValue = 10;
    public int instanceValue = 20;

    public void method() {
        int localValue = 30;
        System.out.println(localValue);
    }
}
```

- staticValue: 클래스 변수이며, 메소드 영역에 저장된다.
- instanceValue: 인스턴스 변수로, 인스턴스마다 힙 영역에 저장된다.
- localValue: 메소드 내 선언된 지역 변수로, 스택 영역에 저장된다.

### 문제3

> 변수 초기화와 리터럴의 차이점을 설명하고, 다음 코드에서 리터럴과 초기화된 변수를 구분하여 설명하세요.

``` java
double price = 99.99;
int quantity = 5;
boolean isAvailable = true;
```

리터럴은 코드에서 직접 값이 지정된 데이터이며, 변수 초기화는 변수에 첫 값을 할당하는 작업입니다.

``` java
double price = 99.99;  // 99.99가 리터럴, 초기화된 변수 price
int quantity = 5;      // 5가 리터럴, 초기화된 변수 quantity
```

예시 코드에서 99.99, 5, true는 모두 리터럴로, 이 값들이 price, quantity, isAvailable에 각각 초기화되었습니다.

## 고급

### 문제1

> 메모리 효율성을 고려하여 `static` 키워드를 사용한 `ItemCounter` 클래스를 작성하세요.
>
> - `ItemCounter` 클래스에 정적 변수 `totalCount`를 선언하고, 이를 증가시키는 `addItem` 메서드를 작성하세요.
> - `ItemCounter` 클래스의 `totalCount` 변수가 인스턴스마다 공유되는지 확인하는 코드를 작성하세요.
> - `totalCount`가 JVM의 어느 메모리 영역에 위치하는지도 설명하세요.

static 키워드를 통해 변수는 모든 인스턴스가 공유하는 변수로 선언되며, 메소드 영역에 저장됩니다. ItemCounter의 totalCount 변수가 static으로 선언되면, 여러 객체가 동일한 totalCount 값을 공유합니다.

``` java
public class ItemCounter {
    public static int totalCount = 0;

    public static void addItem() {
        totalCount++;
    }
}
```

totalCount는 클래스 수준 변수로, 모든 ItemCounter 인스턴스가 동일한 totalCount 값을 공유하게 됩니다.

### 문제2

> 다음 코드의 각 변수들이 JVM 메모리 구조에서 어떻게 저장되고 관리되는지 설명하세요.
>
> - 지역 변수, 인스턴스 변수, 정적 변수가 각각 어디에 저장되는지 설명하고, 코드의 `totalAmount`, `orderCount`, `discountRate` 변수가 해당하는 JVM 메모리 영역도 설명하세요.

``` java
public class Order {
    public static double discountRate = 0.1;
    public int orderCount = 0;

    public void processOrder() {
        double totalAmount = 200.0;
        System.out.println(totalAmount * (1 - discountRate));
    }
}
```

- 지역 변수: totalAmount는 메소드 내에 정의되어 스택 영역에 저장됩니다.
- 인스턴스 변수: orderCount는 인스턴스마다 다르며, 힙 영역에 저장됩니다.
- 정적 변수: discountRate는 클래스 수준의 변수로, 메소드 영역에 저장됩니다.