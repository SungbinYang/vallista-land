---
title: "[오브젝트] 테스트와 의존성"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-29 11:52:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 외부 의존성과 테스트

아래와 같이 기존 게임 클래스의 테스트 코드는 이해하기 정말 어렵다.

``` java
@Test
public void move_north_passed() {
OutputStream output = new ByteArrayOutputStream();
System.setOut(new PrintStream(output));
System.setIn(new ByteArrayInputStream("go north\nquit\n".getBytes()));

Game game = new Game();
game.run();

assertThat(output.toString().split("\n")).containsSequence(
        "> 당신은 [다리]에 있습니다.",
        "큰 강 위에 돌로 만든 커다란 다리가 있습니다.",
        "> ",
        "게임을 종료합니다.");
}
```

`System.setIn`에 할당된 문자열은 테스트에서 어떻게 사용되는지 알 길이 없고 `System.setOut` 역시 마찬가지다. 또한 검증 단계에서 왜 플레이어가 다리에 있는지도 알 수가 없는 것이다. 이런 문제가 발생하는 이유는 `Game` 클래스 안에 숨겨져 있는 외부 의존성때문이다. 즉, 키보드와 콘솔에 `Game` 클래스가 의존하고 있는 것이다.

`Game` 클래스에는 이런 키보드와 콘솔을 사용하는 `Scanner` 객체가 숨겨져 있다. 그래서 테스트 코드를 작성할 때 이해하기도 힘들고 해당 콘솔관련 코드들을 검증하기도 힘들다. 이런 문제를 해결하기 위해서는 외부 의존성에 대한 책임을 분리해서 명시적으로 만들어야 한다. 불안정한 외부 의존성을 캡슐화하기 위해서는 입출력을 담당하는 클래스를 새로운 클래스에 의존하고 그 새로운 클래스를 `Game` 클래스가 의존하도록 해야 할 것이다. 여기서는 `Console` 클래스를 만들어서 변경해보도록 하겠다.

``` java
package me.sungbin.adventure;

import java.util.Scanner;

public class Console {

    private Scanner scanner;

    public Console() {
        this.scanner = new Scanner(System.in);
    }

    public String input() {
        return scanner.nextLine().toLowerCase().trim();
    }

    public void showLine(String text) {
        System.out.println(text);
    }

    public void show(String text) {
        System.out.print(text);
    }
}
```

``` java
package me.sungbin.adventure;

public class Game {

    private Player player;
    private CommandParser commandParser;
    private Console console;
    private boolean running;

    public Game() {
        this.player = new Player(
                new WorldMap(
                        Size.with(2, 3),
                        new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                        new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                        new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                        new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                        new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.")),
                Position.of(0, 2));
        this.commandParser = new CommandParser();
        this.console = new Console();
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
        console.showLine("환영합니다!");
    }

    private void showHelp() {
        console.showLine("다음 명령어를 사용할 수 있습니다.");
        console.showLine("go {north|east|south|west} - 이동, look - 보기, help - 도움말, quit - 게임 종료");
    }

    private void farewell() {
        console.showLine("\n게임을 종료합니다.");
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
        console.showLine("이동할 수 없습니다.");
    }

    public void showRoom() {
        console.showLine("당신은 [" + player.currentRoom().name() + "]에 있습니다.");
        console.showLine(player.currentRoom().description());
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
        console.showLine("이해할 수 없는 명령어입니다.");
    }

    private String input() {
        return console.input();
    }

    private void showPrompt() {
        console.show("> ");
    }
}
```

이렇게 변경을 하니 `Game` 클래스는 구체적인 `System` 클래스와 `Scanner` 클래스를 알지 못한다. 즉, 외부 의존성이 `Console` 클래스 안으로 고립을 시킨 것이다. 이렇게 구현하면 아래와 같이 입출력 관련 테스트를 별도로 만들어서 검증을 받을 수도 있으니 확실히 편해질 것이다.

``` java
package me.sungbin.adventure;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.io.PrintStream;

import static org.assertj.core.api.Assertions.assertThat;

class ConsoleTest {

    @Test
    public void input() {
        System.setIn(new ByteArrayInputStream("input\n".getBytes()));

        String command = new Console().input();

        assertThat(command).isEqualTo("input");
    }

    @Test
    public void showLine() {
        OutputStream output = new ByteArrayOutputStream();
        System.setOut(new PrintStream(output));

        new Console().showLine("showLine");

        assertThat(output.toString()).isEqualToIgnoringNewLines("showLine");
    }

    @Test
    public void show() {
        OutputStream output = new ByteArrayOutputStream();
        System.setOut(new PrintStream(output));

        new Console().show("show");

        assertThat(output.toString()).isEqualToIgnoringNewLines("show");
    }
}
```

하지만 여전히 외부 의존성 이슈로 `Game` 클래스가 테스트하기 어렵다. 왜 테스트하기가 어려울까? 바로 의존성 전이 과정때문이다. `Game` 클래스는 `Console` 클래스를 직접 참조하며 `Console` 클래스가 `System` 클래스와 `Scanner` 클래스를 직접 참조한다. 그런데 만약 `System` 클래스나 `Scanner` 클래스 내부 구현이 변경되면 어떻게 될까? 당연히 `Console` 클래스에도 영향을 미치고 `Game` 클래스까지 부수효과가 전이될 것이다. 이것을 우리는 `Game` 클래스가 `System`이나 `Scanner` 클래스를 간접 참조하고 있다고 한다. 즉, `Game` 클래스는 구체 클래스에 의존하며 해당 구체 클래스도 생성자에서 직접 생성한다. 이렇게 되다 보니 숨겨진 구체 클래스에 대한 의존성이 생기는 것이다. 추상적으로 살펴보면 입출력을 담당하는 저수준 메커니즘 변경이 게임 정책에 대한 고수준 메커니즘을 변경시키는 최악의 사태가 발생할 수 있을 것이다. 또한 만약 콘솔이 아니라 파일아니 네트워크로 보내야 한다면 `Game` 클래스에 변경이 발생할 것이다.

이런 문제를 해결하기 위해서는 기존 의존성 방향을 반전시켜야 한다. 즉, 저수준 레벨에서 고수준 레벨에 대한 의존성을 가지게 만들어야 한다. 이런 방식을 **의존성 역전의 원칙**이라고 말한다.

## 의존성 역전 원칙 - 상위 수준과 하위 수준

의존성 역전의 원칙은 아래와 같은 원칙을 명시하고 있다.

- 상위 수준 모듈은 하위 수준 모듈에 의존해서는 안된다. 둘 모두 추상화에 의존해야 한다.
- 추상화는 세부 사항에 의존해서는 안 된다. 세부 사항이 추상화에 의존해야 한다.

여기서 **상위 수준**과 **하위 수준**은 무엇일까? 이 개념을 이해하기 위하여 통화 관리 시스템 예제를 들어보도록 하겠다.

통화 관리 시스템은 통화 내역을 관리하는 시스템이다. 발신하는 전화번호와 수신자 전화번호, 통화 시간을 관리하고 있는 시스템인 것이다. 그리고 이 통화기록을 csv 파일 포맷으로 저장했다고 해보자. 그럼 이것을 한번 코드로 작성해보도록 하겠다.

먼저 시작 시간과 종료 시간을 포함하는 `TimeInterval` 클래스를 작성해보자.

``` java
package me.sungbin.call;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeInterval {

    private final LocalDateTime start;

    private final LocalDateTime end;

    public static TimeInterval of(LocalDateTime start, LocalDateTime end) {
        return new TimeInterval(start, end);
    }

    private TimeInterval(LocalDateTime start, LocalDateTime end) {
        this.start = start;
        this.end = end;
    }

    public Duration duration() {
        return Duration.between(start, end);
    }
}
```

다음으로 송수신 핸드폰 번호와 통화 기간을 저장하는 `Call` 클래스를 작성해보자.

``` java
package me.sungbin.call;

import java.time.Duration;

public class Call {

    private String from;

    private String to;

    private TimeInterval callTime;

    public Call(String from, String to, TimeInterval callTime) {
        this.from = from;
        this.to = to;
        this.callTime = callTime;
    }

    public String from() {
        return from;
    }

    public Duration duration() {
        return callTime.duration();
    }
}
```

해당 클래스는 송신자 휴대전화 번호와 수신자 휴대전화 번호, 통화 시간(TimeInterval)을 주입받고 있다. 이제 csv 파일을 읽어서 전체 통화 내역을 `Call` 리스트로 반환하는 클래스를 작성해보자.

``` java
package me.sungbin.call;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class CsvReader {

    private String path;

    public CsvReader(String path) {
        this.path = path;
    }

    @Override
    public List<Call> read() {
        List<String> lines = readLines(path);
        return parse(lines);
    }

    private List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Call> parse(List<String> lines) {
        return lines.stream().map(this::parseCall).collect(Collectors.toList());
    }

    private Call parseCall(String line) {
        String[] tokens = line.split(",");
        return new Call(tokens[0].trim(), tokens[1].trim(),
                TimeInterval.of(parseDateTime(tokens[2]), parseDateTime(tokens[3])));
    }

    private LocalDateTime parseDateTime(String token) {
        return LocalDateTime.parse(token.trim(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
```

또한 특정 송신자 휴대전화 번호의 통화시간도 알고 싶을 수 있을 것이다. 이를 위해 특정 휴대전화 번호의 전체 통화 내역을 저장하는 `CallHistory`를 작성해보자.

``` java
package me.sungbin.call;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CallHistory {

    private String phone;

    private List<Call> calls = new ArrayList<>();

    public CallHistory(String phone) {
        this.phone = phone;
    }

    public void append(Call call) {
        this.calls.add(call);
    }

    public String phone() {
        return phone;
    }

    public Duration callDuration() {
        return calls.stream()
                .map(Call::duration)
                .reduce(Duration.ZERO, Duration::plus);
    }

    public List<Call> calls() {
        return Collections.unmodifiableList(calls);
    }
}
```

그리고 `CallHistory`를 반환하는 `CallCollector`를 작성해보자.

``` java
package me.sungbin.call;

import java.util.List;

public class CallCollector {

    private CsvReader reader;

    public CallCollector() {
        this.reader = new CsvReader("calls.csv");
    }

    public CallHistory collect(String phone) {
        CallHistory history = new CallHistory(phone);

        List<Call> calls = reader.read();

        for (Call call : calls) {
            if (call.from().equals(phone)) {
                history.append(call);
            }
        }

        return history;
    }
}
```

위의 코드를 보면 `calls.csv`파일을 읽어들여서 전체 통화 내역을 `Call` 리스트 형태로 반환을 변환을 하는 로직을 담고 있다.

그럼 해당 코드의 전체 로직을 한번 살펴보자. 전체 로직을 살펴봄에 있어서 객체 간 협력의 관점에서 살펴보자. 객체간 협력의 목적은 발신번호 별 통화 시간을 계산하는데 집중할 것이다. 이 로직을 수행하기 위해서는 **통화 시간을 계산하는 본질적인 문제와 거리가 먼 파일 처리 로직**을 수행하고 나서 **통화 시간을 계산하는 로직**을 수행할 것이다. 여기서 **통화 시간을 계산하는 본질적인 문제와 거리가 먼 파일 처리 로직**은 엄밀히 보면 통화 시간을 계산하는 목적성과는 조금 떨어진다. 이런 것을 하위 수준 모듈이라고 칭하고 직접적으로 관련이 있어보이는 **통화 시간을 계산하는 로직**은 상위 수준 모듈이라고 칭한다.

지금 코드의 입장을 보면 상위 수준 모듈인 `CallCollector`가 하위 수준 모듈인 `CsvReader`에 직접적인 의존성이 발생한다. 즉, 의존성 역전의 원칙에 어긋난 패턴이다.

만약 csv파일이 아니라 json 파일을 읽어들여야 한다면 아래와 같이 클래스를 작성하고 `CallCollector`에서 변경해줘야 할 것이다.

``` java
package me.sungbin.call;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class JsonReader {

    private String path;

    public JsonReader(String path) {
        this.path = path;
    }

    record CallHistoryRecord(List<CallRecord> calls) {
        record CallRecord(String from, String to, LocalDateTime start, LocalDateTime end) {
        }
    }

    @Override
    public List<Call> read() {
        List<String> lines = readLines(path);
        return parse(lines);
    }

    private List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private List<Call> parse(List<String> lines) {
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
}
```

즉, 변경의 취약함으로 이럴 경우 상위 수준 모듈과 하위 수준 모듈 전부를 추상화에 의존하게 해야 한다. 즉, 인터페이스를 참조하게 하면 된다. 아래와 같이 말이다.

``` java
package me.sungbin.call;

import java.util.List;

public interface Reader {
    List<Call> read();
}
```

위와 같이 인터페이스를 정의하고

``` java
package me.sungbin.call;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class CsvReader implements Reader {

    private String path;

    public CsvReader(String path) {
        this.path = path;
    }

    @Override
    public List<Call> read() {
        List<String> lines = readLines(path);
        return parse(lines);
    }

    private List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Call> parse(List<String> lines) {
        return lines.stream().map(this::parseCall).collect(Collectors.toList());
    }

    private Call parseCall(String line) {
        String[] tokens = line.split(",");
        return new Call(tokens[0].trim(), tokens[1].trim(),
                TimeInterval.of(parseDateTime(tokens[2]), parseDateTime(tokens[3])));
    }

    private LocalDateTime parseDateTime(String token) {
        return LocalDateTime.parse(token.trim(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
```

``` java
package me.sungbin.call;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class JsonReader implements Reader {

    private String path;

    public JsonReader(String path) {
        this.path = path;
    }

    record CallHistoryRecord(List<CallRecord> calls) {
        record CallRecord(String from, String to, LocalDateTime start, LocalDateTime end) {
        }
    }

    @Override
    public List<Call> read() {
        List<String> lines = readLines(path);
        return parse(lines);
    }

    private List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    private List<Call> parse(List<String> lines) {
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
}
```

정의한 인터페이스를 하위 수준 모듈이 구현하게 하고 인터페이스 자체를 상위 수준 모듈이 의존성 주입을 받으면 될 것이다.

``` java
package me.sungbin.call;

import java.util.List;

public class CallCollector {

    private Reader reader;

    public CallCollector(Reader reader) {
        this.reader = reader;
    }

    public CallHistory collect(String phone) {
        CallHistory history = new CallHistory(phone);

        List<Call> calls = reader.read();

        for (Call call : calls) {
            if (call.from().equals(phone)) {
                history.append(call);
            }
        }

        return history;
    }
}
```

상위 수준 모듈 대신 제 3의 객체가 하위 수준 모듈을 생성하게 하고 상위 수준 모듈은 의존성 주입을 통하여 의존성을 해결하는 형태로 풀어나가는 것이다.

> 의존성 주입에는 위와 같이 생성자 주입 패턴도 있지만 세터 주입 패턴, 메서드 주입 패턴도 존재한다. 그런데 실무에서 일반적으로 생성자 주입 패턴을 사용한다.

한마디로 정리하면 의존성을 주입할 객체 생성은 제3의 객체가 담당하고 의존성 주입 받은 객체를 사용할 책임은 상위 수준 모듈이 담당하게 되므로 결합도가 낮춰지고 생성과 사용이 분리되는 패턴을 보이게 된다.

## 의존성 역전 원칙 - 추상화와 세부 사항

이제 의존성 역정 원칙의 두번째 원칙인 **추상화는 세부 사항에 의존해서는 안된다. 세부사항이 추상화에 의존해야 한다.**를 살펴보겠다.

여기서 추상화란, 자주 변하지 않는 안정적인 부분을 뜻한다. 세부 사항은 자주 변하는 불안정한 부분을 뜻한다. 위에 작성했던 코드를 패키지 단위로도 분리한다고 해보자. 상위 수준 모듈과 하위 수준 모듈을 분리하는 것이다.

그러면 현재 상위 수준 모듈에 있는 `CallCollector`은 하위 수준 모듈의 인터페이스인 `Reader`를 의존하고 있다. 즉, 상위 수준 패키지가 하위 수준 패키지에 참조하는 것이다. 상위 수준 모듈안에 구현된 협력 흐름 자체는 자주 변하지 않고 안정적이다. 즉, 상위 수준 모듈은 추상적이라고 볼 수 있다. 반면에 하위 수준 모듈은 자주 변경이 될 가능성이 있다. 즉, 하위 모듈이 세부사항인 것이다. 이렇게 봤을 때 추상화는 세부사항에 패키지 관점에서 의존하고 있다. 그래서 `Reader` 인터페이스를 상위 수준 패키지로 이동 후 세부사항 패키지가 이것을 참조하게끔 변경하면 해당 원칙을 준수하게 되는 것이다.

> 💡 꿀팁
>
> 의존성 역전의 원칙의 역전이라는 것을 쓴 이유는 다음과 같다. 컴파일 타임의 의존성을 보면 하위 수준 모듈이 상위 수준 모듈에 의존하고 있다. 하지만 런타임에서는 상위 수준 모듈이 하위 수준 모듈을 의존하게끔 된다. 이것을 컴파일 타임 의존성과 런타임 의존성 방향이 역전되었다고 말하는 것이다.

의존성 역전 원칙과 의존성 주입 패턴은 테스트 가능성을 개선해준다. 의존성 역전 원칙을 사용하지 전에는 `CallCollector`가 구체 클래스를 직접 참조하고 내부 코드에서 생성자를 호출하여 인스턴스를 생성하는 방식이였다. 그래서 테스트 코드에서 테스트 데이터와 테스트 결과 사이의 관계가 테스트 케이스 안에 명확하게 들어나 있지 않다. 왜냐하면 구현 내부에 외부 파일에 대한 의존성이 숨겨져 있기 때문이다. 이런 숨겨진 의존성으로 인하여 외부에서 의존성 제어가 힘들어지고 결국 테스트 코드도 정확하게 작성하기 힘든 케이스가 되었다.

이런 경우 퍼블릭 인터페이스를 통해 입력과 출력을 제어할 수 있는 설계, 즉 테스트 가능한 설계가 되어야 한다. 그래서 우리는 의존성 역전 원칙을 통하여 테스트 가능성을 개선하였다. 대체 가능한 `Reader`라는 인터페이스에 의존하고 생성자 주입을 통하여 의존성 교체도 가능해졌다. 그래서 테스트 코드에서 `FakerReader`라는 테스트용 가짜 객체를 만들고 이를 통해 테스트를 내가 원하는 식으로 변경할 수 있을 것이다.

``` java
package me.sungbin.call.reader;

import me.sungbin.call.calls.Call;
import me.sungbin.call.calls.Reader;

import java.util.List;

public class FakeReader implements Reader {

    private List<Call> calls;

    public FakeReader(Call... calls) {
        this.calls = List.of(calls);
    }

    @Override
    public List<Call> read() {
        return calls;
    }
}
```

``` java
package me.sungbin.call.calls;

import me.sungbin.call.reader.FakeReader;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class CallCollectorTest {

    @Test
    public void collect() {
        CallCollector callCollector = new CallCollector(
                new FakeReader(
                        new Call("010-1111-2222", "010-3333-4444",
                                TimeInterval.of(LocalDateTime.of(2024, 1, 1, 11, 31, 5), LocalDateTime.of(2024, 1, 1, 11, 31, 25))),
                        new Call("010-1111-2222", "010-3333-4444",
                                TimeInterval.of(LocalDateTime.of(2024, 1, 2, 9, 10, 1), LocalDateTime.of(2024, 1, 2, 9, 11, 10))),
                        new Call("010-3333-4444", "010-5555-6666",
                                TimeInterval.of(LocalDateTime.of(2024, 1, 2, 9, 11, 32), LocalDateTime.of(2024, 1, 2, 9, 11, 50))),
                        new Call("010-3333-4444", "010-5555-6666",
                                TimeInterval.of(LocalDateTime.of(2024, 1, 3, 10, 1, 30), LocalDateTime.of(2024, 1, 3, 20, 2, 30))),
                        new Call("010-1111-2222", "010-3333-4444",
                                TimeInterval.of(LocalDateTime.of(2024, 1, 4, 15, 45, 23), LocalDateTime.of(2024, 1, 4, 15, 46, 33)))
                ));

        CallHistory history = callCollector.collect("010-1111-2222");

        assertThat(history.callDuration()).isEqualTo(Duration.ofSeconds(159));
    }
}
```

즉, 테스트 입력과 출력이 명확한 관계가 생기고 확실한 테스트를 할 수 있게 되었다.

마지막으로 기존에 작성했던 `CsvReader`와 `JsonReader`에 공통적인 부분을 해결해보자. 추상 클래스를 이용하여 구체 클래스가 추상 클래스를 바라보게 하고 추상 클래스는 인터페이스를 구현하면 되는 것이다. 이러면 공통적인 로직은 추상 클래스에 할당하고 서로 다른 로직은 구체 클래스에 위임하면 `DRY` 원칙도 준수하게 된다.

``` java
package me.sungbin.call.calls;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public abstract class AbstractReader implements Reader {

    private String path;

    protected AbstractReader(String path) {
        this.path = path;
    }

    public List<Call> read() {
        List<String> lines = readLines(path);
        return parse(lines);
    }

    private List<String> readLines(String path) {
        try {
            return Files.readAllLines(Path.of(ClassLoader.getSystemResource(path).toURI()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected abstract List<Call> parse(List<String> lines);
}
```

``` java
package me.sungbin.call.reader;

import me.sungbin.call.calls.AbstractReader;
import me.sungbin.call.calls.Call;
import me.sungbin.call.calls.TimeInterval;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class CsvReader extends AbstractReader {

    public CsvReader(String path) {
        super(path);
    }

    @Override
    protected List<Call> parse(List<String> lines) {
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
package me.sungbin.call.reader;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import me.sungbin.call.calls.AbstractReader;
import me.sungbin.call.calls.Call;
import me.sungbin.call.calls.TimeInterval;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class JsonReader extends AbstractReader {

    public JsonReader(String path) {
        super(path);
    }

    @Override
    protected List<Call> parse(List<String> lines) {
        CallHistoryRecord history = parseJson(lines);
        return history.calls().stream().map(call -> new Call(call.from, call.to, TimeInterval.of(call.start, call.end))).collect(Collectors.toList());
    }

    private CallHistoryRecord parseJson(List<String> lines) {
        try {
            ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
            String json = lines.stream().collect(Collectors.joining());
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

## 의존성 개선하기

기존 게임 시스템은 테스트 코드 자체가 이해하기 어려웠다. 왜냐하면 `Game` 클래스가 구체 클래스인 `Console`에 직접 의존했고 이 `Console` 의존성이 `Game` 클래스 내부에 숨겨져 있었기 때문이다. 즉, 현재는 상위 수준 모듈이 하위 수준을 참조하고 있는 형태이다. 그래서 `Game` 클래스가 구체 클래스를 의존하게 하지 말고 해당 구체 클래스가 구현하는 인터페이스를 의존하게끔 변경해보자.

``` java
package me.sungbin.game;

public interface InputOutput {
    String input();

    void showLine(String text);

    void show(String text);
}
```

``` java
package me.sungbin.console;

import me.sungbin.game.InputOutput;

import java.util.Scanner;

public class Console implements InputOutput {

    private Scanner scanner;

    public Console() {
        this.scanner = new Scanner(System.in);
    }

    @Override
    public String input() {
        return scanner.nextLine().toLowerCase().trim();
    }

    @Override
    public void showLine(String text) {
        System.out.println(text);
    }

    @Override
    public void show(String text) {
        System.out.print(text);
    }
}
```

``` java
package me.sungbin.game;

public class Game {

    private Player player;
    private CommandParser commandParser;
    private InputOutput io;
    private boolean running;

    public Game(InputOutput io) {
        this.player = new Player(
                new WorldMap(
                        Size.with(2, 3),
                        new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                        new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                        new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                        new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                        new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.")),
                Position.of(0, 2));
        this.commandParser = new CommandParser();
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

    public void showRoom() {
        io.showLine("당신은 [" + player.currentRoom().name() + "]에 있습니다.");
        io.showLine(player.currentRoom().description());
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
}
```

상위 모듈이 하위 모듈을 직접 참조하는 대신에 인터페이스를 참조하게 하고 의존성 주입을 통해 제 3자 클래스가 주입받게끔 하면 깔끔해지게 된다.

## 테스트 개선하기

우리는 지금까지 제어하기 어려운 의존성을 안정적인 인터페이스를 경계로 분리한 후 의존성을 대체하였다. 기존 게임 클래스 테스트는 테스트 입력과 테스트 출력 사이의 관계가 모호했고 `Scanner`와 `System`과 `Game` 사이의 암묵적인 의존성이 존재하였다. `Scanner`와 `System`에 대한 의존성을 `Console` 내부에 캡슐화하고 `Game`은 `InputOutput` 인터페이스를 바라보게 설계를 하였다.

이제 테스트 코드도 `FakeInputOutput` 클래스를 만들어서 가짜 의존성 주입으로 테스트 코드를 작성해보자.

``` java
package me.sungbin.game;

import java.util.Arrays;
import java.util.List;

public class FakeInputOutput implements InputOutput {

    int currentInput;
    private List<String> inputs;
    private StringBuilder outputs;

    public FakeInputOutput(String ... inputs) {
        this.currentInput = 0;
        this.inputs = List.of(inputs);
        this.outputs = new StringBuilder();
    }

    public List<String> outputs() {
        return Arrays.stream(outputs.toString().split("\n")).toList();
    }

    @Override
    public String input() {
        return inputs.get(currentInput++);
    }

    @Override
    public void showLine(String text) {
        outputs.append(text + "\n");
    }

    @Override
    public void show(String text) {
        outputs.append(text);
    }
}
```

또한 테스트의 모호함을 없애기 위하여 명확하게 내부에 숨겨진 지도의 구조와 플레이어 위치도 생성자 주입을 받아보도록 변경해보자.

``` java
package me.sungbin.game;

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

    public void showRoom() {
        io.showLine("당신은 [" + player.currentRoom().name() + "]에 있습니다.");
        io.showLine(player.currentRoom().description());
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
}
```

그리고 `Game` 클래스의 테스트 코드를 작성하자.

``` java
package me.sungbin.game;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @Test
    public void contains_welcome() {
        FakeInputOutput io = new FakeInputOutput("quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "환영합니다!",
                "당신은 [언덕]에 있습니다.",
                "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다.",
                "다음 명령어를 사용할 수 있습니다.",
                "go {north|east|south|west} - 이동, look - 보기, help - 도움말, quit - 게임 종료");
    }

    @Test
    public void move_north_passed() {
        FakeInputOutput io = new FakeInputOutput("go north", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [다리]에 있습니다.",
                "큰 강 위에 돌로 만든 커다란 다리가 있습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_north_blocked() {
        FakeInputOutput io = new FakeInputOutput("go north", "go north", "go north", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [다리]에 있습니다.",
                "큰 강 위에 돌로 만든 커다란 다리가 있습니다.",
                "> 당신은 [샘]에 있습니다.",
                "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다.",
                "> 이동할 수 없습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_east_passed() {
        FakeInputOutput io = new FakeInputOutput("go east", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [동굴]에 있습니다.",
                "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_east_blocked() {
        FakeInputOutput io = new FakeInputOutput("go east", "go east", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [동굴]에 있습니다.",
                "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.",
                "> 이동할 수 없습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_south_passed() {
        FakeInputOutput io = new FakeInputOutput("go north", "go south", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [다리]에 있습니다.",
                "큰 강 위에 돌로 만든 커다란 다리가 있습니다.",
                "> 당신은 [언덕]에 있습니다.",
                "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_south_blocked() {
        FakeInputOutput io = new FakeInputOutput("go south", "quit");

        Game game = createGame(io);
        game.run();


        assertThat(io.outputs()).containsSequence(
                "> 이동할 수 없습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_west_passed() {
        FakeInputOutput io = new FakeInputOutput("go east", "go west", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [동굴]에 있습니다.",
                "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.",
                "> 당신은 [언덕]에 있습니다.",
                "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_west_blocked() {
        FakeInputOutput io = new FakeInputOutput("go west", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 이동할 수 없습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    @Test
    public void move_empty() {
        FakeInputOutput io = new FakeInputOutput("go north", "go north", "go east", "quit");

        Game game = createGame(io);
        game.run();

        assertThat(io.outputs()).containsSequence(
                "> 당신은 [다리]에 있습니다.",
                "큰 강 위에 돌로 만든 커다란 다리가 있습니다.",
                "> 당신은 [샘]에 있습니다.",
                "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다.",
                "> 이동할 수 없습니다.",
                "> ",
                "게임을 종료합니다.");
    }

    private Game createGame(FakeInputOutput io) {
        Player player = new Player(
                new WorldMap(
                        Size.with(2, 3),
                        new Room(Position.of(0, 0), "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                        new Room(Position.of(0, 1), "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                        new Room(Position.of(1, 1), "성", "용왕이 살고 있는 성에 도착했습니다."),
                        new Room(Position.of(0, 2), "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                        new Room(Position.of(1, 2), "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다.")),
                Position.of(0, 2));
        CommandParser commandParser = new CommandParser();

        return new Game(player, commandParser, io);
    }
}
```

이렇게 작성함으로 테스트 작성하기 쉬운 코드로 변경이 된 것을 볼 수 있다. 해당 코드의 특징은 객체가 의존하는 대상이 객체의 인터페이스에 명시적으로 드러나있는 설계인 점이 존재한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!