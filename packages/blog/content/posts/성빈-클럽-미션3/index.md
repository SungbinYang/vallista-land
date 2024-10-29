---
title: 성빈 클럽 미션3
tags:
  - 스터디
image: ./assets/01.png
date: 2024-10-30 06:01:27
series: 성빈클럽-자바입문
draft: false
---

![썸네일](./assets/01.png)

이번 미션은 연산자의 기초적인 부분과 `회로단락평가`라는 이론을 적용해보는 미션들이 있다. 한번 제대로 해당 이론을 공부도 할 겸 미션을 진행해보자.

## 초급

### 문제1

> 산술 연산자에서 덧셈, 뺄셈, 곱셈, 나눗셈, 나머지 연산자의 역할을 간단히 설명하세요.

내 의견)
- 덧셈: 두 수를 더한다.
- 뺄셈: 두 수를 뺀다.
- 곱셈: 두 수를 곱한다.
- 나눗셈: 두 수를 나눈다.
- 나머지 연산자: 두 수를 나눈 후 나머지를 반환한다.

### 문제2

> `3 + 4 * 2`의 연산 결과는 얼마인가요? 이 문제를 통해 연산자 우선순위의 개념을 설명하세요.

내 의견)

`3 + 4 * 2`에서 곱셈이 덧셈보다 우선순위가 높기 때문에, 4 * 2가 먼저 계산되어 8이 되고, 최종 결과는 3 + 8 = 11이다.

### 문제3

> 사용자로부터 두 개의 정수를 입력받아 두 숫자를 더한 결과를 출력하는 코드를 작성하세요.(힌트: Scanner 이용)

내 의견)

``` java
Scanner scanner = new Scanner(System.in);
System.out.print("첫 번째 숫자를 입력하세요: ");

int num1 = scanner.nextInt();
System.out.print("두 번째 숫자를 입력하세요: ");

int num2 = scanner.nextInt();

int sum = num1 + num2;
System.out.println("두 숫자의 합: " + sum);
```

## 중급

### 문제1

> 회로 단락 평가란 무엇이며, &&와 || 연산자에서 어떻게 작동하는지 설명하세요.

내 의견)

회로 단락 평가는 조건문에서 &&와 || 연산자가 왼쪽 조건만으로도 전체 결과를 판단할 수 있을 때 오른쪽 조건을 평가하지 않는 방식이다. 예를 들어, &&의 경우 첫 조건이 false면 뒤를 평가하지 않고, ||의 경우 첫 조건이 true면 뒤를 평가하지 않는다.

### 문제2

> 다음 코드에서 x가 0일 때 y++가 실행되지 않도록 회로 단락 평가를 활용하여 조건문을 변경하세요.

``` java
int x = 0;
int y = 5;

if (x != 0 && y++ > 2) {
    System.out.println("조건이 참입니다.");
}

System.out.println("y의 값: " + y);
```

내 의견)

x가 0이므로 첫 번째 조건 x != 0이 false가 됩니다. 이때 회로 단락 평가로 인해 y++는 실행되지 않으므로, y의 값은 그대로 5가 됩니다.

### 문제3

> &&와 || 연산자를 사용하여, score가 70 이상이고 age가 18 이상인 경우에만 "합격"을 출력하는 코드를 작성하세요. age가 18 미만이면 score가 70 이상이라도 "합격"이 출력되지 않도록 회로 단락 평가를 활용하세요.

내 의견)

``` java
int score = 75;
int age = 17;
if (score >= 70 && age >= 18) {
    System.out.println("합격");
} else {
    System.out.println("불합격");
}
```

## 고급

### 문제1

> 아래 코드의 실행 결과를 예측하고, 회로 단락 평가의 작동 원리를 설명하세요.

``` java
int x = 10;
int y = 20;
boolean result = (x < 5) && (y++ > 15);

System.out.println("x: " + x + ", y: " + y + ", result: " + result);
```

내 의견)

x < 5가 false이므로 &&에 의해 y++ > 15가 평가되지 않는다. 따라서 y는 20 그대로이고, result는 false이다.

### 문제2

> 두 개의 숫자를 입력받아, 첫 번째 숫자가 양수이고 두 번째 숫자가 음수일 때만 두 수의 곱을 출력하는 코드를 작성하세요. 첫 번째 숫자가 양수가 아닐 경우 두 번째 숫자를 평가하지 않도록 회로 단락 평가를 사용하세요. (힌트: Scanner 객체 이용)

내 의견)

``` java
Scanner scanner = new Scanner(System.in);

System.out.print("첫 번째 숫자를 입력하세요: ");
int firstNum = scanner.nextInt();

System.out.print("두 번째 숫자를 입력하세요: ");
int secondNum = scanner.nextInt();

if (firstNum > 0 && secondNum < 0) {
    System.out.println("두 수의 곱: " + (firstNum * secondNum));
} else {
    System.out.println("조건을 만족하지 않습니다.");
}
```

### 문제3

> 주어진 정수 배열에서, 짝수와 양수인 수의 합을 계산하는 함수를 작성하세요. 단, 첫 번째로 만나는 홀수가 발견되면 이후의 모든 연산을 중단하고 해당 시점까지의 합을 반환하세요. 회로 단락 평가를 활용하여 불필요한 계산을 방지하도록 구현하세요.

내 의견)

``` java
public int calculateEvenAndPlusNumberSum(int[] arr) {
    int sum = 0;

    for (int num : arr) {
        if (num % 2 != 0) break;  // 첫 번째 홀수 발견 시 루프 종료
        if (num > 0 && num % 2 == 0) {
            sum += num;  // 짝수이면서 양수인 경우에만 더하기
        }
    }
    
    return sum;
}
```