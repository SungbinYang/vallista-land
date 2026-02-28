---
title: "[코루틴] 코루틴의 구성 요소와 원리"
tags:
  - kotlin
image: ./assets/banner.png
date: 2026-02-28 14:04:27
series: 코루틴
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [2시간으로 끝내는 코루틴](https://inf.run/Rm45L) 강의를 참조하여 작성한 글입니다.

## Structured Concurrency

코루틴이 나타내는 Job의 life cycle에 대해 살펴보자. 코루틴이 생성되면 `NEW`상태가 되었다가 활성화되면 `ACTIVE`상태가 된다. 그러다가 예외가 되면 `CANCELING` 상태가 되었다가 `CANCELED` 상태로 돌아가며 만약 성공한다면 `COMPLETING` 상태가 되었다가 `COMPLETED`로 간다. 이때 주어진 작업이 완료된 코루틴은 `COMPLETED` 상태가 되는 것이 아니라 `COMPLETING` 상태로 처리되었다. 작업이 완료된 경우 `COMPLETED`가 되는 것이 아니라 왜 한 단계를 거쳐갈까?

그 이유는 자식 코루틴이 있을 경우, 자식 코루틴들이 모두 완료될 때까지 기다릴 수 있고, 자식 코루틴들 중 하나에서 예외가 발생하면 다른 자식 코루틴들에게도 취소 요청을 보내기 때문이다. 아래의 코드를 살펴보자.

``` kotlin
package me.sungbin.coroutine

import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

fun main(): Unit = runBlocking {
    launch {
        delay(600L)
        printWithThread("A")
    }

    launch {
        delay(500L)
        throw IllegalArgumentException("코루틴 실패!")
    }
}
```

이 코드에서는 첫 번째 코루틴이 A를 출력하고 있고, 두 번째 코루틴이 예외를 던지고 있다. 두 코루틴은 독립적이기 때문에 예외도 발생하고 A도 출력될 것 같지만, 실제로는 예외만 발생되는 것을 확인할 수 있다. 그 이유는, 두 번째 코루틴에서 발생한 예외가 `runBlocking`에 의해 만들어진 부모 코루틴에게 취소 신호를 보내게 되고, 이 취소 신호를 받은 부모 코루틴이 다른 자식 코루틴인 첫 번째 코루틴까지 취소시키기 때문이다. 이렇게 부모 - 자식 관계의 코루틴이 한 몸 처럼 움직이는 것을 “Structured Concurrency”라고 부른다.

코틀린 공식 문서에서는 Structured Concurrency에 대해 다음과 같이 이야기하고 있다.

- Structured Concurrency는 수많은 코루틴이 유실되거나 누수되지 않도록 보장한다.
- Structured Concurrency는 코드 내의 에러가 유실되지 않고 적절히 보고될 수 있도록 보장한다.

그럼 내용을 정리해보자.

- 자식 코루틴에서 예외가 발생할 경우, Structured Concurrency에 의해 부모 코루틴이 취소되고, 부모 코루틴의 다른 자식 코루틴들도 취소된다.
- 자식 코루틴에서 예외가 발생하지 않더라도 부모 코루틴이 취소되면, 자식 코루틴들이 취소된다.
- 다만 `CancellationException`의 경우 정상적인 취소로 간주하기 때문에 부모 코루틴에게 전파되지 않고, 부모 코루틴의 다른 자식 코루틴을 취소시키지도 않는다.

## CoroutineScope과 CoroutineContext

이번에는 `CoroutineScope`과 `CoroutineContext`에 대해 알아보자. 사실 `CoroutineScope`은 사용해본 경험이 존재한다. 바로 root 코루틴을 만들기 위해서, 새로운 영역을 만든 후 `launch`를 이용해 코루틴을 만들었던 것이다.

``` kotlin
suspend fun lec0701() {
    val job = CoroutineScope(Dispatchers.Default).launch {
        delay(1_000L)
        printWithThread("Job 1")
    }

    job.join()
}
```

그렇다면, 이 `CoroutineScope`은 도대체 무엇일까? 사실 우리가 사용했던 `launch` 혹은 `async`와 같은 코루틴 빌더는 `CoroutineScope`의 확장함수이다. 즉, `launch`와 `async`를 사용하려면 `CoroutineScope`이 필요했던 것이다. 때문에 지금까지 사실은 `runBlocking`이 코루틴과 루틴의 세계를 이어주며, `CoroutineScope`를 제공해주었고, `runBlocking` 안에서 `launch`와 `async`를 사용했었다. 만약 우리가 직접 `CoroutineScope`을 만든다면 `runBlocking`이 굳이 필요하지 않다. main 함수를 일반 함수로 만들어 코루틴이 끝날 때까지 main 스레드를 대기시킬 수도 있고, main 함수 자체를 `suspend` 함수로 만들어 `join()` 시킬 수도 있다.

이 `CoroutineScope`의 주요 역할은 `CoroutineContext`라는 데이터를 보관하는 것이다. 실제 `CoroutineScope` 인터페이스 역시 매우 단순하다. `CoroutineContext`는 코루틴과 관련된 여러가지 데이터를 갖고 있다. 예를 들어 이 Context 안에는 현재 코루틴의 이름도 들어 있고, 우리가 살펴보았던 `CoroutineExceptionHandler`가 있을 수도 있으며, 코루틴의 Job 자체도 들어 있고, 우리가 `CoroutineScope`을 만들 때 넣어주었던 `CoroutineDispatcher`도 들어 있다. Dispatcher는 코루틴이 어떤 스레드에 배정될지를 관리하는 역할을 맡는다.

지금까지 내용을 정리해보면, `CoroutineScope`은 코루틴이 탄생할 수 있는 영역이고, `CoroutineScope` 안에는 `CoroutineContext`라는 코루틴과 관련된 데이터가 들어 있다. 우리가 부모 코루틴과 자식 코루틴이라고 불렀던 것도 한 영역 안에서 코루틴이 생기는것을 의미하는데 한번 자세히 살펴보자.

최초 한 영역에 부모 코루틴이 있다고 하자. 이때 `CoroutineContext`에는 이름, `Dispatchers.Default`, 부모 코루틴이 들어 있다. 이 상황에서 부모 코루틴에서 자식 코루틴을 만든다. 그럼 자식 코루틴은 부모 코루틴과 같은 영역에서 생성되고, 생성될 때 이 영역의 context를 가져온 다음 필요한 정보를 덮어 써 새로운 context를 만든다. 예를 들어 이름을 우리가 직접 지정해주었다고 하자. 그럼 자식 코루틴은 우리가 지정해준 이름을 이용해 필요한 데이터를 context에서 가져와 적절히 덮어 쓰고 새로운 context를 갖게 된다. 이 과정에서 부모 - 자식 간의 관계도 설정해준다. 이 원리가 바로 Structured Concurrency를 작동시킬 수 있는 기반이 된다.

그리고 이렇게 한 영역에 있는 코루틴들은 영역 자체를 `cancel()` 시킴으로써 모든 코루틴을 종료시킬 수 있다. 예를 들어 다음 코드처럼 클래스 내부에서 독립적인 `CoroutineScope`을 관리한다면, 해당 클래스에서 사용하던 코루틴을 한 번에 종료시킬 수 있게 된다. 아래의 코드를 보면 이해가 될 것이다.

``` kotlin
package me.sungbin.coroutine

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

class AsyncLogic {
    private val scope = CoroutineScope(Dispatchers.Default)

    fun doSomething() {
        scope.launch {
            // 무언가 코루틴이 시작되어 작업
        }
    }

    fun destroy() {
        scope.cancel()
    }
}
```

이제 `CoroutineContext`에 대해 조금 더 자세히 살펴보자. `CoroutineContext`는 `Map`과 `Set`을 섞어 둔 자료구조와 같다. `CoroutineContext`에 저장되는 데이터는 `key - value`로 이루어져 있고, `Set`과 비슷하게 동일한 `Key`를 가진 데이터는 하나만 존재할 수 있다. 이 key - value 하나하나를 Element라 부르고, + 기호를 이용해 각 Element를 합치거나 context에 Element를 추가할 수 있다.

``` kotlin
// + 기호를 이용한 Element 합성
CoroutineName("나만의 코루틴") + SupervisorJob()

// context에 Element를 추가
coroutineContext + CoroutineName("나만의 코루틴")
```

만약 context에서 Element를 제거하고 싶다면, `minusKey` 함수를 이용해 제거할 수 있다.

``` kotlin
coroutineContext.minusKey(CoroutineName.Key)
```

마지막으로 context에 들어갈 수 있는 `Dispatcher`에 대해 조금 더 자세히 살펴보자. 코루틴이 스레드에 배정되어 실행된다고 살펴보았다. 또한 코루틴은 중단되었다가 다른 스레드에 배정될 수도 있는데, 이렇게 코루틴을 스레드에 배정하는 역할을 `Dispatcher`가 수행한다. Dispatcher의 대표적인 종류는 다음과 같다.

- Dispatchers.Default
    - 가장 기본적인 디스패쳐. CPU 자원을 많이 쓸 때 권장되며 별 다른 설정이 없다면 `Dispatchers.Default`가 사용된다.
- Dispatchers.IO
    - I/O 작업에 최적화된 디스패처.
- Dispatchers.Main
    - 보통 UI 컴포넌트를 조작하기 위한 디스패처. 특정 의존성을 가지고 있어야 정상적으로 활용할 수 있다.
- Java의 스레드풀인 ExecutorService를 디스패처로 변환
    - `asCoroutineDispatcher()`이라는 확장함수를 이용해 `ExecutorService`를 디스패처로 전환할 수 있다.

## suspending function

이번에는 suspending function과 scoping function에 대해 알아보자.

먼저, suspending function이란 우리가 지금까지 사용해왔던 것으로 suspend 지시어가 붙은 함수를 의미한다. 이렇게 들으면 굉장히 간단한데 suspend 지시어가 붙으면 무엇이 달라지는 것일까? 바로 suspend 함수를 부를 수 있는 능력이 생긴다. 그런데 가만히 생각해보면 우리는 main함수에서 suspend 함수를 불러도 큰 문제가 안 생겼다.

``` kotlin
fun main(): Unit = runBlocking {
    launch {
        delay(100L)
    }
}
```

이 코드는 어떻게 가능한 것일까? 사실 우리가 사용한 runBlocking 코루틴 빌더나 launch 코루틴 빌더에서 다른 함수를 받을 때, 이 함수는 suspend 함수로 간주된다. 실제 launch의 시그니처에서도 suspend 함수를 받고 있다. 이렇게 함수 타입에 suspend를 붙인 것을 가리켜 `suspending lambda`라고 부른다.

``` kotlin
// launch의 시그니처, suspend 함수를 받고 있다.
public fun CoroutineScope.launch(
    context: CoroutineContext = EmptyCoroutineContext,
    start: CoroutineStart = CoroutineStart.DEFAULT,
    block: suspend CoroutineScope.() -> Unit
): Job
```

suspend 함수에서 또 다른 suspend 함수를 호출할 수 있다는 것을 알았다. 그 외에 또 다른 의미는 없을까? “suspend”라는 단어의 뜻을 사전에서 찾아보면, 정지 / 중지 / 유예와 같은 의미가 나온다. 실제 코루틴에서 사용하는 suspend 함수 역시 코루틴이 중지 되었다가 재개될 수 있는 지점이 된다. 이를 가리켜 `suspension point`라고 부른다. 여기서 핵심은 **될 수 있는** 이다. suspend 함수를 호출한다고 해서 무조건 중지되는 것이 아니다. 중지가 될 수도 있고, 중지가 되지 않을 수도 있다는 의미이다.

``` kotlin
fun lec0801(): Unit = runBlocking {
    launch {
        a()
        b()
    }

    launch {
        c()
    }
}

suspend fun a() {
    printWithThread("A")
}

suspend fun b() {
    printWithThread("B")
}

suspend fun c() {
    printWithThread("C")
}
```

첫 번째 코루틴에서는 suspend 함수인 `a()`와 `b()`를 각각 호출하고 있어서, `a()`가 호출된 다음 중지되어 두 번째 코루틴이 실행될 것 같지만, 사실은 suspend 함수를 호출하더라도 반드시 중지되는 것은 아니기에 A와 B가 먼저 출력되고 나중에 C가 출력되게 된다.

그렇다면 이런 suspend 함수는 어떻게 활용할 수 있을까? 연쇄적인 API를 호출해야 하는 상황이라고 생각해보자. 첫 번째 API 호출에서 나온 결과를 두 번째 API 호출 때 사용해야 한다. 그렇다면, 우리는 다음과 같이 코드를 작성할 수 있을 것이다. 원래 `Thread.sleep()`은 non blocking 상황에서 스레드 자체를 막을 수 있어 사용하면 안되지만, 1초간의 대기를 가정하기 위해 작성했다.

``` kotlin
fun lec0802(): Unit = runBlocking {
    val result1 = async {
        call1()
    }
    val result2 = async {
        call2(result1.await())
    }

    printWithThread(result2.await())
}

fun call1(): Int {
    Thread.sleep(1_000L)
    return 100
}
fun call2(num: Int): Int {
    Thread.sleep(1_000L)
    return num * 2
}
```

우리는 `async`와 `Deferred`를 활용해 콜백을 활용하지 않고 코드를 작성했다. 하지만, `runBlocking` 입장에서 result1과 result2의 타입이 `Deferred`이기에 `Deffered`에 의존적인 코드가 되는 것은 아쉽다. `Deferred` 대신에 `CompletableFuture` 또는 `Reactor`와 같은 다른 비동기 라이브러리 코드로 갈아 끼워야 할 수도 있다. 이럴 때 우리는 suspend 함수를 활용할 수 있다.

``` kotlin
fun lec0802(): Unit = runBlocking {
    val result1 = call1()
    val result2 = call2(result1)

    printWithThread(result2)
}

suspend fun call1(): Int {
    return CoroutineScope(Dispatchers.Default).async {
        Thread.sleep(1_000L)
        100
    }.await()
}

suspend fun call2(num: Int): Int {
    return CompletableFuture.supplyAsync {
        Thread.sleep(1_000L)
        num * 2
    }.await()
}
```

call1함수와 call2함수를 `suspend fun`으로 변경해 이 안에서 어떤 비동기 구현체 라이브러리를 사용하던지 해당 함수의 선택으로 남겨둔 것이다. `CompletabueFuture`에 사용한 `await()` 함수 역시 코루틴에서 만들어 둔 suspend 함수이다. 코루틴에는 다양한 비동기 라이브러리와 변환 코드를 제공한다.

그렇다면 코루틴 라이브러리에서 제공하는 suspend 함수를 몇 가지 살펴보자. 첫 번째 함수는 `coroutineScope`이다. 이 함수도 `launch`나 `async`처럼 새로운 코루틴을 만들지만, 주어진 함수 블록이 바로 실행되는 특징을 갖고 있다. 또한, 새로 생긴 코루틴과 자식 코루틴들이 모두 완료된 이후, 반환된다. coroutineScope으로 만든 코루틴은 이전 코루틴의 자식 코루틴이 된다.

``` kotlin
suspend fun calculateResult(): Int = coroutineScope {
    val num1 = async {
        delay(1_000L)
        10
    }

    val num2 = async {
        delay(1_000L)
        20
    }

    num1.await() + num2.await()
}
```

다음으로 살펴볼 함수는 `withContext`이다. `withContext` 역시 주어진 코드 블록이 즉시 호출되며 새로운 코루틴이 만들어지고, 이 코루틴이 완전히 종료되어야 반환된다. 즉 기본적으로는 `coroutineScope`과 같다. 하지만 `withContext`를 사용할 때 context에 변화를 줄 수 있어 다음과 같이 Dispatcher를 바꿔 사용할 때 활용해볼 수 있다.

``` kotlin
suspend fun calculateResult(): Int = withContext(Dispatchers.Default) {
    val num1 = async {
        delay(1_000L)
        10
    }

    val num2 = async {
        delay(1_000L)
        20
    }

    num1.await() + num2.await()
}
```

마지막으로 `withTimeout`과 `withTimeoutOrNull`이 있다. 이 함수들 역시 coroutineScope과 유사하지만 주어진 함수 블록이 시간 내에 완료되어야 한다는 차이점이 있다. 주어진 시간 안에 코루틴이 완료되지 않으면 `withTimeout`은 `TimeoutCancellationException`을 던지게 되고, `withTimeoutOrNull`은 `null`을 반환하게 된다.

``` kotlin
fun main() = runBlocking {
    val result: Int? = withTimeoutOrNull(1_000L) {
        delay(1_500L)
        10 + 20
    }

    printWithThread(result)
}
```

## 코루틴과 Continuation

이번에는 코루틴이 어떤 원리로 동작하고 있는지 구체적으로 알아보자. 코루틴의 동작 원리를 알아보기 위한 예제를 준비했다.

``` kotlin
class UserService {
    private val userProfileRepository = UserProfileRepository()
    private val userImageRepository = UserImageRepository()

    suspend fun findUser(userId: Long): UserDto {
        println("유저를 가져오겠습니다")
        val profile = userProfileRepository.findProfile(userId)

        println("이미지를 가져오겠습니다")
        val image = userImageRepository.findImage(profile)

        return UserDto(profile, image)
    }
}

data class UserDto(
    val profile: Profile,
    val image: Image,
)

class UserProfileRepository {
    suspend fun findProfile(userId: Long): Profile {
        delay(100L)
        return Profile()
    }
}

class Profile

class UserImageRepository {
    suspend fun findImage(profile: Profile): Image {
        delay(100L)
        return Image()
    }
}

class Image
```

우리는 중단함수인 `findUser`가 어떻게 구현되는지 알아볼 것이다. 가장 먼저 findUser에서 중단 될 수 있는 지점을 확인해보자. suspend 함수의 의미는 “중단이 될 수 있다”는 의미이기에, suspend 함수를 호출하는 두 곳이 우리의 중단될 수 있는 지점이 된다. 이 지점을 경계로 메소드를 나누면 총 3단계로 나누어진다.

``` kotlin
suspend fun findUser(userId: Long): UserDto {
    // 0단계 - 초기 시작
    println("프로필을 가져오겠습니다")
    val profile = userProfileRepository.findProfile(userId)
    
    // 1단계 - 1차 중단 후 재시작
    println("이미지를 가져오겠습니다")
    val image = userImageRepository.findImage(profile)
    
    // 2단계 - 2차 중단 후 재시작
    return UserDto(profile, image)
}
```

이제 우리는 이 각 단계를 라벨로 표시할 것이다. 라벨을 표시하기 위해, 라벨 정보를 갖고있는 객체를 하나 만들어야 한다. 이 객체는 우선 인터페이스로 만들고, findUser 메소드 안에서 익명 클래스로 라벨을 갖고 있게 처리하겠다. 그럼 다음과 같은 코드로 변경된다.

``` kotlin
interface Continuation {
}
```

``` kotlin
suspend fun findUser(userId: Long): UserDto {
    // state machine의 약자, 라벨을 기준으로 상태를 관리
    val sm = object : Continuation {
        var label = 0 // 익명 클래스를 만들어 라벨을 갖게 만든다. 하므로 sm이라 이름 지었다.
    }

    when (sm.label) {
        0 -> {
            println("프로필을 가져오겠습니다")
            val profile = userProfileRepository.findProfile(userId)
        }

        1 -> {
            println("이미지를 가져오겠습니다")
            val image = userImageRepository.findImage(profile)
        }

        2 -> return UserDto(profile, image)
    }
}
```

이렇게까지 코드가 변경되면, 에러가 발생하기 시작한다. 가장 먼저 눈에 띄는 에러는 1번 라벨과 2번 라벨에서 profile, image를 가져올 수 없다는 에러이다. 이를 해결하기 위해 우리가 만들었던 sm에 profile과 image를 갖고 있게 하자. 그리고 해당 데이터가 필요한 순간에 sm에서 데이터를 꺼내 사용하게 변경하자.

``` kotlin
suspend fun findUser(userId: Long): UserDto {
    // state machine의 약자, 라벨을 기준으로 상태를 관리
    val sm = object : Continuation {
        var label = 0
        var profile: Profile? = null
        var image: Image? = null
    }

    when (sm.label) {
        0 -> {
            println("프로필을 가져오겠습니다")
            val profile = userProfileRepository.findProfile(userId)
        }

        1 -> {
            println("이미지를 가져오겠습니다")
            val image = userImageRepository.findImage(profile)
        }

        2 -> return UserDto(profile, image)
    }
}
```

다음으로 이제 sm에 이 데이터를 갖고 있을 수 있게 처리해주어야 한다. 또한, 현재는 라벨이 0으로 고정되어 있으므로 중단 지점 직전에 label을 하나씩 올려주도록 하자.

``` kotlin
suspend fun findUser(userId: Long): UserDto {
    val sm = object : Continuation {
        var label = 0
        var profile: Profile? = null
        var image: Image? = null
    }

    when (sm.label) {
        0 -> {
            println("프로필을 가져오겠습니다")
            sm.label = 1
            val profile = userProfileRepository.findProfile(userId)
            sm.profile = profile
        }

        1 -> {
            println("이미지를 가져오겠습니다")
            sm.label = 2
            val image = userImageRepository.findImage(sm.profile!!)
            sm.image = image
        }

        2 -> {
            return UserDto(sm.profile!!, sm.image!!)
        }
    }
}
```

그러면 어떻게 1번 라벨과 2번 라벨이 호출되게 할 수 있을까? 현재는 `findUser`가 호출되면, sm 이라는 변수가 만들어지며 0번 라벨을 갖게 되고, `userProfileRepository.findProfile()`를 호출 직전 1번 라벨로 변경되긴 하지만, 그대로 함수가 종료되어 버린다. 이를 해결하기 위해, `suspend` 함수는 가장 마지막 매개변수로 `Continuation`을 받도록 변경할 것이다. 우리가 살펴보고 있는 `findUser` 중단 함수도 마찬가지이고, `findUser`에서 사용하고 있는 `findProfile`이나 `findImage`도 마찬가지이다.

``` kotlin
class UserImageRepository {
    suspend fun findImage(profile: Profile, continuation: Continuation): Image {
        delay(100L)
        return Image()
    }
}

class UserProfileRepository {
    suspend fun findProfile(userId: Long, continuation: Continuation): Profile {
        delay(100L)
        return Profile()
    }
}

class UserService {
    private val userProfileRepository = UserProfileRepository()
    private val userImageRepository = UserImageRepository()
    suspend fun findUser(userId: Long, continuation: Continuation): UserDto {
        val sm = object : Continuation {
            var label = 0
            var profile: Profile? = null
            var image: Image? = null
        }
    }
    when (sm.label) {
        0 -> {
            println("프로필을 가져오겠습니다")
            sm.label = 1
            val profile = userProfileRepository.findProfile(userId, sm)
            sm.profile = profile
        }
        1 -> {
            println("이미지를 가져오겠습니다")
            sm.label = 2
            val image = userImageRepository.findImage(sm.profile!!, sm)
            sm.image = image
        }
        2 -> {
            return UserDto(sm.profile!!, sm.image!!)
        }
    }
}
```

그리고 이제 `Continuation`에 `resumeWith(data: Any?)`라는 함수를 하나 만들고, findUser에서 익명 클래스로 만든 sm에 `resumeWith`를 오버라이드 하도록 한다. 오버라이드된 `resumeWith`에서는 다시 한 번 findUser를 호출할 것이다.

``` kotlin
interface Continuation {
    suspend fun resumeWith(data: Any?)
}

class UserService {
    private val userProfileRepository = UserProfileRepository()
    private val userImageRepository = UserImageRepository()

    private abstract class FindUserContinuation() : Continuation {
        var label = 0
        var profile: Profile? = null
        var image: Image? = null
    }

    suspend fun findUser(userId: Long, continuation: Continuation?): UserDto {
        val sm = continuation as? FindUserContinuation ?: object : FindUserContinuation() {
            override suspend fun resumeWith(data: Any?) {
                when (label) {
                    0 -> {
                        profile = data as Profile
                        label = 1
                    }

                    1 -> {
                        image = data as Image
                        label = 2
                    }
                }
                findUser(userId, this)
            }
        }

        when (sm.label) {
            0 -> {
                println("프로필을 가져오겠습니다")
                sm.label = 1
                val profile = userProfileRepository.findProfile(userId, sm)
                sm.profile = profile
            }

            1 -> {
                println("이미지를 가져오겠습니다")
                sm.label = 2
                val image = userImageRepository.findImage(sm.profile!!, sm)
                sm.image = image
            }

            2 -> {
                return UserDto(sm.profile!!, sm.image!!)
            }
        }
    }
}
```

자 그럼 이제 우리가 findUser에서 호출하는 또 다른 suspend 함수인 findProfile과 findImage에 넘겨준 이 Continuation 객체를 이용해 resumeWith를 호출한다면, 다음 라벨 영역의 코드가 호출되게 만들 수 있을 것이다. 이렇게 동작하기 위해서, findUser가 호출 될 때마다 sm을 새로 만들어주지 않고, 들어온 Continuation 객체의 타입에 따라 새로운 Continuation 객체를 만들도록 수정한다. 또한, Continuation의 resumeWith를 override한 함수에서 라벨과 데이터를 넣어주도록 수정한다.

``` kotlin
package me.sungbin.coroutine

import kotlinx.coroutines.delay

suspend fun main() {
    val userService = UserService()
    println(userService.findUser(1L, null))
}

interface Continuation {
    suspend fun resumeWith(data: Any?)
}

class UserService {
    private val userProfileRepository = UserProfileRepository()
    private val userImageRepository = UserImageRepository()

    private abstract class FindUserContinuation() : Continuation {
        var label = 0
        var profile: Profile? = null
        var image: Image? = null
    }

    suspend fun findUser(userId: Long, continuation: Continuation?): UserDto {
        val sm = continuation as? FindUserContinuation ?: object : FindUserContinuation() {
            override suspend fun resumeWith(data: Any?) {
                when (label) {
                    0 -> {
                        profile = data as Profile
                        label = 1
                    }

                    1 -> {
                        image = data as Image
                        label = 2
                    }
                }
                findUser(userId, this)
            }
        }

        when (sm.label) {
            0 -> {
                // 0단계 - 초기 시작
                println("프로필을 가져오겠습니다.")
                userProfileRepository.findProfile(userId, sm)
            }

            1 -> {
                // 1단계 - 1차 중단 후 재시작
                println("이미지를 가져오겠습니다.")
                userImageRepository.findImage(sm.profile!!, sm)
            }
        }
        // 2단계 - 2차 중단 후 재시작
        return UserDto(sm.profile!!, sm.image!!)
    }
}

data class UserDto(
    val profile: Profile,
    val image: Image,
)

class UserProfileRepository {
    suspend fun findProfile(userId: Long, continuation: Continuation) {
        delay(100L)
        continuation.resumeWith(Profile())
    }
}

class Profile

class Image

class UserImageRepository {
    suspend fun findImage(profile: Profile, continuation: Continuation) {
        delay(100L)
        continuation.resumeWith(Image())
    }
}
```

이렇게 되면, 우리가 그림에서 살펴보았던 것처럼, Continuation 을 통해 최초 호출인지 아니면 callback 호출인지를 구분할 수 있게 되고, Continuation 의 구현 클래스에서 라벨과 전달할 데이터 등을 관리할 수 있게 된다. 이렇게 코루틴의 내부 동작 원리를 살펴보았다. 실제 우리가 최초 작성했던 간단한 findUser 함수는 컴파일을 하게 되면, 우리가 만들어봤던 Continuation을 사용한 Continuation Passing Style (CPS)로 변하게 된다. 실제 코루틴에서 사용되는 Continuation 인터페이스와 주요 함수는 다음과 같다.

``` kotlin
public interface Continuation<in T> {
    public val context: CoroutineContext
    public fun resumeWith(result: Result<T>)
}
```