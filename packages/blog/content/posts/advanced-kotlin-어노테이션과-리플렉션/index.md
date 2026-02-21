---
title: "[코틀린 고급] 어노테이션과 리플렉션"
tags:
  - kotlin
image: ./assets/banner.png
date: 2026-02-21 19:19:27
series: 코틀린 고급
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [코틀린 고급편](https://inf.run/GZfvz) 강의를 참조하여 작성한 글입니다.

## 코틀린의 어노테이션

이번에는 어노테이션에 대해 알아보자. 어노테이션의 사전적 정의를 찾아보면 다음과 같다.

> A note added to a text, book, drawing, etc. as comment or explanation

해석해 보면 어노테이션이란 “추가적인 설명 혹은 의견을 달기 위한 메모”라는 뜻이다. 자바나 코틀린에서 이야기하는 어노테이션도 이와 동일한 개념이다. 특정 코드에 어노테이션을 붙여 개발자에게 의견을 알리거나 무언가 특별한 일이 일어나도록 만들 수 있다. 이런 특별한 일은 리플렉션 기술과도 연결이 되고 단순히 어노테이션만 붙여서는 아무런 일도 발생하지 않는다.

그러면 코틀린 어노테이션을 만들어보자. 만드는 방법은 매우 간단하다. 아래처럼만 하면 끝이다.

``` kotlin
annotation class Shape
```

코틀린에서 어노테이션을 만들기 위해서는 `annotaiton class`를 사용한다. 어노테이션을 만들 때는 2가지 특별한 어노테이션을 추가로 붙일 수 있다. 첫번째는 `@Retention`이다.

``` kotlin
@Retention(AnnotationRetention.RUNTIME)
annotation class Shape
```

`@Retention`은 우리의 Shape 어노테이션이 저장되고 유지되는 방식을 제어한다. 적용할 수 있는 값은 3가지로 다음 의미를 갖고 있다.

- SOURCE : Shape 어노테이션이 컴파일 때에만 존재한다.
- BINARY : Shape 어노테이션이 런타임 때도 존재하지만, 리플렉션 기술을 활용할 수는 없다.
- RUNTIME : Shape 어노테이션을 리플렉션 기술에 활용할 수 있다.

코틀린에서 `@Retention`의 기본값은 RUNTIME 이기 때문에 대부분 Retention 어노테이션을 붙여주지 않아도 된다. 자바에서는 `BINARY`가 기본값이다. 다음으로는 `@Target`을 사용할 수 있다.

``` kotlin
@Target(AnnotationTarget.CLASS)
annotation class Shape
```

`@Target`은 우리의 Shape 어노테이션을 어디에 붙일지 선택할 수 있게 해준다. 예를 들어 CLASS라고 적으면 우리의 어노테이션을 클래스나 인터페이스에 붙일 수 있게 된다. 언어의 구성 요소가 다양한 만큼, AnnotationTarget의 종류는 굉장히 많고 @Target을 설정하지 않으면 거의 대부분의 구성 요소에 어노테이션을 붙일 수 있게 설정되어 있다. 또한 어노테이션은 추가적인 필드를 받을 수도 있다. 코틀린에서는 어노테이션 클래스에 생성자를 만들어 필드를 입력할 수 있게 해준다.

``` kotlin
annotation class Shape(
  val text: String,
  val number: Int,
  val clazz: KClass<*>
)
```

생성자에 들어갈 수 있는 타입은 다음과 같다.

- `Int`나 `Double` 같은 기본 타입과 `String`
- Enum 클래스, 다른 어노테이션, `KClass`
- 허용되는 타입의 배열

그런데 여기서 `KClass`는 정말 생소하게 느껴질 것이다. `KClass`는 코드로 작성된 클래스의 정보를 가지고 있는 클래스를 뜻한다. 예를 들어보겠다.

``` kotlin
package me.sungbin.reflection

class GoldFish(
    val name: String,
) {
    fun swim() {
        println("swimming")
    }
}
```

위와 같은 클래스가 있을 때 해당 클래스의 정보를 구하고 싶으면 아래와 같이 할 수 있다.

``` kotlin
package me.sungbin.reflection

fun main() {
    val kClass = GoldFish::class
}
```

`KClass` 값을 얻기 위해서는 클래스에 `::class`를 붙이면 된다.

이제 어노테이션을 만들었으니 사용해 보자! 어노테이션은 벌써 많이 사용해 보았지만, `@어노테이션` 문법을 이용해 어노테이션을 사용할 수 있다. 만약 여러 어노테이션을 붙이고 싶다면, `@[어노테이션1 어노테이션2]` 문법을 사용할 수도 있다. 어노테이션에 필드를 넘겨주고 싶다면, 코틀린에 있는 named argument를 활용할 수도 있고 단순히 순서대로 값을 넣어줄 수도 있다.

``` kotlin
annotation class Shape(
  val text: String,
  val number: Int,
)

// named argument를 사용한 방법
@Shape(number = 25, text = "안녕!")
class Hello

// 단순히 필드를 대입해준 방법
@Shape("안녕!", 25)
class Hello
```

만약, 어노테이션 필드 중 배열이 있다면 `[ ]` 기호를 사용해 필드를 대입해 주어야 한다! 잘 사용되지는 않지만, `arrayOf`라는 함수를 사용할 수도 있다.

``` kotlin
annotation class Shape(
  val texts: Array<String>,
)

// [ ]를 사용한 방법
@Shape(["A","B"])
class Hello

// arrayOf를 사용한 방법
@Shape(arrayOf("A", "B"))
class Hello
```

이렇게 코틀린의 어노테이션 사용법을 알아보았는데, 코틀린은 간결한 언어의 특성상 어노테이션을 붙인 위치가 애매할 수 있다.

``` kotlin
class Hello(@Shape val name: String)
```

여기서 `@Shape`은 어떤 언어 요소에 붙인 것일까?

- 생성자의 파라미터 name
- name이라는 프로퍼티
- name이라는 필드
- name의 getter

정말 애매하다. 이 때문에 우리는 특정 언어 요소에 어노테이션을 붙였다고 정확하게 알려주어야 할 때가 있다. 아래와 같이 말이다.

``` kotlin
class Hello(@get:Shape val name: String)
```

`@`와 `Shape` (어노테이션 이름) 사이에 `get:`을 추가할 수 있다. 이런 문법을 use-site target이라고 부른다. use-site target의 종류는 다음과 같다.

- property : 프로퍼티 자체
- field : 필드
- get : 프로퍼티 게터
- set : 프로퍼티 세터
- param : 생성자의 파라미터
- setparam : 프로퍼티 setter의 파라미터
- delegate : 위임 객체를 저장하는 필드
- receiver : 확장 함수나 확장 프로퍼티의 수신 객체
- file : 전체 파일

주로 사용되는 use-site target으로는 field / get / set 정도가 있으며, 만약 여러 요소를 붙일 수 있는 어노테이션이라면 param / property / field순으로 결정된다. 그런데 만약 Target에 제한을 두었다면 그 제한이 우선순위를 가지게 된다.

마지막으로 Repeatable annotation이라는 개념에 대해 살펴보자! 반복 가능한 어노테이션이란, 어노테이션을 한 언어 요소에 여러 번 붙이는 것을 말한다.

``` kotlin
@Shape("circle")
@Shape("star")
class Hello
```

기본적으로 어노테이션을 이렇게 반복해서 붙일 수는 없다. 반복해서 붙이려면 추가적인 별도의 작업을 해줘야 한다. Java에서는 이렇게 어노테이션을 반복해서 붙이려면 다음과 같은 코드를 작성해 주어야 했다.

``` java
// JavaShape의 배열을 가지고 있는 Container 어노테이션
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface JavaShapeContainer {
  JavaShape[] value();
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
// Repeatable 어노테이션으로 연결해 주어야 한다.
@Repeatable(value = JavaShapeContainer.class)
public @interface JavaShape {
}
```

코틀린에서는 간단히 `@Repeatable`이란 어노테이션을 우리가 만든 @Shape에 붙여주면 된다!

``` kotlin
package me.sungbin.reflection

@Repeatable
@Target(AnnotationTarget.CLASS)
annotation class Shape(
    val texts: Array<String>,
)
```

## 코틀린의 리플렉션

이번에는 코틀린의 리플렉션 기능들에 대해 살펴보고 간단한 예제를 한번 해보자. 우리가 오늘 만들 예제는 다음과 같다.

- 함수 `executeAll(obj: Any)`은 임의의 객체 obj를 받는다.
- obj가 `@Executable` 어노테이션을 갖고 있다면, 파라미터가 없고 반환 타입이 `Unit`인 함수를 모두 실행시킨다.

리플렉션 기술을 코드에서 사용하기 위해서는 한 가지 의존성을 추가해 주어야 한다.

``` kotlin
implementation(kotlin("reflect"))
```

리플렉션 API는 그렇게 어렵지 않다. 리플렉션 API는 결국 우리가 작성한 코틀린 코드를 표현하는 코드이다. 우리가 작성한 GoldFish 클래스 코드가 있으면 이 GoldFish 클래스 코드의 정보를 갖고 있는 `KClass<GoldFish>`가 있고, 여기서 `KClass<T>`가 바로 리플렉션 객체이다.

kClass의 정보를 얻기 위해서는 아래와 같이 해주면 된다.

``` kotlin
val goldFishKClass = GoldFish::class
```

또는 객체 인스턴스에서도 구할 수 있다.

``` kotlin
val reflection = Reflection()
val kClass2 = reflection::class
```

또는 자바처럼 `Class.forName`으로 풀 패키지명을 적어서 구할 수도 있다.

``` kotlin
val kClass3 = Class.forName("me.sungbin.reflection.Reflection").kotlin
```

반대로 `KClass<T>` 값에서 `Class<T>` 값을 얻고 싶다면, `.java`를 붙여주면 된다. 그런데 여기서 갑자기 의문이 생길 수 있다.

- `KClass<T>`는 무엇이고 `Class<T>`는 무엇인가?
- 코틀린 리플렉션과 자바 리플렉션의 차이는 무엇인가?

정답은 간단하다. 우리가 코틀린을 사용해 코드를 작성하고 있지만, 코틀린은 결국 JVM 위에서 바이트 코드로 실행되기 때문에, 코틀린의 클래스에 대해서는 코틀린 리플렉션을 적용할 수도 있고 자바 리플렉션을 적용할 수도 있다. 둘은 상호 보완적인 관계이다. 따라서 한쪽 진영에서 지원하지 않는 기능은 다른 쪽 진영의 기능을 활용할 수 있다.

예를 들어, 우리가 KClass를 만들기 위해 사용했던 `Class.forName()` 함수 자체가 자바 진영의 리플렉션 기능이다. 또 다른 예로, KClass에는 `inner class`인지 확인하는 `isInner` 기능이 있지만 inner class 라고 명시해서 적어주는 언어 특성은 코틀린에만 있기 때문에 자바 리플렉션 기능에는 `isInner()`라는 함수가 없다.

그럼 이제 KClass 의 주요 기능을 살펴보자. 코드에서 등장하는 `actual`은 코틀린 멀티플랫폼과 관련된 지시어로 `actual`이 있다면 특정 플랫폼의 코드, `expect`가 있다면 모든 플랫폼에서 사용하는 표준 인터페이스를 의미한다.

- `qualifedName` : `simpleName`과 달리 패키지 경로까지 포함한 이름을 반환한다.
- `members` / `constructos` : 클래스가 갖고 있는 함수, 프로퍼티, 생성자들을 반환하는 기능이다. 주석을 읽어보면 declared라는 단어를 확인할 수 있다. declared는 private, public을 구분하지 않고 코드에 선언된 모든 함수, 프로퍼티, 생성자를 가져온다는 의미이다. 자바의 리플렉션 API를 살펴보면 `getFields()` `getDeclaredFields()` 와 같이 declared가 붙은 메소드가 구분되어 있는데, private한 필드까지 포함해 반환하는지 여부로 구분하면 된다.
- `isData` / `isInner` / `isSaled` : 코틀린 리플렉션 API 이기 때문에 코틀린에서 제공하는 언어 특성과 연관된 기능들이 많이 제공된다.

`KClass`와 관련해서는 알아두면 좋을 두 가지 기능이 더 있다. 첫 번째는 `KClass.cast()` 함수이다! 이 함수는 들어오는 임의의 인스턴스를 KClass 타입으로 캐스팅해준다.

``` kotlin
fun castToGoldFish(obj: Any): GoldFish {
    return GoldFish::class.cast(obj)
}
```

두 번째는 `KClass`에서 `KType`을 얻어내는 방법이다. `KType`은 타입을 표현한 리플렉션 인터페이스로 어떤 타입이 null인지 아닌지, `out` / `in`과 같은 타입 변성에 붙어 있는지 정보를 갖고 있다. 이 함수는 `KClass.createType()`이다.

``` kotlin
val goldFishType = GoldFish::class.createType()
```

`KClass KType` 외에도 언어의 주요 구성요소인 `KParameter` / `KTypeParameter`도 존재한다. 또한 무언가 호출할 수 있다는 의미를 담고 있는 KCallable 인터페이스도 존재한다. 호출할 수 있다는 의미가 무엇일까? 함수나 프로퍼티처럼 무언가 실행시킬 수 있다는 의미이다! 이 둘은 각각 `KFunction` `KProperty`로 표현된다.

`KCallable`의 주요한 함수로는 `call`과 `callBy`가 존재한다.

- `call`: 가변인자로 파라미터를 받는다. 파라미터의 개수나 타입이 잘못되면 에러가 발생할 수 있다.
- `callBy`: `KParameter`를 key로 하는 `Map`을 받아 함수를 호출한다. `call`과 마찬가지로 파라미터의 개수나 타입이 잘못되면 에러가 발생할 수 있다.

또한, `KCallable`에서 parameters 필드는 주요하게 봐야 한다. 만약 멤버함수 이거나 확장함수일 경우, parameters의 첫 번째 파라미터로는 함수가 위치한 클래스를 갖고 있다. 아래의 코드가 있다고 해보자.

``` kotlin
package me.sungbin.reflection

@Shape(texts = ["A", "B"])
@Shape(texts = ["C", "D"])
class GoldFish(
    val name: String,
) {
    fun swim() {
        println("swimming")
    }
}
```

위의 클래스 swim 함수는 파라미터가 비어있지만 아래의 코드를 실행해서 확인해보면 swim이라는 함수에 GoldFish라는 파라미터를 갖고 있는 것처럼 보인다.

``` kotlin
GoldFish::class.members.filter { it.name == "swim" }.first().parameters
```

이 외에도 어노테이션을 붙일 수 있다는 의미인 `KAnnotatedElement`, `GoldFish`라고 적힌 글자가 `GoldFish` 클래스인지 `<GoldFish>` 타입 파라미터인지 구별하는 `KClassifier`등이 존재한다. 그러면 이것을 응용해서 한번 예제를 구현해보자. 구현한 결과는 제공할테니 독자가 먼저 스스로 풀기를 바란다.

``` kotlin
package me.sungbin.reflection

@Target(AnnotationTarget.CLASS)
annotation class Executable()
```

``` kotlin
@Executable
class Reflection {
    fun a() {
        println("a입니다.")
    }

    fun b(n: Int) {
        println("b입니다.")
    }
}

fun executeAll(obj: Any) {
    val kClass = obj::class

    if (!kClass.hasAnnotation<Executable>()) {
        return
    }

    val callableFunctions = kClass.members.filterIsInstance<KFunction<*>>()
        .filter { it.returnType == Unit::class.createType() }
        .filter { it.parameters.size == 1 && it.parameters[0].type == kClass.createType() }

    callableFunctions.forEach {
        it.call(obj)
    }
}
```