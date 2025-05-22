---
title: "[자바 고급2] File, Files"
tags:
  - 자바
image: ./assets/banner.png
date: 2025-05-22 12:20:27
series: 자바 고급2
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [영한님의 인프런 강의](https://inf.run/vskmA)를 바탕으로 쓰여진 글입니다.

## File

자바에서 파일 또는 디렉토리를 다룰 때는 `File` 또는 `Files`,`Path` 클래스를 사용하면 된다. 이 클래스들을 사용하면 파일이나 폴더를 생성하고, 삭제하고, 또 정보를 확인할 수 있다.

먼저 `File` 클래스부터 알아보자.

``` java
package io.file;

import java.io.File;
import java.io.IOException;
import java.util.Date;

public class OldFileMain {
    public static void main(String[] args) throws IOException {
        File file = new File("temp/example.txt");
        File directory = new File("temp/exampleDir");

        System.out.println("File exists: " + file.exists());

        boolean created = file.createNewFile();
        System.out.println("File created: " + created);

        boolean dirCreated = directory.mkdir();
        System.out.println("Directory created: " + dirCreated);

//        boolean deleted = file.delete();
//        System.out.println("File deleted: " + deleted);

        System.out.println("Is file: " + file.isFile());

        System.out.println("Is Directory: " + directory.isDirectory());

        System.out.println("File name: " + file.getName());
        System.out.println("File size: " + file.length() + " bytes");

        File newFile = new File("temp/newExample.txt");
        boolean renamed = file.renameTo(newFile);
        System.out.println("File renamed: " + renamed);

        long lastModified = newFile.lastModified();
        System.out.println("Last modified: " + new Date(lastModified));
    }
}
```

`File`을 생성했다고 해서 진짜 파일이나 디렉토리가 생성이 되는게 아니라 메서드를 통해서 생성해야 한다.

## Files

자바 1.0에서 `File` 클래스가 등장했다. 이후에 자바 1.7에서 `File` 클래스를 대체할 `Files`와 `Path`가 등장했다. `Files`의 특징은 다음과 같다.

- 성능과 편의성이 모두 개선되었다.
- `File`은 과거의 호환을 유지하기 위해 남겨둔 기능이다. 이제는 `Files` 사용을 먼저 고려하자.
- 여기에는 수 많은 유틸리티 기능이 있다. `File` 클래스는 물론이고, `File`과 관련된 스트림(`FileInputStream`,`FileWriter`)의 사용을 고민하기 전에 `Files`에 있는 기능을 먼저 찾아보자. 성능도 좋고, 사용하기도 더 편리하다.
- 기능이 많으니 암기하지 말고 일단 이런게 있다라고 흐름만 보고 실제 사용할 때 찾아보자!

그러면 코드를 통해 한번 기능들을 살펴보자.

``` java
package io.file;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

public class NewFilesMain {
    public static void main(String[] args) throws IOException {
        Path file = Path.of("temp/example.txt");
        Path directory = Path.of("temp/exampleDir");
        System.out.println("File exists: " + Files.exists(file));

        try {
            Files.createFile(file);
            System.out.println("File created");
        } catch (FileAlreadyExistsException e) {
            System.out.println(file + "File already exists");
        }

        try {
            Files.createDirectory(directory);
            System.out.println("Directory created");
        } catch (FileAlreadyExistsException e) {
            System.out.println(directory + "Directory already exists");
        }

//        Files.delete(file);
//        System.out.println("File deleted");

        System.out.println("Is regular file: " + Files.isRegularFile(file));
        System.out.println("Is directory: " + Files.isDirectory(directory));
        System.out.println("File name: " + file.getFileName());
        System.out.println("File size: " + Files.size(file) + " bytes");

        Path newFile = Paths.get("temp/newExample.txt");
        Files.move(file, newFile, REPLACE_EXISTING);
        System.out.println("File moved/renamed");

        System.out.println("Last modified: " + Files.getLastModifiedTime(newFile));

        BasicFileAttributes attrs = Files.readAttributes(newFile, BasicFileAttributes.class);
        System.out.println("==== Attributes ====");
        System.out.println("Creation Time: " + attrs.creationTime());
        System.out.println("Is directory: " + attrs.isDirectory());
        System.out.println("Is regular file: " + attrs.isRegularFile());
        System.out.println("Is symbolic link: " + attrs.isSymbolicLink());
        System.out.println("Size: " + attrs.size());
    }
}
```

## 경로 표시

경로는 절대 경로와 정규 경로가 존재한다.

- 절대 경로: 절대 경로는 경로의 처음부터 내가 입력한 모든 경로를 다 표현한다.
- 정규 경로: 경로의 계산이 모두 끝난 경로이다. 정규 경로는 하나만 존재한다.

코드를 통해 경로 개념을 파악하자.

``` java
package io.file;

import java.io.File;
import java.io.IOException;

public class OldFilePath {
    public static void main(String[] args) throws IOException {
        File file = new File("temp/..");
        System.out.println("path = " + file.getPath());
        System.out.println("Absolute path = " + file.getAbsolutePath());
        System.out.println("Canonical path = " + file.getCanonicalPath());

        File[] files = file.listFiles();
        for (File f : files) {
            System.out.println((f.isFile() ? "F" : "D") + " | " + f.getName());
        }
    }
}
```

절대 경로는 말 그대로 절대적인 경로로 root경로부터 현재 경로까지의 전체 경로를 의미하고 정규 경로는 위의 코드처럼 경로 계산을 다 마친 경로를 의미하는 것을 알 수 있다. 즉, 절대 경로는 `root/temp/..`와 `root`처럼 여러가지가 있지만 정규 경로는 `root` 하나이다.

그러면 `Files`를 이용해서 위의 코드를 변경해보자.

``` java
package io.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public class NewFilesPath {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("temp/..");
        System.out.println("path = " + path);
        System.out.println("Absolute path = " + path.toAbsolutePath());
        System.out.println("Canonical path = " + path.toRealPath());

        Stream<Path> pathStream = Files.list(path);
        List<Path> list = pathStream.toList();
        pathStream.close();

        for (Path p : list) {
            System.out.println((Files.isRegularFile(p) ? "F" : "D") + " | " + p.getFileName());
        }
    }
}
```

## Files로 문자 파일 읽기

문자로 된 파일을 읽고 쓸 때 우리는 `FileWriter`, `FileReader`를 사용하였다. 그런데 해당 클래스들을 이용하면 읽고 쓰는 과정의 로직들이 엄청 복잡했던 경험이 있다. 또한 한줄 단위로 파일을 읽으려면 `BufferedReader`같은 보조 스트림도 필요했다. 하지만 이 문제를 `Files`가 해결해준다. 코드를 통해 살펴보자.

``` java
package io.file.text;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ReadTextFileV1 {

    private static final String PATH = "temp/hello2.txt";

    public static void main(String[] args) throws IOException {
        String writeString = "abc\n가나다";
        System.out.println("== Write String ==");
        System.out.println(writeString);

        Path path = Path.of(PATH);

        Files.writeString(path, writeString, UTF_8);

        String readString = Files.readString(path, UTF_8);
        System.out.println("== Read String ==");
        System.out.println(readString);
    }
}
```

- `Files.writeString()` : 파일에 쓰기
- `Files.readString()` : 파일에서 모든 문자 읽기

위의 2개의 메서드로 파일을 읽고 쓰는것을 해결할 수 있다. 반복문 따위는 보이지 않는다. 그럼 이제 라인 단위로 파일을 읽는 것을 살펴보자.

``` java
package io.file.text;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ReadTextFileV2 {

    private static final String PATH = "temp/hello2.txt";

    public static void main(String[] args) throws IOException {
        String writeString = "abc\n가나다";
        System.out.println("== Write String ==");
        System.out.println(writeString);

        Path path = Path.of(PATH);

        Files.writeString(path, writeString, UTF_8);
        System.out.println("== Read String ==");

        List<String> lines = Files.readAllLines(path, UTF_8);
        for (int i = 0; i < lines.size(); i++) {
            System.out.println((i + 1) + " : " + lines.get(i));
        }
    }
}
```

- Files.readAllLines(path)
    - 파일을 한 번에 다 읽고, 라인 단위로 `List`에 나누어 저장하고 반환한다.
    - 단점이라고 한다면 파일의 크기가 엄청 크다면 `OutofMemoryError`가 발생할 우려가 있다.
- Files.lines(path)
    - 파일을 한 줄 단위로 나누어 읽고, 메모리 사용량을 줄이고 싶다면 이 기능을 사용하면 된다.
    - 파일을 스트림 단위로 나누어 조회한다. (I/O 스트림이 아니라, 람다와 스트림에서 사용하는 스트림이다)
    - 파일이 아주 크다면 한 번에 모든 파일을 다 메모리에 올리는 것 보다, 파일을 부분 부분 나누어 메모리에 올리는 것이 더 나은 선택일 수 있다.
    - 이 기능을 사용하면 파일을 한 줄 단위로 메모리에 올릴 수 있다. 한 줄 당 1MB의 용량을 사용한다면 자바는 파일에서 한 번에 1MB의 데이터만 메모리에 올려 처리한다. 그리고 처리가 끝나면 다음 줄을 호출하고, 기존에 사용한 1M의 데이터는 GC한다.

## 파일 복사 최적화

이번에는 파일을 복사하는 효율적인 방법에 대해서 알아보자. 그 전에 임시 파일을 만들고 해당 파일을 복사하는 과정을 거쳐보겠다.

``` java
package io.file.copy;

import java.io.FileOutputStream;
import java.io.IOException;

public class CreateCopyFile {

    private static final int FILE_SIZE = 200 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        String fileName = "temp/copy.dat";
        long startTime = System.currentTimeMillis();

        FileOutputStream fos = new FileOutputStream(fileName);
        byte[] buffer = new byte[FILE_SIZE];
        fos.write(buffer);
        fos.close();

        long endTime = System.currentTimeMillis();
        System.out.println("File created: " + fileName);
        System.out.println("File size: " + FILE_SIZE / 1024 / 1024 + " MB");
        System.out.println("Time taken: " + (endTime - startTime) + " ms");
    }
}
```

이제 해당 임시 파일을 복사해보자.

``` java
package io.file.copy;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopyMainV1 {
    public static void main(String[] args) throws IOException {
        long startTime = System.currentTimeMillis();
        FileInputStream fis = new FileInputStream("temp/copy.dat");
        FileOutputStream fos = new FileOutputStream("temp/copy_new.dat");
        byte[] bytes = fis.readAllBytes();

        fos.write(bytes);
        fis.close();
        fos.close();

        long endTime = System.currentTimeMillis();
        System.out.println("Time taken: " + (endTime - startTime) + " ms");
    }
}
```

`readAllBytes()` 메서드를 통하여 바이트 배열로 전부 가져온 후에 `FileInputStream`을 통해 데이터를 쓰는 과정을 진행하였다. 즉, 복사본 파일을 byte 배열로 변경 후, 복사본 파일에 쓰는 과정인 것이다. 그런데 조금 더 최적화를 해보자.

``` java
package io.file.copy;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileCopyMainV2 {
    public static void main(String[] args) throws IOException {
        long startTime = System.currentTimeMillis();
        FileInputStream fis = new FileInputStream("temp/copy.dat");
        FileOutputStream fos = new FileOutputStream("temp/copy_new.dat");

        fis.transferTo(fos);
        fis.close();
        fos.close();

        long endTime = System.currentTimeMillis();
        System.out.println("Time taken: " + (endTime - startTime) + " ms");
    }
}
```

`InputStream`에는 `transferTo`라는 메서드가 존재한다. 이 메서드는 `InputStream`에서 읽은 데이터를 바로 `OutputStream`으로 출력한다. 즉, 파일을 byte 배열로 변경 후 복사본 파일에 쓰는 과정을 조금 편리하고 최적화된 메서드로 자바가 제공해준 것이다. 그런데 이것을 조금 더 최적화 해보자.

``` java
package io.file.copy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

public class FileCopyMainV3 {
    public static void main(String[] args) throws IOException {
        long startTime = System.currentTimeMillis();

        Path source = Path.of("temp/copy.dat");
        Path target = Path.of("temp/copy_new.dat");
        Files.copy(source, target, REPLACE_EXISTING);

        long endTime = System.currentTimeMillis();
        System.out.println("Time taken: " + (endTime - startTime) + " ms");
    }
}
```

이전에는 파일을 byte 배열로 변경 후 복사본 파일에 쓰는 과정을 담았다. 이 과정들은 파일의 데이터를 자바로 불러오고 또 자바에서 읽은 데이터를 다시 파일에 전달해야 한다. `Files.copy()`는 자바에 파일 데이터를 불러오지 않고, 운영체제의 파일 복사 기능을 사용한다. 즉, byte 배열로 변경하지 않고 운영체제 기능을 이용해서 원본 파일을 복사본 파일로 바로 쓰는 과정을 담는다. 따라서 가장 빠르다. 파일을 다루어야 할 일이 있다면 항상 `Files`의 기능을 먼저 찾아보자. 물론 이 기능은 파일에서 파일을 복사할 때만 유용하다. 만약 파일의 정보를 읽어서 처리해야 하거나, 스트림을 통해 네트워크에 전달해야 한다면 앞서 설명한 스트림을 직접 사용해야 한다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!