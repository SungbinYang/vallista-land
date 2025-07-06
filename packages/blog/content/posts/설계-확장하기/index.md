---
title: "[오브젝트] 설계 확장하기"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-07-06 17:34:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 더 많은 요구사항 추가하기

기존 게임 시스템에 새로운 요구사항이 왔다고 하자. 이제는 아이템을 파괴하는 기능도 필요하다고 한다. 아이템을 파괴하는 명령어를 내리면 해당 파괴할 아이템명을 가지고 해당 캐릭터 인벤토리에 있다면 파과히고 해당 방에 있다면 파괴하며 둘다 있을 경우 랜덤해서 파괴하게끔 설계하려고 한다. 이 로직을 잘 살펴보니 이전에 아이템 이동과 비슷한 로직이라는 것을 깨달을 수 있을 것이다. 이렇게 `Game` 클래스에 `DestroyItem` 메서드를 구현할 수 있어보인다. 바로 아래와 같이 말이다.

``` java
package me.sungbin.adventure.game;

import me.sungbin.adventure.game.command.Command;
import me.sungbin.adventure.game.command.CommandParser;
import me.sungbin.adventure.game.item.Carrier;
import me.sungbin.adventure.game.item.Item;
import me.sungbin.adventure.game.player.Player;
import me.sungbin.adventure.game.worldmap.Direction;

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
        switch (command) {
            case Command.Move move -> tryMove(move.direction());
            case Command.Look() -> showRoom();
            case Command.Help() -> showHelp();
            case Command.Quit() -> stop();
            case Command.Unknown() -> showUnknownCommand();
            case Command.Inventory() -> showInventory();
            case Command.Take take -> takeItem(take.item());
            case Command.Drop drop -> dropItem(drop.item());
            case Command.Destroy destroy -> destroyItem(destroy.item());
            case Command.Throw aThrow -> throwItem(aThrow.item());
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

    private void throwItem(String itemName) {
        transfer(player, player.worldMap(), itemName,
                itemName + "을(를) 어딘가로 던졌습니다.",
                itemName + "을(를) 던질 수 없습니다.");
    }

    private void transfer(Carrier source, Carrier target,
                          String itemName, String success, String fail) {
        Transfer transfer = new Transfer(source, target, itemName);

        if (transfer.isPossible()) {
            transfer.perform();
            io.showLine(success);
            return;
        }

        io.showLine(fail);
    }

    private void showInventory() {
        io.showLine(
                player.items().stream()
                        .map(Item::name)
                        .collect(Collectors.joining(", ", "인벤토리 목록: [ ", " ]")));
    }

    private void destroyItem(String itemName) {
        Destroy destroy = new Destroy(player, player.currentRoom(), itemName);
        if (destroy.isPossible()) {
            destroy.perform();
            io.showLine(itemName + "을(를) 파괴했습니다.");
            return;
        }

        io.showLine(itemName + "을(를) 파괴할 수 없습니다.");
    }
}
```

``` java
package me.sungbin.adventure.game;

import me.sungbin.adventure.game.item.Carrier;
import me.sungbin.adventure.game.item.Item;

import java.util.Random;

public class Destroy {

    private Carrier first;
    private Carrier second;
    private String itemName;

    public Destroy(Carrier first, Carrier second, String itemName) {
        this.first = first;
        this.second = second;
        this.itemName = itemName;
    }

    public boolean isPossible() {
        return contains(first) || contains(second);
    }

    public void perform() {
        if (!isPossible()) {
            throw new IllegalStateException();
        }

        if (contains(first)) {
            first.remove(new Item(itemName));
            return;
        }

        if (contains(second)) {
            second.remove(new Item(itemName));
            return;
        }

        if (contains(first) && contains(second)) {
            if (new Random().nextInt(2) == 0) {
                first.remove(new Item(itemName));
            } else {
                second.remove(new Item(itemName));
            }
        }
    }

    private boolean contains(Carrier carrier) {
        return carrier.find(itemName).isPresent();
    }
}
```

`Destroy` 클래스는 기존 `Transfer`와 유사한 로직이다. 이제 사용자로부터 명령어를 받는 부분을 작성해보자. 기존 `Command` 인터페이스에 레코드를 추가해주고 `CommandParser`에 추가를 해주면 될 듯 보인다.

``` java
package me.sungbin.adventure.game.command;

import me.sungbin.adventure.game.worldmap.Direction;

public sealed interface Command {
    record Move(Direction direction) implements Command {
    }

    record Unknown() implements Command {
    }

    record Look() implements Command {
    }

    record Help() implements Command {
    }

    record Quit() implements Command {
    }

    record Inventory() implements Command {
    }

    record Take(String item) implements Command {
    }

    record Drop(String item) implements Command {
    }

    record Destroy(String item) implements Command {
    }

    record Throw(String item) implements Command {
    }
}
```

``` java
package me.sungbin.adventure.game.command;

import me.sungbin.adventure.game.worldmap.Direction;

public class CommandParser {

    public Command parseCommand(String input) {
        return parseCommand(split(input));
    }

    private Command parseCommand(String[] commands) {
        return switch (commands[0]) {
            case "go" -> switch (commands[1]) {
                case "north" -> new Command.Move(Direction.NORTH);
                case "south" -> new Command.Move(Direction.SOUTH);
                case "east" -> new Command.Move(Direction.EAST);
                case "west" -> new Command.Move(Direction.WEST);
                default -> new Command.Unknown();
            };
            case "inventory" -> new Command.Inventory();
            case "take" -> new Command.Take(commands[1]);
            case "drop" -> new Command.Drop(commands[1]);
            case "destroy" -> new Command.Destroy(commands[1]);
            case "throw" -> new Command.Throw(commands[1]);
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

이렇게 설계를 마치니 `Transfer` 클래스와 `Destroy` 클래스는 `Carrier` 인터페이스에 의존하게 된 것이다. 하지만 문제는 `Carrier` 인터페이스에 정의한 메서드 전부에 의존하는게 아닌 일부만 참조하고 있는 것이 문제인 것이다. 현재 `Transfer` 클래스는 `find`, `remove`, `add` 메서드에만 의존하고 있으며, `Destroy` 클래스는 `find`와 `remove` 메서드에 의존하게 된다. 또한 `Game` 클래스도 `Carrier`의 인터페이스의 `items`에만 의존한다. 즉, 서로 다른 클라이언트가 인테페이스 부분의 의존한다는 것이다. 이렇게 된 설계는 확장되기 어려운 설계 기법이다. 이것을 조금 더 절실히 깨닫기 위해 새로운 요구사항을 추가해보도록 하자.

이번 추가할 신규 기능은 기존 캐릭터에 보유한 아이템을 특정 위치 방에 던지고, 만약 존재하지 않는 위치의 방이라면 아이템이 제거되게끔 구현해보려 한다. 이것을 조금 풀어보면 캐릭터의 인벤토리의 아이템을 먼저 월드맵에 전달하고, 그 월드 맵안에 분포된 방에 랜덤하게 선택하여 방으로 이동시키게 하면 될 것 같다. 이것을 설계를 해보면 캐릭터 인벤토리에서 월드맵으로 이동할 때는 `Transfer` 클래스 로직을 재사용하면 좋을 것 같다. 즉, `Transfer`의 source가 플레이어 인벤토리, target이 월드맵이 될 것이다. 이렇게 사용하기 위해선 월드맵이 `Carrier` 인터페이스를 구현해야 할 것이다. 하지만, 문제는 여기서 나오는데 `WorldMap` 클래스에 필요한 부분은 여전히 `Carrier` 인터페이스의 `add` 부분뿐이다. 나머지 기능은 필요가 없는 것이다. 하지만 해당 인터페이스를 구현해야 하므로 빈 껍떼리라도 구현은 해야할 것이다. 이런 문제 즉, 리스코프 치환 원칙이 위배되는 상황이 발생된다.

## 인터페이스 분리 원칙

인터페이스 분리 원칙에 적합한 예시 시스템을 한번 보고자 한다. 우리는 특정 기간 사이에 포함된 월요일, 화요일 날짜를 구하고 싶은 시스템을 만든다고 가정하자. 그럼 먼저 기간을 표현하게 아래와 같이 기간 관련 클래스를 개발할 것이다.

``` java
package me.sungbin.event.problem;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.stream.Stream;

public class DateInterval {

    private LocalDate start;
    private LocalDate end;

    public static DateInterval between(LocalDate start, LocalDate end) {
        return new DateInterval(start, end);
    }

    private DateInterval(LocalDate start, LocalDate end) {
        this.start = start;
        this.end = end;
    }

    public Stream<LocalDate> stream() {
        return Stream.iterate(start, date -> date.plusDays(1))
                .limit(start.until(end, ChronoUnit.DAYS)+1);
    }

    public Collection<LocalDate> filter(RecurringPlan fliter) {
        return fliter.apply(this);
    }
}
```

그리고 기간 내 필터링 조건이 필요하므로 새로운 인터페이스를 만들까 하였다. 하지만 기존 시스템에 데일리 스크럼처럼 반복 일정 코드가 존재하였으므로 해당 코드를 재사용하기로 한다. 즉, `RecurringPlan`에 해당 필터링 조건 메서드만 추가해주면 좋을 듯 보인다.

``` java
package me.sungbin.event.problem;

import java.time.LocalDate;
import java.util.Collection;

public interface RecurringPlan {
    boolean includes(LocalDate day);

    RecurringPlan reschedule(LocalDate day);

    Collection<LocalDate> apply(DateInterval interval);
}
```

``` java
package me.sungbin.event.problem;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collection;

public class MonthlyPlan implements RecurringPlan {

    private static final int DAYS_IN_WEEK = 7;

    private DayOfWeek dayOfWeek;
    private Integer ordinal;

    public MonthlyPlan(DayOfWeek dayOfWeek, Integer ordinal) {
        this.ordinal = ordinal;
        this.dayOfWeek = dayOfWeek;
    }

    @Override
    public boolean includes(LocalDate day) {
        if (!day.getDayOfWeek().equals(dayOfWeek)) {
            return false;
        }

        return (day.getDayOfMonth() / DAYS_IN_WEEK) + 1 == ordinal;
    }

    @Override
    public MonthlyPlan reschedule(LocalDate day) {
        return new MonthlyPlan(
                day.getDayOfWeek(),
                (day.getDayOfMonth() / DAYS_IN_WEEK) + 1);
    }

    @Override
    public Collection<LocalDate> apply(DateInterval interval) {
        throw new UnsupportedOperationException();
    }
}
```

``` java
package me.sungbin.event.problem;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class WeeklyPlan implements RecurringPlan {

    private Set<DayOfWeek> dayOfWeeks;

    public WeeklyPlan(Set<DayOfWeek> dayOfWeeks) {
        this.dayOfWeeks = dayOfWeeks;
    }

    @Override
    public boolean includes(LocalDate day) {
        return dayOfWeeks.contains(day.getDayOfWeek());
    }

    @Override
    public WeeklyPlan reschedule(LocalDate day) {
        var copy = new HashSet<>(dayOfWeeks);
        copy.add(day.getDayOfWeek());
        return new WeeklyPlan(copy);
    }

    @Override
    public Collection<LocalDate> apply(DateInterval interval) {
        return interval.stream()
                .filter(this::includes)
                .collect(Collectors.toSet());
    }
}
```

하지만 여기서 문제가 발생하였다. `MonthlyPlan`에서 `apply`는 굳이 필요없고 사용해서도 안된다. 하지만 하나의 인터페이스에 새로 정의되었으므로 반드시 구현해야 하므로 해당 메서드를 호출하면 예외가 발생하도록 정의를 하였다. 즉, 반복 일정 로직을 사용하고자 코드 재사용 목적으로 인터페이스를 재활용한 것은 좋으나 이런 사이드 이펙트가 발생한 셈이다. 이런것을 인터페이스 오염이라고 부르며 해당 용어의 정의는 인터페이스에 사용되지 않는 불필요한 오퍼레이션이 포함되어 있다라는 의미이기도 하다. 또한 해당 부분은 리스코프 치환 원칙도 위배를 한다. `RecurringPlan`에 만약 메서드 시그니쳐가 변경이 된다면 `DateInterval`도 변경이 되어야 하지만 `WeeklyPlan`과 `MonthlyPlan`에도 영향을 끼치게 된다. 즉, 변경에 취약하다.

이를 위해 해당 조건 필터링 메서드를 하나의 인터페이스로 분리 후, 아래와 같이 작성을 하는 방법이다.

``` java
package me.sungbin.event.solution;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.stream.Stream;

public class DateInterval {

    private LocalDate start;
    private LocalDate end;

    public static DateInterval between(LocalDate start, LocalDate end) {
        return new DateInterval(start, end);
    }

    private DateInterval(LocalDate start, LocalDate end) {
        this.start = start;
        this.end = end;
    }

    public Stream<LocalDate> stream() {
        return Stream.iterate(start, date -> date.plusDays(1))
                .limit(start.until(end, ChronoUnit.DAYS)+1);
    }

    public Collection<LocalDate> convert(TemporalFilter filter) {
        return filter.apply(this);
    }
}
```

``` java
package me.sungbin.event.solution;

import java.time.LocalDate;

public interface RecurringPlan {
    boolean includes(LocalDate day);

    RecurringPlan reschedule(LocalDate day);
}
```

``` java
package me.sungbin.event.solution;

import java.time.LocalDate;
import java.util.Collection;

@FunctionalInterface
public interface TemporalFilter {
    Collection<LocalDate> apply(DateInterval interval);
}
```

``` java
package me.sungbin.event.solution;

import java.time.DayOfWeek;
import java.time.LocalDate;

public class MonthlyPlan implements RecurringPlan {

    private static final int DAYS_IN_WEEK = 7;

    private DayOfWeek dayOfWeek;
    private Integer ordinal;

    public MonthlyPlan(DayOfWeek dayOfWeek, Integer ordinal) {
        this.ordinal = ordinal;
        this.dayOfWeek = dayOfWeek;
    }

    @Override
    public boolean includes(LocalDate day) {
        if (!day.getDayOfWeek().equals(dayOfWeek)) {
            return false;
        }

        return (day.getDayOfMonth() / DAYS_IN_WEEK) + 1 == ordinal;
    }

    @Override
    public MonthlyPlan reschedule(LocalDate day) {
        return new MonthlyPlan(
                day.getDayOfWeek(),
                (day.getDayOfMonth() / DAYS_IN_WEEK) + 1);
    }
}
```

``` java
package me.sungbin.event.solution;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class WeeklyPlan implements RecurringPlan, TemporalFilter {

    private Set<DayOfWeek> dayOfWeeks;

    public WeeklyPlan(Set<DayOfWeek> dayOfWeeks) {
        this.dayOfWeeks = dayOfWeeks;
    }

    @Override
    public boolean includes(LocalDate day) {
        return dayOfWeeks.contains(day.getDayOfWeek());
    }

    @Override
    public WeeklyPlan reschedule(LocalDate day) {
        var copy = new HashSet<>(dayOfWeeks);
        copy.add(day.getDayOfWeek());
        return new WeeklyPlan(copy);
    }

    @Override
    public Collection<LocalDate> apply(DateInterval interval) {
        return interval.stream()
                .filter(day -> includes(day))
                .collect(Collectors.toSet());
    }
}
```

`MonthlyPlan`은 `RecurringPlan`만 구현하고 `WeeklyPlan`은 `RecurringPlan`과 `TemporalFilter` 둘다를 구현하면 되는 것이다. 여기서 중요한 핵심은 인터페이스의 수정 원인은 반드시 클라이언트여야 한다는 사실이다. 인터페이스 변경의 원인은 또한 오직 하나여야 한다.

> 📚 인터페이스 분리 원칙
>
> 클라이언트가 자신이 사용되지 않는 메서드에 의존하도록 강제해서는 안된다. 어떤 클라이언트가 자신은 사용하지 않지만 다른 클래스가 사용하는 메서드를 포함하는 클래스에 의존할 때, 그 클라이언트는 다른 클라이언트가 그 클래스에 가하는 변경에 영향을 받게 된다.

이렇게 인터페이스를 분리하게 되면 인터페이스 수준의 단일 책임 원칙을 만족(인터페이스 변경 이유는 하나의 이유여야 한다.)시키며 의존성 역전 원칙도 만족(상위 수준 모듈과 하위 수준 모듈 전부 추상화에 의존한다.)하게 된다. 또한, 리스코프 치환 원칙도 만족하게 되고, 개방-폐쇄 원칙도 만족하게 되니, 인터페이스 분리 원칙은 실무에서도 적극 권장된다.

## 인터페이스 분리하기

그럼 기존 게임 시스템 코드를 인터페이스 분리 원칙을 이용하여 변경해보자. 코드는 [강사님 코드](https://github.com/eternity-oop/object-principle/tree/main/object-principle-09-03)를 참조해보자.

## 책임 정리하기

이제 완성된 게임 시스템을 살펴보자. 살펴보면 현재 `Game` 클래스에 너무 많은 책임을 가지고 있다는 것을 알 수 있을 것이다. 특히나 `Game`에는 다양한 명령어 실행 로직이 존재한다. 이 명령어 로직은 `Player` 객체의 메서드를 호출한다. 이런게 뭔가 `Game`의 책임이 아닌 듯 보인다. 이것을 다른 별도 클래스로 분리하면 `Game` 클래스의 책임이 게임 실행 책임만 맡게 될 것이다. 또한 `showHelp` 메서드도 `Game` 클래스의 책임이라고 하기에는 뭐하다. 해당 부분은 명령어가 추가될 때마다 추가가 되어야 하기에 `CommandParser`로 변경하면 좋지 않을까? 한번 변경해보자. 코드는 [강사님 코드](https://github.com/eternity-oop/object-principle/tree/main/object-principle-09-04)를 참조해보자.

## 실행 환경 확장하기

지금까지 터미널에 작동되는 콘솔 게임을 gui로 변경해보자. 코드는 [강사님 코드](https://github.com/eternity-oop/object-principle/tree/main/object-principle-09-05)를 살펴보자.

## 중복 코드 제거하기

이제 기존 게임 시스템의 중복 코드를 부분을 제거하자. 해당 내용은 대표적인 리팩토링 내용으로 코드로 대체하겠다.

[강사님 코드](https://github.com/eternity-oop/object-principle/tree/main/object-principle-09-06)

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!