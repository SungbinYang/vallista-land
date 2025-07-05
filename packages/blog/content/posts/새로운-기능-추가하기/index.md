---
title: "[오브젝트] 새로운 기능 추가하기"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-07-05 14:09:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 새로운 요구사항 추가하기

기존 게임 시스템에 새롱운 요구사항이 왔다고 해보자. 기존 방에 아이템이 존재한다면 플레이어는 아이템을 주울 수 있을 것이고 아이템을 버릴 수도 있을 것이다. 또한 플레이어가 가진 아이템을 볼 수 있게 인벤토리를 출력할 수 있다고 해보자.

먼저 `Item` 클래스부터 작성해보자.

``` java
package me.sungbin.game;

import java.util.Objects;

public class Item {

    private String name;

    public Item(String name) {
        this.name = name;
    }

    public String name() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item item = (Item) o;
        return Objects.equals(name, item.name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }
}
```

그리거 해당 `Item` 클래스를 담을 수 있게 `Room`에 코드를 추가하자. 또한 `Player`도 아이템을 주울 수 있으니 해당 부분도 코드를 추가해야하지만 공통적인 코드가 생길 것이 예상된다. 즉, DRY 원칙에 어긋나게 되므로 상속을 통하여 해당 부분을 해결하고 작성해보자.

``` java
package me.sungbin.game;

public class Room extends Player {

    private String name;
    private String description;

    public Room(Position position, String name, String description, Item... items) {
        super(null, position, items);
        this.name = name;
        this.description = description;
    }

    public String name() {
        return name;
    }

    public String description() {
        return description;
    }
}
```

``` java
package me.sungbin.game;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class Player {

    private WorldMap worldMap;
    private Position position;
    private List<Item> items = new ArrayList<>();

    public Player(WorldMap worldMap, Position position, Item... items) {
        this.worldMap = worldMap;
        this.position = position;
        this.items.addAll(List.of(items));
    }

    public List<Item> items() {
        return Collections.unmodifiableList(items);
    }

    public void add(Item item) {
        this.items.add(item);
    }

    public Optional<Item> find(String itemName) {
        return items.stream().filter(item -> item.name().equalsIgnoreCase(itemName)).findFirst();
    }

    public void remove(Item item) {
        this.items.remove(item);
    }

    public boolean canMove(Direction direction) {
        return !worldMap.isBlocked(position.shift(direction));
    }

    public void move(Direction direction) {
        if (!canMove(direction)) {
            throw new IllegalArgumentException();
        }

        this.position = this.position.shift(direction);
    }

    Position position() {
        return position;
    }

    public Room currentRoom() {
        return worldMap.roomAt(position);
    }
}
```

그리고 아이템 줍기, 떨구기, 인벤토리 확인에 대한 기능을 `Game` 클래스에 작성해보자.

``` java
package me.sungbin.game;

import me.sungbin.game.command.Command;
import me.sungbin.game.command.CommandParser;

import java.util.stream.Collectors;

public class Game {

    private Player player;
    private CommandParser commandParser;
    private InputOutput io;
    private boolean running;

    public Game(Player player, CommandParser commandParser, InputOutput io) {
        this.player = player;
        this.commandParser = commandParser;
        this.io = io;
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
        io.showLine("환영합니다!");
    }

    private void showHelp() {
        io.showLine("다음 명령어를 사용할 수 있습니다.");
        io.showLine("go {north|east|south|west} - 이동, look - 보기, help - 도움말, quit - 게임 종료");
    }

    private void farewell() {
        io.showLine("\n게임을 종료합니다.");
    }

    private void play() {
        start();
        while (isRunning()) {
            String input = inputCommand();
            Command command = commandParser.parseCommand(input);
            executeCommand(command);
        }
    }

    private void executeCommand(Command command) {
        switch(command) {
            case Command.Move move -> tryMove(move.direction());
            case Command.Look() -> showRoom();
            case Command.Help() -> showHelp();
            case Command.Quit() -> stop();
            case Command.Unknown() -> showUnknownCommand();
            case Command.Inventory() -> showInventory();
            case Command.Take take -> takeItem(take.item());
            case Command.Drop drop -> dropItem(drop.item());
        }
    }

    private void tryMove(Direction direction) {
        if (player.canMove(direction)) {
            player.move(direction);
            showRoom();
            return;
        }

        showBlocked();
    }

    private void showBlocked() {
        io.showLine("이동할 수 없습니다.");
    }

    private void showRoom() {
        io.showLine("당신은 [" + player.currentRoom().name() + "]에 있습니다.");
        io.showLine(player.currentRoom().description());
        if (!player.currentRoom().items().isEmpty()) {
            io.showLine(player.currentRoom().items().stream()
                    .map(Item::name)
                    .collect(Collectors.joining(", ", "아이템: [ ", " ]")));
        }
    }

    private boolean isRunning() {
        return running == true;
    }

    private String inputCommand() {
        showPrompt();
        return input();
    }

    private void start() {
        running = true;
    }

    private void stop() {
        this.running = false;
    }

    private void showUnknownCommand() {
        io.showLine("이해할 수 없는 명령어입니다.");
    }

    private String input() {
        return io.input();
    }

    private void showPrompt() {
        io.show("> ");
    }

    private void takeItem(String itemName) {
        transfer(player.currentRoom(), player, itemName,
                itemName + "을(를) 얻었습니다.",
                itemName + "을(를) 얻을 수 없습니다.");
    }

    private void dropItem(String itemName) {
        transfer(player, player.currentRoom(), itemName,
                itemName + "을(를) 버렸습니다.",
                itemName + "을(를) 버릴 수 없습니다.");
    }


    private void transfer(Player source, Player target, String itemName, String success, String fail) {
        source.find(itemName).ifPresentOrElse(
                item -> {
                    source.remove(item);
                    target.add(item);
                    io.showLine(success);
                },
                () -> io.showLine(fail));
    }

    private void showInventory() {
        io.showLine(
                player.items().stream()
                        .map(Item::name)
                        .collect(Collectors.joining(", ", "인벤토리 목록: [ ", " ]")));
    }
}
```

이제 해당 기능을 키보드 입력 처리로 받을 수 있게 작성해보면 좋을 것 같다.

``` java
package me.sungbin.game.command;

import me.sungbin.game.Direction;

public sealed interface Command {

    record Move(Direction direction) implements Command {}
    record Unknown() implements Command {}
    record Look() implements Command {}
    record Help() implements Command {}
    record Quit() implements Command {}
    record Inventory() implements Command {}
    record Take(String item) implements Command {}
    record Drop(String item) implements Command {}
}
```

위와 같이 `Command` 인터페이스에 명령 객체를 추가하고 `CommandParser`에 해당 명령을 파싱하는 로직을 추가해보자.

``` java
package me.sungbin.game.command;

import me.sungbin.game.Direction;

public class CommandParser {

    public Command parseCommand(String input) {
        return parseCommand(split(input));
    }

    private Command parseCommand(String[] commands) {
        return switch (commands[0]) {
            case "go" ->
                    switch (commands[1]) {
                        case "north" -> new Command.Move(Direction.NORTH);
                        case "south" -> new Command.Move(Direction.SOUTH);
                        case "east" -> new Command.Move(Direction.EAST);
                        case "west" -> new Command.Move(Direction.WEST);
                        default -> new Command.Unknown();
                    };
            case "inventory" -> new Command.Inventory();
            case "take" -> new Command.Take(commands[1]);
            case "drop" -> new Command.Drop(commands[1]);
            case "look" -> new Command.Look();
            case "help" -> new Command.Help();
            case "quit" -> new Command.Quit();
            default -> new Command.Unknown();
        };
    }

    private String[] split(String input) {
        return input.toLowerCase().trim().split("\\s+");
    }
}
```

그리고 `Main`에서 아이템을 배치하여 직접 실행하면 정상 동작이 되는 것을 볼 수 있다.

``` java
package me.sungbin;

import me.sungbin.console.Console;
import me.sungbin.game.*;
import me.sungbin.game.command.CommandParser;

public class Main {
    public static void main(String[] args) {
        Player player = new Player(
                new WorldMap(
                        Size.with(2, 3),
                        new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                        new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다.", new Item("sword")),
                        new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다.", new Item("potion"), new Item("key")),
                        new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                        new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.", new Item("gem"))),
                Position.of(0, 2));
        CommandParser commandParser = new CommandParser();
        InputOutput io = new Console();

        Game game = new Game(player, commandParser, io);
        game.run();
    }
}
```

이렇게 코드를 재사용하는 전통적 기법인 상속을 통해서 새로운 요구사항을 추가하였다. 그런데 여기서 이런 상속에 문제가 있다. 바로 업캐스팅이 가능하다는 점이다. 즉, 자식 클래스가 부모 클래스로 치환이 가능하다는 점이다. 그래서 업 캐스팅으로 `Player` 대신에 `Room`을 전달할 수 있고 `Room`에 대해서는 호출 불가능한 `canMove`와 `move` 메서드를 호출할 수 있다라는 것이다. 만약 강제로 호출한다면 이것은 바로 `NullPointerException`이 발생하게 될 것이다. 또한, 상속을 이용하면 `Room`에 필요하지 않은 `WorldMap`도 상속으로 인해 가져야 한다는 불필요함도 가진다. 즉, 자식 클래스가 부모 클래스와 강하게 결합된다는 의미이다.

이런 문제를 해결하기 위해서는 이런 메서드를 이용할 때 `instanceof` 키워드를 이용하여 확인을 하는 방법이 존재한다. 하지만 이런 방법은 새로운 자식 클래스가 추가될 때마다 부모 클래스의 코드를 수정하게 되는 현상이 발생한다.

두번째 방법으로는 자식 클래스인 `Room`에 오류가 발생하지 않도록 불필요한 메서드를 오버라이딩하는 것이다. 하지만 사용하지 않을 메서드를 불필요하게 오버라이딩하는 것은 매우 문제가 생기며 결합도 측면에서 좋지 못한 방법이다.

## 전통적인 개방-폐쇄 원칙

개방 폐쇄 원칙이란, 모듈은 개방적인 동시에 폐쇄적이어야 한다라는 모순적인 의미를 가지고 있다. 한번 이 원칙을 이해하기 위해 기존 통화 관리 시스템에 새로운 요구사항을 추가해보도록 하겠다. 새로운 요구사항으로 발신 번호 별로 통화 시간이 10초 이상인 통화 요금에 대해서만 요금을 부과하도록 하겠다.

만약 휴대폰 별로 10초이상 통화시간을 구해야 한다면 발신 번호 별로 통화 시간이 10초 이상인 통화 내역만 필터링을 하는 방법이 있을 것이다. 발신 번호 별로 통화 시간을 구할 수 있는 가장 간단한 방법으로는 `CallCollector`에 모든 통화 내역을 반환하는 로직을 재사용하는 방법이 존재한다. 이런 코드를 재사용하기 위한 전통적인 기법으로는 상속이 존재한다. 그러면 아래와 같이 `BillingCallCollector`를 만들어서 상속을 시키면 될 것이다.

``` java
package me.sungbin.call.problem.calls;

import java.time.Duration;

public class BillingCallCollector extends CallCollector {

    public BillingCallCollector(Reader reader) {
        super(reader);
    }

    @Override
    public CallHistory collect(String phone) {
        CallHistory history = super.collect(phone);

        CallHistory result = new CallHistory(phone);
        for(Call call : history.calls()) {
            if (call.duration().compareTo(Duration.ofSeconds(10)) >= 0) {
                result.append(call);
            }
        }

        return result;
    }
}
```

이렇게 작성함으로 전체 통화 시간이 필요한 클라이언트는 전체 통화 내역을 반환하는 `CallCollector`와 협력을 하는 동시에 요금을 계산하는 새로운 클라이언트는 `CallCollector` 변경 없이 `BillingCallCollector`와 협력만 하면 되는 것이다.

상속의 장점은 기존 클라이언트에게 영향을 주지 않으면서도 재사용을 통해 새로운 클라이언트에게 필요한 기능을 제공하게 한다. 즉, 부모 클래스와 다른 부분만 자식 클래스 안에서 구현해서 기능을 확장하는 방식을 뜻한다. 즉, 개방 폐쇄 원칙을 잘 지킨 것이다.

하지만 상속도 문제가 존재한다. 만약 새로운 요구사항으로 특정 휴대폰 번호의 통화 중에 가장 긴 통화를 찾아야 한다면 어떻게 할까? 바로 모든 통화 내역을 반환하는 `CallCollector`를 재사용하면 좋을 것 같다. 이번에는 메서드에 파라미터 인자로 하여 내부적으로 해당 로직을 호출하도록 해보겠다. 하지만 상속의 문제는 업캐스팅이다. 즉, `BillingCallCollector`가 `CallCollector`를 대체할 수 있다는 의미이다. 만약 아래와 같이 모든 통화 내역이 10초보다 적다면 어떻게 될까? 즉, `CallCollector`를 사용하지 않고 `BillingCallCollector`를 사용한다면?

``` java
package me.sungbin.call.problem.calls;

import java.util.Optional;

import static java.util.Comparator.comparing;

public class LongestCallSelector {

    public Optional<Call> select(String phone, CallCollector collector) {
        return collector.collect(phone).calls().stream().max(comparing(Call::duration));
    }
}
```

``` java
package me.sungbin.call.problem.calls;

import me.sungbin.call.problem.reader.FakeReader;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class LongestCallSelectorTest {

    @Test
    public void select_with_call_collector() {
        CallCollector collector =
                new CallCollector(
                        new FakeReader(
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 1, 0, 0, 0), LocalDateTime.of(2024, 1, 1, 0, 0, 5))),
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 2, 0, 0, 0), LocalDateTime.of(2024, 1, 2, 0, 0, 6))),
                                new Call("010-1111-2222", "010-5555-6666",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 3, 0, 0, 0), LocalDateTime.of(2024, 1, 3, 0, 0, 7)))
                        ));

        Optional<Call> result = new LongestCallSelector().select("010-1111-2222", collector);

        assertThat(result).isPresent().map(Call::duration).get().isEqualTo(Duration.ofSeconds(7));
    }

    @Test
    @Disabled("의도적으로 실패하도록 설정한 테스트")
    public void select_with_billing_call_collector() {
        BillingCallCollector collector =
                new BillingCallCollector(
                        new FakeReader(
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 1, 0, 0, 0), LocalDateTime.of(2024, 1, 1, 0, 0, 5))),
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 2, 0, 0, 0), LocalDateTime.of(2024, 1, 2, 0, 0, 6))),
                                new Call("010-1111-2222", "010-5555-6666",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 3, 0, 0, 0), LocalDateTime.of(2024, 1, 3, 0, 0, 7)))
                        ));

        Optional<Call> result = new LongestCallSelector().select("010-1111-2222", collector);

        assertThat(result).isPresent().map(Call::duration).get().isEqualTo(Duration.ofSeconds(7));
    }
}
```

실패하는 테스트 케이스에는 업캐스팅으로 `BillingCallCollector`로 대체가 가능하다. 다만, `select`메서드를 호출할 때 `BillingCallCollector`가 동작하니 10초보다 큰 것을 찾게 될텐데 10초보다 다 적으므로 해당 테스트는 실패할 것이다.

여기서 우리는 중요한 원칙을 알 수 있다. 상속이 다 좋은 것이 아니며 상속을 단순히 코드 재사용 목적으로 사용하면 안된다는 것을 말이다. 그러면 다른 방법을 찾아야 하는데 다음으로 좋은 방법이 바로 객체간 합성이다. 아래와 같이 말이다.

``` java
package me.sungbin.call.solution.calls;

import java.time.Duration;

public class BillingCallCollector {

    private CallCollector collector;

    public BillingCallCollector(CallCollector collector) {
        this.collector = collector;
    }

    public CallHistory collect(String phone) {
        CallHistory history = collector.collect(phone);

        CallHistory result = new CallHistory(phone);
        for(Call call : history.calls()) {
            if (call.duration().compareTo(Duration.ofSeconds(10)) >= 0) {
                result.append(call);
            }
        }

        return result;
    }
}
```

위와 같이 상속관계를 끊고 `CallCollector`를 의존성 주입을 받아서 실행하게끔 하는 것이다. 이렇게 하면 아래와 같이 테스트 코드가 성공이 되고 안정적인 코드가 완성이 될 것이다.

``` java
package me.sungbin.call.solution.calls;

import me.sungbin.call.solution.reader.FakeReader;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class LongestCallSelectorTest {

    @Test
    public void select_with_call_collector() {
        CallCollector collector =
                new CallCollector(
                        new FakeReader(
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 1, 0, 0, 0), LocalDateTime.of(2024, 1, 1, 0, 0, 5))),
                                new Call("010-1111-2222", "010-3333-4444",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 2, 0, 0, 0), LocalDateTime.of(2024, 1, 2, 0, 0, 6))),
                                new Call("010-1111-2222", "010-5555-6666",
                                        TimeInterval.of(LocalDateTime.of(2024, 1, 3, 0, 0, 0), LocalDateTime.of(2024, 1, 3, 0, 0, 7)))
                        ));

        Optional<Call> result = new LongestCallSelector().select("010-1111-2222", collector);

        assertThat(result).isPresent().map(Call::duration).get().isEqualTo(Duration.ofSeconds(7));
    }

    @Test
    @Disabled("BillingCallCollector가 Collector를 치환할 수 없기 때문에 컴파일 에러 발생")
    public void select_with_billing_call_collector() {
        BillingCallCollector collector =
                new BillingCallCollector(
                        new CallCollector(
                                new FakeReader(
                                        new Call("010-1111-2222", "010-3333-4444",
                                                TimeInterval.of(LocalDateTime.of(2024, 1, 1, 0, 0, 0), LocalDateTime.of(2024, 1, 1, 0, 0, 5))),
                                        new Call("010-1111-2222", "010-3333-4444",
                                                TimeInterval.of(LocalDateTime.of(2024, 1, 2, 0, 0, 0), LocalDateTime.of(2024, 1, 2, 0, 0, 6))),
                                        new Call("010-1111-2222", "010-5555-6666",
                                                TimeInterval.of(LocalDateTime.of(2024, 1, 3, 0, 0, 0), LocalDateTime.of(2024, 1, 3, 0, 0, 7)))
                                )));

        // LongestCallSelector와 협력할 수 없도록 합성으로 변경
        // Optional<Call> result = new LongestCallSelector().select("010-1111-2222", collector);
    }
}
```

하지만 위의 테스트 코드처럼 여전히 `BillingCallCollector`가 Collector를 치환할 수 없기 때문에 컴파일 에러 발생하는 문제가 발생한다. 이를 해결 하기 위해 다형성을 이용한 개방-폐쇄 원칙이 나오게 되었다.

## 다형적인 개방-폐쇄 원칙

기존 상속을 기반한 개방-폐쇄 원칙으로 여러 사이드 이펙트가 발생했다. 바로 업캐스팅 문제가 발생하기 때문이다. 그래서 등장한 개념이 바로 다형성을 기반한 개방-폐쇄 원칙이다. 다형성 개방-폐쇄 원칙은 확장에는 열려있고 수정에는 닫혀있어야 한다.

- 확장에는 열려있다.
    - 이것은 모듈의 동작을 확장할 수 있다는 것을 의미한다. 애플리케이션의 요구사항이 변경될 때 이 변경에 맞게 새로운 동작을 추가해 모듈을 확장할 수 있다. 즉, 모듈이 하는 일을 변경할 수 있다.
- 수정에는 닫혀있다.
    - 어떤 모듈의 동작을 확장하는 것이 그 모듈의 소스 코드나 바이너리 코드의 변경으로 이어지는 것은 아니다. 그 모듈의 실행 가능한 바이너리 형태는 링크 가능한 리아브러리, DLL이나 자바의 .jar에서도 건드리지 않은 채로 남는다.

뭔가 해당 원칙이 모순적인것처럼 느껴진다. 해당 다형성을 기반한 개방-폐쇄 원칙의 핵심은 **추상화**다.

기존의 상속 기반 개방-폐쇄 원칙은 기존 클라이언트에 영향을 끼치지 않고 새로운 클라이언트를 위해 기존 클래스를 확장한다. 즉, 코드 재사용성이 목적인 셈이다. 반면 다형성을 기반한 개방-폐쇄 원칙은 클라이언트가 다양한 인터페이스 타입과 협력하는 것을 뜻한다. 즉, 기존 코드에는 영향을 주지 않고 같은 클라이언트가 협력할 새로운 타입의 인터페이스 구현체를 추가하는 것이다.

자세히 이 부분을 살펴보자. 전통적인 개방-폐쇄 원칙은 불안정한 구체 클래스에 의존하는 반면에 다형적인 개방-폐쇄 원칙은 안정적인 추상화에 의존한다. 여기서 전통적인 개방-폐쇄 원칙을 재사용을 위한 구현 상속이라고 하고 다형적 개방-폐쇄 원칙을 다형성을 위한 인터페이스 상속이라고 불린다. 다른 말로는 전통적인 개방-폐쇄 원칙을 서브 클래싱 혹은 합성으로 구현하며 다형적 개방-폐쇄 원칙을 서브 타이핑으로 구현한다라고 명명한다.

그러면 추상화를 상속받으면 문제가 없을까? 구체 클래스 `CallCollector`를 상속받는 `BillingCallCollector`가 있다고 존재하자. 이것을 `Collector`라는 인터페이스를 추출하여 추상화에 의존하도록 코드를 수정해보자.

``` java
package me.sungbin.call.calls;

public interface Collector {
    CallHistory collect(String phone);
}
```

``` java
package me.sungbin.call.calls;

import java.util.List;

public class CallCollector implements Collector {

    private Reader reader;

    public CallCollector(Reader reader) {
        this.reader = reader;
    }

    @Override
    public CallHistory collect(String phone) {
        CallHistory history = new CallHistory(phone);

        List<Call> calls = reader.read();

        for(Call call : calls) {
            if (call.from().equals(phone)) {
                history.append(call);
            }
        }

        return history;
    }
}
```

``` java
package me.sungbin.call.calls;

import java.time.Duration;

public class BillingCallCollector implements Collector {

    private CallCollector collector;

    public BillingCallCollector(CallCollector collector) {
        this.collector = collector;
    }

    @Override
    public CallHistory collect(String phone) {
        CallHistory history = collector.collect(phone);

        CallHistory result = new CallHistory(phone);

        for(Call call : history.calls()) {
            if (call.duration().compareTo(Duration.ofSeconds(10)) >= 0) {
                result.append(call);
            }
        }

        return result;
    }
}
```

``` java
package me.sungbin.call.calls;

import java.util.Optional;

import static java.util.Comparator.comparing;

public class LongestCallSelector {

    public Optional<Call> select(String phone, Collector collector) {
        return collector.collect(phone).calls().stream().max(comparing(Call::duration));
    }
}
```

그래도 테스트 코드를 작성하면 실패를 하게 된다. 의존성 주입을 `BillingCallCollector`로 하였을 때 통화 시간이 10초 미만이라면 수행하는 로직에서 10초 미만이 1건도 없기에 `null`이 발생하고 결국 `NPE`가 발생하기 때문이다. 즉, 다형성 기반의 개방-폐쇄 원칙은 컴파일 타임에서 확장 가능한 코드 설계가 가능하다. 이런 문제를 해결하기 위해서는 런타임에도 정상적으로 동작하도록 만들기 위한 원칙이 필요하다.

## 리스코프 치환 원칙

다형성을 기반으로 하는 개방-폐쇄 원칙은 새로운 클래스를 추가해도 기존 코드 수정 없이 컴파일 타임에 확장이 가능했다. 하지만 문제점은 클라이언트 입장에서 기대에 어긋나게 `BillingCallCollector`가 `Collector` 인터페이스를 치환하는 경우때문이다. 클라이언트 입장에서는 전체 통화 목록을 가져올 것을 기대하지만 `BillingCallCollector`로 치환되면 10초 이상의 통화 목록만 가져오기 때문에 우리가 원하는 결과가 나오질 못하는 것이다. 즉, 다형성을 기반으로 하는 개방-폐쇄 원칙은 안정적인 런타임 동작을 보장하지 않는다.

상속의 올바른 지침사항으로는 클라이언트 관점에서 기대하는 행동을 올바르게 수행하는 것이 올바른 상속이라고 말한다. 즉, 통화 시스템을 예로 들면 클라이언트는 전테 통화 목록을 반환하는 것을 기대를 하지만 `BillingCallCollector`가 `Collector` 대신 치환되는 경우에는 원하는 결과를 얻지를 못한다. 즉, `is-a` 관계가 성립되지를 못하는 것이다.

올바른 상속은 `is-a` 관계가 잘 성립이 되어야 하며 이런 괸계가 잘 성립된 것을 서브 타이핑 관계라고 한다. 서브 타이핑이란 클라이언트 관점에서 호환 가능한 두 타입 사이의 관계를 말하며 흔히 인터페이스 상속 관계라고 불리기도 한다. 서브 타이핑을 위한 설계 원칙으로 **리스코프 치환 원칙**이 존재한다.

리스코프 치환 원칙이란, 클라이언트 관점에서 서브타입은 기반타입을 치환할 수 있어야 하는 원칙을 뜻한다. 예를 들면, 어떤 함수 f가 그 인자로 포인터나 어떤 기반 클래스 B의 참조를 가진다고 해보자. 그리고 B의 어떤 파생 클래스 D가 B를 가장해 f에 넘겨져서 f가 잘못된 동작을 하도록 한다면 이 경우 D는 리스코프 치환 원칙을 어기는 것이다.

여기에서 요구되는 것은 다음과 같은 치환 특성이다. S형의 각 객체 o1에 대해 T형의 객체 o2가 하나가 있고, T에 의해 정의된 모든 프로그램 P에서 T나 S로 치환될 때, P의 동작이 변하지 않으면 S는 T의 하위타입이라 불린다.

즉, 리스코프 치환 원칙의 핵심은 클라이언트가 이전과 동일한 방식으로 동작하는지 여부가 중요하다고 생각한다. 리스코프 치환 원칙을 어기는 전형적인 패턴이 존재하는데 바로 `RTTI`와 같은 것을 사용하는 패턴이다. 대표적으로 `instanceof`와 같은 것을 들 수 있다. 바로 아래와 같은 코드가 안티 패턴인 것이다.

``` java
package me.sungbin.call.calls;

import me.sungbin.call.reader.CsvReader;
import me.sungbin.call.reader.JsonReader;

import java.util.ArrayList;
import java.util.List;

public class CallCollector implements Collector {

    private Reader reader;

    public CallCollector(Reader reader) {
        this.reader = reader;
    }

    @Override
    public CallHistory collect(String phone) {
        CallHistory history = new CallHistory(phone);

        List<Call> calls = new ArrayList<>();

        if (reader instanceof CsvReader) {
            calls = reader.read();
            System.out.println("CSV 포맷을 처리했습니다.");
        } else if (reader instanceof JsonReader) {
            calls = reader.read();
            System.out.println("JSON 포맷을 처리했습니다.");
        } else {
            throw new IllegalArgumentException(Reader.class + "는 처리할 수 없습니다.");
        }

        for(Call call : calls) {
            if (call.from().equals(phone)) {
                history.append(call);
            }
        }

        return history;
    }
}
```

만약 `Reader`를 구현받는 `XmlReader`가 새로 생길 경우 조건문을 하나 더 추가해 `instanceof`로 체킹을 진행해야 한다. 즉, 클라이언트 코드가 변경이 되는 것이다. 이렇게 되면 리스코프 치환 원칙을 어기게 되며, 개방-폐쇄 원칙도 어기게 되는 전형적인 안티패턴이다.

이를 해결하기 위해서는 클라이언트 관점에서 상속 계층의 전체 클래스를 테스트해야 한다.

## 리스코프 치환 원칙을 위한 가이드

리스코프 치환 원칙을 지키기 위한 가이드는 다음과 같다.

- 구체 메서드를 오버라아딩하지 마라. 즉, `super` 콜을 피하라.
- 빈 구현으로 오버라이딩하지 마라.
- 예외를 던지는 메서드로 오버라이딩하지 마라.

즉, 위의 원칙들을 잘 지키면서 설계를 하면 정규화된 계층이 완성된다. 즉, 계층 안의 어떤 클래스도 오직 하나의 메서드 구현만 포함되게 하면 되는 것이다.

만약 디스크에 저장된 csv와 json 포맷의 통화 기록을 redis에도 함께 저장해야한다는 요구사항이 왔다고 해보자. 현재 가장 쉬운 방법으로는 `AbstractReader` 추상 클래스를 상속 받은 `JsonReader`와 `CsvReader` 클래스를 각각 상속 받은 `JsonRedisReader`와 `CsvRedisReader` 클래스를 개발해야 할 것이다. 하지만 이런 방식은 비정규화된 계층 설계인 것이다. 그리고 이런 비정규화된 계층 설계는 2가지 문제점이 발생한다. 바로 중복 코드와 조합의 폭발적인 증가 문제이다.

예를 들어, xml 포맷의 통화 기록을 redis에도 함께 저장해야한다면 어떻게 할까? 아마 `XmlReader` 클래스를 상속받은 `XmlRedisReader`를 만들어야 할 것이다. 또한 이렇게 만든 구체 클래스들은 redis로부터 읽는 로직이 중복이 될 것이다. 또한 이렇게 기능이 추가될 때마다 클래스 개수가 점점 늘어나고 나중에는 관리하기도 힘들어질 것이다. 만약 redis뿐만 아니라 RDB에도 저장해야 한다면 엄청난 코드양이 발생할 것이다. 그리고 중복코드도 점차 증가하게 될 것이다.

이런 문제를 해결하기 위해서는 상속보다는 합성을 이용하는 방식이 권장된다. `AbstractReader`에 저장소 별로 읽어 들이는 로직인 `read` 구체 메서드와 포맷 종류 별로 달라지는 파싱 로직인 `parse`를 서로 분리하는 것이다. 바로 아래와 같이 말이다.

``` java
package me.sungbin.call.solution.calls;

import java.util.List;

public interface Reader {
    List<Call> read();
}
```

``` java
package me.sungbin.call.solution.calls;

import java.util.List;

public interface Parser {
    List<Call> parse(List<String> lines);
}
```

``` java
package me.sungbin.call.solution.calls;

import java.util.List;

public abstract class AbstractReader implements Reader {

    private String path;
    private Parser parser;

    public AbstractReader(String path, Parser parser) {
        this.path = path;
        this.parser = parser;
    }

    public List<Call> read() {
        List<String> lines = readLines(path);
        return parser.parse(lines);
    }

    abstract protected List<String> readLines(String path);
}
```

``` java
package me.sungbin.call.solution.reader;

import me.sungbin.call.solution.calls.Call;
import me.sungbin.call.solution.calls.Parser;
import me.sungbin.call.solution.calls.TimeInterval;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class CsvParser implements Parser {

    @Override
    public List<Call> parse(List<String> lines) {
        return lines.stream().map(this::parseCall).collect(Collectors.toList());
    }

    private Call parseCall(String line) {
        String[] tokens = line.split(",");
        return new Call(
                tokens[0].trim(),
                tokens[1].trim(),
                TimeInterval.of(
                        parseDateTime(tokens[2]),
                        parseDateTime(tokens[3])));
    }

    private LocalDateTime parseDateTime(String token) {
        return LocalDateTime.parse(token.trim(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
```

``` java
package me.sungbin.call.solution.reader;

import me.sungbin.call.solution.calls.AbstractReader;
import me.sungbin.call.solution.calls.Parser;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class FileReader extends AbstractReader {

    public FileReader(String path, Parser parser) {
        super(path, parser);
    }

    @Override
    protected List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

``` java
package me.sungbin.call.solution.reader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import me.sungbin.call.solution.calls.Call;
import me.sungbin.call.solution.calls.Parser;
import me.sungbin.call.solution.calls.TimeInterval;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class JsonParser implements Parser {

    @Override
    public List<Call> parse(List<String> lines) {
        CallHistoryRecord history = parseJson(lines);
        return history.calls().stream().map(call -> new Call(call.from, call.to, TimeInterval.of(call.start, call.end))).collect(Collectors.toList());
    }

    private CallHistoryRecord parseJson(List<String> lines) {
        try {
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            String json = String.join("", lines);
            JsonNode node = mapper.readTree(json.getBytes());

            return mapper.treeToValue(node, CallHistoryRecord.class);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    record CallHistoryRecord(List<CallRecord> calls) {
        record CallRecord(String from, String to, LocalDateTime start, LocalDateTime end) {
        }
    }
}
```

``` java
package me.sungbin.call.solution.reader;

import me.sungbin.call.solution.calls.AbstractReader;
import me.sungbin.call.solution.calls.Parser;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Arrays;
import java.util.List;

public class RedisReader extends AbstractReader {

    private JedisPool jedisPool;

    public RedisReader(String path, Parser parser, JedisPool jedisPool) {
        super(path, parser);
        this.jedisPool = jedisPool;
    }

    @Override
    protected List<String> readLines(String path) {
        try (Jedis jedis = jedisPool.getResource()) {
            String json = jedis.get(path);
            return Arrays.stream(json.split("\\n")).toList();
        }
    }
}
```

이렇게 저장소 별로 읽어들이는 책임과 파싱하는 책임을 분리함으로 단일 책임 원칙도 준수하게 되면서 `RedisReader`와 `CsvParser` 클래스 합성을 통하여 레디스에서 csv 포맷을 읽어 들이는 요구사항도 만족할 수 있게 된 것이다.

## 아이템 이동 로직 개선하기

그러면 위의 내용을 바탕으로 기존 게임 시스템을 개선해보자. 자세한 코드는 [강사님의 코드](https://github.com/eternity-oop/object-principle-08-06)를 참조해보자.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!