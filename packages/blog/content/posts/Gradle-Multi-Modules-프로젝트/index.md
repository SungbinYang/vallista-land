---
title: "[Gradle] Multi 모듈 프로젝트 소개"
tags:
  - gradle
image: ./assets/banner.png
date: 2026-04-01 20:18:27
series: gradle
draft: false
---

![banner](./assets/banner.png)

## Multi 모듈 프로젝트 소개

### 멀티 모듈 프로젝트란?

지금까지 Gradle의 핵심 개념들을 하나씩 배워왔다. 이번에는 실무에서 가장 많이 사용되는 구조인 **멀티 모듈 프로젝트(Multi-Module Project)** 를 알아보자.

멀티 모듈 프로젝트는 **여러 개의 관련된 서브 프로젝트를 하나의 Gradle 빌드로 묶어서 관리하는 프로젝트 구조**이다. 대규모 프로젝트를 더 작고 논리적으로 분리된 모듈 또는 컴포넌트로 나눌 수 있어, 각
모듈이 서로 다른 기능을 담당하면서도 서로 의존하고, 하나의 프로젝트로서 빌드·테스트·관리될 수 있다.

### 멀티 모듈의 장점

| 장점                                 | 설명                                                                            |
|------------------------------------|-------------------------------------------------------------------------------|
| **모듈성 (Modularity)**               | 대규모 프로젝트를 특정 기능이나 역할에 집중하는 작은 모듈로 나눌 수 있다.                                    |
| **의존성 관리 (Dependency Management)** | 서브 프로젝트 간 의존 관계를 명시하면 Gradle이 빌드 순서를 자동으로 관리하고, 필요한 의존성이 컴파일되어 사용 가능하도록 보장한다. |
| **재사용성 (Reusability)**             | 모듈을 다른 프로젝트에서 재사용할 수 있다. 마이크로서비스나 공유 라이브러리 개발에 특히 유용하다.                       |
| **병렬 빌드 (Parallel Builds)**        | 서로 독립적인 모듈을 동시에 빌드하여 전체 빌드 시간을 단축할 수 있다.                                      |

### Root Project와 Subprojects

멀티 모듈 프로젝트는 **Root Project(루트 프로젝트)** 와 **Subprojects(서브 프로젝트)** 로 구성된다.

**Root Project**는 전체 빌드의 설정과 모듈 간 관계를 정의하는 메인 프로젝트이다. `settings.gradle` 파일을 포함하며, 여기에 모든 서브 프로젝트를 나열한다.

**Subprojects**는 루트 프로젝트 안에 정의된 개별 모듈이다. 각 서브 프로젝트는 자체 `build.gradle` 파일을 가지며, 독립적으로 빌드하거나 전체 빌드의 일부로 빌드할 수 있다.

### 프로젝트 구조

실습에서 만든 멀티 모듈 프로젝트의 구조는 다음과 같다.

```
multiSimpleProject/
├── settings.gradle          ← 루트: 서브 프로젝트 목록 정의
├── build.gradle             ← 루트: 전체 공통 설정
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/
├── gradlew
├── gradlew.bat
├── data/                    ← 서브 프로젝트 1
│   ├── build.gradle
│   └── src/
│       ├── main/java/org/example/App.java
│       └── test/java/org/example/AppTest.java
└── service/                 ← 서브 프로젝트 2
    ├── build.gradle
    └── src/
        ├── main/java/org/example/App.java
        └── test/java/org/example/AppTest.java
```

`data`와 `service`라는 두 개의 서브 프로젝트가 있고, 각각 독립적인 `build.gradle`과 `src` 디렉토리를 가지고 있다. 루트에도 `build.gradle`이 있어 전체 프로젝트에 적용할
공통 설정을 정의할 수 있다.

### settings.gradle

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.8.0'
}
 
rootProject.name = 'multiSimpleProject'
include('data')
include('service')
```

`settings.gradle`은 멀티 모듈 프로젝트의 **진입점**이다. Build Lifecycle의 Initialization Phase에서 이 파일이 가장 먼저 평가되어, 빌드에 참여할 프로젝트들이 결정된다.

`include('data')`와 `include('service')`로 두 서브 프로젝트를 등록한다. Gradle은 이 이름과 동일한 디렉토리를 찾아 각각의 `build.gradle`을 로드한다.

### 빌드 실행

루트 디렉토리에서 `gradle build`를 실행하면 **모든 서브 프로젝트가 함께 빌드된다.**

```bash
$ gradle build
```

Gradle은 서브 프로젝트 간 의존 관계를 분석하여 올바른 순서로 빌드한다. `data`와 `service`가 서로 의존하지 않는다면 병렬로 빌드될 수도 있다.

특정 서브 프로젝트만 빌드하고 싶다면 프로젝트 경로를 지정한다.

```bash
# data 모듈만 빌드
gradle :data:build
 
# service 모듈만 빌드
gradle :service:build
 
# data 모듈만 테스트
gradle :data:test
```

`:data:build`에서 `:`는 프로젝트 경로 구분자이다. 루트 프로젝트가 `:`, `data` 서브 프로젝트가 `:data`이다.

### 루트 build.gradle에서 공통 설정

루트 `build.gradle`에서 모든 서브 프로젝트에 적용할 공통 설정을 정의할 수 있다. 이전 글에서 배운 `allprojects`와 `subprojects`가 여기서 활용된다.

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
 
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(25)
        }
    }
 
    repositories {
        mavenCentral()
    }
 
    dependencies {
        testImplementation libs.junit.jupiter
        testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    }
 
    tasks.named('test') {
        useJUnitPlatform()
    }
}
```

이렇게 하면 `data/build.gradle`과 `service/build.gradle`에서 중복 설정을 제거하고, 각 모듈 고유의 설정만 작성하면 된다.

### 서브 프로젝트 간 의존 관계

멀티 모듈 프로젝트의 핵심은 **모듈 간 의존 관계**이다. 예를 들어 `service` 모듈이 `data` 모듈의 클래스를 사용해야 한다면, `service/build.gradle`에서 다음과 같이 선언한다.

```groovy
// service/build.gradle
dependencies {
    implementation project(':data')
}
```

`project(':data')`는 같은 빌드에 속한 `data` 서브 프로젝트를 의존성으로 참조하는 것이다. 이렇게 하면 `service`를 빌드할 때 Gradle이 자동으로 `data`를 먼저 빌드해준다.

```
빌드 순서: data → service
```

외부 라이브러리 의존성(`implementation 'com.google.guava:guava:33.5.0-jre'`)과 프로젝트 의존성(`implementation project(':data')`)을 함께 사용할
수 있다.

### 실무에서의 멀티 모듈 패턴

실무에서 자주 사용되는 멀티 모듈 구조 패턴을 살펴보자.

#### 레이어 기반 분리

```
my-application/
├── core/        ← 도메인 모델, 비즈니스 로직
├── api/         ← REST API, 컨트롤러
├── infra/       ← 외부 연동 (DB, 외부 API, 메시징)
└── batch/       ← 배치 작업
```

```groovy
// settings.gradle
rootProject.name = 'my-application'
include('core', 'api', 'infra', 'batch')
```

의존 관계는 안쪽(core)에서 바깥쪽(api, infra)으로 향한다.

```groovy
// api/build.gradle
dependencies {
    implementation project(':core')
    implementation project(':infra')
}
 
// infra/build.gradle
dependencies {
    implementation project(':core')
}
 
// batch/build.gradle
dependencies {
    implementation project(':core')
    implementation project(':infra')
}
```

`core`는 다른 모듈에 의존하지 않고, `api`와 `batch`가 `core`와 `infra`에 의존하는 구조이다. 이렇게 하면 도메인 로직(`core`)이 인프라 세부사항(`infra`)에 의존하지 않아 클린
아키텍처를 유지할 수 있다.

#### 의존 관계 시각화

```
core (의존 없음)
 ↑
infra (core에 의존)
 ↑
api (core, infra에 의존)
batch (core, infra에 의존)
```

### 멀티 모듈에서의 공통 설정 관리 방법

서브 프로젝트 수가 많아지면 공통 설정을 관리하는 방법이 중요해진다. 대표적인 방법 3가지를 비교해보자.

| 방법                    | 설명                                           | 적합한 경우                  |
|-----------------------|----------------------------------------------|-------------------------|
| `subprojects { }`     | 루트 `build.gradle`에서 모든 서브 프로젝트에 설정 적용        | 간단한 프로젝트, 서브 프로젝트가 적을 때 |
| Convention Plugin     | `buildSrc`에 공통 플러그인을 만들어 적용                  | 중규모 이상, 설정이 복잡할 때       |
| `allprojects` + 개별 설정 | 공통 부분은 `allprojects`, 나머지는 각 `build.gradle`에 | 모듈별 차이가 클 때             |

`subprojects { }`는 간단하지만, 모든 서브 프로젝트에 동일한 설정이 강제되는 단점이 있다. 프로젝트 규모가 커지면 **Convention Plugin** 방식이 더 유연하고 관리하기 좋다.

### 유용한 명령어

멀티 모듈 프로젝트에서 자주 사용하는 명령어를 정리하면 다음과 같다.

```bash
# 전체 빌드
gradle build
 
# 특정 모듈만 빌드
gradle :data:build
 
# 전체 클린 + 빌드
gradle clean build
 
# 특정 모듈만 테스트
gradle :service:test
 
# 프로젝트 구조 확인
gradle projects
 
# 특정 모듈의 의존성 트리
gradle :service:dependencies
```

`gradle projects`를 실행하면 전체 프로젝트 계층 구조를 확인할 수 있다.

```
$ gradle projects
 
Root project 'multiSimpleProject'
+--- Project ':data'
\--- Project ':service'
```

## Project script blocks에 대해 알아보자

### Project Script Block이란?

이전 글에서 멀티 모듈 프로젝트의 구조를 살펴보았다. 이번에는 루트 `build.gradle`에서 서브 프로젝트들을 구성하는 핵심 도구인 **Project Script Block**을 실습을 통해 자세히 알아보자.

Project Script Block은 루트 프로젝트의 `build.gradle`에서 특정 범위의 프로젝트들에 공통 설정을 적용하기 위한 블록이다. 대표적으로 `allprojects`, `subprojects`,
`project(":name")` 세 가지가 있다.

### 세 가지 Script Block의 범위

먼저 각 블록이 어떤 프로젝트에 적용되는지 `getProjectName` 태스크로 확인해보자.

#### 루트 프로젝트에만 적용

```groovy
task getProjectName {
    doLast {
        println project.name
    }
}
```

루트 `build.gradle` 최상위에 태스크를 등록하면 **루트 프로젝트에만** 적용된다.

```
$ gradle getProjectName
> Task :getProjectName
multiSimpleProject
```

#### allprojects — 루트 + 모든 서브 프로젝트

```groovy
allprojects {
    task getProjectName {
        doLast {
            println project.name
        }
    }
}
```

`allprojects` 블록 안의 코드는 **루트 프로젝트를 포함한 모든 프로젝트**에 적용된다.

```
$ gradle getProjectName
> Task :getProjectName
multiSimpleProject
 
> Task :data:getProjectName
data
 
> Task :service:getProjectName
service
```

루트(`multiSimpleProject`), `data`, `service` 세 프로젝트 모두에서 태스크가 실행된다.

#### subprojects — 서브 프로젝트만

```groovy
subprojects {
    task getProjectName {
        doLast {
            println project.name
        }
    }
}
```

`subprojects` 블록 안의 코드는 **서브 프로젝트에만** 적용되며, 루트 프로젝트에는 적용되지 않는다.

```
$ gradle getProjectName
> Task :data:getProjectName
data
 
> Task :service:getProjectName
service
```

루트 프로젝트는 제외되고 `data`와 `service`에서만 실행된다.

#### 범위 비교

| Script Block           | 루트 프로젝트 | 서브 프로젝트 | 용도                        |
|------------------------|:-------:|:-------:|---------------------------|
| 최상위 (블록 없음)            |    O    |    X    | 루트 프로젝트 전용 설정             |
| `allprojects { }`      |    O    |    O    | 그룹, 버전 등 전체 공통 설정         |
| `subprojects { }`      |    X    |    O    | 플러그인, 의존성 등 서브 프로젝트 공통 설정 |
| `project(':name') { }` |    X    |  특정 1개  | 개별 서브 프로젝트 설정             |

### 실습: subprojects로 공통 설정 적용

실제 빌드 스크립트에서 `subprojects`를 활용하여 모든 서브 프로젝트에 공통 설정을 적용해보자.

```groovy
subprojects {
    version = "1.0.0"
 
    apply plugin: 'application'
 
    repositories {
        mavenCentral()
    }
 
    dependencies {
        testImplementation libs.junit
        implementation libs.guava
    }
 
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }
 
    application {
        mainClass = 'org.example.App'
    }
}
```

이 설정으로 `data`와 `service` 두 서브 프로젝트 모두에 다음이 적용된다.

- 버전을 `1.0.0`으로 설정
- `application` 플러그인 적용
- Maven Central 리포지토리 사용
- JUnit과 Guava 의존성 추가
- Java 21 툴체인 설정
- 메인 클래스를 `org.example.App`으로 지정

이렇게 하면 `data/build.gradle`과 `service/build.gradle`에는 이 공통 설정을 반복할 필요가 없다. 각 서브 프로젝트의 `build.gradle`에는 해당 모듈 고유의 설정만 작성하면
된다.

### 실습: project()로 개별 설정 적용

특정 서브 프로젝트에만 적용할 설정은 `project(":name")` 블록을 사용한다.

```groovy
project(":service") {
    dependencies {
        implementation project(":data")
    }
}
```

`service` 모듈이 `data` 모듈에 의존하도록 설정한다. 이 설정은 `service`에만 적용되고 `data`에는 영향이 없다. `service`를 빌드하면 Gradle이 자동으로 `data`를 먼저
빌드해준다.

이 설정은 `service/build.gradle`에 직접 작성해도 동일하게 동작한다.

```groovy
// service/build.gradle — 위와 동일한 효과
dependencies {
    implementation project(":data")
}
```

어디에 작성하느냐는 팀의 컨벤션에 따라 다르지만, 루트 `build.gradle`에 모아두면 전체 프로젝트의 의존 관계를 한눈에 파악할 수 있다는 장점이 있다.

### 전체 build.gradle 분석

실습 코드의 전체 구조를 다시 보며, 각 블록의 역할을 정리해보자.

```groovy
// ① 루트 프로젝트 전용 태스크
task getProjectName {
    doLast {
        println project.name
    }
}
 
// ② 루트 + 모든 서브 프로젝트에 적용
allprojects {
    task getProjectName {
        doLast {
            println project.name
        }
    }
}
 
// ③ 서브 프로젝트에만 공통 적용
subprojects {
    version = "1.0.0"
    apply plugin: 'application'
    repositories { mavenCentral() }
    dependencies {
        testImplementation libs.junit
        implementation libs.guava
    }
    java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }
    application { mainClass = 'org.example.App' }
}
 
// ④ service 모듈에만 개별 적용
project(":service") {
    dependencies {
        implementation project(":data")
    }
}
```

실제로는 ①과 ②에서 동일한 이름의 태스크 `getProjectName`을 등록하고 있으므로, 루트 프로젝트에서는 충돌이 발생할 수 있다. 이 코드는 각 블록의 적용 범위를 학습하기 위한 예시이며, 실무에서는 동일한
이름의 태스크를 여러 블록에서 등록하지 않도록 주의해야 한다.

### Script Block 안의 `project` 참조

Script Block 안에서 `project`를 참조하면 **현재 평가 중인 프로젝트**를 가리킨다는 점이 중요하다.

```groovy
subprojects {
    // 여기서 project는 각 서브 프로젝트를 가리킴
    println "Configuring: ${project.name}"
}
```

```
Configuring: data
Configuring: service
```

`subprojects` 블록은 내부적으로 모든 서브 프로젝트를 순회하면서 클로저를 실행하며, 그때마다 `project`가 현재 순회 중인 서브 프로젝트를 가리킨다.

### 조건부 설정 적용

모든 서브 프로젝트에 동일한 설정을 적용하되, 특정 조건에 따라 분기해야 하는 경우도 있다.

```groovy
subprojects {
    apply plugin: 'java'
 
    // 프로젝트 이름에 따라 다른 설정 적용
    if (project.name == 'api' || project.name == 'service') {
        apply plugin: 'application'
        application {
            mainClass = 'org.example.App'
        }
    }
 
    // 특정 프로젝트 제외
    if (project.name != 'core') {
        dependencies {
            implementation project(':core')
        }
    }
}
```

하지만 이런 조건 분기가 많아지면 코드가 복잡해진다. 이 경우 Convention Plugin 방식을 고려하는 것이 좋다.

### allprojects vs subprojects 선택 기준

실무에서 어떤 블록을 사용해야 할지 판단하는 기준을 정리하면 다음과 같다.

| 설정 항목                 | 권장 블록              | 이유                      |
|-----------------------|--------------------|-------------------------|
| `group`, `version`    | `allprojects`      | 루트 프로젝트 포함 전체에 일관된 값 필요 |
| `repositories`        | `subprojects`      | 루트에는 보통 소스 코드가 없음       |
| 플러그인 (`apply plugin`) | `subprojects`      | 루트에 Java 플러그인은 불필요      |
| 공통 의존성                | `subprojects`      | 루트에는 의존성 불필요            |
| 모듈 간 의존 관계            | `project(':name')` | 특정 모듈에만 해당              |

일반적으로 `group`과 `version` 같은 메타데이터는 `allprojects`에, 플러그인과 의존성 같은 빌드 설정은 `subprojects`에 넣는다.

## 모듈 간의 Dependency에 대해 알아보자

### 모듈 간 의존성이란?

이전 글에서 Project Script Block으로 서브 프로젝트에 공통 설정을 적용하는 방법을 배웠다. 이번에는 멀티 모듈 프로젝트의 핵심인 **모듈 간 의존성(Inter-module Dependency)** 을
실습을 통해 알아보자.

멀티 모듈 프로젝트에서 각 모듈은 독립적인 기능을 담당하지만, 모듈 간에 서로의 코드를 사용해야 하는 경우가 있다. 예를 들어 `service` 모듈이 `data` 모듈의 클래스를 사용하려면, `service`가
`data`에 의존한다는 것을 Gradle에 알려줘야 한다.

### 모듈 간 의존성 선언

`service/build.gradle`에서 `data` 모듈에 대한 의존성을 선언한다.

```groovy
// service/build.gradle
plugins {
    id 'application'
}
 
repositories {
    mavenCentral()
}
 
dependencies {
    implementation project(":data")
}
```

`implementation project(":data")`가 핵심이다. 외부 라이브러리 의존성이 `'그룹:아티팩트:버전'` 형식인 것과 달리, 같은 빌드에 속한 서브 프로젝트를 참조할 때는
`project(":프로젝트명")` 형식을 사용한다.

이전 글에서는 루트 `build.gradle`의 `project(":service") { }` 블록에서 이 의존성을 선언했는데, 이번에는 `service/build.gradle`에 직접 작성했다. 두 방식 모두
동일하게 동작하며, 아래처럼 비교할 수 있다.

```groovy
// 방법 1: 루트 build.gradle에서 선언
project(":service") {
    dependencies {
        implementation project(":data")
    }
}
 
// 방법 2: service/build.gradle에서 직접 선언
dependencies {
    implementation project(":data")
}
```

### subprojects 공통 설정과의 관계

루트 `build.gradle`의 `subprojects` 블록을 다시 살펴보자.

```groovy
subprojects {
    version = "1.0.0"
 
    apply plugin: 'application'
 
    repositories {
        mavenCentral()
    }
 
    dependencies {
        testImplementation libs.junit
        implementation libs.guava
    }
 
    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }
 
    application {
        mainClass = 'org.example.App'
    }
}
```

`subprojects`에서 `application` 플러그인, 리포지토리, 공통 의존성(JUnit, Guava) 등을 이미 설정하고 있다. 따라서 `service/build.gradle`에는 이 공통 설정을
반복하지 않고, **모듈 고유의 설정인 `project(":data")` 의존성만** 작성하면 된다.

최종적으로 `service` 모듈에 적용되는 의존성은 다음과 같다.

```
service 모듈의 의존성
├── subprojects에서 적용된 공통 의존성
│   ├── testImplementation: junit
│   └── implementation: guava
└── service/build.gradle에서 추가된 의존성
    └── implementation: project(":data")
```

### 빌드 결과 확인

`gradle build`를 실행하면 Gradle이 모듈 간 의존 관계를 분석하여 올바른 순서로 빌드한다.

```bash
$ gradle build
```

`service`가 `data`에 의존하므로, Gradle은 반드시 `data`를 먼저 컴파일한 후 `service`를 컴파일한다. 빌드 출력에서 태스크 실행 순서를 확인해보면 이를 알 수 있다.

```
> Task :data:compileJava
> Task :data:processResources
> Task :data:classes
> Task :data:jar
> Task :service:compileJava        ← data가 먼저 빌드된 후 실행
> Task :service:processResources
> Task :service:classes
> Task :service:jar
...
```

`service`의 `compileJava`는 `data`의 `jar`가 완료된 후에야 실행되는 것을 확인할 수 있다. 이 순서는 Gradle이 의존 관계 그래프를 기반으로 자동으로 결정한다.

### 의존성 트리 확인

`dependencies` 태스크로 특정 모듈의 전체 의존성 트리를 확인할 수 있다.

```bash
# service 모듈의 의존성 트리 확인
$ gradle :service:dependencies
```

출력에서 `project :data`가 `implementation` 구성에 포함된 것을 확인할 수 있다.

```
implementation - Implementation dependencies for the 'main' feature.
+--- com.google.guava:guava:33.5.0-jre
\--- project :data
```

특정 구성만 보고 싶다면 `--configuration` 옵션을 사용한다.

```bash
# 컴파일 타임 의존성만 확인
$ gradle :service:dependencies --configuration compileClasspath
 
# 런타임 의존성만 확인
$ gradle :service:dependencies --configuration runtimeClasspath
```

`data` 모듈의 의존성도 확인해보자.

```bash
$ gradle :data:dependencies
```

`data`에는 `project(":service")` 같은 모듈 의존성이 없으므로, `subprojects`에서 적용된 공통 의존성만 표시된다.

```
implementation - Implementation dependencies for the 'main' feature.
\--- com.google.guava:guava:33.5.0-jre
```

### 의존성 방향과 순환 참조

모듈 간 의존성에서 주의할 점은 **순환 참조(Circular Dependency)** 이다. `service`가 `data`에 의존하면서 동시에 `data`가 `service`에 의존하면, Gradle은 빌드
순서를 결정할 수 없어 에러가 발생한다.

```groovy
// ❌ 순환 참조 — 빌드 실패
// service/build.gradle
dependencies {
    implementation project(":data")
}
 
// data/build.gradle
dependencies {
    implementation project(":service")  // 순환 참조!
}
```

이 문제를 해결하려면 공통으로 사용하는 코드를 별도의 모듈(예: `core` 또는 `common`)로 분리해야 한다.

```
// ✅ 순환 참조 해결
core (의존 없음)
 ↑
data (core에 의존)
 ↑
service (core, data에 의존)
```

### 의존성 구성에 따른 차이

모듈 간 의존성을 선언할 때도 외부 라이브러리와 마찬가지로 의존성 구성을 선택할 수 있다.

```groovy
dependencies {
    // service에서 data의 public API를 사용할 수 있음
    implementation project(":data")
 
    // 테스트 코드에서만 data를 사용
    testImplementation project(":data")
}
```

`implementation`으로 선언하면 `service`의 컴파일과 런타임 모두에서 `data`의 클래스를 사용할 수 있다. 만약 `data`의 코드가 테스트에서만 필요하다면 `testImplementation`
을 사용하면 된다.

`java-library` 플러그인을 사용하는 경우 `api`와 `implementation`의 차이도 중요하다.

```groovy
// data/build.gradle
plugins {
    id 'java-library'
}
 
dependencies {
    // api — data의 소비자(service)에게도 노출됨
    api 'org.apache.commons:commons-lang3:3.14.0'
 
    // implementation — data 내부에서만 사용, 소비자에게 노출 안 됨
    implementation 'com.google.code.gson:gson:2.10.1'
}
```

`data`가 `commons-lang3`를 `api`로 선언하면, `service`에서도 `commons-lang3`를 직접 사용할 수 있다. 반면 `gson`은 `implementation`이므로
`service`에서 직접 접근할 수 없다.

### 빌드 결과물 확인

빌드 후 각 모듈의 `build` 디렉토리를 확인하면, 모듈별로 독립적인 빌드 결과물이 생성된 것을 볼 수 있다.

```bash
# 각 모듈의 JAR 파일 확인
$ ls data/build/libs/
data.jar
 
$ ls service/build/libs/
service.jar
```

`service.jar`의 클래스패스에 `data.jar`가 포함되어 있어, `service`에서 `data`의 클래스를 사용할 수 있다.

## Java Applications with libraries(ft. Convention Plugins)에 대해 알아보자

### Convention Plugins란?

이전 글들에서 `subprojects` 블록으로 공통 설정을 적용하는 방법을 배웠다. 하지만 프로젝트가 커지고 모듈마다 적용해야 할 설정이 달라지면 `subprojects` 안에 조건 분기가 늘어나 관리가
어려워진다. 이 문제를 해결하는 것이 **Convention Plugins(컨벤션 플러그인)** 이다.

Convention Plugins는 여러 프로젝트나 서브 프로젝트에 걸쳐 **빌드 설정을 캡슐화하고 표준화하기 위한 경량 플러그인**이다. 공통 설정, 의존성, 태스크를 한 곳에 정의하고 빌드의 여러 부분에 일관되게
적용할 수 있다.

### 왜 Convention Plugins를 사용하는가?

| 이점                          | 설명                                                             |
|-----------------------------|----------------------------------------------------------------|
| **DRY 원칙**                  | 서브 프로젝트 간 반복되는 설정을 하나의 플러그인으로 중앙화하여 중복을 제거한다.                  |
| **일관성 (Consistency)**       | 모든 서브 프로젝트가 동일한 의존성 버전, 코드 스타일, 테스트 프레임워크를 사용하도록 보장한다.         |
| **유지보수성 (Maintainability)** | 설정 변경이 필요하면 Convention Plugin만 수정하면 되고, 모든 서브 프로젝트에 자동으로 반영된다. |
| **모듈성 (Modularity)**        | 빌드 로직을 재사용 가능한 모듈 단위로 분리하여 관리할 수 있다.                           |

### Convention Plugins의 동작 방식

Convention Plugins는 보통 프로젝트 루트의 **`buildSrc`** 디렉토리에 정의한다. Gradle은 `buildSrc` 디렉토리를 감지하면 그 안의 플러그인과 클래스를 **자동으로 컴파일하여 메인
빌드 스크립트에서 사용할 수 있게** 해준다. 별도의 설정이나 배포 없이도 바로 사용 가능하다.

```
buildSrc/
├── build.gradle
├── settings.gradle
└── src/
    └── main/
        └── groovy/
            ├── buildlogic.java-common-conventions.gradle
            ├── buildlogic.java-library-conventions.gradle
            └── buildlogic.java-application-conventions.gradle
```

`src/main/groovy/` 하위에 `.gradle` 확장자로 작성된 파일들이 바로 Convention Plugin이다. 파일명이 곧 플러그인 ID가 되어, 서브 프로젝트의 `build.gradle`에서
`id '파일명'`으로 적용할 수 있다.

### 실습 프로젝트 구조

이번 실습은 `gradle init`으로 생성한 "Java Applications with libraries" 프로젝트이다. 3개의 서브 프로젝트와 `buildSrc`로 구성되어 있다.

```
.
├── buildSrc/                  ← Convention Plugins 정의
├── app/                       ← Application 모듈 (실행 가능)
├── list/                      ← Library 모듈
├── utilities/                 ← Library 모듈
├── gradle/
│   └── libs.versions.toml
└── settings.gradle
```

각 모듈의 역할은 다음과 같다.

| 모듈          | 타입          | 역할                         |
|-------------|-------------|----------------------------|
| `app`       | Application | 메인 애플리케이션. `utilities`에 의존 |
| `utilities` | Library     | 유틸리티 클래스 제공. `list`에 의존    |
| `list`      | Library     | LinkedList 구현              |
| `buildSrc`  | 빌드 로직       | Convention Plugins 정의      |

### buildSrc 살펴보기

#### buildSrc/build.gradle

```groovy
plugins {
    id 'groovy-gradle-plugin'
}
 
repositories {
    gradlePluginPortal()
}
```

`groovy-gradle-plugin`을 적용하면 `src/main/groovy/` 하위의 `.gradle` 파일들이 자동으로 Convention Plugin으로 인식된다. `gradlePluginPortal()`
은 Convention Plugin 내부에서 커뮤니티 플러그인을 사용할 수 있게 해준다.

### Convention Plugins 계층 구조

이 프로젝트의 Convention Plugins는 **계층 구조**로 설계되어 있다.

```
buildlogic.java-common-conventions
        ↑                    ↑
        │                    │
buildlogic.java-library-conventions   buildlogic.java-application-conventions
        ↑                                        ↑
        │                                        │
   list, utilities                              app
```

공통 설정을 `java-common-conventions`에 정의하고, Library용과 Application용 플러그인이 이를 각각 상속하는 구조이다. 서브 프로젝트는 자신의 타입에 맞는 플러그인만 적용하면 된다.

### java-common-conventions (공통 설정)

```groovy
// buildlogic.java-common-conventions.gradle
 
plugins {
    id 'java'
    id 'jacoco'
}
 
repositories {
    mavenCentral()
}
 
dependencies {
    constraints {
        implementation 'org.apache.commons:commons-text:1.12.0'
    }
 
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.3'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
 
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
 
tasks.named('test') {
    useJUnitPlatform()
}
 
test {
    finalizedBy jacocoTestReport
}
 
jacocoTestReport {
    dependsOn test
}
```

이 플러그인에 모든 서브 프로젝트가 공유하는 설정이 집중되어 있다.

- `java`와 `jacoco` 플러그인 적용
- Maven Central 리포지토리
- 공통 의존성 (JUnit Jupiter)
- Java 21 툴체인
- 테스트 실행 후 JaCoCo 리포트 자동 생성

여기서 주목할 점은 **`constraints`** 블록이다.

```groovy
dependencies {
    constraints {
        implementation 'org.apache.commons:commons-text:1.12.0'
    }
}
```

`constraints`는 의존성 자체를 추가하지는 않고, **해당 의존성이 어딘가에서 사용될 때 적용할 버전만 지정**한다. `commons-text`를 실제로 사용하는 모듈(`app`)에서 버전 없이 의존성을
선언하면 이 constraint의 버전이 적용된다. 멀티 모듈에서 버전을 한 곳에서 관리하는 패턴이다.

### java-library-conventions (라이브러리용)

```groovy
// buildlogic.java-library-conventions.gradle
 
plugins {
    id 'buildlogic.java-common-conventions'
    id 'java-library'
}
```

`java-common-conventions`를 먼저 적용한 뒤, 추가로 `java-library` 플러그인을 적용한다. `java-library`는 `api`와 `implementation`의 구분을 가능하게
해주는 플러그인이다. Library 타입의 모듈(`list`, `utilities`)에 사용된다.

### java-application-conventions (애플리케이션용)

```groovy
// buildlogic.java-application-conventions.gradle
 
plugins {
    id 'buildlogic.java-common-conventions'
    id 'application'
}
```

마찬가지로 `java-common-conventions`를 적용한 뒤, `application` 플러그인을 추가한다. `application`은 `run`, `installDist` 등 실행/배포 관련 태스크를
제공한다. Application 타입의 모듈(`app`)에 사용된다.

### 서브 프로젝트의 build.gradle

Convention Plugins 덕분에 각 서브 프로젝트의 `build.gradle`이 매우 간결해진다.

#### app/build.gradle

```groovy
plugins {
    id 'buildlogic.java-application-conventions'
}
 
dependencies {
    implementation 'org.apache.commons:commons-text'
    implementation project(':utilities')
}
 
application {
    mainClass = 'org.example.app.App'
}
```

`commons-text`의 버전이 없다는 점에 주목하자. `java-common-conventions`의 `constraints`에서 `1.12.0`으로 지정했으므로 여기서는 버전을 생략할 수 있다.

#### list/build.gradle, utilities/build.gradle

```groovy
// list/build.gradle
plugins {
    id 'buildlogic.java-library-conventions'
}
```

```groovy
// utilities/build.gradle
plugins {
    id 'buildlogic.java-library-conventions'
}
 
dependencies {
    api project(':list')
}
```

`list`는 외부 의존성이 없어서 플러그인 적용만으로 충분하다. `utilities`는 `list`에 의존하며, `api`로 선언하여 `utilities`를 사용하는 `app`에서도 `list`의 클래스에 접근할
수 있도록 한다.

### subprojects 방식과의 비교

이전 글에서 사용한 `subprojects` 방식과 Convention Plugins 방식을 비교해보자.

#### subprojects 방식

```groovy
// 루트 build.gradle
subprojects {
    apply plugin: 'java'
 
    if (project.name == 'app') {
        apply plugin: 'application'
    } else {
        apply plugin: 'java-library'
    }
 
    repositories { mavenCentral() }
    // ... 공통 설정
}
```

모듈이 늘어나고 타입이 다양해질수록 조건 분기가 복잡해진다.

#### Convention Plugins 방식

```groovy
// app/build.gradle
plugins { id 'buildlogic.java-application-conventions' }
 
// list/build.gradle
plugins { id 'buildlogic.java-library-conventions' }
```

각 모듈이 자신의 타입에 맞는 플러그인을 선택적으로 적용한다. 루트 `build.gradle`에 조건 분기가 없다.

| 항목     | `subprojects` 방식    | Convention Plugins 방식 |
|--------|---------------------|-----------------------|
| 설정 위치  | 루트 `build.gradle`   | `buildSrc/`           |
| 조건 분기  | 모듈 타입별 `if-else` 필요 | 플러그인을 선택적으로 적용        |
| 재사용성   | 해당 프로젝트에서만 사용       | 다른 프로젝트에도 재사용 가능      |
| 가독성    | 모듈이 많아지면 복잡         | 각 `build.gradle`이 간결  |
| 유지보수   | 루트에 로직 집중           | 역할별로 플러그인 분리          |
| 적합한 규모 | 소규모 (모듈 2~3개)       | 중규모 이상                |

### JaCoCo 테스트 커버리지

`java-common-conventions`에 JaCoCo 관련 설정이 포함되어 있다.

```groovy
plugins {
    id 'jacoco'
}
 
test {
    finalizedBy jacocoTestReport
}
 
jacocoTestReport {
    dependsOn test
}
```

이 설정으로 모든 서브 프로젝트에서 `gradle test`를 실행하면 테스트 완료 후 자동으로 JaCoCo 커버리지 리포트가 생성된다. `finalizedBy`와 `dependsOn`을 조합하여 test →
jacocoTestReport 순서를 보장한다.

이전 Task 글에서 배운 `finalizedBy`가 여기서 실전으로 활용되는 것이다. 테스트가 실패하더라도 `finalizedBy`이므로 리포트는 반드시 생성된다.

### 전체 의존 관계

프로젝트의 전체 모듈 간 의존 관계를 정리하면 다음과 같다.

```
[Convention Plugins 계층]
java-common-conventions
    ↑              ↑
java-library    java-application
conventions     conventions
 
[모듈 간 의존 관계]
list (의존 없음)
  ↑
utilities (list에 의존, api로 노출)
  ↑
app (utilities에 의존, commons-text 사용)
```

`app`에서 `list`의 클래스를 직접 사용할 수 있는 이유는, `utilities`가 `list`를 `api`로 선언했기 때문이다. 이것이 `api` vs `implementation` 선택이 중요한 실질적인
사례이다.

## Application과 Library의 차이점에 대해 알아보자(ft. Producer vs. Consumer)

### Producer와 Consumer

이전 글에서 Convention Plugins를 활용한 멀티 모듈 프로젝트를 살펴보았다. 이번에는 Gradle 의존성 관리의 핵심 개념인 **Producer(생산자)와 Consumer(소비자)** 를 알아보자. 이
개념을 이해하면 `api`와 `implementation`의 차이, 전이 의존성, 의존성 제외 등을 명확하게 이해할 수 있다.

### Producer와 Consumer란?

Gradle의 의존성 관리에서 **Producer**는 다른 프로젝트가 사용할 아티팩트(JAR, 클래스 등)를 생성하는 쪽이고, **Consumer**는 이 아티팩트를 사용하는 쪽이다. 기존 빌드 시스템과 달리
Gradle은 이 둘을 명확히 구분한다.

이전 실습의 프로젝트로 예를 들면 다음과 같다.

```
list (Producer) → utilities (Consumer이자 Producer) → app (Consumer)
```

`list`는 `utilities`에게 아티팩트를 제공하는 Producer이고, `utilities`는 `list`의 아티팩트를 사용하는 Consumer이면서 동시에 `app`에게 아티팩트를 제공하는
Producer이기도 하다. `app`은 소비 체인의 끝에 있는 최종 Consumer이다.

#### Consumer Types

Consumer가 될 수 있는 것은 두 가지이다.

- 다른 프로젝트에 의존하는 **프로젝트** — `implementation project(':list')`
- 아티팩트에 의존하는 **태스크** — 컴파일 태스크가 의존성의 JAR 파일을 필요로 할 때

#### Producer Variants

Producer는 소비자에 따라 **서로 다른 아티팩트(Variant)** 를 제공할 수 있다. 예를 들어 Guava 라이브러리는 Java용(`guava:33.5.0-jre`)과 Android용(
`guava:33.5.0-android`) 두 가지 Variant을 제공한다. Gradle은 Variant 모델을 사용하여 Consumer에 적합한 버전을 자동으로 선택한다.

### api vs implementation

Producer가 의존성을 선언할 때 `api`와 `implementation` 중 어떤 것을 선택하느냐에 따라, 그 의존성이 **Consumer에게 노출되는지 여부**가 결정된다. 이것이
Producer-Consumer 관계에서 가장 실무적으로 중요한 부분이다.

#### api — Consumer에게 노출

```groovy
// utilities/build.gradle
dependencies {
    api project(':list')
}
```

`utilities`가 `list`를 `api`로 선언하면, `utilities`를 사용하는 `app`에서도 `list`의 클래스에 **직접 접근할 수 있다.**

```java
// app/App.java — list의 LinkedList를 직접 사용 가능
import org.example.list.LinkedList;
 
LinkedList list = new LinkedList();
```

#### implementation — Consumer에게 숨김

```groovy
dependencies {
    implementation 'org.apache.commons:commons-lang3:3.12.0'
}
```

`implementation`으로 선언한 의존성은 해당 모듈 내부에서만 사용되고, Consumer에게는 노출되지 않는다.

#### 핵심 차이 비교

| 항목            | `api`                       | `implementation`     |
|---------------|-----------------------------|----------------------|
| Consumer에게 노출 | O — Consumer의 컴파일 클래스패스에 포함 | X — Consumer에게 숨겨짐   |
| 빌드 성능         | 의존성 변경 시 Consumer도 재컴파일     | 의존성 변경 시 해당 모듈만 재컴파일 |
| 사용 조건         | `java-library` 플러그인 필요      | 모든 프로젝트에서 사용 가능      |
| 적합한 경우        | public API에서 사용되는 의존성       | 내부 구현에서만 사용되는 의존성    |

#### 빌드 성능에 미치는 영향

`api`로 선언한 의존성이 변경되면, 해당 모듈뿐 아니라 **Consumer 모듈도 재컴파일**된다. 반면 `implementation`으로 선언하면 해당 모듈만 재컴파일되므로 빌드가 빨라진다.

```
api로 선언한 경우:
list 변경 → utilities 재컴파일 → app 재컴파일
 
implementation으로 선언한 경우:
내부 의존성 변경 → utilities만 재컴파일 (app은 영향 없음)
```

따라서 **가능한 한 `implementation`을 사용하고, Consumer가 직접 접근해야 하는 경우에만 `api`를 사용**하는 것이 빌드 성능 최적화의 핵심 원칙이다.

### 전이 의존성 (Transitive Dependencies)

의존성을 추가하면 그 의존성이 가져오는 의존성들도 함께 따라오는데, 이를 **전이 의존성(Transitive Dependency)** 이라고 한다.

```
app → utilities → list
app → commons-text → commons-lang3
```

`app`이 `commons-text`에 의존하면, `commons-text`가 내부적으로 사용하는 `commons-lang3`도 자동으로 `app`의 클래스패스에 포함된다. 이것이 전이 의존성이다.

전이 의존성은 편리하지만, 의도하지 않은 의존성이 포함되거나 **버전 충돌**이 발생할 수 있다. 이때 의존성 제외(exclude)가 필요하다.

### 의존성 제외 (Exclude)

특정 전이 의존성을 제외하려면 `exclude`를 사용한다.

```groovy
dependencies {
    implementation('commons-beanutils:commons-beanutils:1.9.4') {
        exclude group: 'commons-collections', module: 'commons-collections'
    }
}
```

`commons-beanutils`가 전이적으로 가져오는 `commons-collections`를 제외한다. 예를 들어 더 높은 버전의 `commons-collections4`를 직접 사용하고 싶을 때 이렇게 할 수
있다.

#### Application vs Library에서의 제외

의존성 제외는 프로젝트 타입에 따라 영향이 다르다.

- **Application** 프로젝트는 소비 체인의 끝에 있으므로, 제외가 **비교적 안전**하다. 이 프로젝트의 결과물을 다른 프로젝트가 의존하지 않기 때문이다.
- **Library** 프로젝트에서의 제외는 **주의가 필요**하다. 이 라이브러리를 사용하는 Consumer가 제외된 의존성을 필요로 할 수 있기 때문이다.

```groovy
// ✅ Application에서의 제외 — 비교적 안전
// app/build.gradle
dependencies {
    implementation('some-library:1.0.0') {
        exclude group: 'unwanted-transitive'
    }
}
 
// ⚠️ Library에서의 제외 — Consumer에 영향을 줄 수 있음
// utilities/build.gradle
dependencies {
    api('some-library:1.0.0') {
        exclude group: 'unwanted-transitive'  // Consumer도 이 제외의 영향을 받음
    }
}
```

### 실습 프로젝트에서의 Producer-Consumer 관계

이전 글의 Convention Plugins 프로젝트에서 Producer-Consumer 관계를 다시 정리해보자.

```groovy
// utilities/build.gradle
plugins {
    id 'buildlogic.java-library-conventions'
}
 
dependencies {
    api project(':list')
}
```

```groovy
// app/build.gradle
plugins {
    id 'buildlogic.java-application-conventions'
}
 
dependencies {
    implementation 'org.apache.commons:commons-text'
    implementation project(':utilities')
}
```

이 관계를 Producer-Consumer 관점에서 분석하면 다음과 같다.

```
list ──(api)──→ utilities ──(implementation)──→ app
```

| 관계                 | 구성               | app에서의 접근                              |
|--------------------|------------------|----------------------------------------|
| utilities → list   | `api`            | app에서 `list`의 클래스에 직접 접근 **가능**        |
| app → utilities    | `implementation` | app 내부에서만 사용 (더 이상의 Consumer가 없으므로 무관) |
| app → commons-text | `implementation` | app 내부에서만 사용                           |

`utilities`가 `list`를 `api`로 선언한 이유는, `utilities`의 public API(예: 메서드 시그니처, 반환 타입)에서 `list`의 `LinkedList` 타입이 노출되기 때문이다.
Consumer인 `app`이 `utilities`의 메서드를 호출할 때 `LinkedList`를 다뤄야 하므로 `api`가 적합하다.

반면 `app`은 최종 Consumer(Application)이므로 `implementation`을 사용한다. `app`의 결과물을 다른 모듈이 의존하지 않으므로 `api`/`implementation` 구분이
실질적인 차이를 만들지 않지만, 관례상 `implementation`을 사용한다.

### api vs implementation 선택 가이드

실무에서 어떤 것을 선택해야 할지 판단하는 간단한 기준은 다음과 같다.

**해당 의존성의 타입이 내 모듈의 public API(메서드 시그니처, 반환 타입, 상속 등)에 등장하는가?**

- **등장한다** → `api`
- **등장하지 않는다** → `implementation`

```java
// 이 메서드의 반환 타입이 LinkedList (list 모듈) → api로 선언
public LinkedList getItems() { ... }
 
// 내부에서만 Gson을 사용하고 외부에 노출하지 않음 → implementation
public String toJson(Object obj) {
    return new Gson().toJson(obj);  // Gson은 내부 구현
}
```

확신이 없다면 **`implementation`으로 시작**하고, Consumer에서 컴파일 에러가 발생하면 `api`로 변경하는 것이 안전한 접근이다.

## Java Applications with libraries 구조에 대해 알아보자

### Java Applications with Libraries

지금까지 Convention Plugins, Producer-Consumer 관계, `api` vs `implementation`을 배웠다. 이번에는 이 모든 개념이 실제 코드에서 어떻게 동작하는지,
`gradle init`으로 생성한 **Java Applications with Libraries** 프로젝트의 전체 구조를 코드 레벨에서 분석해보자.

### 프로젝트 전체 구조

```
.
├── buildSrc/                          ← Convention Plugins
│   └── src/main/groovy/
│       ├── buildlogic.java-common-conventions.gradle
│       ├── buildlogic.java-library-conventions.gradle
│       └── buildlogic.java-application-conventions.gradle
├── app/                               ← Application 모듈
│   ├── build.gradle
│   └── src/main/java/org/example/app/
│       ├── App.java
│       └── MessageUtils.java
├── list/                              ← Library 모듈
│   ├── build.gradle
│   └── src/main/java/org/example/list/
│       └── LinkedList.java
├── utilities/                         ← Library 모듈
│   ├── build.gradle
│   └── src/main/java/org/example/utilities/
│       ├── JoinUtils.java
│       ├── SplitUtils.java
│       └── StringUtils.java
└── settings.gradle
```

3개의 서브 프로젝트가 각각 다른 역할을 담당하며, 의존 관계를 통해 하나의 애플리케이션으로 동작한다.

### 모듈 간 의존 관계

```
list (의존 없음)
  ↑ api
utilities (list에 의존)
  ↑ implementation
app (utilities에 의존, commons-text에 의존)
```

이 의존 관계에서 핵심은 `utilities`가 `list`를 `api`로 선언했다는 점이다. 덕분에 `app`에서 `list`의 `LinkedList` 클래스를 직접 사용할 수 있다.

### list 모듈 — 자료구조 제공

#### list/build.gradle

```groovy
plugins {
    id 'buildlogic.java-library-conventions'
}
```

외부 의존성이 없고, Convention Plugin 적용만으로 충분하다. `java-library-conventions`는 내부적으로 `java-common-conventions`와 `java-library`
플러그인을 포함한다.

#### LinkedList.java

```java
package org.example.list;
 
public class LinkedList {
    private Node head;
 
    public void add(String element) {
        Node newNode = new Node(element);
        Node it = tail(head);
        if (it == null) {
            head = newNode;
        } else {
            it.next = newNode;
        }
    }
 
    public boolean remove(String element) {
        boolean result = false;
        Node previousIt = null;
        Node it = null;
        for (it = head; !result && it != null; previousIt = it, it = it.next) {
            if (0 == element.compareTo(it.data)) {
                result = true;
                unlink(previousIt, it);
                break;
            }
        }
        return result;
    }
 
    public int size() {
        int size = 0;
        for (Node it = head; it != null; ++size, it = it.next) {}
        return size;
    }
 
    public String get(int index) {
        Node it = head;
        while (index > 0 && it != null) {
            it = it.next;
            index--;
        }
        if (it == null) {
            throw new IndexOutOfBoundsException("Index is out of range");
        }
        return it.data;
    }
 
    // ... tail(), unlink(), Node 내부 클래스 생략
}
```

`java.util.LinkedList`가 아닌 직접 구현한 LinkedList이다. `add`, `remove`, `size`, `get` 등의 public API를 제공하며, 이 타입이 `utilities`
모듈의 public API에 노출된다.

### utilities 모듈 — 문자열 유틸리티

#### utilities/build.gradle

```groovy
plugins {
    id 'buildlogic.java-library-conventions'
}
 
dependencies {
    api project(':list')
}
```

`list`를 **`api`** 로 선언한다. 왜 `implementation`이 아니라 `api`인지는 코드를 보면 명확해진다.

#### JoinUtils.java

```java
package org.example.utilities;
 
import org.example.list.LinkedList;
 
class JoinUtils {
    public static String join(LinkedList source) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < source.size(); ++i) {
            if (result.length() > 0) {
                result.append(" ");
            }
            result.append(source.get(i));
        }
        return result.toString();
    }
}
```

`join` 메서드의 파라미터 타입이 `LinkedList`이다. 이 `LinkedList`는 `list` 모듈의 클래스이다. `utilities`의 public API에서 `list`의 타입이 직접 사용되고
있으므로, `api`로 선언하는 것이 올바르다. 만약 `implementation`으로 선언했다면, `app`에서 `LinkedList` 타입을 사용할 수 없어 컴파일 에러가 발생한다.

이것이 바로 이전 글에서 배운 **"의존성 타입이 public API에 등장하면 `api`, 아니면 `implementation`"** 원칙의 실전 사례이다.

### app 모듈 — 메인 애플리케이션

#### app/build.gradle

```groovy
plugins {
    id 'buildlogic.java-application-conventions'
}
 
dependencies {
    implementation 'org.apache.commons:commons-text'
    implementation project(':utilities')
}
 
application {
    mainClass = 'org.example.app.App'
}
```

`utilities`를 `implementation`으로, `commons-text`도 `implementation`으로 선언한다. `app`은 최종 Consumer(Application)이므로 `api`와
`implementation` 구분이 실질적인 차이를 만들지 않지만, 관례상 `implementation`을 사용한다.

`commons-text`에 버전이 없는 이유는 `java-common-conventions`의 `constraints`에서 `1.12.0`으로 지정했기 때문이다.

#### App.java

```java
package org.example.app;
 
import org.example.list.LinkedList;
 
import static org.example.utilities.StringUtils.join;
import static org.example.utilities.StringUtils.split;
import static org.example.app.MessageUtils.getMessage;
 
import org.apache.commons.text.WordUtils;
 
public class App {
    public static void main(String[] args) {
        LinkedList tokens;
        tokens = split(getMessage());
        String result = join(tokens);
        System.out.println(WordUtils.capitalize(result));
    }
}
```

import 구문을 보면 이 프로젝트의 의존 관계가 코드 레벨에서 어떻게 동작하는지 명확하게 보인다.

| import                              | 출처 모듈       | 접근 가능한 이유                                  |
|-------------------------------------|-------------|--------------------------------------------|
| `org.example.list.LinkedList`       | `list`      | `utilities`가 `list`를 `api`로 선언 → `app`에 노출 |
| `org.example.utilities.StringUtils` | `utilities` | `app`이 `utilities`를 직접 의존                  |
| `org.example.app.MessageUtils`      | `app` 자체    | 같은 모듈 내부 클래스                               |
| `org.apache.commons.text.WordUtils` | 외부 라이브러리    | `app`이 `commons-text`를 직접 의존               |

`app`에서 `LinkedList`를 직접 import할 수 있는 것은 `utilities → list`가 `api`로 연결되어 있기 때문이다. 이 한 줄의 import가 `api`와 `implementation`
의 차이를 실증한다.

### 의존성 트리로 확인하기

`gradle dependencies` 명령어로 각 모듈의 의존성을 확인해보자.

#### utilities 모듈의 api vs compileClasspath

```bash
$ gradle :utilities:dependencies --configuration api
```

```
api - API dependencies for the 'main' feature.
\--- project :list
```

`api` 구성에는 `list` 프로젝트만 포함된다. 이 의존성은 `utilities`를 사용하는 Consumer의 컴파일 클래스패스에도 노출된다.

```bash
$ gradle :utilities:dependencies --configuration compileClasspath
```

```
compileClasspath - Compile classpath for the 'main' feature.
+--- project :list
\--- com.google.guava:guava:33.5.0-jre (공통 의존성에서 포함된 경우)
```

`compileClasspath`는 `api`에 선언된 의존성과 `implementation`에 선언된 의존성이 모두 합쳐진 것이다. `utilities` 자체를 컴파일할 때 사용되는 전체 클래스패스이다.

#### app 모듈의 의존성

```bash
$ gradle :app:dependencies --configuration compileClasspath
```

```
compileClasspath - Compile classpath for the 'main' feature.
+--- org.apache.commons:commons-text:1.12.0
│    \--- org.apache.commons:commons-lang3:3.14.0
+--- project :utilities
│    \--- project :list      ← api로 선언되었으므로 app의 compileClasspath에 포함
\--- com.google.guava:guava:33.5.0-jre
```

`app`의 `compileClasspath`에 `project :list`가 포함되어 있다. `utilities`가 `list`를 `api`로 선언했기 때문이다. 또한 `commons-text`의 전이 의존성인
`commons-lang3`도 자동으로 포함된 것을 볼 수 있다.

만약 `utilities`가 `list`를 `implementation`으로 선언했다면, `app`의 `compileClasspath`에 `list`가 포함되지 않아
`import org.example.list.LinkedList`에서 컴파일 에러가 발생한다.

### 코드 실행 흐름

`gradle :app:run`을 실행하면 다음 순서로 동작한다.

```
1. MessageUtils.getMessage()
   → "hello world" 반환
 
2. StringUtils.split("hello world")
   → LinkedList ["hello", "world"] 반환
 
3. StringUtils.join(tokens)
   → JoinUtils.join() 호출 → "hello world" 반환
 
4. WordUtils.capitalize("hello world")
   → "Hello World" 반환
 
5. System.out.println("Hello World")
```

이 흐름에서 `split`과 `join`이 `list` 모듈의 `LinkedList`를 매개체로 데이터를 주고받는다. 세 모듈이 각자의 역할에 집중하면서 유기적으로 동작하는 것이다.

### 전체 아키텍처 정리

이 프로젝트의 모든 구성 요소를 하나로 정리하면 다음과 같다.

```
[Convention Plugins 계층]
java-common-conventions (java, jacoco, JUnit, Java 21)
    ↑                    ↑
java-library-conventions   java-application-conventions
(+ java-library)           (+ application)
    ↑                              ↑
list, utilities                   app
 
[모듈 간 의존 관계]
list ──(api)──→ utilities ──(impl)──→ app
                                      ↓
                              commons-text (impl)
 
[코드 흐름]
App.java → StringUtils → JoinUtils/SplitUtils → LinkedList
         → WordUtils (commons-text)
         → MessageUtils (app 내부)
```

## Unit Test와 Test Coverage 설정해 보기

### Unit Test와 Test Coverage 설정해보기

이전 글에서 Java Applications with Libraries 프로젝트의 전체 구조를 분석했다. 이번에는 이 프로젝트에서 **Unit Test를 실행하고 JaCoCo로 테스트 커버리지를 측정하는 방법**을
살펴보자.

### 테스트 관련 설정

Convention Plugins 실습에서 `java-common-conventions`에 테스트 관련 설정이 이미 포함되어 있었다. 다시 한번 살펴보자.

```groovy
// buildlogic.java-common-conventions.gradle
 
plugins {
    id 'java'
    id 'jacoco'
}
 
dependencies {
    // JUnit Jupiter로 테스트
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.3'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
 
tasks.named('test') {
    useJUnitPlatform()
}
 
test {
    finalizedBy jacocoTestReport
}
 
jacocoTestReport {
    dependsOn test
}
```

이 설정에서 핵심은 세 가지이다.

첫째, **JUnit Jupiter**를 테스트 프레임워크로 사용한다. `testImplementation`으로 JUnit 5를 추가하고, `useJUnitPlatform()`으로 JUnit Platform을 테스트
실행 엔진으로 지정한다.

둘째, **JaCoCo** 플러그인으로 테스트 커버리지를 측정한다. JaCoCo(Java Code Coverage)는 Java 코드의 테스트 커버리지를 측정하는 도구로, 어떤 코드가 테스트에 의해 실행되었는지를
분석해준다.

셋째, `test`와 `jacocoTestReport`의 **실행 순서를 보장**한다. `finalizedBy`로 테스트 완료 후 리포트가 반드시 생성되도록 하고, `dependsOn`으로 리포트 생성 전 테스트가
반드시 실행되도록 한다. 이전 Task 글에서 배운 `finalizedBy`와 `dependsOn`의 조합이 여기서 실전 활용된다.

```
test ←(dependsOn)← jacocoTestReport
test ─(finalizedBy)→ jacocoTestReport
```

### 테스트 코드 작성

`app` 모듈의 테스트 코드를 살펴보자.

```java
package org.example.app;
 
import org.junit.jupiter.api.Test;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
 
class MessageUtilsTest {
    @Test
    void testGetMessage() {
        assertEquals("Hello      World!", MessageUtils.getMessage());
    }
}
```

JUnit Jupiter의 기본 패턴을 따른다. `@Test` 어노테이션으로 테스트 메서드를 표시하고, `assertEquals`로 기대값과 실제값을 비교한다. 테스트 클래스는 `src/test/java/` 하위에
위치하며, 메인 소스와 동일한 패키지 구조를 따르는 것이 관례이다.

### 테스트 실행

특정 모듈의 테스트를 실행하려면 다음과 같이 한다.

```bash
# app 모듈의 테스트만 실행
$ gradle :app:test
 
# 모든 모듈의 테스트 실행
$ gradle test
```

테스트가 성공하면 다음과 같이 출력된다.

```
> Task :app:test
 
BUILD SUCCESSFUL
```

### 테스트 결과물 확인

테스트 실행 후 `build` 디렉토리 하위에 다양한 형식의 결과물이 생성된다.

```
app/build/
├── reports/
│   └── tests/
│       └── test/
│           ├── index.html          ← HTML 테스트 리포트
│           ├── css/
│           └── js/
└── test-results/
    └── test/
        ├── binary/
        │   ├── output-events.bin
        │   └── results-generic.bin
        └── TEST-org.example.app.MessageUtilsTest.xml   ← XML 결과
```

#### HTML 테스트 리포트

`app/build/reports/tests/test/index.html`을 브라우저에서 열면 테스트 결과를 시각적으로 확인할 수 있다. 테스트 클래스별 성공/실패 현황, 실행 시간 등이 표시된다.

#### XML 테스트 결과

`app/build/test-results/test/` 하위에 JUnit XML 형식의 결과 파일이 생성된다. `TEST-org.example.app.MessageUtilsTest.xml`처럼 테스트 클래스별로
파일이 만들어진다. 이 XML 파일은 CI/CD 도구(Jenkins, GitHub Actions 등)에서 테스트 결과를 파싱하여 대시보드에 표시할 때 사용된다.

#### 테스트 결과물 요약

| 경로                                    | 형식        | 용도                      |
|---------------------------------------|-----------|-------------------------|
| `build/reports/tests/test/index.html` | HTML      | 브라우저에서 시각적으로 확인         |
| `build/test-results/test/*.xml`       | JUnit XML | CI/CD 도구에서 파싱           |
| `build/test-results/test/binary/`     | Binary    | Gradle 내부 사용 (증분 빌드 판단) |

### 테스트 커버리지 — JaCoCo

JaCoCo(Java Code Coverage)는 Java 생태계에서 가장 널리 사용되는 코드 커버리지 도구이다. 테스트가 실행될 때 어떤 코드 라인이 실행되었는지를 추적하여, 테스트가 얼마나 많은 코드를
커버하는지를 수치와 리포트로 보여준다.

#### JaCoCo 플러그인 적용

```groovy
plugins {
    id 'jacoco'
}
```

`jacoco` 플러그인을 적용하면 `jacocoTestReport`와 `jacocoTestCoverageVerification` 태스크가 추가된다.

#### 테스트와 리포트 연결

```groovy
test {
    finalizedBy jacocoTestReport
}
 
jacocoTestReport {
    dependsOn test
}
```

이 설정으로 `gradle test`를 실행하면 테스트 완료 후 JaCoCo 리포트가 자동으로 생성된다. `finalizedBy`이므로 테스트가 실패하더라도 리포트는 생성된다. 어떤 테스트가 실패했는지와 함께 현재
커버리지도 확인할 수 있어 유용하다.

#### JaCoCo 리포트 확인

```bash
$ gradle :app:test
```

테스트 실행 후 JaCoCo 리포트가 다음 위치에 생성된다.

```
app/build/
├── jacoco/
│   └── test.exec                          ← 커버리지 실행 데이터
└── reports/
    └── jacoco/
        └── test/
            └── html/
                └── index.html             ← HTML 커버리지 리포트
```

`app/build/reports/jacoco/test/html/index.html`을 브라우저에서 열면 패키지별, 클래스별, 메서드별 커버리지를 시각적으로 확인할 수 있다. 코드의 어떤 라인이 테스트에 의해
실행되었는지 색상으로 표시된다.

#### JaCoCo 커버리지 지표

JaCoCo는 여러 종류의 커버리지 지표를 제공한다.

| 지표                       | 설명                            |
|--------------------------|-------------------------------|
| **Line Coverage**        | 실행된 코드 라인의 비율                 |
| **Branch Coverage**      | if/else, switch 등 분기 중 실행된 비율 |
| **Method Coverage**      | 한 번이라도 실행된 메서드의 비율            |
| **Class Coverage**       | 한 번이라도 실행된 클래스의 비율            |
| **Instruction Coverage** | 실행된 바이트코드 명령어의 비율             |

#### 커버리지 최소 기준 설정

JaCoCo는 리포트 생성 외에 **커버리지 최소 기준을 강제**할 수도 있다. 기준 미달 시 빌드를 실패시켜 코드 품질을 유지할 수 있다.

```groovy
jacocoTestCoverageVerification {
    violationRules {
        rule {
            limit {
                minimum = 0.80  // 80% 이상의 라인 커버리지 요구
            }
        }
    }
}
 
// check 태스크에 커버리지 검증 연결
tasks.named('check') {
    dependsOn jacocoTestCoverageVerification
}
```

이렇게 설정하면 `gradle check` 또는 `gradle build` 실행 시 커버리지가 80% 미만이면 빌드가 실패한다.

```
$ gradle :app:check
 
> Task :app:jacocoTestCoverageVerification FAILED
Rule violated for bundle app: instructions covered ratio is 0.65, but expected minimum is 0.80
```

### 테스트 관련 유용한 옵션

#### 특정 테스트만 실행

```bash
# 특정 테스트 클래스만 실행
$ gradle :app:test --tests "org.example.app.MessageUtilsTest"
 
# 패턴으로 필터링
$ gradle :app:test --tests "*MessageUtils*"
```

#### 테스트 로그 출력

기본적으로 테스트 실행 시 개별 테스트의 로그가 표시되지 않는다. 상세한 로그를 보고 싶다면 `build.gradle`에 다음을 추가한다.

```groovy
tasks.named('test') {
    useJUnitPlatform()
    testLogging {
        events "passed", "skipped", "failed"
        showStandardStreams = true
    }
}
```

#### 테스트 캐시 무시하고 재실행

Gradle은 테스트 입력이 변경되지 않으면 테스트를 건너뛴다(UP-TO-DATE). 강제로 다시 실행하려면 `--rerun` 옵션을 사용한다.

```bash
$ gradle :app:test --rerun
```