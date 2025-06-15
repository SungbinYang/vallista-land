---
title: "[오브젝트] 객체지향 구현"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-13 20:22:27
series: 오브젝트 - 기초편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/eUUx4)를 바탕으로 쓰여진 글입니다.

## 객체 구현하기

지금까지 우리는 영화 예매 시스템을 CRC 카드를 통하여 설계를 진행하였다. 이제 이렇게 설계한 구조를 코드로 옮겨보는 시간을 가벼보자.

객체지향 설계 순서에 따르면 협력에 필요한 행동을 먼저 결정하고 행동에 적합한 객체를 나중에 선택한 후에 객체의 행동을 먼저 구현하고 행동에 필요한 데이터를 나중에 할당하는 식으로 설계를 진행하였다. 그럼 이 순서 그대로 sudo 코드를 통해 클래스를 설계 해보자.

먼저 상영을 구현하는 책임을 작성하면 아래와 같이 작성을 할 수 있을 것이다.

``` java
public class Screening {

  public Reservation reserve(Customer customer, int audienceCount) {

  }
}
```

위의 코드처럼 상영을 예매한다는 책임을 맡을 `Sceening` 클래스와 예약이라는 행동을 메서드로 정의를 하였다. 이제 예약을 진행하려면 가격을 계산해야 한다. 가격 계산은 정보 전문가와 높은 응집도 측면에서 `Screening`이 책임을 맡는게 옳지 않다. 그 책임은 이전 시간에 알아 본 것처럼 영화 객체에게 책임을 물어서 객체간 협력을 하는게 좋을 것이다.

``` java
public class Screening {

  private Movie movie;

  public Reservation reserve(Customer customer, int audienceCount) {
    Money fee = movie.calculateFee(this).times(audienceCount);
    return new Reservation(customer, this, audienceCount, fee);
  }
}
```

위와 같이 영화 객체와 협력을 통해 예약 메서드 구현을 하였다. 그리고 해당 메서드를 구현함에 있어서 `Movie`라는 데이터가 필요함으로 멤버 변수로 선언을 해주었다.

이제 영화 객체는 해당 `calculateFee` 메서드를 구현해야 할 것이다. 일단 시그니쳐부터 선언을 해보자.

``` java
public class Movie {

  public Money calculateFee(Screening screening) {

  }
}
```

가격을 계산한다는 책임을 `Movie` 클래스가 맡게 되었고 행동을 메서드로 정의를 하였다. 이제 가격을 계산하려면 할인 정책들을 이용하여 계산을 해야한다. 즉, 할인 계산을 해줘야 금액 계산을 `Movie` 클래스가 진행을 할 것이다. 그래서 이를 위해 `DiscountPolicy`와 협력을 진행해야 한다.

``` java
public class Movie {

  private Money fee;

  private DiscountPolicy discountPolicy;

  public Money calculateFee(Screening screening) {
    return fee.minus(discountPolicy.calculateDiscount(screening));
  }
}
```

`DiscountPolicy`는 이전 시간에 살펴본 것처럼 여러 할인 정책이 있을 수 있으므로 변경을 숨기기 위한 안정적인 추상화를 통해 `Movie` 객체가 구체적인 `DiscountPolicy` 구현체를 바라보는 것이 아닌 추상화 객체를 바라보게끔 설계를 했었다. 즉, 역할을 바라보게 한 것이다.

역할을 구현하는 방법은 여러가지가 있다. 만약, 구체 클래스가 1개밖에 없다면 구체 클래스로 역할을 구현하면 되지만 그게 아니라면 다른 방식을 이용해야 한다. 만약 구체 클래스가 여러개고 서로 공유해야 하는 공통 컨텍스트가 존재한다면 추상클래스로 역할을 설정하면 되고, 만약 공유할 만한 공통 컨텍스트가 없다면 인터페이스로 역할을 구현하면 된다. 현재, 할인 정책은 공유할 만한 컨텍스트가 존재한다. 할인 계산의 플로우 자체는 공통적이기 때문이다. 따라서 추상 클래스로 역할을 설정한다.

``` java
public abstract class DiscountPolicy {

  private List<DiscountCondition> conditions;

  public Money calculateDiscount(Screening screening) {
    for (DiscountCondition each : conditions) {
      if (each.isSatisfiedBy(screening)) {
        return getDiscountAmount(screening);
      }
    }

    return Money.ZERO;
  }

  protected abstract Money getDiscountAmount(Screening screening);
}
```

위의 코드를 보면 할인 조건을 루프를 돌면서 할인 여부를 판단하도록 `DiscountCondition`에 메세지를 전송한다. 그러면 자식 클래스 별, 할인 금액을 계산하는 방법이 다르므로 자식 클래스에게 메세지를 전송해서 계산을 위임시킨다. 또한 자식 클래스 별로 자신만의 할인 금액을 계산하는 로직이 다를 수 있으므로 해당 부분을 추상 메서드로 선언하여 자식 클래스가 재정의 할 수 있게 해두었다.

``` java
public class AmountDiscountPolicy extends DiscountPolicy {

  private Money discountAmount;

  @Override
  protected Money getDiscountAmount(Screening screening) {
    return discountAmount;
  }
}
```

``` java
public class PercentDiscountPolicy extends DiscountPolicy {

  private double percent;

  @Override
  protected Money getDiscountAmount(Screening screening) {
    return screening.getFixedFee().times(percent);
  }
}
```

금액 할인 정책은 할인 되는 금액이 고정이므로 그냥 할인 금액만 반환해주면 되지만 비율 할인 정책은 원래 영화 가격에서 percent를 곱해서 계산해야 한다. 그래서 이 경우에 `Screening` 객체와 협력이 필요하다.

``` java
public class Screening {

  private Movie movie;

  public Money getFixedFee() {
    return movie.getFee();
  }

  public Reservation reserve(Customer customer, int audienceCount) {
    Money fee = movie.calculateFee(this).times(audienceCount);
    return new Reservation(customer, this, audienceCount, fee);
  }
}
```

``` java
public class Movie {

  private Money fee;

  private DiscountPolicy discountPolicy;

  public Money getFee() {
    return fee;
  }

  public Money calculateFee(Screening screening) {
    return fee.minus(discountPolicy.calculateDiscount(screening));
  }
}
```

바로 위와 같이 코드를 작성하는게 객체 간 협력을 이용한 것이다. 여기서 이전에 우리가 절차지향적으로 작성한 `Movie` 클래스와 지금의 `Movie` 클래스를 비교하면 확연한 차이가 보인다. 절차지향적으로 작성한 클래스는 사용되는 문맥을 모르는 상태에서 추측에 기반하여 getter/setter를 다 추가해주었다. 하지만 객체지향적인 코드를 보면 꼭 필요한 경우에만 추가해주는 것이다.

이제 할인 정책은 할인 금액을 계산하는데 있어서 할인 조건을 알아야 할 것이다. 즉, 조건에 맞는지 여부를 할인 조건 객체에게 책임을 할당시키는 것이다. 할인 조건은 여러 조건들이 있을 수 있으므로 다형성을 이용하여 역할을 정의해야 한다. 그런데 할인 정책과 다르게 공유해야하는 공통 문맥이 없으므로 할인 조건의 역할은 인터페이스로 구현하면 될 것이다.

``` java
public interface DiscountCondition {
  boolean isSatisfiedBy(Screening screening);
}
```

``` java
public class SequenceDiscountCondition implements DiscountCondtion {

  private int sequence;

  @Override
  public boolean isSatisfiedBy(Screening screening) {
    return screening.isSequence(sequence);
  }
}
```

``` java
public class PeriodDiscountCondition implements DiscountCondtion {

  private DayOfWeek dayOfWeek;

  private LocalTime startTime, endTime;

  @Override
  public boolean isSatisfiedBy(Screening screening) {
    return screening.getStartTime().getDayOfWeek().equals(dayOfWeek) &&
     startTime.compareTo(screening.getStartTime().toLocalTime()) <= 0 &&
     endTime.compareTo(screening.getStartTime().toLocalTime()) >= 0;
  }
}
```

그리고 협력에 필요한 행동을 `Screening`에 기술한다.

``` java
public class Screening {

  private Movie movie;

  private int sequence;

  private LocalDateTime whenScreened;

  public Money getFixedFee() {
    return movie.getFee();
  }

  public Reservation reserve(Customer customer, int audienceCount) {
    Money fee = movie.calculateFee(this).times(audienceCount);
    return new Reservation(customer, this, audienceCount, fee);
  }

  public boolean isSequence(int sequence) {
    return this.sequence == sequence;
  }
}
```

이렇게 대략적인 코드를 작성해보니 우리가 처음 설계한 도메인 모델과 매우 유사하다는 것을 알 수 있다. 또한 중앙 제어식 스타일을 가진 절차 지향에 비하여 객체지향은 위임식/분산식 제어 스타일을 가진다.

## 예제. 객체 구현하기

전체적인 코드는 [강사님 저장소](https://github.com/eternity-oop/object-basic-05-01)를 참조하자.

## 메시지와 메서드의 분리

메세지와 메서드를 알기 위해서 이전에 할인 정책 객체와 할인 조건 도메인이 협력하는 상황을 생각해보자. 할인 정책 객체는 자신의 책임을 수행하기 위해서 자신이 처리 못하는 책임을 다른 객체에게 넘겨서 메세지를 전달한다. 즉, 메세지는 객체 사이의 의사소통 수단이며, 다른 객체에게 책임 수행을 요청하는 커뮤니케이션 수단이라고 할 수 있다. 그리고 이 메세지를 객체가 받아 메서드한테 전달해준다. 다형적 메세지더라도 메서드는 메세지를 수신한 타입 별로 책임을 수행한다.

메세지와 메서드를 분리하는 것은 다형성의 시작이라고 할 수 있다. 메세지와 메서드를 분리하는 행위는 우리가 코드를 유지보수하기 쉽게 만들어준다. 예를 들어, 하나의 클라이언트 객체가 어떤 객체와 협력을 진행해야 하는데 협력하는 두 객체는 메세지에 의존적이다. 그래서 그 메세지를 처리할 수 있는 객체라면 클라이언트 변경 없이 바꿀 수 있는 것이다. 이것을 보면 바로 우리는 다형성의 원리가 떠오를 것이다.

그래서 객체지향 설계에 있어서 "협력에 필요한 행동을 먼저 결정하고 행동에 적합한 객체를 나중에 선택"처럼 메세지를 먼저 결정 후 그 메세지를 처리할 객체를 나중에 선택하는 것이 유지보수가 좋은 코드가 되는 것이다. 즉, 할인 정책에서 할인 정책에 조건에 맞는지 여부의 메세지를 협력 객체에게 전달하면 그 객체는 협력에 참여할 수 있는 객체가 플러그인 되는 슬롯이 받으면 되는 것이다. 이것이 우리가 할인 조건을 인터페이스로 설계한 까닭이다. 그리고 여러 할인 조건을 해당 인터페이스라는 슬롯에 연결하는 것이다. 이로써 변경이 쉽고 확장이 가능한 설계가 된 것이다.

협력을 요청하는 객체는 메세지에만 의존하고 요청을 수신한 객체는 타입에 따라 적절한 메서드를 실행해주면 되는 것이다. 이렇게 런타임에 메세지를 처리할 적절한 클래스를 찾는 행위를 **동적 바인딩**이라고 한다.

## 유연하고 일관적인 협력

메세지와 메서드를 분리함으로 공통된 다형적 메세지를 전달하더라도 메세지를 수신하는 타입별로 책임을 수행할 수 있게 한다. 하지만 이렇게 메세지와 메서드를 분리하면서 생기는 문제들이 있다.

현재 힐인 정책은 컴파일 타임에 할인 조건 인터페이스를 참조한다. 즉, 할인 조건 인터페이스에만 의존하는 것이다. 하지만 실제 런타임에는 진짜 협력할 대상인 그 구현 객체들을 참조한다. 그래서 컴파일 타임과 런타임 의존성이 다르기 때문에 외부 객체에서 실제 객체를 생성하여 전달해야 한다. 이것을 바로 **의존성 주입**이라고 한다. 의존성 주입으로 인하여 새로운 할인 조건이 생기더라도 코드 수정 없이 타입이 확장 가능하다.

메세지와 메서드를 분리하고 의존성 주입으로 인하여 변경의 파급 효과를 제어할 수 있기 때문에 기존 코드를 수정하지 않은 채, 기능 확장이 가능해진다. 즉, 확장하고 예측 가능한 일관된 설계를 보장할 수 있는 장점을 가진다.

그럼 만약에 비할인 정책이 존재한다고 해보자. 그럼 영화 객체에서 의존성 주입을 받을 때 비할인 정책을 `null`로 설정할 수 있다. 하지만 이것은 좋지 못한 패턴이다. 왜냐하면 기존 로직에 `null` 체크를 계속 해야하기 때문이다. 이럴때는 `null object pattern`을 이용해 비할인 정책에 대한 구체 클래스를 만들면 된다. 이렇게 메세지 기반한 추상화가 확장 포인트를 정의한다.

## 예제. 유연하고 일관적인 협력

전체 코드는 [강사님 깃 저장소](https://github.com/eternity-oop/object-basic-05-03)를 참조바란다.

## 애플리케이션 객체 추가하기

우리가 흔히 **레이어드 아키텍쳐**라고 말한다면 아래와 같은 3개의 계층이 먼저 떠오를 것이다.

- 프리젠테이션 레이어: UI를 통해 사용자의 입력을 전달 받는 레이어
- 도메인 레이어: 도메인 로직을 수행하는 레이어
- 퍼시스턴스 레이어: DB에 접근하어 처리하는 레이어

우리가 지금까지 살펴본 것은 도메인 레이어 안에서 로직을 작성을 한 셈이다. 그런데 우리가 코드를 작성하다 보면 도메인 로직을 작성함에 기술 요소들이 필요할 때가 있다. 대표적인 것이 데이터 접근 객체인 **DAO**다. 도메인 객체가 직접 DB에 접근하지 않고 중간 객체인 DAO를 별도로 만들어서 DB에 접근하게끔 하는 것이다. 이 객체를 만드는 이유 중 하나는 바로 도메인이 DB에 대한 강한 의존성을 끊기 위해서이다.

그러면 우리가 예약을 생성함에 있어서 DAO를 이용하여 객체도 조회도 하고 저장도 할 수 있다. 그런데 하나 더 필요한 개념이 바로 **트랜잭션**이다. 바로 트랜잭션 관리도 일관성을 위해서 반드시 필요하다. 그러면 이런 트랜잭션 관리를 위해 우리는 어딘가 이 부분을 추가해줄 것이다. 만약 DAO가 없다면 도메인 레이어 객체한테 이 부분을 책임지게 할 것이다.

그리고 만약에 프리젠테이션 레이어가 도메인 레이어를 직접 참조한다면 어떻게 될까? 도메인 로직은 복잡할 수 있다. 그런데 프리젠테이션 레이어가 해당 부분을 참조하게 된다면 도메인 로직 복잡성이 사용자 인터페이스로 누수가 될 것이다. 즉, 여러 책임이 혼재될 것으로 보인다. ex. 사용자 입력, 출력, 트랜잭션 관리...

또한 콘솔용이나 http로 받는 `controller`에서 중복 문제가 발생할 수 있다. 이렇게 됨으로 코드는 읽기 힘들고 중복 코드로 복잡성이 증가할 것이다. 그래서 도메인 레이어를 보호할 필요성이 생긴다. 바로 프리젠테이션 레이어와 도메인 레이어 사이에 중간 객체를 만드는 것이다. 이 중간 객체는 사용자 인터페이스와 도메인 클래스 사이의 의존성을 제거해주는 역할을 한다. 이것이 바로 GRASP 패턴 중 **간접화 패턴**이다. 간접화 패턴은 직접적인 의존성을 피하기 위해 다른 컴포넌트나 서비스가 직접 의존하지 않도록 중재하는 중간 객체에게 책임을 할당하는 패턴이다. 그리고 이런 중간 객체를 어떤 도메인으로 만들까라는 문제에 애매하다는 생각을 할 것이다. 이런 문제로 인해 GRASP 패턴 중 **순수한 가공물** 패턴이 나오는 것이다. 이 패턴은 도메인 개념을 표현하지 않는 인위적으로 만든 클래스에 책임을 할당하고 이런 클래스는 높은 응집도, 낮은 결합도, 재사용을 지원하기 위해 만들어진 것이다.

즉, GRASP 패턴 중 **컨트롤러** 패턴으로 새로운 레이어를 만드는 것이다. 새로운 레이어의 중간 객체에게 유즈 케이스 플로우 처리를 맡기는 것이다. 예를 들어, 트랜잭션 관리 로직같은 것을 말이다. 이 중간 객체가 있는 레이어를 우리는 보통 서비스 레이어라고 부른다. 이런 레이어를 만들면 중복 로직이 서비스 레이어로 이동함으로 중복 코드를 줄일 수 있다.

## 예제. 애플리케이션 객체 추가하기

전체적인 코드는 [강사님 깃 저장소](https://github.com/eternity-oop/object-basic-05-04)를 확인 바란다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!