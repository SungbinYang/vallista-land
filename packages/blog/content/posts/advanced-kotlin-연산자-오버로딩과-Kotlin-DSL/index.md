---
title: "[코틀린 고급] 연산자 오버로딩과 Kotlin DSL"
tags:
  - kotlin
image: ./assets/banner.png
date: 2026-02-21 16:49:27
series: 코틀린 고급
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [코틀린 고급편](https://inf.run/GZfvz) 강의를 참조하여 작성한 글입니다.

## 연산자 오버로딩

이번에는 연산자 오버로딩에 대해 학습해보도록 하겠다. 연산자 오버로딩은 이전 포스팅에서 지연과 위임에서 위임 객체를 만들면서 `getValue`, `setValue`에서 적용해본 기억이 있다.

``` kotlin
operator fun getValue(thisRef: R, property: KProperty<*>): T {
}

operator fun setValue(thisRef: R, property: KProperty<*>, value: T) {
}
```

위 함수를 보면 연산자 오버로딩의 두 가지 조건을 알 수 있다.

- `fun` 앞에 `operator`라는 키워드가 붙는다.
- 함수의 이름과 함수의 파라미터가 정해져있다.

연산자 오버로딩은 이 2개가 끝이다. 그려먼 구체적으로 예시를 들어서 한번 자세히 알아보자. 아래의 코드가 있다고 해보자.

``` kotlin
data class Point(
    val x: Int,
    val y: Int,
)
```

해당 좌표 클래스에서 x좌표와 y좌표의 점을 대칭시키고 싶은 요구사항이 나왔다고 해보자. 그러면 우리는 아마 아래처럼 작성할 것이다.

``` kotlin
data class Point(
    val x: Int,
    val y: Int,
) {
    fun zeroPointSymmetry(): Point {
        return Point(-x, -y)
    }
}
```

하지만 연산자 오버로딩을 사용하면, 조금 더 코드를 간결하게 만들 수 있다. `-` 연산자에 대한 오버로딩을 수행하려면 `unaryPlus()` 이름을 사용하여 만들어주면 된다.

``` kotlin
data class Point(
    val x: Int,
    val y: Int,
) {
    fun zeroPointSymmetry(): Point {
        return Point(-x, -y)
    }

    operator fun unaryMinus(): Point {
        return Point(-x, -y)
    }
}
```

그리고 아래와 같이 사용하면 된다.

``` kotlin
val point = Point(20, -10)
println(-point)
```

동일하게 함수를 만들었지만 `operator`를 만들고 정해진 함수 이름을 사용했더니 함수 이름과 연관된 연산자를 `Point`에서 직접 사용할 수 있었다. 이번엔 `+`와 비슷하게 `++` 연산자를 사용해 좌표의 값을 1씩 더해주도록 하자. `++`에 대응되는 함수 이름은 `inc()`이다.

``` kotlin
data class Point(
    val x: Int,
    val y: Int,
) {
    fun zeroPointSymmetry(): Point {
        return Point(-x, -y)
    }

    operator fun unaryMinus(): Point {
        return Point(-x, -y)
    }

    operator fun inc(): Point {
        return Point(x + 1, y + 1)
    }
}
```

이 두 연산자에 관해 추가적으로 알아 두어야 할 것이 있다. `+`는 다른 타입을 반환할 수 있지만, `++`는 반드시 같은 타입 또는 하위 타입을 반환해야만 한다. 또한, `++` 연산자는 변수 자체의 값이 증가한다는 뜻이므로, `var` 변수에만 사용할 수 있다. 예를 들어 `+` 연산자는 `Point`가 아닌 `Line`을 반환하게 할 수 있다. 반면, `++` 연산자는 `Line`을 반환하려 하면 에러가 난다. `+`와 유사한 연산자로는 `- / !`가 있고 `++`와 유사한 연산자로는 `--`가 있다. 우리가 익숙한 사칙연산 역시 오버로딩이 가능하다. 예를 들어 좌표 간의 덧셈을 다음과 같이 수행 할 수 있다. 바로 아래와 같이 말이다.

``` kotlin
data class Point(
    val x: Int,
    val y: Int,
) {
    operator fun plus(other: Point): Point = Point(x + other.x, y + other.y)
}
```

이때 꼭 같은 타입끼리 연산이 될 필요는 없다. 예를 들어 `LocalDate`에 확장 함수와 연산자 오버로딩을 활용해 재밌는 표현을 만들어 낼 수도 있다.

``` kotlin
data class DateTimes(
    val day: Long,
)

operator fun LocalDate.plus(datetimes: DateTimes): LocalDate {
    return plusDays(datetimes.day)
}
```

위와 같이 정의를 하면 아래와 같이 사용이 가능하다.

``` kotlin
println(LocalDate.of(2026, 2, 21) + DateTimes(3))
```

여기에 확장 프로퍼티를 사용하면 다음과 같은 표현도 가능하다.

``` kotlin
val Int.days: DateTimes
    get() = DateTimes(this.toLong())

println(LocalDate.of(2026, 2, 21) + 3.days)
```

이런 방식으로 시간이나 날짜들에 대한 코드들을 만들어 둔다면 읽기 쉽고 타입 안전한 날짜 / 시각 구성이 가능할 것이다.

산술 연산자와 대응되는 복합 대입 연산자 역시 오버로딩할 수 있다. 단, 그 로직은 조금 복잡하다. 복합 연산자는 다음과 같은 순서로 동작하게 된다.

- 가장 먼저, 복합 대입 연산자에 대응되는 함수가 있는지 확인한다. 예를 들어, `+=` 기호를 사용했다면, `+=`에 대응되는 `plusAssign()`이 있는지 확인한다.
- 만약 복합 연산자에 대응되는 함수가 없다면, 연관된 산술 연산자를 적용한다. 예를 들어, `+=` 기호를 사용했다면 `+`를 적용한다. 그 후, 그 결과로 변수를 변경하게 된다.
- 만약, `val` 변수라서 값을 변경할 수 없다면 에러를 뱉는다.

예시 코드를 한번 살펴보자.

``` kotlin
val mutableList = mutableListOf("A", "B", "C")
mutableList += "D"
```

이 코드에서 `mutableList`라는 변수 자체는 불변이다. 하지만, `MutableList`에는 `+=`에 대응되는 `plusAssign` 함수가 구현되어 있다. 따라서 `mutableList` 자체는 바뀌지 않고, `MutableList`에 D가 추가된다. 다음 예시도 살펴보자.

``` kotlin
var list = listOf("A", "B", "C")
list += "D"
```

이번에는 `list` 변수가 가변이지만 `List`는 불변이다. 그리고 `List`는 `plusAssign()`을 구현하지 않았다. 따라서 `List`의 `plus` 함수가 호출되고, 그 결과가 list 변수에 덮어 쓰인다. 그럼 위의 코드에서 만약 `var` 대신 `val`을 사용하면 어떻게 될까? `val` 변수이기 때문에 `plus` 함수 결과를 list에 대입할 수 없게 되고 따라서 에러가 발생하게 된다.

이 외에도 다양한 연산자 오버로딩이 가능하다. 대표적으로 `compareTo`는 비교 연산자에 `equals`는 `==`과 `!=`에 사용된다. 또한, `..` / `in` / `!in` 연산자도 오버로딩 할 수 있고, `List`와 `Map`에서 사용했던 `list[0] = 1` `map["A"]`와 같은 기능 또한 연산자 오버로딩에서 만들어진 것이다. 또한 함수 호출 역시 연산자이다. 그래서 이런 것이 가능하다.

``` kotlin
package me.sungbin.function

enum class Operator(
    private val oper: Char,
    val calcFun: (Int, Int) -> Int
) {
    PLUS('+', { a, b -> a + b }),
    MINUS('-', { a, b -> a - b }),
    MULTIPLY('*', { a, b -> a * b }),
    DIVIDE('/', { a, b ->
        if (b == 0) {
            throw IllegalArgumentException("0으로 나눌 수 없다")
        } else {
            a / b
        }
    })
    ;

    operator fun invoke(a: Int, b: Int): Int {
        return this.calcFun(a, b)
    }
}
```

함수 호출은 `invoke`로 오버로딩을 할 수 있다. 위와 같이 정의한 후에 아래와 같이 사용하면 정말 간단하게 `oper.calcFun`으로 호출하지 않아도 된다.

``` kotlin
fun calculate(num1: Int, num2: Int, oper: Operator) = oper(num1, num2)
```

이렇게, 코틀린의 연산자 오버로딩의 다양한 종류에 대해 살펴보았다. 연산자 오버로딩을 사용할 때 한 가지 주의할 점이 있는데, 바로 연산자 오버로딩은 연산자의 원래 의미에 맞게 사용하는 것이 제일 좋다는 것이다. 굉장히 직관적인 가이드이다! 생각해 보면, `+` 기호를 썼는데 `-` 기호처럼 동작하면 코드를 읽기에 불편할 것이다.

하지만, 이러한 주의할 점에도 예외가 있다. 바로 Kotlin DSL을 만들 때이다! Kotlin DSL을 만들 때는 연산자를 하나의 기호처럼 사용하기 때문에 꼭 원래 연산 의미를 유지할 필요가 없다.

### 코틀린 연산자 오버로딩 정리

<table style="border-collapse: collapse; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px;">
  <thead style="color: black;">
    <tr style="background-color: #f5f5f5;">
      <th style="border: 1px solid #ddd; padding: 12px 16px; text-align: left; font-weight: 600;">연산자 표현</th>
      <th style="border: 1px solid #ddd; padding: 12px 16px; text-align: left; font-weight: 600;">대응되는 함수</th>
    </tr>
  </thead>
  <tbody style="color: black;">
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">+a</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.unaryPlus()</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">-a</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.unaryMinus()</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">!a</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.not()</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a++</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.inc()</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a--</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.dec()</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a + b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.plus(b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a - b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.minus(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a * b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.times(b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a / b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.div(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a % b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.rem(b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a..b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.rangeTo(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a in b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>b.contains(a)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a !in b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>!b.contains(a)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a[i]</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.get(i)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a[i, j] 수를 늘릴 수 있다. (ex. a[1, 2, 3])</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.get(i, j)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a[i] = b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.set(i, b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a[i, j] = b 수를 늘릴 수 있다. (ex. a[1, 2, 3] = 4)</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.set(i, j, b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a()</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.invoke()</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a(i)</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.invoke(i)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a(i, j) 수를 늘릴 수 있다. (ex. a(1, 2, 3))</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.invoke(i, j)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a += b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.plusAssign(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a -= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.minusAssign(b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a *= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.timesAssign(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a /= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.divAssign(b)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a %= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.remAssign(b)</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a == b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a?.equals(b) ?: (b === null)</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a != b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>!(a?.equals(b) ?: (b === null))</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a &gt; b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.compareTo(b) &gt; 0</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a &lt; b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.compareTo(b) &lt; 0</code></td>
    </tr>
    <tr style="background-color: #fafafa;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a &gt;= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.compareTo(b) &gt;= 0</code></td>
    </tr>
    <tr style="background-color: #fff;">
      <td style="border: 1px solid #ddd; padding: 10px 16px;">a &lt;= b</td>
      <td style="border: 1px solid #ddd; padding: 10px 16px;"><code>a.compareTo(b) &lt;= 0</code></td>
    </tr>
  </tbody>
</table>

## Kotlin DSL 직접 만들어보기

이번에는 Kotlin DSL을 직접 만들어 보자. DSL이란 Domain-Specific Language의 약자로 HTML이나 SQL처럼 특정 목적을 위해 존재하는 언어를 말한다. Java, Kotlin, Python처럼 범용 프로그래밍 언어가 아니라 특정 영역에 국한된 목적을 갖고 있는 언어들이다.

Kotlin DSL의 가장 대표적인 예제로, HTML을 만들어 주는 빌더를 생각할 수 있다.

``` kotlin
fun result() =
html {
    head {
    }
    body {
        title {+"XML encoding with Kotlin"}
        h1 {+"XML encoding with Kotlin"}
        p {+"this format can be used as an alternative markup to XML"}
    }
}
```

이번에는 YAML 파일을 Kotlin DSL로 만들어보도록 하자!

> YAML은 도커나 스프링 등 다양한 곳에 사용되는 포맷이다.

우리는 아래의 docker-compose 파일을 출력해볼 예제를 만들 것이다.

``` yaml
version: '3'
services:
  db:
    image: postgres:13
  environment:
    - USER: myuser
    - PASSWORD: mypassword
  port:
    - "9999":"5432"
```

우리는 Kotlin DSL을 이용해 이 YAML 파일을 표현해 볼 것이다. DSL을 만드는 데는 정답이 없고, 정말 다양한 방식이 있겠지만 연습하는 차원에서 아래와 같이 만들어보도록 하자.

우리가 만들 객체는 다음과 같을 것이다. DockerCompose와 Service 클래스가 가장 주축이 되는 객체이다. 이것을 생각해서 스스로 독자분들께서 만들어보고 필자랑 비교해보자. 필자는 아래와 같이 만들었다.

``` kotlin
package me.sungbin.dsl.util

import me.sungbin.dsl.Environment
import kotlin.properties.ReadWriteProperty
import kotlin.reflect.KProperty

fun StringBuilder.appendNew(str: String, indent: String = "", times: Int = 0) {
    (1..times).forEach { _ -> this.append(indent) }
    this.append(str)
    this.append("\n")
}

fun String.addIndent(ident: String, times: Int = 0): String {
    val allIndent = (1..times).joinToString("") { ident }

    return this.split("\n")
        .joinToString("\n") { "$allIndent$it" }
}

fun <T> onceNotNull() = object : ReadWriteProperty<Any?, T> {
    private var value: T? = null

    override fun getValue(thisRef: Any?, property: KProperty<*>): T {
        requireNotNull(this.value) {
            "변수가 초기화 되지 않았습니다."
        }

        return this.value!!
    }

    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {
        require(this.value == null) {
            "이 변수는 한 번만 초기화 할 수 있습니다."
        }

        this.value = value
    }
}

operator fun String.minus(other: String): Environment {
    return Environment(this, other)
}
```

``` kotlin
package me.sungbin.dsl

import me.sungbin.dsl.util.addIndent
import me.sungbin.dsl.util.appendNew
import me.sungbin.dsl.util.onceNotNull

class DockerCompose {
    private var version: Int by onceNotNull()

    private val services: MutableList<Service> = mutableListOf()

    fun version(init: () -> Int) {
        version = init()
    }

    fun service(name: String, init: Service.() -> Unit) {
        this.services.add(Service(name).apply(init))
    }

    fun render(indent: String): String {
        return StringBuilder().apply {
            this.appendNew("version: '$version'")
            this.appendNew("services:")
            this.appendNew(
                services.joinToString("\n") {
                    it.render(indent)
                }.addIndent(indent, 1)
            )
        }.toString()
    }
}
```

``` kotlin
package me.sungbin.dsl

import me.sungbin.dsl.util.addIndent
import me.sungbin.dsl.util.appendNew
import me.sungbin.dsl.util.onceNotNull

class Service(
    val name: String,
) {
    private var image: String by onceNotNull()

    private val environments = mutableListOf<Environment>()

    private val portRules = mutableListOf<PortRule>()

    fun image(init: () -> String) {
        this.image = init()
    }

    fun env(environment: Environment) {
        this.environments.add(environment)
    }

    fun port(host: Int, container: Int) {
        this.portRules.add(PortRule(host, container))
    }

    fun render(indent: String): String {
        return StringBuilder().apply {
            this.appendNew("$name:")
            this.appendNew("image: $image", indent, 1)
            this.appendNew("environment:")
            environments.joinToString("\n") { "- ${it.key}: ${it.value}" }
                .addIndent(indent, 1)
                .also { this.appendNew(it) }

            this.appendNew("port:")

            portRules.joinToString("\n") { "- \"${it.host}\":\"${it.container}\"" }
                .addIndent(indent, 1)
                .also { this.appendNew(it) }
        }.toString()
    }
}
```

``` kotlin
package me.sungbin.dsl

data class PortRule(
    val host: Int,
    val container: Int,
)
```

``` kotlin
package me.sungbin.dsl

data class Environment(
    val key: String,
    val value: String,
)
```

``` kotlin
package me.sungbin.dsl

import me.sungbin.dsl.util.minus

fun dockerCompose(init: DockerCompose.() -> Unit): DockerCompose {
    val dockerCompose = DockerCompose()

    return dockerCompose.apply(init)
}

fun main() {
    val yml = dockerCompose {
        version { 3 }
        service(name = "db") {
            image { "postgres:13" }
            env("USER" - "myuser")
            env("PASSWORD" - "mypassword")
            port(host = 9999, container = 5432)
        }
    }

    println(yml.render("  "))
}
```

마지막으로, DSL을 만들 때 한 가지 알아두면 좋은 어노테이션을 살펴보자. 바로 `@DslMarker`이다. 이 어노테이션을 이해하기 위해서 아래 코드를 살펴보자. 우리가 만든 docker yaml DSL이다.

``` kotlin
val yml = dockerCompose {
    service(name = "db") {
        service(name = "web") {
        }
    }
}
```

위의 코드에는 뭔가 이상한 포인트가 있다. 바로 service안에 service가 들어가져 있다라는 것이다. 코틀린 문법 상으로 `dockerCompose` 함수의 `init` 함수 안에서 `serivce` 함수가 호출되는 것이니 문제가 될 것은 없어 보이지만 DSL 계층 상으로 service 안에서 serivce 함수가 호출되는 것은 매우 어색하다. 이럴 때 `@DslMarker`를 사용할 수 있다. 이 어노테이션을 붙이면, this의 생략은 가장 가까운 수신 객체에 대해서만 할 수 있게 된다. 즉, 두 번째 service 사용을 막을 수 있는 것이다. `@DslMarker` 어노테이션을 사용하려면 `@DslMarker` 어노테이션을 갖고 있는 어노테이션을 새로 만든 다음, 우리 클래스에 붙여줘야 한다.

``` kotlin
package me.sungbin.dsl.annotation

@DslMarker
annotation class YamlDsl
```

``` kotlin
package me.sungbin.dsl

import me.sungbin.dsl.annotation.YamlDsl
import me.sungbin.dsl.util.addIndent
import me.sungbin.dsl.util.appendNew
import me.sungbin.dsl.util.onceNotNull

@YamlDsl
class Service(
    val name: String,
) {
    private var image: String by onceNotNull()

    private val environments = mutableListOf<Environment>()

    private val portRules = mutableListOf<PortRule>()

    fun image(init: () -> String) {
        this.image = init()
    }

    fun env(environment: Environment) {
        this.environments.add(environment)
    }

    fun port(host: Int, container: Int) {
        this.portRules.add(PortRule(host, container))
    }

    fun render(indent: String): String {
        return StringBuilder().apply {
            this.appendNew("$name:")
            this.appendNew("image: $image", indent, 1)
            this.appendNew("environment:")
            environments.joinToString("\n") { "- ${it.key}: ${it.value}" }
                .addIndent(indent, 1)
                .also { this.appendNew(it) }

            this.appendNew("port:")

            portRules.joinToString("\n") { "- \"${it.host}\":\"${it.container}\"" }
                .addIndent(indent, 1)
                .also { this.appendNew(it) }
        }.toString()
    }
}
```

``` kotlin
package me.sungbin.dsl

import me.sungbin.dsl.annotation.YamlDsl
import me.sungbin.dsl.util.addIndent
import me.sungbin.dsl.util.appendNew
import me.sungbin.dsl.util.onceNotNull

@YamlDsl
class DockerCompose {
    private var version: Int by onceNotNull()

    private val services: MutableList<Service> = mutableListOf()

    fun version(init: () -> Int) {
        version = init()
    }

    fun service(name: String, init: Service.() -> Unit) {
        this.services.add(Service(name).apply(init))
    }

    fun render(indent: String): String {
        return StringBuilder().apply {
            this.appendNew("version: '$version'")
            this.appendNew("services:")
            this.appendNew(
                services.joinToString("\n") {
                    it.render(indent)
                }.addIndent(indent, 1)
            )
        }.toString()
    }
}
```

## DSL 활용 사례 살펴보기

이번 시간에는 국내 몇몇 기술 블로그의 사례를 통해 Kotlin DSL을 어떻게 활용하고 있는지 간단히 살펴보자!

- [기술 블로그 - Kotlin JDSL: Kotlin을 이용해 좀 더 쉽게 JPA Criteria API를 작성해 봅시다](https://engineering.linecorp.com/ko/blog/kotlinjdsl-jpa-criteria-api-with-kotlin)
- [유튜브 영상 - JPA 맘에 안 들어서 쿼리 라이브러리 만든 썰 | Kotlin JDSL part.1](https://www.youtube.com/watch?v=-Kdr6qq6uJI)
- [유튜브 영상 - 자바보다 쉬운 코틀린 쿼리 짜기 | Kotlin JDSL part.2](https://www.youtube.com/watch?v=infviM1XMvU)
- [토스](https://toss.tech/article/kotlin-dsl-restdocs)

이렇게 기술 블로그 외에도 우리가 자주 사용하는 gradle에서도 Kotlin DSL을 찾아볼 수 있다. 심지어 Kotlin DSL은 2023년 4월부터 groovy 대신 default 옵션이 되었다. 또한 다양한 프레임워크나 라이브러리에서 더 나은 생산성을 위해 Kotlin DSL을 활용하고 있다.

``` kotlin
// mockk, Kotlin-Style mocking
every { } returns 3

// kotest, Kotlin-Style assert
result shouldBe 100
```