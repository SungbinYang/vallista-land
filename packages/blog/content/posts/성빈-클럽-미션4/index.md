---
title: 성빈 클럽 미션4
tags:
  - 스터디
image: ./assets/01.png
date: 2024-10-30 22:17:27
series: 성빈클럽-자바입문
draft: true
---

![썸네일](./assets/01.png)

이번 미션은 조건문의 대한 학습이였다. 조건문에 심화적인 문제를 풀어보고 익혀보자!

## 초급

### 문제1

> 다음 코드를 보고 결과가 무엇인지 설명하세요.

``` java
int number = 7;
if (number > 5) {
    System.out.println("5보다 큽니다");
} else {
    System.out.println("5보다 작거나 같습니다");
}
```

내 풀이)

number의 값이 7이므로, 조건 number > 5가 참이 됩니다. 따라서 System.out.println("5보다 큽니다");가 실행되어 콘솔에 "5보다 큽니다"가 출력됩니다.

### 문제2

> 숫자를 입력받아 그 숫자가 짝수인지 홀수인지 판별하는 코드를 작성하세요. (힌트: 조건문과 나머지 연산 %을 활용하세요.)

내 풀이)

``` java
int number = /* 입력 받은 숫자 */;
if (number % 2 == 0) {
    System.out.println("짝수입니다");
} else {
    System.out.println("홀수입니다");
}
```

### 문제3

> 세 개의 숫자를 입력받아 그 중 가장 큰 숫자를 출력하는 코드를 작성하세요. (단, if-else문을 사용하여 구현하세요.)

내 풀이)

``` java
int a = /* 첫 번째 숫자 */;
int b = /* 두 번째 숫자 */;
int c = /* 세 번째 숫자 */;
int max;

if (a >= b && a >= c) {
    max = a;
} else if (b >= a && b >= c) {
    max = b;
} else {
    max = c;
}
System.out.println("가장 큰 수는: " + max);
```

## 중급

### 문제1

> 학생의 점수(0~100)를 입력받아 90점 이상일 경우 "A", 80점 이상일 경우 "B", 70점 이상일 경우 "C", 나머지 경우 "F"를 출력하는 코드를 if-else if-else문으로 작성하세요.

내 풀이)

``` java
int score = /* 입력 받은 점수 */;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else if (score >= 70) {
    System.out.println("C");
} else {
    System.out.println("F");
}
```

### 문제2

> 간단한 계산기를 만드세요. 두 개의 숫자와 연산자(+,-,*,/)를 입력받아 연산 결과를 출력하세요. 조건문을 사용하여 각 연산을 처리해야 합니다.

내 풀이)

``` java
int num1 = /* 첫 번째 숫자 */;
int num2 = /* 두 번째 숫자 */;
char operator = /* 연산자 입력 */;
int result;

if (operator == '+') {
    result = num1 + num2;
} else if (operator == '-') {
    result = num1 - num2;
} else if (operator == '*') {
    result = num1 * num2;
} else if (operator == '/') {
    if (num2 != 0) {
        result = num1 / num2;
    } else {
        System.out.println("0으로 나눌 수 없습니다.");
        return;
    }
} else {
    System.out.println("유효하지 않은 연산자입니다.");
    return;
}
System.out.println("결과: " + result);
```

## 고급

### 문제1

> 월(month) 값을 입력받아 해당 월이 속한 계절을 출력하는 코드를 작성하세요. 예를 들어, 3월~5월은 “봄”,  6월~8월은 "여름"으로 처리하며, switch문을 사용하여 구현하세요.

내 풀이)

``` java
int month = /* 입력 받은 월 */;
String season;

switch (month) {
    case 3: case 4: case 5:
        season = "봄";
        break;
    case 6: case 7: case 8:
        season = "여름";
        break;
    case 9: case 10: case 11:
        season = "가을";
        break;
    case 12: case 1: case 2:
        season = "겨울";
        break;
    default:
        season = "유효하지 않은 월입니다.";
}
System.out.println("계절: " + season);
```

### 문제2

> 연도를 입력받아 해당 연도가 윤년인지 아닌지를 판단하는 코드를 작성하세요. 윤년의 조건은 다음과 같습니다:
>
> - 연도가 4로 나누어떨어지고, 100으로 나누어떨어지지 않는 경우
> - 혹은 400으로 나누어떨어지는 경우

내 풀이)

``` java
int year = /* 입력 받은 연도 */;
if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
    System.out.println(year + "년은 윤년입니다.");
} else {
    System.out.println(year + "년은 윤년이 아닙니다.");
}
```