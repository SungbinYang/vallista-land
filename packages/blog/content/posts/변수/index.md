---
title: "[자바 입문] 변수"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-16 22:24:27
series: 자바 입문
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/WUc1V)를 바탕으로 쓰여진 글입니다.

## 변수 시작

변수에 대해 알아보기 전에 변수가 왜 필요했는지 알아보자.

``` java
package variable;

public class Var {
    public static void main(String[] args) {
        System.out.println(10);
        // 수천 라인...
        System.out.println(10);
        // 수천라인...
        System.out.println(10);
    }
}
```

위와 같은 코드가 있다하자. 수 천라인의 코드들이 있고 그 사이에 10을 출력하는 출력코드가 존재한다. 여기서 갑자기 고객사 요구사항으로 100으로 변경요청이 들어왔다. 그러면 우리는 해당 수 천라인의 코드를 일일이 눈이 빠지도록 살펴봐야 할 것이다. 그리고 야근계를 작성하게 될 것이다. 매우 불행하다. 이를 위해 프로그래밍에서는 변수라는 개념을 도입하였다.

### 패키지

위의 샘플 코드를 보면 `package`라는 키워드가 보일 것이다. 지금은 그냥 디렉토리라고 생각하면 될 것이다. 자바 `src` 디렉토리 밑에 새로운 디렉토리를 생성 후 자바 파일을 그 안에 만들면 인텔리제이나 이클립스같은 IDE는 해당 파일이 어느 소속인지 표시하기 위해 `package`라는 키워드를 붙여준다. 그리고 반드시 해당 부분은 첫 줄에 적어줘야 한다. IDE를 사용하면 자동으로 만들어주니 개념만 알아두자.

> ⚠️ 주의
>
> 자바 파일이 위치하는 패키지와 `package 패키지명` 선언 위치가 같아야 한다.

그러면 샘플 코드를 변수를 통하여 변경해보자.

``` java
package variable;

public class Var {
    public static void main(String[] args) {
        int a; // 변수 선언
        a = 10; // 변수 초기화

        System.out.println(a);
        // 수천라인...
        System.out.println(a);
        // 수천라인...
        System.out.println(a);
    }
}
```

위와 같이 변경하면 a의 값만 변경해도 수천라인을 다 안봐도 자동으로 바뀐다. 우리는 칼퇴를 할 수 있을 것이다. 그러면 단순 사용법만이 아닌 해당 코드가 어떻게 동작하는지 살펴보자,

### 세부 동작

- `int a`
    - 정수를 보관할 수 있는 이름이 `a` 라는 데이터 저장소를 만든다. 이것을 변수라 한다.
    - 이렇게 변수를 만드는 것을 변수 선언이라 한다.
    - 쉽게 생각해서 숫자를 넣을 수 있는 마트 에코백 하나를 생성했다고 보면 된다.

- `a = 10`
    - 자바에서 `=` 은 오른쪽에 있는 값을 왼쪽에 저장한다는 뜻이다. 수학 기호를 생각하지 말자.
    - 숫자를 보관할 수 있는 데이터 저장소인 변수 `a` 에 값 `10` 을 저장한다.
    - 이것을 변수 초기화라고 한다.
    - 즉 에코백에 숫자 10을 집어넣었다고 생각하자.

- `System.out.println(a)`
    - 변수를 읽는 방법은 변수를 적어주기만 하면 된다.
    - 이전에 배운 출력문 `System.out.println()`에 변수를 적어주면 변수의 값이 출력된다.
    - 쉽게 생각해서 마트에 계산을 할때 에코백에서 물건을 꺼내는 것과 같다고 보면 좋을 것이다.
    - 물건을 꺼낸다고 내가 산 물건이 사라지지 않듯이 변수도 읽는다고 값이 사라지지는 않는다.

## 변수 값 변경

``` java
package variable;

public class Var {
    public static void main(String[] args) {
        int a; // 변수 선언
        a = 10; // 변수 초기화 a(10)
        System.out.println(a);

        a = 100; // 변수 값 변경: a(10) -> a(100)
        System.out.println(a);
    }
}
```

변수의 값을 변경도 가능하다. 한번 분석해보자. a라는 에코백을 하나 생성했다. 그리고 10이라는 아이템을 넣었다고 생각하자. 그리고 100을 넣으려고 한다. 하지만 에코백은 아이템 하나 밖에 못들어 간다. 그러면 기존 아이템은 버리고 넣을 아이템으로 교체를 해줘야 한다. 이렇게 이야기를 들으면 쉬울 것이다.

## 변수 선언과 초기화

### 변수 선언

변수를 선언하면 실제 PC 메모리에 공간을 차지한다. 그리고 해당 공간은 변수의 이름을 통해서 접근이 가능하다. 쉽게 생각하면 옛날 삼국시대때 이 지역은 백제영토라고 하는 것처럼 생각할 수 있을 것이다.

변수는 다음과 같이 하나씩 선언이 가능하거나

``` java
int a;
int b;
```

아래와 같이 연속으로 선언이 가능하다. 하지만 해당 방법은 실무에서 잘 못 봤던 것 같다.

``` java
int c, d;
```

### 변수 초기화

변수를 선언하고 선언한 변수에 처음으로 값을 저장하는 것을 변수 초기화라고 한다. 비유하면 에코백에 처음으로 물건을 담는 행위를 변수 초기화라고 보면 좋을 것 같다.

변수 초기화 방식은 여러 방식이 존재한다. 먼저 아래와 같이 선언과 초기화를 따로 하는 방식이 존재한다.

``` java
int a;
a = 10;
```

다음으로 변수 선언과 초기화를 동시에 하는 경우도 있다.

``` java
int a = 10;
```

마지막으로 여러 변수를 선언과 초기화를 함께 진행하는 경우가 존재한다.

``` java
int c = 3, d = 4;
```

그러면 만약 변수를 초기화하지 않고 사용한다면 어떻게 될까?

``` java
package variable;

public class Var {
    public static void main(String[] args) {
        int a;

        System.out.println(a);
    }
}
```

위와 같이 코드가 있다고 하자. 어떻게 될까? 실행하기도 전에 출력문에서 빨간 줄이 그어지면서 **컴파일 에러**가 발생한다.

``` bash
java: variable a might not have been initialized
```

왜 이런 오류가 발생할까? 쉽게 생각해보자. 내가 쓰는 에코백은 엄마도 쓰고 아빠도 쓰고 형도 쓰는 공용 에코백이라고 생각해보자. 해당 에코백을 비우지 않고 마트에 가다가 해당 에코백에 어떤 것들이 있을지 알 수가 없다. 이런 문제를 예방하기 위해 에코백을 먼저 비우고 마트를 가야 한다. 이처럼 PC도 메모리라는 공용공간을 쓴다. 그리고 변수를 선언할 때마다 어느 특정 공간에 공간이 마련된다. 하지만 그 공간은 어느 프로그램이 썼던 공간일지 모른다. 그렇기에 초기화하지 않고 변수를 사용하면 이상한 값이 나올 수 있기에 자바는 이것을 방지하고자 초기화하지 않으면 컴파일 에러를 강제한 것이다.

> ✅ 참고
>
> 지금 학습하는 변수는 지역 변수(Local Variable)라고 하는데, 지역 변수는 개발자가 직접 초기화를 해주어야 한다. 나중에 배울 클래스 변수와 인스턴스 변수는 자바가 자동으로 초기화를 진행해준다.

> ✅ 참고
>
> 컴파일 에러는 자바 문법에 맞지 않았을 때 발생하는 에러이다. 컴파일 에러는 오류를 빨리, 그리고 명확하게 찾을 수 있기 때문에 사실은 좋은 에러이다. 덕분에 빠르게 버그를 찾아서 고칠 수 있다.

## 변수 타입1

변수는 다양한 종류의 타입들이 존재한다. 먼저 코드를 보자.

``` java
int a = 100; // 정수
double b = 10.5; // 실수
boolean c = true; // 불리언(boolean) true, false 입력 가능
char d = 'A'; // 문자 하나
String e = "Hello Java"; // 문자열, 문자열을 다루기 위한 특별한 타입
```

변수는 크게 정수형 타입, 실수형 타입, 불리언형 타입, 문자형 타입, 문자열형 타입이 존재한다. 쉽게 생각해서 각 타입용 에코백이 있다고 보면 좋을 것 같다.

- `int`: 정수를 다룬다. ex. 10

- `double`: 실수를 다룬다. ex. 3.14

- `boolean`: 불리언 타입이라고 말하며 `true` 혹은 `false`가 존재한다.

- `char`: 문자 하나를 다룰 때 사용한다. 작은 따옴표를 사용해야 한다. ex. '가'

- `String`: 문자열(문자 집합)을 다룰 때 사용한다. 큰 따옴표를 사용해야 한다. ex. "자바"

> ✅ 참고
>
> String은 객체이면서 특별한 타입이다. 아직 객체의 개념에 대해 안 배웠으니 지금은 문자열을 담을 수 있는 에코백이라고 생각하자.

### 자신에 맞는 타입 사용

변수는 지정한 타입에 맞는 값을 넣어야 한다. 예를 들어 아래와 같이 하면 안된다.

``` java
int a = "100"; // 컴파일 에러
int b = false; // 컴파일 에러
boolean bool = "false" // 컴파일 에러
```

### 리터럴

변수에 집어 넣는 값 그 자체를 리터럴이라고 부른다.

``` java
int a = 100; //정수 리터럴
double b = 10.5; //실수 리터럴
boolean c = true; //불리언 리터럴
char d = 'A'; //문자 하나 리터럴
String e = "Hello Java"; //문자열 리터럴
```

쉽게 생각해서 에코백에 넣는 아이템이라고 생각하자.

## 변수 타입2

변수에는 다양한 타입이 있고 그 중에 숫자에도 다양한 타입들이 존재한다. 아래의 코드를 살펴보자.

``` java
// 정수
byte b = 127; // -128 ~ 127
short s = 32767; // -32,768 ~ 32,767
int i = 2147483647; //-2,147,483,648 ~ 2,147,483,647 (약 20억)

//-9,223,372,036,854,775,808 ~ 9,223,372,036,854,775,807
long l = 9223372036854775807L;

// 실수
float f = 10.0f;
double d = 10.0;
```

각 타입마다 특정 범위가 존재한다. 해당 범위 안의 값들만 넣을 수 있는 것이다. 만약 넘어기면 자바가 컴파일 에러를 발생시킨다. 쉽게 생각해서 에코백 크기가 다르다고 생각하면 된다.

보통 자바 문법책들을 보면 각 타입의 범위를 나열해서 보여준다. 하지만 필자는 적지 않겠다. 왜냐하면 이것을 다 외우는 것은 진짜 비효율적이고 실무에서 해당 메모리 크기를 생각하면서 개발하지 않기 때문이다.

> ✅ 참고
>
> 메모리 용량은 매우 저렴하다. 따라서 메모리 용량을 약간 절약하기 보다는 개발 속도나 효율에 초첨을 맞추는 것이 더 효과적이다.

### 리터럴 타입

리터럴에도 타입이 존재한다. 기본적으로 우리가 이제까지 썼던 정수는 전부 `int`타입이다. 따라서 `int`범위까지 표현할 수 있다. 숫자가 `int` 범위인 약 20억을 넘어가면 `L` 을 붙여서 정수 리터럴을 `long`으로 변경해야 한다. (대문자 `L` , 소문자 `l` 모두 가능하다 그런데 소문자 `l` 은 숫자 1과 착각할 수 있어서 권장하지 않는다.) 실수 리터럴은 기본이 `double` 형을 사용한다. `float` 형을 사용하려면 `f` 를 붙여서 `float` 형으로 지정해야 한다.

### 변수 타입 정리

그럼 이 많은 변수들의 타입들을 다 기억해야 할까? 다 기억하면 좋겠지만 실무에서는 쓰이는 타입들만 존재하고 안 쓰이는 타입들은 진짜 안 쓰인다.

#### 실무에서 잘 사용하지 않는 타입

- `byte`: 표현 길이가 너무 작다. 또 자바는 기본으로 4byte(`int` )를 효율적으로 계산하도록 설계되어 있다. `int`를 사용하자.
    - `byte` 타입을 직접 선언하고 여기에 숫자 값을 대입해서 계산하는 일은 거의 없다.
    - 대신에 파일을 바이트 단위로 다루기 때문에 파일 전송, 파일 복사 등에 주로 사용된다.

- `short`: 표현 길이가 너무 작다. 또 자바는 기본으로 4byte(`int` )를 효율적으로 계산하도록 설계되어 있다. `int` 를 사용하자.

- `float`: 표현 길이와 정밀도가 낮다. 실수형은 `double` 을 사용하자.

- `char`: 문자 하나를 표현하는 일은 거의 없다. 문자 하나를 표현할 때도 문자열을 사용할 수 있다.

#### 실무에서 자주 사용하는 타입

- 정수: `int`나 `long`을 자주 사용한다. 주로 `int`를 사용하다가 이것은 20억이 넘을 것 같아 보이면 long으로 변경하자.
    - 파일을 다룰 때는 `byte` 를 사용한다.

- 실수: 그냥 묻지도 따지지도 않고 `double`을 사용하자.

- 불린형: 이 타입은 `boolean` 하나 밖에 없어서 그냥 사용하자. 조건문에서 많이 사용한다.

- 문자열: 문자를 다룰 때는 문자 하나든 문자열이든 모두 `String` 을 사용하는 것이 편리하다.

## 변수 명명 규칙

자바에서 변수나 클래스등 이름을 짓는데 규칙과 관례가 존재한다. 여기서 규칙과 관례는 무엇일까? 쉽게 생각하자면 규칙은 채용공고의 자격요건이고 관례는 우대사항 느낌으로 보면 좋을 것 같다. 그럼 한번 규칙과 관례를 살펴보자.

### 규칙

- 변수 이름은 숫자로 시작할 수 없다. 그러나 숫자를 이름에 포함하는 것은 가능하다.

- 이름에는 공백이 들어갈 수 없다.

- 자바의 예약어를 변수 이름으로 사용할 수 없다.

- 변수 이름에는 영문자, 숫자, 달러 기호 또는 언더바만 사용할 수 있다.

### 관례

변수 이름은 소문자로 시작하는 것이 일반적이다. 여러 단어로 이루어진 변수 이름의 경우, 첫 번째 단어는
소문자로 시작하고 그 이후의 각 단어는 대문자로 시작하는 낙타 표기법(camel case)를 사용한다. 거의 이렇게 하면 자바의 관례는 끝이다! 몇가지 예외 케이스를 제외하고 말이다. 예외 케이스를 살펴보자.

- 클래스 같은 경우는 낙타 표기법을 지키면서 첫 글자만 대문자로 해주면 된다.

- 패키지명은 전부 소문자로 한다.

- 상수는 전부 대문자에 구분기호로 언더바를 이용한다.

> ✅ 참고
>
> 변수명은 의미있게 지어야 한다. 왜냐하면 실무에서 변수명을 볼 때 파악하기 힘들면 그 변수명을 지은 개발자한테 물어봐야 한다. 심지어 과거의 내가 물어봤다면 타임머신? 타고 물어봐야 하는 상황이 발생 할 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!