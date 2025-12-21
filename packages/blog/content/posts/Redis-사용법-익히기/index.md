---
title: "[Redis] Redis 사용법 익히기"
tags:
  - redis
image: ./assets/banner.png
date: 2025-12-21 14:22:27
series: redis 기본
draft: false
---

> 해당 포스팅은 인프런의 [비전공자도 이해할 수 있는 Redis 입문/실전 (조회 성능 최적화편)](https://inf.run/SAtv5)를 참조하여 만들었습니다.

![banner](./assets/banner.png)

## 로컬에서 Redis 설치하기

이제 Redis를 로컬에서 설치해보도록 하겠다. 필자는 MAC을 사용하고 있으므로 `homebrew`를 통해서 쉽게 설치해보도록 하겠다. 먼저, `homebrew`가 설치되어 있지 않다면 터미널에서 아래와 같이 입력해준다.

``` bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

homebrew가 잘 설치되었다면 아래와 같이 명령어를 통해서 확인해볼 수 있다.

``` bash
brew --version
```

이제 redis를 설치해보도록 하겠다.

``` bash
brew install redis
```

정상적으로 설치가 되었다면 아래와 같이 잘 설치가 되었는지 확인해보자.

``` bash
brew services info redis
```

위의 명령어는 redis의 실행 여부를 확인해보는 명령어이다. 처음 해당 명령어를 쳐보면 redis 서버가 시작이 안되어 있음을 알 수 있다. 그러면 서버를 시작해보자.

``` bash
brew services start redis
```

위의 명령어를 입력하면 redis 서버가 정상적으로 실행됨을 알 수 있다. 그러면 서버를 중단하는 명령어도 같이 알아보자.

``` bash
brew services stop redis
```

그러면 이제 redis에 직접 접속하는 방법에 대해 알아보자.

``` bash
redis-cli
```

이렇게 되면 접속이 잘 될 것이다. 이제 health-check를 한번 해보자. health-check는 정상적으로 redis가 잘 띄워졌고 응답을 잘 받는지 확인하는 행위이다.

``` bash
ping
```

위와 같이 입력하면 응답으로 PONG이라고 오면 잘 된 것이다.

## Redis 기본 명령어 익히기

우리는 이제 Redis의 기본 명령어를 학습해보기로 하겠다. 보통 일반적으로는 Redis에 자료 구조나 다양한 명령어들을 전부 학습하려곤 한다. 하지만 이러면 금방 지친다. 실제 실무에서 빠르게 적용하기 위해 꼭 필요한 redis의 기본 명령어만을 학습하고 넘어가보도록 하자. 실제 자세한 명령어들은 이후에 학습해보자.

### 데이터(Key, Value) 저장하기

Redis에 데이터를 저장하려면 `set [key 이름] [value]` 형식으로 적어주면 된다. 만약 value의 띄어쓰기같은 값이 포함되어 있다면 쌍따옴표를 붙여준다. 예시는 아래와 같다.

``` bash
set sungbin:name "sungbin yang"
set sungbin:hobby soccer
```

### 데이터 조회하기 (Key로 Value 조회하기)

Redis에 저장된 데이터를 조회하는 것도 매우 간단하다. `get [key 이름]`을 입력해주면 된다. 예시는 아래와 같다.

``` bash
get sungbin:name
get sungbin:hobby
```

위와 같이 저장된 key로 조회를 한다면 정상적으로 저장된 value값이 조회가 된다. 그러면 만약 없는 key 값으로 조회하면 어떻게 나올까?

``` bash
get sungbin:study
```

위와 같이 없는 key값으로 조회를 하면 `(nil)`이라고 나온다. 해당 값은 마치 우리 프로그래밍 언어에서 `null`과 같다고 이해하면 좋을 것 같다.

### 저장된 모든 key 조회하기

그러면 저장된 모든 key 값을 조회하는 명령어는 무엇일까? 바로 아래와 같다.

``` bash
keys *
```

위와 같이 입력하면 저장된 모든 key값이 조회가 된다.

### 데이터 삭제하기 (Key로 데이터 삭제하기)

redis에 저장된 key-value를 삭제하려면 어떻게 할까? 이것도 간단하다. `del [key 이름]`꼴로 입력해주면 해당 key에 해당되는 값이 삭제가 된다.

``` bash
del sungbin:hobby
```

그러면 정상적으로 삭제가 되었는지 확인하려면 지운 key 값으로 조회를 해보면 될 것이다. 그러면 `(nil)`이라고 나올텐데 이러면 정상적으로 삭제가 잘 된 것이다.

### 데이터 저장 시 만료시간(TTL) 정하기

redis는 RDBMS와는 다르게 데이터 저장 시 만료시간을 설정할 수 있다. 즉, 영구적으로 데이터를 저장하지 않고 일정 시간이 되면 데이터가 삭제되도록 셋팅할 수 있다. 이렇게 ttl 기능이 존재하는 이유는 Redis는 RAM에 저장되는데 RAM은 디스크에 비해서 용량이 매우 작기 때문이다. 그래서 Redis에 저장되는 데이터는 영구적으로 저장되는 것보다도 일시적으로 저장하기 위한 용도로 많이 사용된다. 그러면 어떻게 ttl을 포함해서 데이터를 저장할까? `set [key 이름] [value] ex [만료 시간(초)]`꼴로 입력해주면 된다. 예시는 아래와 같다.

``` bash
set sungbin:pet dog ex 30
```

### 만료시간(TTL) 확인하기

그러면 만료시간을 확인해보는 명령어도 알아보자. `ttl [key 이름]`을 통해서 확인하면 ttl값을 설정한 key가 남은 ttl시간을 반환하는 것을 알 수 있을 것이다. 만약 만료시간이 다 되면 해당 key값은 자동으로 삭제가 된다. ttl값이 만료가 되어 삭제된 key나 애초에 존재하지 않는 key에 대하여 만료시간을 구하려고 하면 응답으로 `(integer) -2`가 나온다. 그런데 키는 존재하지만 만료 시간이 설정돼 있지 않은 경우에는 -1을 반환하게 된다.

``` bash
ttl sungbin:pet
```

### 모든 데이터 삭제하기

마지막으로 모든 데이터를 삭제하는 명령어에 대해 알아보자. 모든 데이터를 삭제하고 싶을 경우는 아래와 같다.

``` bash
flushall
```

## Redis에서 Key 네이밍 컨벤션 익히기

Redis의 Key 이름을 잘 짓는 건 굉장히 중요하다. 따라서 현업에서 자주 사용하는 Key 네이밍 컨벤션을 배워보자.

회사마다 컨벤션이 정말 다양할 것이다. 그 중에 유명한 컨벤션을 제안하려고 한다. 그 유명한 컨벤션은 콜론(:)을 활용해 계층적으로 의미를 구분해서 사용한다. 예를 들어서 아래와 같은 예시를 들 수 있을 것 같다.

- `users:100:profile`: 사용자들(users) 중에서 PK가 100인 사용자(user)의 프로필(profile)
- `products:123:details`: 상품들(products) 중에서 PK가 123인 상품(product)의 세부사항(details)

위와 같이 컨벤션을 정의했을 때 아래와 같은 장점이 존재할 것이다.

- 가독성: 데이터의 의미와 용도를 쉽게 파악할 수 있다. 
- 일관성: 컨벤션을 따름으로써 코드의 일관성이 높아지고 유지보수가 쉬워진다.
- 검색 및 필터링 용이성: 패턴 매칭을 사용해 특정 유형의 Key를 쉽게 찾을 수 있다.
- 확장성: 서로 다른 Key와 이름이 겹쳐 충돌할 일이 적어진다.