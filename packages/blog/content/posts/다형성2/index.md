---
title: "[자바 기본] 다형성2"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-04-26 21:36:27
series: 자바 기본
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/PuC6W)를 바탕으로 쓰여진 글입니다.

## 다형성 활용1

이제 다형성이 어떻게 활용되는지 예제를 발전하면서 알아보자.

``` java
package poly.ex1;

public class Dog {

    public void sound() {
        System.out.println("멍멍");
    }
}
```

``` java
package poly.ex1;

public class Cat {

    public void sound() {
        System.out.println("야옹");
    }
}
```

``` java
package poly.ex1;

public class Cow {

    public void sound() {
        System.out.println("음매");
    }
}
```

이렇게 서로 다른 타입의 동물 클래스들을 개발했다. 이제 이를 사용하는 코드를 확인해보자.

``` java
package poly.ex1;

public class AnimalSoundMain {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Cat cat = new Cat();
        Cow cow = new Cow();

        System.out.println("동물 소리 테스트 시작");
        dog.sound();
        System.out.println("동물 소리 테스트 종료");

        System.out.println("동물 소리 테스트 시작");
        cat.sound();
        System.out.println("동물 소리 테스트 종료");

        System.out.println("동물 소리 테스트 시작");
        cow.sound();
        System.out.println("동물 소리 테스트 종료");
    }
}
```

이렇게 동물들의 소리를 출력하는 코드가 완성이 되었다. 하지만 여러분은 이제는 알 것이다. 꽤나 좋지 못한 코드이다. 왜냐하면 동물들이 추가될 때마다 반복적으로 보이는 출력문 코드를 추가해줘야 하기 때문이다.

### 중복 제거 시도

#### 메서드 추출

그러면 이런 중복적인 코드를 어떻게 제거할까? 바로 떠오르는 것이 메서드로 분리하자는 생각이 든다. 하지만 그렇게 할 수가 없다. 왜냐하면 각각 동물 클래스들은 서로 다른 타입이기 때문에 공통된 타입이 없어서 하나의 메서드로는 추출이 불가능하다. 굳이 만든다면 동물별로 메서드를 만들어야 하는데 기존과 크게 달라진게 없다.

#### 반복문, 배열

그러면 반복문과 배열을 이용해서 중복을 제거할 수 있는듯 보인다. 하지만 이것도 해결책이 되지 못한다. 왜냐하면 이것 또한 공통된 타입의 배열에 동물들 객체를 담아야 하는데 공통된 타입이 없기 때문이다.

이런 문제를 우리는 다형적 참조와 메서드 오버라이딩으로 해결할 수 있다.

## 다형성 활용2

그러면 한번 다형적 참조와 메서드 오버라이딩을 이용하여 코드를 변경해보자. 그러기 위해서는 공통타입을 먼저 만들어야 할 것 같다.

``` java
package poly.ex2;

public class Animal {

    public void sound() {
        System.out.println("동물 울음 소리");
    }
}
```

위와 같이 공통 부모 클래스로 동물 클래스를 만들었다. 이제 이 동물 클래스를 상속시키자.

``` java
package poly.ex2;

public class Dog extends Animal {

    @Override
    public void sound() {
        System.out.println("멍멍");
    }
}
```

``` java
package poly.ex2;

public class Cat extends Animal {

    @Override
    public void sound() {
        System.out.println("야옹");
    }
}
```

``` java
package poly.ex2;

public class Cow extends Animal {

    @Override
    public void sound() {
        System.out.println("음매");
    }
}
```

이제 이것을 사용하는 main 메서드를 개발해보자. 메서드 추출을 사용하여 기존보다 더 단순하게 만들 수 있을 것이다.

``` java
package poly.ex2;

public class AnimalSoundMain1 {
    public static void main(String[] args) {
        Dog dog = new Dog();
        Cat cat = new Cat();
        Cow cow = new Cow();

        soundAnimal(dog);
        soundAnimal(cat);
        soundAnimal(cow);
    }

    private static void soundAnimal(Animal animal) {
        System.out.println("동물 소리 테스트 시작");
        animal.sound();
        System.out.println("동물 소리 테스트 종료");
    }
}
```

이렇게 다형적 참조와 메서드 오버라이딩덕에 코드가 단순해졌다.

## 다형성 활용3



> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!