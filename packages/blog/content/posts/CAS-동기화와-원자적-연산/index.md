---
title: "[자바 고급1] CAS - 동기화와 원자적 연산"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-17 13:28:27
series: 자바 고급1
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/6oSgn)를 바탕으로 쓰여진 글입니다.

## 원자적 연산 - 소개

컴퓨터 과학에서 사용하는 **원자적 연산**의 의미는 해당 연산이 더 이상 나눌 수 없는 단위로 수행된다는 것을 의미한다. 즉, 원자적 연산은 중단되지 않고, 다른 연산과 간섭 없이 완전히 실행되거나 전혀 실행되지 않는 성질을 가지고 있다. 쉽게 이야기해서 멀티스레드 상황에서 다른 스레드의 간섭 없이 안전하게 처리되는 연산이라는 뜻이다.

예를 들어 `int i = 1;`이라는 코드가 대표적인 원자적 연산이다. 그냥 변수에 대입만 하면 되기 때문에 여러 스레드가 와도 값이 안전하여 스레드 세이프하다. 하지만 아래와 같은 연산은 원자적 연산이 아니다.

``` java
i = i + 1;
i++;
```

위의 두 코드는 서로 같은 코드이며 원리는 다음과 같다.

- 변수 i의 값을 읽는다.
- 읽은 변수 i 값에 1을 더한다.
- 더한 값을 다시 i에 대입힌다.

만약 이 과정은 여러 단계가 포함되어 있다. 즉, 해당 연산 과정에서 여러 스레드가 동시에 접근하면 이상한 값이 나올 확률이 있다. 즉, 스레드 세이프하지 않다.

## 원자적 연산 - 시작

원자적이지 않은 연산을 멀티스레드 환경에서 실행하면 어떤 문제가 발생하는지 코드로 알아보자.

``` java
package thread.cas.increment;

public interface IncrementInteger {

    void increment();

    int get();
}
```

위와 같은 인터페이스를 정의하였다. 메서드는 단순하다. 증가하는 로직과 값을 가져오는 로직이다. 이것을 보고 위의 상황을 구현하려는거구나라고 파악이 될 것이다.

``` java
package thread.cas.increment;

public class BasicInteger implements IncrementInteger {

    private int value;

    @Override
    public void increment() {
        value++;
    }

    @Override
    public int get() {
        return value;
    }
}
```

이제 인터페이스를 구현한 구현체를 작성하였다. 정말 단순한 로직이다. 이제 사용하는 `main` 메서드를 작성해보자.

``` java
package thread.cas.increment;

import java.util.ArrayList;
import java.util.List;

import static util.ThreadUtils.sleep;

public class IncrementThreadMain {

    public static final int THREAD_COUNT = 1000;

    public static void main(String[] args) throws InterruptedException {
        test(new BasicInteger());
    }

    private static void test(IncrementInteger incrementInteger) throws InterruptedException {
        Runnable runnable = () -> {
            sleep(10);
            incrementInteger.increment();
        };

        List<Thread> threads = new ArrayList<>();

        for (int i = 0; i < THREAD_COUNT; i++) {
            Thread thread = new Thread(runnable);
            threads.add(thread);
            thread.start();
        }

        for (Thread thread : threads) {
            thread.join();
        }

        int result = incrementInteger.get();
        System.out.println(incrementInteger.getClass().getSimpleName() + " result: " + result);
    }
}
```

위의 코드는 1000개의 스레드를 만들어서 각자 로직을 실행하게 해두었다. 그리고 `value++;`연산은 너무 빠르게 수행되기에 `sleep`을 걸어두었다. 또한 `main`메서드가 값을 받아서 확인하게끔 하려고 `join` 메서드도 걸어두었다.

이제 우리는 알 것이다. 값이 1000이 안 나온다는 사실을. 그러면 이것을 어떻게 해결할까?

## 원자적 연산 - volatile, synchronized

그러면 먼저 `volatile` 키워드를 넣어서 해결해보자. 물론 이 상황은 메모리 가시성 문제가 아니라서 해결이 안될 것이라고 알 수 있다. 그래도 일단 확인은 해보자.

``` java
package thread.cas.increment;

public class VolatileInteger implements IncrementInteger {

    private volatile int value;

    @Override
    public void increment() {
        value++;
    }

    @Override
    public int get() {
        return value;
    }
}
```

멤버 변수에 `volatile` 키워드만 붙여주었다. 하지만 문제는 여전히 1000이 나오지를 않는다. `volatile`은 여러 CPU 사이에 발생하는 캐시 메모리와 메인 메모리가 동기화 되지 않는 문제를 해결할 뿐이다. `volatile`을 사용하면 CPU의 캐시 메모리를 무시하고, 메인 메모리를 직접 사용하도록 한다. 하지만 지금 이 문제는 캐시 메모리가 영향을 줄 수는 있지만, 캐시 메모리를 사용하지 않고, 메인 메모리를 직접 사용해도 여전히 발생하는 문제이다. 이 문제는 연산 자체가 나누어져 있기 때문에 발생한다. `volatile`은 연산 차제를 원자적으로 묶어주는 기능이 아니다.

이렇게 연산이 단계별로 나눠져 있다면 `synchronized`나 `Lock`을 사용해야 한다. 그러면 `synchronized`를 이용해서 해결해보자.

``` java
package thread.cas.increment;

public class SyncInteger implements IncrementInteger {

    private int value;

    @Override
    public synchronized void increment() {
        value++;
    }

    @Override
    public synchronized int get() {
        return value;
    }
}
```

이렇게 작성함으로 동시성 문제가 해결이 되었다. 또한 `synchronized`를 붙이면 메모리 가시성 문제도 해결되기 때문에 `volatile` 키워드는 제거해줘도 된다.

## 원자적 연산 - AtomicInteger

자바는 멀티스레드 상황에서 안전하게 증가 연산을 수행할 수 있는 `AtomicInteger`라는 클래스를 제공한다. 그러면 해당 클래스를 사용해서 코드를 작성해보자.

``` java
package thread.cas.increment;

import java.util.concurrent.atomic.AtomicInteger;

public class MyAtomicInteger implements IncrementInteger {

    private AtomicInteger atomicInteger = new AtomicInteger(0);

    @Override
    public void increment() {
        atomicInteger.incrementAndGet();
    }

    @Override
    public int get() {
        return atomicInteger.get();
    }
}
```

멤버 변수로 `value` 대신에 `AtomicInteger`를 사용하였고 생성자 파라미터로 초기값을 지정해줄 수 있다. 그리고 증가는 `++`대신에 `incrementAndGet()` 메서드를 사용한다. 즉, 증가하고 반환하는 메서드이다. `AtomicInteger`는 멀티스레드 상황에 안전하고 또 다양한 값 증가, 감소 연산을 제공한다. 특정 값을 증가하거나 감소해야 하는데 여러 스레드가 해당 값을 공유해야 한다면, `AtomicInteger`를 사용하면 된다.

> ✅ 참고
>
> `AtomicInteger`,`AtomicLong`,`AtomicBoolean`등 다양한 `AtomicXxx` 클래스가 존재한다.

## 원자적 연산 - 성능 테스트

그러면 성능 분석을 해보자.

``` java
package thread.cas.increment;

public class IncrementPerformanceMain {

    public static final long COUNT = 100_000_000;

    public static void main(String[] args) {
        test(new BasicInteger());
        test(new VolatileInteger());
        test(new SyncInteger());
        test(new MyAtomicInteger());
    }

    private static void test(IncrementInteger incrementInteger) {
        long startMs = System.currentTimeMillis();

        for (long i = 0; i < COUNT; i++) {
            incrementInteger.increment();
        }

        long endMs = System.currentTimeMillis();

        System.out.println(incrementInteger.getClass().getSimpleName() + " : ms = " + (endMs - startMs));
    }
}
```

### BasicInteger

- 가장 빠르다.
- CPU 캐시를 적극 사용한다. CPU 캐시의 위력을 알 수 있다.
- 안전한 임계 영역도 없고, `volatile`도 사용하지 않기 때문에 멀티스레드 상황에는 사용할 수 없다.
- 단일 스레드에서 사용한다.

### VolatileInteger

- `volatile`을 사용해서 CPU 캐시를 사용하지 않고 메인 메모리를 사용한다.
- 안전한 임계 영역이 없기 때문에 멀티스레드 상황에는 사용할 수 없다.
- 단일 스레드에 사용하기에도 `BasicInteger`보다 느리기 때문에 꼭 필요한 상황에서 사용해야 한다.
- 멀티 스레드 상황에도 위험하다.

### SyncInteger

- `synchronized`를 사용한 안전한 임계 영역이 있기 때문에 멀티스레드 상황에도 안전하게 사용할 수 있다.
- `MyAtomicInteger` 보다 성능이 느리다.

### MyAtomicInteger

- 자바가 제공하는 `AtomicInteger`를 사용한다. 멀티스레드 상황에 안전하게 사용할 수 있다.
- 성능도 `synchronized`,`Lock(ReentrantLock)`을 사용하는 경우보다 1.5 ~ 2배 정도 빠르다.

`AtomicInteger`가 제공하는 `incrementAndGet()` 메서드는 락을 사용하지 않고, 원자적 연산을 만들어낸다. 그래서 락을 사용하는 방식에 비해 빠른 것이다.

## CAS 연산1

### 락 기반 문제점

락 기법은 다음과 같은 과정을 거친다.

- 락이 있는지 확인한다.
- 락이 있다면 락을 획득한다.
- 작업을 한다.
- 락을 반납한다.

락은 특정 자원을 보호하기 위해 스레드가 해당 자원에 대한 접근하는 것을 제한한다. 락이 걸려 있는 동안 다른 스레드들은 해당 자원에 접근할 수 없고, 락이 해제될 때까지 대기해야 한다. 또한 락 기반 접근에서는 락을 획득하고 해제하는 데 시간이 소요된다. 즉, 이런 과정이 10000번의 연산이 있다면 10000번을 모두 같은 과정으로 해야한다. 즉, 상당히 무거운 과정이다.

### CAS

이런 문제를 해결하기 위해 락을 걸지 않고 원자적인 연산을 수행할 수 있는 방법이 있는데, 이것을 CAS 연산이라 한다. 이 방법은 락을 사용하지 않기 때문에 락 프리 기법이라 한다. 참고로 CAS 연산은 락을 완전히 대체하는 것은 아니고, **작은 단위의 일부 영역에 적용**할 수 있다. 기본은 락을 사용하고, 특별한 경우에 CAS를 적용할 수 있다고 생각하면 된다. 코드를 통해 살펴보자.

``` java
package thread.cas;

import java.util.concurrent.atomic.AtomicInteger;

public class CasMainV1 {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(0);
        System.out.println("start value = " + atomicInteger.get());

        boolean result1 = atomicInteger.compareAndSet(0, 1);
        System.out.println("result1 = " + result1 + ", value = " + atomicInteger.get());

        boolean result2 = atomicInteger.compareAndSet(0, 1);
        System.out.println("result2 = " + result2 + ", value = " + atomicInteger.get());
    }
}
```

`AtomicXxx` 클래스는 `compareAndSet()` 메서드를 제공한다. 첫번째 파라미터의 값이 맞는지 확인 후, 맞다면 두번째 파라미터 값으로 변경하고 `true`를 반환한다. 그렇지 않다면 변경하지 않고 `false`를 반환한다. 여기서 중요한 것은 이 연산이 원자적으로 수행된다는 점이다. 그럼 독자들은 의문이 들 것이다. 딱 봐도 비교하는 과정과 변경하는 과정 2개의 단계로 이루어져 있는데 이게 왜 원자적 연산일까?

CAS 연산은 이렇게 원자적이지 않은 두 개의 연산을 CPU 하드웨어 차원에서 특별하게 하나의 원자적인 연산으로 묶어서 제공하는 기능이다. 이것은 소프트웨어가 제공하는 기능이 아니라 하드웨어가 제공하는 기능이다. 대부분의 현대 CPU들은 CAS 연산을 위한 명령어를 제공한다. 즉, 소프트웨어 차원이 아닌 하드웨어 차원으로 원자적 연산을 보장해주는 메서드이다. 하나의 스레드가 점유한다면 다른 스레드는 침범하지 못하게 하드웨어 차원에서 막아준다. 그럼 이 기능을 통해 락을 대체할 수 있다고들 많이 한다. 어떻게 락을 대체할 수 있을까?

## CAS 연산2

어떤 값을 하나 증가하는 `value++` 연산은 원자적 연산이 아니다.

- value의 값을 읽는다.
- value의 값을 하나 증가 시킨다.
- 증가한 value의 값을 value에 저장한다.

이렇게 풀어만 봐도 벌써 3단계나 되는 원작적이지 못한 연산인 것이다. 그럼 이 부분을 CAS 연산을 통하여 `AtomicInteger`에서 제공하는 `incrementAndGet()` 메서드를 직접 구현해보자.

``` java
package thread.cas;

import java.util.concurrent.atomic.AtomicInteger;

import static util.MyLogger.log;

public class CasMainV2 {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(0);
        System.out.println("start value = " + atomicInteger.get());

        int resultValue1 = incrementAndGet(atomicInteger);
        System.out.println("resultValue1 = " + resultValue1);

        int resultValue2 = incrementAndGet(atomicInteger);
        System.out.println("resultValue2 = " + resultValue2);
    }

    private static int incrementAndGet(AtomicInteger atomicInteger) {
        int getValue;
        boolean result;

        do {
            getValue = atomicInteger.get();
            log("getValue: " + getValue);

            result = atomicInteger.compareAndSet(getValue, getValue + 1);
            log("result: " + result);
        } while (!result);

        return getValue + 1;
    }
}
```

CAS 연산을 사용하면 여러 스레드가 같은 값을 사용하는 상황에서도 락을 걸지 않고, 안전하게 값을 증가할 수 있다. 여기서는 락을 걸지 않고 CAS 연산을 사용해서 값을 증가했다. `do~while`문을 통하여 먼저 `atomicInteger` 값을 읽는다. 읽은 후에는 `comapreAndSet()` 메서드로 CAS 연산을 수행하여 해당 값이 맞으면 1을 증가시키는 로직이다. 그리고 성공하면 `true`를 실패하면 `false`를 반환하면 반복문을 탈출한다.

지금은 `main` 스레드 하나로 순서대로 실행되기 때문에 CAS 연산이 실패하는 상황을 볼 수 없다. 우리가 기대하는 실패하는 상황은 연산의 중간에 다른 스레드가 값을 변경해버리는 것이다. 멀티스레드로 실행해서 CAS 연산이 실패하는 경우에 어떻게 작동하는지 알아보자.

## CAS 연산3

멀티스레드를 사용해서 중간에 다른 스레드가 먼저 값을 증가시켜 버리는 경우를 알아보자.

``` java
package thread.cas;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static util.MyLogger.log;
import static util.ThreadUtils.sleep;

public class CasMainV3 {

    private static final int THREAD_COUNT = 2;

    public static void main(String[] args) throws InterruptedException {
        AtomicInteger atomicInteger = new AtomicInteger(0);
        System.out.println("start value = " + atomicInteger.get());

        Runnable runnable = () -> incrementAndGet(atomicInteger);

        List<Thread> threads = new ArrayList<>();

        for (int i = 0; i < THREAD_COUNT; i++) {
            Thread thread = new Thread(runnable);
            threads.add(thread);
            thread.start();
        }

        for (Thread thread : threads) {
            thread.join();
        }

        int result = atomicInteger.get();
        System.out.println(atomicInteger.getClass().getSimpleName() + " resultValue: " + result);
    }

    private static int incrementAndGet(AtomicInteger atomicInteger) {
        int getValue;
        boolean result;

        do {
            getValue = atomicInteger.get();
            sleep(100);
            log("getValue: " + getValue);

            result = atomicInteger.compareAndSet(getValue, getValue + 1);
            log("result: " + result);
        } while (!result);

        return getValue + 1;
    }
}
```

2개의 스레드가 나눠서 연산을 시행하였다. 예를들어 첫번째 스레드가 `atomicInteger.get()`을 통하여 값을 얻어온다. 그리고 `TIMED_WAITING` 상태로 가면서 다른 스레드가 또 값을 얻어오고 `TIMED_WAITING`상태로 간다. 그런데 우연히 마지막으로 대기상태로 간 스레드가 바로 깨어나서 값을 변경한다. 그리고 반복문을 빠져나간다. 그리고 첫번째 스레드가 깨어나 값을 변경하려고 하나 값이 달라서 다시 반복문 재수행 후 값을 증가시키는 로직이다.

`AtomicInteger`가 제공하는 `incrementAndGet()` 코드도 앞서 우리가 직접 작성한 `incrementAndGet()` 코드와 똑같이 CAS를 활용하도록 작성되어 있다. CAS를 사용하면 락을 사용하지 않지만, 대신에 다른 스레드가 값을 먼저 증가해서 문제가 발생하는 경우 루프를 돌며 재시도를 하는 방식을 사용한다. 동작과정은 아래와 같다.

- 현재 변수의 값을 읽어온다.
- 변수의 값을 1 증가시킬 때, 원래 값이 같은지 확인한다. (CAS 연산 사용)
- 동일하다면 증가된 값을 변수에 저장하고 종료한다.
- 동일하지 않다면 다른 스레드가 값을 중간에 변경한 것이므로, 다시 처음으로 돌아가 위 과정을 반복한다.

두 스레드가 동시에 실행되면서 문제가 발생하는 상황을 스레드가 충돌했다고 표현한다.

이 과정에서 충돌이 발생할 때마다 반복해서 다시 시도하므로, 결과적으로 락 없이 데이터를 안전하게 변경할 수 있다. CAS를 사용하는 방식은 충돌이 드물게 발생하는 환경에서는 락을 사용하지 않으므로 높은 성능을 발휘할 수 있다. 이는 락을 사용하는 방식과 비교했을 때, 스레드가 락을 획득하기 위해 대기하지 않기 때문에 대기 시간과 오버헤드가 줄어드는 장점이 있다.

그러나 충돌이 빈번하게 발생하는 환경에서는 성능에 문제가 될 수 있다. 여러 스레드가 자주 동시에 동일한 변수의 값을 변경하려고 시도할 때, CAS는 자주 실패하고 재시도해야 하므로 성능 저하가 발생할 수 있다. 이런 상황에서는 반복문을 계속 돌기 때문에 CPU 자원을 많이 소모하게 된다.

### CAS vs 락

- 락 방식
  - 비관적(pessimistic) 접근법
  - 데이터에 접근하기 전에 항상 락을 획득
  - 다른 스레드의 접근을 막음
  - "다른 스레드가 방해할 것이다"라고 가정
- CAS 방식
  - 낙관적(optimistic) 접근법
  - 락을 사용하지 않고 데이터에 바로 접근
  - 충돌이 발생하면 그때 재시도
  - "대부분의 경우 충돌이 없을 것이다"라고 가정

정리하면 충돌이 많이 없는 경우에 CAS 연산이 빠른 것을 확인할 수 있다. 그럼 충돌이 많이 발생하지 않는 연산은 어떤 것이 있을까? 언제 CAS 연산을 사용하면 좋을까? 사실 간단한 CPU 연산은 너무 빨리 처리되기 때문에 충돌이 자주 발생하지 않는다. 충돌이 발생하기도 전에 이미 연산을 완료하는 경우가 더 많다. 즉, 일반적인 간단한 연산인데 동시성 이슈가 발생할 우려가 있을 것 같으면 CAS를 사용하는게 더 좋을 것이다. 만약 락을 사용한다면 하나의 스레드가 락을 얻어 작업 수행 후 락을 반납하기까지 무거운 과정을 거치는게 매우 무거울 것이다.

## CAS 락 구현1

CAS는 단순한 연산 뿐만 아니라, 락을 구현하는데 사용할 수도 있다. 먼저 CAS를 사용하지 말고 락을 먼저 구현해보고 그 이후에 CAS를 이용하여 락을 구현해보자.

``` java
package thread.cas.spinlock;

import static util.MyLogger.log;
import static util.ThreadUtils.sleep;

public class SpinLockBad {

    private volatile boolean lock = false;

    public void lock() {
        log("락 획득 시도");

        while (true) {
            if (!lock) {
                sleep(100);
                lock = true;
                break;
            } else {
                log("락 획득 실패 - 스핀 대");
            }
        }

        log("락 획득 완료");
    }

    public void unlock() {
        lock = false;
        log("락 반납 완료");
    }
}
```

위와 같이 코드를 구현했다. 로직은 간단하다. 락이 있는지 유무를 조건문으로 판단하고 락이 없다면 락을 `true`로 변경하고 반복문을 빠져나간다. 이제 이 코드를 사용하는 `main` 메서드를 만들어보자.

``` java
package thread.cas.spinlock;

import static util.MyLogger.log;

public class SpinLockMain {
    public static void main(String[] args) {
        SpinLockBad spinLock = new SpinLockBad();

        Runnable task = () -> {
            spinLock.lock();

            try {
                // 임계 영역
                log("비즈니스 로직 실행");
            } finally {
                spinLock.unlock();
            }
        };

        Thread t1 = new Thread(task, "Thread-1");
        Thread t2 = new Thread(task, "Thread-2");

        t1.start();
        t2.start();
    }
}
```

결과를 확인하면 이상하게 나올 것이다. 즉, 두개의 스레드가 동시에 락을 획득하고 동시에 작업 수행 후, 동시에 락을 반납한다. 뭔가 우리가 생각하는 락 기법과는 다르다. 이 둘은 한 번에 하나의 스레드만 실행해야 한다. 따라서 `synchronized` 또는 `Lock`을 사용해서 두 코드를 동기화해서 안전한 임계 영역을 만들어야 한다. 여기서 다른 해결 방안도 있다. 바로 두 코드를 하나로 묶어서 원자적으로 처리하는 것이다. CAS 연산을 사용하면 두 연산을 하나로 묶어서 하나의 원자적인 연산으로 처리할 수 있다. 락의 사용 여부를 확인하고, 그 값이 기대하는 값과 같다면 변경하는 것이다. 이것은 CAS 연산에 딱 들어 맞는다!

## CAS 락 구현2

이제 CAS 락을 사용해보자.

``` java
package thread.cas.spinlock;

import java.util.concurrent.atomic.AtomicBoolean;

import static util.MyLogger.log;

public class SpinLock {

    private final AtomicBoolean lock = new AtomicBoolean(false);

    public void lock() {
        log("락 획득 시도");

        while (!lock.compareAndSet(false, true)) {
            log("락 획득 실패 - 스핀 대기");
        }

        log("락 획득 완료");
    }

    public void unlock() {
        lock.set(false);
        log("락 반납 완료");
    }
}
```

구현은 단순하다. `AtomicBoolean`을 사용하여 초기값을 `false`로 세팅하고 `compareAndSet()` 메서드를 이용하여 `false`면 `true`
로 세팅하는 것이다. 즉, 스레드가 락을 획득하면 while문을 탈출한다. 스레드가 락을 획득하지 못하면 락을 획득할 때 까지 while문을 계속 반복 실행한다. 락을 획득하기 위해 먼저 락의 사용 여부를 확인했을 때 `lock`의 현재 값이 반드시 `false`여야 한다. `true`는 이미 다른 스레드가 락을 획득했다는 뜻이다. 따라서 이 값이 `false`일 때만 락의 값을 변경할 수 있다. 락의 값이 `false`인 것을 확인한 시점부터 `lock`의 값을 `true`로 변경할 때 까지 `lock`의 값은 반드시 `false`를 유지해야 한다. 중간에 다른 스레드가 `lock`의 값을 `true`로 변경하면 안된다. 그러면 여러 스레드가 임계 영역을 통과하는 동시성 문제가 발생한다. CAS 연산은 이 락을 확인하고 락의 값을 변경하는 과정을 하나의 원자적인 연산으로 만들어준다.

원자적인 연산은 스레드 입장에서 쪼갤 수 없는 하나의 연산이다. 따라서 여러 스레드가 동시에 실행해도 안전하다. 이렇게 CAS를 사용해서 원자적인 연산을 만든 덕분에 무거운 동기화 작업 없이 아주 가벼운 락을 만들 수 있었다. 동기화 락을 사용하는 경우 스레드가 락을 획득하지 못하면 `BLOCKED`,`WAITING` 등으로 상태가 변한다. 그리고 또 대기 상태의 스레드를 깨워야 하는 무겁고 복잡한 과정이 추가로 들어간다. 따라서 성능이 상대적으로 느릴 수 있다. 반면에 CAS를 활용한 락 방식은 사실 락이 없다. 단순히 while문을 반복할 뿐이다. 따라서 대기하는 스레드도 `RUNNABLE`상태를 유지하면서 가볍고 빠르게 작동할 수 있다.

### CAS 단점

CAS 연산도 단점이 존재한다. CAS 락(스핀 락)은 동기화 락 기법처럼 스레드 상태가 `BLOCKED`나 `WAITING`상태로 빠지지 않는다. 즉, 계속 `RUNNABLE`상태로 유지하기 때문에 컨텍스트 스위칭이 발생하지 않아서 동기화 락보다 가볍고 성능도 뛰어나다. 하지만 DB값 조회, 외부 서버와 통신과 같은 무거운 작업이 있을 경우에는 CPU 자원을 계속 소모하기 때문에 오히려 동기화 락보다 CPU를 더 소모하게 된다. 즉, 스핀 락을 사용할 때는 무겁지 않는 단순 연산이라던가, 자료구조의 데이터 추가 및 삭제같은 것을 진행할 때 사용하는 것이 좋다.

### 스핀 락

스레드가 락이 해제되기를 기다리면서 반복문을 통해 계속해서 확인하는 모습이 마치 제자리에서 회전(spin)하는 것처럼 보인다. 그래서 이런 방식을 "스핀 락"이라고도 부른다. 그리고 이런 방식에서 스레드가 락을 획득 할 때 까지 대기하는 것을 스핀 대기(spin-wait) 또는 CPU 자원을 계속 사용하면서 바쁘게 대기한다고 해서 바쁜 대기(busy-wait)라 한다. 이런 스핀 락 방식은 아주 짧은 CPU 연산을 수행할 때 사용해야 효율적이다. 잘못 사용하면 오히려 CPU 자원을 더 많이 사용할 수 있다. 정리하면 "스핀 락"이라는 용어는, 락을 획득하기 위해 자원을 소모하면서 반복적으로 확인(스핀)하는 락 메커니즘을 의미한다. 그리고 이런 스핀 락은 CAS를 사용해서 구현할 수 있다.

## 정리

### CAS 장점

- 낙관적 동기화: 락을 걸지 않고도 값을 안전하게 업데이트할 수 있다. CAS는 충돌이 자주 발생하지 않을 것이라고 가정한다. 이는 충돌이 적은 환경에서 높은 성능을 발휘한다.
- 락 프리(Lock-Free): CAS는 락을 사용하지 않기 때문에, 락을 획득하기 위해 대기하는 시간이 없다. 따라서 스레드가 블로킹되지 않으며, 병렬 처리가 더 효율적일 수 있다.

### CAS 단점

- 충돌이 빈번한 경우: 여러 스레드가 동시에 동일한 변수에 접근하여 업데이트를 시도할 때 충돌이 발생할 수 있다. 충돌이 발생하면 CAS는 루프를 돌며 재시도해야 하며, 이에 따라 CPU 자원을 계속 소모할 수 있다. 반복적인 재시도로 인해 오버헤드가 발생할 수 있다.
- 스핀락과 유사한 오버헤드: CAS는 충돌 시 반복적인 재시도를 하므로, 이 과정이 계속 반복되면 스핀락과 유사한 성능 저하가 발생할 수 있다. 특히 충돌 빈도가 높을수록 이런 현상이 두드러진다.

### 동기화 락 장점

- 충돌 관리: 락을 사용하면 하나의 스레드만 리소스에 접근할 수 있으므로 충돌이 발생하지 않는다. 여러 스레드가 경쟁할 경우에도 안정적으로 동작한다.
- 안정성: 복잡한 상황에서도 락은 일관성 있는 동작을 보장한다.
- 스레드 대기: 락을 대기하는 스레드는 CPU를 거의 사용하지 않는다.

### 동기화 락 단점

- 락 획득 대기 시간: 스레드가 락을 획득하기 위해 대기해야 하므로, 대기 시간이 길어질 수 있다.
- 컨텍스트 스위칭 오버헤드: 락을 사용하면, 락 획득을 대기하는 시점과 또 락을 획득하는 시점에 스레드의 상태가 변경된다. 이때 컨텍스트 스위칭이 발생할 수 있으며, 이로 인해 오버헤드가 증가할 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!