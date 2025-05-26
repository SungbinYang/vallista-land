---
title: "[자바 고급2] 리플렉션"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-26 10:33:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## 리플렉션이 필요한 이유

우리가 만든 HTTP 서버에는 몇 가지 단점이 존재한다.

- 하나의 클래스에 하나의 기능만 만들 수 있다.
- 새로 만든 클래스를 URL 경로와 항상 매핑해야 한다.

하나의 클래스에 하나의 기능만 담는다면 클래스가 너무 많아지고 새로운 URL을 만들때마다 새로운 클래스를 만들어지니 나중에는 엄청나게 복잡해질 수 있을 것이다. 만약 하나의 클래스에 비슷한 기능들을 묶어둔다면 해당 문제를 쉽게 해결할 수 있을듯 보인다. 두번째는 새로 만든 클래스를 항상 URL에 매핑해야 하니 매번 새로운 URL을 만들때마다 건들여야 할 코드가 많아진다. 만약 URL과 같은 명을 가진 메서드 이름으로 매핑하는 것을 자동으로 한다면 매우 편리할 것이다. 이렇게 해결하려면 우리는 자바의 리플렉션에 대해 학습이 필요하다. 리플렉션을 먼저 학습하고 후에 HTTP 서버를 리팩토링 해보자.

## 클래스와 메타데이터

클래스가 제공하는 다양한 정보를 동적으로 분석하고 사용하는 기능을 **리플렉션(Reflection)**이라 한다. 리플렉션을 통해 프로그램 실행 중에 클래스, 메서드, 필드 등에 대한 정보를 얻거나, 새로운 객체를 생성하고 메서드를 호출하며, 필드의 값을 읽고 쓸 수 있다.

- **클래스의 메타데이터**: 클래스 이름, 접근 제어자, 부모 클래스, 구현된 인터페이스 등.
- **필드 정보**: 필드의 이름, 타입, 접근 제어자를 확인하고, 해당 필드의 값을 읽거나 수정할 수 있다.
- **메서드 정보**: 메서드 이름, 반환 타입, 매개변수 정보를 확인하고, 실행 중에 동적으로 메서드를 호출할 수 있다.
- **생성자 정보**: 생성자의 매개변수 타입과 개수를 확인하고, 동적으로 객체를 생성할 수 있다.

그러면 예제코드를 통하여 리플렉션에 대해 살펴보자. 먼저 클래스 정보를 확인 할 클래스를 만들어보자.

``` java
package reflection.data;

public class BasicData {

    public String publicField;

    private int privateField;

    public BasicData() {
        System.out.println("BasicData.BasicData");
    }

    private BasicData(String data) {
        System.out.println("BasicData.BasicData: " + data);
    }

    public void call() {
        System.out.println("BasicData.call");
    }

    public String hello(String str) {
        System.out.println("BasicData.hello");

        return str + " hello";
    }

    private void privateMethod() {
        System.out.println("BasicData.privateMethod");
    }

    void defaultMethod() {
        System.out.println("BasicData.defaultMethod");
    }

    protected void protectedMethod() {
        System.out.println("BasicData.protectedMethod");
    }
}
```

다양한 생성자와 접근 제어자로 필드와 메서드를 정의해두었다. 이제 사용하는 쪽의 코드를 살펴보자.

### 클래스 메타데이터 조회

``` java
package reflection;

import reflection.data.BasicData;

public class BasicV1 {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<BasicData> basicDataClass1 = BasicData.class;
        System.out.println("basicDataClass1 = " + basicDataClass1);

        BasicData basicInstance = new BasicData();
        Class<? extends BasicData> basicDataClass2 = basicInstance.getClass();
        System.out.println("basicDataClass2 = " + basicDataClass2);

        String className = "reflection.data.BasicData";
        Class<?> basicDataclass3 = Class.forName(className);
        System.out.println("basicDataclass3 = " + basicDataclass3);
    }
}
```

클래스의 메타 정보를 얻는 방법은 총 3가지이다.

#### 클래스에서 찾기

``` java
Class<BasicData> basicDataClass1 = BasicData.class;
```

클래스명의 `.class`를 통하여 클래스 메타 정보를 획득할 수 있다.

#### 인스턴스에서 찾기

``` java
BasicData basicInstance = new BasicData();
Class<? extends BasicData> basicDataClass2 = basicInstance.getClass();
```

인스턴스를 생성 후 `getClass()`를 통하여 메타 정보를 얻을 수 있다. 이때 반환 타입은 해당 인스턴스의 타입이거나 그 자식 타입이다. 왜냐하면 자바의 다형성 원칙때문이다. 타입은 부모 타입으로 하고 생성자를 자식으로 할 수 있기에 제네릭 타입에 타입 상한을 걸어준 것이다.

#### 문자로 찾기

``` java
String className = "reflection.data.BasicData";
Class<?> basicDataclass3 = Class.forName(className);
```

총 패키지 명을 적어주면 해당 패키지명의 클래스 정보를 반환해준다. 하지만 문자열을 잘못 입력 할 우려가 있기에 `ClassNotFoundException`이 발생할 수 있다. 이것을 뭔가 잘만 이용하면 사용자 입력을 받아 클래스 정보를 동적으로 얻을수도 있을 듯 보인다.

### 기본 정보 탐색

그러면 이렇게 얻은 클래스 메타데이터로 여러가지를 한번 구해보는 실습을 해보자.

``` java
package reflection;

import reflection.data.BasicData;

import java.lang.reflect.Modifier;
import java.util.Arrays;

public class BasicV2 {
    public static void main(String[] args) {
        Class<BasicData> basicData = BasicData.class;

        System.out.println("basicData.getName() = " + basicData.getName());
        System.out.println("basicData.getSimpleName() = " + basicData.getSimpleName());
        System.out.println("basicData.getPackage() = " + basicData.getPackage());

        System.out.println("basicData.getSuperclass() = " + basicData.getSuperclass());
        System.out.println("basicData.getInterfaces() = " + Arrays.toString(basicData.getInterfaces()));

        System.out.println("basicData.isInterface() = " + basicData.isInterface());
        System.out.println("basicData.isEnum() = " + basicData.isEnum());
        System.out.println("basicData.isAnnotation() = " + basicData.isAnnotation());

        int modifiers = basicData.getModifiers();
        System.out.println("basicData.getModifiers() = " + modifiers);
        System.out.println("isPublic = " + Modifier.isPublic(modifiers));
        System.out.println("Modifier.toString() = " + Modifier.toString(modifiers));
    }
}
```

위의 코드를 보면 알겠지만 `Class` 클래스로 클래스 이름, 패키지, 부모 클래스, 구현한 인터페이스, 수정자 정보등 다양한 정보를 획득할 수 있다.

> ✅ 참고
>
> 수정자는 접근 제어자와 비 접근 제어자(기타 수정자)로 나눌 수 있다.
> - 접근 제어자: `public`,`protected`,`default`(`package-private`),`private`
> - 비 접근 제어자: `static`,`final`,`abstract`,`synchronized`,`volatile`등

## 메서드 탐색과 동적 호출

클래스 메타데이터를 통해 클래스가 제공하는 메서드의 정보를 확인해보자.

``` java
package reflection;

import reflection.data.BasicData;

import java.lang.reflect.Method;

public class MethodV1 {
    public static void main(String[] args) {
        Class<BasicData> helloClass = BasicData.class;

        System.out.println("====== methods() ======");
        Method[] methods = helloClass.getMethods();
        for (Method method : methods) {
            System.out.println("method = " + method);
        }

        System.out.println("====== declaredMethods() ======");
        Method[] declaredMethods = helloClass.getDeclaredMethods();
        for (Method method : declaredMethods) {
            System.out.println("declaredMethod = " + method);
        }
    }
}
```

### getMethods() vs getDeclaredMethods()

- `getMethods()` : 해당 클래스와 상위 클래스에서 상속된 모든 public 메서드를 반환
- `getDeclaredMethods()` : 해당 클래스에서 선언된 모든 메서드를 반환하며, 접근 제어자에 관계없이 반환. 상속된 메서드는 포함하지 않음

그러명 동적 호출 과정을 살펴보자.

``` java
package reflection;

import reflection.data.BasicData;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class MethodV2 {
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        BasicData helloInstance = new BasicData();
        helloInstance.call();

        Class<? extends BasicData> helloClass = helloInstance.getClass();
        String methodName = "hello";

        Method method1 = helloClass.getDeclaredMethod(methodName, String.class);
        Object returnValue = method1.invoke(helloInstance, "hi");
        System.out.println("returnValue = " + returnValue);
    }
}
```

위의 코드를 살펴보면 `helloInstance.call();`은 정적으로 호출한 방식이다. 즉, 메서드 호출을 코드에 기입함으로 런타임에 다르게 변경할 수 없는 우리가 일반적으로 사용하는 방식이다. 그럼 동적으로 호출은 어떻게 할까? 바로 리플렉션을 이용하는 방식이다.

``` java
Method method1 = helloClass.getMethod(methodName, String.class)
```

클래스 메타데이터가 제공하는 `getMethod()`에 메서드 이름, 사용하는 매개변수의 타입을 전달하면 원하는 메서드를 찾을 수 있다. 만약 매개변수가 없다면 2번째 인자는 생략 가능하다.

``` java
Object returnValue = method1.invoke(helloInstance, "hi");
```

`Method.invoke()` 메서드에 실행할 인스턴스와 인자를 전달하면, 해당 인스턴스에 있는 메서드를 실행할 수 있다.

## 필드 탐색과 값 변경

리플렉션을 활용해서 필드를 탐색하고 또 필드의 값을 변경하도록 활용해보자.

``` java
package reflection;

import reflection.data.BasicData;

import java.lang.reflect.Field;

public class FieldV1 {
    public static void main(String[] args) {
        Class<BasicData> helloClass = BasicData.class;

        System.out.println("====== fields() ======");
        Field[] fields = helloClass.getFields();
        for (Field field : fields) {
            System.out.println("field = " + field);
        }

        System.out.println("====== declaredFields() ======");
        Field[] declaredFields = helloClass.getDeclaredFields();
        for (Field field : declaredFields) {
            System.out.println("declaredField = " + field);
        }
    }
}
```

### fields() vs declaredFields()

- `fields()` : 해당 클래스와 상위 클래스에서 상속된 **모든 public 필드를 반환**
- `declaredFields()` : **해당 클래스에서 선언된 모든 필드를 반환**하며, 접근 제어자에 관계없이 반환. 상속된 필드는 포함하지 않음

### 필드 값 변경

``` java
package reflection.data;

public class User {

    private String id;

    private String name;

    private Integer age;

    public User() {
    }

    public User(String id, String name, Integer age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

위와 같은 회원 객체가 있다고 하자.

``` java
package reflection;

import reflection.data.User;

import java.lang.reflect.Field;

public class FieldV2 {
    public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
        User user = new User("id1", "userA", 20);
        System.out.println("기존 이름 = " + user.getName());

        Class<? extends User> aClass = user.getClass();
        Field nameField = aClass.getDeclaredField("name");

        nameField.setAccessible(true);
        nameField.set(user, "userB");
        System.out.println("변경된 이름 = " + user.getName());
    }
}
```

위와 같이 변수의 값을 변경이 가능하다. 심지어 `private` 접근제어자도 변경이 가능한 것이다.

``` java
Field nameField = aClass.getDeclaredField("name");
```

위의 코드처럼 `getDeclaredField()`를 통하여 필드를 조회할 수 있다.

``` java
nameField.setAccessible(true);
nameField.set(user, "userB");
```

위의 코드처럼 변수의 값을 조작이 가능하다. 단, `private`과 같은 접근 제어자일 경우 `setAccessible(true);`로 접근 허가 후 사용을 해야 한다. 그렇지 않을 경우 `IllegalAccessException`이 발생한다.

> ⚠️ 주의
>
> 리플렉션을 활용하면 `private` 접근 제어자에도 직접 접근해서 값을 변경할 수 있다. 하지만 이는 객체 지향 프로그래밍의 원칙을 위반하는 행위로 간주될 수 있다. `private` 접근 제어자는 클래스 내부에서만 데이터를 보호하고, 외부에서의 직접적인 접근을 방지하기 위해 사용된다. 리플렉션을 통해 이러한 접근 제한을 무시하는 것은 캡슐화 및 유지보수성에 악영향을 미칠 수 있다. 예를 들어, 클래스의 내부 구조나 구현 세부 사항이 변경될 경우 리플렉션을 사용한 코드는 쉽게 깨질 수 있으며, 이는 예상치 못한 버그를 초래할 수 있다. 따라서 리플렉션을 사용할 때는 반드시 신중하게 접근해야 하며, 가능한 경우 접근 메서드(예: getter, setter)를 사용하는 것이 바람직하다. 리플렉션은 주로 테스트나 라이브러리 개발 같은 특별한 상황에서 유용하게 사용되지만, 일반적인 애플리케이션 코드에서는 권장되지 않는다. 이를 무분별하게 사용하면 코드의 가독성과 안전성을 크게 저하시킬 수 있다.

## 리플렉션 - 활용 예제

리플렉션은 일반적인 비즈니스 로직을 작성할 때는 절대 사용해서는 안된다. 왜냐하면 객체지향 원칙이 깨지게 되고 나중에 유지보수를 할 때 예기치 못한 버그 또한 발생할 수 있기 때문이다. 그러면 언제 리플렉션을 사용하면 좋을까?

만약 프로젝트 요구사항에 `null`값은 허용하지 않는다고 해보자. 그럴때 리플렉션을 사용하지 않고 어떻게 해결하는지, 리플렉션을 사용하면 어떤 편의성을 얻을 수 있는지 살펴보자.

``` java
package reflection.data;

public class Team {

    private String id;

    private String name;

    public Team() {
    }

    public Team(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Team{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}
```

위와 같이 `User`에 이어서 `Team` 객체도 만들었다. 이제 한번 사용하는 `main`메서드를 살펴보자.

``` java
package reflection;

import reflection.data.Team;
import reflection.data.User;

public class FieldV3 {
    public static void main(String[] args) {
        User user = new User("id1", null, null);
        Team team = new Team("team1", null);

        System.out.println("===== before =====");
        System.out.println("user = " + user);
        System.out.println("team = " + team);

        if (user.getId() == null) {
            user.setId("");
        }

        if (user.getName() == null) {
            user.setName("");
        }

        if (user.getAge() == null) {
            user.setAge(0);
        }

        if (team.getId() == null) {
            team.setId("");
        }

        if (team.getName() == null) {
            team.setName("");
        }

        System.out.println("===== after =====");
        System.out.println("user = " + user);
        System.out.println("team = " + team);
    }
}
```

리플렉션 없이 `null`값을 방지하려면 위와 같이 각 객체의 필드마다 `null` 여부를 확인해서 기본 값으로 변경해줘야 한다. 하지만 이 부분은 클래스가 늘고 필드가 늘 수록 코드가 점점 늘어나서 유지보수성이 떨어진다. 이런 부분은 리플렉션을 이용하면 쉽게 고칠 수 있다.

``` java
package reflection;

import java.lang.reflect.Field;

public class FieldUtil {

    public static void nullFieldToDefault(Object target) throws IllegalAccessException {
        Class<?> aClass = target.getClass();
        Field[] declaredFields = aClass.getDeclaredFields();

        for (Field field : declaredFields) {
            field.setAccessible(true);

            if (field.get(target) != null) {
                continue;
            }

            if (field.getType() == String.class) {
                field.set(target, "");
            } else if (field.getType() == Integer.class) {
                field.set(target, 0);
            }
        }
    }
}
```

위의 코드는 필드에 `null` 값일 경우 기본 값으로 변경해주는 코드이다. 리플렉션을 이용해 필드 값을 조회 후, `null`일 경우 타입을 체크하여 기본값으로 변경해주는 코드이다. 이제 이 유틸성 클래스를 이용해서 아래와 같이 쉽게 변경이 가능하다.

``` java
package reflection;

import reflection.data.Team;
import reflection.data.User;

public class FieldV4 {
    public static void main(String[] args) throws IllegalAccessException {
        User user = new User("id1", null, null);
        Team team = new Team("team1", null);

        System.out.println("===== before =====");
        System.out.println("user = " + user);
        System.out.println("team = " + team);

        FieldUtil.nullFieldToDefault(user);
        FieldUtil.nullFieldToDefault(team);

        System.out.println("===== after =====");
        System.out.println("user = " + user);
        System.out.println("team = " + team);
    }
}
```

이처럼 리플렉션을 활용하면 기존 코드로 해결하기 어려운 공통 문제를 손쉽게 처리할 수도 있다.

## 생성자 탐색과 객체 생성

리플렉션을 활용하면 생성자를 탐색하고, 또 탐색한 생성자를 사용해서 객체를 생성할 수 있다.

``` java
package reflection;

import java.lang.reflect.Constructor;

public class ConstructV1 {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> aClass = Class.forName("reflection.data.BasicData");

        System.out.println("======= constructors() =======");
        Constructor<?>[] constructors = aClass.getConstructors();
        for (Constructor<?> constructor : constructors) {
            System.out.println(constructor);
        }

        System.out.println("======= declaredConstructors() =======");
        Constructor<?>[] declaredConstructors = aClass.getDeclaredConstructors();
        for (Constructor<?> constructor : declaredConstructors) {
            System.out.println(constructor);
        }
    }
}
```

이제 이런 생성자를 이용하여 동적으로 객체 생성 및 메서드 호출 예제를 보자.

``` java
package reflection;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class ConstructV2 {
    public static void main(String[] args) throws Exception {
        Class<?> aClass = Class.forName("reflection.data.BasicData");

        Constructor<?> constructor = aClass.getDeclaredConstructor(String.class);
        constructor.setAccessible(true);

        Object instance = constructor.newInstance("hello");
        System.out.println("instance = " + instance);

        Method method1 = aClass.getDeclaredMethod("call");
        method1.invoke(instance);
    }
}
```

``` java
Object instance = constructor.newInstance("hello");
```

동적으로 찾은 생성자를 사용해서 객체를 생성한다. 여기서는 "hello"라는 인자를 넘겨준다. 그래서 `private` 생성자도 호출이 되는 것이다. 즉, 클래스를 찾고 생성하는 방법도, 그리고 생성한 클래스의 메서드를 호출하는 방법도 모두 동적으로 처리한 것이다.

> ✅ 참고
>
> 여러분이 스프링 프레임워크나 다른 프레임워크 기술들을 사용해보면, 내가 만든 클래스를 프레임워크가 대신 생성해 줄 때가 있다. 그때가 되면 방금 학습한 리플렉션과 동적 객체 생성 방법들이 떠오르면 된다.

## HTTP 서버6 - 리플렉션 서블릿

그러면 이제 리플렉션을 이용하여 기존에 작성한 HTTP 서버의 문제점을 해결해보자.

서두에서 말했던 것처럼 URL마다 클래스를 만들지 말고 ~Controller를 만들어서 여기에 메서드로 기존 클래스를 넣어두는 식으로 만들어보자.

> ✅ 참고
>
> 컨트롤러는 애플리케이션의 제어 흐름을 '제어(control)'한다. 요청을 받아 적절한 비즈니스 로직을 호출하고, 그 결과를 뷰에 전달하는 등의 작업을 수행한다.

### 리플렉션 서블릿 구현

``` java
package was.v6;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;

public class SiteControllerV6 {

    public void site1(HttpRequest request, HttpResponse response) {
        response.writeBody("<h1>site1</h1>");
    }

    public void site2(HttpRequest request, HttpResponse response) {
        response.writeBody("<h1>site2</h1>");
    }
}
```

``` java
package was.v6;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;

public class SearchControllerV6 {

    public void search(HttpRequest request, HttpResponse response) {
        String query = request.getParameter("q");

        response.writeBody("<h1>Search</h1>");
        response.writeBody("<ul>");
        response.writeBody("<li>query: " + query + "</li>");
        response.writeBody("</ul>");
    }
}
```

위의 코드처럼 site를 다루는 컨트롤러와 검색기능을 가진 컨트롤러를 만들어두었다. 이제 해당 클래스들의 메서드를 어떤식으로 호출할까? 바로 리플렉션 서블릿을 이용하여 동적 호출을 진행해보려고 한다.

``` java
package was.httpserver.servlet.reflection;

import was.httpserver.HttpRequest;
import was.httpserver.HttpResponse;
import was.httpserver.HttpServlet;
import was.httpserver.PageNotFoundException;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

public class ReflectionServlet implements HttpServlet {

    private final List<Object> controllers;

    public ReflectionServlet(List<Object> controllers) {
        this.controllers = controllers;
    }

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        String path = request.getPath();

        for (Object controller : controllers) {
            Class<?> aClass = controller.getClass();
            Method[] methods = aClass.getDeclaredMethods();

            for (Method method : methods) {
                String methodName = method.getName();

                if (path.equals("/" + methodName)) {
                    invoke(controller, method, request, response);
                    return;
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

`List<Object> controllers`라는 변수를 두어 생성자를 통해 여러 컨트롤러들을 보관할 수 있게 만들었다. 그리고 들어온 컨트롤러를 순회하여 메서드를 나열 후, 호출하는 식으로 로직을 작성하였다. 그럼 이제 사용하는 코드(서버)를 작성해보자.

``` java
package was.v6;

import was.httpserver.HttpServer;
import was.httpserver.HttpServlet;
import was.httpserver.ServletManager;
import was.httpserver.servlet.DiscardServlet;
import was.httpserver.servlet.reflection.ReflectionServlet;
import was.v5.servlet.HomeServlet;
import was.v5.servlet.SearchServlet;
import was.v5.servlet.Site1Servlet;
import was.v5.servlet.Site2Servlet;

import java.io.IOException;
import java.util.List;

public class ServerMainV6 {

    private static final int PORT = 12345;

    public static void main(String[] args) throws IOException {
        List<Object> controllers = List.of(new SiteControllerV6(), new SearchControllerV6());
        HttpServlet reflectionServlet = new ReflectionServlet(controllers);

        ServletManager servletManager = new ServletManager();
        servletManager.setDefaultServlet(reflectionServlet);
        servletManager.add("/", new HomeServlet());
        servletManager.add("/favicon.ico", new DiscardServlet());

        HttpServer server = new HttpServer(PORT, servletManager);

        server.start();
    }
}
```

#### new ReflectionServlet(controllers)

- 리플렉션 서블릿을 생성하고, 사용할 컨트롤러들을 인자로 전달한다.

#### servletManager.setDefaultServlet(reflectionServlet)

- 리플랙션 서블릿을 기본 서블릿으로 등록하는 것이다. 이렇게 되면 다른 서블릿에서 경로를 찾지 못할 때 우리가 만든 리플렉션 서블릿이 항상 호출된다!
- 그리고 다른 서블릿은 등록하지 않는다. 따라서 항상 리플렉션 서블릿이 호출된다.
- 그런데 아쉽게도 `HomeServlet`은 등록해야 한다. 왜냐하면 `/`라는 이름은 메서드 이름으로 매핑할 수 없기 때문이다.
- `/favicon.ico`도 마찬가지로 메서드 이름으로 매핑할 수 없다. 왜냐하면 `favicon.ico`라는 이름으로 메서드를 만들 수 없기 때문이다.

#### 작동 순서

- 웹 브라우저가 `/site1`을 요청한다.
- 서블릿 매니저는 등록된 서블릿 중에 `/site1`을 찾는다.
- 등록된 서블릿 중에 `/site1`을 찾을 수 없다.
- 기본 서블릿(default Servlet)으로 등록한 `ReflectionServlet`을 호출한다.
- `ReflectionServlet`은 컨트롤러를 순회하면서 `site1()`이라는 이름의 메서드를 찾아서 호출한다.
  - 등록한 `SiteControllerV6`,`SearchControllerV6`을 순회한다.
  - 이때 `HttpRequest`,`HttpResponse`도 함께 전달한다.
- `site1()` 메서드가 실행된다.

이렇게 하여 리플렉션을 이용하여 동적 매핑을 진행하게 되었다. 하지만 여전히 문제점이 존재한다.

- 리플렉션 서블릿은 요청 URL과 메서드 이름이 같다면 해당 메서드를 동적으로 호출할 수 있다. 하지만 요청 이름과 메서드 이름을 다르게 하고 싶다면 어떻게 해야할까?
- 앞서 `/`,`/favicon.ico`와 같이 자바 메서드 이름으로 처리하기 어려운 URL은 어떻게 해결할 수 있을까?
- URL은 주로 `-`(dash)를 구분자로 사용한다. `/add-member`와 같은 URL은 어떻게 해결할 수 있을까?

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!