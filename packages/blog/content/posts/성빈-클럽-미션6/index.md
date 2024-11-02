---
title: 성빈 클럽 미션6
tags:
  - 스터디
image: ./assets/01.png
date: 2024-11-02 11:11:27
series: 성빈클럽-자바입문
draft: false
---

![썸네일](./assets/01.png)

오늘은 스코프와 형변환에 대해 학습하였다. 이에 대한 미션을 한번 풀어보겠다.

## 초급

### 문제1

> 자바에서 지역 변수가 무엇인지 설명하고, 왜 특정 블록 안에서만 접근이 가능한지 이야기해보세요.

내 해설)

지역 변수는 특정 블록 내에서 선언된 변수로, 그 블록을 벗어나면 접근할 수 없습니다. 자바에서 변수의 스코프(scope)를 제한함으로써 메모리 관리가 용이해지고, 코드의 오류 가능성을 줄이는 역할을 합니다. 예를 들어, 다른 블록에서 실수로 변수의 값을 변경할 수 없기 때문에 안정성이 높아집니다.

### 문제2

> 자동 형변환과 명시적 형변환의 차이점에 대해 간단히 설명하세요.

내 해설)

자동 형변환은 자바가 낮은 정밀도 타입에서 높은 정밀도 타입으로 변환할 때 자동으로 수행되는 반면, 명시적 형변환은 개발자가 직접 변환을 수행해야 하는 경우입니다. 명시적 형변환은 데이터 손실이 발생할 수 있기 때문에 신중히 사용해야 합니다.

## 중급

### 문제1

> double형 변수와 int형 변수 두 개를 선언하고, 이들을 더해 결과를 출력하는 코드를 작성하세요. 자동 형변환을 고려하여 작성하세요.

내 해설)

```java
public class TypeCastingExample {
    public void addNumbers() {
        double num1 = 5.5;
        int num2 = 10;
        double result = num1 + num2;
        System.out.println(result);
    }
}
```

### 문제2

> 다음 코드에서 왜 y 변수는 if 블록 바깥에서 사용할 수 없는지 설명하세요.

```java
public class ScopeTest {
    public void testScope() {
        if (true) {
            int y = 10;
        }
        // 여기에서 y를 사용할 수 있을까요? 왜 그런지 설명하세요.
    }
}
```

내 해설)

y 변수가 사용되지 않는 이유는, y가 if 블록 안에서 선언되었기 때문입니다. if 블록 내부에서만 y에 접근할 수 있으며, 블록 밖에서는 스코프가 종료되어 y를 사용할 수 없습니다. 이 제한 덕분에 코드의 의도와 안전성이 보장됩니다.

### 문제3

> 실수를 정수로 명시적 형변환하는 메서드를 작성하세요. 메서드는 double형 매개변수를 받아 이를 int로 변환한 결과를 반환해야 합니다.

```java
public class TypeCasting {
    public int castToInteger(double value) {
        // 명시적 형변환 코드 작성
    }
}
```

내 해설)

```java
public class TypeCasting {
    public int castToInteger(double value) {
        return (int) value; // 명시적 형변환을 통해 double을 int로 변환합니다.
    }
}
```

## 고급

### 문제1

> 변수 a, b를 받아 더한 후, 자동 형변환과 명시적 형변환을 활용하여 다양한 타입(float, int, double)으로 변환해 출력하는 메서드를 작성하세요.

내 해설)

```java
public class TypeConversionExample {
    public void convertAndPrint(double a, int b) {
        double result = a + b; // 자동 형변환 (b가 double로 변환됨)
        float floatResult = (float) result; // 명시적 형변환
        int intResult = (int) result;       // 명시적 형변환

        System.out.println("Double result: " + result);
        System.out.println("Float result: " + floatResult);
        System.out.println("Int result: " + intResult);
    }
}
```

### 문제2

> 스코프와 생명주기의 차이점을 설명하고, 왜 특정 메서드나 블록 안에서만 변수를 제한해야 하는지에 대해 이야기해보세요.

내 해설)

스코프는 변수가 접근할 수 있는 영역을 의미하고, 생명 주기는 변수가 메모리에 존재하는 기간을 의미합니다. 특정 메서드나 블록에서 변수를 제한하는 이유는 메모리 효율을 높이고, 실수로 다른 블록에서 변수를 변경하지 못하도록 하는 등 코드 안정성을 확보하기 위함입니다.

### 문제3

> long과 int 타입을 사용하는 두 개의 변수 num1, num2를 더한 후 결과를 short 타입으로 명시적 형변환하는 메서드를 작성하세요. 결과가 올바르게 저장되지 않는 상황에 대해서도 설명하세요.

```java
public class TypeCastingChallenge {
    public short addAndCast(long num1, int num2) {
        // 명시적 형변환 코드 작성
    }
}
```

내 해설)

```java
public class TypeCastingChallenge {
    public short addAndCast(long num1, int num2) {
        return (short) (num1 + num2); // 명시적 형변환
    }
}
```

여기서는 long과 int의 합이 int를 초과할 수 있기 때문에, 명시적 형변환을 사용해 short로 변환 시 데이터 손실이 발생할 수 있습니다. 따라서 이 결과가 short 타입 범위를 초과하면 원치 않은 값이 저장될 수 있습니다.
