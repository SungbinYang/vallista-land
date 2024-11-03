---
title: 성빈 클럽 미션9
tags:
  - 스터디
image: ./assets/01.png
date: 2024-11-03 11:10:27
series: 성빈클럽-자바입문
draft: false
---

![썸네일](./assets/01.png)

이번에는 메서드에 대해 학습했다. 메서드에 대한 미션을 한번 해결해보자.

## 초급

### 문제1

> 메서드의 반환 타입(return type)이란 무엇인가요? 왜 필요한가요?

내 해설)

메서드의 반환 타입은 메서드가 호출된 후 어떤 타입의 결과를 반환할지를 나타냅니다. 예를 들어, int 타입을 반환하면 그 메서드가 int 값을 리턴할 것임을 의미합니다. 반환 타입이 필요한 이유는 메서드가 계산 결과를 호출한 코드에 전달할 수 있게 하여, 이를 이후의 코드에서 활용할 수 있도록 합니다.

### 문제2

> 정수를 받아서 그 숫자가 양수인지 음수인지 출력하는 메서드 checkSign(int number)를 작성하세요. main 메서드에서 이 메서드를 호출하여 숫자를 확인해보세요.

내 해설)

``` java
public class Main {
    public static void main(String[] args) {
        checkSign(-5);
    }

    public static void checkSign(int number) {
        if (number > 0) {
            System.out.println("양수");
        } else if (number < 0) {
            System.out.println("음수");
        } else {
            System.out.println("0");
        }
    }
}
```

### 문제3

> 메서드 호출 시 값을 전달할 때 자바는 값에 의한 호출(call by value) 방식을 사용합니다. 이와 관련하여 값에 의한 호출이란 무엇인지 간단히 설명하세요.

내 해설)

자바는 값에 의한 호출 방식으로 메서드에 인수를 전달합니다. 즉, 메서드 호출 시 인수의 실제 값이 복사되어 전달됩니다. 메서드 내에서 그 값을 변경해도 원래 변수에는 영향을 미치지 않으며, 이는 기본 데이터 타입에서 명확히 나타납니다.

## 중급

### 문제1

> 메서드 오버로딩(Method Overloading)이란 무엇인가요? 오버로딩의 주요 장점을 한 가지 설명하세요.

내 해설)

메서드 오버로딩은 동일한 이름의 메서드를 서로 다른 매개변수 목록으로 여러 번 정의하는 것입니다. 장점은 코드의 가독성을 높이고, 사용자가 적절한 매개변수를 사용해 메서드를 쉽게 호출할 수 있도록 도와줍니다. 또한, 클래스의 기능을 직관적으로 사용할 수 있게 해줍니다.

### 문제2

> 다음 메서드를 작성하고 각 매개변수 타입에 따른 메서드 오버로딩을 적용하세요.
>
> - print(double value) : 주어진 double 값을 출력하는 메서드.
> - print(int value) : 주어진 int 값을 출력하는 메서드.

내 해설)

``` java
public class Main {
    public static void print(double value) {
        System.out.println("Double 값: " + value);
    }

    public static void print(int value) {
        System.out.println("Int 값: " + value);
    }

    public static void main(String[] args) {
        print(5.5);  // Double 값: 5.5
        print(10);   // Int 값: 10
    }
}
```

## 고급

### 문제1

> 메서드와 형변환의 관계를 설명하고, 왜 자동 형변환이 불가능한 경우가 있는지 설명하세요. 예시를 포함해 주세요.

내 해설)

메서드 매개변수가 자동 형변환(예: int에서 double)을 지원하기도 하지만, 반대로 작은 범위의 타입(예: double에서 int)으로는 자동 형변환이 불가능합니다. 예를 들어, double 매개변수에 int를 전달할 때는 자동 형변환이 일어나지만, int 매개변수에 double을 전달하려고 하면 오류가 발생합니다. 이는 데이터 손실이 발생할 수 있기 때문입니다.

### 문제2

> 두 개의 숫자를 받아 첫 번째 숫자에서 두 번째 숫자를 나눈 몫을 반환하는 divide(int num1, int num2) 메서드를 작성하세요. 단, 두 번째 숫자가 0일 경우 "Cannot divide by zero"라는 메시지를 출력하는 방식으로 예외 처리를 하세요.

내 해설)

``` java
public class Main {
    public static int divide(int num1, int num2) {
        if (num2 == 0) {
            System.out.println("Cannot divide by zero");
            return 0;
        }
        return num1 / num2;
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 2));        System.out.println(divide(10, 0));
    }
}
```

### 문제3

> 문자열 두 개를 받아서 두 문자열이 같은지 여부를 확인하는 메서드 isEqual(String str1, String str2)를 작성하고, 메서드 오버로딩을 통해 추가적으로 대소문자를 구분하지 않고 비교하는 isEqualIgnoreCase(String str1, String str2) 메서드를 작성하세요.

내 해설)

``` java
public class Main {
    public static boolean isEqual(String str1, String str2) {
        return str1.equals(str2);
    }

    public static boolean isEqualIgnoreCase(String str1, String str2) {
        return str1.equalsIgnoreCase(str2);
    }

    public static void main(String[] args) {
        System.out.println(isEqual("Hello", "hello"));
        System.out.println(isEqualIgnoreCase("Hello", "hello"));
    }
}
```