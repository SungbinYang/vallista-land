---
title: "[자바 고급2] I/O 활용"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-22 11:03:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## 회원 관리 예제1 - 메모리

I/O를 사용해서 회원 데이터를 관리하는 예제를 만들어보자. 처음에는 회원을 메모리에 저장한다고 하고 구현해보자.

먼저 회원 객체부터 개발해보자.

``` java
package io.member;

public class Member {

    private String id;

    private String name;

    private Integer age;

    public Member() {
    }

    public Member(String id, String name, Integer age) {
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
        return "Member{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

이제 회원을 저장하는 로직을 인터페이스와 그 구현체로 해서 만들어보자.

``` java
package io.member;

import java.util.List;

public interface MemberRepository {
    void add(Member member);

    List<Member> findAll();
}
```

인터페이스를 위와 같이 구현하고 아래와 같이 메모리 저장 구현체를 만들었다.

``` java
package io.member.impl;

import io.member.Member;
import io.member.MemberRepository;

import java.util.ArrayList;
import java.util.List;

public class MemoryMemberRepository implements MemberRepository {

    private final List<Member> members = new ArrayList<>();

    @Override
    public void add(Member member) {
        members.add(member);
    }

    @Override
    public List<Member> findAll() {
        return members;
    }
}
```

이제 사용하는 코드를 만들어보자.

``` java
package io.member;

import io.member.impl.MemoryMemberRepository;

import java.util.List;
import java.util.Scanner;

public class MemberConsoleMain {

    private static final MemberRepository repository = new MemoryMemberRepository();

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("1.회원 등록 | 2.회원 목록 조회 | 3.종료");
            System.out.print("선택: ");
            int choice = scanner.nextInt();

            scanner.nextLine();

            switch (choice) {
                case 1:
                    registerMember(scanner);
                    break;
                case 2:
                    displayMembers();
                    break;
                case 3:
                    System.out.println("프로그램을 종료합니다.");
                    return;
                default:
                    System.out.println("잘못된 선택입니다. 다시 입력하세요.");
            }
        }
    }

    private static void registerMember(Scanner scanner) {
        System.out.print("ID 입력: ");
        String id = scanner.nextLine();

        System.out.print("Name 입력: ");
        String name = scanner.nextLine();

        System.out.print("Age 입력: ");
        int age = scanner.nextInt();
        scanner.nextLine();

        Member member = new Member(id, name, age);
        repository.add(member);
        System.out.println("회원이 성공적으로 등록되었습니다.");
    }

    private static void displayMembers() {
        List<Member> members = repository.findAll();
        System.out.println("회원 목록");

        for (Member member : members) {
            System.out.printf("[ID: %s, Name: %s, Age: %d]\n", member.getId(), member.getName(), member.getAge());
        }
    }
}
```

여기서 유심히 볼 부분은 그냥 단순한 로직이다. 이제 실행을 해보면 아마 정상적으로 잘 작동하는 것을 볼 수 있을 것이다. 다만, 문제점은 자바 프로그램을 종료하면 기존의 데이터는 다 날라간다. 그 이유는 자바 프로그램이 종료되면 사용하던 메모리도 같이 정리하기 때문이다.

## 회원 관리 예제2 - 파일에 보관

회원 데이터를 영구보관하려면 우리가 가장 먼저 떠오르는 것은 파일에 저장하고 읽어오고 방식을 택하는 것이다. 그럼 우리가 이전에 배운 `Reader`와 `Writer`를 활용하여 만들 수 있을 것이다. 이 중에 `BufferedReader`와 `BufferedWriter`를 활용할 수 있을 것이다.

``` java
package io.member.impl;

import io.member.Member;
import io.member.MemberRepository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

public class FileMemberRepository implements MemberRepository {

    private static final String FILE_PATH = "temp/members-txt.dat";

    private static final String DELIMITER = ",";

    @Override
    public void add(Member member) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_PATH, UTF_8, true))) {
            bw.write(member.getId() + DELIMITER + member.getName() + DELIMITER + member.getAge());
            bw.newLine();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Member> findAll() {
        List<Member> members = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(FILE_PATH, UTF_8))) {
            String line;

            while ((line = br.readLine()) != null) {
                String[] memberData = line.split(DELIMITER);
                members.add(new Member(memberData[0], memberData[1], Integer.valueOf(memberData[2])));
            }

            return members;
        } catch (FileNotFoundException e) {
            return new ArrayList<>();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

`BufferedReader`와 `BufferedWriter`를 이용하여 데이터를 파일에 저장하고 읽고를 할 수 있었다. 대신 회원 정보를 구분하기 위해 구분자를 추가하였다. 그리고 자원정리를 자동으로 하게끔 `try-with-resources`를 활용하였다. 그 외에 내용은 코드를 보면 알만한 내용들이다.

하지만 여기에는 문제가 있다. 일단 저장할때 무조건 회원 정보의 타입이 무엇이든 문자열로 저장한다는 점과 읽어올때 형변환이나 파싱을 해줘야 한다는 점이 매우 불편하고 각 회원정보 데이터를 구분하기 위해 구분자를 넣는것도 부자연스럽다.

## 회원 관리 예제3 - DataStream

회원 데이터의 타입을 그대롤 저장하고 불러오고 구분자 없이 진행하려면 `DataOutputStream`과 `DataInputStream`이라는 보조 스트림을 사용하면 된다.

``` java
package io.member.impl;

import io.member.Member;
import io.member.MemberRepository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class DataMemberRepository implements MemberRepository {

    private static final String FILE_PATH = "temp/members-dat.dat";

    @Override
    public void add(Member member) {
        try (DataOutputStream dos = new DataOutputStream(new FileOutputStream(FILE_PATH, true))) {
            dos.writeUTF(member.getId());
            dos.writeUTF(member.getName());
            dos.writeInt(member.getAge());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Member> findAll() {
        List<Member> members = new ArrayList<>();

        try (DataInputStream dis = new DataInputStream(new FileInputStream(FILE_PATH))) {
            while (dis.available() > 0) {
                members.add(new Member(dis.readUTF(), dis.readUTF(), dis.readInt()));
            }

            return members;
        } catch (FileNotFoundException e) {
            return new ArrayList<>();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

위와 같이 회원을 저장할 때는 회원 필드의 타입에 맞는 메서드를 호출하면 된다. 또한 이전 예제에서는 각 회원을 한 줄 단위로 구분했는데, 여기서는 그런 구분이 필요없다.

### DataStream 원리

`DataStream`은 어떤 원리로 구분자나 한 줄 라인 없이 데이터를 저장하고 조회할 수 있는 것일까?

``` java
dos.writeUTF("tester");
dis.readUTF();
```

위와 같은 코드일때 `tester`라는 문자열을 정확히 6글자라고 어떻게 알고 읽어오는 것일까? `writeUTF()`은 UTF-8 형식으로 문자를 저장하는데, 저장할 때 2byte를 추가로 사용해서 앞에 글자의 길이를 저장해둔다. (65535 길이까지만 사용 가능) 따라서 `readUTF()`같은 메서드로 읽어올 때 앞 2byte를 확인해서 글자의 길이를 확인 후 해당 길이만큼 읽어 오는 것이다.

만약 문자열이 아니라 다른 타입이라면 해당 타입 용량만큼 읽어온다. 예를들어 위의 코드의 age같은 경우는 정수형이므로 4byte만큼 읽어오는 것이다.

`DataStream` 덕분에 회원 데이터를 더 편리하게 저장할 수 있는 것은 맞지만, 회원의 필드 하나하나를 다 조회해서 각 타입에 맞도록 따로따로 저장해야 한다. 이것은 회원 객체를 저장한다기 보다는 회원 데이터를 하나하나 분류해서 따로 저장한 것이다. 뭔가 이런 점이 불편하다. 이전 컬렉션에 데이터를 추가했을 때처럼 객체 자체를 못집어 넣을까?

## 회원 관리 예제4 - ObjectStream

회원 인스턴스도 생각해보면 메모리 어딘가에 보관되어 있다. 이렇게 메모리에 있는 보관되어 있는 객체를 읽어서 파일에 저장하기만 하면 아주 간단하게 회원 인스턴스를 저장할 수 있을 것 같다. `ObjectStream`을 사용하면 이렇게 메모리에 보관되어 있는 회원 인스턴스를 파일에 편리하게 저장할 수 있다. 마치 자바 컬렉션에 회원 객체를 보관하듯이 말이다.

### 객체 직렬화

자바 객체 직렬화는 메모리에 있는 객체 인스턴스를 바이트 스트림으로 변환하여 파일에 저장하거나 네트워크를 통해 전송할 수 있도록 하는 기능이다. 이 과정에서 객체의 상태를 유지하여 나중에 역직렬화를 통해 원래의 객체로 복원할 수 있다.

객체 직렬화를 하려면 `Serializable` 인터페이스를 구현해야 한다. 해당 인터페이스는 빈 껍떼기다.

``` java
package java.io;

public interface Serializable {
}
```

빈 껍떼기라 아무런 기능은 없고 단지 직렬화 가능한 객체라고 표기하기 위한 마커 인터페이스 역할만 한다. 그럼 우리 코드에 적용해보자.

``` java
package io.member;

import java.io.Serializable;

public class Member implements Serializable {

    private String id;

    private String name;

    private Integer age;

    public Member() {
    }

    public Member(String id, String name, Integer age) {
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
        return "Member{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

위와 같이 `Serializable` 인터페이스를 구현하였다. 만약 해당 인터페이스를 구현 안 하고 직렬화를 하려고 한다면 아래의 예외가 발생한다.

``` bash
java.io.NotSerializableException: io.member.Member
```

이제 객체를 직접 저장하게끔 하는 구현체를 만들어보겠다.

``` java
package io.member.impl;

import io.member.Member;
import io.member.MemberRepository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class ObjectMemberRepository implements MemberRepository {

    private static final String FILE_PATH = "temp/members-obj.dat";

    @Override
    public void add(Member member) {
        List<Member> members = findAll();
        members.add(member);

        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(FILE_PATH))) {
            oos.writeObject(members);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<Member> findAll() {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(FILE_PATH))) {
            Object findObject = ois.readObject();
            return (List<Member>) findObject;
        } catch (FileNotFoundException e) {
            return new ArrayList<>();
        } catch (IOException | ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
```

`ObjectOutputStream`를 사용하면 객체 인스턴스를 직렬화해서 byte로 변경할 수 있다. 여기서는 회원 1명을 저장할 것은 아니기에 회원 컬렉션 자체를 직렬화 하였다. 직렬화는 `writeObject()` 메서드로 가능하다. 그리고 역직렬화를 할때는 `readObject()`로 읽어와야 하는데 해당 반환 타입이 `Object`라 타입 캐스팅을 해줘야 한다.

> ✅ 참고
>
> `ArrayList`도 `java.io.Serializable`을 구현하고 있어서 직렬화 할 수 있다.

객체 직렬화 덕분에 객체를 매우 편리하게 저장하고 불러올 수 있었다. 객체 직렬화를 사용하면 객체를 바이트로 변환할 수 있어, 모든 종류의 스트림에 전달할 수 있다. 이는 파일에 저장하는것은 물론, 네트워크를 통해 객체를 전송하는 것도 가능하게 한다. 이러한 특성 때문에 초기에는 분산 시스템에서 활용되었다. 그러나 객체 직렬화는 1990년대에 등장한 기술로, 초창기에는 인기가 있었지만 시간이 지나면서 여러 단점이 드러났다. 또한 대안 기술이 등장하면서 점점 그 사용이 줄어들게 되었다. 현재는 객체 직렬화를 거의 사용하지 않는다.

## XML, JSON, 데이터베이스

### 객체 직렬화의 한계

- 버전 관리의 어려움
    - 클래스 구조가 변경되면 이전에 직렬화된 객체와의 호환성 문제가 발생한다.
    - serialVersionUID 관리가 복잡하다.
- 플랫폼 종속성
    - 자바 직렬화는 자바 플랫폼에 종속적이어서 다른 언어나 시스템과의 상호 운용성이 떨어진다.
- 성능 이슈
    - 직렬화/역직렬화 과정이 상대적으로 느리고 리소스를 많이 사용한다.
- 유연성 부족
    - 직렬화된 형식을 커스터마이즈하기 어렵다.
- 크기 효율성
    - 직렬화된 데이터의 크기가 상대적으로 크다.

### XML

``` xml
<member>
    <id>id1</id>
    <name>name1</name>
    <age>20</age>
</member>
```

이런 문제로 인하여 새로운 방식을 고안하였다. 일단 플랫폼 종속성 문제를 해결하기 위해 `XML`이 나왔다. 한때 엄청 인기가 있었고 호환성과 유연성이 좋았다. 하지만 복잡하고 무겁다는 단점이 존재하였다. 태그를 포함한 XML 문서의 크기가 커서 네트워크 전송 비용도 증가했다.

### JSON

``` json
{ "member": { "id": "id1", "name": "name1", "age": 20 } }
```

그래서 나온게 `JSON`이다. JSON은 가볍고 단순하며, 자바스크립트와의 자연스러운 호환성 덕분에 웹 개발자들 사이에서 빠르게 확산되었다. 또한, 현대 REST API 시스템에 인기 있는 포맷으로 자리를 잡았다. 지금은 웹 환경에서 데이터를 교환할 때 JSON이 사실상 표준 기술이다.

### Protobuf, Avro

JSON은 거의 모든 곳에서 호환이 가능하고, 사람이 읽고 쓰기 쉬운 텍스트 기반 포맷이어서 디버깅과 개발이 쉽다. 만약 매우 작은 용량으로 더 빠른 속도가 필요하다면 Protobuf, Avro 같은 대안 기술이 있다. 이런 기술은 호환성은 떨어지지만 byte 기반에, 용량과 성능 최적화가 되어 있으므로 매우 빠르다. 다만 byte 기반이므로 JSON처럼 사람이 직접 읽기는 어렵다. 또한 Protobuf, Avro를 사용하려면 라이브러리를 설치하는 등의 공수도 필요하다.

정리를 해보면 직렬화는 요즘 사용하지를 않고 JSON을 가장 많이 이용한다.

### 데이터베이스

구조화된 데이터를 주고 받을 때는 JSON 형식을 주로 사용한다. 하지만 어떤 형식이든 데이터를 저장할 때, 파일에 데이터를 직접 저장하는 방식은 몇 가지 큰 한계가 있다.

- 데이터의 무결성을 보장하기 어렵다. 여러 사용자가 동시에 파일을 수정하거나 접근하려고 할 때, 데이터의 충돌이나 손상 가능성이 높아진다. 이러한 경우, 데이터의 일관성을 유지하는 것이 매우 어렵다.
- 데이터 검색과 관리의 비효율성이다. 파일에 저장된 데이터는 특정 형식 없이 단순히 저장될 수 있기 때문에, 필요한 데이터를 빠르게 찾는 데 많은 시간이 소요될 수 있다. 특히, 데이터의 양이 방대해질수록 검색 속도는 급격히 저하된다.
- 보안 문제이다. 파일 기반 시스템에서는 민감한 데이터를 안전하게 보호하기 위한 접근 제어와 암호화 등이 충분히 구현되지 않을 수 있다. 결과적으로, 데이터 유출이나 무단 접근의 위험이 커질 수 있다.
- 대규모 데이터의 효율적인 백업과 복구가 필요하다.

이런 한계로 인하여 등장한 것이 바로 데이터베이스다. 대부분의 현대 애플리케이션에서는 데이터베이스를 사용한다. 데이터베이스는 위의 한계들을 극복하고, 대량의 데이터를 효율적으로 저장, 관리, 검색할 수 있는 강력한 도구를 제공한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!