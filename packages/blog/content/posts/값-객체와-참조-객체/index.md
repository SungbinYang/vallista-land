---
title: "[오브젝트] 값 객체와 참조 객체"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-16 20:29:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 참조 객체와 별칭 문제

우리는 지금까지 메서드를 작게 쪼개므로써 얻을 수 있는 이점에 대해 살펴보았다. 이처럼 클래스도 작게 쪼개는 것이 더 이점이 존재한다. 해당 이점을 살펴보기 전에 어떻게 작게 쪼갤 수 있는지에 대해 살펴보자.

클래스를 작게 쪼갤 수 있는 2가지 방법이 존재한다. 첫번째는 **값 객체**를 이용하는 방법이 있고 두번째는 **단일 책임 원칙**을 이용하는 방법이 존재한다. 여기서는 먼저 **값 객체**에 대해 살펴보겠다. 값 객체 방법과 상반된 참조 객체부터 설명하고 해당 방식이 어떤 부수효과가 있어서 값 객체를 사용하는지로 설명해보겠다.

우리는 게임 매출 관리 어플리케이션을 만든다고 생각해보자. 그러면 상식적으로 판매자가 게임을 등록을 할 것이며 각 게임 별 매출 관리도 필요할 것이다. 그러면 등록된 게임이 판매되었을 때 정가, 할인율, 수량을 통해 계산을 진행한다. 그리고 그 결과를 매출에 누적시키면 된다. 또한 영업이익도 알아야 하므로 영업이익을 계산하는 로직도 만들어야 한다.

지금까지 우리가 배운 것을 토대로 작성하면 아래와 같이 코드가 작성될 것이다.

``` java
package me.sungbin.event;

public class Game {

    private String name;

    private long price;

    private double discountRate;

    public Game(String name, long price, double discountRate) {
        this.name = name;
        this.price = price;
        this.discountRate = discountRate;
    }

    public long calculateSalePrice() {
        return price - (long) Math.ceil(price * discountRate);
    }
}
```

``` java
package me.sungbin.event;

public class Sales {

    private Game game;

    private int totalQuantity;

    private long totalPrice;

    public Sales(Game game) {
        this.game = game;
        this.totalQuantity = 0;
        this.totalPrice = 0;
    }

    public void addSale(int quantity) {
        this.totalQuantity += quantity;
        this.totalPrice += game.calculateSalePrice() * quantity;
    }

    public long profit() {
        return (long) Math.ceil(totalPrice * 0.2);
    }

    public long totalAmount() {
        return totalPrice;
    }
}
```

그러면 한번 해당 코드의 문제를 살펴보자. 만약 여러 변수로 `Sales` 클래스를 생성하고 각 생성된 인스턴스 별로 영업이익을 계산한다면 어떻게 될까? 잠시 생각을 해보면 정확한 영업이익을 구하기는 힘들 것이다. 왜냐하면 `profit` 메서드를 호출할때는 해당 인스턴스의 영업이익을 반환하기 때문에 전체 영업이익을 구하기는 힘들다.

그러면 영업이익을 정상적으로 계산하려면 어떻게 할까? `Sales` 인스턴스를 하나만 생성해두고 여러 변수가 이를 참조하는 방식으로 계산하면 될 것이다. 즉, 하나의 `Sales` 인스턴스에 모든 판매 내역을 누적시키면 된다. 그러면 어떤 변수로든간에 전체 영업 이익을 쉽게 구할 수 있다.

이렇게 모든 클라이언트가 동일한 객체를 이용해서 오퍼레이션을 실행하는데 이 객체를 **참조 객체**라고 한다. 일반적으로 참조 객체는 도메인 상의 중요한 개념을 표현하며 가변 객체라고도 불리기도 한다. 그리고 이렇게 참조 객체를 참조하는 변수 혹은 클라이언트를 **별칭**이라고 한다.

이 참조 객체는 단점이 존재한다. 예를 들어 `a`라는 변수에서 상품이 판매되어 `addSales`로 총 판매 금액을 변경시켰다고 해보자. 그런데 이와 동시에 `b`라는 변수에서 영업이익을 호출했을 때 서로 다른 결과가 나오는 부수효과가 발생한다. 즉, 하나의 참조를 통해 발생된 변경이 다른 참조로 전파되는 부작용이 발생한다.

이런 문제를 어떻게 해결할까? 바로 **값 객체**를 이용하는 것으로 해결이 가능하다.

## 값 객체의 가치

**값 객체**란, 값이 동일하면 동일한 객체로 취급되는 객체를 뜻한다. 값 비교를 통해 참조 객체의 복잡성을 감소시키고 불변 객체로 구현을 한다. 이전 코드에서 우리는 `long` 타입의 `price`와 `totalPrice`를 사용했다. 해당 값 때문에 참조 객체의 문제가 발생한것이니 이를 불변 객체로 분리해보면 아래와 같이 나올 것이다.

``` java
package me.sungbin.event;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class Money {

    public static final Money ZERO = Money.wons(0);

    private final BigDecimal amount;

    public static Money wons(long amount) {
        return new Money(BigDecimal.valueOf(amount));
    }

    Money(BigDecimal amount) {
        this.amount = amount;
    }

    public double doubleValue() {
        return amount.doubleValue();
    }

    public Money plus(Money amount) {
        return new Money(this.amount.add(amount.amount));
    }

    public Money minus(Money amount) {
        return new Money(this.amount.subtract(amount.amount));
    }

    public Money times(double times) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(times)));
    }

    public Money ceil(double percent) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(percent)).setScale(0, RoundingMode.CEILING));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return Objects.equals(amount, money.amount);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(amount);
    }

    @Override
    public String toString() {
        return amount.toString() + "원";
    }
}
```

``` java
package me.sungbin.event;

public class Game {

    private String name;

    private Money price;

    public Game(String name, Money price) {
        this.name = name;
        this.price = price;
    }

    public Money salePrice(double discountRate) {
        return price.minus(price.ceil(discountRate));
    }
}
```

``` java
package me.sungbin.event;

public class Sales {

    private Game game;

    private int quantity;

    private Money totalAmount;

    public Sales(Game game) {
        this.game = game;
        this.quantity = 0;
        this.totalAmount = Money.wons(0);
    }

    public void addSale(int quantity, double discountRate) {
        this.quantity += quantity;
        this.totalAmount = this.totalAmount.plus(game.salePrice(discountRate).times(quantity));
    }

    public Money profit() {
        return totalAmount.ceil(0.03);
    }

    public Money totalAmount() {
        return totalAmount;
    }
}
```

코드만 보더라도 확실히 이전 참조 객체에 비해 로직의 복잡성이 줄어들었다. 즉, 이전 가변객체였을 때를 생각해보면 상태가 다른 외부 클라이언트에게 전파되는 부작용을 불변 객체를 통해 방지할 수 있는 효과도 볼 수 있다. 즉, 값 객체를 이용하여 상태 추적과 예상하지 못한 부수효과를 막을 수 있었다.

그러면 정리를 하면서 참조 객체와 값 객체를 비교해보겠다.

- 참조 객체
  - 식별자를 기반으로 객체 동등성 체크
  - 가변 객체로 구현
  - 별칭 문제 발생
- 값 객체
  - 속성을 기반으로 객체 동일성 체크
  - 불변 객체로 구현
  - 별칭 문제 방지

즉, 값 객체는 참조 객체 안의 숨겨진 모호한 개념을 명시적으로 드러내서 복잡성을 감소 시키며 참조 객체 안의 복잡한 로직이나 중복 코드를 값 객체로 이동시킨다. 즉, 값 객체로 추출하려면 암시적인 개념 자체를 추출하면 좋다.

이렇게 값 객체를 사용하면서 상태변경이 전파되는 부수효과도 막고 값 객체안의 행동을 정의해서 중복적인 코드도 줄일 수 있다. 이렇게 중복을 제거하는 패턴을 `DRY` 패턴이라고 부른다.

> 📚 용어 정리
>
> DRY: 모든 지식 조각은 시스템 내에서 하나의 모호하지 않고 권위 있는 표현을 가져야 한다.
>
> 값 객체는 포함되는 객체의 생명주기에 종속된다.(합성 관계) 

값 객체를 설계할 때는 일반적인 하향식 설계 방식이 아닌 리팩토링 과정에서 식별을 하는게 좋다. 코드 리팩토링 중에 복잡하거나 중복된 로직을 간단한 개념으로 값을 추출하는 식으로 말이다.

> ⚠️ 주의
>
> 중복된 코드라도 무조건 값 객체로 분리하면 안된다. 중복이 되더라고 해당 중복된 로직이 같이 변경이 되는지를 파악하고 같이 변경이 된다면 그때 값 객체로 분리하는 것이 좋다.

## 값 객체를 이용해서 Game 개선하기

그러면 기존 게임 로직을 값 객체로 분리하여 리팩토링을 해보자. 결과는 아래와 같다. 한번 직접 해보고 비교를 해보자.

``` java
package me.sungbin.adventure;

public enum Direction {
    NORTH, SOUTH, EAST, WEST
}
```

``` java
package me.sungbin.adventure;

import java.util.Objects;

public class Position {

    private final int x;

    private final int y;

    public static Position of(int x, int y) {
        return new Position(x, y);
    }

    private Position(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int x() {
        return x;
    }

    public int y() {
        return y;
    }

    public Position shift(Direction direction) {
        return switch (direction) {
            case NORTH -> Position.of(x, y - 1);
            case EAST -> Position.of(x + 1, y);
            case SOUTH -> Position.of(x, y + 1);
            case WEST -> Position.of(x - 1, y);
        };
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Position position = (Position) o;
        return x == position.x && y == position.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);
    }

    @Override
    public String toString() {
        return "Position{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
```

``` java
package me.sungbin.adventure;

public class Size {

    private final int width, height;

    public static Size with(int width, int height) {
        return new Size(width, height);
    }

    private Size(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public int area() {
        return width * height;
    }

    public boolean contains(Position position) {
        return position.x() >= 0 && position.x() < width &&
                position.y() >= 0 && position.y() < height;
    }

    public int indexOf(Position position) {
        return position.x() + position.y() * width;
    }
}
```

``` java
package me.sungbin.adventure;

public class Room {

    private Position position;

    private String name;

    private String description;

    public Room(Position position, String name, String description) {
        this.position = position;
        this.name = name;
        this.description = description;
    }

    public String name() {
        return name;
    }

    public String description() {
        return description;
    }

    public Position position() {
        return position;
    }
}
```

``` java
package me.sungbin.adventure;

import java.util.Scanner;

public class Game {

    private Size size;

    private Room[] rooms;

    private Position position;

    private boolean running;

    public Game() {
        this.position = Position.of(0, 2);
        this.size = Size.with(2, 3);
        this.rooms = arrangeRooms(
                new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다."));
    }

    private Room[] arrangeRooms(Room ... rooms) {
        Room[] result = new Room[size.area()];
        for(var room : rooms) {
            result[size.indexOf(room.position())] = room;
        }
        return result;
    }

    public void run() {
        welcome();
        play();
        farewell();
    }

    private void welcome() {
        showGreetings();
        showRoom();
        showHelp();
    }

    private void showGreetings() {
        System.out.println("환영합니다!");
    }

    private void showRoom() {
        System.out.println("당신은 [" + roomAt(position).name() + "]에 있습니다.");
        System.out.println(roomAt(position).description());
    }

    private void showHelp() {
        System.out.println("다음 명령어를 사용할 수 있습니다.");
        System.out.println("go {north|east|south|west} - 이동, look - 보기, help - 도움말, quit - 게임 종료");
    }

    private void farewell() {
        System.out.println("\n게임을 종료합니다.");
    }

    private void showBlocked() {
        System.out.println("이동할 수 없습니다.");
    }

    private void play() {
        Scanner scanner = new Scanner(System.in);

        start();
        while (isRunning()) {
            String input = inputCommand(scanner);
            parseCommand(input);
        }
    }

    private boolean isRunning() {
        return running == true;
    }

    private String inputCommand(Scanner scanner) {
        showPrompt();
        return input(scanner);
    }

    private void start() {
        running = true;
    }

    private void stop() {
        this.running = false;
    }

    private void parseCommand(String input) {
        String[] commands = input.toLowerCase().trim().split("\\s+");

        switch (commands[0]) {
            case "go" -> {
                switch (commands[1]) {
                    case "north" -> tryMove(Direction.NORTH);
                    case "south" -> tryMove(Direction.SOUTH);
                    case "east" -> tryMove(Direction.EAST);
                    case "west" -> tryMove(Direction.WEST);
                    default -> showUnknownCommand();
                }
            }
            case "look" -> showRoom();
            case "help" -> showHelp();
            case "quit" -> stop();
            default -> showUnknownCommand();
        }
    }

    private void showUnknownCommand() {
        System.out.println("이해할 수 없는 명령어입니다.");
    }

    private String input(Scanner scanner) {
        return scanner.nextLine();
    }

    private void showPrompt() {
        System.out.print("> ");
    }

    private void tryMove(Direction direction) {
        if (isBlocked(position.shift(direction))) {
            showBlocked();
        } else {
            position = position.shift(direction);
            showRoom();
        }
    }

    private boolean isBlocked(Position position) {
        return isExcluded(position) || roomAt(position) == null;
    }

    private boolean isExcluded(Position position) {
        return !size.contains(position);
    }

    private Room roomAt(Position position) {
        return rooms[size.indexOf(position)];
    }
}
```

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!