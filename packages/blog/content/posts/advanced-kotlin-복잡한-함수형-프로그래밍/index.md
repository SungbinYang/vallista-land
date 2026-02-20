---
title: "[코틀린 고급] 복잡한 함수형 프로그래밍"
tags:
  - kotlin
image: ./assets/banner.png
date: 2026-02-20 18:21:27
series: 코틀린 고급
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [코틀린 고급편](https://inf.run/GZfvz) 강의를 참조하여 작성한 글입니다.

## 고차 함수와 함수 리터럴

이번에는 고차함수의 정의와 함수 리터럴에 대해 살펴보자.

먼저 고차함수란, 파라미터로 함수를 받거나 함수를 반환하는 함수를 뜻한다. 아래 코드를 살펴보자.

``` kotlin
fun add(num1: Int, num2: Int): Int {
    return num1 + num2
}
```

두 수의 덧셈을 하는 아주 간단한 함수이다. 이 함수는 파라미터로 정수 2개를 받고, 정수 1개를 반환한다. 파라미터 타입이나 반환 타입에 함수가 없기 때문에 고차 함수가 아니다. 또한, 이때 add 함수의 타입을 표현해 보면 `(Int, Int) -> Int`로 나타낼 수 있다. 괄호`( () )` 안에 있는 2개의 Int가 파라미터를 의미하고, 화살표 `(-> )` 다음에 있는 Int가 반환 값을 의미한다. 이때 괄호 안의 파라미터 순서 역시 중요하다.

그러면 아래의 함수를 살펴보자.

``` kotlin
fun compute(num1: Int, num2: Int, op: (Int, Int) -> Int): Int {
    return op(num1 ,num2)
}
```

이 함수는 파라미터로 정수 2개와 함수 1개를 받고, 정수 1개를 반환한다. 즉, 파라미터에 함수가 존재하기 때문에 compute 함수는 고차함수이다. 이때 op이라는 파라미터를 보면, `(Int, Int) -> Int`라는 타입을 가지고 있는데 위에서 살펴보았듯이, 정수 2개를 받아 정수 1개를 반환하는 함수 타입을 의미한다. 반환 타입에도 함수가 들어갈 수 있다.

``` kotlin
fun opGenerator(): (Int, Int) -> Int {
    TODO("함수 구현이 되지 않았다")
}
```

그러면 이제 고차함수인 `compute`를 호출해보자. 호출하는 방식은 익명함수 방식과 람다 방식이 존재한다. 한번 코드로 살펴보자.

``` kotlin
// 람다식을 활용하는 방법
compute(5, 3) { a, b -> a + b }

// 익명 함수를 활용하는 방법
compute(5, 3, fun(a: Int, b: Int) = a + b)
```

호출하는 함수 마지막 파라미터에 람다식이 들어가는 경우는 람다식을 함수 호출 부분 바깥으로 뺄 수 있기 때문에 `compute(5, 3 { a, b -> a + b })`에서 `compute(5, 3) { a, b -> a + b }`가 되었다. 또한 익명 함수는 우리가 익숙하게 작성하는 함수에서 함수 이름만 빠진 형태인데, 위와 같이 축약 형태로 작성할 수도 있고 아래와 같이 일반적인 형태로 작성할 수도 있다.

``` kotlin
compute(5, 3, fun(a: Int, b: Int): Int {
    return a + b
})
```

익명 함수를 사용할 때 문맥을 통해 파라미터 타입을 추론할 수 있다면, 파라미터 타입 지정을 생략할 수도 있다.

``` kotlin
// 익명 함수를 가장 간단히 만든 방법
compute(5, 3, fun(a, b) = a + b)
```

그리고 이 람다식과 익명 함수를 합쳐 **함숫값** 또는 **함수 리터럴**이라고 부른다. 리터럴이란, 프로그래밍 언어에서 사용되는 일반적인 용어로 소스 코드의 고정된 값을 나타내는 표기법을 뜻한다. 즉 우리가 고정되어 있는 함수를 나타내기 위해서 람다식 또는 익명 함수를 사용한 것이다.

그렇다면 람다식과 익명 함수는 어떤 차이가 있을까?! 이 둘은 2가지 차이가 존재한다.

- 람다식은 그 어떤 경우에도 반환 타입을 적을 수 없는 반면, 익명 함수는 함수 본문을 사용할 때 반환 타입을 적을 수 있다.
- 람다식 안에는 return 을 사용할 수 없지만, 익명 함수 안에는 return 을 사용할 수 있다.

아래의 코드를 살펴보자.

``` kotlin
fun iterate(numbers: List<Int>, exec: (Int) -> Unit) {
    for (number in numbers) {
        exec(number)
    }
}
```

정수로 구성된 `List`를 받아 주어진 함수를 실행시키는 함수 iterate를 만들었다. 그럼 이 함수를 이용해 1부터 5까지 출력하는데 3은 제외하고 출력하는 코드를 작성해보자. 먼저 익명함수로 구현하면 아래와 같을 것이다.

``` kotlin
iterate(listOf(1, 2, 3, 4, 5), fun(num) {
    if (num == 3) {
        return
    }

    println(num)
})
```

반면 람다식은 안에 `return`을 쓸 수 없기에 아래와 같이 해야 한다.

``` kotlin
iterate(listOf(1, 2, 3, 4, 5)) { num ->
    if (num == 3) {
        return@iterate
    }

    println(num)
}
```

바로 점프 라벨을 사용해서 표현하던가 아니면 조건식을 3이 아닐때로 작성해야 한다. 이렇게 람다식에 return이 있는 것을 가리켜 non-local return (비지역적 반환)이라고 부른다.

그리고 코틀린에는 default parameter가 있는데, 함수 타입의 파라미터 역시 default parameter를 활용할 수 있다.

``` kotlin
fun compute(
    num1: Int,
    num2: Int,
    op: (Int, Int) -> Int = { a, b -> a + b },
): Int {
    return op(num1, num2)
}
```

혹은 아래와 같이 익명함수를 사용해서 표현이 가능하다.

``` kotlin
fun compute(
    num1: Int,
    num2: Int,
    op: (Int, Int) -> Int = fun(a, b) = a + b,
): Int {
    return op(num1, num2)
}
```

그러면 한번 아래 계산기 예제를 함수형 및 객체지향적으로 표현해보도록 하겠다. 먼저 아래의 계산기 예제를 살펴보자.

``` kotlin
fun calculate(num1: Int, num2: Int, oper: Char): Int {
    return when (oper) {
        '+' -> num1 + num2
        '-' -> num1 - num2
        '*' -> num1 * num2
        '/' -> {
            if (num2 == 0) {
                throw IllegalArgumentException("0으로 나눌 수 없다")
            } else {
                num1 / num2
            }
        }

        else -> throw IllegalArgumentException("Invalid operator: $oper")
    }
}
```

위의 함수를 객체지향적으로 표현하려면 Enum Class를 이용하는 방식이 있다.

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
}
```

그리고 연산자에게 ‘연산 기능’을 부여하기 위해 Enum class가 함수를 갖도록 할 수 있다. Enum class의 타입을 추가할 때 calcFun의 기본 값을 함수 리터럴, 여기서는 람다를 활용해 넣어주었다.

``` kotlin
fun calculate(num1: Int, num2: Int, oper: Operator) = oper.calcFun(num1, num2)
```

Java에서는 비슷한 코드를 구현하기 위해 `BiFunction` 인터페이스를 활용해야 하지만, Kotlin에서는 함수가 1급 시민이기 때문에 함수 자체를 바로 활용할 수 있다.

## 복잡한 함수 타입과 고차 함수의 단점

복잡한 함수 타입과 고차 함수의 단점에 대해 살펴보도록 하자. 아래의 함수들을 보자.

``` kotlin
fun compute(num1: Int, num2: Int, op: (Int, Int) -> Int): Int {
    return op(num1, num2)
}

fun onGenerator(): (Int, Int) -> Int {
    return {a, b -> a + b}
}
```

위의 함수들은 전부 고차함수들이다. 고차함수이면서 코틀린에서는 함수를 일급시민으로 다루기 때문에 아래와 같이 표현이 가능하다.

``` kotlin
// 익명함수로 표현
val compute: (Int, Int, (Int, Int) -> Int) -> Int = fun(num1, num2, op): Int {
    return op(num1, num2)
}

val onGenerator: () -> (Int, Int) -> Int = { { a, b -> a + b } }
```

또한 코틀린에는 확장 함수라는 특별한 함수가 존재한다.

``` kotlin
fun Int.add(other: Long): Int = this + other.toInt()
```

이 확장 함수는 `Int` 타입을 확장하고 있으며, 확장되는 타입 `Int`를 수신객체 타입이라고 한다. 그렇다면 이 함수의 함수 타입은 무엇일까? 바로 `Int.(Long) -> Int`이다. 일반적인 함수 타입인 `(파라미터 타임) -> 반환타입`에 추가로 수신 객체 타입이 괄호 `( () )` 앞에 붙게 된다. 이러한 형태를 수신 객체가 있는 함수 리터럴(function literals with receiver)이라고 부르며 여기서 receiver가 수신 객체이다. 수신 객체가 있는 함수 리터럴은 DSL을 만들 때 유용하게 활용된다.

그럼 확장함수 호출은 어떻게 할까? 총 2가지 방법이 존재한다. `invoke()` 함수를 사용하거나 일반적인 함수를 호출하듯이 사용이 가능하다.

``` kotlin
val add = { a: Int, b: Int -> a + b }

add.invoke(5, 3)
add(5, 3)
```

또 다른 방법으로는 확장 함수를 사용하는 것처럼 수신 객체 변수로부터 함수를 호출하는 것이다.

``` kotlin
5.add(3L)
```

그렇다면 고차함수는 컴파일이 되었을 때 어떻게 처리 될까? 아래 코드를 컴파일 해보자.

``` kotlin
package me.sungbin.function

fun main() {
    compute(5, 3) { a, b -> a * b }
}

fun compute(num1: Int, num2: Int, op: (Int, Int) -> Int): Int {
    return op(num1, num2)
}
```

``` java
// main 함수 안
compute(2, 3, (Function2)null.INSTANCE);

// main 함수 바깥
public static final int compute(int num1, int num2, @NotNull Function2 op) {
    return ((Number)op.invoke(num1, num2)).intValue();
}
```

여기서 핵심은 Function2 타입이다. 우리가 고차함수에서 파라미터 혹은 반환타입에 함수를 사용하게 되면 코틀린에서는 이 함수를 FunctionN 클래스로 변환한다. 여기서 N은 파라미터 개수이다. 바꿔 말하면 우리가 함수를 변수처럼 사용할 때마다 `FunctionN` 타입의 객체가 자동으로 생기게 되고 이는 오버헤드로 이어진다. 심지어 고차 함수를 자유롭게 사용하던 중, 우리가 작성한 함수 리터럴이 외부의 가변 변수를 조작한다면 더 복잡해진다.

``` kotlin
var num = 5
num += 1

val plusOne = { num += 1 }
```

코드에서는 가변 변수 num이 존재하고, 함숫값 plusOne은, 밖에 있는 num에 1을 더해준다. Java에서는 람다에서 가변 변수에 접근할 수 없는 반면, 코틀린에서는 가능한데 그 이유를 아래 컴파일 코드에서 확인해 볼 수 있다.

``` java
final Ref.IntRef num = new Ref.IntRef();
num.element = 5;
++num.element;
Function0 plusOne = (Function0)(new Function0() {
    public Object invoke() {
        this.invoke();
        return Unit.INSTANCE;
    }
}

public final void invoke() {
    ++num.element;
});
```

코드에서 확인할 수 있듯이, Kotlin의 람다식이 가리키는 외부 변수는 `Ref`라는 객체로 한번 감싸진다. 그래야 `plusOne` 함수를 표현하는 `Function0` 객체에서 이 객체에 접근해 값을 변경할 수 있기 때문이다. 한번 정리를 해보겠다.

- 고차 함수를 사용하게 되면 `FunctionN` 타입의 클래스가 만들어지고 인스턴스화되어야 하므로 오버헤드가 발생할 수 있다는 점
- 함수에서 변수를 포획할 경우, 해당 변수를 `Ref`라는 객체로 감싸야하기 때문에 오버헤드가 발생할 수 있다는 점

결론적으로 고차 함수 사용은 일반적인 함수를 사용하는 것에 비해 성능 부담이 존재하고, 특히 반복문을 고차 함수와 함께 사용하면 익명 클래스가 반복 횟수만큼 인스턴스화될 수 있다. 그렇다면 고차 함수를 사용하지만 성능 부담을 없앨 수는 없을까?! 당연히 존재한다! 그 존재가 바로 inline 함수이다.

## inline 함수 자세히 살펴보기

함수에 `inline` 키워드를 붙이면, 함수를 호출하는 쪽에 함수 본문을 붙여 넣게 된다. 아래의 코드를 살펴보자.

``` kotlin
inline fun add(num1: Int, num2: Int): Int {
    return num1 + num2
}

fun main() {
    val num1 = 1
    val num2 = 2
    val result = add(num1, num2)
}
```

위의 코드를 컴파일을 하면 `add` 함수를 호출하는 대신에 덧셈 로직 자체가 `main` 함수에 적히게 된다.

``` java
public static final void main() {
    int num1 = 1;
    int num2 = 2;

    int var10000 = num1 + num2;
}
```

또한 inline 함수는 inline 함수가 사용하는 또 다른 함수 역시 인라이닝 시킨다. 아래의 코드를 살펴보자.

``` kotlin
inline fun repeat(
    times: Int,
    exec: () -> Unit,
) {
    for (i in 1..times) {
        exec()
    }
}

fun main() {
    repeat(2) { println("Hello") }
}
```

위와 같이 exec라는 함수를 파라미터로 받는 repeat 함수를 인라이닝 시켰다고 해보자. 위의 코드를 컴파일 하게 되면 아래와 같이 되게 된다.

``` java
public static final void main() {
    int i$iv = 1;

    while(true) {
        System.out.println("Hello World");
        if (i$iv == 2) {
            return;
        }
        ++i$iv;
    }
}
```

Hello World를 출력하는 람다까지 main 함수 안으로 인라인닝 된 것을 확인할 수 있다. 즉, inline 함수는 나 자신뿐 아니라 나와 연관된 다른 함수도 인라이닝 시키는 것이다. 물론, 모든 경우 인라인닝 시키는 것은 아니다. 아래의 코드를 통해 살펴보자.

``` kotlin
inline fun repeat(
    times: Int,
    exec: () -> Unit,
) {
    for (i in 1..times) {
        exec()
    }
}

fun main(exec: () -> Unit) {
    repeat(2) { exec }
}
```

여기서 exec 함수는 main 함수 밖에서 불러오는 함수이다. 해당 코드에서는 exec가 어떤 함수인지 판별이 어렵다. 따라서 컴파일을 하면 아래와 같이 된다.

``` java
public static final void main(@NotNull Function0 exec) {
    int i$iv = 1;
    while(true) {
        exec.invoke(); // exec을 알 수 없기 때문에 인라이닝 되지 않았다!!
        if (i$iv == 2) {
            return;
        }
        ++i$iv;
    }
}
```

또한, 파라미터에 넘어오는 함수를 알 수 있다고 하더라도 강제로 인라이닝 시키지 않을 수 있는데, 함수 앞에 `noinline` 지시어를 붙여주는 것이다.

``` kotlin
package me.sungbin.function

fun main() {
    repeat(2) { println("Hello") }
}

inline fun repeat(
    times: Int,
    noinline exec: () -> Unit,
) {
    for (i in 1..times) {
        exec()
    }
}
```

컴파일된 코드를 살펴보면, `{ println("Hello World") }`라는 함수 리터럴을 알 수 있음에도, `noinline` 지시어 때문에 `Function0` 인스턴스가 생겨 이 인스턴스의 `invoke()` 함수를 직접 호출하게 된다.

인라인 함수는 인라이닝만 관여하는 것이 아니다! 인라인 함수의 함수 파라미터는 non-local return을 사용할 수 있게 된다.

``` kotlin
package me.sungbin.function

fun main() {
    iter(listOf(1, 2, 3, 4, 5)) {num ->
        if (num == 3) {
            return
        }

        println(num)
    }
}

inline fun iter(
    numbers: List<Int>,
    exec: (Int) -> Unit,
) {
    for (number in numbers) {
        exec(number)
    }
}
```

원래라면 iterate를 사용할 때 람다식이 아닌 익명 함수를 사용해 return을 썼고, 람다식에서의 return은 금지되었다. 하지만, inline 함수를 사용할 때는 return을 람다식 안에서도 사용할 수 있다. 그리고 return은 가장 가까운 fun 키워드를 갖는 함수를 종료시키기 때문에 출력 결과는 1,2 까지만 나오게 된다. 위에서 본 것처럼, inline 함수의 함수 파라미터를 람다식으로 표현해 non-local return을 쓰게 되면, 예상치 못한 효과가 발생할 수 있다. 또한, inline 함수에서 함수를 받아, 다른 고차 함수에 함수를 전달해야 할 수도 있는데 이럴 때는 non-local return을 쓸 수 없다.

그러면 non-local return을 금지시키게 할 수 있을까? `crossinline` 지시어를 사용하면 가능하다.

``` kotlin
package me.sungbin.function

fun main() {
    repeat(2) { println("Hello") }
    iter(listOf(1, 2, 3, 4, 5)) {num ->
        if (num == 3) {
            return@iter
        }

        println(num)
    }
}

inline fun iter(
    numbers: List<Int>,
    crossinline exec: (Int) -> Unit,
) {
    for (number in numbers) {
        exec(number)
    }
}

inline fun repeat(
    times: Int,
    noinline exec: () -> Unit,
) {
    for (i in 1..times) {
        exec()
    }
}
```

똑같은 예제에서, exec 파라미터에 `crossinline` 지시어만 붙였다. 그렇게 되면 inline 함수였기에 사용 가능했던 람다식 안에서의 non-local return이 다시 사용할 수 없게끔 변경된다.

인라인 함수뿐 아니라, 인라인 프로퍼티란 것도 있다. 크게 어려운 내용은 아니고, 확장 함수와 비슷한 확장 프로퍼티가 있듯이 인라인 함수와 비슷한 인라인 프로퍼티가 있는 셈이다. 사용 방법 역시 프로퍼티 앞에 `inline` 키워드를 붙여주면 된다.

``` kotlin
class Person(val name: String) {
    inline val uppercaseName: String
        get() = this.name.uppercase()
}
```

## SAM과 reference

이번에는 SAM과 reference에 대해 살펴보자.

SAM이란, Single Abstract Method의 약자로, ‘SAM interface’라고 하면 추상 메소드를 하나만 갖고 있는 인터페이스를 의미한다. 대표적으로 Java의 `Runnable` 인터페이스가 있다. 이런 SAM interface는 Java에서 특별히 (Java의) 람다를 사용해 인스턴스화할 수 있다. 아래 코드 예시를 살펴보자.

``` java
@FunctionalInterface
public interface StringFilter {
    boolean predicate(String str);
}
```

JDK8 이전의 방식처럼 익명 클래스를 사용할 수 있고, JDK8에서 추가된 람다를 이용할 수도 있다.

``` java
// 익명 클래스를 사용하는 방법
StringFilter filter = new StringFilter() {
    @Override
    public boolean predicate(String str) {
        return str.startsWith("A");
    }
};

// 람다를 사용하는 방법
StringFilter filter = s -> s.startsWith("A");
```

핵심은, Java에서 SAM interface를 인스턴스화할 때 Java의 람다를 사용할 수 있다는 점이다. 반면, 코틀린에서는 람다를 이용해 SAM을 인스턴스화할 수 없다! 물론 코틀린 1.x 버전일때 이다. 코틀린 2.x에서는 가능하다. 해당 내용은 다른 포스팅에서 다루도록 하겠다.

``` kotlin
val filter: StringFilter = { s -> s.startsWith("A") } // Error: Type mismatch
```

만약 람다를 이용해 SAM을 인스턴스화 하고 싶다면, 람다식 앞에 인터페이스를 붙여줘야 한다. `StringFilter { }`와 같이 SAM 인터페이스 이름과 람다 조합된 형태를 SAM 생성자라고 부른다. 다행히 이 SAM 생성자를 항상 사용할 필요는 없고, 함수의 파라미터로 SAM 인터페이스를 전달할 때는 그냥 람다를 적어줘도 된다.

``` kotlin
consumeFilter({ s: String -> s.startsWith("A") })
```

그러나 이렇게 암시적으로 인스턴스화되는 경우는 때때로 의도되지 않는 동작을 불러올 수 있다. 아래의 인터페이스가 있다고 해보자.

``` java
package me.sungbin.function;

@FunctionalInterface
public interface Filter<T> {
    boolean predicate(T t);
}
```

그리고 오버로드가 적용된 consumeFilter 함수가 비슷하게 존재한다고 하자.

``` kotlin
fun consumeFilter(filter: StringFilter) { } // StringFilter를 받는다!

fun <T> consumeFilter(filter: Filter<T>) { } // Filter<T>를 받는다!
```

이 때, `consumeFilter({ s: String -> s.startsWith("A") })`를 호출하면 어떻게 될까? 정답은 조금 더 구체화된 인터페이스 `StringFilter`쪽이다. 이론적으로는 StringFilter를 받는 consumeFilter 가 호출될 수도 있고, `Filter<T>`를 받는 consumeFilter가 호출될 수도 있지만, 여러 후보가 있을 때 가장 구체화된 타입의 함수가 호출되는 메커니즘을 가지고 있다. 만약, `Filter<T>`를 받는 consumeFilter를 호출하고 싶다면 SAM 생성자를 사용해야 한다.

``` kotlin
consumeFilter(Filter<String> { s -> s.startsWith("A") })
```

추가적으로 코틀린에서 SAM 인터페이스를 만들고 싶다면 일반 인터페이스에 `fun` 키워드를 붙여주면 된다.

``` kotlin
fun interface KStringFilter {
    fun predicate(s: String): Boolean
}
```

그럼 이 인터페이스가 하나의 추상 메소드를 갖고 있는지 확인받을 수 있게 되고, SAM 생성자를 사용할 수도 있게 된다. 물론, 코틀린에서는 함수 자체를 파라미터에 쉽게 넣을 수 있기 때문에 SAM interface를 사용할 일이 드물긴 하다.

다음으로 reference에 대해 알아보자. 우리는 함수를 변수에 할당하는 방법으로 익명함수와 람다식 2가지가 존재한다.

``` kotlin
val add1 = { a: Int, b: Int -> a + b }

val add2 = fun (a: Int, b: Int) = a + b
```

그런데 만약 진작 존재하는 함수를 변수에 할당하고 싶다면 더 간단한 방법이 존재한다. 바로, `::`를 사용하는 것이다.

``` kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    val add3 = ::add // 람다식 또는 익명 함수 대신 ::를 사용할 수 있다!
}
```

이를 호출 가능 참조(callable reference)라고 부른다. 호출 가능 참조를 통해 얻어온 add3는 람다식이나 익명 함수를 사용할 수 있는 곳에 호환된다. 또한, :: 뒤에 add 와 같은 함수 대신 클래스의 이름을 적으면 클래스 생성자에 대한 호출 가능 참조를 획득한다.

``` kotlin
fun main() {
    val personConstructor = ::Person
}

class Person(
    val name: String,
    val age: Int
)
```

프로퍼티에 대해서도 호출 가능 참조를 만들 수 있다.

``` kotlin
fun main() {
    val getter = Person::name.getter
}

class Person(
    val name: String,
    val age: Int
)
```

이런 호출 가능 참조는 인스턴스화된 클래스에 대해서도 적용할 수 있고, 확장 함수에 대해서도 적용할 수 있다. 만약 주어진 클래스의 인스턴스 문맥 안에서 호출 가능 참조를 얻어올 경우 이를 바인딩된 호출 가능 참조(bound callable reference)라고 부른다.

``` kotlin
val p1 = Person("A", 100)
val boundingGetter = p1::name.getter // 바인딩된 호출 가능 참조
```

``` kotlin
fun Int.addOne(): Int {
    return this + 1
}

fun main() {
    val plus = Int::addOne // 확장 함수의 호출 가능 참조
}
```

Java 역시 JDK8부터 메소드 참조나 생성자 참조를 지원한다. Kotlin의 호출 가능 참조와 Java의 호출 가능 참조 차이점은 다음과 같다.

- Kotlin에서 호출 가능 참조를 사용해 나온 결과물은 일급 시민이다.
- Java에서는 호출 가능 참조 결괏값이 `Consumer`, `Supplier` 같은 함수형 인터페이스이지만 Kotlin에서는 리플렉션 객체이다.