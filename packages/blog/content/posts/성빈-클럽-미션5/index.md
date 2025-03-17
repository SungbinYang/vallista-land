---
title: 성빈 클럽 미션5
tags:
  - 스터디
image: ./assets/01.png
date: 2024-11-01 06:27:27
series: 성빈클럽-자바입문
draft: true
---

![썸네일](./assets/01.png)

이번에는 반복문에 대해 학습을 해보았다. 반복문에 대해 심화적인 문제를 한번 연습함으로 반복문에 대해 익숙해져보자.

## 초급

### 문제1. `while` 문을 사용하여 1부터 10까지의 숫자를 출력하는 코드를 작성하세요.

내 해설)

``` java
int i = 1;
while (i <= 10) {
    System.out.println(i);
    i++;
}
```

### 문제2. **코드 작성:** `for` 문을 사용하여 다음과 같은 형태로 숫자를 출력하세요.

```java
1
2 3
4 5 6
7 8 9 10
```

내 해설)

``` java
int num = 1;
for (int i = 1; i <= 4; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(num++ + " ");
    }
    System.out.println();
}
```

### 문제3. **코드 작성:** `for` 문을 사용하여 5층의 피라미드 모양을 별(*)로 출력하세요.

```java
    *
   ***
  *****
 *******
*********
```

내 해설)

``` java
int rows = 5;
for (int i = 1; i <= rows; i++) {
    for (int j = rows; j > i; j--) {
        System.out.print(" ");
    }
    for (int k = 1; k <= (2 * i - 1); k++) {
        System.out.print("*");
    }
    System.out.println();
}
```

---

## 중급

### 문제1. `do-while` 문과 `continue` 키워드를 사용하여 1부터 20까지 숫자 중 홀수만 출력하는 코드를 작성하세요.

내 해설)

``` java
int i = 1;
do {
    if (i % 2 == 0) {
        i++;
        continue;
    }
    System.out.println(i);
    i++;
} while (i <= 20);
```

### 문제2. 다음과 같은 형태의 별 피라미드를 `for` 문과 `break` 문을 사용하여 작성하세요. 5번째 줄에서 중단되도록 합니다.

```java
    *
   ***
  *****
 *******
```

내 해설)

``` java
int rows = 5;
for (int i = 1; i <= rows; i++) {
    for (int j = rows; j > i; j--) {
        System.out.print(" ");
    }
    for (int k = 1; k <= (2 * i - 1); k++) {
        System.out.print("*");
    }
    System.out.println();
    if (i == 4) {
        break;
    }
}
```

### 문제3. 중첩 반복문을 사용하여 다음과 같은 곱셈표를 출력하세요 (1부터 5까지).

```java
1  2  3  4  5
2  4  6  8 10
3  6  9 12 15
4  8 12 16 20
5 10 15 20 25
```

내 해설)

``` java
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= 5; j++) {
        System.out.print(i * j + "\t");
    }
    System.out.println();
}
```

---

## 고급

### 문제1. `for` 문과 `continue` 키워드를 사용하여, 1부터 100까지 숫자 중 3과 5의 공배수인 숫자만 출력하는 코드를 작성하세요.

내 해설)

``` java
for (int i = 1; i <= 100; i++) {
    if (i % 3 != 0 || i % 5 != 0) {
        continue;
    }
    System.out.println(i);
}
```

### 문제2. `while` 문과 `break` 문을 사용하여 다음과 같은 별 피라미드를 역방향으로 출력하세요. (예: 5층의 피라미드)

```java
*********
 *******
  *****
   ***
    *
```

내 해설)

``` java
int rows = 5;
int i = rows;
while (i > 0) {
    for (int j = 0; j < rows - i; j++) {
        System.out.print(" ");
    }
    for (int k = 1; k <= (2 * i - 1); k++) {
        System.out.print("*");
    }
    System.out.println();
    i--;
}
```

### 문제3. 중첩 반복문을 이용하여 다음과 같은 모양의 피라미드를 출력하세요 (층 수는 유동적으로 설정 가능해야 합니다).

``` java
    1
   2 2
  3 3 3
 4 4 4 4
```

내 해설)

``` java
int rows = 4;
for (int i = 1; i <= rows; i++) {
    for (int j = rows; j > i; j--) {
        System.out.print(" ");
    }
    for (int k = 1; k <= i; k++) {
        System.out.print(i + " ");
    }
    System.out.println();
}
```