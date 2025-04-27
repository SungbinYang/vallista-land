---
title: "[자바 기본] 다형성과 설계"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-27 14:53:27
series: 자바 기본
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/PuC6W)를 바탕으로 쓰여진 글입니다.

## 좋은 객체지향 프로그래밍이란?

### 객체 지향 특징

- 추상화
- 캡슐화
- 상속
- **다형성**

### 객체 지향 프로그래밍

객체 지향 프로그래밍은 컴퓨터 프로그래밍의 명령어의 목록으로 보는 시각에서 벗어나 여러개의 독립된 단위, 객체들의 모임으로 파악하고자 하는 것이다. 각각의 객체는 객체들끼리 서로의 메세지, 데이터를 주고 받고 해당 메세지와 데이터를 처리할 수 있다. 또한 객체 지향 프로그래밍을 진행하면서 느끼겠지만 프로그램 자체를 유연하고 변경에 용이하게 만들기 때문에 대규모 소프트웨어 개발에 도움이 된다.

> 여기서 유연하고 변경에 용이하다는 것은 레고블록 조립하듯이 쉽고 직관적이게 개발할 수 있다는 것이다. 유연하고 변경에 용이한 프로그램은 나중에 확장도 좋고 유지보수하기에도 용이하다.

### 다형성

객체 지향 프로그래밍은 크게 역할과 구현으로 세상을 표현한다. 

우리가 JDK만 생각해뵈도 그럴 것이다. 자바를 만든 회사에서 JDK는 이렇게 만들라고 표준문서를 제공한다. 그리고 각 회사들은 그 표준문서를 토대로 자신만의 기능들을 추가하여 사용자에게 JDK를 추가한다. 여기서 표준문서가 역할이고 각 구현된 JDK가 구현체이다.

또 하나의 비유로는 요즘 뜨는 K-패스를 떠오를 수 있을 것이다. 국가에서 교통비 환급을 위한 K-패스 제도를 도입하였다. 그리고 그 제도를 기반으로 각 카드사에서 자신들만의 혜택을 추가하여 사용자에게 제공한다. 여기서 K-패스 제도는 역할이고 각 카드들이 구현체인 것이다.

이렇게 세상을 역할과 구현으로 나누면 단순해지고 유연성과 변경에 용이하다. 또 그 외에 여러가지 장점들이 존재한다.

- 클라이언트는 대상의 역할만 알면 된다.
- 클라이언트는 구현 대상의 내부 구조를 몰라도 된다.
- 클라이언트는 구현 대상의 내부구조가 변경되어도 영향을 받지 않는다.
- 클라이언트는 구현 대상 자체를 변경해도 영향을 받지 않는다.

### 역할과 구현 분리

역할과 구현을 분리하는 자바에서는 다형성을 이용한다. 자바에서 역할은 인터페이스이고 구현은 인터페이스를 구현한 구현체이다. 이를 이용해 객체를 설계할 때 역할과 구현을 명확히 분리하는 것이 중요하다. 그래서 보통 실무에서 이런 다형성을 이용할 때 인터페이스부터 정의하여 역할을 수립하고 해당 역할을 이용하여 구현체를 만드는 것이다. 이렇게 하여 객체간에 협력도 진행이 되는 것이다. 마치 네트워크에서 클라이언트-서버 구조처럼 보인다.

### 다형성의 본질

- 인터페이스를 구현한 객체는 실행 시점에 유연하게 변경할 수 있다.
- 다형성의 본질을 알려면 협력이라는 객체간의 관계를 알아야 한다.
- 해당 본질을 알게되면 클라이언트는 변경하지 않고 서버의 구현 기능을 유연하게 변경 할 수 있다.

## 다형성 - 역할과 구현 예제1

이제 예제를 통해 역할과 구현을 나눠보도록 하겠다. 일단 처음에는 역할과 구현을 나누지 않고 작성해보고 점차 발전해보겠다. 예제는 K-패스로 해보겠다.

``` java
public class KpassKbankCard {
    public void use() {
        System.out.println("케이뱅크 카드 사용");
    }

    public void earn() {
        System.out.println("10% 적립");
    }
}
```

이렇게 K-패스 카드 종류인 케이뱅크 카드를 설계하였다. 이제 사용하는 사용자 객체를 만들어보자.

``` java
public class User {
    private KpassKbankCard kbankCard;

    public void setKbankCard(KpassKbankCard kbankCard) {
        this.kbankCard = kbankCard;
    }

    public void use() {
        System.out.println("카드 사용");
        kbankCard.use();
        kbankCard.earn();
    }
}
```

이제 main 메서드를 만들어보자.

``` java
public class Main {
    public static void main(String[] args) {
        User user = new User();
        KpassKbankCard kbankCard = new KpassKbankCard();

        user.setKbankCard(kbankCard);
        user.use();
    }
}
```

## 다형성 - 역할과 구현 예제2

이제 새로운 요구사항이 왔다. 사용자가 Kbank 카드를 사용하지 말고 현대카드로 변경하자는 것이다. 그러면 현대카드 객체를 만들어야 할 것이다.

``` java
public class KpassHyundaiCard {
    public void use() {
        System.out.println("현대 카드 사용");
    }

    public void earn() {
        System.out.println("11% 적립");
    }
}
```

그리고 User 클래스에 해당 현대 카드를 넣어주면 된다.

``` java
public class User {
    private KpassKbankCard kbankCard;

    private KpassHyundaiCard hyundaiCard;

    public void setKbankCard(KpassKbankCard kbankCard) {
        this.kbankCard = kbankCard;
    }

    public void setHyundaiCard(KpassHyundaiCard hyundaiCard) {
        this.hyundaiCard = hyundaiCard;
    }

    public void use() {
        System.out.println("카드 사용");
        
        if (kbankCard != null) {
            kbankCard.use();
            kbankCard.earn();
        } else if (hyundaiCard != null) {
            hyundaiCard.use();
            hyundaiCard.earn();
        }
    }
}
```

그리고 사용자 코드에 아래와 같이 작성해주면 된다.

``` java
public class Main {
    public static void main(String[] args) {
        User user = new User();
        KpassKbankCard kbankCard = new KpassKbankCard();
        KpassHyundaiCard hyundaiCard = new KpassHyundaiCard();

        user.setKbankCard(kbankCard);
        user.use();

        user.setKbankCard(null);
        user.setHyundaiCard(hyundaiCard);
        user.use();
    }
}
```

하지만 위의 코드에 문제가 있다. 카드가 계속 추가가 되면 코드의 변경범위가 너무 넓다. 이것을 역할과 구현으로 분리해서 해결해보자.

## 다형성 - 역할과 구현 예제3

다형성을 활용하면 역할과 구현을 분리해서, 클라이언트 코드의 변경 없이 구현 객체를 변경할 수 있다. 위의 코드를 보면 Card라는 객체를 만들어서 역할을 알게 할 수 있을 것 같다. 또한, 사용자는 해당 Card라는 역할만 알고 구현체는 몰라도 될 것이다. 위의 코드는 사용자는 지금 구현체까지 알고 있어서 문제가 된 것이다. 이것을 클라이언트가 구현체에 의존적이다라고 표현한다. 그러면 한번 변경해보자.

``` java
public interface Card {
    void use();

    void earn();
}
```

그리고 해당 역할을 구현체가 구현시키도록 해보자.

``` java
public class KpassKbankCard implements Card {

    @Override
    public void use() {
        System.out.println("케이뱅크 카드 사용");
    }

    @Override
    public void earn() {
        System.out.println("10% 적립");
    }
}
```

``` java
public class KpassHyundaiCard implements Card {

    @Override
    public void use() {
        System.out.println("현대 카드 사용");
    }

    @Override
    public void earn() {
        System.out.println("11% 적립");
    }
}
```

그리고 이제 클라이언트가 역할에만 의존시키도록 변경해보자.

``` java
public class User {
    private Card card;

    public void setCard(Card card) {
        this.card = card;
    }

    public void use() {
        System.out.println("카드 사용");
        
        card.use();
        card.earn();
    }
}
```

이제 사용하는 코드를 변경해보자. 아래와 같이 변경함으로 역할과 구현을 명확히 분리하고 새로운 카드가 추가되더라도 문제가 없을 것이다.

``` java
public class Main {
    public static void main(String[] args) {
        User user = new User();
        Card kbankCard = new KpassKbankCard();
        Card hyundaiCard = new KpassHyundaiCard();

        user.setCard(kbankCard);
        user.use();

        user.setCard(hyundaiCard);
        user.use();
    }
}
```

## OCP(Open-Closed Principle) 원칙

좋은 객체 지향 설계 원칙 중 하나로 OCP 원칙이라는 것이 있다.

- **Open for extension**: 새로운 기능의 추가나 변경 사항이 생겼을 때, 기존 코드는 확장할 수 있어야 한다.
- **Closed for modification**: 기존의 코드는 수정되지 않아야 한다.

즉, 쉽게 이야기해서 변경에는 열려있고 수정에는 닫혀있다라는 것이다. 뭔가 말이 모순적이다. 하지만 우리는 OCP 원칙을 지켜서 코드를 작성해 본 경험이 있다. 바로 위에 K-패스 카드 예제로 말이다. 즉, 새로운 카드가 아무리 추가가 되어라도 User클래스는 변동이 없다. 이런 것이 변경에 용이하다라는 표현인 것 같다.

> ✅ 참고: 전략패턴이란?
>
> 디자인 패턴 중에 가장 중요한 패턴을 하나 뽑으라고 하면 전략 패턴을 뽑을 수 있다. 전략 패턴은 알고리즘을 클라이언트 코드의 변경 없이 쉽게 교체할 수 있다. 방금 설명한 코드가 바로 전략 패턴을 사용한 코드이다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!