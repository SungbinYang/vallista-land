---
title: "[오브젝트] 메서드 조합하기"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-06-15 12:59:27
series: 오브젝트 - 설계 원칙편
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [조영호님의 인프런 강의](https://inf.run/HXdiC)를 바탕으로 쓰여진 글입니다.

## 단일 추상화 수준 원칙과 조합 메서드

리팩토링을 그럼 진행하기에 앞서 어떤것부터 시작하면 좋을까? 가장 좋은 방법은 긴 메서드들을 유의미한 이름으로 작게 쪼개는 것이 가장 먼저 해야한다고 생각이 든다.

메서드를 작게 쪼개면 다음과 같은 장점이 존재한다.

- 읽고 이해하기 쉬운 코드
- 버그 수정, 성능 최적화, 메서드 추가 용이
- 작은 메서드를 조합하면 일련의 주석을 읽는 것과 같은 코드 작성 가능
- 메서드의 재사용성 향상
- 메서드 오버라이딩 용이

또한 이름을 메서드 사용하는 입장에서 메서드 명을 지어야 한다. 만약 내부 구현로직을 바탕으로 이름을 짓는다면 가독성도 떨어지고 사용하는 입장에서 메서드 내부 로직을 그대로 드러내기에 혼돈이 올 수 있을 것이다.

즉, 의도를 드러내는 이름은 아래와 같은 규칙으로 작성해야 한다.

- 메서드의 이름은 메서드 호출자 의도를 반영하도록 명명해야 한다.
- 메서드 호출자 목표(what)를 설명하고 이를 달성하는 매커니즘이나 알고리즘(how)을 드러내지 말아야 한다.

즉, 어떻게 해야하는지에 대한 명명 방식보다는 무엇을 해야하는지에 대한 명명 방식을 택하는 것이 바람직 하다. 그러면 무엇을 해야하는지에 대하여 메서드 명을 작성하다보면 메서드 명이 엄청 길어지거나 내부 구현 로직이 단순히 1줄일 경우도 생길 것이다. 그래도 이런식으로 작성하는 것이 좋다고 생각한다. 왜냐하면 메서드 자체는 외부에 사용자 입장에서 호출을 하는것이므로 호출하는 사용자를 배려하는 것이 더욱 바람직하다고 느끼고 추가적으로 이렇게 무엇을 해야할지로 명명하면 코드도 읽기 쉬운 코드가 될 것이다.

정리하면 메서드의 추출 이유는 다음과 같을 것이다.

- 가독성 향상: 로직을 읽기 쉽게 개선
- 중복 코드 제거: 중복 코드를 공통 메서드로 추출
- 불안정한 의존성 고립: 의존성을 메서드 내부로 제한하기 ex. Scanner같은 외부 객체 사용은 별도로...

추가적으로 이렇게 메서드를 잘게 추출하면 다른 곳에서도 가져다 쓰기 쉽고 테스트하기도 매우 용이하다.

> ✅ 참고
>
> 메서드 안의 모든 코드가 동일한 추상화 수준에 있도록 유지해야 한다. 즉, 어느 것은 메서드로 추출하지만 어느 것은 추출하지 아니하면 읽는 입장에서 잠깐 멈칫하는 과정이 생기고 메서드를 읽는데 불편함이 생길 것이다.

여기서 메서드의 추상화 수준이 나오는데 추상화 수준은 고수준과 저수준으로 나뉜다. 고수준은 메서드 호출자 목표를 중점으로 메서드 명명 방식을 짓는 것을 고수준 메서드라고 말하고 메서드를 추출하지 아니하거나 매커니즘과 알고리즘을 그대로 드러낸 명명 방식을 저수준 메서드라고 부른다. 그래서 하나의 메서드를 작성할 때 그 안의 구현부를 의미있는 고수준 메서드로 추출하는 것이 테스트하기도 리팩토링하기도 좋은 설계 방식이고 이런 설계 원칙을 **단일 추상화 수준 원칙(SLAP)**이라고 부른다.

## 조합 메서드로 리팩터링하기

그러면 추상화 수준이 다른 텍스트 어드벤쳐 게임의 `Game` 클래스를 리팩토링 해보겠다.

아래 코드는 리팩토링 전 `Game`클래스 코드이다.

``` java
package me.sungbin;

import java.util.Scanner;

public class Game {

    private int width, height;

    private Room[] rooms;

    private int x, y;

    private boolean running;

    public Game() {
        this.x = 0;
        this.y = 2;
        this.width = 2;
        this.height = 3;
        this.rooms = arrangeRooms(
                new Room(0, 0, "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                new Room(0, 1, "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                new Room(1, 1, "성", "용왕이 살고 있는 성에 도착했습니다."),
                new Room(0, 2, "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                new Room(1, 2, "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다."));
    }

    private Room[] arrangeRooms(Room ... rooms) {
        Room[] result = new Room[width * height];
        for(var room : rooms) {
            result[room.x() + room.y() * width] = room;
        }
        return result;
    }

    public void run() {
        System.out.println("환영합니다!");
        System.out.println("당신은 [" + rooms[x + y * width].name() + "]에 있습니다.");
        System.out.println(rooms[x + y * width].description());
        System.out.println("다음 명령어를 사용할 수 있습니다.");
        System.out.println("go {north|east|south|west} - 이동, quit - 게임 종료");

        Scanner scanner = new Scanner(System.in);

        running = true;
        while (running) {
            System.out.print("> ");
            String[] commands = scanner.nextLine().toLowerCase().trim().split("\\s+");
            switch (commands[0]) {
                case "go" -> {
                    switch (commands[1]) {
                        case "north" -> {
                            if (y - 1 < 0 || rooms[x + (y - 1) * width] == null) {
                                System.out.println("이동할 수 없습니다.");
                            } else {
                                y -= 1;
                                System.out.println("당신은 [" + rooms[x + y * width].name() + "]에 있습니다.");
                                System.out.println(rooms[x + y * width].description());
                            }
                        }
                        case "south" -> {
                            if (y + 1 >= height || rooms[x + (y + 1) * width] == null) {
                                System.out.println("이동할 수 없습니다.");
                            } else {
                                y += 1;
                                System.out.println("당신은 [" + rooms[x + y * width].name() + "]에 있습니다.");
                                System.out.println(rooms[x + y * width].description());
                            }
                        }
                        case "east" -> {
                            if (x + 1 >= width || rooms[(x + 1 ) + y * width] == null) {
                                System.out.println("이동할 수 없습니다.");
                            } else {
                                x += 1;
                                System.out.println("당신은 [" + rooms[x + y * width].name() + "]에 있습니다.");
                                System.out.println(rooms[x + y * width].description());
                            }
                        }
                        case "west" -> {
                            if (x - 1 < 0 || rooms[(x - 1) + y * width] == null) {
                                System.out.println("이동할 수 없습니다.");
                            } else {
                                x -= 1;
                                System.out.println("당신은 [" + rooms[x + y * width].name() + "]에 있습니다.");
                                System.out.println(rooms[x + y * width].description());
                            }
                        }
                        default -> System.out.println("이해할 수 없는 명령어입니다.");
                    }
                }

                case "quit" -> running = false;
                default -> System.out.println("이해할 수 없는 명령어입니다.");
            }
        }

        System.out.println("\n게임을 종료합니다.");
    }
}
```

위의 코드를 보면 알겠지만 너무 읽기 쉽지 않고 저수준 코드로 이루어진 것을 알 수 있다. 이제 이것을 메서드 추출 과정을 통해 고수준으로 변경하면서 리팩토링을 진행해보겠다.

``` java
package me.sungbin;

import java.util.Scanner;

public class Game {

    private int width, height;

    private Room[] rooms;

    private int x, y;

    private boolean running;

    public Game() {
        this.x = 0;
        this.y = 2;
        this.width = 2;
        this.height = 3;
        this.rooms = arrangeRooms(
                new Room(0, 0, "샘", "아름다운 샘물이 흐르는 곳입니다. 이곳에서 휴식을 취할 수 있습니다."),
                new Room(0, 1, "다리", "큰 강 위에 돌로 만든 커다란 다리가 있습니다."),
                new Room(1, 1, "성", "용왕이 살고 있는 성에 도착했습니다."),
                new Room(0, 2, "언덕", "저 멀리 성이 보이고 언덕 아래로 좁은 길이 나 있습니다."),
                new Room(1, 2, "동굴", "어둠에 잠긴 동굴 안에 작은 화톳불이 피어 있습니다."));
    }

    private Room[] arrangeRooms(Room... rooms) {
        Room[] result = new Room[width * height];
        for (var room : rooms) {
            result[room.x() + room.y() * width] = room;
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
        System.out.println("당신은 [" + roomAt(x, y).name() + "]에 있습니다.");
        System.out.println(roomAt(x, y).description());
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
        while (running) {
            String input = inputCommand(scanner);
            parseCommand(input);
        }
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
                    case "north" -> moveNorth();
                    case "south" -> moveSouth();
                    case "east" -> moveEast();
                    case "west" -> moveWest();
                    default -> showUnknownCommand();
                }
            }
            case "look" -> showRoom();
            case "help" -> showHelp();
            case "quit" -> stop();
            default -> showUnknownCommand();
        }
    }

    private void moveWest() {
        tryMove(-1, 0);
    }

    private void moveEast() {
        tryMove(1, 0);
    }

    private void moveSouth() {
        tryMove(0, 1);
    }

    private void moveNorth() {
        tryMove(0, -1);
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

    private void tryMove(int incX, int incY) {
        if (isBlocked(x + incX, y + incY)) {
            showBlocked();
        } else {
            this.x += incX;
            this.y += incY;
            showRoom();
        }
    }

    private boolean isBlocked(int x, int y) {
        return isExcluded(x, y) || roomAt(x, y) == null;
    }

    private boolean isExcluded(int x, int y) {
        return x < 0 || x >= width || y < 0 || y >= height;
    }

    private Room roomAt(int x, int y) {
        return rooms[x + y * width];
    }
}
```

먼저 작업을 한 것은 동일한 추상화 레벨로 맞추는 작업을 진행하였다. `run` 메서드부터 동일한 추상화 레벨로 변경하여 조합 메서드로 만들었다. 그러면 어느 단계까지 메서드를 쪼개야 하는지 의문이 든 분들도 계실것이다. 나는 아래와 같이 생각을 한다.

> 의도가 명확하게 드러나게 추출을 하고 하나의 메서드에 하나의 책임을 가지게끔까지 추출하자.

이렇게 메서드를 쪼개서 조합 메서드로 변경하면 메서드가 높은 응집도가 나타나게 되고 쪼개진 메서드가 다른 곳에 재사용을 하게 할 수 있으며 새로운 요구사항으로 기능을 추가하더라도 어느 메서드를 고칠지가 명확해진다.

또한 메서드를 추출할때 가독성 향상, 중복 코드 제거용으로도 추출을 하지만 외부 객체에 의존이 있는 것(ex. Scanner)들의 의존성을 제한시키는 것도 중요하기에 추출을 해야 한다.

이렇게 추출한 메서드들을 나중에 다른 클래스로 옮길 수 있는데 이것을 우리는 **책임의 이동**이라고도 표현한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!