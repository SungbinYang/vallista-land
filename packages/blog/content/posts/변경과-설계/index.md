---
title: "[오브젝트] 변경과 설계"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-14 13:44:27
series: 오브젝트 - 기초편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/eUUx4)를 바탕으로 쓰여진 글입니다.

## 변경과 설계

우리는 영황 예매 시스템을 설계하면서 절차지향적 관점에서의 설계와 객체지향적 관점에서의 설계 방식을 모두 알아 보았다. 절차지향적 설계는 데이터와 프로세스를 분리하여 설계를 진행했던 반면에 객체지향적 설계는 데이터와 프로세스를 하나의 모듈로 묶어서 설계를 진행하였다.

그럼 여기서 근본적인 질문을 한번 던져보겠다. 훌륭한 설계란 무엇일까? 훌륭한 설계란 응집도가 높고 결합도가 낮고 캡슐화를 지키도록 코드를 배치하는 설계 방식이 보통 훌륭한 설계라고 말한다. 그럼 이런 훌륭한 설계를 진행함에 있어서 **응집도**, **결합도**, **캡슐화**이 무엇인지 알고 해당 관점에서 살펴봐야 할 것이다.

### 응집도

응집도란, 모듈 내부 요소들 사이의 기능적인 부분에 집중을 나타내는 것을 의미한다. 즉, 모듈 내부에 데이터와 메서드 간에 관련된 정도를 뜻하는 것이다. 보통 하나의 기능에 집중된 모듈을 응집도가 높다라고 표현하며, 서로 다른 기능이 혼재된 모듈을 응집도가 낮다라고 표현한다. 즉, 훌륭한 설계를 진행하려면 응집도가 높은 설계를 진행해야 한다.

### 결합도

결합도란, 모듈이 외부의 다른 모듈에 의존하는 정도를 의미한다. 즉, 모듈이 다른 모듈에 대해 알고있는 지식의 양을 뜻하는 것이다. 하나의 모듈이 다른 모듈에 의존하는 정도가 높으면 결합도가 높다 혹은 강하다라고 표현하며, 의존하는 정도가 낮으면 결합도가 낮다 혹은 약하다라고 표현한다. 훌륭한 설계를 진행하려면 결합도가 낮은 설계를 진행해야 한다.

### 캡슐화

캡슐화란, 내부의 데이터와 메서드를 하나의 단위로 묶는 과정을 의미한다. 이렇게 하나의 단위로 묶으면서 외부로부터 데이터에 대한 직접적인 접근을 제한하며 공용 인터페이스를 통해서만 접근을 허용하는 것이다.

그러면 위의 응집도, 결합도, 캡슐화에 정의에 대해 살펴보았지만 이 정의만 딱 보고 코드 설계를 할 때 큰 도움이 될까? 물론 그러시는 독자분들도 있겠지만 필자 입장에서는 그리 크게 도움되지는 않는 것 같다. 즉, 뭔가 설계 가이드같은 것이 있으면 좋겠다는 생각이 든다. 하지만 실제 이런 가이드는 딱히 존재하지를 않는다.

우리는 프로그램을 개발하면서 변경하기 쉽게 코드를 배치하는 것을 훌륭한 설계라고 한다. `SOLID` 원칙과 같이 유명한 모든 설계 원칙 이론들은 변경과 관련이 있다. 디자인 패턴도 마찬가지다. 디자인 패턴을 학습할 때 어떤 변경을 감추기 위해 어떤 디자인 패턴을 적용하는가에 대해 알아가는 것이다. 즉, 위의 응집도, 결합도, 캡슐화도 변경과 관련이 있는 것이다.

그래서 가이드도 딱히 없는 이런 이론들을 우리가 우리만의 가이드를 만드듯이 절차지향적 설계와 객체지향적 설계를 위의 3가지 관점에서 살펴보면서 한번 비교해본다면 이것이 바로 가이드가 되지 않을까 싶다. 중요한 것은 모든 원칙들은 **변경**과 관련이 있다라는 것을 명심하자.

또한, 코드를 작성하면서 우리는 미리 변경을 예상해서는 안된다. 변경의 축은 변경이 실제로 일어날 때만 변경의 축인 것이다. 이것은 처음에는 코드가 변경되지 않을 것이라고 생각하고 작성을 한다. 그리고 변경이 일어나면 나중에 일어날 그런 종류의 변경에 대해 보호하는 추상화를 구현한다.

## 응집도

그럼 지금부터 변경 관점에서 응집도, 결합도, 캡슐화에 대해 살펴보자. 그럼 첫번째로 변경 관점에서 응집도를 살펴보자.

응집도의 전통적인 관점으로는 모듈 내부 요소들 사이의 기능적인 집중도를 의미한다. 즉, 모듈 내부의 데이터와 메서드 간에 관련된 정도를 의미한다. 이런 정도에 따라 응집도가 높다 혹은 낮다라고 표현하며 좋은 설계는 응집도가 높은 설계를 진행해야 한다.

그러면 영화 예매 시스템에서 절차적인 설계 방식의 응집도는 어떨까?

``` java
package me.sungbin.reservation.service;

import me.sungbin.generic.Money;
import me.sungbin.reservation.domain.*;
import me.sungbin.reservation.persistence.*;

import java.util.List;

public class ReservationService {

    private ScreeningDAO screeningDAO;

    private MovieDAO movieDAO;

    private DiscountPolicyDAO discountPolicyDAO;

    private DiscountConditionDAO discountConditionDAO;

    private ReservationDAO reservationDAO;

    public ReservationService(ScreeningDAO screeningDAO, MovieDAO movieDAO, DiscountPolicyDAO discountPolicyDAO,
                              DiscountConditionDAO discountConditionDAO, ReservationDAO reservationDAO) {
        this.screeningDAO = screeningDAO;
        this.movieDAO = movieDAO;
        this.discountConditionDAO = discountConditionDAO;
        this.discountPolicyDAO = discountPolicyDAO;
        this.reservationDAO = reservationDAO;
    }

    public Reservation reserveScreening(Long customerId, Long screeningId, Integer audienceCount) {
        Screening screening = screeningDAO.selectScreening(screeningId);
        Movie movie = movieDAO.selectMovie(screening.getMovieId());
        DiscountPolicy policy = discountPolicyDAO.selectDiscountPolicy(movie.getId());
        List<DiscountCondition> conditions = discountConditionDAO.selectDiscountConditions(policy.getId());
        DiscountCondition condition = findDiscountCondition(screening, conditions);
        Money fee;

        if (condition != null) {
            fee = movie.getFee().minus(calculateDiscount(policy, movie));
        } else {
            fee = movie.getFee();
        }

        Reservation reservation = makeReservation(customerId, screeningId, audienceCount, fee);
        reservationDAO.insert(reservation);

        return reservation;
    }

    private DiscountCondition findDiscountCondition(Screening screening, List<DiscountCondition> conditions) {
        for (DiscountCondition condition : conditions) {
            if (condition.isPeriodCondition()) {
                if (screening.isPlayedIn(condition.getDayOfWeek(),
                        condition.getStartTime(),
                        condition.getEndTime())) {
                    return condition;
                }
            } else {
                if (condition.getSequence().equals(screening.getSequence())) {
                    return condition;
                }
            }
        }

        return null;
    }

    private Money calculateDiscount(DiscountPolicy policy, Movie movie) {
        if (policy.isAmountPolicy()) {
            return policy.getAmount();
        } else if (policy.isPercentPolicy()) {
            return movie.getFee().times(policy.getPercent());
        }

        return Money.ZERO;
    }

    private Reservation makeReservation(Long customerId, Long screeningId, Integer audienceCount, Money fee) {
        return new Reservation(customerId, screeningId, audienceCount, fee.times(audienceCount));
    }
}
```

위의 코드를 보면 변경의 관점에서 할인 정책이 바뀔때도 변경이 필요하며 할인 조건이 변경될 때도 위의 코드에 변경이 필요하다. 즉, 응집도가 낮은 코드라고 볼 수 있다. 응집도가 높다라는 것은 모듈 전체가 동일한 이유로 변경이 되어야 하며, 응집도가 낮은 것은 위의 코드처럼 모듈 각 부분이 서로 다른 이유로 변경되는 것을 의미한다.

즉, 응집도는 변경의 이유가 동일해야 하며, 변경의 시점과 속도가 동일해야 한다. 높은 응집도는 모듈 전체가 동일한 시점에 동일한 속도로 변경되어야 하며 모듈 전체가 동일한 이유로 변경되어야 함을 의미한다.

하지만 객체지향적 설계 관점에서는 딱 하나의 이유로만 변경이 된다. 아래의 코드를 보면 할인 정책은 할인 정책 계산 플로우가 변경될때만 코드가 변경이 된다.

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

import java.util.List;

public abstract class DiscountPolicy {

    private Long id;

    private List<DiscountCondition> conditions;

    public DiscountPolicy(Long id, DiscountCondition ... conditions) {
        this.id = id;
        this.conditions = List.of(conditions);
    }

    public Money calculateDiscount(Screening screening) {
        for (DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }

        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screening screening);
}
```

이런 높은 응집도 관점을 `SOLID`원칙 중 SRP(단일 책임 원칙)에서 설명을 하고 있다. 그럼 여기서 가이드를 내려보겠다. 어떻게 해야 높은 응집도를 유지하면서 코드를 작성할 수 있을까?

- 클래스가 하나 이상의 이유로 변경된다면 응집도가 낮은 것이다.
  - 변경의 이유를 기준으로 클래스를 분리하자.
- 특정한 메서드 그룹이 특정한 속성 그룹만 사용한다면 응집도가 낮은 것이다.
  - 함께 사용되는 메서드와 속성 그룹을 기준으로 클래스를 분리하자.
- 클래스의 인스턴스를 초기화할 때 경우에 따라 서로 다른 속성들을 초기화한다면(ex. null) 응집도가 낮은 것이다.
  - 초기화되는 속성의 그룹을 기준으로 클래스를 분리하자.

## 결합도

다음으로 변경 관점에서 결합도를 살펴보자.

결합도의 전통적인 관점에서 바라보면 결합도는 모듈이 다른 외부의 다른 모듈에 의존하는 정도를 의미한다. 즉, 모듈에 대해 알고 있는 지식의 양을 뜻한다. 좋은 설계는 결합도가 낮은 설계를 뜻한다.

그러면 절차지향적 관점 코드에서 결합도가 낮은지 높은지 판단해보자.

``` java
package me.sungbin.reservation.service;

import me.sungbin.generic.Money;
import me.sungbin.reservation.domain.*;
import me.sungbin.reservation.persistence.*;

import java.util.List;

public class ReservationService {

    private ScreeningDAO screeningDAO;

    private MovieDAO movieDAO;

    private DiscountPolicyDAO discountPolicyDAO;

    private DiscountConditionDAO discountConditionDAO;

    private ReservationDAO reservationDAO;

    public ReservationService(ScreeningDAO screeningDAO, MovieDAO movieDAO, DiscountPolicyDAO discountPolicyDAO,
                              DiscountConditionDAO discountConditionDAO, ReservationDAO reservationDAO) {
        this.screeningDAO = screeningDAO;
        this.movieDAO = movieDAO;
        this.discountConditionDAO = discountConditionDAO;
        this.discountPolicyDAO = discountPolicyDAO;
        this.reservationDAO = reservationDAO;
    }

    public Reservation reserveScreening(Long customerId, Long screeningId, Integer audienceCount) {
        Screening screening = screeningDAO.selectScreening(screeningId);
        Movie movie = movieDAO.selectMovie(screening.getMovieId());
        DiscountPolicy policy = discountPolicyDAO.selectDiscountPolicy(movie.getId());
        List<DiscountCondition> conditions = discountConditionDAO.selectDiscountConditions(policy.getId());
        DiscountCondition condition = findDiscountCondition(screening, conditions);
        Money fee;

        if (condition != null) {
            fee = movie.getFee().minus(calculateDiscount(policy, movie));
        } else {
            fee = movie.getFee();
        }

        Reservation reservation = makeReservation(customerId, screeningId, audienceCount, fee);
        reservationDAO.insert(reservation);

        return reservation;
    }

    private DiscountCondition findDiscountCondition(Screening screening, List<DiscountCondition> conditions) {
        for (DiscountCondition condition : conditions) {
            if (condition.isPeriodCondition()) {
                if (screening.isPlayedIn(condition.getDayOfWeek(),
                        condition.getStartTime(),
                        condition.getEndTime())) {
                    return condition;
                }
            } else {
                if (condition.getSequence().equals(screening.getSequence())) {
                    return condition;
                }
            }
        }

        return null;
    }

    private Money calculateDiscount(DiscountPolicy policy, Movie movie) {
        if (policy.isAmountPolicy()) {
            return policy.getAmount();
        } else if (policy.isPercentPolicy()) {
            return movie.getFee().times(policy.getPercent());
        }

        return Money.ZERO;
    }

    private Reservation makeReservation(Long customerId, Long screeningId, Integer audienceCount, Money fee) {
        return new Reservation(customerId, screeningId, audienceCount, fee.times(audienceCount));
    }
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class DiscountPolicy {

    public enum PolicyType {
        PERCENT_POLICY,
        AMOUNT_POLICY
    }

    private Long id;

    private Long movieId;

    private PolicyType policyType;

    private Money amount;

    private Double percent;

    public DiscountPolicy() {
    }

    public DiscountPolicy(Long movieId, PolicyType policyType, Money amount, Double percent) {
        this(null, movieId, policyType, amount, percent);
    }

    public DiscountPolicy(Long id, Long movieId, PolicyType policyType, Money amount, Double percent) {
        this.id = id;
        this.movieId = movieId;
        this.policyType = policyType;
        this.amount = amount;
        this.percent = percent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public boolean isAmountPolicy() {
        return PolicyType.AMOUNT_POLICY.equals(policyType);
    }

    public boolean isPercentPolicy() {
        return PolicyType.PERCENT_POLICY.equals(policyType);
    }

    public PolicyType getPolicyType() {
        return policyType;
    }

    public void setPolicyType(PolicyType policyType) {
        this.policyType = policyType;
    }

    public Money getAmount() {
        return amount;
    }

    public void setAmount(Money amount) {
        this.amount = amount;
    }

    public Double getPercent() {
        return percent;
    }

    public void setPercent(Double percent) {
        this.percent = percent;
    }
}
```

위의 두 코드 `ReservationService`와 `DiscountPolicy`가 결합도가 높은지 낮은지 판단해보자. `ReservationService`는 `DiscountPolicy`를 의존하고 있다. 클래스 이름을 의존하고 있으며, 메서드 시그니쳐도 의존하고 있다. 그러면 결합도가 높을까? 낮을까?

이를 판단하기 위해 객체지향적 설계 코드도 같이 살펴보자.

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class Movie {

    private Long id;
    private String title;
    private Money fee;
    private DiscountPolicy discountPolicy;

    public Movie(Long id, String title, Money fee, DiscountPolicy discountPolicy) {
        this.id = id;
        this.title = title;
        this.fee = fee;
        this.discountPolicy = discountPolicy;
    }

    public Movie(String title, Money fee, DiscountPolicy discountPolicy) {
        this(null, title, fee, discountPolicy);
    }

    public Long getId() {
        return id;
    }

    public Money calculateFee(Screening screening) {
        return fee.minus(discountPolicy.calculateDiscount(screening));
    }

    public Money getFee() {
        return fee;
    }

    public String getTitle() {
        return title;
    }
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

import java.util.List;

public abstract class DiscountPolicy {

    private Long id;

    private List<DiscountCondition> conditions;

    public DiscountPolicy(Long id, DiscountCondition ... conditions) {
        this.id = id;
        this.conditions = List.of(conditions);
    }

    public Money calculateDiscount(Screening screening) {
        for (DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }

        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screening screening);
}
```

위의 2개의 `Movie`와 `DiscountPolicy`를 살펴보면 `Movie`는 `DiscountPolicy`를 의존한다. 일단 클래스 이름도 의존하고 있으며, 메서드 시그니쳐도 의존하고 있다. 그럼 위의 코드는 결합도가 높을까? 낮을까?

결합도가 높은지 낮은지를 보려면 클래스 이름이나 메서드 시그니쳐로만 판단하지 말고 변경의 관점에서도 확인을 해야 한다. 즉, 외부의 다른 모듈에 변경이 발생했을 때 해당 모듈에 의존하고 있는 모듈이 변경이 어느정도가 되는지에 따라 판단해야 한다. 높은 결합도를 가진다면 외부의 모듈이 변경될 때 함께 변경되는 빈도가 상대적으로 높을 것이며 낮은 결합도를 가진다면 외부의 모듈이 변경될 때 함께 변경되는 빈도가 상대적으로 적은 것을 의미할 것이다.

결합도를 낮추는 것은 함께 변경될 가능성을 낮추는 행위를 뜻한다. 그리고 해당 의존성을 제어하는 방식으로 구체적인 부분에 의존하는 것이 아닌 추상적인 부분에 의존하는 것을 뜻한다. 여기서 나오는 원칙이 하나 존재하는데 바로 **의존성 제어의 원칙**이다. 의존성 제어의 원칙은 자주 변하는 구체 부분과 자주 변하지 않는 추상화 부분을 나누는 것을 뜻한다. 그리고 의존성의 방향을 자주 변하지 않는 추상화에 의존시키는 방식을 의미한다. 즉, 추상화에 의존했을 때 결합도를 낮출 수 있다.

즉, 결합도를 낮추는 설계를 하려면 먼저 추상화 부분과 구체 부분을 나눈 후 추상화에 의존시키도록 하는 것이다. 그렇게 하면 구체부분이 변경될 때 추상화 부분의 변경이 일어나는 부수효과를 막을 수 있기 때문이다. 그리고 협력이라는 측면에서 추상화는 인터페이스를 의미하게 된다. 또한 구체 부분을 구현이라고 의미하게 된다. 여기서 나오는 원칙이 존재하게 된다. 바로 **인터페이스와 구현의 분리 원칙**이다. 인터페이스와 구현의 분리 원칙은 구현이 아닌 인터페이스에 대해 프로그래밍하라는 원칙이다.

그럼 코드를 비교해보면서 해당 원칙을 이해해보자. 절차지향적 코드를 다시한번 살펴보자.

``` java
package me.sungbin.reservation.service;

import me.sungbin.generic.Money;
import me.sungbin.reservation.domain.*;
import me.sungbin.reservation.persistence.*;

import java.util.List;

public class ReservationService {

    private ScreeningDAO screeningDAO;

    private MovieDAO movieDAO;

    private DiscountPolicyDAO discountPolicyDAO;

    private DiscountConditionDAO discountConditionDAO;

    private ReservationDAO reservationDAO;

    public ReservationService(ScreeningDAO screeningDAO, MovieDAO movieDAO, DiscountPolicyDAO discountPolicyDAO,
                              DiscountConditionDAO discountConditionDAO, ReservationDAO reservationDAO) {
        this.screeningDAO = screeningDAO;
        this.movieDAO = movieDAO;
        this.discountConditionDAO = discountConditionDAO;
        this.discountPolicyDAO = discountPolicyDAO;
        this.reservationDAO = reservationDAO;
    }

    public Reservation reserveScreening(Long customerId, Long screeningId, Integer audienceCount) {
        Screening screening = screeningDAO.selectScreening(screeningId);
        Movie movie = movieDAO.selectMovie(screening.getMovieId());
        DiscountPolicy policy = discountPolicyDAO.selectDiscountPolicy(movie.getId());
        List<DiscountCondition> conditions = discountConditionDAO.selectDiscountConditions(policy.getId());
        DiscountCondition condition = findDiscountCondition(screening, conditions);
        Money fee;

        if (condition != null) {
            fee = movie.getFee().minus(calculateDiscount(policy, movie));
        } else {
            fee = movie.getFee();
        }

        Reservation reservation = makeReservation(customerId, screeningId, audienceCount, fee);
        reservationDAO.insert(reservation);

        return reservation;
    }

    private DiscountCondition findDiscountCondition(Screening screening, List<DiscountCondition> conditions) {
        for (DiscountCondition condition : conditions) {
            if (condition.isPeriodCondition()) {
                if (screening.isPlayedIn(condition.getDayOfWeek(),
                        condition.getStartTime(),
                        condition.getEndTime())) {
                    return condition;
                }
            } else {
                if (condition.getSequence().equals(screening.getSequence())) {
                    return condition;
                }
            }
        }

        return null;
    }

    private Money calculateDiscount(DiscountPolicy policy, Movie movie) {
        if (policy.isAmountPolicy()) {
            return policy.getAmount();
        } else if (policy.isPercentPolicy()) {
            return movie.getFee().times(policy.getPercent());
        }

        return Money.ZERO;
    }

    private Reservation makeReservation(Long customerId, Long screeningId, Integer audienceCount, Money fee) {
        return new Reservation(customerId, screeningId, audienceCount, fee.times(audienceCount));
    }
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class DiscountPolicy {

    public enum PolicyType {
        PERCENT_POLICY,
        AMOUNT_POLICY
    }

    private Long id;

    private Long movieId;

    private PolicyType policyType;

    private Money amount;

    private Double percent;

    public DiscountPolicy() {
    }

    public DiscountPolicy(Long movieId, PolicyType policyType, Money amount, Double percent) {
        this(null, movieId, policyType, amount, percent);
    }

    public DiscountPolicy(Long id, Long movieId, PolicyType policyType, Money amount, Double percent) {
        this.id = id;
        this.movieId = movieId;
        this.policyType = policyType;
        this.amount = amount;
        this.percent = percent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public boolean isAmountPolicy() {
        return PolicyType.AMOUNT_POLICY.equals(policyType);
    }

    public boolean isPercentPolicy() {
        return PolicyType.PERCENT_POLICY.equals(policyType);
    }

    public PolicyType getPolicyType() {
        return policyType;
    }

    public void setPolicyType(PolicyType policyType) {
        this.policyType = policyType;
    }

    public Money getAmount() {
        return amount;
    }

    public void setAmount(Money amount) {
        this.amount = amount;
    }

    public Double getPercent() {
        return percent;
    }

    public void setPercent(Double percent) {
        this.percent = percent;
    }
}
```

`calculateDiscount` 메서드는 `DiscountPolicy`의 `getter/setter`에 의존한다. 즉, `DiscountPolicy`의 `getter/setter`가 인터페이스가 되고 `DiscountPolicy`의 멤버 변수들이 구현부가 되는 것이다. 그럼 만약 구현부를 변경한다고 가정하자. 즉, 필드의 타입이나 멤버 변수 명을 변경하게 된다면 인터페이스가 대거 변경이 일어나고 `ReservationService`의 `calculateDiscount` 메서드의 변경도 발생하는 부수효과가 일어난다. 그럼 객체지향적인 설계 코드를 다시 살펴보자.

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class Movie {

    private Long id;
    private String title;
    private Money fee;
    private DiscountPolicy discountPolicy;

    public Movie(Long id, String title, Money fee, DiscountPolicy discountPolicy) {
        this.id = id;
        this.title = title;
        this.fee = fee;
        this.discountPolicy = discountPolicy;
    }

    public Movie(String title, Money fee, DiscountPolicy discountPolicy) {
        this(null, title, fee, discountPolicy);
    }

    public Long getId() {
        return id;
    }

    public Money calculateFee(Screening screening) {
        return fee.minus(discountPolicy.calculateDiscount(screening));
    }

    public Money getFee() {
        return fee;
    }

    public String getTitle() {
        return title;
    }
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

import java.util.List;

public abstract class DiscountPolicy {

    private Long id;

    private List<DiscountCondition> conditions;

    public DiscountPolicy(Long id, DiscountCondition ... conditions) {
        this.id = id;
        this.conditions = List.of(conditions);
    }

    public Money calculateDiscount(Screening screening) {
        for (DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }

        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screening screening);
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class PercentDiscountPolicy extends DiscountPolicy {

    private double percent;

    public PercentDiscountPolicy(Long id, double percent, DiscountCondition... conditions) {
        super(id, conditions);
        this.percent = percent;
    }

    public PercentDiscountPolicy(double percent, DiscountCondition... conditions) {
        this(null , percent, conditions);
    }

    @Override
    protected Money getDiscountAmount(Screening screening) {
        return screening.getFixedFee().times(percent);
    }
}
```

`Movie` 클래스의 `calculateFee` 메서드는 `DiscountPolicy`의 `calculateDiscount`의 메서드에 의존한다. 즉, `DiscountPolicy`의 `calculateDiscount` 메서드가 인터페이스가 된다. 그리고 그 안의 로직이 구현부가 되며 그 로직에서 사용하는 멤버변수가 다른 메서드들도 구현부가 된다. 그럼 만약 구현부를 변경해보자. 그래도 인터페이스의 변경이나 외부 `Movie` 클래스의 변경은 일어나지 않는다. 이것이 낮은 결합도를 가진다고 말할 수 있는 것이다. 심지어 `DiscountPolicy` 자식 클래스의 멤버 변수나 구현 로직을 변경해도 외부 `Movie`에 변경이 전혀 없다.

## 캡슐화

마지막으로 변경의 관점에서의 캡슐화를 살펴보도록 하겠다. 전통적 의미의 캡슐화란 내부의 데이터와 메서드를 하나의 묶음으로 만들고 외부로부터 데이터에 대한 직접적인 접근을 막으면서 공용 인터페이스로 접근을 허용하는 것을 의미한다. 절차지향적 설계로 작성한 `DiscountPolicy`를 살펴보자.

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class DiscountPolicy {

    public enum PolicyType {
        PERCENT_POLICY,
        AMOUNT_POLICY
    }

    private Long id;

    private Long movieId;

    private PolicyType policyType;

    private Money amount;

    private Double percent;

    public DiscountPolicy() {
    }

    public DiscountPolicy(Long movieId, PolicyType policyType, Money amount, Double percent) {
        this(null, movieId, policyType, amount, percent);
    }

    public DiscountPolicy(Long id, Long movieId, PolicyType policyType, Money amount, Double percent) {
        this.id = id;
        this.movieId = movieId;
        this.policyType = policyType;
        this.amount = amount;
        this.percent = percent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public boolean isAmountPolicy() {
        return PolicyType.AMOUNT_POLICY.equals(policyType);
    }

    public boolean isPercentPolicy() {
        return PolicyType.PERCENT_POLICY.equals(policyType);
    }

    public PolicyType getPolicyType() {
        return policyType;
    }

    public void setPolicyType(PolicyType policyType) {
        this.policyType = policyType;
    }

    public Money getAmount() {
        return amount;
    }

    public void setAmount(Money amount) {
        this.amount = amount;
    }

    public Double getPercent() {
        return percent;
    }

    public void setPercent(Double percent) {
        this.percent = percent;
    }
}
```

코드를 살펴보면 멤버 변수인 데이터와 `getter/setter`인 메서드로 분리되어 있고 데이터의 변경을 막을 수 있게 `private` 접근 제어자로 캡슐화를 진행하였다. 그럼 객체지향적 설계 코드를 살펴보자.

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

import java.util.List;

public abstract class DiscountPolicy {

    private Long id;

    private List<DiscountCondition> conditions;

    public DiscountPolicy(Long id, DiscountCondition ... conditions) {
        this.id = id;
        this.conditions = List.of(conditions);
    }

    public Money calculateDiscount(Screening screening) {
        for (DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }

        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screening screening);
}
```

``` java
package me.sungbin.reservation.domain;

import me.sungbin.generic.Money;

public class PercentDiscountPolicy extends DiscountPolicy {

    private double percent;

    public PercentDiscountPolicy(Long id, double percent, DiscountCondition... conditions) {
        super(id, conditions);
        this.percent = percent;
    }

    public PercentDiscountPolicy(double percent, DiscountCondition... conditions) {
        this(null , percent, conditions);
    }

    @Override
    protected Money getDiscountAmount(Screening screening) {
        return screening.getFixedFee().times(percent);
    }
}
```

객체지향적 설계 마찬가지로 데이터와 메서드를 분리하고 데이터를 `private` 접근 제어자를 두어 캡슐화를 진행했다. 그러면 절차적인 모듈과 객체지향 모듈 전부 같은 캡슐화인것일까?

이 의문을 해결하기 위해서 캡슐화를 변경의 관점에서 살펴봐야 한다. 캡슐화를 변경의 관점에서 본다면 변경되는 부분을 내부로 숨기는 추상화 기법이라고 말하며 변경될 수 있는 어떤 것이라도 감추는 것을 의미한다.

캡슐화는 낮은 결합도를 기반으로 작동한다. 인터페이스 뒤로 구현을 감춤으로써 변하는 부분을 캡슐화를 한 사실을 우리는 알고 있다. 이런 것을 우리는 타입 캡슐화라고 한다.

또 다른 캡슐화의 예로 데이터 캡슐화가 존재한다. 데이터를 숨기고 안정적인 공용 인터페이스를 둠으로써 외부에 공개하는 기법을 의미한다. 그렇다고 해당 기법이 절차지향적 코드의 캡슐화가 아니다. 절차지향적 코드는 캡슐화인척을 한 것이다. 왜냐하면 외부 클래스가 구체(`getter/setter`)에 의존하고 있기 때문이다. 즉, 데이터 캡슐화는 데이터의 변경을 외부에 감춰야 하는데 `setter`가 존재함으로써 감출 수 없는 상황인 것이다.

> 방금 살펴본 타입 캡슐화는 타입의 변경을 외부에 감춘 기법이라 한다.

타입 캡슐화는 즉, 구체에 의존하는 것이 아닌 추상화에 의존하는 기법을 의미하며 추상화를 이용하여 변경을 통제하는 기법을 의미한다. 또한 이런 타입 캡슐화를 진행하면 상위 모듈과 하위 모듈 모두 추상화에 의존하는 구조로 변경이 될 것이다. 이런 것을 바로 **의존성 역전의 원칙**이라고 불린다. 그리고 런타임에 구체화된 클래스로 대체가 될텐데 여기서 나오는 원칙이 **리스코프 치환 원칙**이다. 그리고 기존 코드 수정없이도 기능을 확장할 수 있는 구조가 되는데 이것을 **개방-폐쇄 원칙**이라고 불린다.

## 설계 평가하기

응집도, 결합도, 캡슐화 관점에서 설계를 평가 및 트레이드 오프하는 과정을 살펴보자.

먼저 응집도 관점에서 설계를 평가해보자.

영화 예매 시스템 초창기에는 금액 할인 정책이 1가지 밖에 없다고 가정해보자. 이럴 경우 `Movie` 클래스 안에 할인 정책 계산 플로우를 넣어도 무방했을 것이다. 그러면 아마 `Movie` 클래스 안에서는 할인 금액과 할인 조건 목록을 필드로 가지고 할인 여부를 판단하는 로직과 할인 금액을 계산하는 로직이 포함되어 있을 것이다.

그런데 서비스가 성장하면서 비율 할인 정책이 추가되었다고 해보자. 그러면 해당 `Movie` 클래스 안에 할인 정책의 종류와 조건문을 이용한 할인 정책의 타입에 따라 할인 금액을 계산하는 방법을 분기처리를 했을 것이다. 즉 해당 코드는 응집도 관점에서 매우 낮은 응집도를 가지고 있다.

그래서 응집도를 높여야 하는데 우리가 알아본 응집도를 높이기 위한 첫번째 방법으로는 **변경의 이유를 기준으로 클래스를 분리**하는 작업을 해야 한다. `Movie` 클래스에서는 영화 요금 계산 플로우가 변경될 때 코드가 변경되며 금액 할인 정책, 비율 할인 정책이 변경될 때 코드가 변경이 된다. 이런 변경을 분리하기 가장 쉬운 방법은 바로 **상속**이다. 변경의 이유에 따른 코드를 부모 클래스와 자식 클래스로 분리해야 한다. 그럼 금액 할인 정책 별 클래스를 만들고 공통 기능은 `Movie`에 둔 채로 `Movie`를 상속받으면 해결이 된다.

이제 결합도와 캡슐화 측명에서 설계를 평가해보자.

현재 부모 클래스인 `Movie`와 자식 클래스 모두 추상 메서드를 의존하고 있다. 이로 인하여 외부 클래스가 `Movie`를 의존할 때 추상적인 `Movie`만 의존하면 런타임에 자식 클래스로 변경이 가능한 구조가 되었다. 즉, 리스코프 치환 원칙에도 들어 맞는다. 또한 계속 상속을 통하여 다양한 타입을 추가할 수 있어서 개방-폐쇠 원칙에도 들어맞는다. 하지만 데이터 캡슐화에 어긎난다. 왜냐하면 상속받은 자식클래스는 부모 클래스의 `protected`로 명시한 멤버 변수를 참조하기에 해당 멤버 변수가 변경이 되면 자식 클래스도 변경이 발생하기 때문이다. 또한 `extends Movie`로 명시적으로 상속을 했기에 컴파일 타임에 강한 결합이 생긴다.

그리고 외부 클래스에서 해당 `Movie`를 의존성 주입을 할때 정책이 변경될때마다 새로운 인스턴스를 생성해야 하는 비용도 발생한다. 그래서 이런 문제를 우리는 상속이 아닌 합성으로 풀 수 있다. `DiscountPolicy`에 각 할인 정책 클래스들을 상속받게 하고 `Movie`가 `DiscountPolicy`를 바라보게 하는 것이다. 그러면 `Movie` 인스턴스를 유지하면서 할인 정책을 변경할 수 있을 것이다.

> 자세한 코드는 우리가 이제까지 실습한 코드이기에 생략한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!