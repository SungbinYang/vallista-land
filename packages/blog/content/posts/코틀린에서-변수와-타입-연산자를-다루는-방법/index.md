---
title: "[코틀린] 코틀린에서 변수와 타입, 연산자를 다루는 방법"
tags:
  - 코틀린
image: ./assets/banner.png
date: 2025-07-19 14:42:27
series: 코틀린
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [최태현님의 인프런 강의](https://inf.run/r9oU)를 바탕으로 쓰여진 글입니다.

## 코틀린에서 변수를 다루는 방법

### 변수 선언 키워드 - `var`과 `val`의 차이점

자바 코드를 먼저 살펴보도록 하자. 아래와 같은 자바 코드가 존재한다고 해보자.

``` java
long number1 = 10L;
final long number2 = 10L;
```

자바에서 `long`과 `final long`의 차이는 가변이냐 불변이냐의 차이이다. 이것을 코틀린으로 옮기면 아래와 같아진다.

``` kotlin
var number1: Long = 10L // 타입 생략 가능
number1 = 5L

val number2: Long = 10L // 타입 생략 가능
```

코틀린에서 변수를 선언할때 가변 변수를 선언하려면 `var` 키워드를 넣어주면 되고 불변 변수를 선언하려면 `val` 키워드를 선언해주면 된다. 또한 위의 코드처럼 타입을 명시적으로 선언해줘도 되지만 생략도 가능하다. 코틀린에서 변수 값에 넣은 리터럴을 보고 알아서 타입 추론을 해준다. 또한 `val`로 선언한 변수는 불변이기 때문에 한번 초기화를 해주었다면 이 후 재할당이 불가능하다. 자바에서 `final`을 붙인 변수를 생각해보면 쉽게 이해가 가능할 것이다.

또한 자바와 마찬가지로 아래와 같이 변수만 선언해주고 해당 변수를 사용하려고 한다면 예외가 발생하게 된다. 따라서 반드시 사용 전에 초기화를 해줘야 한다.

``` kotlin
var number3: Long
println(number3) // 에러
```

또한 `val`로 선언된 컬렉션에 element를 추가할 수 있다. 아래의 자바코드처럼 `final`로 붙인 자바 리스트에 요소를 추가할 수 있는것처럼 말이다.

``` java
final List<Integer> numbers = Arrays.asList(1, 2);
numbers.add(3);
```

물론 해당 코드를 실행하면 `UnSupportedException`이 발생하겠지만 `List`타입 변수가 `ArrayList`를 할당한다면 예외 발생없이 추가가 가능하다. 지금 여기서 말하고 싶은건 요소 자체를 추가해도 컴파일 에러가 발생하지 않는다라는 것을 말하고 싶었다.

> 💡 팁
>
> 코틀린에서 변수를 선언할때 일단 `val`로 선언을 하고 가변인 경우에만 `var`로 변경하도록 하자.

### Kotlin에서의 Primitive Type

아래의 코드를 보면 알듯이 `long`은 primitive type이고 `Long`은 reference type이다.

``` java
long number1 = 10L;

Long number3 = 1_000L;
```

그러면 위의 코드를 코틀린에서는 어떻게 표현할까? 바로 아래와 같이 작성이 가능하다.

``` kotlin
var number5: Long = 10L
var number6: Long = 1_000L
```

코틀린에서는 연산을 사용할 때는 reference type 대신에 primitive type을 사용한다고 한다. 그런데 조금 이상하다. 지금 위의 코드를 보면 알 듯이 코틀린은 모두 `Long`인데 primitive type으로 변경을 한다면 박싱/언박싱 문제가 생기고 성능에 문제가 발생하지 않을까?

코틀린 공식문서 상에서 아래와 같이 이야기를 하고 있어서 우리는 전혀 걱정을 할 필요가 없다.

> 숫자, 문자, 불리언같은 몇몇 타입은 내부적으로 특별한 표현을 가지고 있다. 이 타입들은 실행 시에 primitive value로 표현되지만 코드에서는 평범한 클래스로 보이는 것이다. 즉, 프로그래머가 박싱/언박싱을 고려하지 않아도 되도록 코틀린에서 알아서 처리를 해준다.

### Kotlin에서 nullable 변수

자바에서 `Long`타입은 reference type이므로 `null`이 허용이 된다. 하지만 코틀린은 기본적으로 모든 변수가 `nullable`이다. 그래서 `null`이 들어가는 것을 허용하지 않는다. 하지만 만약 `null`을 허용하고 싶다면 아래와 같이 `null`이 허용된다고 명시적으로 표기를 해줘야 한다.

``` kotlin
var number7: Long? = 1_000L
number7 = null
```

코틀린에서 `null`이 변수에 들어갈 수 있다면 `타입?`를 사용해야 한다.

### Kotlin에서의 객체 인스턴스화

자바에서 객체를 인스턴스화를 한다면 아래와 같이 할 수 있다.

``` java
Person person = new Person("양성빈");
```

하지만 코틀린에서는 객체 인스턴스화를 할 때 `new` 연산자를 붙이지 않는다. 바로 아래처럼 말이다.

``` kotlin
val person = Person("양성빈")
```

## 코틀린에서 null을 다루는 방법

### Kotlin에서 null 체크

아래의 자바 코드를 살펴보자. 과연 아래의 코드는 안전한 코드일까?

``` java
public boolean startsWithA1(String str) {
  return str.startsWith("A");
}
```

메서드 인자로 들어온 `str`이 `null`일 가능성이 있기에 안전한 코드라고 볼 수 없다. 그래서 자바의 경우 `NPE`를 방지하고자 아래처럼 `null`일 경우를 체크하여 예외를 던지는 코드를 작성하곤 한다.

``` java
public boolean startsWithA1(String str) {
  if (str == null) {
    throw new IllegalArgumentException("null이 들어왔습니다");
  }
  return str.startsWith("A");
}
```

혹은 아래와 같이 `null`일 경우를 체크하여 `null`을 직접 반환 시키는 경우도 존재한다. 다만 반환 타입을 `Boolean`형으로 변경해줘야 한다.

``` java
public Boolean startsWithA2(String str) {
  if (str == null) {
    return null;
  }
  return str.startsWith("A");
}
```

혹은 아래와 같이 `false`를 반환 시키는 경우도 가능할 것이다.

``` java
public boolean startsWithA3(String str) {
  if (str == null) {
    return false;
  }
  return str.startsWith("A");
}
```

그러면 위의 3가지 유형의 메서드를 코틀린으로 변경해보도록 하겠다. 첫번째 예외를 던지는 코드를 한번 반환해보도록 하겠다.

``` kotlin
fun startsWithA1(str: String?): Boolean {
  if (str == null) {
      throw IllegalArgumentException("null이 들어왔습니다.")
  }

  return str.startsWith("A")
}
```

매개변수가 `null`일 가능성이 있기에 `?`를 붙여줘야 한다.

두번째 `null`을 직접 반환하는 메서드를 코틀린으로 변경해보도록 하자.

``` kotlin
fun startsWithA2(str: String?): Boolean? {
  if (str == null) {
      return null
  }

  return str.startsWith("A")
}
```

세번째 `false`를 반환하는 메서드를 코틀린으로 변경해보도록 하자.

``` kotlin
fun startsWithA3(str: String?): Boolean {
  if (str == null) {
      return false
  }

  return str.startsWith("A")
}
```

위의 코드를 보면 알 듯이 코틀린에서는 `null`이 가능한 타입을 완전히 다르게 취급한다. 그러면 `null`이 가능한 타입만을 위한 기능은 없을까?

### Safe Call과 Elvis 연산자

바로 **Safe Call**과 **Elvis 연산자**가 존재한다. Safe Call은 값이 `null`일 경우 실행하지 않고 `null`이 아니라면 그대로 실행하는 경우를 말한다. 아래의 코드를 보면 한번에 이해가 가능할 것이다.

``` kotlin
val str: String? = "ABC"
println(str.length) // 불가능:: null일 가능성이 있어서 컴파일 에러 발생
println(str?.length) // 가능
```

str값이 ABC이므로 출력은 3이 나오겠지만 만약 `null`이라면 `null`이 출력이 될 것이다.

다음으로 Elvis 연산자를 확인해보록 하자. Elvis 연산자는 연산의 결과가 `null`이면 뒤의 값을 이용하는 것을 말한다. Elvis 연산자는 아래의 코드를 보면 뭔가 단번에 이해가 가능할 것이다.

``` kotlin
val string: String? = null
println(string?.length ?: 0)
```

string이 `null`이므로 Elvis 연산자 `?:`로 인하여 값은 `null`이 아닌 0이 나오는 것이다.

그럼 코틀린으로 변환한 3개의 메서드는 현재 코틀린스럽지 못한다고 한다. 이것을 Safe Call과 Elvis 연산자를 이용해 코틀린스럽게 변경해보자.

``` kotlin
fun startsWithKotlinA1(str: String?): Boolean {
  return str?.startsWith("A") ?: throw IllegalArgumentException("null이 들어왔습니다.")
}
```

``` kotlin
fun startsWithKotlinA2(str: String?): Boolean? {
  return str?.startsWith("A")
}
```

``` kotlin
fun startsWithKotlinA3(str: String?): Boolean {
  return str?.startsWith("A") ?: false
}
```

또한 Elvis 연산자는 early return 구조에서도 많이 사용된다.

``` java
public long calculate(Long number) {
  if (number == null) {
    return 0;
  }
  // ...
}
```

위의 코드를 아래와 같이 변경이 가능한 것이다.

``` kotlin
fun calculate(number: Long?): Long {
  return number ?: 0;
}
```

### 널 아님 단언!!

혹시나 `null`이 들어오면 NPE가 발생하기 때문에 정말 `null`이 아닌게 확실한 경우에만 널 아님 단언 !!을 사용해야 한다.

``` kotlin
fun startsWith(str: String?): Boolean {
  return str!!.startsWith("A")
}
```

### 플랫폼 타입

코틀린에서 자바 코드를 가져다 사용할 때 어떻게 처리할까? 아래의 코드가 존재한다고 해보자.

``` java
package me.sungbin.lec02;

import org.jetbrains.annotations.Nullable;

public class Person {

    private final String name;

    public Person(String name) {
        this.name = name;
    }

    @Nullable
    public String getName() {
        return name;
    }

}
```

위의 `Person` 클래스를 이용한 코드를 작성해보자. `getName`을 호출할 때 이미 어노테이션으로 `null`일 가능성이 있다고 표시를 해준 상태이다. 그런데 아래와 같이 작성한다면 어떻게 될까?

``` kotlin
fun startsWithPersonName(str: String): Boolean {
  return str.startsWith("A")
}
```

위와 같이 함수를 선언하고 아래와 같이 사용하면 컴파일 예외가 발생한다.

``` kotlin
val person = Person("Robert")
println(startsWithPersonName(person.name))
```

왜냐하면 파라미터에 매개변수는 기본적으로 `null`을 허용하지 않기 때문이다. 그러면 `Person` 클래스에 `getName`의 어노테이션을 `NotNull`로 변경을 해준다면 정상적으로 실행될 것이다.

이처럼 `javax.annotation 패키지`라던지 `android.support.annotation 패키지`, `org.jetbrains.annotation 패키지`같이 `null`여부를 판단하는 어노테이션을 사용할 때 주의를 해야하는데 이런 어노테이션을 안 붙인다면 Kotlin에서는 이 값이 nulable인지 non-nulable인지 알 수가 없다. 코틀린이 `null` 관련 정보를 알 수 없는 타입을 **플랫폼 타입**이라고 부른다. 그리고 이 플랫폼 타입은 런타임시 예외가 발생할 우려가 존재한다.

그래서 이런 경우 자바 코드를 널 가능성을 확인하는 코드를 삽입하던지 아니면 코틀린으로 한번 래핑해야한다. 예를 들어보자. 만약 아래와 같은 자바 코드가 존재한다고 해보자.

``` java
public class JavaContext {

  public String getValue(String key) {
    if ("A".equals(key) || "B".equals(key)) {
      return "OK";
    }
    return null;
  }

}
```

key에 어떤 값이 들어오는지에 따라 `null`이 아닌 문자열을 반환하기도, `null`인 문자열을 반환하기도 하는 코드이다. 이 `JavaContext`의 `getValue` 함수를 코틀린에서 사용한다고 해보자. 그런데 우리의 프로젝트는 정말정말 size가 커서 `JavaContext`를 많이많이 사용해야 한다고 가정해보자. 그럼 문제점이 발생하기 시작한다. 바로 `JavaContext`의 의존성이 지나치게 퍼져 있다는 것이다. 바꿔 말하면, `JavaContext`를 사용하는 클래스가 너무 많다! `JavaContext`는 Java 라이브러리이고, 지금은 A나 B일 때 non-null String을 반환하지만, 버전이 변경되면서 또 어떻게 될지는 모르는것이다. 즉, `JavaContext`라는 클래스 변경에 우리의 프로젝트는 매우 취약한 상태이다.

그래서 코틀린으로 우리는 이것을 감싸줘야 한다. 아래와 같이 말이다. 여기서 우리가 원하는대로 안전하게 `null` 여부를 제어할 수 있다.

``` kotlin
class JavaContextWrapper(private val javaContext: JavaContext) {
  fun getValue(key: String): String {
    return javaContext.getValue(key)
      ?: throw IllegalArgumentException("key=${key}는 null을 반환했습니다.")
  }
}
```

## 코틀린에서 Type을 다루는 방법

### 기본 타입

자바의 기본타입에는 아래와 같이 존재한다.

> byte, short, int, long, float, double...

이 중에 자주 사용하는 `int`, `long`, `float`, `double`을 살펴보도록 하자.

코틀린에서는 기본적으로 선언된 기본 값을 보고 타입 추론이 가능하다.

``` kotlin
val number1 = 3 // Int
val number2 = 3L // Long
val number3 = 3.0f // Float
val number4 = 3.0 // Double
```

여기서 자바와 조금 다른 점이 존재한다. 자바는 기본 타입 간의 변환은 암시적으로 이루어지지만 코틀린은 기본 타입 간의 변환은 명시적으로 이루어지는 것을 알 수 있다. 코드를 통해 살펴보도록 하자.

``` java
int number1 = 4;
long number2 = number1;
```

`int` 타입의 값이 `long` 타입으로 암시적으로 변경된 것을 볼 수 있다. 자바에서는 더 큰 타입으로 암시적 변경이 된 셈이다.

``` kotlin
val number1 = 3
val number2: Long = number1 // Type mismatch
```

하지만 코틀린에서는 암시적 타입 변경이 불가능하다. 위와 같이 작성하면 컴파일 에러가 발생한다. 그러면 코틀린에서는 이럴때 어떻게 할까?

``` kotlin
val number1 = 3
val number2: Long = number1.toLong()
```

바로 위와 같이 `to변환타입()`을 사용해야 한다.

또한 만약 변수가 nullable이라면 적절한 처리가 필요할 것이다. 바로 아래와 같이 Elvis 연산자를 이용하여 처리를 해줘야 할 것이다.

``` kotlin
val number3: Int? = 3
val number4: Long = number3?.toLong() ?: 0L
```

그러면 만약 기본 타입이 아니고 일반 타입일 때 nullable에 대한 처리는 어떻게 할까? 아래의 자바 코드를 먼저 살펴보도록 하자.

``` java
public static void printAgeIfPerson(Object obj) {
  if (obj instanceof Person) {
    Person person = (Person) obj;
    System.out.println(person.getAge());
  }
}
```

### 타입 캐스팅

자바에서는 `instanceof` 키워드를 사용해서 주어진 타입이면 `true`를 반환 아니면 `false`를 반환시켜야 할 것이다. 그리고 `obj`를 캐스팅하여 사용을 해야했다. 물론 JDK14이후에는 아래와 같이 축약해서도 가능하긴 하다.

``` java
public static void printAgeIfPerson(Object obj) {
  if (obj instanceof Person person) {
    System.out.println(person.getAge());
  }
}
```

하지만 코틀린에서는 조금 더 직관적이고 간단하게 아래와 같이 사용이 가능하다.

``` kotlin
fun printAgeIfPerson(obj: Any) {
  if (obj is Person) {
      val person = obj as Person // as Person 생략 가능
      println(person.age)
  }
}
```

코틀린에서 `is`는 자바에서 `instanceof`이고 `as 타입`은 자바에서 타입 캐스팅을 뜻한다. 현재 위의 코드에서 `as Person`은 생략이 가능하며 아래와 같이 간편히 작성이 가능하다.

``` kotlin
fun printAgeIfPerson(obj: Any) {
  if (obj is Person) {
      println(obj.age)
  }
}
```

위와 같이 작성하는 것을 스마트 캐스트했다고 표현한다. 그러면 `instanceof` 반대도 존재할까? 자바에서는 `!`연산자를 붙이는 것처럼 코틀린에서도 `is` 키워드 앞에 `!` 연산자를 붙여주면 된다.

``` kotlin
fun printAgeIfNotPerson(obj: Any) {
  if (obj !is Person) {
      println("obj is not a person")
  }
}
```

만약 obj에서 `null`이 들어올 수 있을 경우는 코틀린에서 어떻게 표현할까? `as` 키워드 뒤에다가 `?`를 붙여주면 된다. 그리고 반환 타입을 명시적으로 선언하여 `?`를 붙여 `null`이 가능하다고 표기해줘야 한다. 또한 해당 변수를 사용할 때는 Safe Call을 사용하여 해야 한다.

``` kotlin
fun printAgeIfPersonOrNull(obj: Any?) {
  val person: Person? = obj as? Person
  println(person?.age)
}
```

정리를 해보자. 코틀린에서 `value is Type`는 value가 Type이라면 `true`를 아니면 `false`를 반환하며 앞에 `!`을 붙인 `!is`는 반대의 결과가 나타난다. `value as Type`는 value가 Type이면 Type으로 타입 캐스팅이 발생하며 아니면 `ClassCastException`이 발생한다. 만약 `as`뒤에 `?`를 붙여서 `value as? Type`으로 한다면 value가 Type이면 Type으로 캐스팅이 되고 value가 `null`이면 `null`을 반환하며 value가 Type이 아니더라도 예외가 발생하지 않고 `null`이 반환된다.

### 코틀린의 특이한 타입 3가지

코틀린에는 특이한 타입 3가지가 존재한다. 바로 `Any`, `Unit`, `Nothing`이다.

#### Any

- 자바의 Object 역할 (모든 객체의 최상위 타입)
- 모든 Primitive Type의 최상위 타입도 Any이다.
- Any 자체로 null을 포함할 수 없어 null을 포함하고 싶다면 Any?로 표현한다.
- Any에 equals / hashcode / toString 메서드도 존재한다.

#### Unit

- Unit은 자바의 void와 동일한 역할
- void와고는 다르게 Unit은 그 자체로 타입 인자로 사용이 가능하다.
- 함수형 프로그래밍에서 Unit은 단 하나의 인스턴스만 갖는 타입을 의미한다. 즉, 코틀린의 Unit은 실제 존재하는 타입이라는 것을 표현한다.

#### Nothing

- Nothing은 함수가 정상적으로 끝나지 않았다는 사실을 표현하는 역할
- 무조건 예외를 반환하는 함수나 무한 루프 함수에서 사용된다.

### String interpolation / String indexing

자바에서는 동적 문자열 출력을 진행할 때 `String.format`을 사용하거나 `StringBuilder`를 이용하곤 한다. 하지만 코틀린에서는 마치 자바스크립트처럼 아래와 같이 `${}`를 이용하여 사용이 가능하다.

``` kotlin
val person = Person("양성빈", 30)
println("이름: ${person.name}")
```

만약 `.`없이 변수만 출력하는 경우에는 아래와 같이 `{}`도 생략 가능하다.

``` kotlin
val person = Person("양성빈", 30)
println("이름: $person")
```

> 💡 팁
>
> 변수 이름만 사용하더라도 `${}`를 사용하는 것이 가독성, 일괄 변환, 정규식 활용 측면에서 좋으니 `${}`를 사용하도록 해보자.

다음으로 JDK17이후에 나오는 `""" """`로 개행제외 여러 문자열 출력 기능을 코틀린에서도 지원한다.

``` kotlin
val str = """
        ABC
        EFG
        ${person.age}
    """.trimIndent()

println(str)
```

또한, 자바에서는 특정 문자열의 특정 문자를 가져오려면 아래와 같이 했어야 한다.

``` java
String str = "ABCDEF";
char ch = str.charAt(1);
```

하지만 코틀린에서는 마치 배열 인덱스 접근처럼 아래와 같이 이용할 수 있다.

``` kotlin
val str = "ABCDEF"
val ch = str[1]
```

## 코틀린에서 연산자를 다루는 방법

### 단항 연산자 / 산술 연산자

단항 연산자 `++`, `--`와 산술 연산자 `+`, `-`, `*`, `/`, `%`와 산술 대입 연산자 `+=`, `-=`, `*=`, `/=`, `%=`는 자바와 코틀린 완전 동일하다.

### 비교 연산자와 동일성과 동등성

비교 연산자인 `>`, `<`, `>=`, `<=`는 자바와 코틀린 완전 동일하다. 단, 코틀린은 자바와 다르게 객체를 비교할 때 비교 연산자를 사용하면 자동으로 `compareTo`를 호출해준다.

``` java
package me.sungbin.lec04;

import org.jetbrains.annotations.NotNull;

import java.util.Objects;

public class JavaMoney implements Comparable<JavaMoney> {

  private final long amount;

  public JavaMoney(long amount) {
    this.amount = amount;
  }

  public JavaMoney plus(JavaMoney other) {
    return new JavaMoney(this.amount + other.amount);
  }

  @Override
  public int compareTo(@NotNull JavaMoney o) {
    return Long.compare(this.amount, o.amount);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    JavaMoney javaMoney = (JavaMoney) o;
    return amount == javaMoney.amount;
  }

  @Override
  public int hashCode() {
    return Objects.hash(amount);
  }

  @Override
  public String toString() {
    return "JavaMoney{" +
        "amount=" + amount +
        '}';
  }

}
```

위와 같은 자바 객체가 있을 때 코틀린에서 아래와 같이 비교 연산자를 사용하면 자동 `compareTo`를 호출해준다.

``` kotlin
val javaMoney1 = JavaMoney(1_000L)
val javaMoney2 = javaMoney1
val javaMoney3 = JavaMoney(3_000L)

if (javaMoney1 < javaMoney3) {
    println("Money1이 Money3보다 큽니다.")
}
```

그럼 이제 동등성과 동일성에 대해 살펴보도록 하자.

- 동등성: 두 객체의 값이 같은가
- 동일성: 완전히 동일한 객체인가? 즉 참조값이 같은가?

자바에서는 동일성 비교를 할 때 `==`을 사용하고 동등성을 비교할 때 `equals` 메서드를 오버라이딩하여 해당 메서드를 호출하여 사용한다. 하지만 코틀린에서는 동일성 비교를 할 때는 `===`을 사용하고 동등성 비교를 할 때는 `==`를 사용한다. `==`을 사용한다면 자동으로 `equals` 메서드를 호출해준다.

### 논리 연산자와 코틀린에 있는 특이한 연산자

논리 연산자인 `&&`, `||`, `!`는 자바와 완전 동일하며 자바처럼 Lazy 연산을 수행한다.

이 외의 코틀린에 있는 특이한 연산자가 있는데 바로 `in`과 `!in`이다. 해당 연산자는 컬렉션이나 범위에 포함되어 있다 아니다를 표현하는 것이다. 다음으로 `a..b`라는 `..`연산자가 존재한다. 해당 연산자는 a부터 b까지 범위 객체를 생성한다. 또한 이전에 배웠던 `a[i]`처럼 인덱싱 연산자도 사용이 가능하다. 해당 연산자는 a에서 특정 인덱스 i에 있는 값을 반환한다. 물론 `a[i] = b`같은 연산도 가능하다. 주로 이런 연산을 사용하는게 배열도 있겠지만 문자열도 가능하다.

### 연산자 오버로딩

코틀린에서는 객체마다 연산자를 직접 정의할 수 있다. 즉, 아래와 같이 정의가 가능하다.

``` kotlin
package me.sungbin.lec04

class Money(val amount: Long) {
    operator fun plus(money: Money): Money {
        return Money(this.amount + money.amount)
    }

    override fun toString(): String {
        return "Money(amount=$amount)"
    }
}
```

위와 같이 클래스를 정의하는데 `operator` 키워드를 통해서 연산자에 해당되는 메서드를 정의한다. 그리고 아래와 같이 메서드 호출하지 않고 직접 `+` 연산자를 사용하면 자동으로 `plus` 메서드가 호출된다.

``` kotlin
val money1 = Money(1_000L)
val money2 = Money(2_000L)

println(money1 + money2)
```

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!