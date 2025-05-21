---
title: "[자바 고급2] I/O 기본2"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-21 23:40:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## 문자 다루기1 - 시작

만약 문자를 input을 들어와서 파일에 읽고 쓰려면 어떻게 할까? 문자열을 byte 배열로 변경하고 파일에 쓴다음에 다시 byte를 문자열로 디코딩해야 할 것이다. 한번 그 과정을 코드로 살펴보자.

``` java
package io.text;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;

import static io.text.TextConst.FILE_NAME;
import static java.nio.charset.StandardCharsets.UTF_8;

public class ReaderWriterMainV1 {
    public static void main(String[] args) throws IOException {
        String writeString = "ABC";
        byte[] writeBytes = writeString.getBytes(UTF_8);

        System.out.println("write String: " + writeString);
        System.out.println("write Bytes: " + Arrays.toString(writeBytes));

        FileOutputStream fos = new FileOutputStream(FILE_NAME);
        fos.write(writeBytes);
        fos.close();

        FileInputStream fis = new FileInputStream(FILE_NAME);
        byte[] readBytes = fis.readAllBytes();
        fis.close();

        String readString = new String(readBytes, UTF_8);

        System.out.println("read bytes: " + Arrays.toString(readBytes));
        System.out.println("read String: " + readString);
    }
}
```

문자열을 byte로 인코딩할 때 문자집합을 넣어주어야 하며 디코딩할 때도 `String` 생성자를 통해 문자집합을 넣어줄 수 있다. 지금 보니 코드가 너무 복잡하다. 조금 더 쉽게는 안될까?

## 문자 다루기2 - 스트림을 문자로

- **OutputStreamWriter**: 스트림에 byte 대신에 문자를 저장할 수 있게 지원한다.
- **InputStreamReader**: 스트림에 byte 대신에 문자를 읽을 수 있게 지원한다.

``` java
package io.text;

import java.io.*;

import static io.text.TextConst.FILE_NAME;
import static java.nio.charset.StandardCharsets.UTF_8;

public class ReaderWriterMainV2 {
    public static void main(String[] args) throws IOException {
        String writeString = "ABC";

        System.out.println("write String: " + writeString);

        FileOutputStream fos = new FileOutputStream(FILE_NAME);
        OutputStreamWriter osw = new OutputStreamWriter(fos, UTF_8);
        osw.write(writeString);
        osw.close();

        FileInputStream fis = new FileInputStream(FILE_NAME);
        InputStreamReader isr = new InputStreamReader(fis, UTF_8);

        StringBuilder content = new StringBuilder();
        int ch;

        while ((ch = isr.read()) != -1) {
            content.append((char) ch);
        }

        isr.close();

        System.out.println("read String: " + content);
    }
}
```

`OutputStreamWriter`로 문자열을 입력받으면 이 클래스 내부 안에서 byte 배열로 인코딩을 진행한다. 그리고 `InputStreamReader`를 통해서 byte 배열을 문자열로 디코딩하여 보여준다.

> ✅ 참고
>
> `read()`를 통해 읽으면 사실 문자가 반환되는게 맞다. 하지만 EOF와 같은 특수한 상황을 표현하기 힘들어서 정수형을 반환하게 한거고 우리가 눈으로 볼려면 `char`타입으로 캐스팅을 진행해야 한다.

앞서 우리가 스트림을 배울 때 분명 `byte` 단위로 데이터를 읽고 쓰는 것을 확인했다. `write()`의 경우에도 `byte` 단위로 데이터를 읽고 썼다. 최상위 부모인 `OutputStream` 의 경우 분명 `write()`가 `byte` 단위로 입력하도록 되어있다. 그런데 `OutputStreamWriter`의 `write()`는 `byte`가 아니라 `String`이나 `char`를 사용한다. 어떻게 된 것일까?

## 문자 다루기3 - Reader, Writer

자바는 byte를 다루는 I/O 클래스와 문자를 다루는 I/O 클래스를 둘로 나누어두었다.

- byte를 다루는 클래스는 `OutputStream`,`InputStream`의 자식이다.
    - 부모 클래스의 기본 기능도 `byte` 단위를 다룬다.
- 문자를 다루는 클래스는 `Writer`,`Reader`의 자식이다.
    - 부모 클래스의 기본 기능은 `String`,`char` 같은 문자를 다룬다.

여기서 꼭! 기억해야할 중요한 사실이 있다. 처음에 언급했듯이 모든 데이터는 byte 단위(숫자)로 저장된다. 따라서 `Writer` 가 아무리 문자를 다룬다고 해도 문자를 바로 저장할 수는 없다. 이 클래스에 문자를 전달하면 결과적으로 내부에서는 지정된 문자 집합을 사용해서 문자를 byte로 인코딩해서 저장한다.

### FileWriter, FileReader

이전 코드는 `FileOutputStream`을 생성하고 해당 객체 참조값을 `OutputStreamWriter`에 전달하여 문자열을 파일에 쓰는 과정을 했다. 읽는 과정도 마찬가지로 말이다. 하지만 좀 더 이것을 편리하게 해주는 클래스가 있는데 바로 `FileWriter`와 `FileReader`다.

``` java
package io.text;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import static io.text.TextConst.FILE_NAME;
import static java.nio.charset.StandardCharsets.UTF_8;

public class ReaderWriterMainV3 {
    public static void main(String[] args) throws IOException {
        String writeString = "ABC";

        System.out.println("write String: " + writeString);

        FileWriter fw = new FileWriter(FILE_NAME, UTF_8);
        fw.write(writeString);
        fw.close();

        StringBuilder content = new StringBuilder();
        FileReader fr = new FileReader(FILE_NAME, UTF_8);
        int ch;

        while ((ch = fr.read()) != -1) {
            content.append((char) ch);
        }

        fr.close();

        System.out.println("read String: " + content);
    }
}
```

`FileWriter` 코드와 앞서 작성한 `OutputStreamWriter` 를 사용한 코드가 뭔가 비슷하다는 점을 알 수 있다. 딱 하나 차이점이 있다면 이전 코드에서는 `FileOutputStream`을 직접 생성했는데, `FileWriter`는 생성자 내부에서 대신 `FileOutputStream`를 생성해준다. 사실 `FileWriter`는 `OutputStreamWriter`을 상속한다. 그리고 다른 추가 기능도 없다. 딱 하나, 생성자에서 개발자 대신에 `FileOutputStream`을 생성해주는 일만 대신 처리해준다. 따라서 `FileWriter`는 `OutputStreamWriter`를 조금 편리하게 사용하도록 도와줄 뿐이다. 물론 `FileReader`도 마찬가지다.

`Writer`,`Reader` 클래스를 사용하면 바이트 변환 없이 문자를 직접 다룰 수 있어서 편리하다. 하지만 실제로는 내부에서 byte로 변환해서 저장한다는 점을 꼭 기억하자. 모든 데이터는 바이트 단위로 다룬다! 문자를 직접 저장할 수는 없다! 그리고 반드시 기억하자, 문자를 byte로 변경하려면 항상 문자 집합(인코딩 셋)이 필요하다!

> ✅ 참고
>
> 문자 집합을 생략하면 시스템 기본 문자 집합이 사용된다.

## 문자 다루기4 - BufferedReader

`BufferedOutputStream`,`BufferedInputStream`과 같이 `Reader`,`Writer`에도 버퍼 보조 기능을 제공하는 `BufferedReader`,`BufferedWriter` 클래스가 있다.

추가로 문자를 다룰 때는 한 줄(라인)단위로 다룰 때가 많다. `BufferedReader` 는 한 줄 단위로 문자를 읽는 기능도 추가로 제공한다.

``` java
package io.text;

import java.io.*;

import static io.text.TextConst.FILE_NAME;
import static java.nio.charset.StandardCharsets.UTF_8;

public class ReaderWriterMainV4 {

    private static final int BUFFER_SIZE = 8192;

    public static void main(String[] args) throws IOException {
        String writeString = "ABC\n가나다";

        System.out.println("== Write String ==");
        System.out.println(writeString);

        FileWriter fw = new FileWriter(FILE_NAME, UTF_8);
        BufferedWriter bw = new BufferedWriter(fw, BUFFER_SIZE);
        bw.write(writeString);
        bw.close();

        StringBuilder content = new StringBuilder();
        FileReader fr = new FileReader(FILE_NAME, UTF_8);
        BufferedReader br = new BufferedReader(fr, BUFFER_SIZE);
        String line;

        while ((line = br.readLine()) != null) {
            content.append(line).append("\n");
        }

        br.close();

        System.out.println("== Read String ==");
        System.out.println(content);
    }
}
```

거의 기존과 비슷한데 조금 특이한 것은 `BufferedReader`에 `readLine()` 메서드를 제공해준다. 이 메서드는 한줄 단위로 읽고 문자열을 반환한다. 만약 다 읽었다면 `null`을 반환한다.

## 기타 스트림

다양한 스트림 클래스들을 알아보자.

### PrintStream

`PrintStream`은 우리가 자주 사용해왔던 바로 `System.out`에서 사용되는 스트림이다. `PrintStream`과 `FileOutputStream`을 조합하면 마치 콘솔에 출력하듯이 파일에 출력할 수 있다.

``` java
package io.streams;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;

public class PrintStreamEtcMain {
    public static void main(String[] args) throws FileNotFoundException {
        FileOutputStream fos = new FileOutputStream("temp/print.txt");
        PrintStream printStream = new PrintStream(fos);

        printStream.println("hello java!");
        printStream.println(10);
        printStream.println(true);
        printStream.printf("hello %s", "world");
        printStream.close();
    }
}
```

입력한 값들을 전부 타입이 다르지만 파일에 저장할 때는 문자열로 변경하여 저장한다. (사실은 byte로 저장한다.)

### DataOutputStream

`DataOutputStream`을 사용하면 자바의 `String`,`int`,`double`,`boolean` 같은 데이터 형을 편리하게 다룰 수 있다. 이 스트림과 `FileOutputStream`을 조합하면 파일에 자바 데이터 형을 편리하게 저장할 수 있다.

``` java
package io.streams;

import java.io.*;

public class DataStreamEtcMain {
    public static void main(String[] args) throws IOException {
        FileOutputStream fos = new FileOutputStream("temp/data.dat");
        DataOutputStream dos = new DataOutputStream(fos);

        dos.writeUTF("회원A");
        dos.writeInt(20);
        dos.writeDouble(10.5);
        dos.writeBoolean(true);
        dos.close();

        FileInputStream fis = new FileInputStream("temp/data.dat");
        DataInputStream dis = new DataInputStream(fis);

        System.out.println(dis.readUTF());
        System.out.println(dis.readInt());
        System.out.println(dis.readDouble());
        System.out.println(dis.readBoolean());
        dis.close();
    }
}
```

해당 코드들은 실제 타입 그대로 저장을 하는 것이다. 그리고 실제로 파일을 열어보면 값을 확인할 수 없는데 그 이유는 문자열은 `UTF-8`형식으로 저장하지만 그 외의 타입은 byte로 저장하기 때문이다.

> ⚠️ 주의
>
> 저장한 순서대로 읽어야 한다는 것이다. 그렇지 않으면 잘못된 데이터가 조회될 수 있다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!