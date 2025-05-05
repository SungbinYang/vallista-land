---
title: "[자바 중급2] 제네릭2"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-05 17:09:27
series: 자바 중급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/xexJb)를 바탕으로 쓰여진 글입니다.

## 타입 매개변수 제한1 - 시작

이제는 이전 포스팅에 이어서 탈것을 수리하는 센터를 만들어본다고 하자. 처음 요구사항은 자동차는 자동차 센터에 오토바이는 오토바이 센터에 맡겨야 한다고 해보자.

``` java
public class CarServiceCenter {

    private Car vehicle;

    public void set(Car vehicle) {
        this.vehicle = vehicle;
    }

    public void maintenance() {
        System.out.println("차량 이름: " + vehicle.getName());
        System.out.println("차량 속도: " + vehicle.getSpeed());
        vehicle.engineSound();
    }

    public Car faster(Car target) {
        return vehicle.getSpeed() > target.getSpeed() ? vehicle : target;
    }
}
```

``` java
public class MotorcycleServiceCenter {

    private Motorcycle vehicle;

    public void set(Motorcycle vehicle) {
        this.vehicle = vehicle;
    }

    public void maintenance() {
        System.out.println("차량 이름: " + vehicle.getName());
        System.out.println("차량 속도: " + vehicle.getSpeed());
        vehicle.engineSound();
    }

    public Motorcycle faster(Motorcycle target) {
        return vehicle.getSpeed() > target.getSpeed() ? vehicle : target;
    }
}
```

이제 이를 사용하는 `main()` 메서드를 작성해보자.

``` java
public class VehicleServiceCenterMainV0 {
    public static void main(String[] args) {
        CarServiceCenter carServiceCenter = new CarServiceCenter();
        MotorcycleServiceCenter motorcycleServiceCenter = new MotorcycleServiceCenter();

        Car car = new Car("자동차1", 100);
        Motorcycle motorcycle = new Motorcycle("오토바이1", 300);

        carServiceCenter.set(car);
        carServiceCenter.maintenance();

        motorcycleServiceCenter.set(motorcycle);
        motorcycleServiceCenter.maintenance();

        carServiceCenter.set(car);

        Car fasterCar = carServiceCenter.faster(new Car("자동차2", 200));
        System.out.println("fasterCar = " + fasterCar);
    }
}
```

요구사항대로 자동차 센터는 자동차만 입고가 가능하고 오토바이 센터는 오토바이만 입고가 가능하다. 타입 안전성이 뛰어난 것이다. 하지만 문제점은 코드 재사용성이 뛰어나지 않다. 예를들어, 비행기를 입고시키고 싶을 때는 비행기 센터를 만들어야 하는 것이 문제이다. 또한, 오토바이 센터의 입고량이 꽉 차서 자동차 센터에게 맡기고 싶지만 지금은 그럴 수 없다. 이런 문제를 다형성을 이용하여 해결해보자.

## 타입 매개변수 제한2 - 다형성 시도

`Car`와 `Motorcycle`은 `Vechicle`라는 부모 클래스를 상속받으니 다형성을 이용하여 위의 문제를 해결할 수 있을 것 같다.

``` java
public class VehicleServiceCenterV1 {

    private Vehicle vehicle;

    public void set(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public void maintenance() {
        System.out.println("차량 이름: " + vehicle.getName());
        System.out.println("차량 속도: " + vehicle.getSpeed());
        vehicle.engineSound();
    }

    public Vehicle faster(Vehicle target) {
        return vehicle.getSpeed() > target.getSpeed() ? vehicle : target;
    }
}
```

탈것 서비스 센터를 만들었고 필드로 부모 클래스 타입으로 두었다. 이제 이 클래스를 이용하여 `main()` 메서드를 작성해보자.

``` java
public class VehicleServiceCenterMainV1 {
    public static void main(String[] args) {
        VehicleServiceCenterV1 carServiceCenter = new VehicleServiceCenterV1();
        VehicleServiceCenterV1 motorcycleServiceCenter = new VehicleServiceCenterV1();

        Car car = new Car("자동차1", 100);
        Motorcycle motorcycle = new Motorcycle("오토바이1", 300);

        carServiceCenter.set(car);
        carServiceCenter.maintenance();

        motorcycleServiceCenter.set(motorcycle);
        motorcycleServiceCenter.maintenance();

        carServiceCenter.set(motorcycle); // 문제 발생x
        carServiceCenter.set(car);

        Car fasterCar = (Car) carServiceCenter.faster(new Car("자동차2", 200)); // 다운 캐스팅 필요
        System.out.println("fasterCar = " + fasterCar);
    }
}
```

이제 만약 자동차 센터가 꽉 차서 자동차 입고를 오토바이 센터에서 입고 시킬 수 있게 가능해졌다. 즉, 코드 재사용성이 좋아졌다. 하지만 또 하나 문제가 발생하였다. 바로 타입 안전성이 뛰어나지 못한 것이다. `faster()`라는 메서드를 호출하는 것은 부모 클래스 메서드를 호출하니 자식 타입으로 받고 싶다면 강제적으로 다운 캐스팅을 해줘야 한다.

## 타입 매개변수 제한3 - 제네릭 도입과 실패

그러면 앞서 배운 제네릭을 도입하여 위의 문제들을 해결해보자.

``` java
public class VehicleServiceCenterV2<T> {

    private T vehicle;

    public void set(T vehicle) {
        this.vehicle = vehicle;
    }

    public void maintenance() {
        System.out.println("차량 이름: " + vehicle.getName()); // 컴파일 에러
        System.out.println("차량 속도: " + vehicle.getSpeed()); // 컴파일 에러
        vehicle.engineSound(); // 컴파일 에러
    }

    public T faster(T target) {
        return vehicle.getSpeed() > target.getSpeed() ? vehicle : target; // 컴파일 에러
    }
}
```

위와 같이 변경하니 엄청난 컴파일 에러들을 많이 보게 되었다. 왜 그럴까? 제네릭 타입을 선언하면 자바 컴파일러 입장에서 `T` 에 어떤 값이 들어올지 예측할 수 없다. 즉, `Vehicle`의 자식들이 들어올 수 있지만 `Integer`, `String`과 같은 클래스들도 들어올 수 있는 것이다. 그래서 자바는 이런 문제때문에 제네릭 타입에서는 `Object` 클래스 메서드 밖에 쓸 수 없게 막아두었다. 따라서 해당 경우 타입 매개변수를 어떤 타입이든 수용할 수 있는 `Object`로 가정하고, `Object` 의 기능만 사용할 수 있다. 이것은 우리가 원하는 바가 아니다. 즉, 타입 인자값에 `Vehicle`과 관련된 클래스만 들어오게 제한을 해야할 것이다.

## 타입 매개변수 제한4 - 타입 매개변수 제한

제네릭의 추가기능으로 타입 매개변수를 특정 타입으로 제한할 수 있다. 코드를 통해 살펴보자.

``` java
public class VehicleServiceCenterV2<T extends Vehicle> {

    private T vehicle;

    public void set(T vehicle) {
        this.vehicle = vehicle;
    }

    public void maintenance() {
        System.out.println("차량 이름: " + vehicle.getName()); 
        System.out.println("차량 속도: " + vehicle.getSpeed()); 
        vehicle.engineSound();
    }

    public T faster(T target) {
        return vehicle.getSpeed() > target.getSpeed() ? vehicle : target;
    }
}
```

이렇게 작성하면 타입 매개변수 `T` 를 `Vehicle` 과 그 자식만 받을 수 있도록 제한을 두는 것이다. 즉 `T` 의 상한이 `Vehicle` 이 되는 것이
다. 그러면 위의 문제상황들을 해결할 수 있다. 위의 문제 상황에서는 **자동차 센터가 꽉 찼을 때 오토바이 센터로 자동차를 맡길수 있어야 한다**는데 이것은 잘못된 요구사항이였다. 왜냐하면 자동차는 자동차 센터에서만 처리가 가능한게 상식적으로 맞기 때문이다. 두번째 **타입 캐스팅 문제**도 해결이 가능하다.

``` java
public class VehicleServiceCenterMainV3 {
    public static void main(String[] args) {
        VehicleServiceCenterV3<Car> carServiceCenter = new VehicleServiceCenterV3<>();
        VehicleServiceCenterV3<Motorcycle> motorcycleServiceCenter = new VehicleServiceCenterV3<>();

        Car car = new Car("자동차1", 100);
        Motorcycle motorcycle = new Motorcycle("오토바이1", 300);

        carServiceCenter.set(car);
        carServiceCenter.maintenance();

        motorcycleServiceCenter.set(motorcycle);
        motorcycleServiceCenter.maintenance();

        // carServiceCenter.set(motorcycle); // 문제 발생!!
        carServiceCenter.set(car);

        Car fasterCar = carServiceCenter.faster(new Car("자동차2", 200));
        System.out.println("fasterCar = " + fasterCar);
    }
}
```

제네릭에 **타입 매개변수 상한**을 사용해서 타입 안전성을 지키면서 상위 타입의 원하는 기능까지 사용할 수 있었다. 덕분에 코드 재사용과 타입 안전성이라는 두 마리 토끼를 동시에 잡을 수 있었다.

## 제네릭 메서드

이번에는 특정 메서드에 제네릭을 적용하는 제네릭 메서드에 대해 알아보자. 참고로 앞서 살펴본 제네릭 타입과 지금부터 살펴볼 제네릭 메서드는 둘다 제네릭을 사용하기는 하지만 서로 다른 기능을 제공한다.

``` java
package generic.ex4;

public class GenericMethod {

    public static Object objMethod(Object obj) {
        System.out.println("object print: " + obj);
        return obj;
    }

    public static <T> T genericMethod(T t) {
        System.out.println("generic print: " + t);
        return t;
    }

    public static <T extends Number> T numberMethod(T t) {
        System.out.println("bound print: " + t);
        return t;
    }
}
```

``` java
package generic.ex4;

public class MethodMain1 {
    public static void main(String[] args) {
        Integer i = 10;
        Object object = GenericMethod.objMethod(i);

        System.out.println("명시적 타입 인자 전달");
        Integer result = GenericMethod.<Integer>genericMethod(i);
        Integer integerValue = GenericMethod.<Integer>numberMethod(10);
        Double doubleValue = GenericMethod.<Double>numberMethod(20.0);

        System.out.println("타입 추론");
        Integer result2 = GenericMethod.genericMethod(i);
        Integer integerValue2 = GenericMethod.numberMethod(10);
        Double doubleValue2 = GenericMethod.genericMethod(20.0);
    }
}
```

클래스에 제네릭 타입을 정의할 수 있지만 때로는 메서드에 특정 지어서 제네릭 타입을 정의할 수 있다. 제네릭 메서드를 정의하는 방법은 위의 코드를 보면 알겠지만 `<T> T genericMethod(T t)`와 같이 정의하면 된다. 그러면 타입 인자는 메서드를 호출하는 시점에 전달되어 작동이 된다. 물론 제네릭 메서드도 `<T extends Number> T numberMethod(T t)`와 같이 타입 상한이 가능하다.

그러면 제네릭 메서드는 언제 사용될까?

- 제네릭 메서드는 클래스 전체가 아니라 특정 메서드 단위로 제네릭을 도입할 때 사용한다.
- 제네릭 메서드를 정의할 때는 메서드의 반환 타입 왼쪽에 다이아몬드를 사용해서 `<T>` 와 같이 타입 매개변수를 적어준다.
- 제네릭 메서드는 메서드를 실제 호출하는 시점에 다이아몬드를 사용해서 `<Integer>` 와 같이 타입을 정하고 호출한다.

### 인스턴스 메서드, static 메서드

제네릭 메서드는 인스턴스 메서드와 static 메서드에 모두 적용할 수 있다.

``` java
class Box<T> { //제네릭 타입
    static <V> V staticMethod2(V t) {} //static 메서드에 제네릭 메서드 도입
    <Z> Z instanceMethod2(Z z) {} //인스턴스 메서드에 제네릭 메서드 도입 가능
}
```

> ✅ 참고
>
> 제네릭 타입은 static 메서드에 타입 매개변수를 사용할 수 없다. 제네릭 타입은 객체를 생성하는 시점에 타입이 정해진다. 그런데 static 메서드는 인스턴스 단위가 아니라 클래스 단위로 작동하기 때문에 제네릭 타입과는 무관하다. 따라서 static 메서드에 제네릭을 도입하려면 제네릭 메서드를 사용해야 한다.

``` java
class Box<T> {
    T instanceMethod(T t) {} //가능
    static T staticMethod1(T t) {} //제네릭 타입의 T 사용 불가능
}
```

### 타입 매개변수 제한

제네릭 메서드도 제네릭 타입과 마찬가지로 타입 매개변수를 제한할 수 있다.

### 제네릭 메서드 타입 추론

제네릭 메서드 호출할 때 `GenericMethod.<Integer>genericMethod(10);`과 같이 타입 매개변수를 적어주는 것은 매우 불편하다. 이를 위해 제네릭 타입을 생략도 가능하다. 그 이유는 제네릭 메서드를 호출할 때 자바 컴파알러가 타입 인자를 보고 반환 타입을 확인하여 타입을 추론이 가능하다. 그러기에 제네릭 메서드를 호출할 때는 타입 매개변수를 생략한다.

``` java
GenericMethod.genericMethod(10); // 타입 매개변수 생략
```

주의할 점이 존재한다. 이 점은 실무에서도 많이 사용되고 실무자들도 많이 헷갈려한다. 반드시 기억해야할 것은 **제네릭 타입과 제네릭 메서드에 정의한 타입 매개변수는 다른 타입**이다. 아래 코드처럼 `T`랑 `S`는 다른 타입이다. 심지어 이름이 같아도 다른 타입이라고 생각하자.

``` java
public class A<T> {

    public static <S> S method(S s) {
        //
    }
}
```

## 제네릭 메서드 활용

그러면 이번에는 기존에 작성했던 탈것 관련 서비스를 제네릭 메서드를 도입해서 변경해보도록 하자.

``` java
public class VehicleMethod {

    public static <T extends Vehicle> T checkup(T t) {
        System.out.println("차량 이름: " + t.getName());
        System.out.println("차량 속도: " + t.getSpeed());
        return t;
    }

    public static <T extends Vehicle> T getFaster(T t1, T t2) {
        return t1.getSpeed() > t2.getSpeed() ? t1 : t2;
    }
}
```

``` java
public class MethodMain2 {
    public static void main(String[] args) {
        Car car = new Car("자동차", 100);
        Motorcycle motorcycle = new Motorcycle("오토바이", 100);

        VehicleMethod.checkup(car);
        VehicleMethod.checkup(motorcycle);

        Car targetCar = new Car("빠른 자동차", 200);
        Car faster = VehicleMethod.getFaster(car, targetCar);
        System.out.println("faster = " + faster);
    }
}
```

위와 같이 제네릭 메서드를 도입을 하여 조금 더 간편히 작성해볼 수 있었다. 또한 제네릭 메서드 타입 추론을 이용하여 작성하였다.

### 제네릭 타입과 제네릭 메서드의 우선순위

정적 메서드는 제네릭 메서드만 적용할 수 있지만, 인스턴스 메서드는 제네릭 타입도 제네릭 메서드도 둘다 적용할 수 있다. 여기에 제네릭 타입과 제네릭 메서드의 타입 매개변수를 같은 이름으로 사용하면 어떻게 될까?

``` java
public class ComplexBox<T extends Vehicle> {

    private T vehicle;

    public void set(T vehicle) {
        this.vehicle = vehicle;
    }

    public <T> T printAndReturn(T t) {
        System.out.println("vehicle.className = " + vehicle.getClass().getName());
        System.out.println("t.className = " + t.getClass().getName());
        // t.getName(); // 호출 불가 메서드는 <T> 타입이다. <T extends Vehicle> 타입이 아니다.

        return t;
    }
}
```

위와 같이 타입 상한을 건 제네릭 타입 클래스를 선언하고 제네릭 메서드도 선언하였는데 여기서 타입 매개변수 명이 동일하다. 그럴 경우에는 어떻게 할까? 이전에도 한번 설명한 적이 있지만 다시 한번 설명하면 제네릭 메서드의 타입 매개변수와 제네릭 타입의 타입 매개변수는 다른 놈이라고 인식하자! 심지어 이렇게 같은 타입명이라고 할지라도 말이다. 그리고 위 처럼 타입명이 같을 때는 다르게 선언하는 것이 모호성을 없애는데 좋으니 그렇게 설계하도록 하는 것이 좋다.

## 와일드카드1

이번에는 제네릭 타입을 조금 더 편리하게 사용할 수 있는 와일드카드에 대해 알아보자. 와일드 카드는 `*`나 `?`로 사용한다. 쉽게 이야기 해서 여러 타입이 들어올 수 있다는 뜻이다.

``` java
public class Box<T> {

    private T value;

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}
```

``` java
public class WildcardEx {

    static <T> void printGenericV1(Box<T> box) {
        System.out.println("T = " + box.get());
    }

    static void printWildcardV1(Box<?> box) {
        System.out.println("? = " + box.get());
    }

    static <T extends Vehicle> void printGenericV2(Box<T> box) {
        T t = box.get();
        System.out.println("이름 = " + t.getName());
    }

    static void printWildcardV2(Box<? extends Vehicle> box) {
        Vehicle vehicle = box.get();
        System.out.println("이름 = " + vehicle.getName());
    }

    static <T extends Vehicle> T printAndReturnGeneric(Box<T> box) {
        T t = box.get();
        System.out.println("이름 = " + t.getName());

        return t;
    }

    static Vehicle printAndReturnWildcard(Box<? extends Vehicle> box) {
        Vehicle vehicle = box.get();
        System.out.println("이름 = " + vehicle.getName());

        return vehicle;
    }
}
```

위의 코드에서는 제네릭 메서드와 와일드 카드를 혼재해서 각각 배치해두었다. 이제 이를 실행하는 코드를 작성해보자.

> ✅ 참고
>
> 와일드카드는 `?` 를 사용해서 정의한다.

``` java
public class WildcardMain1 {
    public static void main(String[] args) {
        Box<Object> objBox = new Box<>();
        Box<Car> carBox = new Box<>();
        Box<Motorcycle> motorcycleBox = new Box<>();

        carBox.set(new Car("자동차", 100));

        WildcardEx.printGenericV1(carBox);
        WildcardEx.printWildcardV1(carBox);

        WildcardEx.printGenericV2(carBox);
        WildcardEx.printWildcardV2(carBox);

        Car car = WildcardEx.printAndReturnGeneric(carBox);
        Vehicle vehicle = WildcardEx.printAndReturnWildcard(carBox);
    }
}
```

실행결과와 사용법을 보면 와일드카드와 제네릭 메서드는 거의 동일하다. 그럼 이 둘의 차이는 뭘까?

> ✅ 참고
>
> 와일드카드는 제네릭 타입이나, 제네릭 메서드를 선언하는 것이 아니다. 와일드카드는 이미 만들어진 제네릭 타입을 활용할 때 사용한다.

### 비제한 와일드 카드

``` java
static <T> void printGenericV1(Box<T> box) {
    System.out.println("T = " + box.get());
}

static void printWildcardV1(Box<?> box) {
    System.out.println("? = " + box.get());
}
```

두 메서드는 선언방식도 매우 유사하다. 하지만 극명한 차이점이 존재한다. 와일드카드는 제네릭 타입이나 제네릭 메서드를 정의할 때 사용하는 것이 아니다. 타입 인자가 정해진 제네릭 타입을 전달 받아서 활용할 때 사용한다. 반면에 제네릭 메서드는 사용할 때 타입 인자를 정하는 것이다. 그래서 제네릭 메서드는 해당 메서드 호출시점에 타입을 정하고 제네릭 메서드의 타입 매개변수 `T`가 바뀔 타입으로 변경하여 호출이 되는 반면에 와일드 카드는 이미 정해진 타입을 매개변수로 받는거라고 보면 쉽다. 절차만 봐도 제네릭 메서드가 훨 복잡한 것을 알 수 있다. 또한 와일드카드는 일반적인 메서드에 사용할 수 있고, 단순히 매개변수로 제네릭 타입을 받을 수 있는 것 뿐이다. 제네릭 메서드처럼 타입을 결정하거나 복잡하게 작동하지 않는다. 단순히 일반 메서드에 제네릭 타입을 받을 수 있는 매개변수가 하나 있는 것 뿐이다. 제네릭 타입이나 제네릭 메서드를 정의하는게 꼭 필요한 상황이 아니라면, 더 단순한 와일드카드 사용을 권장한다.

> ✅ 참고
>
> 와일드카드인 `?` 는 모든 타입을 다 받을 수 있다는 뜻이다. 이렇게 `?` 만 사용해서 제한 없이 모든 타입을 다 받을 수 있는 와일드카드를 비제한 와일드카드라 한다. 즉, 모든 타입의 제네릭 타입을 받을 수 있다는 것이다.

## 와일드카드2

### 상한 와일드 카드

``` java
static <T extends Vehicle> void printGenericV2(Box<T> box) {
    T t = box.get();
    System.out.println("이름 = " + t.getName());
}

static void printWildcardV2(Box<? extends Vehicle> box) {
    Vehicle vehicle = box.get();
    System.out.println("이름 = " + vehicle.getName());
}
```

- 제네릭 메서드와 마찬가지로 와일드카드에도 상한 제한을 둘 수 있다.
- `Vehicle`과 그 하위 타입만 입력 받는다. 만약 다른 타입을 입력하면 컴파일 오류가 발생한다.
- `box.get()` 을 통해서 꺼낼 수 있는 타입의 최대 부모는 `Vehicle` 이 된다. 따라서 `Animal` 타입으로 조회할 수 있다.
- 결과적으로 `Vehicle` 타입의 기능을 호출할 수 있다.

### 타입 매개변수가 꼭 필요한 경우

와일드카드는 제네릭을 정의할 때 사용하는 것이 아니다. 타입 인자가 전달된 제네릭 타입을 활용할 때 사용한다. 즉, 아래처럼 타입 매개변수로 반환해야 하는 경우 제네릭 메서드나 제네릭 타입을 사용하야 한다.

``` java
public T call(Box<T> t) {
    return t;
}
```

메서드의 타입들을 특정 시점에 변경하려면 제네릭 타입이나, 제네릭 메서드를 사용해야 한다. 와일드카드는 이미 만들어진 제네릭 타입을 전달 받아서 활용할 때 사용한다. 따라서 메서드의 타입들을 타입 인자를 통해 변경할 수 없다. 쉽게 이야기해서 일반적인 메서드에 사용한다고 생각하면 된다.

정리하면 제네릭 타입이나 제네릭 메서드가 꼭 필요한 상황이면 `<T>` 를 사용하고, 그렇지 않은 상황이면 와일드카드를 사용하는 것을 권장한다.

### 하한 와일드 카드

``` java
public static void call(Box<? super Vehicle> target) {

}
```

와일드 카드는 타입 하한 문법도 지원한다. 타입 하한이란 `?`로 들어올 것이 `Vehicle`보다 상위 타입이어야 한다는 소리이다.

## 타입 이레이저

제네릭은 자바 컴파일 단계에서만 사용되고, 컴파일 이후에는 제네릭 정보가 삭제된다. 제네릭에 사용한 타입 매개변수가 모두 사라지는 것이다. 쉽게 이야기해서 컴파일 전인 `.java` 에는 제네릭의 타입 매개변수가 존재하지만, 컴파일 이후인 자바 바이트코드 `.class` 에는 타입 매개변수가 존재하지 않는 것이다. 이런것을 타입 이레이저라고 말한다.

``` java
public class Box<T> {

    private T value;

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}
```

위와 같이 제네릭 타입을 정의했다. 그리고 main 메서드에서 아래와 같이 사용을 하였다.

``` java
Box<Integer> integer = new Box<>();
integer.set(10);
Integer result = integer.get();
```

그러면 자바가 실행을 하면서 컴파일을 할 것이다. 그러면 컴파일 단계에서 `Box` 클래스는 아래와 같이 변한다.

``` java
public class Box<Integer> {

    private Integer value;

    public Integer get() {
        return value;
    }

    public void set(Integer value) {
        this.value = value;
    }
}
```

컴파일이 모두 끝나면 자바는 제네릭과 관련된 정보를 삭제한다. 이때 `.class` 에 생성된 정보는 다음과 같다.

``` java
public class Box {

    private Object value;

    public Object get() {
        return value;
    }

    public void set(Object value) {
        this.value = value;
    }
}
```

``` java
Box integer = new Box();
integer.set(10);
Integer result = (Integer) integer.get();
```

값을 반환 받는 부분을 `Object`로 받으면 안된다. 자바 컴파일러는 제네릭에서 타입 인자로 지정한 `Integer`로 캐스팅하는 코드를 추가해준다. 이렇게 추가된 코드는 자바 컴파일러가 이미 검증하고 추가했기 때문에 문제가 발생하지 않는다.

### 타입 상한

타입 매개변수를 제한하면 제한한 타입으로 코드를 변경한다.

``` java
public class Box<T extends Vehicle> {

    private T value;

    public T get() {
        return value;
    }

    public void set(T value) {
        this.value = value;
    }
}
```

위의 코드가 컴파일 이후 아래와 같이 변경이 된다.

``` java
public class Box {

    private Vehicle value;

    public Vehicle get() {
        return value;
    }

    public void set(Vehicle value) {
        this.value = value;
    }
}
```

자바의 제네릭은 단순하게 생각하면 개발자가 직접 캐스팅 하는 코드를 컴파일러가 대신 처리해주는 것이다. 자바는 컴파일 시점에 제네릭을 사용한 코드에 문제가 없는지 완벽하게 검증하기 때문에 자바 컴파일러가 추가하는 다운 캐스팅에는 문제가 발생하지 않는다. 자바의 제네릭 타입은 컴파일 시점에만 존재하고, 런타임 시에는 제네릭 정보가 지워지는데, 이것을 타입 이레이저라 한다.

### 타입 이레이저의 한계

컴파일 이후에는 제네릭의 타입 정보가 존재하지 않는다. 즉, `.class`파일에는 타입정보가 사라진다. 그래서 런타임을 활용하는 아래와 같은 코드는 작성이 불가능하다.

``` java
class EraserBox<T> {
    public boolean instanceCheck(Object param) {
        return param instanceof T; // 오류
    }
    public void create() {
        return new T(); // 오류
    }
}
```

- 여기서 `T` 는 런타임에 모두 `Object` 가 되어버린다.
- `instanceof` 는 항상 `Object` 와 비교하게 된다. 이렇게 되면 항상 참이반환되는 문제가 발생한다. 자바는 이런 문제 때문에 타입 매개변수에 `instanceof` 를 허용하지 않는다.
- `new T` 는 항상 `new Object` 가 되어버린다. 개발자가 의도한 것과는 다르다. 따라서 자바는 타입 매개변수에 `new`를 허용하지 않는다.

다만, 이렇게 직접적으로 쓰는 것을 방지하는 것일 뿐 아래와 같이 이용하는 것은 가능하다.

``` java
public class Box<T extends Animal> {

    private final T value;

    public Box(T value) {
        this.value = value;
    }

    public T get() {
        return value;
    }

    public Box<T> withName(String name) {
        T newAnimal = (T) value.withName(name); // 객체 자신이 새로운 인스턴스 생성을 돕도록 함
        return new Box<>(newAnimal);
    }
}
```

## 정리

제네릭은 지금까지 설명한 내용보다 더 복잡하고 어려운 개념들도 있다. 특히 공변, 반공변과 같은 개념들이 그러하다. 이런 개념들을 이해하면 와일드카드가 존재하는 이유도 더 깊이있게 알 수 있다. 하지만 제네릭을 사용해서 매우 복잡한 라이브러나 프레임워크를 직접 설계하지 않는 이상 이런 개념들을 꼭 이해할 필요는 없다. 이런 부분은 실무에서 많은 경험을 쌓고 본인이 필요하다고 느껴질 때 따로 공부하는 것을 권장한다. 그냥 면접대비용으로 공부하는 것도 좋긴 할 것 같다. 해당 부분을 다루게 된다면 따로 포스팅을 해보겠다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!