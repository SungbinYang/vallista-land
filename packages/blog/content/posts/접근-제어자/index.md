---
title: "[자바 기본] 접근 제어자"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-25 22:25:27
series: 자바 기본
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/PuC6W)를 바탕으로 쓰여진 글입니다.

## 접근 제어자 이해1

접근 제어자를 사용하면 해당 클래스 외부에서 특정 필드나 메서드에 접근하는 것을 허용하거나 제한할 수 있다. 그런데 왜 접근 제어자가 필요할까? 그 이유를 예제 코드를 통해 알아보자.

다음 예제는 자동차 클래스이다. 자동차는 스피드를 올릴 수 있고 스피드가 200이 넘어가면 폭발하니 폭발하지 않도록 구현해보자.

``` java
package access;

public class Car {
    int speed;

    public Car(int volume) {
        this.speed = speed;
    }

    public void speedUp() {
        if (speed >= 200) {
            System.out.println("속도를 증가할 수 없습니다. 최대속도 입니다.");
        } else {
            speed += 10;
            System.out.println("속도를 10 증가합니다.");
        }
    }

    public void speedDown() {
        speed -= 10;
        System.out.println("speedDown 호출");
    }

    public void showSpeed() {
        System.out.println("현재 음량: " + speed);
    }
}
```

이제 사용하는 클래스를 만들어보자.

``` java
package access;

public class Main {
    public static void main(String[] args) {
        Car car = new Car(190);
        car.showSpeed();

        car.speedUp();
        car.showVolume();

        car.speedUp();
        car.showSpeed();
    }
}
```

여기까지는 문제가 없다. 그런데 만약 다른 개발자가 와서 유지보수를 하다가 아래와 같이 실수를 할 수 있다.

``` java
package access;

public class Main {
    public static void main(String[] args) {
        Car car = new Car(190);
        car.showSpeed();

        car.speedUp();
        car.showVolume();

        car.speedUp();
        car.showSpeed();

        car.speed = 1000;
        car.showSpeed();
    }
}
```

이렇게 설계하고 결국 자동차는 폭발할 것이다. 이런 문제상황을 방지하고자 자바에서는 접근제어자를 제공하게 해준 것이다.

## 접근 제어자 이해2

그러면 접근 제어자를 이용하여 다른 클래스에서 직접 접근을 막아보자.

``` java
package access;

public class Car {
    private int speed;

    public Car(int volume) {
        this.speed = speed;
    }

    public void speedUp() {
        if (speed >= 200) {
            System.out.println("속도를 증가할 수 없습니다. 최대속도 입니다.");
        } else {
            speed += 10;
            System.out.println("속도를 10 증가합니다.");
        }
    }

    public void speedDown() {
        speed -= 10;
        System.out.println("speedDown 호출");
    }

    public void showSpeed() {
        System.out.println("현재 음량: " + speed);
    }
}
```

이렇게 `private`이라는 접근 제어자를 붙임으로서 외부의 접근을 차단하고 `speedUp()` 메서드 호출을 보장할 수 있다. 만약 이렇게 처리를 했는데도 직접 접근을 하면 자바는 컴파일 에러를 발생시킨다.

> ✅ 참고
>
> 좋은 프로그램은 무한한 자유도가 주어지는 프로그램이 아니라 적절한 제약을 제공하는 프로그램이다.

## 접근 제어자 종류

접근 제어자의 종류는 4가지가 존재한다.

- `private`: 모든 외부 호출을 막는다.
- `default`(package-private): 같은 패키지안에서 호출은 허용한다.
- `protected`: 같은 패키지안에서 호출은 허용한다. 패키지가 달라도 상속 관계의 호출은 허용한다.
- `public`: 모든 외부 호출을 허용한다.

순서대로 `private` 이 가장 많이 차단하고, `public` 이 가장 많이 허용한다.

> private < default < protected < public

### package-private

접근 제어자를 명시하지 않으면 자동으로 default(package-private) 제어자가 적용이 된다.

### 접근 제어자 사용 위치

접근 제어자의 사용 위치는 클래스, 메서드, 멤버 변수에 사용이 가능하다.

> ⚠️ 주의
>
> 지역 변수에는 접근 제어자를 사용할 수 없다. 그 이유는 변수의 스코프와 관련이 있는데 어처피 지역 변수는 해당 선언된 코드 블럭에서만 유효하기 때문에 따로 접근 제어자를 붙이는 의미가 없기 때문이다.

**접근 제어자의 핵심은 속성과 기능을 외부로부터 숨기는 것이다.**

- `private` 은 나의 클래스 안으로 속성과 기능을 숨길 때 사용, 외부 클래스에서 해당 기능을 호출할 수 없다.
- `default` 는 나의 패키지 안으로 속성과 기능을 숨길 때 사용, 외부 패키지에서 해당 기능을 호출할 수 없다.
- `protected` 는 상속 관계로 속성과 기능을 숨길 때 사용, 상속 관계가 아닌 곳에서 해당 기능을 호출할 수 없다.
- `public` 은 기능을 숨기지 않고 어디서든 호출할 수 있게 공개한다.

## 접근 제어자 사용 - 필드, 메서드

이제 예제 코드를 통해 접근 제어자를 사용한 필드와 메서드를 확인해보자.

``` java
package access.a;

public class Example {

    public int publicField;

    int defaultField;

    private int privateField;

    public void publicMethod() {
        System.out.println("publicMethod 호출 " + publicField);
    }

    void defaultMethod() {
        System.out.println("defaultMethod 호출 " + defaultField);
    }

    private void privateMethod() {
        System.out.println("privateMethod 호출 " + privateField);
    }

    public void innerAccess() {
        System.out.println("내부 호출");
        publicField = 100;
        defaultField = 200;
        privateField = 300;
        publicMethod();
        defaultMethod();
        privateMethod();
    }
}
```

이렇게 위의 코드가 작성되었다고 하자. 같은 클래스 내에서는 `private`, `default`, `public` 사용이 가능하다. 이제 이 클래스를 사용하는 코드를 보자.

``` java
package access.a;

public class Main {
    public static void main(String[] args) {
        AccessData data = new AccessData();

        data.publicField = 1;
        data.publicMethod();

        data.defaultField = 2;
        data.defaultMethod();

//        data.privateField = 3;
//        data.privateMethod();

        data.innerAccess();
    }
}
```

위의 코드는 AccessData와 같은 패키지에 있다. 따라서 `default`, `public` 메서드와 변수는 접근이 가능하자만 `private`은 접근이 불가능 하다.

그런데 만약 다른 패키지에서 AccessData 클래스를 사용하면 어떤 접근 제어자만 사용이 가능할까?

``` java
package access.b;

import access.a.AccessData;

public class Main {
    public static void main(String[] args) {
        AccessData data = new AccessData();

        data.publicField = 1;
        data.publicMethod();

//        data.defaultField = 2;
//        data.defaultMethod();

//        data.privateField = 3;
//        data.privateMethod();

        data.innerAccess();
    }
}
```

위의 코드를 보면 알다 싶이 `public`만 가능하다. 왜냐하면 `public`은 전부 공개지만 `default`는 같은 패키지에서만 공개이기 때문이다.

## 접근 제어자 사용 - 클래스 레벨

클래스 레벨의 접근 제어자는 `public`과 `default`만 가능하다. `private`과 `protected`는 불가능하다.

> 사실 내부 클래스를 사용한다면 모든 접근 제어자가 가능하다. 다만, 여기서는 아직 내부 클래스를 배우지 않았기에 클래스를 내부 클래스를 제외한 개념으로 보겠다.

또한 `public`클래스는 반드시 파일명과 이름이 같아야 한다. 또한 `public` 클래스는 하나의 자바 파일에 하나만 등장해야 한다. 그 외 클래스를 만들고 싶으면 `default` 접근 제어자를 이용해야 한다.

``` java
package access;

public class A {

}

class B {

}

class C {

}
```

위의 코드에서 A 클래스는 어디서든 접근이 가능하다. 하지만 B와 C는 같은 패키지에서만 접근이 가능하며 그 외는 접근이 불가능하다.

## 캡슐화

캡슐화라는 개념은 객체 지향 프로그래밍에서 매우 중요한 개념이다. 그리고 캡슐화의 핵심은 접근 제어자이다. 접근 제어자를 통해 외부의 직접적인 접근 자체를 제한하는 것이다. 이를 통해 외부에서 악의적이든 실수든 잘못된 데이터 변경을 방지할 수 있다.

쉽게 이야기하면 속성과 기능을 하나로 묶고 속성과 기능을 전부 감추는데 기능 중 꼭 필요한 기능이 있을 경우만 공개를 하는 것이다. 그러면 이것을 조금 풀어서 설명해보겠다.

### 데이터를 숨겨라

객체에는 속성(데이터)과 기능(메서드)이 있다. 캡슐화에서 가장 필수로 숨겨야 하는 것은 속성(데이터)이다. 예를 들어, 우리가 자동차를 운전하는데 엑셀을 밟아서 속도를 올리거나 브레이크를 밟아서 속도를 줄일 수 있는데 갑자기 외부에서 속도를 이상하게 올리면 엄청난 사고가 날 것이다. 이처럼 외부에 접근하지 못하게 데이터는 일단 무조건 숨기자! **객체의 데이터는 객체가 제공하는 기능인 메서드를 통해서 접근해야 한다.**

### 기능을 숨겨라

일단 객체에 기능도 다 숨겨라! 단, 외부에서 필요하다고 느껴지는 기능들이 있을 것이다. 그 기능들만 오픈하자! 자동차를 예를 들어서 가속하거나 저속하는 기능은 필요하다. 하지만 엔진이 동작하는 기능 자체는 우리가 운전하면서 몰라도 된다. 이런 기능은 숨기는게 좋다.

정리하면 데이터는 모두 숨기고, 기능은 꼭 필요한 기능만 노출하는 것이 좋은 캡슐화이다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!