---
title: "[자바 고급2] HTTP 서버 활용"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-26 14:36:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## HTTP 서버7 - 애노테이션 서블릿1 - 시작

이제 애노테이션과 리플렉션을 이용하여 이전 HTTP 서버를 리팩토링 해보자.

먼저 애노테이션부터 정의해보자.

``` java
package was.httpserver.servlet.annotation;

import java.lang.annotation.*;

@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Mapping {
    String value();
}
```

그리고 해당 애노테이션을 처리하는 서블릿 코드를 작성해보자.

``` java
package was.httpserver.servlet.annotation;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.HttpServlet;
import was.httpserver.PageNotFoundException;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

public class AnnotationServletV1 implements HttpServlet {

    private final List<Object> controllers;

    public AnnotationServletV1(List<Object> controllers) {
        this.controllers = controllers;
    }

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        String path = request.getPath();

        for (Object controller : controllers) {
            Method[] methods = controller.getClass().getDeclaredMethods();

            for (Method method : methods) {
                if (method.isAnnotationPresent(Mapping.class)) {
                    Mapping mapping = method.getAnnotation(Mapping.class);
                    String value = mapping.value();

                    if (value.equals(path)) {
                        invoke(controller, method, request, response);
                        return;
                    }
                }
            }
        }

        throw new PageNotFoundException("request = " + path);
    }

    private static void invoke(Object controller, Method method, HttpRequest request, HttpResponse response) {
        try {
            method.invoke(controller, request, response);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
```

리플렉션에서 사용한 코드와 비슷하다. 차이가 있다면 호출할 메서드를 찾을 때, 메서드의 이름을 비교하는 대신에, 메서드에서 `@Mapping` 애노테이션을 찾고, 그곳의 `value` 값으로 비교한다는 점이다.

이제 컨트롤러들에 `@Mapping` 애노테이션을 붙여보자.

``` java
package was.v7;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.servlet.annotation.Mapping;

public class SiteControllerV7 {

    @Mapping("/")
    public void home(HttpRequest request, HttpResponse response) {
        response.writeBody("<h1>home</h1>");
        response.writeBody("<ul>");
        response.writeBody("<li><a href='/site1'>site1</a></li>");
        response.writeBody("<li><a href='/site2'>site2</a></li>");
        response.writeBody("<li><a href='/search?q=hello'>검색</a></li>");
        response.writeBody("</ul>");
    }

    @Mapping("/site1")
    public void site1(HttpRequest request, HttpResponse response) {
        response.writeBody("<h1>site1</h1>");
    }

    @Mapping("/site2")
    public void site2(HttpRequest request, HttpResponse response) {
        response.writeBody("<h1>site2</h1>");
    }
}
```

``` java
package was.v7;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.servlet.annotation.Mapping;

public class SearchControllerV7 {

    @Mapping("/search")
    public void search(HttpRequest request, HttpResponse response) {
        String query = request.getParameter("q");

        response.writeBody("<h1>Search</h1>");
        response.writeBody("<ul>");
        response.writeBody("<li>query: " + query + "</li>");
        response.writeBody("</ul>");
    }
}
```

애노테이션 서블릿 덕분에 이제 메서드 명으로 URL 매핑이 되는게 아니라 애노테이션에 정의한 `value` 값으로 URL을 매핑한다.

서버코드는 기존과 동일하니 생략하겠다.

애노테이션을 사용한 덕분에 매우 편리하고, 또 실용적으로 웹 애플리케이션을 만들 수 있게 되었다. 현대의 웹 프레임워크들은 대부분 애노테이션을 사용해서 편리하게 호출 메서드를 찾을 수 있는 지금과 같은 방식을 제공한다. 자바 백엔드의 사실상 표준 기술인 스프링 프레임워크도 스프링 MVC를 통해 이런 방식의 기능을 제공한다.

## HTTP 서버8 - 애노테이션 서블릿2 - 동적 바인딩

우리가 작성한 HTTP 서버에 조금 문제점이 있다. 바로 컨트롤러 코드의 메서드에서 필요하지 않는 파라미터도 무조건 넣어야 한다는 것이다. 이 점이 매우 불편해보인다. 이것을 한번 해결해보자.

``` java
package was.httpserver.servlet.annotation;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.HttpServlet;
import was.httpserver.PageNotFoundException;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

public class AnnotationServletV2 implements HttpServlet {

    private final List<Object> controllers;

    public AnnotationServletV2(List<Object> controllers) {
        this.controllers = controllers;
    }

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        String path = request.getPath();

        for (Object controller : controllers) {
            Method[] methods = controller.getClass().getDeclaredMethods();

            for (Method method : methods) {
                if (method.isAnnotationPresent(Mapping.class)) {
                    Mapping mapping = method.getAnnotation(Mapping.class);
                    String value = mapping.value();

                    if (value.equals(path)) {
                        invoke(controller, method, request, response);
                        return;
                    }
                }
            }
        }

        throw new PageNotFoundException("request = " + path);
    }

    private static void invoke(Object controller, Method method, HttpRequest request, HttpResponse response) {
        Class<?>[] parameterTypes = method.getParameterTypes();
        Object[] args = new Object[parameterTypes.length];

        for (int i = 0; i < parameterTypes.length; i++) {
            if (parameterTypes[i] == HttpRequest.class) {
                args[i] = request;
            } else if (parameterTypes[i] == HttpResponse.class) {
                args[i] = response;
            } else {
                throw new IllegalArgumentException("Unsupported parameter type: " + parameterTypes[i]);
            }
        }

        try {
            method.invoke(controller, args);
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }
}
```

위의 서블릿에서 이전과 변경점은 `invoke` 메서드에 메서드의 파라미터 타입을 확인한 후에 각 타입에 맞는 값을 `args[]` 에 담아서 메서드를 호출하게끔 변경하였다. 즉, 해당 서블릿에서 호출할 컨트롤러 메서드의 매개변수를 먼저 확인한 다음에 매개변수에 필요한 값을 동적으로 만들어서 전달했다. 덕분에 컨트롤러의 메서드는 자신에게 필요한 값만 선언하고, 전달 받을 수 있다. 이런 기능을 확장하면 `HttpRequest`, `HttpResponse` 뿐만 아니라 다양한 객체들도 전달할 수 있다.

> ✅ 참고
>
> 스프링 MVC도 이런 방식으로 다양한 매개변수의 값을 동적으로 전달한다.

## HTTP 서버9 - 애노테이션 서블릿3 - 성능 최적화

지금까지 만든 HTTP 서버의 문제점이 여전히 존재한다.

### 성능 최적화

``` java
@Override
public void service(HttpRequest request, HttpResponse response) throws IOException {
    String path = request.getPath();

    for (Object controller : controllers) {
        Method[] methods = controller.getClass().getDeclaredMethods();

        for (Method method : methods) {
            if (method.isAnnotationPresent(Mapping.class)) {
                Mapping mapping = method.getAnnotation(Mapping.class);
                String value = mapping.value();

                if (value.equals(path)) {
                    invoke(controller, method, request, response);
                    return;
                }
            }
        }
    }

    throw new PageNotFoundException("request = " + path);
}
```

- 모든 컨트롤러의 메서드를 하나하나 순서대로 찾는다. 이것은 결과적으로 O(n)의 성능을 보인다.
- 만약 메서드가 1억개 있다고 한다면 1억번은 찾아야 한다.
- 그런데 만약 1000명의 고객이 1억개의 메서드를 동시에 호출한다면 1000억번 로직이 호출된다.
- 이 부분의 성능을 O(n) -> O(1)로 변경하려면 어떻게 해야할까?

### 중복 매핑 문제

- 만약 매핑을 중복하면 어떻게 될까? 상식적으로는 어플리케이션이 실행되지 않고 예외를 터트리고 종료시켜야 한다.
- 지금 로직상 아마 먼저 찾아진 메서드가 호출이 될 것이다. 즉, 운에 맡기는 코드가 되는 것이다. 이런 점은 나중에 큰 장애를 불러 일으킬 수 있으므로 해결을 해야 한다.

그럼 이 문제를 한번 해결해보자.

``` java
package was.httpserver.servlet.annotation;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.HttpServlet;
import was.httpserver.PageNotFoundException;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnnotationServletV3 implements HttpServlet {

    private final Map<String, ControllerMethod> pathMap;

    public AnnotationServletV3(List<Object> controllers) {
        this.pathMap = new HashMap<>();
        initializePathMap(controllers);
    }

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        String path = request.getPath();
        ControllerMethod controllerMethod = pathMap.get(path);

        if (controllerMethod == null) {
            throw new PageNotFoundException("request = " + path);
        }

        controllerMethod.invoke(request, response);
    }

    private void initializePathMap(List<Object> controllers) {
        for (Object controller : controllers) {
            for (Method method : controller.getClass().getDeclaredMethods()) {
                if (method.isAnnotationPresent(Mapping.class)) {
                    String path = method.getAnnotation(Mapping.class).value();

                    if (pathMap.containsKey(path)) {
                        ControllerMethod controllerMethod = pathMap.get(path);
                        throw new IllegalStateException("경로 중복 등록, path = " + path + ", method = " + method +
                                ", 이미 등록된 메서드 = " + controllerMethod.method);
                    }

                    pathMap.put(path, new ControllerMethod(controller, method));
                }
            }
        }
    }

    private static class ControllerMethod {

        private final Object controller;

        private final Method method;

        public ControllerMethod(Object controller, Method method) {
            this.controller = controller;
            this.method = method;
        }

        public void invoke(HttpRequest request, HttpResponse response) {
            Class<?>[] parameterTypes = method.getParameterTypes();
            Object[] args = new Object[parameterTypes.length];

            for (int i = 0; i < parameterTypes.length; i++) {
                if (parameterTypes[i] == HttpRequest.class) {
                    args[i] = request;
                } else if (parameterTypes[i] == HttpResponse.class) {
                    args[i] = response;
                } else {
                    throw new IllegalArgumentException("Unsupported parameter type: " + parameterTypes[i]);
                }
            }

            try {
                method.invoke(controller, args);
            } catch (IllegalAccessException | InvocationTargetException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

- 서블릿을 생성하는 시점에 `@Mapping`을 사용하는 컨트롤러의 메서드를 모두 찾아서 `pathMap`에 보관한다.
- 초기화가 끝나면 `pathMap`이 완성된다.
- `ControllerMethod` : `@Mapping`의 대상 메서드와 메서드가 있는 컨트롤러 객체를 캡슐화했다. 이렇게 하면 `ControllerMethod` 객체를 사용해서 편리하게 실제 메서드를 호출할 수 있다.
- `ControllerMethod controllerMethod = pathMap.get(path)`를 사용해서 URL 경로에 매핑된 컨트롤러의 메서드를 찾아온다. 이 과정은 `HashMap`을 사용하므로 일반적으로 O(1)의 매우 빠른 성능을 제공한다.
- 또한, `pathMap`에 이미 등록된 경로가 있다면 중복경로이므로 예외를 터트리면 된다.

> 💡 꿀팁
>
> - **컴파일 오류**: 가장 좋은 오류이다. 프로그램 실행 전에 개발자가 가장 빠르게 문제를 확인할 수 있다.
> - **런타임 오류 - 시작 오류**: 자바 프로그램이나 서버를 시작하는 시점에 발견할 수 있는 오류이다. 문제를 아주 빠르게 발견할 수 있기 때문에 좋은 오류이다. 고객이 문제를 인지하기 전에 수정하고 해결할 수 있다.
> - **런타임 오류 - 작동 오류**: 고객이 특정 기능을 작동할 때 발생하는 오류이다. 원인 파악과 문제 해결에 가장 많은 시간이 걸리고 가장 큰 피해를 주는 오류이다.

## HTTP 서버 활용 - 회원 관리 서비스1

이제 이전의 콘솔로 만든 회원 관리 프로그램을 웹으로 변경해보자. 그럼 컨트롤러를 만들어보자.

``` java
package webservice;

import io.member.Member;
import io.member.MemberRepository;
import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.servlet.annotation.Mapping;

import java.util.List;

import static util.MyLogger.log;

public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Mapping("/")
    public void home(HttpResponse response) {
        String str = "<html><body>" +
                "<h1>Member Manager</h1>" +
                "<ul>" +
                "<li><a href='/members'>Member List</a></li>" +
                "<li><a href='/add-member-form'>Add New Member</a></li>" +
                "</ul>" +
                "</body></html>";

        response.writeBody(str);
    }

    @Mapping("/members")
    public void members(HttpResponse response) {
        List<Member> members = memberRepository.findAll();

        StringBuilder page = new StringBuilder();
        page.append("<html><body>");
        page.append("<h1>Member List</h1>");
        page.append("<ul>");

        for (Member member : members) {
            page.append("<li>")
                    .append("ID: ").append(member.getId())
                    .append(", Name: ").append(member.getName())
                    .append(", Age: ").append(member.getAge())
                    .append("</li>");
        }

        page.append("</ul>");
        page.append("<a href='/'>Back to Home</a>");
        page.append("</body></html>");

        response.writeBody(page.toString());
    }

    @Mapping("/add-member-form")
    public void addMemberForm(HttpResponse response) {
        String body = "<html><body>" +
                "<h1>Add New Member</h1>" +
                "<form method='POST' action='/add-member'>" +
                "ID: <input type='text' name='id' /> <br />" +
                "Name: <input type='text' name='name' /> <br />" +
                "Age: <input type='text' name='age' /> <br />" +
                "<input type='submit' value='Add' />" +
                "</form>" +
                "<a href='/'>Back to Home</a>" +
                "</body></html>";

        response.writeBody(body);
    }

    @Mapping("/add-member")
    public void addMember(HttpRequest request, HttpResponse response) {
        log("MemberController.addMember");
        log("request = " + request);

        String id = request.getParameter("id");
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));

        Member member = new Member(id, name, age);
        memberRepository.add(member);

        response.writeBody("<h1>save ok</h1>");
        response.writeBody("<a href='/'>Back to Home</a>");
    }
}
```

기존에 만들었던 클래스를 이용하여 컨트롤러를 만들었다. 대부분 다 아는 내용이지만 조금 특별한 부분만 살펴보도록 하겠다. 혹시 이 코드를 보고 이해가 안된다면 해당 강의나 이전 포스팅을 다시 한번 살펴보자.

조금 특이한 부분은 회원을 추가하는 폼 부분과 추가 로직 부분이다.

### addMemberForm()

회원을 저장하기 위해서는 회원을 등록하는 화면이 필요하다. HTML에서는 이것을 폼(form)이라 한다. 그리고 이런 폼을 처리하기 위한 특별한 HTML 태그들을 지원한다.

``` html
<html>
    <body>
        <h1>Add New Member</h1>
        <form method='POST' action='/add-member'>
            ID: <input type='text' name='id'><br>
            Name: <input type='text' name='name'><br>
            Age: <input type='text' name='age'><br>
        <input type='submit' value='Add'>
        </form>
        <a href='/'>Back to Home</a>
    </body>
</html>
```

- `<form>` 클라이언트에서 서버로 전송할 데이터를 입력하는 기능을 제공한다.
    - `method=POST` : HTTP 메시지를 전송할 때 POST 방식으로 전송한다. 참고로 `POST` 는 메시지 바디에 필요한 데이터를 추가해서 서버에 전달할 수 있다.
    - `action='/add-member'` : HTTP 메시지를 전송할 URL 경로이다.
- `<input type='text'>` 클라이언트에서 서버로 전송할 각각의 항목이다. `name`이 키로 사용된다.
- `<input type='submit'>` 폼에 입력한 내용을 서버에 전송할 때 사용하는 전송 버튼이다.

그리고 사용자가 해당 폼을 작성하고 `add` 버튼을 누르면 `POST` 방식으로 `/add-member`로 데이터를 전달한다. 즉 요청 메세지는 아래처럼 나올 것이다.

``` http
POST /add-member HTTP/1.1
Host: localhost:12345
Content-Length: 24
Content-Type: application/x-www-form-urlencoded

id=sungbin1&name=sungbin&age=30
```

- `Content-Length` : 메시지 바디가 있는 경우 메시지 바디의 크기를 표현한다.
- `Content-Type` : 메시지 바디가 있는 경우 메시지 바디의 형태를 표현한다.
    - `application/x-www-form-urlencoded` 은 HTML의 폼을 사용해서 전송한 경우이다.
    - 이것은 형식으로 `input type`에서 입력한 내용을 `key=value` 형식으로 메시지 바디에 담아서 전송한다.
    - URL에서 `?` 이후의 부분에 `key1=value1&key2=value2` 포멧으로 서버에 전송하는 것과 거의 같은 포멧으로 전송한다.

그리고 `addMember()` 메서드에 메세지 바디로 오는 내용을 가져와서 저장을 하는 것이다. 하지만 우리가 만든 `HttpRequest`에 메세지 바디를 파싱하는 부분이 존재하지 않는다. 그 부분을 만들어 보자.

## HTTP 서버 활용 - 회원 관리 서비스2

### HttpRequest - 메시지 바디 파싱

``` java
package was.httpserver;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static util.MyLogger.log;

public class HttpRequest {

    private String method;

    private String path;

    private final Map<String, String> queryParameters = new HashMap<>();

    private final Map<String, String> headers = new HashMap<>();

    public HttpRequest(BufferedReader reader) throws IOException {
        parseRequestLine(reader);
        parseHeaders(reader);
        parseBody(reader);
    }

    public String getMethod() {
        return method;
    }

    public String getPath() {
        return path;
    }

    public String getParameter(String name) {
        return queryParameters.get(name);
    }

    public String getHeader(String name) {
        return headers.get(name);
    }

    @Override
    public String toString() {
        return "HttpRequest{" +
                "method='" + method + '\'' +
                ", path='" + path + '\'' +
                ", queryParameters=" + queryParameters +
                ", headers=" + headers +
                '}';
    }

    private void parseRequestLine(BufferedReader reader) throws IOException {
        String requestLine = reader.readLine();

        if (requestLine == null) {
            throw new IOException("EOF: No request line received");
        }

        String[] parts = requestLine.split(" ");

        if (parts.length != 3) {
            throw new IOException("Invalid request line: " + requestLine);
        }

        method = parts[0];
        String[] pathParts = parts[1].split("\\?");
        path = pathParts[0];

        if (pathParts.length > 1) {
            parseQueryParameters(pathParts[1]);
        }
    }

    private void parseQueryParameters(String queryString) {
        for (String param : queryString.split("&")) {
            String[] keyValue = param.split("=");
            String key = URLDecoder.decode(keyValue[0], UTF_8);
            String value = keyValue.length > 1 ? URLDecoder.decode(keyValue[1], UTF_8) : "";

            queryParameters.put(key, value);
        }
    }

    private void parseHeaders(BufferedReader reader) throws IOException {
        String line;

        while (!(line = reader.readLine()).isEmpty()) {
            String[] headerParts = line.split(":");
            headers.put(headerParts[0].trim(), headerParts[1].trim());
        }
    }

    private void parseBody(BufferedReader reader) throws IOException {
        if (!headers.containsKey("Content-Length")) {
            return;
        }

        int contentLength = Integer.parseInt(headers.get("Content-Length"));
        char[] bodyChars = new char[contentLength];
        int read = reader.read(bodyChars);

        if (read != contentLength) {
            throw new IOException("Failed to read entire body. Expected " + contentLength + " bytes, but read " + read);
        }

        String body = new String(bodyChars);
        log("HTTP Message Body: " + body);

        String contentType = headers.get("Content-Type");

        if ("application/x-www-form-urlencoded".equals(contentType)) {
            parseQueryParameters(body);
        }
    }
}
```

- `Content-Length`가 있는 경우 메시지 바디가 있다고 가정하겠다.
- `Content-Length`의 길이 만큼 스트림에서 메시지 바디의 데이터를 읽어온다.
    - 만약 읽어온 길이가 다르다면 문제가 있다고 보고 예외를 던진다.
- 다음으로 `Content-Type` 을 체크한다. 만약 HTML 폼 전송인 `application/x-www-form-urlencoded` 타입이라면 URL의 쿼리 스트링과 같은 방식으로 파싱을 시도한다.
- 그리고 파싱 결과를 URL의 쿼리 스트링과 같은 `queryParameters`에 보관한다.
- 이렇게 하면 URL의 쿼리 스트링이든, HTML 폼 전송이든 `getParameter()`를 사용해서 같은 방식으로 데이터를 편리하게 조회할 수 있다.

즉, 쿼리 스트링이든, 바디든 형식이 똑같으니 쿼리스트링 방식으로 가져오는 것이다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!