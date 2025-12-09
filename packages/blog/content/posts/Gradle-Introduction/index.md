---
title: "[Gradle] Introduction"
tags:
  - gradle
image: ./assets/banner.png
date: 2025-12-10 00:22:27
series: gradle
draft: false
---

![banner](./assets/banner.png)

## Gradle이란 무엇인가?

Gradle은 주로 Java 또는 Scala 프로젝트에 사용되는 강력한 빌드 자동화 도구이며, 다양한 언어의 프로젝트도 지원을 한다. Gradle은 빌드 툴이므로 코드를 컴파일하고, 바이너리를 패키징하고, 테스트를 실행하고, 아티팩트를 게시하는 등의 작업을 자동화하여 소프트웨어 빌드, 테스트 및 배포 프로세스를 단순화한다. Gradle은 기본적으로 실행을 할 때 소스 코드와 테스트 코드를 가져와 app.jar와 같은 실행 파일이나 테스트 커버리지 리포트 등을 생성한다.

### 선언적 빌드 스크립트

Gradle은 빌드 프로세스의 단계를 정의하기 위해 Groovy 또는 Kotlin으로 작성된 빌드 스크립트를 사용한다. 이 스크립트들은 소프트웨어 빌드 및 배포에 필요한 태스크(Tasks)를 명시한다. Gradle의 선언적 언어는 태스크와 의존성을 쉽게 기술할 수 있게 해주어, '어떻게(How)'보다는 '무엇을(What)' 달성하고자 하는지에 집중할 수 있게 한다. 또한, 빌드 프로세스와 구성을 기술하기 위해 특별히 맞춤화된 언어인 DSL을 사용한다.

### Groovy DSL

``` groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}
```

Groovy DSL은 Gradle이 제공하는 원조 DSL로, Groovy 언어로 작성된다. 대부분의 기존 Gradle 빌드 스크립트는 Groovy 문법과 규칙을 따른다. 또한, Groovy DSL 스크립트는 `build.gradle`이라는 파일명으로 정의된다. Groovy는 문법이 간결하여 빌드 구성을 읽기 쉬운 형식으로 표현하기 좋다.

### Kotlin DSL

``` kotlin
plugins {
    id("java")
    id("org.springframework.boot") version "3.2.0"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}
```

Gradle은 Kotlin을 스크립팅 언어로 사용하는 Kotlin 기반 DSL도 지원한다. Kotlin DSL 스크립트는 `build.gradle.kts`라는 파일명으로 정의된다. Groovy와 유사하지만 문법적으로 약간의 차이(예: 큰따옴표 사용, 함수 호출 괄호 등)가 있다.

### 의존성 관리

Gradle은 Maven Central 및 JCenter와 같은 리포지토리와 통합되어 외부 라이브러리(의존성)를 지정하고 버전을 관리할 수 있게 해준다. 이렇게 함으로 의존성을 자동으로 해결(resolve)하고 로컬에 캐시(cache)하여 빌드 성능과 신뢰성을 향상시킨다.

### 증분 빌드

Gradle은 마지막 빌드 이후 변경된 태스크만 실행하는 '증분 빌드'를 수행한다. 이 기능은 특히 대규모 프로젝트에서 빌드 프로세스 속도를 크게 높여줍니다. 즉, 체크섬(checksums)과 타임스탬프를 사용하여 특정 태스크를 다시 실행해야 하는지 여부를 판단하여 체크섬이 다르면 실행을 다시 하여 빌드하고 아니면 그대로 둔다.

### 멀티 프로젝트 빌드

Gradle은 여러 하위 프로젝트(subprojects)나 모듈이 있는 복잡한 프로젝트를 처리할 수 있다. 각 하위 프로젝트는 고유한 의존성과 태스크를 가질 수 있지만, 하나의 단일 빌드 스크립트의 일부로서 함께 빌드될 수 있다. 이는 대규모 애플리케이션, 마이크로서비스 또는 모듈러 아키텍처를 가진 소프트웨어에 특히 유용하다.

### 사용자 정의 및 확장 가능성

Gradle은 풍부한 API와 플러그인 시스템을 제공하여 태스크를 커스터마이징하거나 자신만의 플러그인을 만들 수 있다. Java 코드 컴파일, 테스트 실행, JAR 파일 패키징 등 일반적인 작업을 위한 플러그인들이 이미 제공된다. Gradle의 유연성 덕분에 안드로이드 앱부터 웹 애플리케이션까지 광범위한 프로젝트 유형을 지원할 수 있다.

### 빌드 스캔

빌드 스캔은 빌드에 대한 상세한 인사이트를 제공하는 기능이다. 빌드 성능, 의존성, 태스크 실행 시간 등에 대한 정보를 포함하여 빌드 프로세스를 최적화하는 데 도움을 준다. 이 스캔 결과는 다른 사람과 공유할 수 있어, 팀 환경에서 문제를 진단하기가 더 쉬워진다.

### 지속적 통합 및 배포 (CI/CD)

Gradle은 Jenkins, CircleCI, Travis CI와 같은 도구를 사용하여 CI/CD 파이프라인에 쉽게 통합될 수 있다. 헤드리스(headless, GUI 없이) 방식으로 태스크를 실행할 수 있는 능력 덕분에 자동화된 빌드, 테스트 및 배포에 매우 적합하다.

### 설치

![image01](./assets/01.png)

설치는 매우 간단하다. 맥 기준으로 아래와 같이 homebrew를 이용하면 쉽다.

``` bash
brew install gradle
```