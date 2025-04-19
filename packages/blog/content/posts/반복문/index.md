---
title: "[자바 입문] 반복문"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-19 15:20:27
series: 자바
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/WUc1V)를 바탕으로 쓰여진 글입니다.

## 반복문 시작

반복문의 종류에는 `while`, `for`, `do-while`문이 존재한다. 그러면 왜 반복문을 학습해야 할까? 아래의 코드를 살펴보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        System.out.println("Hello World!");
        System.out.println("Hello World!");
    }
}
```

위의 코드처럼 특정 문자열을 3번 출력하는 로직이 있다고 하자. 그러면 우리는 3번 출력문을 작성해야 할 것이다. 하지만 만약 요구조건이 바껴서 1000번을 출력해야 한다면 오늘 야근을 해야할 것이다. 이런 야근을 피하기 위해서 자바에서 반복문이라는 것을 제공해준다. 그러면 반복문의 시작으로 `while`문에 대해 학습해보자.

## while문1

`while`문은 조건에 따라 코드를 반복할 때 사용한다.

``` java
while (조건식) {
    // 코드
}
```

그러면 while문이 어떻게 동작하는지 과정을 살펴보자.

1. 조건식을 확인해서 참인지 거짓인지 확인한다.
2. 참이면 while문의 코드블럭의 코드들을 수행한다.
3. 다시 조건식으로 돌아와 참인지 거짓인지 확인한다.

이 3개의 단계를 조건식이 거짓일때 까지 반복하는 과정으로 동작을 한다. 그럼 예제를 살펴보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        int count = 0;

        while (count < 3) {
            System.out.println("Hello World!");
        }
    }
}
```

## while문2

이제 예제를 통하여 `while`문에 대해 심도 있게 살펴보자. 먼저 `while`문 없이 코드를 작성해보고 `while`문을 사용하여 점진적으로 리팩토링 해보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        int number = 2;

        number = number * 1;
        System.out.println(number);

        number = number * 2;
        System.out.println(number);

        number = number * 3;
        System.out.println(number);

        number = number * 4;
        System.out.println(number);

        number = number * 5;
        System.out.println(number);

        number = number * 6;
        System.out.println(number);

        number = number * 7;
        System.out.println(number);

        number = number * 8;
        System.out.println(number);

        number = number * 9;
        System.out.println(number);
    }
}
```

위의 코드는 구구단에서 2단을 출력한 코드이다. 지금 보면 알겠지만 너무 비효율적인 것을 알 수 있다. 일단 반복문을 적용해보기 전에 먼저 할 수 있는 리팩토링 작업을 해보자. 코드를 쭉 살펴보면 1부터 9까지 1씩 증가하는 것을 볼 수 있다. 이것을 우리는 변수로 추출할 수 있을 것 같다. 그러면 한번 적용해보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        int number = 2;
        int i = 1;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;

        number = number * i;
        System.out.println(number);
        i++;
    }
}
```

다음으로 이제 반복문을 적용해보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        int number = 2;
        int i = 1;
        int endNumber = 9;

        while (i <= endNumber) {
            number = number * i;
            System.out.println(number);
            i++;
        }
    }
}
```

이렇게 하니 조금 더 깔끔한 코드가 된 것을 알 수 있다.

## do-while문

`do-while`문은 `while`문과 유사하지만 무조건 한번은 실행하고 반복문을 실행하고 싶을 경우 사용하면 된다.

``` java
do {
    // 코드
} while (조건식);
```

그럼 이전에 했던 구구단 예제를 `do-while`문으로 변경해보자.

``` java
package loop;

public class Loop {
    public static void main(String[] args) {
        int number = 2;
        int i = 11;
        int endNumber = 9;

        do {
            number = number * i;
            System.out.println(number);
            i++;
        } while (i <= endNumber)
    }
}
```

조금 억지스럽게 만든 예제이지만 이렇게 하면 22만 출력을 하고 더 이상 출력은 안 될 것이다. 이처럼 한번은 무조건 실행하려고 할 때 `do-while`문을 실행하면 된다.

## break, continue

`break`와 `continue`는 반복문에서도 사용 가능한 키워드이다. `break`는 이전 조건문을 볼 때 `switch`문에서 본 기억이 있을 것이다. 이렇게 조건문에서도 사용이 가능하지만 반복문에서도 주로 많이 사용한다. 그러면 해당 키워드들에 대해 살펴보기 전에 무한 반복문부터 알아보자.

### 무한 반복문

무한 반복문은 계속 끝없이 반복하는 코드를 말한다. 즉, 죽을때까지 계속 실행되는 코드이다. 이런 코드는 실제로는 게임이나 웹 어플리케이션을 직접 만들때 사용한다.

``` java
while (true) {
    // 코드
}
```

### break

`break` 는 반복문을 즉시 종료하고 나간다.

``` java
while(조건식) {
    코드1;
    코드2;
    break;//즉시 while문 종료로 이동한다.
}
//while문 종료
```

그럼 예제 코드를 살펴보자.

``` java
package loop;

public class Break1 {
    public static void main(String[] args) {
        int sum = 0;
        int i = 0;

        while (true) {
            if (sum > 100) {
                break;
            }

            ++i;
            sum += i;
        }

        System.out.println("i = " + i);
        System.out.println("sum = " + sum);
    }
}
```

위의 예제 코드는 1부터 100까지 더하는 로직을 가지는 코드이다.

### continue

`continue` 는 반복문의 나머지 부분을 건너뛰고 다음 반복으로 진행하는데 사용된다.

``` java
while(조건식) {
    코드1;
    continue;//즉시 조건식으로 이동한다.
    코드2;
}
```

예제 코드를 살펴보자.

``` java
package loop;

public class Continue1 {
    public static void main(String[] args) {
        int i = 0;

        while (i <= 10) {
            if (i % 3 == 0) {
                continue;
            }

            System.out.println(i);
            i++;
        }
    }
}
```

위의 예제 코드는 1부터 10까지 출력하는데 3의 배수는 제외시키는 로직이다.

## for문1

for문도 while문과 같은 반복문이고, 코드를 반복 실행하는 역할을 한다. for문은 주로 반복 횟수가 정해져 있을 때 사용한다.

``` java
for (초기식; 조건식; 증감식) {
    // 코드
}
```

for문은 다음과 같이 실행이 된다.

1. 초기식이 실행된다. 주로 반복 횟수와 관련된 변수를 선언하고 초기화 할 때 사용한다. 초기식은 딱 1번 사용된다.

2. 조건식을 검증한다. 참이면 코드를 실행하고, 거짓이면 for문을 빠져나간다.

3. 코드를 실행한다.

4. 코드가 종료되면 증감식을 실행한다. 주로 초기식에 넣은 반복 횟수와 관련된 변수의 값을 증가할 때 사용한다.

5. 다시 조건식으로 검증을 한다.

위의 프로세스로 실행이 된다. 그럼 예제 코드를 통해 살펴보자.

``` java
package loop;

public class For1 {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            System.out.println(i);
        }
    }
}
```

`while`문과 비교를 해보았을 때 `for`문이 정말 간편하게 보인다. 그 이유는 `while`문은 카운터 변수 선언과 증감로직이 같이 섞여 있어서 반복하는 핵심 로직과 분산이 되어 있어 많이 지저분해 보인다. 반면에 `for`문은 카운터 변수 증감 로직과 반복해야 하는 로직이 분리되어 있어 깔끔히 보인다. 즉, for문은 어떤게 반복되는지 한눈에 확인이 가능하지만 `while`문은 그렇지 않다. 그래서 실제로 실무에서도 while문에 비해 for문을 많이 이용한다.

추가적으로 while문에 비해 for문을 더 많이 사용하는 이유는 카운터 변수의 스코프 문제도 있다. for문은 카운터 변수가 for문 안에서 선언이 되어 있어서 그 안에서 밖에 사용이 불가능하지만 while문은 밖에 선언하므로 스코프 범위가 넓어진다. 해당 부분은 추후에 학습해보자.

> 📚 용어정리
>
> 카운터 변수란 의미가 단순히 증감하는 기준의 변수를 의미한다.

> 💡 꿀팁
>
> for문을 저렇게 코드로 다 일일이 치지 않아도 인텔리제이 IDE에서 기본으로 제공하는 `fori`라는 라이브 템플릿을 이용하면 쉽게 작성이 가능하다.

## for문2

for문에서 초기식, 조건식, 증감식은 선택이다. 즉, 생략도 가능하다. 만약 생략을 전부하면 무한반복문이 된다.

``` java
for (;;) {

}
```

정리하면 for문이 없이 while문으로 모든 반복을 다를 수 있다. 하지만 카운터 변수가 명확하거나, 반복 횟수가 정해진
경우에는 for문을 사용하는 것이 구조적으로 더 깔끔하고, 유지보수 하기 좋다.

## 중첩 반복문

반복문은 내부에 또 반복문을 만들 수 있다. `for` , `while` 모두 가능하다. 하지만 주로 for문을 이용해서 중첩 반복문을 만드는 것 같다. 대표적인 코드로 구구단을 만들 수 있다.

``` java
package loop.ex;

public class NestedEx {
    public static void main(String[] args) {
        for (int i = 2; i <= 9; i++) {
            for (int j = 1; j <= 9; j++) {
                System.out.println(i + "*" + j + "=" + i * j);
            }
            System.out.println();
        }
    }
}
```

## 정리

### for문

- 장점
    - 초기화, 조건 체크, 반복 후의 작업을 한 줄에서 처리할 수 있어 편리하다.
    - 정해진 횟수만큼의 반복을 수행하는 경우에 사용하기 적합하다.
    - 루프 변수의 범위가 for 루프 블록에 제한되므로, 다른 곳에서 이 변수를 실수로 변경할 가능성이 적다.
- 단점
    - 루프의 조건이 루프 내부에서 변경되는 경우, for 루프는 관리하기 어렵다.
    - 복잡한 조건을 가진 반복문을 작성하기에는 while문이 더 적합할 수 있다.

### while문

- 장점
    - 루프의 조건이 루프 내부에서 변경되는 경우, while 루프는 이를 관리하기 쉽다.
    - for 루프보다 더 복잡한 조건과 시나리오에 적합하다.
    - 조건이 충족되는 동안 계속해서 루프를 실행하며, 종료 시점을 명확하게 알 수 없는 경우에 유용하다.
- 단점
    - 초기화, 조건 체크, 반복 후의 작업이 분산되어 있어 코드를 이해하거나 작성하기 어려울 수 있다.
    - 루프 변수가 while 블록 바깥에서도 접근 가능하므로, 이 변수를 실수로 변경하는 상황이 발생할 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!