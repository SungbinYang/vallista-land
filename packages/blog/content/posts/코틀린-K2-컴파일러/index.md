---
title: "Kotlin 1.x에서 안 되던 코드가 2.0에서 된다? — K2 컴파일러가 바꿔놓은 Java SAM 변환의 모든 것"
tags:
  - 트러블 슈팅
image: ./assets/banner.png
date: 2026-02-20 18:58:27
series: 트러블 슈팅
draft: false
---

![banner](./assets/banner.png)

## 들어가며

최근 Kotlin 버전을 1.8에서 2.3으로 올리고 코드를 작성하던 중, 흥미로운 현상을 발견했다.

``` kotlin
package me.sungbin.function

fun main() {
    val filter: StringFilter = { s -> s.startsWith("A") }
}
```

`StringFilter`는 Java에서 정의한 함수형 인터페이스다. 그런데 이 코드가 Kotlin 1.8에서는 컴파일 에러가 나고, Kotlin 2.3에서는 정상 동작한다. 분명 Java SAM 인터페이스에 람다를 직접 대입하는 건 안 되는 걸로 알고 있었는데, 왜 지금은 되는 걸까? 이 글에서는 이 동작 변화의 원인을 파헤쳐 보고, Kotlin의 SAM 변환이 어떻게 발전해 왔는지를 정리해 본다.

## SAM 변환이란?

SAM은 Single Abstract Method의 약자로, 추상 메서드가 하나만 있는 인터페이스를 말한다. Java 8에서는 이런 인터페이스를 함수형 인터페이스(Functional Interface) 라고 부르며, `@FunctionalInterface` 어노테이션을 붙여 명시한다.

``` java
@FunctionalInterface
public interface StringFilter {
    boolean filter(String s);
}
```

Java에서는 이런 함수형 인터페이스 타입이 기대되는 곳에 람다를 직접 전달할 수 있다. 이걸 SAM 변환(SAM Conversion) 이라고 한다.

``` java
// Java — 람다를 함수형 인터페이스 타입 변수에 직접 대입
StringFilter filter = s -> s.startsWith("A");
```

Kotlin도 Java와의 상호운용성을 위해 SAM 변환을 지원한다. 하지만 그 지원 범위는 Kotlin 버전에 따라 달랐다.

## Kotlin에서의 SAM 변환 역사

### Kotlin 1.0 — Java SAM에 대한 기본 지원

Kotlin은 1.0부터 Java의 함수형 인터페이스에 대한 SAM 변환을 지원했다. 다만 지원되는 위치가 제한적이었다. 함수 인자로 전달할 때는 SAM 변환이 적용됐다.

``` kotlin
// Java 메서드: void applyFilter(StringFilter filter) { ... }

// 함수 파라미터로 전달 — SAM 변환 적용
applyFilter { s -> s.startsWith("A") }
```

SAM 생성자(SAM Constructor) 를 명시적으로 사용하는 것도 가능했다.

``` kotlin
// SAM 생성자 — 항상 가능
val filter = StringFilter { s -> s.startsWith("A") }
```

하지만 변수 타입을 명시하고 람다를 직접 대입하는 것은 불가능했다.

``` kotlin
// Kotlin 1.x에서 컴파일 에러!
val filter: StringFilter = { s -> s.startsWith("A") }
// Type mismatch: inferred type is (String) -> Boolean but StringFilter was expected
```

## Kotlin 1.4 — Kotlin 인터페이스에 대한 SAM 변환 (fun interface)

Kotlin 1.4에서는 `fun interface` 키워드가 도입되면서, Kotlin에서 정의한 인터페이스에도 SAM 변환을 사용할 수 있게 됐다.

``` kotlin
// Kotlin 1.4 이전에는 이게 안 됐음
interface MyFilter {
    fun filter(s: String): Boolean
}
val f = MyFilter { s -> s.startsWith("A") } // 컴파일 에러

// Kotlin 1.4부터 fun interface로 선언하면 SAM 변환 가능
fun interface MyFilter {
    fun filter(s: String): Boolean
}
val f = MyFilter { s -> s.startsWith("A") } // OK
```

이 시점에서 많은 개발자들이 "Kotlin에서 SAM 변환이 안 된다"고 알고 있던 것은, 바로 이 Kotlin 인터페이스에 대한 SAM 변환이 안 됐던 것을 기억하는 경우가 많다. 하지만 `fun interface` 도입 이후에도, Java 함수형 인터페이스에 대해 변수에 람다를 직접 대입하는 것은 여전히 불가능했다.

## Kotlin 2.0 — K2 컴파일러와 SAM 변환의 확장

그리고 마침내 Kotlin 2.0에서 K2 컴파일러가 정식 도입되면서, 이 제한이 해제됐다.

``` kotlin
// Kotlin 2.0+ (K2 컴파일러)에서는 이것도 된다!
val filter: StringFilter = { s -> s.startsWith("A") }
```

## 구 컴파일러는 왜 이걸 허용하지 않았을까?

이유를 이해하려면, 구 컴파일러의 타입 추론 방식을 알아야 한다.

### 구 컴파일러의 타입 추론 흐름

구 컴파일러가 `val filter: StringFilter = { s -> s.startsWith("A") }`를 만났을 때, 내부적으로 다음과 같은 순서로 처리했다.

- 우변의 람다 타입 결정: `{ s -> s.startsWith("A") }`는 `(String) -> Boolean` 함수 타입으로 추론된다.
- 좌변의 기대 타입 확인: `StringFilter`는 Java 인터페이스 타입이다.
- 타입 호환성 검사: `(String) -> Boolean` != `StringFilter` -> Type mismatch!

구 컴파일러는 SAM 변환을 특정 위치에서만 적용했다.

- 함수 호출 시 인자로 전달하는 위치
- SAM 생성자를 명시적으로 사용하는 경우

이는 구 컴파일러의 프론트엔드 아키텍처가 BindingContext라는 거대한 해시 테이블 기반 구조에 의존했기 때문이다. 타입 정보를 단계별로 수집하고 저장하는 이 방식에서는, 대입문의 기대 타입 정보를 람다의 타입 추론 단계에 자연스럽게 전달하기가 구조적으로 어려웠다.

### SAM 생성자로 우회하는 방법

그래서 구 컴파일러에서는 SAM 생성자를 사용해 명시적으로 변환을 지시해야 했다.

``` kotlin
// SAM 생성자 — 컴파일러에게 "이 람다를 StringFilter로 변환해라"고 명시적으로 알려줌
val filter = StringFilter { s -> s.startsWith("A") }
```

SAM 생성자는 컴파일러가 자동으로 생성하는 팩토리 함수처럼 동작하며, 람다를 해당 인터페이스의 구현체로 명시적으로 감싸준다.

## K2 컴파일러는 무엇이 다른가?

### 완전히 새로 작성된 프론트엔드

K2 컴파일러는 Kotlin 컴파일러의 프론트엔드(의미 분석, 호출 해석, 타입 추론 담당) 를 완전히 새로 작성한 것이다. 공식 문서에서는 이를 다음과 같이 설명한다.

> With the arrival of the K2 compiler, the Kotlin frontend has been completely rewritten and features a new, more efficient architecture. The fundamental change the new compiler brings is the use of one unified data structure that contains more semantic information.
>
> — K2 compiler migration guide

### 구 컴파일러 vs K2 컴파일러의 내부 구조 차이

구 컴파일러는 PSI(Program Structure Interface) 와 BindingContext에 의존했다.

- PSI는 소스 파일의 모든 정보를 담고 있어 크고 복잡하다.
- BindingContext는 바인딩 정보를 거대한 해시 맵 구조로 관리했다.
- 변수 참조 하나를 조회하는 데도 여러 번의 맵 조회가 필요했다.

K2 컴파일러는 FIR(Frontend Intermediate Representation) 이라는 새로운 트리 기반 데이터 구조를 사용한다.

- FIR은 PSI보다 간결하면서도 더 많은 의미 정보를 포함한다.
- 트리 노드에서 직접 값을 접근하므로 해시 맵 조회가 필요 없다.
- 타입 추론 시 기대 타입 정보가 자연스럽게 하위 노드로 전파된다.

### K2에서의 타입 추론 흐름

K2 컴파일러가 동일한 코드를 처리할 때는 이렇게 동작한다.

- 좌변의 기대 타입 확인: `StringFilter`가 기대된다.
- 기대 타입 정보를 우변으로 전파: 람다에게 "네가 `StringFilter`가 되어야 한다"는 정보를 전달한다.
- SAM 변환 가능 여부 확인: `StringFilter`는 Java 함수형 인터페이스이고, 람다의 시그니처가 `filter(String): Boolean`과 일치한다.
- 암시적 SAM 변환 적용: 람다를 `StringFilter` 구현체로 자동 변환한다.

핵심 차이는 K2 컴파일러가 기대 타입(Expected Type) 정보를 적극적으로 활용한다는 것이다. 구 컴파일러에서는 대입문의 기대 타입 정보가 SAM 변환 판단에 반영되지 않았지만, K2에서는 기대 타입이 SAM 인터페이스인 모든 위치에서 암시적 SAM 변환이 가능해졌다.

## 실제 코드로 보는 동작 차이

다양한 케이스에서 Kotlin 1.x와 2.0+의 동작 차이를 정리해 보자.

### Case 1: 변수 대입

``` java
// Java
@FunctionalInterface
public interface StringFilter {
    boolean filter(String s);
}
```

``` kotlin
// Kotlin
val filter: StringFilter = { s -> s.startsWith("A") }
```

- Kotlin 1.x: Type mismatch
- Kotlin 2.0+: 정상 컴파일

### SAM 생성자 (명시적)

``` kotlin
val filter = StringFilter { s -> s.startsWith("A") }
```

- Kotlin 1.x: 정상 컴파일
- Kotlin 2.0+: 정상 컴파일

### Case 3: 함수 인자로 전달

``` kotlin
fun applyFilter(filter: StringFilter) { /* ... */ }

applyFilter { s -> s.startsWith("A") }
```

- Kotlin 1.x: 정상 컴파일
- Kotlin 2.0+: 정상 컴파일

### Case 4: 함수 반환 타입으로 사용

``` kotlin
fun createFilter(): StringFilter {
    return { s -> s.startsWith("A") }
}
```

- Kotlin 1.x: Type mismatch
- Kotlin 2.0+: 정상 컴파일

Case 4에서 볼 수 있듯이, K2 컴파일러는 변수 대입뿐만 아니라 기대 타입이 명확한 모든 위치에서 SAM 변환을 적용한다.

흥미로운 점은, Kotlin의 `fun interface`는 1.4부터 변수 대입에서의 SAM 변환을 지원했지만, Java 함수형 인터페이스는 2.0이 되어서야 동일한 동작이 가능해졌다는 것이다. 이는 Kotlin `fun interface`의 SAM 변환이 Kotlin 컴파일러 내부에서 직접 처리되는 반면, Java SAM의 경우 Java-Kotlin 상호운용 레이어를 통해 처리되기 때문이다. K2 컴파일러에서 이 상호운용 레이어의 타입 추론까지 개선되면서 비로소 일관된 동작이 가능해진 것이다.

## K2 컴파일러가 가져온 그 외의 개선들

K2 컴파일러는 SAM 변환 외에도 다양한 타입 추론 개선을 포함하고 있다. 대표적인 것들을 간략히 살펴보자.

### 스마트 캐스트 개선

``` kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // Kotlin 2.0+: isCat 변수를 통해 animal이 Cat으로 스마트 캐스트됨
        // Kotlin 1.x: 스마트 캐스트 불가 — 변수에 담긴 조건식은 인식하지 못했음
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // 출력: Purr purr
}
```

### 논리 OR 연산자와 스마트 캐스트

``` kotlin
interface Status {
    fun signal() {
        println("Signal received")
    }
}

interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // Kotlin 2.0+: 공통 상위 타입인 Status로 스마트 캐스트
        // Kotlin 1.x: Any로 캐스트되어 signal() 호출 불가
        signalStatus.signal()
    }
}

fun main() {
    val status = object : Postponed {}
    signalCheck(status)
    // 출력: Signal received
}
```

### 인라인 함수 내에서의 스마트 캐스트

``` kotlin
interface Processor {
    fun process() {
        println("Processing...")
    }
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = object : Processor {}

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        if (processor != null) {
            // Kotlin 2.0+: processor가 non-null로 스마트 캐스트
            // Kotlin 1.x: safe call 필요 (processor?.process())
            processor.process()
        }
        processor = nextProcessor()
    }
    return processor
}

fun main() {
    val result = runProcessor()
    println("Result: $result")
}
```

## 마무리

정리하면, Kotlin 1.x에서 Java 함수형 인터페이스 타입 변수에 람다를 직접 대입하지 못했던 것은 구 컴파일러의 타입 추론 한계 때문이었다. Kotlin 2.0에서 도입된 K2 컴파일러는 프론트엔드를 완전히 재작성하면서 기대 타입 기반의 SAM 변환을 더 넓은 범위에서 지원하게 됐고, 그 결과 이전에 불가능했던 코드가 자연스럽게 동작하게 됐다. 이처럼 K2 컴파일러는 단순한 성능 개선뿐만 아니라, 개발자가 "당연히 될 것 같은데 안 됐던" 코드들을 실제로 동작하게 만들어 주는 의미 있는 변화를 가져왔다. Kotlin 2.0 이상을 사용하고 있다면, 이런 개선된 타입 추론의 혜택을 누려보자.

> 참고자로
> - https://kotlinlang.org/docs/k2-compiler-migration-guide.html
> - https://kotlinlang.org/docs/whatsnew20.html
> - https://kotlinlang.org/docs/fun-interfaces.html
> - https://kotlinlang.org/docs/compatibility-guide-20.html. 