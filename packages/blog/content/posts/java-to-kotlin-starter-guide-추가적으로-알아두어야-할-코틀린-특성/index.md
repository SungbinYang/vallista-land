---
title: "[코틀린 입문] 추가적으로 알아두어야 할 코틀린 특성"
tags:
  - kotlin
image: ./assets/banner.png
date: 2025-10-08 21:21:27
series: 코틀린 입문
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [자바 개발자를 위한 코틀린 입문(Java to Kotlin Starter Guide)](https://inf.run/yusn4) 강의를 참조하여 작성한 글입니다.

## 코틀린 이모저모

### Type Alias와 as import

우리가 코딩을 하다보면 긴 클래스 이름이나 함수 타입이 있을 때 축약하거나 더 좋은 이름으로 쓰고 싶을 때가 있다. 아래와 같은 코드가 있다고 하자.

``` kotlin
private fun filterFruits(
    fruits: List<Fruit>,
    filter: (Fruit) -> Boolean,
): List<Fruit> {
    return fruits
        .filter(filter)
}
```

filter의 타입을 보면 `(Fruit) -> Boolean`으로 `Fruit` 타입을 인자로 받아서 `Boolean`형을 반환하는 함수 타입니다. 하지만 이게 너무 길다고 느껴질 때가 있을 것이다. 이를 위해 코틀린에서는 type alias라는 기능을 제공해준다. 그리고 아래와 같이 변형해서 사용이 가능하다.

``` kotlin
typealias FruitFilter = (Fruit) -> Boolean

private fun filterFruits(
    fruits: List<Fruit>,
    filter: FruitFilter,
): List<Fruit> {
    return fruits
        .filter(filter)
}
```

또한, List나 Map과 같이 이름 긴 클래스를 컬렉션으로 사용할 때도 간단히 줄일 수 있다.

아래의 코드를 살펴보자.

``` kotlin
package me.sungbin.lec19.a

fun printHelloWorld() {
    println("Hello World")
}
```

``` kotlin
package me.sungbin.lec19.b

fun printHelloWorld() {
    println("Hello World")
}
```

서로 다른 두 패키지에 같은 이름의 함수를 쓰고 싶을 때는 어떻게 해야할까? 자바 같은 경우에는 둘 중 하나는 import를 해서 사용하고 나머지는 full package명을 적어줘야 했다. 하지만 코틀린에서는 as import라는 기능을 아래와 같이 제공해준다.

``` kotlin
package me.sungbin.lec19

import me.sungbin.lec19.a.printHelloWorld as printHelloWorldA
import me.sungbin.lec19.b.printHelloWorld as printHelloWorldB

fun main() {
    printHelloWorldA()
    printHelloWorldB()
}
```

`as import`란, 어떤 클래스나 함수를 임포트할 때 이름을 바꾸는 기능이다.

### 구조분해와 componentN 함수

구조분해란, 복합적인 값을 분해하여 여러 변수를 한번에 초기화 하는 과정을 의미한다.

``` kotlin
package me.sungbin.lec19

data class Person(
    val name: String,
    val age: Int,
)
```

위와 같은 data class가 있다고 하자. 이것을 구조분해 기능을 이용하면 아래와 같이 여러 변수를 받을 수 있다. 단, 순서는 선언된 필드 순서이니 주의 바란다.

``` kotlin
val person = Person("양성빈", 100)
val (name, age) = person

// val name = person.component1()
// val age = person.component2()
```

그러면 이런 구조분해는 어떻게 가능해진걸까? 사실, 구조분해를 하려면 `componentN` 함수를 정의해줘야 하는데 data class는 해당 함수를 자동으로 만들어주기에 우리가 특별한 설정 없이 사용 가능한 것이다. 만약 일반 클래스로 하려면 아래와 같이 정의를 해서 사용해야 한다.

``` kotlin
package me.sungbin.lec19

class Student(
    val name: String,
    val age: Int,
) {
    operator fun component1() = name

    operator fun component2() = age
}
```

``` kotlin
val student = Student("양성빈", 30)
val (studentName, studentAge) = student
```

> `componentN` 함수는 일종의 연산자처럼 사용하기에 `operator`라는 키워드를 붙여줘야 한다.

또한, 우리가 이전에 반복문이나 컬렉션 반복문을 하면서 배웠던 아래 코드에 key, value를 한번에 받는 것도 구조분해 기능 중 하나이다.

``` kotlin
for ((key, value) in map.entries) {
    println("$key: $value")
}
```

### Jump와 Label

우리는 반복문 시간에 `return`, `break`와 `continue`를 배우지 않았다. 코틀린에서도 자바와 같이 해당 기능을 사용할 수 있다.

- `return`: 기본적으로 가장 가까운 enclosing function 또는 익명 함수로 값이 반환된다.
- `break`: 가장 가까운 루프가 제거된다.
- `continue`: 가장 가까운 루프를 다음 step으로 보낸다.

해당 기능 전부 코틀린에서도 사용 가능하다. 단, `forEach` 안에서는 사용이 불가능하다. 그런데도 만약 `forEach`문에서 사용하고 싶다면 아래와 같이 해주면 된다.

``` kotlin
run {
    numbers.forEach { number ->
        if (number == 2) {
            return@run
        }
    }
}
```

해당 기능은 `break`에 대한 기능을 표현한 것이고 아래는 `continue`에 대해 작성한 것이다.

``` kotlin
run {
    numbers.forEach { number ->
        if (number == 2) {
            return@forEach
        }
    }
}
```

하지만, `break`, `continue` 기능을 쓸 때는 가급적 익숙한 for문을 사용하자! 왜냐하면 가독성 자체가 매우 떨어지기 때문이다.

코틀린에는 라벨이라는 기능을 제공한다. 특정 expression에 **라벨이름@**를 붙여 하나의 라벨로 간주하고 `break`, `continue`, `return` 기능을 사용하면 된다. 바로 아래와 같이 말이다.

``` kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (j == 2) {
            break@loop
        }
        println("$i, $j")
    }
}
```

하지만 이것은 매우 가독성이 떨어진다. 위의 로직상 대강 보면 `break`문을 통해서 가장 가까운 for문을 빠져 나갈 것 같지만 사실상 전체 반복문이 종료된다. 그래서 라벨을 사용한 Jump 기능은 사용하지 않는 것을 추천한다!

### TakeIf와 TakeUnless

코틀린에서는 메서드 체이닝을 위한 특이한 함수들을 제공한다.

``` kotlin
fun getNumberOrNull(number: Int): Int? {
    return if (number <= 0) null else number
}
```

위와 같은 함수가 있다고 하자. 주어진 인자의 수가 0이하면 null을 반환하고 아니면 그 값을 반환하는 로직이다. 이것을 `takeIf`로 변경하면 아래와 같다.

``` kotlin
fun getNumberOrNullV2(number: Int): Int? {
    return number.takeIf { it <= 0 }
}
```

`takeIf`는 주어진 조건을 만족하면 그 값을, 그렇지 않으면 null을 반환한다. 그 반대되는 함수도 있는데 바로 `takeUnless`이다. 주어진 조건을 만족하지 않으면 그 값이 반환되고 그렇지 않으면 null이 반환된다.

## 코틀린의 scope function

### scope function이란 무엇인가?

코틀린에서는 scope function이라는 것이 존재한다. scope function이란 무엇일까? scope의 사전적 의미는 영역을 뜻하고, function은 함수를 뜻한다. 즉, scope function은 일시적인 영역을 형성하는 함수를 뜻한다. 그러면 아랭 코드가 있다고 해보자.

``` kotlin
fun printPersonV1(person: Person?) {
    if (person != null) {
        println(person.name)
        println(person.age)
    }
}
```

위의 코드를 scope function을 활용하여 변경해보자! 리팩토링을 하면 아래와 같다.

``` kotlin
fun printPersonV2(person: Person?) {
    person?.let {
        println(it.name)
        println(it.age)
    }
}
```

위의 코드를 해석해보면 person이 null일 경우를 대비하여 safe call을 통하여 `let`이라는 scope function을 호출하였고 람다식으로 해당 로직을 작성하였다. 방금 설명했지만 `let`은 scope function 종류 중 하나이다. `let`은 람다식을 받아서 람다 결과를 반환하는 확장 함수 형태의 scope function이다. 또한, 람다 안에서 수신 객체를 접근할 때는 `it`라는 키워드를 사용해줘야 한다.

다시 scope function의 정의로 돌아와서 정리해보면 scope function은 람다를 사용해 일시적인 영역을 만들고 코드를 더 간결하게 만들거나 method chaining에 활용하는 함수를 scope function이라고 한다.

### scope function 분류

절대 외우지 말자! 필요할 때 찾아보면 되니 지금은 가볍게 정리한다는 마음으로 살펴보자.

scope function에는 `let`, `run`, `also`, `apply`, `with`가 존재한다. 여기서 `with`를 제외한 나머지는 전부 확장함수이다. 그럼 좀 더 살펴보자.

`let`과 `run`은 람다의 결과를 반환하며, `also`와 `apply`는 객체 그 자체를 반환한다. 한번 예시를 살펴보자.

``` kotlin
val value1 = person.let {
    it.age
}
val value2 = person.run {
    this.age
}
val value3 = person.also {
    it.age
}
val value4 = person.apply {
    this.age
}
```

value1과 value2는 age의 타입이 반환된다. 즉, value1과 value2는 age의 값이 들어가게 되는 건다. 반면, value3과 value4는 해당 객체 타입 즉, person 객체가 들어가게 된다. 이렇게 차이가 존재한다. 또 하나의 차이가 있는데 한번 살펴보자. value1과 value3는 수신 객체를 가리킬 때 `it` 키워드로 가리키고 value2와 value4는 수신 객체를 `this`로 가리킨다.

그러면 `it`와 `this`의 차이를 살펴보자.

- `this`: 생략이 가능한 대신, 다른 이름을 붙일 수 없다.
- `it`: 생략이 불가능한 대신, 다른 이름을 붙일 수 있다.

아래의 코드를 보면 더 이해가 될 것이다.

``` kotlin
val value2 = person.run {
    age
}
val value3 = person.also { p ->
    p.age
}
```

왜 이런 차이가 발생할까? 궁금하지 않나? 한번 `run`과 `also`의 내부 함수를 살펴보자.

``` kotlin
@kotlin.internal.InlineOnly
public inline fun <T, R> T.run(block: T.() -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}
```

``` kotlin
@kotlin.internal.InlineOnly
@SinceKotlin("1.1")
public inline fun <T> T.also(block: (T) -> Unit): T {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    block(this)
    return this
}
```

두 함수를 보면 `run`은 함수 인자로 확장 함수가 들어가는 반면, `also`는 함수 인자로 함수가 들어간다. 여기서 알 수 있듯이 확장 함수는 수신 객체를 `this`로 호출하거나 생략이 가능하다. 그래서 이런 차이가 발생하는 것이다. 그러면 이제 설명을 안 한 `with` 함수에 대해 살펴보자. `with`은 확장 함수는 아니고 함수이다. 그리고 함수다 보니, `this`를 사용해 수신 객체에 접근한다. 코드를 통해 살펴보자.

``` kotlin
val person = Person()
with(person) {
    println(name)
    println(this.age)
}
```

### 언제 어떤 scope function을 사용해야 할까?

그럼 언제 어느 상황에 어느 scope function을 사용해야 할까? 먼저 `let`을 살펴보자.

``` kotlin
val strings = listOf("APPLE", "BANANA")
    strings.map { it.length }
        .filter { it > 4 }
        .let(::println)
```

`let`은 위와 같이 하나 이상의 함수를 call chain 결과로 호출 할 때 사용된다.

``` kotlin
val str: String? = "abc"
val length = str?.let {
    println(it.uppercase())
    it.length
}
```

또한, non-null 값에 대해서만 code block을 사용하는 경우에 `let`을 사용하며 이 경우가 가장 많이 사용되는 것 같다.

``` kotlin
val numbers = listOf("one", "two", "three", "four")
numbers.first()
    .let { firstItem ->
        if (firstItem.length >= 5) firstItem else "!$firstItem!"
    }.uppercase()
```

또한, 일회성으로 제한된 영역에 지역 변수를 만들 때 사용하지만 요런 경우는 보통 private method를 만들어서 풀기는 해서 이런 케이스는 필자같은 경우는 잘 사용하지 않았던 것 같다.

다음은 `run` 함수를 언제 사용할 지를 살펴보자. `run` 함수를 사용할 때 대표적인 케이스로 **객체 초기화와 반환 값의 계산을 동시에 해야할 때** 사용한다. 대표적으로 아래와 같이 객체를 만들어 DB에 바로 저장하고, 그 인스턴스를 활용할 때 사용한다.

``` kotlin
val person = Person("양성빈", 30).run(personRepository::save)
```

하지만, 이런 경우도 잘 사용하지는 않는다. 필자는 자바로 개발을 시작했고, 아래와 같이 작성하는게 익숙하다. 또한, 반복되는 생성 후처리는 생성자, 프로퍼티, init block으로 넣는 것을 추천한다.

``` kotlin
val person = personRepository.save(Person("양성빈", 30))
```

다음으로 `apply` 함수를 살펴보자. `apply`는 객체 그 자체가 반환되며, 객체 설정을 할 때 객체를 수정하는 로직이 call chain 중간에 필요할 때 사용한다.

``` kotlin
fun createPerson(
    name: String,
    age: Int,
    hobby: String,
): Person {
    return Person(
        name = name,
        age = age,
    ).apply {
        this.hobby = hobby
    }
}
```

위와 같이 test fixture를 만들 때 제일 많이 사용하며, 필자 회사도 이렇게 fixture 함수를 만들 때 사용된다.

다음으로, `also` 함수를 알아보자. `also` 함수도 객체 그 자체가 반환되며, 객체를 수정하는 로직이 call chain 중간에 필요할 때 사용된다.

``` kotlin
mutableListOf("one", "two", "three")
        .also { println("The list elements before adding new one: $it") }
        .add("four")
```

마지막으로 `with` 함수에 대해 살펴보자. `with` 함수는 특정 객체를 다른 객체로 변환해야 하는데, 모듈간의 의존성에 의해 정적 팩토리 혹은 toClass 함수를 만들기 어려울 때 사용된다.

``` kotlin
return with(person) {
    PersonDto(
        name = name,
        age = age,
    )
}
```

`this`를 생략할 수 있어서 필드가 많아도 간결해지는 장점이 존재한다.

### scope function 가독성

scope function을 사용하는 코드가 그렇지 않은 코드보다 가독성이 좋은 것일까? 이펙티브 코틀린에서 이런 문제를 다루는데 아래 코드를 한번 살펴보자.

``` kotlin
// 1번 코드
if (person != null && person.isAdult) {
    view.showPerson(person)
} else {
    view.showError()
}

// 2번 코드
person?.takeIf { it.isAdult }
    ?.let(view::showPerson)
    ?: view.showError()
```

필자는 1번 코드가 더 가독성이 좋았다. 왜냐하면 자바에 익숙하기도 했고 딱 보이기 때문이다. 하지만 2번은 간결은 하지만 생각해야할 것이 많다.  구현 2번은 숙력된 코틀린 개발자만 더 알아보기 쉽지만 그 외에는 어려울 것이다. 그리고 1번 코드는 디버깅이 쉽지만 2번은 어려울 것이다. 또한, 2번코드에는 사이드 이펙트가 있다. 만약 let이 null이라고 한다면 view::showPerson을 수행하고 null을 반환한다. 그러면 엘비스 연산자로 showError()가 호출된다. 또한, 구현1번은 유지보수도 쉽다.

사용빈도가 적은 관용구는 코드를 더. 복잡하게 만들고 이런 관용구들을 한 문장 내에서 조합해 사용하면 복잡성이 훨씬 증가한다. 하지만 scope function을 사용하면 안되는 것도 아니다! 적절한 convention을 적용하면 유용하게 활용할 수 있다.