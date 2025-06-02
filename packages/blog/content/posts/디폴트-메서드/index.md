---
title: "[자바 고급3] 디폴트 메서드"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-02 22:14:27
series: 자바 고급3
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/ZEStF)를 바탕으로 쓰여진 글입니다.

## 디폴트 메서드가 등장한 이유

자바 8에서 **디폴트 메서드(default method)** 가 등장하기 전에는 **인터페이스에 메서드를 새로 추가**하는 순간, 이미 배포된 기존 구현 클래스들이 해당 메서드를 구현하지 않았기 때문에 전부 컴파일 에러를 일으키게 되는 문제가 있었다. 이 때문에 특정 인터페이스를 이미 많은 클래스에서 구현하고 있는 상황에서, 인터페이스에 새 기능을 추가하려면 기존 코드를 일일이 모두 수정해야 했다. **디폴트 메서드**는 이러한 문제를 해결하기 위해 등장했다. 자바 8부터는 **인터페이스에서 메서드 본문을 가질 수 있도록** 허용해 주어, **기존 코드를 깨뜨리지 않고 새 기능을 추가**할 수 있게 되었다.

그럼 디폴트 메서드가 없을 때 문제를 한번 살펴보자. 해당 예제는 알림 기능에 대한 예제 코드이고 이것을 점차 발전 시켜보자.

### 인터페이스와 구현 클래스

``` java
package defaultmethod.ex1;

public interface Notifier {
    void notify(String message);
}
```

위와 같이 알림 기능에 대한 인터페이스를 정의하였다. 이제 이를 구현하는 이메일, sms, 앱 푸시 알림 구현체를 만들어보자.

``` java
package defaultmethod.ex1;

public class EmailNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[EMAIL] " + message);
    }
}
```

``` java
package defaultmethod.ex1;

public class SmslNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[SMS] " + message);
    }
}
```

``` java
package defaultmethod.ex1;

public class AppPushlNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[APP] " + message);
    }
}
```

이제 사용하는 코드를 작성해보자.

``` java
package defaultmethod.ex1;

import java.util.List;

public class NotifierMainV1 {
    public static void main(String[] args) {
        List<Notifier> notifiers = List.of(new EmailNotifier(), new SmslNotifier(), new AppPushlNotifier());
        notifiers.forEach(n -> n.notify("서비스 가입을 환영합니다!"));
    }
}
```

구현이 깔끔하게 잘 끝났다! 다형성 원칙을 잘 지키고 좋은 코드가 되었다.

### 인터페이스에 새로운 메서드 추가 시 발생하는 문제

그런데 알림 기능에 새로운 기능이 생겼다고 해보자. 알림을 미리 예약하는 스케쥴링 기능이 추가되어야 한다고 해보자. 그러면 인터페이스에 추상 메서드를 추가하면 된다.

``` java
package defaultmethod.ex2;

import java.time.LocalDateTime;

public interface Notifier {
    void notify(String message);

   void scheduleNotification(String message, LocalDateTime scheduledTime);
}
```

그럼 구현체도 해당 추상 메서드를 구현해야 한다. 그런데 이메일 알림 기능에만 조금 다르게 구현을 하고 싶다고 해보자.

``` java
package defaultmethod.ex2;

import java.time.LocalDateTime;

public class EmailNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[EMAIL] " + message);
    }

    @Override
    public void scheduleNotification(String message, LocalDateTime scheduledTime) {
        System.out.println("[EMAIL 전용 스케쥴링] message: " + message + ", time: " + scheduledTime);
    }
}
```

``` java
package defaultmethod.ex2;

import java.time.LocalDateTime;

public class SmsNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[SMS] " + message);
    }

    @Override
    public void scheduleNotification(String message, LocalDateTime scheduledTime) {
        System.out.println("[기본 전용 스케쥴링] message: " + message + ", time: " + scheduledTime);
    }
}
```

``` java
package defaultmethod.ex2;

import java.time.LocalDateTime;

public class AppPushNotifier implements Notifier {

    @Override
    public void notify(String message) {
        System.out.println("[APP] " + message);
    }

    @Override
    public void scheduleNotification(String message, LocalDateTime scheduledTime) {
        System.out.println("[기본 전용 스케쥴링] message: " + message + ", time: " + scheduledTime);
    }

```

요구사항에 충족한 코드를 작성했다. 그런데 만약 알림 기능이 수백개라면? 바로 야근을 해야 할 것이다. 근데 너무 불필요한 야근이다. 이메일만 다르고 나머지는 같은 코드인데 말이다. 따로 공통 기능을 어디다가 두게 하고 싶은데 따로 유틸성 클래스를 만들기에는 너무 불필요하고 그 유틸성 코드도 수백개 구현체에 넣어줘야 한다는 불편함도 있다.

### 디폴트 메서드

자바 8부터 이러한 **하위 호환성** 문제를 해결하기 위해 **디폴트 메서드**가 추가되었다. 인터페이스에 메서드를 새로 추가하면서, **기본 구현**을 제공할 수 있는 기능이다. 예를 들어, `Notifier` 인터페이스에 `scheduleNotification()` 메서드를 **default** 키워드로 작성하고 기본 구현을 넣어두면, 구현 클래스들은 이 메서드를 굳이 재정의하지 않아도 된다.

``` java
package defaultmethod.ex2;

import java.time.LocalDateTime;

public interface Notifier {
    void notify(String message);

//    void scheduleNotification(String message, LocalDateTime scheduledTime);

    default void scheduleNotification(String message, LocalDateTime scheduledTime) {
        System.out.println("[기본 스케쥴링] message: " + message + ", time: " + scheduledTime);
    }
}
```

위와 같이 인터페이스에 디폴트 메서드를 정의를 해주면 필요한 구현체에서만 해당 메서드를 재정의하면 되는 것이다. 결과적으로 **새 메서드가 추가되었음에도 불구하고** 해당 인터페이스를 구현하는 기존 클래스들이 **큰 수정 없이도** (또는 전혀 수정 없이도) 동작을 계속 유지할 수 있게 된다.

## 디폴트 메서드 소개

자바가 처음 등장했을 때부터 인터페이스는 **구현 없이 메서드의 시그니처만을 정의**하는 용도로 사용되었다.

- **인터페이스 목적**: 코드의 계약(Contract)을 정의하고, 클래스가 어떤 메서드를 반드시 구현하도록 강제하여 **명세와 구현을 분리**하는 것이 주된 목적이었다.
- **엄격한 규칙**: 인터페이스에 선언되는 메서드는 기본적으로 모두 추상 메서드(abstract method)였으며, 인터페이스 내에서 구현 내용을 포함할 수 없었다. 오직 `static final` 필드와 `abstract` 메서드 선언만 가능했다.
- **결과**: 이렇게 인터페이스가 엄격하게 구분됨으로써, 클래스는 여러 인터페이스를 구현(implements)할 수 있게 되고, 각각의 메서드는 클래스 내부에서 구체적으로 어떻게 동작할지를 자유롭게 정의할 수 있었다. 이를 통해 객체지향적인 설계와 다형성을 극대화할 수 있었다.

자바 8 이전까지는 인터페이스에 새로운 메서드를 추가하면, 해당 인터페이스를 구현한 모든 클래스에서 그 메서드를 구현해야 했다. 이런 상황에서 만약 자바가 버전 업을 하면서 해당 인터페이스에 새로운 기능을 추가한다면 어떻게 될까? 새로운 자바 버전으로 업데이트 하는 순간 전 세계에서 컴파일 오류들이 발생할 것이다. 이런 문제를 방지하기 위해 자바는 하위호환성을 그 무엇보다 큰 우선순위에 둔다. 결국 인터페이스의 이런 엄격한 규칙 때문에, 그 동안 자바 인터페이스에 새로운 기능을 추가하지 못하는 일이 발생하게 되었다. 그래서 조금 유연한 방법론을 생각하게 되었다.

### 디폴트 메서드 도입 이유

- **하위 호환성(Backward Compatibility) 보장**: 인터페이스에 새로운 메서드를 추가하더라도, 기존 코드가 깨지지 않도록 하기 위한 목적으로 디폴트 메서드가 도입되었다. 인터페이스에 디폴트 구현(기본 구현)을 제공하면, 기존에 해당 인터페이스를 구현하던 클래스들은 추가로 재정의하지 않아도 정상 동작하게 된다.
- **라이브러리 확장성**: 자바가 제공하는 표준 라이브러리에 정의된 인터페이스에 새 메서드를 추가하면서, 사용자들이나 서드파티 라이브러리 구현체가 일일이 수정하지 않아도 되도록 만들었다. 이를 통해 자바 표준 라이브러리 자체도 적극적으로 개선할 수 있게 되었다.
- **람다와 스트림 API 연계**: 자바 8에서 함께 도입된 람다(Lambda)와 스트림(Stream) API를 보다 편리하게 활용하기 위해 인터페이스에서 구현 로직을 제공할 필요가 있었다.
    - `Collection` 인터페이스에 `stream()` 디폴트 메서드 추가
    - `Iterable` 인터페이스에 `forEach` 디폴트 메서드 추가
- **설계 유연성 향상**: 디폴트 메서드를 통해 인터페이스에서도 일부 공통 동작 방식을 정의할 수 있게 되었다. 이는 추상 클래스와의 경계를 어느 정도 유연하게 만들지만, 동시에 지나치게 복잡한 기능을 인터페이스에 넣는 것은 오히려 설계를 혼란스럽게 만들 수 있으므로 주의해야 한다.

즉 디폴트 메서드는 인터페이스에 `default` 키워드를 붙여서 구현 로직을 넣게 함으로 하위 호환성을 지킬 수 있었다.

## 디폴트 메서드의 올바른 사용법

디폴트 메서드는 강력한 기능이지만, 잘못 사용하면 오히려 코드가 복잡해지고 유지보수하기 어려워질 수 있다. 그래섯 오히려 주의를 해야 한다.

- 하위 호환성을 위해 최소한으로 사용
    - 디폴트 메서드는 주로 **이미 배포된 인터페이스**에 새로운 메서드를 추가하면서 기존 구현체 코드를 깨뜨리지 않기 위한 목적으로 만들어졌다.
    - 새 메서드가 필요한 상황이고, 기존 구현 클래스가 많은 상황이 아니라면, 원칙적으로는 각각 구현하거나, 또는 추상 메서드를 추가하는 것을 고려하자.
    - 불필요한 디폴트 메서드 남용은 코드 복잡도를 높일 수 있다.
- 인터페이스는 여전히 추상화의 역할
    - 디폴트 메서드를 통해 인터페이스에 로직을 넣을 수 있다 하더라도, 가능한 한 로직은 구현 클래스나 별도 클래스에 두고, 인터페이스는 **계약(Contract)의 역할**에 충실한 것이 좋다.
    - 디폴트 메서드는 어디까지나 **하위 호환을 위한 기능**이나, **공통으로 쓰기 쉬운 간단한 로직**을 제공하는 정도가 이상적이다.
- 다중 상속(충돌) 문제
    - 하나의 클래스가 여러 인터페이스를 동시에 구현하는 상황에서, **서로 다른 인터페이스에 동일한 시그니처의 디폴트 메서드**가 존재하면 충돌이 일어난다. 즉, 다이아몬드 문제가 발생한다.
    - 이 경우 **구현 클래스**에서 반드시 메서드를 재정의해야 한다. 그리고 직접 구현 로직을 작성하거나 또는 어떤 인터페이스의 디폴트 메서드를 쓸 것인지 명시해 주어야 한다.
- 디폴트 메서드에 상태(state)를 두지 않기
    - 인터페이스는 일반적으로 상태 없이 동작만 정의하는 추상화 계층이다.
    - 인터페이스에 정의하는 디폴트 메서드도 "구현"을 일부 제공할 뿐, 인스턴스 변수를 활용하거나, 여러 차례 호출시 상태에 따라 동작이 달라지는 등의 동작은 지양해야 한다.
    - 이런 로직이 필요하다면 클래스(추상 클래스 등)로 옮기는 것이 더 적절하다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!