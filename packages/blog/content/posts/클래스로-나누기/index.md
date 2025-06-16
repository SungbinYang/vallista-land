---
title: "[오브젝트] 클래스로 나누기"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-17 07:13:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 단일 책임 원칙

이번에는 클래스를 작게 쪼개는 방법 중 **단일 책임 원칙**에 대해 학습해보자. 예제가 하나 있다고 하자. 이 예제는 일정을 구현하는데 있어서 월간 회의와 같은 것을 등록할 수 있는 스케줄 클래스를 만들어보자.

해당 클래스는 무슨 회의인지 제목이 존재하며, 어느 간격으로 무슨 요일에 몇시부터 몇 시간을 해야할지 해당 정보를 포함해야 한다. 또한 특정 날짜가 이 회의인지 판단하는 로직도 포함해야 하며 JSON 포맷으로 변환하는 기능도 존재한다고 해보자. 그러면 아마 아래와 같이 코드가 작성될 것이다.

``` java
package me.sungbin.problem;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

public class Schedule {

    private static final int DAYS_IN_WEEK = 7;

    private String title;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime from;

    @JsonFormat(pattern = "MINUTES")
    private Duration duration;

    private Integer ordinal;

    private DayOfWeek dayOfWeek;

    public Schedule(String title, LocalTime from, Duration duration, Integer ordinal, DayOfWeek dayOfWeek) {
        this.title = title;
        this.from = from;
        this.duration = duration;
        this.ordinal = ordinal;
        this.dayOfWeek = dayOfWeek;
    }

    public boolean includes(LocalDate day) {
        if (!day.getDayOfWeek().equals(dayOfWeek)) {
            return false;
        }

        return (day.getDayOfMonth() / DAYS_IN_WEEK) + 1 == ordinal;
    }

    public String toJson() throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

        return mapper.writeValueAsString(this);
    }
}
```

이렇게 작성된 클래스가 적당한 크기의 클래스일까? 이 여부를 판단하기 위해 우리는 단일 책임 원칙을 적용해볼 수 있을 것이다.

> 📚 용어 정리
>
> 단일 책임 원칙: 클래스는 단 한가지만의 이유로 변경되어야 한다. 여기서 책임은 책임 주도 개발의 책임보다 넓은 범위이다.

단일 책임 원칙은 응딥도와 관련이 있다. 높은 응집도를 이룰 수록 단일 책임 원칙을 잘 지키는 것이라고 볼 수 있다. 즉, 변경의 이유로 클래스를 분히하자는 것이 핵심이다. 그럼 왜 변경의 이유로 클래스를 분리할까? 만약 서로 다른 책임으로 변경되어야 하는 로직이 같은 모듈에 있는 낮은 응집도를 보이는 클래스가 존재한다고 해보자. 그러면 각 개발자들이 변경의 이유가 다른 로직을 서로 개발을 진행할 것이다. 그러다 보면 A개발자가 개발하는 코드에 영향을 끼칠 수도 있고 자칫하면 서로 같은 코드를 동시에 수정하는 문제도 발생할 것이다. 즉, 서로 상관 없는 변경으로 인해 영향을 받는 것이다. 이런 부수효과로 인한 버그를 해결하는 유일한 방법은 클래스를 변경의 이유로 분리하는 것이다. 그러면 서로 코드에 영향을 줄 일이 없고 같은 코드를 동시에 수정하는 일도 발생하지 않을 것이다. 즉, 변경으로 인한 파급효과를 제어할 수 있다.

단일 책임 원칙은 결합도와도 관련이 있다. 낮은 결합도를 이룰 수록 단일 책임 원칙을 잘 지키는 것이라고 볼 수 있다. 서로 다른 이유의 코드 묶음은 서로 다른 작업을 처리하기에 서로 다른 클래스에 의존하기 마련이다. 의존의 방향은 변경의 방향의 반대이므로 서로 다른 클래스의 수정으로 인한 변경의 영향이 미칠 것이다. 즉, 의존하는 객체의 변경으로 인한 부수효과가 발생할 것이다. 의존하는 클래스가 많을 수록 변경과 충돌의 빈도가 증가할 것이다. 해당 문제를 해결하는 방법으로는 변경의 이유에 따라 클래스를 분리하여 의존하는 객체도 분리시키는 것이다. 이렇게 하면 결합도를 낮추게 되고 의존 객체의 수정 여파를 각 클래스가 흡수하여 파급 효과를 제어할 수 있다.

그러면 위의 `Schedule` 클래스는 여러 변경의 이유가 있다. JSON 포맷으로 변경하는 로직은 일단 `ObjectMapper`를 의존하고 있으며 `includes` 메서드 또한 `validation` 어노테이션이 붙은 필드를 의존하고 있다. 이런 문제를 클래스를 아래와 같이 분리하면 파급효과를 막을 수 있을 것이다.

``` java
package me.sungbin.solution;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

public class Schedule {

    private static final int DAYS_IN_WEEK = 7;

    private String title;

    private LocalTime from;

    private Duration duration;

    private DayOfWeek dayOfWeek;

    private Integer ordinal;

    public Schedule(String title, LocalTime from, Duration duration, Integer ordinal, DayOfWeek dayOfWeek) {
        this.title = title;
        this.from = from;
        this.duration = duration;
        this.ordinal = ordinal;
        this.dayOfWeek = dayOfWeek;
    }

    public boolean includes(LocalDate day) {
        if (!day.getDayOfWeek().equals(dayOfWeek)) {
            return false;
        }

        return (day.getDayOfMonth() / DAYS_IN_WEEK) + 1 == ordinal;
    }
}
```

``` java
package me.sungbin.solution;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.Duration;
import java.time.LocalTime;

public class ScheduleJson {

    private Schedule schedule;
    
    private ObjectMapper mapper;

    public ScheduleJson(Schedule schedule) {
        this.schedule = schedule;
        this.mapper = initializeMapper();
    }

    private ObjectMapper initializeMapper() {
        ObjectMapper mapper = new ObjectMapper();

        mapper.registerModule(new JavaTimeModule());
        mapper.configOverride(Duration.class).setFormat(JsonFormat.Value.forPattern("MINUTES"));
        mapper.configOverride(LocalTime.class).setFormat(JsonFormat.Value.forPattern("HH:mm"));
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

        return mapper;
    }

    public String toJson() throws JsonProcessingException {
        return mapper.writeValueAsString(schedule);
    }
}
```

이렇게 클래스를 분리하여 부수효과를 예방할 수 있었다. 하지만 단일 책임 원칙은 쉽게 적용하기 힘들다. 또한 요구사항이 변경되면 기능도 달라 질 것이고 이에따라 책임도 달라지기에 쉽게 적용이 힘들다.

## 단일 책임 원칙을 위한 가이드

이런 어려움으로 인하여 단일 책인 원칙을 적용할 만한 가이드가 존재한다. 가이드는 아래와 같다.

- [가이드1] 책임을 한 문장으로 적어본다.
  - 클래스의 책임을 설명하는데 '그리고'나 '또는'이 들어가면 여러개의 책임을 담당하는 클래스이다.
- [가이드2] 메서드를 분류한다.
  - 이름이나 목적이 비슷한 메서드들을 그룹으로 묶어 나열한다. 이 메서드 그룹별로 클래스들을 나눌 수 있는지 살펴본다.
- [가이드3] 인스턴스 변수와 메서드 사이의 관계에 대해 살펴본다.
  - 일부 인스턴스 변수가 일부 메서드에 의해서만 사용되는지 살펴본다.
- [가이드4] 서로 배타적으로 초기화되는 인스턴스 변수가 있는지 살펴본다.
  - 이런 변수들이 초기화될 때 함께 초기화되지 않는 인스턴스 변수들이 있는지 살펴본다.
- [가이드5] 테스트하고 싶은 private 메서드가 있는지 살펴본다.
  - 너무 많은 private(또는 protected) 메서드가 있을 때 테스트하고 싶은 private 메서드가 존재하는지 살펴본다.
- [가이드6] 외부 의존성을 찾는다.
  - 데이터베이스 연결이나 외부 시스템과의 연동 등과 같이 외부에 위치하는 불안정한 의존성을 찾는다.

기존 `Schedule`에서는 JSON으로 변환하는 기능과 일정체크 기능 두가지 책임을 가지고 있었다. 즉, 가이드1에 위배된다. 또한 기능을 수정할 때마다 각 메서드를 수정하고 수정하다보니 각 메서드간의 영향도 끼칠 수 있다. 또한 가이드6에 의해 `ObjectMapper`라는 클래스에 너무 의존적이다. 그래서 책임과 의존성을 기준으로 `ScheduleJson` 클래스로 분리를 하였다.

그런데 단일 책임 원칙도 요구사항이 변경이 되면 책임의 범위도 요구사항에 따라 변경이 된다. 만약 월간 회의뿐만 아니라 데일리 스크럼이 열린다면 어떻게 될까? 아마 데일리 스크럼용 생성자도 추가를 하고 `include` 메서드에 조건문을 두어서 월간회의용 로직과 데일리 스크럼 로직을 분리할 것이다. 하지만 이러면 또한 여러 책임이 하나의 클래스에 있는 것으로 응집도가 낮을 것이다. 이때 가이드4를 적용해볼 수 있다. 지금 월간회의용 생성자와 데일리 스크럼용 생성자가 분리되어 있다. 또한 가이드3을 이용하여 기존 `include` 메서드에 조건문으로 분기처리된 것을 메서드로 추출을 하여 조합 메서드로 변경이 가능할 것이다. 그런데 이렇게 보면 특정 인스턴스 변수가 특정 메서드에만 속하게 된다는 사실을 볼 수 있을 것이다. 즉 이것을 클래스로 분리할 수 있고 같은 기능을 제공하니 인터페이스로 두어 추상화를 시킬 수 있을 것이다. 그러면 아마 아래와 같이 작성이 될 것이다.

``` java
package me.sungbin.solution;

import java.time.LocalDate;

public interface RecurringPlan {
    boolean includes(LocalDate day);
}
```

``` java
package me.sungbin.solution;

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
}
```

``` java
package me.sungbin.solution;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

public class WeeklyPlan implements RecurringPlan {

    private Set<DayOfWeek> dayOfWeeks;

    public WeeklyPlan(Set<DayOfWeek> dayOfWeeks) {
        this.dayOfWeeks = dayOfWeeks;
    }

    @Override
    public boolean includes(LocalDate day) {
        return dayOfWeeks.contains(day.getDayOfWeek());
    }
}
```

``` java
package me.sungbin.solution;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

public class Schedule {

    private String title;

    private LocalTime from;

    private Duration duration;

    private RecurringPlan plan;

    public Schedule(String title, LocalTime from, Duration duration, RecurringPlan plan) {
        this.title = title;
        this.from = from;
        this.duration = duration;
        this.plan = plan;
    }

    public boolean includes(LocalDate day) {
        return plan.includes(day);
    }
}
```

``` java
package me.sungbin.solution;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.time.Duration;
import java.time.LocalTime;

public class ScheduleJson {

    private Schedule schedule;

    private ObjectMapper mapper;

    public ScheduleJson(Schedule schedule) {
        this.schedule = schedule;
        this.mapper = initializeMapper();
    }

    private ObjectMapper initializeMapper() {
        ObjectMapper mapper = new ObjectMapper();

        mapper.registerModule(new JavaTimeModule());
        mapper.configOverride(Duration.class).setFormat(JsonFormat.Value.forPattern("MINUTES"));
        mapper.configOverride(LocalTime.class).setFormat(JsonFormat.Value.forPattern("HH:mm"));
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.NONE);
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

        return mapper;
    }

    public String toJson() throws JsonProcessingException {
        return mapper.writeValueAsString(schedule);
    }
}
```

이렇게 함께 사용되는 인스턴스 변수와 메서드를 그루핑 하고 이것을 클래스로 만들었다. 또한 다형성을 활용하고자 인터페이스를 추가하였다. 이렇게 분리하니 책임이 분리되는 것을 느낄 수 있었다. 일정 기본 정보가 변경될 때는 `Schedule` 클래스를 수정하면 되고 일정을 확인하는 오퍼레이션이 변경될 때는 `RecurringPlan` 인터페이스를 월간회의나 데일리 스크럼 일정 확인 로직이 변경될 때는 각 구현 클래스에서 수정을 하면 되는 것이다.

## 클래스 나누기

그러면 해당 가이드를 이용해 기존 게임 클래스를 리팩토링 해보자. 먼저 가이드1과 2를 이용해 초인부터 잡고 시작하는 것을 추천한다. 다음으로 가이드3과 4에 따라 책임을 분리 후 가이드5와 6에 따라 추가적인 책임을 분리해보면 더욱 좋을 것이다.

먼저 가이드1에 따라 기존 게임 클래스를 정의하면 아래와 같다.

> 게임이 종료될때까지 루프를 실행하고 사용자에게 입력을 받고 입력을 파싱하고 명령을 처리하고 처리 결과를 출력한다.

다음으로 가이드2를 이용하여 유사한 메서드 그룹으로 분리해보자. 그러면 아래와 같이 나올 것이다.

- 흐름 제어
- 플레이어 이동
- 지도 구조 관리
- 사용자 입력
- 명령어 파싱
- 화면 출력

책임을 정리한 문장과 메서드 분류는 작업 방향을 정하기 위한 스케치이다.

다음으로 가이드3을 이용하여 인스턴스 변수와 메서드 사이의 관계를 살펴보자. 먼저 인스턴스 변수를 나열 후, 인스턴스 변수를 사용하는 메서드를 연결해보자. 다음으로 메서드 호출 경로까지 이어주면 어느정도 그루핑이 될 것이다. 여기서는 `size`와 `rooms`를 하나의 그룹으로 묶을 수 있을 듯 보인다. 해당 인스턴스 변수를 사용하는 메서드들을 보니 지도 구조 관리 카테고리에 속하는 것이다. 이것을 우리는 `WorldMap`이라는 클래스로 분리하여 사용할 수 있다. 아래와 같이 말이다.

``` java
package me.sungbin.adventure;

public class WorldMap {

    private Size size;

    private Room[] rooms;

    public WorldMap(Size area, Room ... rooms) {
        this.size = area;
        this.rooms = new Room[size.area()];
        for(Room room : rooms) {
            this.rooms[size.indexOf(room.position())] = room;
        }
    }

    public boolean isBlocked(Position position) {
        return isExcluded(position) || roomAt(position) == null;
    }

    private boolean isExcluded(Position position) {
        return !size.contains(position);
    }

    public Room roomAt(Position position) {
        return rooms[size.indexOf(position)];
    }
}
```

``` java
package me.sungbin.adventure;

import java.util.Scanner;

public class Game {

    private WorldMap worldMap;

    private Position position;

    private boolean running;

    public Game() {
        this.position = Position.of(0, 2);
        this.worldMap = new WorldMap(
                Size.with(2, 3),
                new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.")
        );
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
        System.out.println("당신은 [" + worldMap.roomAt(position).name() + "]에 있습니다.");
        System.out.println(worldMap.roomAt(position).description());
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
        if (worldMap.isBlocked(position.shift(direction))) {
            showBlocked();
        } else {
            position = position.shift(direction);
            showRoom();
        }
    }
}
```

## 테스트 관점에서 분리하기

지금까지 단일 책임 원칙에 따라 `WorldMap` 클래스로 분리함으로 각각의 책임소재가 분명해졌다. 이렇게 책임이 분리되면서 기존 `private` 메서드가 이 과정에서 다른 클래스 `public` 메서드로 변경됨으로 테스트하기도 용이해졌다. 즉, 단일 책임 원칙은 테스트 가능성 또한 개선되는 작업이기도 하다. 이제 남은 기능들을 리팩토링 해보자. 플레이어 이동이 잘 되는지도 뭔가 테스트를 해보면 좋을 것 같고 사용자 명령어 파싱 또한 테스틑를 해보면 좋을 것 같아 보인다. 일단 먼저 사용자 명령어 파싱이 잘 되는지 테스트를 해보려고 한다. 하지만 기존 `Game` 클래스의 명령어를 파싱하는 `parseCommand` 메서드가 `private`으로 테스트하기 힘들다. 이럴때는 새로운 클래스로 옮겨서 `public`으로 변환해주면 좋을 것 같다. `CommandParser`를 만들어서 `parseCommand`를 옮겨보자. 그러다 보니 안에서 실행하는 `tryMove` 메서드도 `public`으로 변경해야 한다는 단점이 존재하고 결귝 캡슐화 원칙에 깨지게 된다. 또한 `Game`과 `CommandParser` 두 클래스 전부 서로를 참조하는 양방향 관계가 되버리기 때문에 더 안 좋아지게 된다. 즉, 하나가 변경되더라도 둘다 변경되는 파급효과를 부르기 때문이다. 이런 문제를 해결하기 위해서는 DB처럼 중간 객체를 두는 방법이 바람직하다. 그리고 기존 `CommandParser`에서 우리가 테스트 하고 싶은 부분과 아닌 부분을 분리해보기로 하였다. 우리가 원하는 로직은 입력이 제대로 되는지 파싱 로직일 뿐이다. 즉, `Command`라는 객체를 만들어서 파싱결과를 나타내고 `Game`클래스에서는 `Command` 실행로직을 추가하면 될 것 같다. 바로 아래와 같이 말이다.

``` java
package me.sungbin.adventure;

public sealed interface Command {

    record Move(Direction direction) implements Command {}

    record Unknown() implements Command {}

    record Look() implements Command {}

    record Help() implements Command {}

    record Quit() implements Command {}
}
```

``` java
package me.sungbin.adventure;

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

``` java
package me.sungbin.adventure;

import java.util.Scanner;

public class Game {

    private WorldMap worldMap;

    private Position position;

    private CommandParser commandParser;

    private boolean running;

    public Game() {
        this.position = Position.of(0, 2);
        this.worldMap = new WorldMap(
                Size.with(2, 3),
                new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.")
        );
        this.commandParser = new CommandParser();
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
        System.out.println("당신은 [" + worldMap.roomAt(position).name() + "]에 있습니다.");
        System.out.println(worldMap.roomAt(position).description());
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
        if (worldMap.isBlocked(position.shift(direction))) {
            showBlocked();
        } else {
            position = position.shift(direction);
            showRoom();
        }
    }
}
```

## 의존성을 기준으로 분리하기

이제 `tryMove` 메서드를 단일 책임 원칙을 적용해보자. 가이드5에 따라 테스트하고 싶은 `private` 메서드가 있는지 살펴본다. 해당 메서드는 플레이어라는 객체가 직접 처리하는게 올바를 책임 이동일 것이다. 이렇게 `Player`라는 객체로 이동될 때 인스턴스 변수와 메서드도 같이 이동해야 한다. 이럴때 가이드3을 참조해본다. `tryMove`를 `Player`로 이동을 한다면 `tryMove`가 참조하는 인스턴스 변수도 이동시킨다. 그럼 해당 인스턴스 변수를 참조하는 메서드도 같이 이동한다. 그리고 기존 `Game`은 `Player`를 참조하도록 한다.

그러면 `Player`는 적절한 설계를 하였을까? 이럴때는 테스트 코드를 작성해서 클래스 품질을 한번 확인해보는 것이 좋다. 지금 현재는 이동 로직의 결과로 콘솔 출력이라는 부수효과가 검증된다. 즉, 현재는 player의 상태를 변경하는 로직이지면 결과가 콘솔이 문자열을 출력하는 관계가 어색하다. 이런 픽스처 상태를 기반으로 테스트 결과를 예측하기 어렵다. 문제의 원인은 제어하기 어려운 외부 콘솔의 결과를 출력한다는 것이다. 즉, 메서드 내부에 콘솔이라는 외부 의존성이 생긴 것이다. 이런 외부 의존성과 관련된 책임을 하나의 내부 클래스로 캡슐화 하는 것이 좋다.

플레이어는 이동만 책임하게 하고 콘솔 관련 로직은 전부 다시 `Game`으로 옮긴다. 하지만 플레이어가 `Game`을 참조해야 하므로 양방향 참조가 필요하다. 즉, 강한 결합도가 생긴다. 이런 문제를 해결하기 위해서는 `tryMove` 메서드를 `Game` 클래스에 이동시키고 `player`에 `move`라는 메서드를 만들어 포지션 이동 로직을 여기다가 녹인다. 이렇게 되면 양방향 문제는 해결이 된다.

또 하나 문제가 있는데 바로 `Player` 내부 구조에 의존하는 `Game` 클래스가 문제이다. 즉 너무 강한 결합도가 생긴 것이다. 해결 방법은 바로 캡슐화를 적용하는 것이다.

> 📚 용어 정리
>
> 캡슐화: 변경되는 부분을 내부로 숨기는 추상화 기법, 변경될 수 있는 어떤거라도 감추는 기법으로 설계에서 변하는 부분이 무엇인지 고민하고 변하는 개념을 캡슐화 해야 한다.

즉, `Player` 내부 구조에 대한 결합도가 높다면 `Player`의 내부구조를 경계로 캡슐화를 하여 의존성을 제거시키는 방법이 있다. 지금 현재는 프로세스와 데이터를 분리하게 된 셈이므로 잘못된 책임 할당이 되었다.

이런 문제를 해결하기 위해 '묻지 말고 시켜' 원칙과 '디미터 법칙'이 존재한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!