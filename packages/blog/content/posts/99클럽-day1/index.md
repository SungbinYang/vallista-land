---
title: "[99클럽] 면접반 1일차"
tags:
  - 면접
image: ./assets/banner.png
date: 2025-04-09 10:08:27
series: 면접
draft: false
---

![배너 이미지](./assets/banner.png)

> 📖 질문
>
> 동시성 문제 해결
>
> 동시성 문제란 무엇이며, 이를 해결하기 위한 기본적인 전략을 설명해주세요. 실제 운영 환경에 적용한 사례가 있다면 함께 설명해 주어도 좋습니다.
>
> 힌트: 동시성은 다중 사용자/요청이 동시에 자원에 접근할 때 발생합니다. 락(lock), 큐(queue), 트랜잭션 격리 수준 등의 개념을 활용해 본 경험을 떠올려 보세요.

# 답변

## 동시성 문제란?

동시성 문제란, 멀티 프로세스, 멀티 스레드 또는 사용자가 동시에 공유자원에 접근할 때 발생하는 데이터의 무결성 및 일관성 문제를 말합니다.

> ✅ 공유자원이란?
>
> 멀티 프로세스 또는 멀티 스레드 환경에서 동시에 접근이 가능한 자원을 말합니다. 대표적인 예시로는 코드 내의 전역변수, 메모리, 파일, DB Connection을 들 수 있습니다.

그러면 동시성 문제가 왜 일어나는지에 대해 물어보실 수 있으실겁니다. 동시성 문제가 발생하는 원인은 **상호 배제의 원칙**을 안 지켰기 때문입니다.

> ✅ 상호배제의 원칙이란?
>
> - 2개 이상의 프로세스 혹은 스레드들이 동시에 임계구역에 있으면 안됩니다.
>
> - 어떤 프로세스 혹은 스레드도 임계구역에 진입하는 것이 무한정 지연 되면 안됩니다.
>
> - 임계구역 안에 있는 프로세스 혹은 스레드가 다른 프로세스 혹은 스레드의 임계구역 진입을 막을 수 있어야 합니다.
>
> - 프로세스들 혹은 스레드들이 각 프로세스들 혹은 스레드들의 처리 속도, 접근 방법, 상태에 대해 어떠한 가정을 하면 안됩니다.

## 동시성 문제 유형

그러면 동시성의 문제유형은 어떤 것이 있는지 말씀드리겠습니다. 동시성의 문제유형은 아래와 같습니다.

- 경쟁조건: 실행 순서에 따라 결과가 달라지는 현상
- 데드락: 프로세스들 혹은 스레드들이 서로의 자원을 기다리면서 영원히 대기하는 상태
- 라이브락: 프로세스들 혹은 스레드들이 계속 상태는 변하지만 진전이 없는 즉, 나아가지 못하는 상태
- 기아상태: 특정 프로세스 혹은 스레드가 필요한 자원을 계속 할당받지 못하는 상태

## 동시성 문제 해결

그럼 이런 동시성 문제를 어떻게 해결하면 될 지 말씀드리겠습니다.

### 락 기반 문제 해결

#### 상호배제 메커니즘

상호배제 메커니즘을 이용하면 쉽게 동시성 문제를 해결 할 수 있습니다. 특히 자바에서는 `synchronized`라는 키워드를 이용하여 해결을 할 수 있습니다. 예시코드도 한번 작성해보았습니다.

``` java
public synchronized void transferMoney(Account from, Account to, Integer amount) {
    from.debit(amount);
    to.credit(amount);
}

public void transferMoney(Account from, Account to, Integer amount) {
    synchronized(this) {
        from.debit(amount);
        to.credit(amount);
    }
}
```
#### 락 기법으로 해결

- Reetrant Lock 활용

``` java
private final ReentrantLock lock = new ReentrantLock();

public void withdraw(Integer amount) {
    lock.lock();
    try {
        if (balance.compareTo(amount) >= 0) {
            balance = balance.subtract(amount);
        }
    } finally {
        lock.unlock();
    }
}
```

- Read-Write Lock 활용

해당 락 방식은 읽기는 병렬로 쓰기는 단독으로 접근하게 하는 락 기법입니다.

``` java
private final ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

public BigDecimal getBalance() {
    readWriteLock.readLock().lock();
    try {
        return balance;
    } finally {
        readWriteLock.readLock().unlock();
    }
}

public void setBalance(BigDecimal newBalance) {
    readWriteLock.writeLock().lock();
    try {
        balance = newBalance;
    } finally {
        readWriteLock.writeLock().unlock();
    }
}
```

- 분산 락 활용

만약 단일 서버가 아닌 여러 서버에서 공유자원 접근정도를 조절하려면 해당 기법을 이용하면 됩니다.

``` java
public boolean acquireLock(String resourceId, String requestId, long timeoutMillis) {
    return Boolean.TRUE.equals(
        redisTemplate.opsForValue().setIfAbsent(
            "lock::" + resourceId, requestId, Duration.ofMillis(timeoutMillis)
        )
    );
}
```

### CAS

CAS는 동기화 없이 동시성 문제를 해결하는 낙관적 락 방식 기법입니다. 이 방식은 멀티스레드 환경에서 락 없이 공유자원의 일관성을 보장합니다.

``` java
private AtomicInteger counter = new AtomicInteger(0);

public void increment() {
    counter.incrementAndGet();
}

boolean compareAndSet(expectedValue, newValue) {
    if (currentValue == expectedValue) {
        currentValue = newValue;
        return true;
    }
    return false;
}
```

### 트랜잭션과 격리 수준 활용

흔히 웹 어플리케이션을 우리는 많이 사용하고 특히 스프링과 JPA를 이용한다면 트랜잭션을 통하여 격리수준을 설정하여 해당 문제를 해결 할 수 있습니다.

``` java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void transferMoney(long fromId, long toId, BigDecimal amount) {
    Account from = accountRepository.findById(fromId).orElseThrow();
    Account to = accountRepository.findById(toId).orElseThrow();
    
    if (from.getBalance().compareTo(amount) < 0) {
        throw new InsufficientBalanceException();
    }
    
    from.debit(amount);
    to.credit(amount);
    
    accountRepository.save(from);
    accountRepository.save(to);
}
```

> ❓ 트랜잭션 격리 수준
>
> 트랜잭션 격리 수준이란, 여러 트랜잭션이 동시에 실행될 때 데이터 정합성과 일관성을 유지하기 위한 기준입니다.
>
> - READ UNCOMMITTED: 다른 트랜잭션이 커밋하지 않은 데이터도 읽을 수 있는 수준이며, 속도는 빠르지만 일관성이 낮고 Dirty Read가 발생합니다.
>
> - READ COMMITTED: 다른 트랜잭션이 커밋한 데이터만 읽을 수 있으며 Non-Repeatable Read 문제가 발생 가능합니다.
>
> - REPEATABLE READ: 트랜잭션 동안 읽은 데이터는 항상 동일하게 유지되며 팬텀 Read 발생이 가능합니다.
>
> - SERIALIZABLE: 모든 트랜잭션이 순차적으로 실행되는것처럼 보이게 하며 모든 동시성 문제를 차단합니다. 단, 성능 이슈가 있습니다.

### 동시성 컬렉션 활용

자바에서 제공해주는 동시성 컬렉션을 활용하여 해당 문제를 해결 할 수 있습니다.

``` java
private final ConcurrentHashMap<String, User> userCache = new ConcurrentHashMap<>();
private final ConcurrentLinkedQueue<Request> requestQueue = new ConcurrentLinkedQueue<>();

userCache.compute("userId", (key, existingUser) -> {
    if (existingUser == null) {
        return new User(key);
    } else {
        existingUser.incrementLoginCount();
        return existingUser;
    }
});
```

### 큐와 메세지 브로커 활용

만약 Kafka같은 메세지 브로커를 이용하여 동시성을 처리할 수 있습니다.

``` java
@Service
public class OrderService {
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;
    
    public OrderConfirmation createOrder(OrderRequest request) {
        
        String orderId = generateOrderId();
        
        kafkaTemplate.send("order-processing", new OrderEvent(orderId, request));
        
        return new OrderConfirmation(orderId, "주문이 접수되었습니다.");
    }
    
    @KafkaListener(topics = "order-processing")
    public void processOrder(OrderEvent event) {
        // 비즈니스 로직
    }
}
```

### ExecutorService

ExecutorService를 이용하여 스레드 풀 관리를 통해 해당 문제 또한 해결할 수 있습니다.

``` java
@Service
public class ReportGenerator {
    private final ExecutorService executor = Executors.newFixedThreadPool(10); // 스레드 풀 관리 전략들이 다양함.
    
    public CompletableFuture<Report> generateReportAsync(ReportRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            return generateReport(request);
        }, executor);
    }
    
    public CompletableFuture<byte[]> generateAndEmailReport(ReportRequest request, String email) {
        return generateReportAsync(request)
            .thenApply(report -> convertToPdf(report))
            .thenApplyAsync(pdf -> {
                emailService.sendEmail(email, pdf);
                return pdf;
            }, executor);
    }
}
```

### 불변 객체 활용

기본적으로 불변객체를 통해 새로운 객체를 반환하여 동시성 문제도 해결 시킬 수 있습니다.

``` java
// 불변 객체 설계
public final class Money {
    private final Integer amount;
    private final Currency currency;
    
    public Money(Integer amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }
    
    public Money add(Money otherMoney) {
        if (!this.currency.equals(otherMoney.currency)) {
            throw new IllegalArgumentException("예외 발생");
        }

        return new Money(this.amount.add(otherMoney.amount), this.currency);
    }
}
```

### 실무 적용 사례

제가 실무에서 동시성 이슈가 발생한 적이 있었습니다. 바로 사내에 회의실 예약 시스템에서 해당 이슈가 발생이 되었습니다. 회의실 예약을 할 때 인기있던 시간대들이 있었는데 그 시간 대에 동시성 이슈가 빈번히 발생하는 현상을 모니터링으로 확인할 수 있었습니다. 저는 해당 부분에서 예약을 할 때 **비관적 락**기법을 이용하였습니다. 왜냐하면 일단 데이터에 대한 일관성이 매우 중요했고 해당 이슈를 해결하기 위한 기한이 짧아서 바로 생각나는 방법을 적용하였고 현재 해당 이슈를 해결한 경험이 있습니다. 다만, 제가 적용한 비관적 락 방식이 최선의 방법이 아닐 수 있지만 그 상황에서 실리적이고 최선의 방법이라 생각하였고 바로 적용하였습니다. 사내 코드이므로 일부 코드만 보여드리면 다음과 같습니다.

``` java
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId " +
           "AND r.status = 'CONFIRMED' " +
           "AND ((r.startTime <= :endTime AND r.endTime >= :startTime))")
    List<Reservation> findOverlappingReservations(
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId " +
           "AND r.status = 'CONFIRMED' " +
           "AND ((r.startTime <= :endTime AND r.endTime >= :startTime))")
    List<Reservation> findOverlappingReservationsWithLock(
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
```