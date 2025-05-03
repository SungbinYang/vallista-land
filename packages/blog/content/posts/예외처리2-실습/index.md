---
title: "[자바 중급1] 예외처리2 - 실습"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-03 19:34:27
series: 자바 중급1
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/FiFGQ)를 바탕으로 쓰여진 글입니다.

## 예외 처리 도입1 - 시작

이제 우리가 만들었던 네트워크 전송 프로그램에 예외처리 부분을 추가해보겠다. 기존에는 정상흐름과 예외흐름이 혼재하여 코드가 너무 복잡했다. 이제 예외처리를 통해 조금 간결하게 작성해보자.

``` java
package exception.ex2;

public class NetworkClientExceptionV2 extends Exception {

    private String errorCode;

    public NetworkClientExceptionV2(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
```

위의 코드는 체크 예외를 상속받은 커스텀 예외를 작성했다. 기존에 우리는 문자열로 예외코드를 서비스 로직에서 반환했었는데 그러지 말고 예외 클래스 생성자에 예외코드를 받아서 위와 같이 작성했다. 또한 메세지도 작성하게끔 생성자에 넣어두었다. 오류 메세지는 어떤 오류가 발생했는지 개발자가 보고 이해할 수 있는 설명을 담아둔다. 그래서 오류 메세지는 최대한 자세히 작성해야 한다. 만약 의미없는 메세지를 작성하거나 작성하지 않으면 나중에 개발자들이 고생한다. 퇴근하다가 슬랙 알림으로 예외 알림이 떴는데 어떤 메세지인지 알 수가 없다면 정말 고생할 것이다.

다음으로 기존 `Client` 코드를 고쳐보자. 기존에는 오류 코드를 반환하기 위해서 반환값을 받았지만 지금은 오류코드가 예외 클래스에 있으므로 반환을 받을 필요가 없다.

``` java
package exception.ex2;

public class NetworkClientV2 {

    private final String address;

    private boolean connectError;

    private boolean sendError;

    public NetworkClientV2(String address) {
        this.address = address;
    }

    public void connect() throws NetworkClientExceptionV2 {
        if (connectError) {
            throw new NetworkClientExceptionV2("connectError", address + " 서버 연결 실패");
        }

        System.out.println(address + " 서버 연결 성공");
    }

    public void send(String data) throws NetworkClientExceptionV2 {
        if (sendError) {
            throw new NetworkClientExceptionV2("sendError", address + " 서버에 데이터 전송 실패: " + data);
        }

        System.out.println(address + " 서버에 데이터 전송: " + data);
    }

    public void disconnect() {
        System.out.println(address + " 서버 연결 해제");
    }

    public void initError(String data) {
        if (data.contains("error1")) {
            connectError = true;
        }

        if (data.contains("error2")) {
            sendError = true;
        }
    }
}
```

우리가 정의한 예외는 체크 예외이므로 예외를 잡아야 한다. 하지만 지금 `Client` 코드에서는 예외를 잡기에는 너무 애매하다. 왜냐하면 예외를 발생시킨 곳에서 예외를 잡으면 뭔가 상황이 맞지 않는다. 따라서 예외를 잡지 말고 `throws`를 이용하여 예외를 던졌다.

이제 `Service` 코드를 작성해보자.

``` java
package exception.ex2;

public class NetworkServiceV2_1 {

    public void sendMessage(String data) throws NetworkClientExceptionV2 {
        String address = "http://example.com";

        NetworkClientV2 client = new NetworkClientV2(address);
        client.initError(data);

        client.connect();
        client.send(data);
        client.disconnect();
    }
}
```

기존 코드와 완전 동일하나 유일하게 다른 점은 `Client`로 넘어온 예외를 던지는 부분만 추가해두었다. `Service`에서 예외를 던지는 이유는 무엇일까? 해당 클래스에서 예외를 잡아서 `try-catch`를 할 수 있다. 하지만 정상 흐름 로직이 예외 로직과 섞여서 기존에 문제 상황을 해결 할 수 없는 것이다. 따라서 해당 부분에서 처리하지 않고 던진 것이다.

이제 `main` 메서드를 작성해보자.

``` java
package exception.ex2;

import java.util.Scanner;

public class MainV2 {
    public static void main(String[] args) throws NetworkClientExceptionV2 {
        NetworkServiceV2_1 networkService = new NetworkServiceV2_1();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.print("전송할 문자: ");

            String input = scanner.nextLine();

            if (input.equals("exit")) {
                break;
            }

            networkService.sendMessage(input);
            System.out.println();
        }

        System.out.println("프로그램을 정상 종료합니다.");
    }
}
```

`main`메서드에서도 던져서 받은 예외를 던지게끔 처리했다. 이렇게 하고 실행을 하면 예외가 발생하면 예외가 `main` 메서드 밖으로 던져지고 예외 메세지와 스택트레이스가 전달되고 프로그램이 종료될 것이다. 아무튼, 기존의 성공 흐름과 실패 흐름이 혼재되어 있는 것을 방지하게 되었다. 하지만 이제 또 다른 문제가 생겼다.

- 예외 처리를 도입했지만, 아직 예외가 복구되지 않는다. 따라서 예외가 발생하면 발생하면 프로그램이 종료된다.
- 사용 후에는 반드시 `disconnect()` 를 호출해서 연결을 해제해야 한다. 지금은 예외가 `main` 밖으로 던져져서 프로그램이 강제 종료되므로 `disconnect()`를 호출하지 못한다.

## 예외 처리 도입2 - 예외 복구

이번에는 예외를 잡아서 예외 흐름을 정상 흐름으로 복구해보자. 기존에 `Service` 클래스에서 예외를 던지지 말고 `try-catch`로 잡아보자.

``` java
package exception.ex2;

public class NetworkServiceV2_2 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV2 client = new NetworkClientV2(address);
        client.initError(data);

        try {
            client.connect();
        } catch (NetworkClientExceptionV2 e) {
            System.out.println("[오류] 코드: " + e.getErrorCode() + ", 메세지: " + e.getMessage());
            return;
        }

        try {
            client.send(data);
        } catch (NetworkClientExceptionV2 e) {
            System.out.println("[오류] 코드: " + e.getErrorCode() + ", 메세지: " + e.getMessage());
            return;
        }

        client.disconnect();
    }
}
```

`connect()`메서드와 `send()`메서드에서 각각 예외를 던지므로 예외를 받아서 처리하였다. 또한 각각 예외가 발생해서 예외처리를 한 후에 그 다음 로직은 수행이되면 안된다. 연결에 실패하였다면 데이터 전송은 하면 안되는 것처럼 말이다. 그래서 `early-return`구조로 `catch`블록에서 예외 로그를 작성하고 `return`을 해준 것이다. 이제 정상적으로 예외때문에 프로그램이 강제종료가 되는 것을 방지할 수 있었다. 하지만 몇가지 문제가 남아있다.

- 예외 처리를 했지만 정상 흐름과 예외 흐름이 섞여 있어서 코드를 읽기 어렵다.
- 사용 후에는 반드시 `disconnect()` 를 호출해서 연결을 해제해야 한다.

## 예외 처리 도입3 - 정상, 예외 흐름 분리

이번에는 예외 처리의 `try ~ catch` 기능을 제대로 사용해서 정상 흐름과 예외 흐름이 섞여 있는 문제를 해결해보자.

기존 `Service` 코드를 보니, `catch` 블록에 코드가 중복되고 있다는 것을 볼 수 있다. 즉, 하나로 합칠 수 있을 것 같다는 킹리적 갓심이 든다.

``` java
package exception.ex2;

public class NetworkServiceV2_3 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV2 client = new NetworkClientV2(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
            client.disconnect();
        } catch (NetworkClientExceptionV2 e) {
            System.out.println("[오류] 코드: " + e.getErrorCode() + ", 메세지: " + e.getMessage());
        }
    }
}
```

위와 같이 변경함으로서 우리는 정상 흐름과 실패 흐름을 분리할 수 있었다. 또한 중복되는 코드도 하나로 합칠 수 있었다. 이제 한 가지 남은 문제가 있다.

- 사용 후에는 반드시 `disconnect()` 를 호출해서 연결을 해제해야 한다.

지금 로직에서는 `connect()` 메서드나 `send()` 메서드에서 예외가 발생하면 `catch` 블록으로 가기 때문에 `disconnect()` 메서드는 예외가 발생하면 절대 호출이 되지 않는다. 이것을 개선해보자.

## 예외 처리 도입4 - 리소스 반환 문제

`disconnect()` 메서드를 항상 호출하려면 아래와 같이 코드를 변경하면 될 듯 보인다.

``` java
package exception.ex2;

public class NetworkServiceV2_4 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV2 client = new NetworkClientV2(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
        } catch (NetworkClientExceptionV2 e) {
            System.out.println("[오류] 코드: " + e.getErrorCode() + ", 메세지: " + e.getMessage());
        }

        client.disconnect();
    }
}
```

`try-catch` 블록에만 예외가 발생할 것 같은 메서드들을 작성해두고 `disconnect()` 메서드는 항상 호출하게끔 `try-catch` 블록 밖에 두는 것이다. 그러면 이제 예외가 발생해도 정상적으로 `disconnect()` 메서드를 호출하는듯 보인다. 하지만 여기에는 심각한 문제가 있다.

만약 `send()` 메서드에서 아래와 같이 `apiCall()`이라는 메서드를 호출하는데 해당 메서드가 런타임 예외를 발생시키면 어떻게 될까?

``` java
public void send(String message) {
    apiCall();
}
```

그러면 런타임 예외가 발생하고 `catch` 블록으로 갈까? 그럴 수 없다. `catch` 블록에서는 해당 런타임 예외를 잡지 못한다. 지금 `catch` 블록에는 체크 예외를 상속받은 커스텀 예외를 잡고 있어서 해당 체크 예외 부모 타입이 아니면 잡지 못하고 예외가 밖으로 던져진다. 즉, 프로그램이 강제종료되는 사태를 발생시킨다. 그러면 어떻게 `disconnect()` 메서드를 호출시킬까?

## 예외 처리 도입5 - finally

자바는 어떤 경우라도 반드시 호출되는 `finally` 기능을 제공한다.

``` java
try {
    // 정상 흐름
} catch {
    // 예외 흐름
} finally {
    // 마무리 흐름
}
```

- `try ~ catch ~ finally` 구조는 정상 흐름, 예외 흐름, 마무리 흐름을 제공한다.
- 여기서 `try` 를 시작하기만 하면, `finally` 코드 블럭은 어떤 경우라도 반드시 호출된다.
- 심지어 `try`,`catch` 안에서 잡을 수 없는 예외가 발생해도 `finally`는 반드시 호출된다.

그러면 기존 `Service` 코드를 `finally`를 적용해서 리팩토링 해보자.

``` java
package exception.ex2;

public class NetworkServiceV2_5 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV2 client = new NetworkClientV2(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
        } catch (NetworkClientExceptionV2 e) {
            System.out.println("[오류] 코드: " + e.getErrorCode() + ", 메세지: " + e.getMessage());
        } finally {
            client.disconnect();
        }
    }
}
```

이렇게 리팩토링 함으로써 흐름들을 분리하고 `catch`에서 잡지 못하는 예외가 발생해도 `finally`는 반드시 호출되기 때문에 이제 완벽해진 프로그램이 되었다.

### try ~ finally

다음과 같이 `catch` 없이 `try ~ finally` 만 사용할 수도 있다.

``` java
try {
    // 정상 흐름
} finally {
    // 마무리 흐름
}
```

예외를 직접 잡아서 처리할 일이 없다면 이렇게 사용하면 된다. 이렇게 하면 예외를 밖으로 던지는 경우에도 `finally` 호출이 보장된다.

## 예외 계층1 - 시작

예외를 단순히 오류 코드로 분류하는 것이 아니라, 예외를 계층화해서 다양하게 만들면 더 세밀하게 예외를 처리할 수 있다.

지금은 단순히 `NetworkException`을 구현하고 해당 예외 클래스 하나로 퉁 쳤지만 해당 예외 클래스를 상속 시켜서 더욱 세밀한 예외를 하면 세분화된 예외처리를 진행이 가능하고 나중에 예외 클래스명만 봐도 대강 어떤 예외인지 감이 올 수 있다.

이렇게 예외를 계층화하면 아래와 같은 장점이 존재한다.

- 자바에서 예외는 객체이다. 따라서 부모 예외를 잡거나 던지면, 자식 예외도 함께 잡거나 던질 수 있다.
- 특정 예외를 잡아서 처리하고 싶으면 하위 예외를 잡아서 처리하면 된다.

그럼 코드를 개선해보자.

``` java
package exception.ex3.exception;

public class NetworkClientExceptionV3 extends Exception {
    public NetworkClientExceptionV3(String message) {
        super(message);
    }
}
```

위와 같은 네트워크 상위 예외를 선언해두고 이 예외 클래스를 상속 받는 다양한 커스텀 예외를 개발해보자. 지금은 연결과 전송 관련 부분에서 예외가 발생함으로 해당 예외클래스를 만들어보자.

``` java
package exception.ex3.exception;

public class ConnectExceptionV3 extends NetworkClientExceptionV3 {

    private final String address;

    public ConnectExceptionV3(String address, String message) {
        super(message);
        this.address = address;
    }

    public String getAddress() {
        return address;
    }
}
```

연결 예외를 만들고 기존 네트워크 예외를 상속 받았다. 또한 연결 예외만이 가지고 있는 필드를 선언하였다. 이렇게 함으로 연결이 안되었다고 예외가 발생했을 때 어느 주소(url)에서 발생하는지 로그를 통해 쉽게 확인이 가능해진다.

``` java
package exception.ex3.exception;

public class SendExceptionV3 extends NetworkClientExceptionV3 {

    private final String sendData;

    public SendExceptionV3(String sendData, String message) {
        super(message);
        this.sendData = sendData;
    }

    public String getSendData() {
        return sendData;
    }
}
```

전송 예외를 만들고 기존 네트워크 예외를 상속받았다. 추가적으로 전송 예외만이 가지고 있는 필드를 선언하였다. 이렇게 함으로 어느 전송 데이터를 보낼 때 예외가 발생했는지 확인하고 특정 전송 데이터에서 예외가 자주 발생한다면 그 부분에 대해서 더욱 최적화를 할 수 있을 것이다.

이제 세분화한 예외를 이용해서 `Client` 클래스를 리팩토링 해보자.

``` java
package exception.ex3;

import exception.ex3.exception.ConnectExceptionV3;
import exception.ex3.exception.SendExceptionV3;

public class NetworkClientV3 {

    private final String address;

    private boolean connectError;

    private boolean sendError;

    public NetworkClientV3(String address) {
        this.address = address;
    }

    public void connect() throws ConnectExceptionV3 {
        if (connectError) {
            throw new ConnectExceptionV3(address, address + " 서버 연결 실패");
        }

        System.out.println(address + " 서버 연결 성공");
    }

    public void send(String data) throws SendExceptionV3 {
        if (sendError) {
            throw new SendExceptionV3(data, address + " 서버에 데이터 전송 실패: " + data);
        }

        System.out.println(address + " 서버에 데이터 전송: " + data);
    }

    public void disconnect() {
        System.out.println(address + " 서버 연결 해제");
    }

    public void initError(String data) {
        if (data.contains("error1")) {
            connectError = true;
        }

        if (data.contains("error2")) {
            sendError = true;
        }
    }
}
```

이렇게 세분화된 예외 클래스를 사용하니 메세지도 더욱 구체화할 수 있는 것을 볼 수 있다. 이제 `Service` 클래스를 작성해보자.

``` java
package exception.ex3;

import exception.ex3.exception.ConnectExceptionV3;
import exception.ex3.exception.SendExceptionV3;

public class NetworkServiceV3_1 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV3 client = new NetworkClientV3(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
        } catch (ConnectExceptionV3 e) {
            System.out.println("[연결 오류] 주소: " + e.getAddress() + ", 메세지: " + e.getMessage());
        } catch (SendExceptionV3 e) {
            System.out.println("[전송 오류] 전송 데이터: " + e.getSendData() + ", 메세지: " + e.getMessage());
        } finally {
            client.disconnect();
        }
    }
}
```

이렇게 여러 예외를 잡을 때는 `catch` 블록을 여러개 잡으면 된다. 예외 클래스를 각각의 예외 상황에 맞추어 만들면, 각 필요에 맞는 예외를 잡아서 처리할 수 있다. 예를 들면 `e.getAddress()` , `e.getSendData()` 와 같이 각각의 예외 클래스가 가지는 고유의 기능을 활용 할 수 있다.

> ✅ 참고
>
> `catch` 블록이 가장 먼저 선언된 예외부터 처리가 된다. 즉, 여러 예외가 한번에 터지는 경우에 먼저 선언된 `catch`블록부터 확인한다. 그래서 만약 세분화된 예외와 부모 예외를 한번에 잡으려는 경우 반드시 세분화된 예외부터 작성해야 한다. 그렇지 않으면 전부 부모 예외에 잡히게 되는 것이다.

## 예외 계층2 - 활용

만약에 수 많은 예외들이 터진다고 생각해보자. 그러면 해당 예외들을 전부 클래스로 만들어서 `catch` 블록에서 잡아야 할까? 그러면 `catch` 지옥에 빠질 것이다. 그래서 보통은 매우 중요한 예외들만 클래스로 잡고 나머지 예외들은 큰 부모 예외로 처리하기 마련이다. 이런식으로 예제 코드도 바꿔보자. 현재 예제에서 연결부분이 가장 중요하다고 생각해보자.

``` java
package exception.ex3;

import exception.ex3.exception.ConnectExceptionV3;
import exception.ex3.exception.NetworkClientExceptionV3;

public class NetworkServiceV3_2 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV3 client = new NetworkClientV3(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
        } catch (ConnectExceptionV3 e) {
            System.out.println("[연결 오류] 주소: " + e.getAddress() + ", 메세지: " + e.getMessage());
        } catch (NetworkClientExceptionV3 e) {
            System.out.println("[네트워크 오류] 메세지: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("[알 수 없는 오류] 메세지: " + e.getMessage());

        } finally {
            client.disconnect();
        }
    }
}
```

이렇게 함으로 위와 같이 연결 예외부터 먼저 확인하고 다음 네트워크 예외 다음 공통 예외 순으로 예외를 잡는다. 그래서 만약 알수없는 런타임 예외가 발생해도 `catch` 블록에서 잡아 낼 수 있다.

> ⚠️ 주의
>
> 예외가 발생했을 때 `catch` 를 순서대로 실행하므로, 더 디테일한 자식을 먼저 잡아야 한다.

### 여러 예외 한방에 잡기

다음과 같이 `|` 를 사용해서 여러 예외를 한번에 잡을 수 있다.

``` java
try {
    // ...
} catch (IllegalArgumentException | IllegalStateException e) {
    // 공통 예외처리
    log.error(e.getMessage())
}
```

이럴 경우 한방에 예외를 잡는 클래스들의 공통부분만 사용이 가능하다. 각자 개별로 가지고 있는 고유한 것들은 사용이 힘들다.

예외를 계층화하고 다양하게 만들면 더 세밀한 동작들을 깔끔하게 처리할 수 있다. 그리고 특정 분류의 공통 예외들도 한번에 `catch`로 잡아서 처리할 수 있다.

## 실무 예외 처리 방안1 - 설명

### 처리할 수 없는 예외

만약 DB나 Redis같은 것을 사용하고 있는데 갑자기 연결에 문제가 생겼다고 한다. 예를 들어, AWS 서비스를 이용해서 RDS같은것을 쓴다고 해보자. 그런데 갑자기 AWS 장애가 발생해서 연결이 안된다고 해보자. 이것을 우리는 처리할 수 있을까? 아무리 `catch`로 묶는다고 해서 이것을 내가 다시 복구시킬 수는 없다. 또 한 가지 예로 외부 API 서버를 쓰고 있는데 해당 API 서버가 장애가 났다고 해보자. 그러면 그 API 서버를 내가 복구시킬 수 있을까? 당연히 없고 내가 복구한다는것도 웃길 것이다. 보통은 우리는 이런 경우 고객에게는 "현재 시스템에 문제가 있습니다."라는 오류 메시지를 보여주고, 만약 웹이라면 오류 페이지를 보 여주면 된다. 그리고 내부 개발자가 문제 상황을 빠르게 인지할 수 있도록, 오류에 대한 로그를 남겨두어야 한다.

### 체크 예외 부담

체크 예외는 개발자가 실수로 놓칠 수 있는 예외들을 컴파일러가 체크해주기 때문에 오래전부터 많이 사용되었다. 그런데 앞서 설명한 것 처럼 처리할 수 없는 예외가 많아지고, 또 프로그램이 점점 복잡해지면서 체크 예외를 사용하는 것이 점점 더 부담스러워졌다. 만약에 DB, Redis, 외부 API 서버등등 수천가지를 실무에서 사용하는데 모두 체크 예외라고 생각해보자. 그리고 해당 부분은 전부 서비스 로직에서 사용된다고 하자. 그러면 서비스 클래스가 이 예외를 전부 받아서 처리해야한다. 수천가지니 `catch`블록도 수천가지일 것이다. 즉, 너무 코드가 지저분해진다. 또한 연결문제일 경우 `catch` 블록으로 연결을 강제할 수는 없다. 왜냐하면 내가 개발하는 범위 밖이기 때문이다. 즉, 우리가 할 수 있는 정도는 재시도를 하거나 로그정도만 남기는 수준일 것이다.

### 체크 예외 시나리오

그러면 예외를 다 던진다고 해보자. 서비스 코드에서 에외를 다 처리할 수 없으니 예외를 다 던진다고 해보자. 그러면 아래와 같이 `throws`문이 점점 길어질 것이고 어느 예외가 있는지 읽는데만 한 세월 걸릴 것이다.

``` java
class Service {
    void sendMessage(String data) throws NetworkException, DatabaseException, ...{
        ...
    }
}
```

그리고 만약에 `usecase`같은 클래스가 있다고 해보자. 그러면 그 `usecase`에서도 예외를 다 던지고 점점 더 코드가 난장판이 될 것이다.

그러면 이렇게 지저분하게 하지 말고 모든 예외의 부모인 `throws Exception`을 두면 어떨까? 이것이 정말 최악이다. `Exception` 은 최상위 타입이므로 모든 체크 예외를 다 밖으로 던지는 문제가 발생한다. 결과적으로 체크 예외의 최상위 타입인 `Exception` 을 던지게 되면 다른 체크 예외를 체크할 수 있는 기능이 무효화되고, 중요한 체크 예외를 다 놓치게 된다. 중간에 중요한 체크 예외가 발생해도 컴파일러는 `Exception` 을 던지기 때문에 문법에 맞다고 판단해서 컴파일 오류가 발생하지 않는다. 이렇게 하면 모든 예외를 다 던지기 때문에 체크 예외를 의도한 대로 사용하는 것이 아니다. 따라서 꼭 필요한 경우가 아니면 이렇게 `Exception` 자체를 밖으로 던지는 것은 좋지 않은 방법이다.

사실 서비스 클래스를 개발하는 개발자 입장에서 수 많은 라이브러리에서 쏟아지는 모든 예외를 다 다루고 싶지는 않을 것이다. 특히 본인이 해결할 수 도 없는 모든 예외를 다 다루고 싶지는 않을 것이다. 본인이 해결할 수 있는 예외만 잡아서 처리하고, 본인이 해결할 수 없는 예외는 신경쓰지 않는 것이 더 나은 선택일 수 있다.

### 언체크 예외 시나리오

이번에는 서비스 로직에서 받는 예외가 언체크 예외라고 해보자. 언체크 예외는 `throws`를 생략할 수 있다. 즉, 사용하는 라이브러리가 늘어나서 언체크 예외가 늘어도 본인이 필요한 예외만 잡으면 되고, `throws` 를 늘리지 않아도 된다.

이렇게 처리할 수 없는 예외들은 중간에 여러곳에서 나누어 처리하기 보다는 예외를 공통으로 처리할 수 있는 곳을 만들어서 한 곳에서 해결하면 된다. 어차피 해결할 수 없는 예외들이기 때문에 이런 경우 고객에게는 현재 시스템에 문제가 있습니다. 라고 오류 메시지를 보여주고, 만약 웹이라면 오류 페이지를 보여주면 된다. 그리고 내부 개발자가 지금의 문제 상황을 빠르게 인지할 수 있도록, 오류에 대한 로그를 남겨두면 된다. 이런 부분은 공통 처리가 가능하다.

## 실무 예외 처리 방안2 - 구현

그러면 이제 기존 예제 코드에서 체크예외를 런타임 예외로 변경해보자.

``` java
package exception.ex4.exception;

public class NetworkClientExceptionV4 extends RuntimeException {
    public NetworkClientExceptionV4(String message) {
        super(message);
    }
}
```

``` java
package exception.ex4.exception;

public class ConnectExceptionV4 extends NetworkClientExceptionV4 {

    private final String address;

    public ConnectExceptionV4(String address, String message) {
        super(message);
        this.address = address;
    }

    public String getAddress() {
        return address;
    }
}
```

``` java
package exception.ex4.exception;

public class SendExceptionV4 extends NetworkClientExceptionV4 {

    private final String sendData;

    public SendExceptionV4(String sendData, String message) {
        super(message);
        this.sendData = sendData;
    }

    public String getSendData() {
        return sendData;
    }
}
```

이렇게 `NetworkException`을 런타임 예외로 만들면 이를 상속하는 예외 클래스들도 전부 런타임 예외가 된다. 그러면 기존 `Client` 코드에서 `throws`를 전부 제외시킬 수 있게 된다.

``` java
package exception.ex4;

import exception.ex4.exception.ConnectExceptionV4;
import exception.ex4.exception.SendExceptionV4;

public class NetworkClientV4 {

    private final String address;

    private boolean connectError;

    private boolean sendError;

    public NetworkClientV4(String address) {
        this.address = address;
    }

    public void connect() {
        if (connectError) {
            throw new ConnectExceptionV4(address, address + " 서버 연결 실패");
        }

        System.out.println(address + " 서버 연결 성공");
    }

    public void send(String data) {
        if (sendError) {
            throw new SendExceptionV4(data, address + " 서버에 데이터 전송 실패: " + data);
        }

        System.out.println(address + " 서버에 데이터 전송: " + data);
    }

    public void disconnect() {
        System.out.println(address + " 서버 연결 해제");
    }

    public void initError(String data) {
        if (data.contains("error1")) {
            connectError = true;
        }

        if (data.contains("error2")) {
            sendError = true;
        }
    }
}
```

이제 `Service` 코드를 확인해보자.

``` java
package exception.ex4;

public class NetworkServiceV4 {

    public void sendMessage(String data) {
        String address = "http://example.com";

        NetworkClientV4 client = new NetworkClientV4(address);
        client.initError(data);

        try {
            client.connect();
            client.send(data);
        } finally {
            client.disconnect();
        }
    }
}
```

서비스 코드도 이제 체크 예외를 받는게 아니기에 `catch` 블록을 제거 시킬 수 있다. 마지막 `main` 메서드를 살펴보자.

``` java
package exception.ex4;

import exception.ex4.exception.SendExceptionV4;

import java.util.Scanner;

public class MainV4 {
    public static void main(String[] args) {
        NetworkServiceV5 networkService = new NetworkServiceV5();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.print("전송할 문자: ");

            String input = scanner.nextLine();

            if (input.equals("exit")) {
                break;
            }

            try {
                networkService.sendMessage(input);
            } catch (Exception e) {
                exceptionHandler(e);
            }

            System.out.println();
        }

        System.out.println("프로그램을 정상 종료합니다.");
    }

    private static void exceptionHandler(Exception e) {
        System.out.println("사용자 메세지: 죄송합니다. 알 수 없는 문제가 발생하였습니다.");
        System.out.println("==개발자용 디버깅 메세지==");
        e.printStackTrace(System.out);

        if (e instanceof SendExceptionV4 sendEx) {
            System.out.println("[전송 오류] 전송 데이터 : " + sendEx.getSendData());
        }
    }
}
```

`main`에서 `Exception`으로 예외를 잡은 것을 볼 수 있다. `Exception` 을 잡아서 지금까지 해결하지 못한 모든 예외를 여기서 공통으로 처리한다. `Exception` 을 잡으면 필요한 모든 예외를 잡을 수 있다. 예외도 객체이므로 공통 처리 메서드인 `exceptionHandler(e)` 에 예외 객체를 전달한다.

### exceptionHandler

- 해결할 수 없는 예외가 발생하면 사용자에게는 시스템 내에 알 수 없는 문제가 발생했다고 알리는 것이 좋다.
    - 사용자가 디테일한 오류 코드나 오류 상황까지 모두 이해할 필요는 없다. 예를 들어서 사용자는 데이터베이스 연결이 안되서 오류가 발생한 것인지, 네트워크에 문제가 있어서 오류가 발생한 것인지 알 필요는 없다.
- 개발자는 빨리 문제를 찾고 디버깅 할 수 있도록 오류 메시지를 남겨두어야 한다. 
- 예외도 객체이므로 필요하면 `instanceof` 와 같이 예외 객체의 타입을 확인해서 별도의 추가 처리를 할 수 있다.

### e.printStackTrace()

- 예외 메시지와 스택 트레이스를 출력할 수 있다.
- 이 기능을 사용하면 예외가 발생한 지점을 역으로 추적할 수 있다.
- `e.printStackTrace()` 를 사용하면 `System.err`이라는 표준 오류에 결과를 출력한다.

> ✅ 참고
>
> System.out` , `System.err` 둘다 결국 콘솔에 출력되지만, 서로 다른 흐름을 통해서 출력된다. 따라서 둘을 함께 사용하면 출력 순서를 보장하지 않는다. 출력 순서가 꼬여서 보일 수 있다.

> ✅ 참고
>
> 실무에서는 `System.out` 이나 `System.err` 을 통해 콘솔에 무언가를 출력하기 보다는, 주로 Slf4J, logback 같은 별도의 로그 라이브러리를 사용해서 콘솔과 특정 파일에 함께 결과를 출력한다. 그런데 `e.printStackTrace()` 를 직접 호출하면 결과가 콘솔에만 출력된다. 이렇게 되면 서버에서 로그를 확인하기 어렵다. 서버에서는 파일로 로그를 확인해야 한다. 따라서 콘솔에 바로 결과를 출력하는 `e.printStackTrace()` 는 잘 사용하지 않는다. 대신에 로그 라이브러리를 통해서 예외 스택 트레이스를 출력한다. 지금은 로그 라이브러리라는 것이 있다는 정도만 알아두자. 학습 단계에서는 `e.printStackTrace()` 를 적극 사용해도 괜찮다.

## try-with-resources

`try` 에서 외부 자원을 사용하고, `try` 가 끝나면 외부 자원을 반납하는 패턴이 반복되면서 자바에서는 Try with resources라는 편의 기능을 자바 7에서 도입했다. 이름 그대로 `try` 에서 자원을 함께 사용한다는 뜻이다. 여기서 자원은 `try` 가 끝나면 반드시 종료해서 반납해야 하는 외부 자원을 뜻한다.

이 기능을 사용하려면 먼저 `AutoCloseable` 인터페이스를 구현해야 한다.

``` java
public interface AutoCloseable {
    void close() throws Exception;
}
```

이 인터페이스를 구현하면 Try with resources를 사용할 때 `try` 가 끝나는 시점에 `close()` 가 자동으로 호출된다.

그리고 다음과 같이 Try with resources 구문을 사용하면 된다.

``` java
try (Resource resource = new Resource()) {
    // 리소스를 사용하는 코드
}
```

### 장점

- 리소스 누수 방지: 모든 리소스가 제대로 닫히도록 보장한다.실수로 `finally` 블록을 적지 않거나, `finally` 블럭 안에서 자원 해제 코드를 누락하는 문제들을 예방할 수 있다.
- 코드 간결성 및 가독성 향상: 명시적인 `close()` 호출이 필요 없어 코드가 더 간결하고 읽기 쉬워진다.
- 스코프 범위 한정: 예를 들어 리소스로 사용되는 변수의 스코프가 `try` 블럭 안으로 한정된다. 따라서 코드 유지보수가 더 쉬워진다.
- 조금 더 빠른 자원 해제: 기존에는 try -> catch -> finally로 catch 이후에 자원을 반납했다. 하지만 try-with-resources를 사용하면 try 이후에 바로 자원을 반납한다.

## 백엔드 개발자가 유의하는 체크 예외

백엔드 개발자가 유의해야 하는 체크 예외가 있다. 바로 `@Transactional`을 이용할 때이다. 생각해보자. 과연 트랜잭션 스코프 안에서 체크 예외가 발생했을 때, 자동으로 롤백이 될까? 우리가 알기론 체크 예외는 롤백하지 않고 언체크 예외는 롤백한다고 알고 있다. 하지만 이것은 잘못된 사실이다. 트랜잭션과 예외는 아무런 관련이 없다. 롤백할지 여부는 개발자 마음이다. 위의 이야기가 나오는 것은 스프링에서는 기본적으로는 런타임 예외 같은경우 바로 롤백을 한다. 하지만 이것은 스프링 기본 규칙이지 개발자가 직접 정할 수 있다. 그래서 `@Transactional`에는 `rollbackFor`라는 옵션도 주어진다. 여기다가 롤백 할 예외들을 정의해주면 되는 것이다. 자세한 내용은 [백기선님의 영상](https://youtu.be/_WkMhytqoCc?si=pB7UK99STD1hw8Kq)을 참고하자.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!