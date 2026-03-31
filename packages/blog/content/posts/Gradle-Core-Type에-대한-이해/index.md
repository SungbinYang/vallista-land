---
title: "[Gradle] Core Type에 대한 이해"
tags:
  - gradle
image: ./assets/banner.png
date: 2026-03-31 18:22:27
series: gradle
draft: false
---

![banner](./assets/banner.png)

## Project 클래스에 대해 알아보자

### Project 객체란?

Gradle에서 **Project 객체**는 빌드 시스템 내의 하나의 프로젝트를 나타내며, 빌드를 구성하기 위한 **중앙 제어 지점** 역할을 한다. `build.gradle` 파일에서 작성하는 모든 코드는 사실 이
Project 객체의 컨텍스트 안에서 실행된다. 빌드 구성, 태스크, 의존성 등 빌드에 필요한 모든 것이 Project 객체를 통해 관리된다.

이전에 Build Lifecycle을 다룰 때 Initialization Phase에서 "각 프로젝트에 대해 Project 객체가 생성된다"고 했는데, 바로 그 Project 객체가 이것이다.

### build.gradle = Project 객체

`build.gradle` 파일에서 작성하는 코드를 다시 살펴보자. 사실 우리가 지금까지 작성해온 빌드 스크립트의 모든 블록은 **Project 객체의 메서드 호출**이었다.

```groovy
// 이 두 코드는 동일하다
repositories {
    mavenCentral()
}
 
project.repositories({
    mavenCentral()
})
```

`repositories { }`, `dependencies { }`, `plugins { }` 등은 모두 Project 객체의 메서드이며, `project.`을 생략할 수 있는 것은 `build.gradle`이
Project 객체의 컨텍스트에서 실행되기 때문이다. 즉, **`build.gradle`의 `this`가 곧 Project 객체이다.**

### Project 프로퍼티

Project 객체는 프로젝트의 이름, 버전, 설명, 디렉토리 경로 등 다양한 프로퍼티를 가지고 있다. 이 프로퍼티들은 빌드 스크립트에서 자유롭게 접근하고 수정할 수 있다.

```groovy
project.version = '1.0.0'
project.description = 'A sample Gradle Project to demonstrate the Project Object'
```

#### 주요 내장 프로퍼티

| 프로퍼티                  | 설명                               | 예시 값                         |
|-----------------------|----------------------------------|------------------------------|
| `project.name`        | 프로젝트 이름 (`settings.gradle`에서 정의) | `app`                        |
| `project.version`     | 프로젝트 버전                          | `1.0.0`                      |
| `project.description` | 프로젝트 설명                          | `A sample Gradle Project...` |
| `project.path`        | 프로젝트 경로 (멀티 프로젝트에서의 위치)          | `:app`                       |
| `project.projectDir`  | 프로젝트 디렉토리 (File 객체)              | `/path/to/project/app`       |
| `project.buildDir`    | 빌드 출력 디렉토리                       | `/path/to/project/app/build` |
| `project.rootDir`     | 루트 프로젝트 디렉토리                     | `/path/to/project`           |
| `project.group`       | Maven 그룹 ID                      | `com.example`                |

이 프로퍼티들을 출력해보면 현재 프로젝트의 정보를 확인할 수 있다.

```groovy
application {
    println "Project Name: ${project.name}"
    println "UUID: ${project.getPath()}"
    println "Project Version: ${project.version}"
    println "Project Description: ${project.description}"
    mainClass = 'org.example.App'
}
```

`project.name`은 `settings.gradle`의 `include`에서 정의된 이름이므로 빌드 스크립트에서 변경할 수 없지만, `version`, `description`, `group` 등은 자유롭게
설정할 수 있다.

### 커스텀 프로퍼티 (Extra Properties)

Project 객체에 내장된 프로퍼티 외에 **커스텀 프로퍼티**를 추가할 수 있다. `ext` 블록이나 `project.ext`를 통해 정의한다.

```groovy
// 커스텀 프로퍼티 정의
project.ext.prop1 = 'foo'
 
// ext 블록으로 여러 개를 한 번에 정의
ext {
    springBootVersion = '3.2.0'
    javaVersion = '25'
    isRelease = false
}
```

커스텀 프로퍼티는 정의 이후 일반 프로퍼티처럼 접근할 수 있다.

```groovy
println project.prop1                // foo
println project.springBootVersion    // 3.2.0
 
// project. 생략 가능
println springBootVersion            // 3.2.0
```

#### Extra Properties의 활용

커스텀 프로퍼티는 빌드 스크립트 전체에서 공유되는 상수나 설정 값을 관리할 때 유용하다.

```groovy
// 루트 build.gradle에서 정의
ext {
    kotlinVersion = '2.0.0'
    springBootVersion = '3.2.0'
    lombokVersion = '1.18.30'
}
 
// 서브 프로젝트의 build.gradle에서 사용
dependencies {
    implementation "org.springframework.boot:spring-boot-starter-web:${rootProject.springBootVersion}"
    compileOnly "org.projectlombok:lombok:${rootProject.lombokVersion}"
}
```

멀티 모듈 프로젝트에서 루트 프로젝트의 `ext`에 버전을 정의하고, 서브 프로젝트에서 `rootProject.프로퍼티명`으로 참조하는 패턴이다. 다만 최근에는 Version Catalog(
`libs.versions.toml`)가 이 역할을 대체하는 추세이다.

### project. 생략의 원리

`build.gradle`에서 `project.`을 생략할 수 있는 이유를 좀 더 깊이 이해해보자.

```groovy
// 아래 코드들은 모두 동일하다
 
// 1. project를 명시적으로 사용
project.version = '1.0.0'
project.repositories { mavenCentral() }
project.dependencies { implementation libs.guava }
project.java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }
 
// 2. project를 생략 (일반적인 작성 방식)
version = '1.0.0'
repositories { mavenCentral() }
dependencies { implementation libs.guava }
java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }
```

Groovy의 **delegate** 메커니즘 덕분에 `build.gradle`의 코드는 Project 객체를 delegate로 하여 실행된다. 따라서 `build.gradle`에서 호출하는 모든 메서드와 프로퍼티는
먼저 Project 객체에서 찾게 된다.

실제 코드에서 `project.`을 명시하는 경우는 거의 없지만, 이 원리를 이해하면 빌드 스크립트가 어떻게 동작하는지 명확해진다.

### Project 객체의 주요 메서드

Project 객체는 프로퍼티 외에도 빌드에 필요한 다양한 메서드를 제공한다.

#### 태스크 관련

```groovy
// 태스크 등록
project.tasks.register('hello') {
    doLast { println "Hello!" }
}
 
// 기존 태스크 참조
project.tasks.named('test') {
    useJUnitPlatform()
}
```

#### 의존성 관련

```groovy
// 리포지토리 설정
project.repositories {
    mavenCentral()
    maven { url 'https://jitpack.io' }
}
 
// 의존성 선언
project.dependencies {
    implementation 'com.google.guava:guava:33.5.0-jre'
}
```

#### 파일 관련

```groovy
// 파일 참조
def configFile = project.file('config/application.yml')
println configFile.exists()
 
// 파일 트리
def javaFiles = project.fileTree('src/main/java') {
    include '**/*.java'
}
println "Java files: ${javaFiles.files.size()}"
 
// 디렉토리 생성
project.mkdir('generated')
```

#### 프로퍼티 조회

```groovy
// 프로퍼티 존재 여부 확인
if (project.hasProperty('signing.keyId')) {
    // 서명 설정
}
 
// 프로퍼티 조회 (없으면 null 반환)
def port = project.findProperty('server.port') ?: '8080'
```

`findProperty`는 Groovy Truth와 Elvis 연산자와 결합하여 기본값 패턴을 구현할 때 자주 사용된다.

### 멀티 프로젝트에서의 Project 객체

멀티 프로젝트 빌드에서는 루트 프로젝트와 서브 프로젝트 각각에 대해 별도의 Project 객체가 생성된다. 루트 프로젝트의 `build.gradle`에서 서브 프로젝트들에 접근할 수 있다.

```groovy
// 루트 build.gradle
 
// 모든 프로젝트 (루트 포함)에 적용
allprojects {
    group = 'com.example'
    version = '1.0.0'
}
 
// 서브 프로젝트에만 적용
subprojects {
    apply plugin: 'java'
 
    repositories {
        mavenCentral()
    }
 
    dependencies {
        testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    }
}
 
// 특정 서브 프로젝트에만 적용
project(':app') {
    dependencies {
        implementation 'com.google.guava:guava:33.5.0-jre'
    }
}
```

| 메서드                    | 대상 범위           | 설명            |
|------------------------|-----------------|---------------|
| `allprojects { }`      | 루트 + 모든 서브 프로젝트 | 전체 공통 설정      |
| `subprojects { }`      | 서브 프로젝트만        | 서브 프로젝트 공통 설정 |
| `project(':name') { }` | 특정 서브 프로젝트      | 개별 프로젝트 설정    |

### Project API 레퍼런스

Project 객체의 전체 API는 Gradle 공식 문서에서 확인할 수 있다.

- [Project DSL Reference](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html)

이 문서에서 Project 객체가 제공하는 모든 프로퍼티와 메서드를 확인할 수 있으며, Gradle 빌드 스크립트를 작성할 때 가장 자주 참고하게 되는 레퍼런스이다.

## Task 클래스에 대해 알아보자

### Task 객체란?

이전 글에서 Project 객체가 빌드의 중앙 제어 지점이라는 것을 배웠다. 이번에는 Project 객체 안에서 **실제 작업을 수행하는 단위**인 **Task 객체**를 깊이 살펴보자.

Task 클래스는 빌드 내의 **하나의 작업 단위(a single unit of work)** 를 나타낸다. 코드 컴파일, 테스트 실행, 애플리케이션 패키징 등 각각의 작업이 하나의 Task이다. 하나의 Task은
이름(name), 액션(actions), 의존 관계(dependencies)를 가지며, 여러 개의 액션을 포함할 수 있고 이 액션들은 태스크가 실행될 때 순서대로 실행된다.

### Task의 생명주기

Task도 Build Lifecycle과 마찬가지로 단계를 거친다.

| 단계                     | 설명                                                             |
|------------------------|----------------------------------------------------------------|
| **Creation (생성)**      | Configuration Phase에서 태스크 객체가 생성된다.                            |
| **Configuration (구성)** | 태스크의 프로퍼티와 의존 관계가 설정된다. 이 단계도 Configuration Phase에서 이루어진다.     |
| **Execution (실행)**     | Execution Phase에서 태스크의 액션(`doFirst`, `doLast`)이 정의된 순서대로 실행된다. |

이전 글들에서 다뤘던 Configuration Phase vs Execution Phase의 구분이 여기서도 그대로 적용된다.

### Task 등록 방법

#### task 키워드 (레거시)

```groovy
task publishDockerImage {
    ext.version = "1.0.0"
    doFirst {
        println "publishing DockerImage"
    }
}
```

`task` 키워드는 Configuration Phase에서 즉시 태스크를 생성한다. 간결하지만, 해당 태스크를 실행하지 않더라도 매번 생성 비용이 발생한다.

#### project.task() 메서드

```groovy
project.task("prepTask") {
    println "configuring prepTask"
    doLast {
        println "Doing preparation"
    }
}
```

`project.task()`도 `task` 키워드와 동일하게 즉시 태스크를 생성한다. 이전 글에서 배운 것처럼 `project.`은 생략 가능하다.

#### tasks.register() (권장)

```groovy
tasks.register('prepTask') {
    doLast {
        println "Doing preparation"
    }
}
```

Build Lifecycle 글에서 다뤘듯이, `tasks.register`는 태스크가 실제로 필요할 때까지 생성을 지연시키는 **Configuration Avoidance** 방식이다. Gradle 공식 문서에서도
이 방식을 권장한다. 다만 이번 실습에서는 교안 내용에 따라 `task` 키워드와 `project.task()`를 사용한다.

### Task 프로퍼티

Task 객체는 다양한 프로퍼티를 가진다.

| 프로퍼티          | 설명                                     |
|---------------|----------------------------------------|
| `name`        | 태스크의 이름. 빌드 스크립트에서 태스크를 참조할 때 사용한다.    |
| `dependsOn`   | 이 태스크보다 먼저 실행되어야 하는 다른 태스크를 지정한다.      |
| `group`       | `gradle tasks`에서 태스크가 분류될 카테고리를 지정한다.  |
| `description` | 태스크에 대한 설명. `gradle tasks`에서 표시된다.     |
| `enabled`     | `false`로 설정하면 태스크가 건너뛰어진다 (`SKIPPED`). |

```groovy
task publishDockerImage {
    group = 'deployment'
    description = 'Publishes the Docker image to the registry'
    ext.version = "1.0.0"
    doFirst {
        println "publishing DockerImage"
    }
}
```

`group`과 `description`을 설정하면 `gradle tasks`에서 "Other tasks" 대신 지정한 카테고리에 설명과 함께 표시되어 팀원들이 태스크 용도를 쉽게 파악할 수 있다.

#### Extra Properties (`ext`)

태스크에도 Project와 마찬가지로 `ext`를 통해 커스텀 프로퍼티를 추가할 수 있다.

```groovy
task publishDockerImage {
    ext.version = "1.0.0"
    def customVariable = "abc"
    println "customVariable ${customVariable}"
    doFirst {
        println "publishing DockerImage"
    }
}
```

`ext.version`은 태스크의 Extra Property로, 다른 태스크에서 `publishDockerImage.version`으로 접근할 수 있다. 반면 `def customVariable`은
Configuration Phase에서만 존재하는 로컬 변수이므로 외부에서 접근할 수 없다.

### Task Actions (doFirst / doLast)

액션은 태스크가 **실제로 하는 일**을 정의한다. `doFirst`와 `doLast` 메서드로 액션을 추가하며, 이 액션들은 Execution Phase에서 실행된다.

```groovy
task example {
    doFirst {
        println "1st - doFirst"
    }
    doLast {
        println "2nd - doLast"
    }
    doFirst {
        println "0th - another doFirst"
    }
}
```

```
$ gradle example
> Task :example
0th - another doFirst
1st - doFirst
2nd - doLast
```

`doFirst`는 액션 리스트의 **맨 앞에** 추가되고, `doLast`는 **맨 뒤에** 추가된다. 따라서 `doFirst`를 여러 번 호출하면 나중에 추가한 것이 먼저 실행되고, `doLast`를 여러 번
호출하면 나중에 추가한 것이 나중에 실행된다.

### Task Dependencies (dependsOn)

태스크 간에 의존 관계를 설정하면 특정 태스크가 다른 태스크보다 먼저 실행되도록 보장할 수 있다. `dependsOn`으로 정의한다.

```groovy
task publishDockerImage {
    ext.version = "1.0.0"
    doFirst {
        println "publishing DockerImage"
    }
}
 
task deployingDockerImage(dependsOn: publishDockerImage) {
    doFirst {
        println "deploying DockerImage"
    }
}
```

`deployingDockerImage`를 실행하면 먼저 `publishDockerImage`가 실행된 후에 `deployingDockerImage`가 실행된다.

```
$ gradle deployingDockerImage
> Task :publishDockerImage
publishing DockerImage
 
> Task :deployingDockerImage
deploying DockerImage
```

### 조건부 실행 (onlyIf)

`onlyIf`를 사용하면 특정 조건이 만족될 때만 태스크를 실행할 수 있다. 조건이 `false`이면 태스크는 `SKIPPED` 상태가 된다.

```groovy
task deployingDockerImage(dependsOn: publishDockerImage) {
    onlyIf { publishDockerImage.version == "1.0.0" }
    doFirst {
        println "deploying DockerImage"
    }
}
```

`publishDockerImage`의 Extra Property인 `version`이 `"1.0.0"`일 때만 배포 태스크가 실행된다. 여기서 이전 글에서 배운 Groovy Truth가 활용될 수도 있다.

```groovy
// Groovy Truth 활용 — 환경 변수가 존재하면 실행
onlyIf { System.getenv('DEPLOY_KEY') }
```

### finalizedBy

`finalizedBy`는 특정 태스크가 완료된 후 반드시 실행되어야 하는 태스크를 지정한다. try-finally와 유사한 개념으로, **앞선 태스크가 실패하더라도** finalizedBy로 지정된 태스크는
실행된다.

```groovy
task cleanUp {
    doFirst {
        println "cleaning up..."
    }
}
 
deployingDockerImage.finalizedBy cleanUp
```

`deployingDockerImage`가 성공하든 실패하든, 완료 후 `cleanUp`이 반드시 실행된다. 리소스 정리, 임시 파일 삭제, 알림 전송 같은 후처리 작업에 적합하다.

### 태스크 순서 제어 정리

태스크 실행 순서를 제어하는 방법을 정리하면 다음과 같다.

| 방법               | 설명                                  | 선행 태스크 실패 시    |
|------------------|-------------------------------------|----------------|
| `dependsOn`      | 지정한 태스크를 먼저 실행한다                    | 후행 태스크 실행 안 됨  |
| `finalizedBy`    | 지정한 태스크를 나중에 반드시 실행한다               | 후행 태스크 **실행됨** |
| `mustRunAfter`   | 두 태스크가 모두 실행될 때 순서만 지정한다            | 의존 관계 아님       |
| `shouldRunAfter` | `mustRunAfter`와 유사하지만, 순환 참조 시 무시된다 | 의존 관계 아님       |

```groovy
// mustRunAfter 예시 — 순서만 지정, 의존 관계는 아님
task unitTest {
    doLast { println "Running unit tests" }
}
 
task integrationTest {
    mustRunAfter unitTest
    doLast { println "Running integration tests" }
}
 
// gradle unitTest integrationTest → unitTest가 먼저 실행
// gradle integrationTest → integrationTest만 실행 (unitTest는 실행 안 됨)
```

### 파일 작업 태스크

Project 객체의 `file()` 메서드를 태스크 안에서 활용하여 파일을 생성하거나 조작할 수 있다.

```groovy
task fileTask {
    doLast {
        def file = project.file('fileTaskSample.txt')
        file.text = 'Hello, Gradle!'
        println "Created file at ${file.absolutePath}"
    }
}
```

```
$ gradle fileTask
> Task :fileTask
Created file at /path/to/project/fileTaskSample.txt
```

파일 작업은 반드시 `doLast` 안에 넣어야 한다. Configuration Phase에서 파일을 생성하면 태스크를 실행하지 않아도 파일이 만들어지는 부작용이 발생한다.

### defaultTasks

`defaultTasks`를 설정하면 `gradle` 명령어를 태스크 이름 없이 실행했을 때 기본으로 실행할 태스크를 지정할 수 있다.

```groovy
defaultTasks "deployingDockerImage"
```

```
$ gradle
# gradle deployingDockerImage 와 동일하게 동작
```

### 전체 실습 코드의 실행 흐름

이번 실습 코드의 전체 실행 흐름을 정리해보자.

```groovy
task publishDockerImage {
    ext.version = "1.0.0"
    def customVariable = "abc"
    println "customVariable ${customVariable}"
    doFirst {
        println "publishing DockerImage"
    }
}
 
task deployingDockerImage(dependsOn: publishDockerImage) {
    onlyIf { publishDockerImage.version == "1.0.0" }
    doFirst {
        println "deploying DockerImage"
    }
}
 
task cleanUp {
    doFirst {
        println "cleaning up..."
    }
}
 
deployingDockerImage.finalizedBy cleanUp
defaultTasks "deployingDockerImage"
```

`gradle`을 실행하면 다음 순서로 동작한다.

```
[Configuration Phase]
customVariable abc        ← task 블록 내 println이 Configuration에서 실행
 
[Execution Phase]
> Task :publishDockerImage
publishing DockerImage    ← dependsOn에 의해 먼저 실행
 
> Task :deployingDockerImage
deploying DockerImage     ← onlyIf 조건 만족 → 실행
 
> Task :cleanUp
cleaning up...            ← finalizedBy에 의해 마지막에 실행
```

이 흐름에서 핵심은 다음과 같다.

1. `defaultTasks`에 의해 `deployingDockerImage`가 실행 대상이 된다.
2. `dependsOn`에 의해 `publishDockerImage`가 먼저 실행된다.
3. `onlyIf`에서 `publishDockerImage.version == "1.0.0"`을 확인하여 조건 충족 시 실행된다.
4. `finalizedBy`에 의해 `cleanUp`이 마지막에 반드시 실행된다.

### Task API 레퍼런스

Task 객체의 전체 API는 Gradle 공식 문서에서 확인할 수 있다.

- [Task DSL Reference](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)