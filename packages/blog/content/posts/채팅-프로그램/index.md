---
title: "[자바 고급2] 채팅 프로그램"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-24 23:05:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## 채팅 프로그램 - 설계

그럼 이제 채팅 프로그램을 만들어보자. 강의에서 강사님께서 알려주신 방법과 내가 해결한 방법을 비교하면서 내가 부족했던 점을 복기하는 식으로 정리를 해보려고 한다. 그래야 조금이라도 더 공부가 되지 않을까? 이것을 읽는 독자들도 한번 직접 만들어보고 비교를 해보자.

### 요구사항

- 서버에 접속한 사용자는 모두 대화할 수 있어야 한다.
- 다음과 같은 채팅 명령어가 있어야 한다.
  - 입장 `/join|{name}`
    - 처음 채팅 서버에 접속할 때 사용자의 이름을 입력해야 한다.
  - 메시지 `/message|{내용}`
    - 모든 사용자에게 메시지를 전달한다.
  - 이름 변경 `/change|{name}`
    - 사용자의 이름을 변경한다.
  - 전체 사용자 `/users`
    - 채팅 서버에 접속한 전체 사용자 목록을 출력한다.
  - 종료 `/exit`
    - 채팅 서버의 접속을 종료한다.

### 채팅 프로그램 설계 - 클라이언트

채팅 자체는 실시간으로 동작이 되어야 한다. 이전에 우리가 작성했던 네트워크 프로그램과는 차이가 있다. 이전에 작성했던 네트워크 프로그램은 `scanner.nextLine()`이나 `input.readUTF()` 메서드로 인하여 블로킹이 되었다. 하지만 이렇게 채팅 프로그램을 작성하면 실시간을 보장할 수 없다. 따라서 사용자의 콘솔 입력과 서버로부터 메시지를 받는 부분을 별도의 스레드로 분리해야 한다.

### 채팅 프로그램 설계 - 서버

채팅 프로그램에서 사용자가 채팅을 작성하여 전송하면 접속한 모든 사용자가 해당 내용의 메세지를 볼 수 있어야 할 것이다. 그렇게 하려면 네트워크 프로그램에서 만들어둔 `SessionManager`를 이용하면 좋을 것 같다. 사용자가 채팅 메세지를 보내면 해당 사용자와 연결된 소켓이 세션 매니저한테 전달하고 그 세션 매니저가 그 메세지를 연결된 세션에게 전파를 하면 될 것이다.

그러면 한번 구상한 방식으로 작성해보자.

## 채팅 프로그램 - 클라이언트

그러면 채팅 프로그램을 만들어보자. 먼저 강사님께서 만드신 방법부터 소개하고 내가 개발한 코드를 공개해보겠다.

먼저 클라이언트의 `ReadHandler`를 만들어보자. `ReadHandler`는 서버에서 데이터를 읽어들이는 용도이다.

``` java
package chat.lecture.client;

import java.io.DataInputStream;
import java.io.IOException;

import static util.MyLogger.log;

public class ReadHandler implements Runnable {

    private final DataInputStream input;

    private final Client client;

    public boolean closed = false;

    public ReadHandler(DataInputStream input, Client client) {
        this.input = input;
        this.client = client;
    }

    @Override
    public void run() {
        try {
            while (true) {
                String received = input.readUTF();
                System.out.println(received);
            }
        } catch (IOException e) {
            log(e);
        } finally {
            client.close();
        }
    }

    public synchronized void close() {
        if (closed) {
            return;
        }

        closed = true;

        log("readHandler 종료");
    }
}
```

- 서버의 메시지를 반복해서 받고, 콘솔에 출력하는 단순한 기능을 제공한다.
- 클라이언트 종료시 `ReadHandler`도 종료된다. 중복 종료를 막기 위해 동기화 코드와 `closed` 플래그를 사용했다.
- `IOException` 예외가 발생하면 `client.close()`를 통해 클라이언트를 종료하고, 전체 자원을 정리한다.

다음으로 `WriteHandler`를 만들어보자. 해당 클래스는 서버로 데이터를 보내는 역할을 수행한다.

``` java
package chat.lecture.client;

import java.io.DataOutputStream;
import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.Scanner;

import static util.MyLogger.log;

public class WriteHandler implements Runnable {

    private static final String DELIMITER = "|";

    private final DataOutputStream output;

    private final Client client;

    private boolean closed = false;

    public WriteHandler(DataOutputStream output, Client client) {
        this.output = output;
        this.client = client;
    }

    @Override
    public void run() {
        Scanner scanner = new Scanner(System.in);

        try {
            String username = inputUsername(scanner);
            output.writeUTF("/join" + DELIMITER + username);

            while (true) {
                String toSend = scanner.nextLine();

                if (toSend.isEmpty()) {
                    continue;
                }

                if (toSend.equals("/exit")) {
                    output.writeUTF(toSend);
                    break;
                }

                if (toSend.startsWith("/")) {
                    output.writeUTF(toSend);
                } else {
                    output.writeUTF("/message" + DELIMITER + toSend);
                }
            }
        } catch (IOException | NoSuchElementException e) {
            log(e);
        } finally {
            client.close();
        }
    }

    private static String inputUsername(Scanner scanner) {
        System.out.println("이름을 입력하세요.");
        String username;

        do {
            username = scanner.nextLine();
        } while (username.isEmpty());

        return username;
    }

    public synchronized void close() {
        if (closed) {
            return;
        }

        try {
            System.in.close();
        } catch (IOException e) {
            log(e);
        }

        closed = true;
        log("writeHandler 종료");
    }
}
```

- `WriteHandler`는 사용자 콘솔의 입력을 받아서 서버로 메시지를 전송한다.
- 처음 시작시 `inputUsername()`을 통해 사용자의 이름을 입력 받는다.
- 처음 채팅 서버에 접속하면 `/join|{name}`을 전송한다. 이 메시지를 통해 입장했다는 정보와 사용자의 이름을 서버에 전달한다.
- 메시지는 다음과 같이 설계된다.
  - 입장 `/join|{name}`
  - 메시지 `/message|{내용}`
  - 종료 `/exit`
- 만약 콘솔 입력시 `/`로 시작하면 `/join`,`/exit` 같은 특정 명령어를 수행한다고 가정한다.
- `/` 를 입력하지 않으면 일반 메시지로 보고 `/message`에 내용을 추가해서 서버에 전달한다.

`close()` 를 호출하면 `System.in.close()` 를 통해 사용자의 콘솔 입력을 닫는다. 이렇게 하면 `Scanner` 를 통한 콘솔 입력인 `scanner.nextLine()` 코드에서 대기하는 스레드에 다음 예외가 발생하면서, 대기 상태에서 빠져나올 수 있다. `java.util.NoSuchElementException: No line found` 서버가 연결을 끊은 경우에 클라이언트의 자원이 정리되는데, 이때 유용하게 사용된다.

그러면 클라이언트 코드를 살펴보자.

``` java
package chat.lecture.client;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

import static network.tcp.SocketCloseUtil.closeAll;
import static util.MyLogger.log;

public class Client {

    private final String host;

    private final int port;

    private Socket socket;

    private DataInputStream input;

    private DataOutputStream output;

    private ReadHandler readHandler;

    private WriteHandler writeHandler;

    private boolean closed = false;

    public Client(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public void start() throws IOException {
        log("클라이언트 시작");

        socket = new Socket(host, port);
        input = new DataInputStream(socket.getInputStream());
        output = new DataOutputStream(socket.getOutputStream());

        readHandler = new ReadHandler(input, this);
        writeHandler = new WriteHandler(output, this);

        Thread readThread = new Thread(readHandler, "readHandler");
        Thread writeThread = new Thread(writeHandler, "writeHandler");

        readThread.start();
        writeThread.start();
    }

    public synchronized void close() {
        if (closed) {
            return;
        }

        writeHandler.close();
        readHandler.close();

        closeAll(socket, input, output);

        closed = true;

        log("연결 종료: " + socket);
    }
}
```

- 클라이언트 전반을 관리하는 클래스이다.
- `Socket`,`ReadHandler`,`WriteHandler`를 모두 생성하고 관리한다.
- `close()` 메서드를 통해 전체 자원을 정리하는 기능도 제공한다.

마지막으로 `main`메서드 코드를 살펴보자.

``` java
package chat.lecture.client;

import java.io.IOException;

public class ClientMain {

    private static final int PORT = 12345;

    public static void main(String[] args) throws IOException {
        Client client = new Client("localhost", PORT);
        client.start();
    }
}
```

이제 나의 코드를 살펴보자. 일단 나는 `ReadHandler` 대신에 `Receiver`로 개발했다. 내가 생각하기에는 ~Handler보다는 직관적이다라고 생각했기 때문이다.

``` java
package chat.me;

import java.io.DataInputStream;
import java.io.IOException;
import java.net.Socket;

import static util.MyLogger.log;

public class Receiver implements Runnable {

    private final Socket socket;

    private final DataInputStream input;

    private final User user;

    private boolean closed = false;

    public Receiver(Socket socket, User user) throws IOException {
        this.socket = socket;
        this.user = user;
        this.input = new DataInputStream(socket.getInputStream());
    }

    @Override
    public void run() {
        log("receiver start");

        try {
            while (true) {
                String received = input.readUTF();

                if (received.startsWith("/exit")) {
                    break;
                }

                log(received);
            }
        } catch (IOException e) {
            log(e);
        } finally {
            System.out.println("receiver end");
            close();
        }
    }

    private void close() {
        if (closed) {
            return;
        }

        closed = true;

        try {
            socket.close();
        } catch (IOException e) {
            log(e);
        }
    }
}
```

- 해당 클래스에서 부족했던 점은 패키지를 분리를 따로 안했다는 점이 있다.
- 동시성 문제를 전혀 생각하지 못했다.
- 사용자라는 개념이 있어서 나는 `User`라는 객체를 따로 빼고 `User` 객체를 주입 받는 형태로 작성하였다.
- 또한 `Socket`도 외부에서 주입 받는 형태로 작성하였다.
- 그러다 보니 뭔가 `Socket`관련 부분을 여기에서 처리하다 보니 살짝 불편감이 있었다. 예시처럼 외부로 분리했으면 좋을 것 같다는 생각을 하였다.

다음으로 서버로부터 데이터를 보내는 역할의 클래스를 살펴보자.

``` java
package chat.me;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.Scanner;

import static util.MyLogger.log;

public class Sender implements Runnable {

    private final Socket socket;

    private final DataOutputStream output;

    private final User user;

    private boolean closed = false;

    public Sender(Socket socket, User user) throws IOException {
        this.socket = socket;
        this.user = user;
        this.output = new DataOutputStream(socket.getOutputStream());
    }

    @Override
    public void run() {
        log("sender start");

        Scanner scanner = new Scanner(System.in);

        try {
            while (true) {
                System.out.print("명령어를 입력하세요: ");
                String command = scanner.nextLine();

                if (command.isEmpty()) {
                    continue;
                }

                if (command.startsWith("/exit")) {
                    break;
                }

                output.writeUTF(command);
            }
        } catch (IOException e) {
            log(e);
        } finally {
            scanner.close();
            close();
        }
    }

    private void close() {
        if (closed) {
            return;
        }

        closed = true;

        try {
            socket.close();
        } catch (IOException e) {
            log(e);
        }
    }
}
```

- 패키지 분리에 너무 빈약했다.
- 동시성 문제를 전혀 생각하지 못했다.
- 사용자라는 개념이 있어서 나는 `User`라는 객체를 따로 빼고 `User` 객체를 주입 받는 형태로 작성하였다.
- 또한 `Socket`도 외부에서 주입 받는 형태로 작성하였다.
- 그러다 보니 뭔가 `Socket`관련 부분을 여기에서 처리하다 보니 살짝 불편감이 있었다. 예시처럼 외부로 분리했으면 좋을 것 같다는 생각을 하였다.
- 예제에서는 사용자 이름을 입력받게 하였지만 나는 무조건 명령어를 입력하게 하고 해당 명령에 대한 값을 입력하는 식으로 고안했다. 이런 부분은 애초에 요구사항에 적어줬으면 좋았을것 같다는 생각을 했다.

그럼 이제 `User`를 작성해보자.

``` java
package chat.me;

public class User {

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

- `User`는 단순히 이름만 가지고 있는 형태로 해두었다. 왜냐하면 나중에 이름을 변경하는 일도 있다고 생각했기 때문인데 뭔가 굳이 이름만 있으면 만들 필요가 없겠다라고 생각하긴 했다.

이제 `Client` 코드를 살펴보자.

``` java
package chat.me;

import java.io.IOException;
import java.net.Socket;

import static util.MyLogger.log;

public class Client {

    private static final int PORT = 12345;

    public static void main(String[] args) throws IOException {
        log("클라이언트 시작");
        Socket socket = null;
        User user = new User();

        try {
            socket = new Socket("localhost", PORT);
            log("소켓 연결: " + socket);

            Thread receiver = new Thread(new Receiver(socket, user));
            Thread sender = new Thread(new Sender(socket, user));

            receiver.start();
            sender.start();
        } catch (IOException e) {
            log(e);
        }
    }
}
```

- 예시 코드와 거의 비슷하지만 문제가 있다. 일단 굳이 이름만 가지고 있는 `User`가 하는게 없어 보이기도 하고 `Socket`의 변수 스코프가 너무 넓다. 그 외에는 예시 코드와 유사하다.
- 소켓을 닫는 로직을 안에 각 `Receiver`와 `Sender`가 있더라도 해당 클라이언트에 있어야 한다고 보았다. 또한 바로 `main`메서드로 호출하니 뭔가 아리송하다. 객체지향적이지도 않은 것 같기도 하다.

너무 부족한 부분들이 많았다. 이를 토대로 해당 포스팅을 마치고 추후 재작성 해보는 연습도 가져봐야겠다.

## 채팅 프로그램 - 서버1

서버 파트는 점진적으로 발전시킬 예정으로 나의 코드는 추후 완성 후 비교를 해보겠다. 채팅 프로그램 서버의 경우 기존에 작성한 네트워크 프로그램의 서버에서 필요한 기능을 추가하면 된다.

``` java
package chat.lecture.server;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

import static network.tcp.SocketCloseUtil.closeAll;
import static util.MyLogger.log;

public class Session implements Runnable {

    private final Socket socket;

    private final DataInputStream input;

    private final DataOutputStream output;

    private final CommandManager commandManager;

    private final SessionManager sessionManager;

    private boolean closed = false;

    private String username;

    public Session(Socket socket, CommandManager commandManager, SessionManager sessionManager) throws IOException {
        this.socket = socket;
        this.input = new DataInputStream(socket.getInputStream());
        this.output = new DataOutputStream(socket.getOutputStream());
        this.commandManager = commandManager;
        this.sessionManager = sessionManager;
        this.sessionManager.add(this);
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public void run() {
        try {
            while (true) {
                String received = input.readUTF();
                log("client -> server: " + received);
                commandManager.execute(received, this);
            }
        } catch (IOException e) {
            log(e);
        } finally {
            sessionManager.remove(this);
            sessionManager.sendAll(username + "님이 퇴장하였습니다.");
            close();
        }
    }

    public void send(String message) throws IOException {
        log("server -> client: " + message);
        output.writeUTF(message);
    }

    public synchronized void close() {
        if (closed) {
            return;
        }

        closeAll(socket, input, output);

        closed = true;
        log("연결 종료: " + socket);
    }
}
```

- `CommandManager`는 명령어를 처리하는 기능을 제공한다.
- `Session`의 생성 시점에 `sessionManager`에 `Session`을 등록한다.
- `username`을 통해 클라이언트의 이름을 등록할 수 있다. 지금은 값이 없으니 `null`로 사용된다.
- `run()` 메서드는 클라이언트로부터 메시지를 전송받는다. 전송 받은 메시지를 `commandManager.execute()`를 사용해서 실행한다. 예외가 발생하면 세션 매니저에서 세션을 제거하고, 나머지 클라이언트에게 퇴장 소식을 알린다. 그리고 자원을 정리한다.
- `send()` 메서드를 호출하면 해당 세션의 클라이언트에게 메시지를 보낸다.

``` java
package chat.lecture.server;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static util.MyLogger.log;

public class SessionManager {

    private final List<Session> sessions = new ArrayList<>();

    public synchronized void add(Session session) {
        sessions.add(session);
    }

    public synchronized void remove(Session session) {
        sessions.remove(session);
    }

    public synchronized void closeAll() {
        for (Session session : sessions) {
            session.close();
        }

        sessions.clear();
    }

    public synchronized void sendAll(String message) {
        for (Session session : sessions) {
            try {
                session.send(message);
            } catch (IOException e) {
                log(e);
            }
        }
    }

    public synchronized List<String> getAllUsername() {
        List<String> usernames = new ArrayList<>();

        for (Session session : sessions) {
            if (session.getUsername() != null) {
                usernames.add(session.getUsername());
            }
        }

        return usernames;
    }
}
```

- 세션들을 관리한다.
- `closeAll()` : 모든 세션을 종료하고, 세션 관리자에서 제거한다.
- `sendAll()` : 모든 세션에 메시지를 전달한다. 이때 각 세션의 `send()` 메서드가 호출된다.
- `getAllUsername()` : 모든 세션에 등록된 사용자의 이름을 반환한다. 향후 모든 사용자 목록을 출력할 때 사용된다.

``` java
package chat.lecture.server;

import java.io.IOException;

@FunctionalInterface
public interface CommandManager {
    void execute(String totalMessage, Session session) throws IOException;
}
```

- 클라이언트에게 전달받은 메시지를 처리하는 인터페이스이다.
- `totalMessage` : 클라이언트에게 전달 받은 메시지
- `Session session` : 현재 세션

``` java
package chat.lecture.server;

import java.io.IOException;

public class CommandManagerV1 implements CommandManager {

    private final SessionManager sessionManager;

    public CommandManagerV1(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String totalMessage, Session session) throws IOException {
        if (totalMessage.startsWith("/exit")) {
            throw new IOException("exit");
        }

        sessionManager.sendAll(totalMessage);
    }
}
```

- 클라이언트에게 일반적인 메시지를 전달 받으면, 모든 클라이언트에게 같은 메시지를 전달해야 한다.
- `sessionManager.sendAll(totalMessage)`를 사용해서 해당 기능을 처리한다.
- `/exit`가 호출되면 `IOException`을 던진다. 세션은 해당 예외를 잡아서 세션을 종료한다.
- `CommandManagerV1`은 최소한의 메시지 전달 기능만 구현했다.

``` java
package chat.lecture.server;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import static util.MyLogger.log;

public class Server {

    private final int port;

    private final CommandManager commandManager;

    private final SessionManager sessionManager;

    private ServerSocket serverSocket;

    public Server(int port, CommandManager commandManager, SessionManager sessionManager) {
        this.port = port;
        this.commandManager = commandManager;
        this.sessionManager = sessionManager;
    }

    public void start() throws IOException {
        log("서버 시작: " + commandManager.getClass());
        serverSocket = new ServerSocket(port);
        log("서버 소켓 시작 - 리스닝 포트: " + port);

        addShutdownHook();
        running();
    }

    private void addShutdownHook() {
        ShutdownHook target = new ShutdownHook(serverSocket, sessionManager);
        Runtime.getRuntime().addShutdownHook(new Thread(target, "shutdown"));
    }

    private void running() {
        try {
            while (true) {
                Socket socket = serverSocket.accept();
                log("소켓 연결: " + socket);
                Session session = new Session(socket, commandManager, sessionManager);
                Thread thread = new Thread(session);

                thread.start();
            }
        } catch (IOException e) {
            log("서버 소켓 종료: " + e);
        }
    }

    static class ShutdownHook implements Runnable {

        private final ServerSocket serverSocket;

        private final SessionManager sessionManager;

        public ShutdownHook(ServerSocket serverSocket, SessionManager sessionManager) {
            this.serverSocket = serverSocket;
            this.sessionManager = sessionManager;
        }

        @Override
        public void run() {
            log("shutdownHook 실행");

            try {
                sessionManager.closeAll();
                serverSocket.close();

                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("e = " + e);
            }
        }
    }
}
```

- 이전 포스팅의 네트워크 프로그램과 거의 유사하다.
- `addShutdownHook()` 셧다운 훅을 등록한다.
- `running()` : 클라이언트의 연결을 처리하고 세션을 생성한다.

``` java
package chat.lecture.server;

import java.io.IOException;

public class ServerMain {

    private static final int PORT = 12345;

    public static void main(String[] args) throws IOException {
        SessionManager sessionManager = new SessionManager();
        CommandManager commandManager = new CommandManagerV1(sessionManager);
        Server server = new Server(PORT, commandManager, sessionManager);

        server.start();
    }
}
```

- `Server`는 생성자로 `SessionManager`와 `CommandManager`가 필요하다.

이제 `CommandManager`의 구현체를 발전시켜보면서 기능을 붙이면서 나아가보자.

## 채팅 프로그램 - 서버2

이제 요구사항에 맞춰 기능을 추가해보자.

``` java
package chat.lecture.server;

import java.io.IOException;
import java.util.List;

public class CommandManagerV2 implements CommandManager {

    public static final String DELIMITER = "\\|";

    private final SessionManager sessionManager;

    public CommandManagerV2(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String totalMessage, Session session) throws IOException {
        if (totalMessage.startsWith("/join")) {
            String[] split = totalMessage.split(DELIMITER);
            String username = split[1];

            session.setUsername(username);
            sessionManager.sendAll(username + "님이 입장했습니다.");
        } else if (totalMessage.startsWith("/message")) {
            String[] split = totalMessage.split(DELIMITER);
            String message = split[1];

            sessionManager.sendAll("[" + session.getUsername() + "] " + message);
        } else if (totalMessage.startsWith("/change")) {
            String[] split = totalMessage.split(DELIMITER);
            String changeName = split[1];

            sessionManager.sendAll(session.getUsername() + "님이 " + changeName + "로 이름을 변경했습니다.");
            session.setUsername(changeName);
        } else if (totalMessage.startsWith("/users")) {
            List<String> usernames = sessionManager.getAllUsername();
            StringBuilder sb = new StringBuilder();

            sb.append("전체 접속자: ").append(usernames.size()).append("\n");

            for (String username : usernames) {
                sb.append(" - ").append(username).append("\n");
            }

            session.send(sb.toString());
        } else if (totalMessage.startsWith("/exit")) {
            throw new IOException("exit");
        } else {
            session.send("처리할 수 없는 명령어입니다: " + totalMessage);
        }
    }
}
```

위와 같이 작성해서 요구사항에 맞춰 기능 구현을 완료하였다. 하지만 지금 뭔가 코드가 `if-else if` 지옥에 빠진 것 같다. 그래서 코드가 한 눈에 들어오지 않는다. 그러면 한번 이 부분을 해결해보자.

## 채팅 프로그램 - 서버3

그러면 디자인 패턴 중에 커맨드 패턴을 통하여 `if-else if` 지옥을 탈출해보자.

각각의 명령어를 하나의 `Command`로 보고 인터페이스와 구현체로 구분해보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;

import java.io.IOException;

@FunctionalInterface
public interface Command {
    void execute(String[] args, Session session) throws IOException;
}
```

- `Command` 인터페이스이다. 각각의 명령어 하나를 처리하는 목적으로 만들었다.

이제 우리가 구현체로 만들 명령 객체를 만들어 보자. 현재 우리가 구현해야 할 명령어는 입장, 메세지, 이름 변경, 전체 사용자, 종료 총 5가지 명령어가 존재한다. 하나씩 구현해보자. 먼저 입장 명령 객체를 만들어보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;
import chat.lecture.server.SessionManager;

import java.io.IOException;

public class JoinCommand implements Command {

    private final SessionManager sessionManager;

    public JoinCommand(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String[] args, Session session) throws IOException {
        String username = args[1];
        session.setUsername(username);
        sessionManager.sendAll(username + "님이 입장했습니다.");
    }
}
```

다음으로 메세지 명령 객체를 만들어보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;
import chat.lecture.server.SessionManager;

import java.io.IOException;

public class MessageCommand implements Command {

    private final SessionManager sessionManager;

    public MessageCommand(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String[] args, Session session) throws IOException {
        String message = args[1];
        sessionManager.sendAll("[" + session.getUsername() + "] " + message);
    }
}
```

다음으로 이름 변경 명령 객체를 만들어보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;
import chat.lecture.server.SessionManager;

import java.io.IOException;

public class ChangeCommand implements Command {

    private final SessionManager sessionManager;

    public ChangeCommand(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String[] args, Session session) throws IOException {
        String changeName = args[1];
        sessionManager.sendAll(session.getUsername() + "님이 " + changeName + "로 이름을 변경했습니다.");
        session.setUsername(changeName);
    }
}
```

이제 전체 사용자 조회 명령 객체를 만들어 보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;
import chat.lecture.server.SessionManager;

import java.io.IOException;
import java.util.List;

public class UsersCommand implements Command {

    private final SessionManager sessionManager;

    public UsersCommand(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public void execute(String[] args, Session session) throws IOException {
        List<String> usernames = sessionManager.getAllUsername();
        StringBuilder sb = new StringBuilder();

        sb.append("전체 접속자: ").append(usernames.size()).append("\n");

        for (String username : usernames) {
            sb.append(" - ").append(username).append("\n");
        }

        session.send(sb.toString());
    }
}
```

마지막으로 종료 명령 객체를 만들어보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;

import java.io.IOException;

public class ExitCommand implements Command {

    @Override
    public void execute(String[] args, Session session) throws IOException {
        throw new IOException("exit");
    }
}
```

이제 `CommandManager`를 고쳐보자.

``` java
package chat.lecture.server;

import chat.lecture.server.command.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CommandManagerV3 implements CommandManager {

    public static final String DELIMITER = "\\|";

    private final Map<String, Command> commands = new HashMap<>();

    public CommandManagerV3(SessionManager sessionManager) {
        commands.put("/join", new JoinCommand(sessionManager));
        commands.put("/message", new MessageCommand(sessionManager));
        commands.put("/change", new ChangeCommand(sessionManager));
        commands.put("/users", new UsersCommand(sessionManager));
        commands.put("/exit", new ExitCommand());
    }

    @Override
    public void execute(String totalMessage, Session session) throws IOException {
        String[] args = totalMessage.split(DELIMITER);
        String key = args[0];
        Command command = commands.get(key);

        if (command == null) {
            session.send("처리할 수 없는 명령어입니다: " + totalMessage);
            return;
        }

        command.execute(args, session);
    }
}
```

생성자 부분에서 명령어를 Map에 보관한다. 명령어 자체를 Key로 사용하고, 각 Key 해당하는 `Command` 구현체를 저장해두도록 한다. 그리고 `execute()`를 처리할 때 각 커맨드 객체로 실행이 된다. 왜냐하면 이전에 `Command command = commands.get(key);`로 명령 구현체를 가져올 수 있기 때문이다.

> ✅ 참고
>
> 여러 스레드가 `commands = new HashMap<>()`을 동시에 접근해서 데이터를 조회한다. 하지만 `commands`는 데이터 초기화 이후에는 데이터를 전혀 변경하지 않는다. 따라서 여러 스레드가 동시에 값을 조회해도 문제가 발생하지 않는다. 만약 `commands`의 데이터를 중간에 변경할 수 있게 하려면 동시성 문제를 고민해야 한다.

## 채팅 프로그램 - 서버4

위의 코드에서 `command`가 없는 경우에 `null`을 체크하고 처리해야 하는 부분이 좀 지저분하다. 이 점을 어떻게 깔끔하게 할 수 없을까? 해결방안은 단순하다. 바로 `null`인 상황을 처리할 객체를 만들어버리는 것이다. 그럼 코드를 살펴보자.

``` java
package chat.lecture.server.command;

import chat.lecture.server.Session;

import java.io.IOException;
import java.util.Arrays;

public class DefaultCommand implements Command {

    @Override
    public void execute(String[] args, Session session) throws IOException {
        session.send("처리할 수 없는 명령어입니다: " + Arrays.toString(args));
    }
}
```

위와 같이 `null`인 상황을 객체로 만들었다. 이제 `CommandManager`를 수정해보자.

``` java
package chat.lecture.server;

import chat.lecture.server.command.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CommandManagerV4 implements CommandManager {

    public static final String DELIMITER = "\\|";

    private final Map<String, Command> commands;

    private final Command defaultCommand = new DefaultCommand();

    public CommandManagerV4(SessionManager sessionManager) {
        commands = new HashMap<>();
        commands.put("/join", new JoinCommand(sessionManager));
        commands.put("/message", new MessageCommand(sessionManager));
        commands.put("/change", new ChangeCommand(sessionManager));
        commands.put("/users", new UsersCommand(sessionManager));
        commands.put("/exit", new ExitCommand());
    }

    @Override
    public void execute(String totalMessage, Session session) throws IOException {
        String[] args = totalMessage.split(DELIMITER);
        String key = args[0];
        Command command = commands.getOrDefault(key, defaultCommand);

        command.execute(args, session);
    }
}
```

- `Map`에는 `getOrDefault(key, defaultObject)`라는 메서드가 존재한다.
- 만약 key를 사용해서 객체를 찾을 수 있다면 찾고, 찾을 수 없다면 옆에 있는 `defaultObject`를 반환한다.
- 이 기능을 사용하면 `null` 을 받지 않고 항상 `Command` 객체를 받아서 처리할 수 있다.

### Null Object Pattern

이와 같이 `null` 을 객체(Object)처럼 처리하는 방법을 Null Object Pattern 이라 한다. 이 디자인 패턴은 `null` 대신 사용할 수 있는 특별한 객체를 만들어, `null`로 인해 발생할 수 있는 예외 상황을 방지하고 코드의 간결성을 높이는 데 목적이 있다. Null Object Pattern을 사용하면 `null` 값 대신 특정 동작을 하는 객체를 반환하게 되어, 클라이언트 코드에서 `null` 체크를 할 필요가 없어진다. 이 패턴은 코드에서 불필요한 조건문을 줄이고 객체의 기본 동작을 정의하는 데 유용하다.

### Command Pattern

커맨드 패턴은 디자인 패턴 중 하나로, 요청을 독립적인 객체로 변환해서 처리한다. 커맨드 패턴의 특징은 다음과 같다.

- 분리: 작업을 호출하는 객체와 작업을 수행하는 객체를 분리한다.
- 확장성: 기존 코드를 변경하지 않고 새로운 명령을 추가할 수 있다.

#### 장점

- 이 패턴의 장점은 새로운 커맨드를 쉽게 추가할 수 있다는 점이다. 예를 들어, 새로운 커맨드를 추가하고 싶다면, 새로운 `Command` 의 구현체만 만들면 된다. 그리고 기존 코드를 대부분 변경할 필요가 없다.
- 작업을 호출하는 객체와 작업을 수행하는 객체가 분리되어 있다. 이전 코드에서는 작업을 호출하는 if 문이 각 작업마다 등장했는데, 커맨드 패턴에서는 이런 부분을 하나로 모아서 처리할 수 있다.
- 각각의 기능이 명확하게 분리된다. 개발자가 어떤 기능을 수정해야 할 때, 수정해야 하는 클래스가 아주 명확해진다.

#### 단점

- 복잡성 증가: 간단한 작업을 수행하는 경우에도 `Command` 인터페이스와 구현체들, `Command` 객체를 호출하고 관리하는 클래스등 여러 클래스를 생성해야 하기 때문에 코드의 복잡성이 증가할 수 있다.
- 모든 설계에는 트레이드 오프가 있다. 예를 들어 단순한 if문 몇게로 해결할 수 있는 문제에 복잡한 커맨드 패턴을 도입하는 것은 좋은 설계가 아닐 수 있다.
- 기능이 어느정도 있고, 각각의 기능이 명확하게 나누어질 수 있고, 향후 기능의 확장까지 고려해야 한다면 커맨드 패턴은 좋은 대안이 될 수 있다.

이제 서버 코드가 완료되었고 채팅 프로그램이 완료되었다. 이제 서버파트의 나의 코드를 살펴보자.

먼저 `Session` 객체부터 살펴보자.

``` java
package chat.me;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;

import static network.tcp.SocketCloseUtil.closeAll;
import static util.MyLogger.log;

public class Session implements Runnable {

    private final Socket socket;

    private final DataInputStream input;

    private final DataOutputStream output;

    private final SessionManager sessionManager;

    private User user = new User();

    private boolean closed = false;

    public Session(Socket socket, SessionManager sessionManager) throws IOException {
        this.socket = socket;
        this.input = new DataInputStream(socket.getInputStream());
        this.output = new DataOutputStream(socket.getOutputStream());
        this.sessionManager = sessionManager;
        this.sessionManager.add(this);
    }

    public User getUser() {
        return user;
    }

    @Override
    public void run() {
        try {
            while (true) {
                String received = input.readUTF();

                if (received.startsWith("/join")) {
                    String username = received.split("/")[1].split("\\|")[1];

                    String message = username + "님이 입장하셨습니다.";
                    user.setName(username);
                    log(message);
                    sessionManager.sendAll(message);
                }

                if (received.startsWith("/message")) {
                    String message = received.split("/")[1].split("\\|")[1];
                    log(message);
                    sessionManager.sendAll(message);
                }

                if (received.startsWith("/change")) {
                    String changeUsername = received.split("/")[1].split("\\|")[1];
                    sessionManager.sendAll(user.getName() + "님의 이름이 " + changeUsername + "으로 변경되었습니다.");
                    user.setName(changeUsername);
                }

                if (received.startsWith("/users")) {
                    sessionManager.getAllUsername().forEach(username -> {
                        log(username);
                        sessionManager.sendAll(username);
                    });
                }

                if (received.startsWith("/exit")) {
                    throw new IOException("exit");
                }
            }
        } catch (IOException e) {
            log(e);
        } finally {
            sessionManager.remove(this);
            sessionManager.sendAll(user.getName() + "님이 퇴장하였습니다.");
            close();
        }
    }

    public synchronized void close() {
        if (closed) {
            return;
        }

        closeAll(socket, input, output);
        closed = true;
        log("연결 종료: " + socket);
    }

    public synchronized void send(String message) {
        try {
            output.writeUTF(message);
        } catch (IOException e) {
            log(e);
        }
    }
}
```

해당 부분에서는 동시성 부분을 고려하였다. 나는 `if-else if`대신에 `early return` 구조로 작성하였다. 그리고 `User` 클래스가 있으니 이름을 예제처럼 `Session`이 관리하지 않고 `User`를 반환하게끔 작성했다. 해당 부분은 잘 작성한 듯 보이지만 디자인 패턴 미적용 및 유지보수가 힘들어 보인다.

다음으로 `SessionManager`를 살펴보자.

``` java
package chat.me;

import java.util.ArrayList;
import java.util.List;

public class SessionManager {

    private List<Session> sessions = new ArrayList<>();

    public synchronized void add(Session session) {
        sessions.add(session);
    }

    public synchronized void remove(Session session) {
        sessions.remove(session);
    }

    public synchronized void closeAll() {
        for (Session session : sessions) {
            session.close();
        }

        sessions.clear();
    }

    public synchronized void sendAll(String message) {
        for (Session session : sessions) {
            session.send(message);
        }
    }

    public synchronized List<String> getAllUsername() {
        List<String> usernames = new ArrayList<>();
        for (Session session : sessions) {
            usernames.add(session.getUser().getName());
        }

        return usernames;
    }
}
```

세션 매니저도 예제와 비슷하다. 다만 아쉬운 점은 예외 발샘할 수 있음을 전혀 생각하지 못하고 예외처리를 하지를 않았다. 또한 `getAllUsername()`에서 이름이 `null`일 부분을 생각을 못했다.

마지막으로 서버 코드를 살펴보자.

``` java
package chat.me;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

import static util.MyLogger.log;

public class Server {

    private static final int PORT = 12345;

    public static void main(String[] args) throws IOException {
        log("서버 시작");
        SessionManager sessionManager = new SessionManager();
        ServerSocket serverSocket = new ServerSocket(PORT);
        log("서버 소켓 시작 - 리스닝 포트: " + PORT);

        ShutdownHook shutdownHook = new ShutdownHook(serverSocket, sessionManager);
        Runtime.getRuntime().addShutdownHook(new Thread(shutdownHook, "shutdown"));

        try {
            while (true) {
                Socket socket = serverSocket.accept();
                log("소켓 연결: " + socket);

                Session session = new Session(socket, sessionManager);
                Thread thread = new Thread(session);
                thread.start();
            }
        } catch (IOException e) {
            log("서버 소켓 종료: " + e);
        }
    }

    static class ShutdownHook implements Runnable {

        private final ServerSocket serverSocket;

        private final SessionManager sessionManager;

        public ShutdownHook(ServerSocket serverSocket, SessionManager sessionManager) {
            this.serverSocket = serverSocket;
            this.sessionManager = sessionManager;
        }

        @Override
        public void run() {
            log("shutdownHook 실행");

            try {
                sessionManager.closeAll();
                serverSocket.close();

                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("e = " + e);
            }
        }
    }
}
```

예제코드와 비교하면 뭔가 처참하다. 메서드 분리도 안 하였고 `main`을 직접 여기서 실행하니 매우 복잡해 보였다.

## 정리

조금은 채팅 프로그램을 내가 스스로 만든 것은 정말 좋은 경험이였지만 뭔가 강의와 비교하면서 많이 부족한 코드라고 느껴졌다. 내 방식대로 다시 한번 개발해보면 좋을 것 같다고 느껴진다. 그리고 강의에서 배운 디자인 패턴도 한번 공부해보자!

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!