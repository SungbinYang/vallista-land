---
title: "[IntelliJ IDEA] 포커스"
tags:
  - IntelliJ
image: ./assets/banner.png
date: 2025-03-22 14:03:27
series: 인텔리제이
draft: false
---

![banner](./assets/banner.png)

> 해당 블로그 글은 [향로님의 인프런 강의](https://inf.run/NwFz)를 바탕으로 쓰여진 글입니다.

## 포커스 에디터

### 단어 별 이동

포커스가 다른데 가 있을 때 다른 곳으로 포커스를 가고 싶을때 좌/우 방향키를 계속 이용하기엔 시간이 너무 아깝다. 그래서 단어별로 이동 할 수 있는 단축키를 알아보자.

> ⌨️ 단축키
>
> - 맥: option + 좌/우 방향키
> - 윈도우/리눅스: Ctrl + 좌/우 방향키

### 단어 별 선택

단어 별 선택은 다른 에디터들을 써보았으면 매우 똑같다. 그래도 한번 다시 보자.

> ⌨️ 단축키
>
> - 맥: Shift + option + 좌/우 방향키
> - 윈도우/리눅스: Shift + Ctrl + 좌/우 방향키

### 라인 첫/끝 이동

해당 부분은 키보드의 Home키나 End키로 쉽게 할 수 있다. 다만, 맥은 해당 키가 존재하지 않기에 어떻게 해야할지 살펴보자.

> ⌨️ 단축키
>
> - 맥: Fn + 좌/우 방향키
> - 윈도우/리눅스: Home, End

### 라인 전체 선택

라인 전체 선택도 매우 쉽게 알 수 있다. 많이 사용 해봤을 것이다. 그래도 다시 한번 알아보자.

> ⌨️ 단축키
>
> - 맥: Shift + command + 좌/우 방향키(Fn + Shift + 좌/우 방향키)
> - 윈도우/리눅스: Shift + Home/End

### page up/dowm

이 부분도 윈도우는 키보드의 page up/down 버튼을 누르면 되지만 맥은 해당 키가 존재하지 않기에 어떻게 해야할지 살펴보자.

> ⌨️ 단축키
>
> - 맥: Fn + 위/아래 방향키
> - 윈도우/리눅스: Shift + Home/End

## 포커스 특수키

그러면 이제 포커스 특수 키들에 대해 알아보자!

### 포커스 범위 한 단계씩 늘리기

> ⌨️ 단축키
>
> - 맥: option + 위/아래 방향키
> - 윈도우/리눅스: Ctrl + w / Shift + Ctrl + w

### 포커스 뒤로 앞으로 가기

해당 기능을 단축키로 사용하면 해당 파일에서 뿐만 아니라 다른 파일에 포커스가 갔었다면 다른 파일로도 옮겨지는 유용한 기능이다.

> ⌨️ 단축키
>
> - 맥: command + [, ]
> - 윈도우/리눅스: Ctrl + Alt + 죄/우 방향키

### 멀티 포커스

해당 기능은 반복되는 부분들을 한번에 변경할 때 매우 유용하다. 예를 들어 아래 코드에서 `getCourse()`를 다르게 변경하고 싶을 때 사용한다.

``` java
package me.sungbin.inflearn.intellij.chap2.special;

import java.util.ArrayList;
import java.util.List;

public class FocusCopy {

    public void copyFocus() {
        List<String> members = new ArrayList<>();

        members.add(new Member().getCourse());
        members.add(new Member().getCourse());
        members.add(new Member().getCourse());
        members.add(new Member().getCourse());
        members.add(new Member().getCourse());
    }
}
```

> ⌨️ 단축키
>
> - 맥: option + option(누른채로) + 아래 방향키
> - 윈도우/리눅스: Ctrl + Ctrl(누른채로) + 아래 방향키

### 오류 라인 자동 포커스

이 기능을 이용하면 쉽게 오류 라인쪽으로 바로 포커스가 이동한다.

> ⌨️ 단축키
>
> F2

위의 단축키는 맥과 윈도우 공통이다.

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!