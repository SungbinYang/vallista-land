---
title: "[IntelliJ] 포커스"
tags:
  - IDE
image: ./assets/banner.png
date: 2025-11-04 07:47:27
series: IntelliJ
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [IntelliJ를 시작하시는 분들을 위한 IntelliJ 가이드](https://inf.run/doaZn) 강의를 참조하여 작성한 글입니다.

## 포커스 에디터

이번에는 포커스 관련 단축키를 알아보도록 하겠다. 아래의 코드를 가지고 한번 알아보자.

``` java
package me.sungbin.chap2;

public class FocusEditor {
    public void focus() {
        String s = "안녕하세요. 반갑습니다. IntelliJ IDEA Ultimate";
        System.out.println(s);
    }

    public void page1() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page2() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page3() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page4() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page5() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page6() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page7() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }

    public void page8() {
        System.out.println("간격을 넓히기 위한 코드1");
        System.out.println("간격을 넓히기 위한 코드2");
    }
}
```

### 단어 별 이동

만약 커서가 맨 앞에 있는데 이것을 가운데로 빠르게 가고 싶은 상황이 있을 것이다. 이런 경우 우리는 마우스를 이용하거나 좌/우 방향키로 일일이 한땀한땀 이동 할 것이다. 하지만 이것은 매우 비효율적인 방식이다. 따라서 이것을 편하게 하기 위해 단축키를 제공해준다. 맥 기준으로 `option + 좌/우 방향키`이다.

### 단어 별 선택

위의 단축키를 이용해서 단여별로 선택해서 하고 싶은 경우도 있을 것이다. 물론 마우스로 드래그를 해도 되지만 마우스를 이용하면 생산성이 떨어진다. 따라서, 이것도 인텔리제이에서 단축키를 제공해주는데 맥 기준 `option + shift + 좌/우 방향키`이다.

### 라인 첫/끝 이동

커서가 맨 앞에 가있다고 해보자. 그래서 우리는 다음줄에 무언가를 입력하고 싶다고 하자. 그러면 우리는 커서를 해당 문장 끝에 두고 엔터를 칠 것이다. 하지만 이것도 마우스를 이용하면 생산성이 떨어진다. 그래서 인텔리제이에서 단축키를 제공해준다. 맥 기준 `Fn + 좌/우 방향키`이다.

### 라인 전체 선택

위의 단축키를 응용한 버전으로 라인 전체를 선택하는 단축키도 인텔리제이에서 제공해준다. 맥 기준 `Fn + Shift + 좌/우 방향키` 혹은 `command + shift + 좌/우 방향키`이다.

### Page up / Page down

첫 라인에서 우리는 아래 메서드를 찾고 싶어서 이동해야할 때가 있다. 그러면 우리는 마우스 휠을 이용해서 확인하거나 키보드로 한땀 한땀 이동할 것이지만 매우 비효율적이다. 이를 위해 인텔리제이에서 단축키를 제공한다. 윈도우 키보드에 보면 `Home` 키나 `End`키인데 맥에서는 해당 키가 존재하지 않는다. 맥에서는 그래서 `Fn + 위/아래 방향키`로 대체해서 제공한다.

그러면 단축키들을 정리해보자.

- 단어별 이동
  - 맥: `option + 좌/우 방향키`
  - 윈도우/리눅스: `Ctrl + 좌/우 방향키`
- 단어별 선택
  - 맥: `option + shift + 좌/우 방향키`
  - 윈도우/리눅스: `Ctrl + Shift + 좌/우 방향키`
- 라인 첫/끝 이동
  - 맥: `Fn + 좌/우 방향키`
  - 윈도우/리눅스: `Home, End`
- 라인 전체 선택
  - 맥: `Fn + 좌/우 방향키`, `command + shift + 좌/우 방향키`
  - 윈도우/리눅스: `Shift + Home/End`
- Page up / down
  - 맥: `Fn + 위/아래 방향키`
  - 윈도우/리눅스: `Page up / down`

## 포커스 특수키

### 포커스 범위 한 단계 씩 늘리기

해당 단축키는 은근 유용하다. 어떤 범위를 선택할 때 유용하게 사용되는데 맥 기준 `option + 위/아래 방향키`이다.

### 포커스 뒤로/앞으로 가기

우리가 어떤 것을 작성할 때 뒤로가기나 앞으로 가기를 유용하게 사용하는 것처럼 포커스도 이전 포커스로 이동하는 것이 가능하다. 해당 기능은 단일 파일뿐만 아니라 여러 파일에서 사용이 가능하다. 예를 들어 A라는 파일에 포커스를 두었다가 B라는 파일에 포커스가 갔고 해당 단축키를 통해 이전 포커스로 이동하려고 한다면 A 파일에 포커스로 이동이 가능하다는 것이다. 맥 기준 단축키는 `command + [ or ]`이다.

### 멀티 포커스

우리가 코드를 작성하다 보면 공통적으로 여러 라인을 같은 것으로 수정해야할 때가 있다. 특히 문자열 같은 곳에서 말이다. 이럴 때 우리는 멀티 포커스 기능을 사용하면 되는데 맥 기준 단축키는 `option + option + 위/아래 방향키`이다.

### 오류 라인으로 자동 포커스

우리는 코드를 작성하다 보면 오류 라인으로 바로 이동하게끔 하고 싶은 경우가 있을 것이다. 인텔리제이는 해당 기능에 대한 단축키를 제공해주는데 맥 기준 `F2`이다.

그러면 단축키를 정리해보자.

- 포커스 범위 한 단계씩 늘리기
  - 맥: `option + 위/아래 방향키`
  - 윈도우/리눅스
    - `Ctrl + w(위)`
    - `Ctrl + Shift + w(아래)`
- 포커스 뒤로/앞으로 가기
  - 맥: `command + [, ]`
  - 윈도우/리눅스: `Ctrl + Alt + 좌/우 방향키`
- 멀티 포커스
  - 맥: `option + option + 위/아래 방향키`
  - 윈도우/리눅스: `Ctrl + Ctrl + 위/아래 방향키`
- 오류 라인 자동 포커스
  - 맥/윈도우/리눅스: `F2`