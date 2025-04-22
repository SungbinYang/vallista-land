---
title: "[자바 입문] 조건문"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-19 11:07:27
series: 자바
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/WUc1V)를 바탕으로 쓰여진 글입니다.

## if문1 - if,else

이제 우리는 조건문에 대해 살펴보는 시간을 가질 것이다. 지금까지 우리는 코드 한줄 한줄 순차적으로 실행하는 구조를 배웠다. 보통의 프로그래밍은 이렇게 실행되는 경우도 있지만 그렇지 않은 경우가 태반이다. 바로 이런 조건문때문이다. 조건문은 해당 조건식에 부합하면 실행을 하고 그렇지 않다면 실행하지 않는 구조로 되어 있다. 대표적으로 `if`와 `switch`문이 존재한다. 말로 하면 어떤 말인지 파악이 힘드니 sudo 코드로 살펴보자.

``` java
if (나이가 20세 이상) "성인입니다."

if (나이가 20세 미만) "미성년자입니다."
```

이렇게 위와 같이 `if`문에 조건식을 적어주는 형태를 조건문이라고 한다. 그러면 if문부터 자세히 살펴보자.

### if문

`if` 문은 특정 조건이 참인지 확인하고, 그 조건이 참(`true` )일 경우 특정 코드 블록을 실행한다.

``` java
if (조건식) {
  // 조건이 참일 때 실행되는 코드
}
```

> 📚 용어정리
>
> 코드 블록이란 `{}`사이에 있는 코드를 의미한다.

그러면 실제 코드로 if문이 어떻게 쓰이는지 살펴보자.

``` java
package cond;

public class IfSample {
    public static void main(String[] args) {
        int age = 20;

        if (age >= 20) {
            System.out.println("성인입니다.");
        }

        if (age < 20) {
            System.out.println("미성년자입니다.");
        }
    }
}
```

위의 코드를 비유적으로 살펴보면 정수형을 담는 에코백에 20이라는 아이템을 담고 계산원에 대해 가져다 주는 행위이다. 계산원은 조건문이라는 스킬을 사용해서 성인인지 아닌지 판단하는 로직을 한다. age의 값이 20이상이므로 "성인입니다."라는 콘솔이 출력될 것이고 다음 라인으로 넘어간다. 다음에는 20미만인지 판단을 하고 있다. 20미만이 아니므로 false가 나오고 해당 코드블럭은 실행되지 않는다.

### else문

`else` 문은 `if` 문에서 만족하는 조건이 없을 때 실행하는 코드를 제공한다.

``` java
if (조건식) {
  // 조건이 참일 때 실행되는 코드
} else {
  // 만족하는 조건이 없을 때 실행되는 코드
}
```

그러면 위의 if문 코드를 else까지 사용해서 리팩토링을 해보자.

``` java
package cond;

public class IfSample {
    public static void main(String[] args) {
        int age = 20;

        if (age >= 18) {
            System.out.println("성인입니다.");
        } else {
            System.out.println("미성년자입니다.");
        }
    }
}
```

이렇게만 보면 이제 이해가 어느정도 될 것이다. age값이 20이므로 if문 조건에 해당되므로 if문 코드블럭이 실행된다. 만약에 age값이 15였다면 if문 조건식은 false가 되므로 else문 코드블럭이 실행된다.

여기서 알 수 있듯이 if문 2개 쓰는 것보다 `if-else`문을 쓰는 것이 단순해 보인다. if문 2개는 생각을 2번 해야 한다. 각각 조건식을 비교하는 행위를 2번 해야하지만 `if-else`문은 조건식 한번만 생각하면 되므로 비교적 단순하다.

## if문2 - else if

`else-if`문을 알아 보기 전에 왜 `else-if`문이 필요한지 알아보자.

``` java
package cond;

public class IfSample {
    public static void main(String[] args) {
        int age = 14;

        if (age <= 7) {
            System.out.println("미취학");
        }

        if (age >= 8 && age <= 13) {
            System.out.println("초등학생");
        }

        if (age >= 14 && age <= 16) {
            System.out.println("중학생");
        }

        if (age >= 17 && age <= 19) {
            System.out.println("고등학생");
        }

        if (age >= 20) {
            System.out.println("성인");
        }
    }
}
```

위와 같은 코드가 있다고 하자. 얼핏보면 이 코드는 잘 짜여진 코드처럼 보인다. 하지만 실제로는 문제점잉 많은 코드이다.

- 불필요한 조건 검사: 이미 조건을 만족해도 불필요한 다음 조건을 계속 검사한다. age가 14라면 세번째 조건식에서 참이 된다. 하지만 밑에 2개의 조건식도 계속 검사를 해야 한다.

- 코드 효율성: 코드처럼 age가 14인 중학생이라면 첫번째 조건식에서 false이고 다음 조건식을 간다. 하지만 여기서 `age >= 8`이라는 조건을 검사하는데 여기서는 이전 조건식에서 이미 체크한 조건문일 것이다. age가 7보다 작거나 같다라는 조건을 통과하면 당연히 8이상이라는 것을 알 수 있듯이 말이다. 따라서 중복검사를 하는 것이다.

이런 문제점을 알고 프로그래밍에서는 `else-if`문을 만들었다.

``` java
if (조건1) {
  // 조건1이 참일 때 실행되는 코드
} else if (조건2) {
  // 조건1이 거짓이고, 조건2가 참일 때 실행되는 코드
} else if (조건3) {
  // 조건2이 거짓이고, 조건3이 참일 때 실행되는 코드
} else {
  // 모든 조건이 거짓일 때 실행되는 코드
}
```

위의 sudo 코드를 보면 감이 바로 올 것이다. 쉽게 말하면 여러 if문을 하나의 그룹으로 묶는 것이다. 하나의 조건식이라도 통과하면 바로 전체 if문 그룹을 빠져 나간다. 그러면 위의 여러 if문으로 되어 있던 코드를 else-if로 변경하자.

> ✅ 참고
>
> 위의 sudo코드에서 else는 생략 가능하다.

``` java
package cond;

public class If4 {
    public static void main(String[] args) {
        int age = 14;

        if (age <= 7) {
            System.out.println("미취학");
        } else if (age <= 13) {
            System.out.println("초등학생");
        } else if (age <= 16) {
            System.out.println("중학생");
        } else if (age <= 19) {
            System.out.println("고등학생");
        } else {
            System.out.println("성인");
        }
    }
}
```

## if문3 - if문과 else if문

`if` 문에 `else if` 를 함께 사용하는 것은 서로 연관된 조건일 때 사용한다. 그런데 서로 관련이 없는 독립 조건이면
`else if` 를 사용하지 않고 `if` 문을 각각 따로 사용해야 한다.

예시 코드를 통해 위에 설명한 말이 무엇인지 한번 살펴보자.

``` java
package cond;

public class IfSample {
    public static void main(String[] args) {
        int price = 10000;
        int couponCount = 10;
        int discount = 0;

        if (price >= 10000) {
            discount += 1000;
            System.out.println("10000원 이상 구매, 1000원 할인");
        }

        if (couponCount >= 10) {
            discount += 1000;
            System.out.println("쿠폰 1000원 할인");
        }

        System.out.println("총 할인 금액 : " + discount + "원");
    }
}
```

가격에 대한 할인 정책과 쿠폰에 대한 할인 정책은 엄밀히 보면 서로 관련된 조건식이 아니라는 것을 알 수 있다. 따라서 위와 같이 별도로 조건식을 해줘야 한다. 만약 그렇지 않은 경우 아래와 같은 사태가 발생한다.

``` java
package cond;

public class IfSample {
    public static void main(String[] args) {
        int price = 10000;
        int couponCount = 10;
        int discount = 0;

        if (price >= 10000) {
            discount += 1000;
            System.out.println("10000원 이상 구매, 1000원 할인");
        } else if (age <= 10) {
            discount += 1000;
            System.out.println("쿠폰 1000원 할인");
        } else {
            System.out.println("할인 없음");
        }

        System.out.println("총 할인 금액 : " + discount + "원");
    }
}
```

이럴 경우 만원 이상 구매했고 쿠폰 10개가 있어서 추가 할인을 받아야 하는 상황에서 만원이상 구매 할인밖에 받지를 못할 것이다.

> ✅ 참고
>
> if문의 코드 블럭은 코드 블럭 안에 들어 가 있는 코드 라인이 1줄이면 생략이 가능하다.
>
> ``` java
>
> if (age > 20) System.out.println("성인입니다.")
>
>```

참고사항 처럼 if문의 코드 블럭을 생략하면 보기가 좋을 것 같지만 사실 실무에서 이렇게 사용하지를 않고 아무리 1줄이더라고 무조건 코드블럭을 작성한다. 그러한 이유는 아래와 같다.

- **가독성**: 중괄호를 사용하면 코드를 더 읽기 쉽게 만들어 준다. 조건문의 범위가 명확하게 표시되므로 코드의 흐름
을 더 쉽게 이해할 수 있다.

- **유지보수성**: 중괄호를 사용하면 나중에 코드를 수정할 때 오류를 덜 발생시킬 수 있다. 예를 들어, `if` 문에 또 다
른 코드를 추가하려고 할 때, 중괄호가 없으면 이 코드가 `if` 문의 일부라는 것이 명확하지 않을 수 있다.

## switch문

`switch` 문은 앞서 배운 `if` 문을 조금 더 편리하게 사용할 수 있는 기능이다. 참고로 `if` 문은 비교 연산자를 사용할 수 있지만, `switch` 문은 단순히 값이 같은지만 비교할 수 있다. 쉽게 생각하자면 `if`문은 조건식이 범위같은 것을 표현할 때, `switch`는 조건식이 특정 값 비교일 때 사용한다. 그럼 sudo 코드를 한번 보자.

``` java
switch (조건식) {
  case value1:
    // 조건식의 결과 값이 value1일 때 실행되는 코드
    break;
  case value2:
    // 조건식의 결과 값이 value2일 때 실행되는 코드
    break;
  default:
    // 조건식의 결과 값이 위의 어떤 값에도 해당하지 않을 때 실행되는 코드
}
```

- 조건식의 결과 값이 어떤 `case` 의 값과 일치하면 해당 `case` 의 코드를 실행한다.

- `break` 문은 현재 실행 중인 코드를 끝내고 `switch` 문을 빠져나가게 하는 역할을 한다.

- 만약 `break` 문이 없으면, 일치하는 `case` 이후의 모든 `case` 코드들이 순서대로 실행된다.

- `default` 는 조건식의 결과값이 모든 `case` 의 값과 일치하지 않을 때 실행된다. `if` 문의 `else` 와 같다.
`default` 구문은 선택이다.

그럼 이제 예제 코드를 살펴보자.

``` java
package cond;

public class SwitchEx {
    public static void main(String[] args) {
        int level = 2;

        switch (level) {
            case 1:
                grantRead();
                break;
            case 2:
                grantWrite();
                break;
            case 3:
                grantDelete();
                break;
            default:
                System.out.println("접근 제한");
        }
    }
}
```

level이라는 변수에 값이 무엇이냐에 따라 분기를 나눈 것이다. 특정 값 비교일 때 이렇게 switch문을 이용한다.

> ⚠️ 주의
>
> `switch`문에서 주의할 점은 바로 case문 하위에 break를 꼭 적어야 한다. 그렇지 않은 경우 해당 switch문을 빠져 나오지 않고 아래로 쭉 실행된다. 위의 코드에 break문이 없다면 쓰기권한 뿐만 아니라 삭제권한까지 얻고 출력문으로 접근제한이라는 것까지 찍히니 이상한 코드가 될 것이다.

### 자바 14 새로운 switch문

`switch` 문은 `if` 문 보다 조금 덜 복잡한 것 같지만, 그래도 코드가 기대보다 깔끔하게 나오지는 않는다.
이런 문제를 해결하고자 자바14부터는 새로운 `switch` 문이 정식 도입되었다.

``` java
package cond;

public class SwitchEx {
    public static void main(String[] args) {
        int level = 2;

        switch (level) {
            case 1 -> grantRead();
            case 2 -> grantWrite();
            case 3 -> grantDelete();
            default -> System.out.println("접근 제한");
        }
    }
}
```

조금 더 간결해진 느낌은 있으나 개인적으로는 잘 모르겠다. 하지만 실무에서도 자주 사용하니 알아두긴 해야할 것 같다.

## 삼항 연산자

``` java
(조건) ? 참_표현식 : 거짓_표현식
```

- 삼항 연산자는 항이 3개라는 뜻이다. `조건` , `참_표현식` , `거짓_표현식` 이렇게 항이 3개이다.

- 조건에 만족하면 `참_표현식` 이 실행되고, 조건에 만족하지 않으면 `거짓_표현식` 이 실행된다. 앞의 `if` , `else` 문과 유사하다.

약간 `if-else`를 간편하게 보이기 위한 식이 삼항 연산자라고 생각하면 될 것 같다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!