---
title: "[오브젝트] 테스트와 의존성"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-21 11:52:27
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

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!