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

# Kotlin 1.x에서 안 되던 코드가 2.0에서 된다? — K2 컴파일러가 바꿔놓은 Java SAM 변환의 모든 것

## 들어가며

최근 Kotlin 버전을 1.8에서 2.3으로 올리고 코드를 작성하던 중, 흥미로운 현상을 발견했다.

```kotlin
package me.sungbin.function

fun main() {
    val filter: StringFilter = { s -> s.startsWith("A") }
}
```

`StringFilter`는 Java에서 정의한 함수형 인터페이스다. 그런데 이 코드가 **Kotlin 1.8에서는 컴파일 에러**가 나고, **Kotlin 2.3에서는 정상 동작**한다. 분명 Java SAM 인터페이스에 람다를 직접 대입하는 건 안 되는 걸로 알고 있었는데, 왜 지금은 되는 걸까?

이 글에서는 이 동작 변화의 원인을 파헤쳐 보고, Kotlin의 SAM 변환이 어떻게 발전해 왔는지를 정리해 본다.

---

## SAM 변환이란?

SAM은 **Single Abstract Method**의 약자로, 추상 메서드가 하나만 있는 인터페이스를 말한다. Java 8에서는 이런 인터페이스를 **함수형 인터페이스(Functional Interface)** 라고 부르며, `@FunctionalInterface` 어노테이션을 붙여 명시한다.

```java
@FunctionalInterface
public interface StringFilter {
    boolean filter(String s);
}
```

Java에서는 이런 함수형 인터페이스 타입이 기대되는 곳에 람다를 직접 전달할 수 있다. 이걸 **SAM 변환(SAM Conversion)** 이라고 한다.

```java
// Java — 람다를 함수형 인터페이스 타입 변수에 직접 대입
StringFilter filter = s -> s.startsWith("A");
```

Kotlin도 Java와의 상호운용성을 위해 SAM 변환을 지원한다. 하지만 그 지원 범위는 Kotlin 버전에 따라 달랐다.

---

## Kotlin에서의 SAM 변환 역사

### Kotlin 1.0 — Java SAM에 대한 기본 지원

Kotlin은 1.0부터 Java의 함수형 인터페이스에 대한 SAM 변환을 지원했다. 다만 지원되는 위치가 제한적이었다.

**함수 인자로 전달할 때**는 SAM 변환이 적용됐다.

```kotlin
// Java 메서드: void applyFilter(StringFilter filter) { ... }

// ✅ 함수 파라미터로 전달 — SAM 변환 적용
applyFilter { s -> s.startsWith("A") }
```

**SAM 생성자(SAM Constructor)** 를 명시적으로 사용하는 것도 가능했다.

```kotlin
// ✅ SAM 생성자 — 항상 가능
val filter = StringFilter { s -> s.startsWith("A") }
```

하지만 **변수 타입을 명시하고 람다를 직접 대입하는 것**은 불가능했다.

```kotlin
// ❌ Kotlin 1.x에서 컴파일 에러!
val filter: StringFilter = { s -> s.startsWith("A") }
// Type mismatch: inferred type is (String) -> Boolean but StringFilter was expected
```

### Kotlin 1.4 — Kotlin 인터페이스에 대한 SAM 변환 (`fun interface`)

Kotlin 1.4에서는 `fun interface` 키워드가 도입되면서, **Kotlin에서 정의한 인터페이스**에도 SAM 변환을 사용할 수 있게 됐다.

```kotlin
// Kotlin 1.4 이전에는 이게 안 됐음
interface MyFilter {
    fun filter(s: String): Boolean
}
val f = MyFilter { s -> s.startsWith("A") } // ❌ 컴파일 에러

// Kotlin 1.4부터 fun interface로 선언하면 SAM 변환 가능
fun interface MyFilter {
    fun filter(s: String): Boolean
}
val f = MyFilter { s -> s.startsWith("A") } // ✅ OK
```

이 시점에서 많은 개발자들이 "Kotlin에서 SAM 변환이 안 된다"고 알고 있던 것은, 바로 이 **Kotlin 인터페이스에 대한 SAM 변환**이 안 됐던 것을 기억하는 경우가 많다.

하지만 `fun interface` 도입 이후에도, **타입을 명시한 변수에 람다를 직접 대입하는 것**(`val f: Type = { ... }`)은 Java SAM, Kotlin `fun interface` 모두에서 불가능했다. 1.4에서 가능해진 것은 SAM 생성자(`val f = MyFilter { ... }`)와 함수 인자 전달 위치에서의 SAM 변환이었다.

### Kotlin 2.0 — K2 컴파일러와 SAM 변환의 확장

그리고 마침내 **Kotlin 2.0**에서 K2 컴파일러가 정식 도입되면서, 이 제한이 해제됐다.

```kotlin
// ✅ Kotlin 2.0+ (K2 컴파일러)에서는 이것도 된다!
val filter: StringFilter = { s -> s.startsWith("A") }
```

---

## 구 컴파일러는 왜 이걸 허용하지 않았을까?

이유를 이해하려면, 구 컴파일러의 타입 추론 방식을 알아야 한다.

### 구 컴파일러의 타입 추론 흐름

구 컴파일러가 `val filter: StringFilter = { s -> s.startsWith("A") }`를 만났을 때, 내부적으로 다음과 같은 순서로 처리했다.

1. **우변의 람다 타입 결정**: `{ s -> s.startsWith("A") }`는 `(String) -> Boolean` 함수 타입으로 추론된다.
2. **좌변의 기대 타입 확인**: `StringFilter`는 Java 인터페이스 타입이다.
3. **타입 호환성 검사**: `(String) -> Boolean` ≠ `StringFilter` → **Type mismatch!**

구 컴파일러는 SAM 변환을 **특정 위치에서만** 적용했다.

- 함수 호출 시 인자로 전달하는 위치 ✅
- SAM 생성자를 명시적으로 사용하는 경우 ✅
- 변수 대입 위치 ❌

이는 구 컴파일러의 프론트엔드 아키텍처가 `BindingContext`라는 거대한 해시 테이블 기반 구조에 의존했기 때문이다. 타입 정보를 단계별로 수집하고 저장하는 이 방식에서는, 대입문의 기대 타입 정보를 람다의 타입 추론 단계에 자연스럽게 전달하기가 구조적으로 어려웠다.

### SAM 생성자로 우회하는 방법

그래서 구 컴파일러에서는 SAM 생성자를 사용해 명시적으로 변환을 지시해야 했다.

```kotlin
// SAM 생성자 — 컴파일러에게 "이 람다를 StringFilter로 변환해라"고 명시적으로 알려줌
val filter = StringFilter { s -> s.startsWith("A") }
```

SAM 생성자는 컴파일러가 자동으로 생성하는 팩토리 함수처럼 동작하며, 람다를 해당 인터페이스의 구현체로 명시적으로 감싸준다.

---

## K2 컴파일러는 무엇이 다른가?

### 완전히 새로 작성된 프론트엔드

K2 컴파일러는 Kotlin 컴파일러의 **프론트엔드(의미 분석, 호출 해석, 타입 추론 담당)** 를 완전히 새로 작성한 것이다. 공식 문서에서는 이를 다음과 같이 설명한다.

> With the arrival of the K2 compiler, the Kotlin frontend has been completely rewritten and features a new, more efficient architecture. The fundamental change the new compiler brings is the use of one unified data structure that contains more semantic information.
>
> — [K2 compiler migration guide](https://kotlinlang.org/docs/k2-compiler-migration-guide.html)

### 구 컴파일러 vs K2 컴파일러의 내부 구조 차이

**구 컴파일러**는 **PSI(Program Structure Interface)** 와 **BindingContext**에 의존했다.

- PSI는 소스 파일의 모든 정보를 담고 있어 크고 복잡하다.
- BindingContext는 바인딩 정보를 거대한 해시 맵 구조로 관리했다.
- 변수 참조 하나를 조회하는 데도 여러 번의 맵 조회가 필요했다.

**K2 컴파일러**는 **FIR(Frontend Intermediate Representation)** 이라는 새로운 트리 기반 데이터 구조를 사용한다.

- FIR은 PSI보다 간결하면서도 더 많은 의미 정보를 포함한다.
- 트리 노드에서 직접 값을 접근하므로 해시 맵 조회가 필요 없다.
- 타입 추론 시 기대 타입 정보가 자연스럽게 하위 노드로 전파된다.

### K2에서의 타입 추론 흐름

K2 컴파일러가 동일한 코드를 처리할 때는 이렇게 동작한다.

1. **좌변의 기대 타입 확인**: `StringFilter`가 기대된다.
2. **기대 타입 정보를 우변으로 전파**: 람다에게 "네가 `StringFilter`가 되어야 한다"는 정보를 전달한다.
3. **SAM 변환 가능 여부 확인**: `StringFilter`는 Java 함수형 인터페이스이고, 람다의 시그니처가 `filter(String): Boolean`과 일치한다.
4. **암시적 SAM 변환 적용**: 람다를 `StringFilter` 구현체로 자동 변환한다. ✅

핵심 차이는 K2 컴파일러가 **기대 타입(Expected Type) 정보를 적극적으로 활용**한다는 것이다. 구 컴파일러에서는 대입문의 기대 타입 정보가 SAM 변환 판단에 반영되지 않았지만, K2에서는 **기대 타입이 SAM 인터페이스인 모든 위치**에서 암시적 SAM 변환이 가능해졌다.

---

## 실제 코드로 보는 동작 차이

다양한 케이스에서 Kotlin 1.x와 2.0+의 동작 차이를 정리해 보자.

### Case 1: 변수 대입

```kotlin
// Java
@FunctionalInterface
public interface StringFilter {
    boolean filter(String s);
}
```

```kotlin
// Kotlin
val filter: StringFilter = { s -> s.startsWith("A") }
```

| Kotlin 1.x | Kotlin 2.0+ |
|---|---|
| ❌ Type mismatch | ✅ 정상 컴파일 |

### Case 2: SAM 생성자 (명시적)

```kotlin
val filter = StringFilter { s -> s.startsWith("A") }
```

| Kotlin 1.x | Kotlin 2.0+ |
|---|---|
| ✅ 정상 | ✅ 정상 |

### Case 3: 함수 인자로 전달

```kotlin
fun applyFilter(filter: StringFilter) { /* ... */ }

applyFilter { s -> s.startsWith("A") }
```

| Kotlin 1.x | Kotlin 2.0+ |
|---|---|
| ✅ 정상 | ✅ 정상 |

### Case 4: 함수 반환 타입으로 사용

```kotlin
fun createFilter(): StringFilter {
    return { s -> s.startsWith("A") }
}
```

| Kotlin 1.x | Kotlin 2.0+ |
|---|---|
| ❌ Type mismatch | ✅ 정상 컴파일 |

### Case 5: 컬렉션 내에서 사용

```kotlin
// ❌ Kotlin 2.0+에서도 컴파일 에러!
val filters: List<StringFilter> = listOf(
    { s -> s.startsWith("A") },
    { s -> s.length > 5 }
)
```

| Kotlin 1.x | Kotlin 2.0+ |
|---|---|
| ❌ Type mismatch | ❌ Type mismatch |

K2에서 이 코드를 컴파일하면 다음과 같은 에러가 발생한다.

```
Argument type mismatch: actual type is
'Function1<ERROR CLASS: Unknown return lambda parameter type,
ERROR CLASS: Unknown return lambda parameter type>',
but 'StringFilter' was expected.
```

`ERROR CLASS: Unknown return lambda parameter type`이라는 메시지가 핵심이다. 변수의 기대 타입이 `List<StringFilter>`이더라도, 그 타입 정보가 `listOf`의 제네릭 타입 파라미터 `T`를 거쳐 개별 람다 인자까지 전파되지 않는다. 컴파일러 입장에서는 람다의 파라미터 타입조차 알 수 없는 상태이므로, SAM 변환 이전에 람다 자체의 타입 추론부터 실패하는 것이다.

이 경우에는 SAM 생성자를 명시적으로 사용해야 한다.

```kotlin
// ✅ SAM 생성자를 명시적으로 사용
val filters: List<StringFilter> = listOf(
    StringFilter { s -> s.startsWith("A") },
    StringFilter { s -> s.length > 5 }
)
```

Case 4에서 볼 수 있듯이, K2 컴파일러는 변수 대입이나 함수 반환 등 **기대 타입이 직접적으로 전달되는 위치**에서 SAM 변환을 적용한다. 하지만 제네릭 함수의 타입 파라미터를 거쳐야 하는 간접적인 위치에서는 여전히 명시적인 SAM 생성자가 필요하다.

---

## Java SAM vs Kotlin `fun interface` — 헷갈리기 쉬운 포인트

SAM 변환과 관련해서 Java SAM 인터페이스와 Kotlin `fun interface`를 혼동하는 경우가 많다. 이 둘의 SAM 변환 지원 역사를 정리하면 다음과 같다.

| | Java 함수형 인터페이스 | Kotlin `fun interface` |
|---|---|---|
| **함수 인자 전달** | Kotlin 1.0+ ✅ | Kotlin 1.4+ ✅ |
| **SAM 생성자** | Kotlin 1.0+ ✅ | Kotlin 1.4+ ✅ |
| **변수 대입 (`val f: Type = { ... }`)** | Kotlin 2.0+ ✅ (K2) | Kotlin 2.0+ ✅ (K2) |

흥미로운 점은, Java 함수형 인터페이스뿐만 아니라 **Kotlin `fun interface`에서도 변수 대입(`val f: Type = { ... }`) 방식은 1.x에서 동작하지 않았다**는 것이다. 1.4에서 `fun interface`가 도입됐을 때 지원된 것은 SAM 생성자(`val f = MyFilter { ... }`)와 함수 인자 전달이었고, 타입을 명시한 변수에 람다를 직접 대입하는 방식은 K2 컴파일러에서야 가능해졌다. 결국 K2의 기대 타입 기반 SAM 변환 확장은 Java SAM과 Kotlin `fun interface` 모두에 적용된 범용적인 개선인 셈이다.

---

## K2 컴파일러가 가져온 그 외의 개선들

K2 컴파일러는 SAM 변환 외에도 다양한 타입 추론 개선을 포함하고 있다. 대표적인 것들을 간략히 살펴보자.

### 스마트 캐스트 개선 — 조건을 변수에 담아도 스마트 캐스트

```kotlin
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

Kotlin 1.x에서는 `animal is Cat`을 `if` 조건에 직접 작성해야만 스마트 캐스트가 동작했다. 조건을 변수에 담으면 컴파일러가 그 의미를 추적하지 못했기 때문이다. K2에서는 로컬 변수에 담긴 타입 검사 결과도 추적하여 스마트 캐스트에 반영한다.

### 논리 OR 연산자와 스마트 캐스트 — 공통 상위 타입으로 캐스트

```kotlin
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

Kotlin 1.x에서는 `||`로 타입 검사를 조합하면 `Any`로 캐스트됐기 때문에, `signal()` 메서드를 호출하려면 추가 타입 체크가 필요했다. K2에서는 `Postponed`와 `Declined`의 공통 상위 타입인 `Status`로 자동 캐스트된다.

### 인라인 함수 내에서의 스마트 캐스트

```kotlin
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

Kotlin 1.x에서는 인라인 함수에 전달된 람다 내부에서 외부 `var` 변수의 null 검사가 스마트 캐스트에 반영되지 않았다. 람다가 나중에 호출될 수 있다는 가능성 때문이었는데, K2에서는 인라인 함수의 람다가 제자리에서 호출(callsInPlace)된다는 점을 인식하여 안전하게 스마트 캐스트를 적용한다.

---

이런 개선들은 모두 K2 컴파일러의 새로운 FIR 기반 아키텍처에서 기대 타입과 타입 상태 정보가 더 넓은 범위로 전파되기 때문에 가능해진 것이다.

---

## 실무에서의 영향과 마이그레이션 팁

### 기존 코드는 그대로 동작한다

K2 컴파일러로 업그레이드해도, 기존에 SAM 생성자를 사용하던 코드는 그대로 동작한다. 호환성 걱정 없이 업그레이드할 수 있다.

```kotlin
// 이전 방식 — K2에서도 정상 동작
val filter = StringFilter { s -> s.startsWith("A") }
```

### 새 코드는 더 간결하게 작성 가능

K2 환경에서는 기대 타입이 명확한 상황에서 SAM 생성자 없이 람다를 직접 대입할 수 있어, 코드가 더 간결해진다.

```kotlin
// K2에서 가능한 새로운 방식
val filter: StringFilter = { s -> s.startsWith("A") }
```

### 하위 호환성을 고려한다면

만약 라이브러리를 작성하거나, Kotlin 1.x 환경도 지원해야 한다면 SAM 생성자를 명시적으로 사용하는 것이 안전하다.

```kotlin
// 하위 호환성이 필요한 경우 — SAM 생성자 사용
val filter = StringFilter { s -> s.startsWith("A") }
```

---

## 마무리

정리하면, Kotlin 1.x에서 Java 함수형 인터페이스 타입 변수에 람다를 직접 대입하지 못했던 것은 **구 컴파일러의 타입 추론 한계** 때문이었다. Kotlin 2.0에서 도입된 **K2 컴파일러**는 프론트엔드를 완전히 재작성하면서 기대 타입 기반의 SAM 변환을 더 넓은 범위에서 지원하게 됐고, 그 결과 이전에 불가능했던 코드가 자연스럽게 동작하게 됐다.

이처럼 K2 컴파일러는 단순한 성능 개선뿐만 아니라, 개발자가 "당연히 될 것 같은데 안 됐던" 코드들을 실제로 동작하게 만들어 주는 의미 있는 변화를 가져왔다. Kotlin 2.0 이상을 사용하고 있다면, 이런 개선된 타입 추론의 혜택을 누려보자.

---

## 참고 자료

- [K2 compiler migration guide — Kotlin 공식 문서](https://kotlinlang.org/docs/k2-compiler-migration-guide.html)
- [What's new in Kotlin 2.0.0 — Kotlin 공식 문서](https://kotlinlang.org/docs/whatsnew20.html)
- [Functional (SAM) interfaces — Kotlin 공식 문서](https://kotlinlang.org/docs/fun-interfaces.html)
- [Compatibility guide for Kotlin 2.0 — Kotlin 공식 문서](https://kotlinlang.org/docs/compatibility-guide-20.html)