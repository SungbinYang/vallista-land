---
title: "[IntelliJ] Git&Github"
tags:
  - IDE
image: ./assets/banner.png
date: 2025-12-08 15:30:27
series: IntelliJ
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [IntelliJ를 시작하시는 분들을 위한 IntelliJ 가이드](https://inf.run/doaZn) 강의를 참조하여 작성한 글입니다.

## Git 기본 기능 사용하기

인텔리제이에서 Git을 사용하는 방법에 대해 살펴보도록 하자.

### Git View On

먼저, Git에 대한 기본적인 기능들이 있는 UI를 어떻게 볼 수 있는지 살펴보도록 하자. 그것을 우리는 Git View On이라고 한다. 인텔리제이 상단에 `View`탭에 들어가서 `Top Window`를 클릭하면 여러가지 기능들이 있는 메뉴바가 나오는데 여기서 Git을 선택하거나 혹은 단축키로 맥 기준 `command + 9`를 클릭하면 아래와 같이 Git 터미널 창같은 것이 나온다.

![image01](./assets/01.png)

![image02](./assets/02.png)

위의 화면을 보면 다양한 기능들을 제공해주는데 먼저 로컬 저장소의 브랜치와 원격 저장소의 브랜치 목록을 볼 수 있으며 git graph처럼 그래프도 이쁘게 보여준다.

![image03](./assets/03.png)

또한, 뭔가 로컬 저장소에 변화가 생기면 왼쪽 탭의 깃 관련 버튼을 누르면 위와 같이 저장소에 대한 변화도 한번에 확인이 가능하다.

![image04](./assets/04.png)

이런 로컬 저장소 변화 탭에서 파일 하나를 오른쪽 마우스 클릭을 하면 여러가지 기능을 할 수 있는데 여기서 `show diff`를 클릭하면 아래와 같이 변경점을 UI상으로 확인이 가능하다.

![image05](./assets/05.png)

또한, Git Graph에 커밋 하나를 클릭하면 왼쪽 창에 해당 커밋에 어떤 파일이 변경이 되었고 누가 작업을 했으며 해당 커밋에 대한 정보가 상세하게 잘 나온다.

![image06](./assets/06.png)

또한, 해당 커밋에 대해 다양한 기능도 제공하니 한번씩 실습을 해보면 좋을 것 같다.

![image07](./assets/07.png)

다음으로, 깃 관련 터미널에 콘솔 버튼을 눌러보자. 그러면 내가 해당 프로젝트에 어떤 작업을 했는데 git 관련 로그가 나오는 것을 볼 수 있다.

![image08](./assets/08.png)

### Git Option Popup

다음으로 Git에 대하여 보다 상세한 기능들에 대해 살펴보도록 하자. 맥 기준 `Ctrl + v`를 입력하면 아래와 같은 팝업창이 나오고 해당 팝업 메뉴를 보면 우리가 익숙하게 사용한 Git관련 작업들이 나오는 것을 볼 수 있다.

![image09](./assets/09.png)

### Git History

여기서 4번째의 History를 살펴보면 해당 파일에 대한 Git에 대한 history를 볼 수 있다.

![image10](./assets/10.png)

![image11](./assets/11.png)

### Git Branch

다음으로 `Ctrl + v`를 입력하고 브랜치 관련 메뉴를 클릭하면 아래와 같이 브랜치들이 쭉 나오는 것을 볼 수 있다.

![image12](./assets/12.png)

다음으로 `New Branch`를 클릭하면 새로운 브랜치를 만들 수 있다. 아래처럼 `checkout branch`옵션을 체크하면 브랜치를 만듬과 동시에 체크아웃이 가능하다.

![image13](./assets/13.png)

브랜치를 만들고 나서 Git 콘솔창을 보면 정상적으로 만들어짐을 볼 수 있다.

![image14](./assets/14.png)

이후에 `main`브랜치로 체크아웃을 하고 싶다면 `Ctrl + v`를 입력 후, 브랜치 메뉴로 가서 브랜치 목록에 아래와 같이 `main` 브랜치를 클릭 후, 체크아웃을 진행하면 쉽게 가능하다.

![image15](./assets/15.png)

### Commit

다음으로 커밋을 진행해보자. 커밋을 진행하기 위해서는 `Ctrl + v`를 통해 메뉴창을 열고 Commit을 누르면 왼쪽처럼 메뉴바가 나오지만 더 쉬운 방법으로는 `command + k`를 누르면 자동 커밋창이 열린다.

![image16](./assets/16.png)

그리고 아래와 같이 커밋 메세지를 작성하고 `commit anyway and push` 버튼을 클릭한다.

![image17](./assets/17.png)

그러면 push에 대한 팝업이 나올 것이고 push를 진행해주면 자동으로 원격저장소에 반영이 된다.

![image18](./assets/18.png)

또한, 커밋을 진행할 때 다양한 옵션을 줄 수 있다. 인텔리제이에서는 아래와 같은 옵션을 주며 실무에서는 보통 `reformat`이나 `rearrange`를 사용한다.

![image19](./assets/19.png)

### Push

> ⚠️ 주의
>
> 여기서 주의 할 점은 파일을 생성되면 commit과 push를 동시에 진행이 안된다. 이 점은 유의해야 하며 push와 commit을 따로 진행해야 한다. push의 단축키는 맥 기준 `command + shift + k`이다.

![image20](./assets/20.png)

### pull

우리가 실무에서 작업을 하다보면 다른 작업자들과 작업을 같이 한다. 하지만 경우에 따라 다른 사람이 작업한 것을 내려받아서 사용해야 할 때가 존재한다. 그럴 때는 우리는 `git pull`을 이용하고 해당 기능은 아쉽게도 단축키가 존재하지 않는다. 따라서 Action 검색을 통해 git pull이라고 검색하고 사용해야 한다.

![image21](./assets/21.png)

### 정리

- Git View On
    - 맥: `command + 9`
    - 윈도우/리눅스: `Alt + 9`
- Git Option Popup
    - 맥: `Ctrl + v`
    - 윈도우/리눅스: `Alt + 백틱`
- Git History
    - 맥: `Ctrl + v => 4`
    - 윈도우/리눅스: `Alt + 백틱 => 4`
- Branch
    - 맥: `Ctrl + v => 7`
    - 윈도우/리눅스: `Alt + 백틱 => 7`
- Commit
    - 맥: `command + k`
    - 윈도우/리눅스: `Ctrl + k`
- Push
    - 맥: `command + shift + k`
    - 윈도우/리눅스: `Ctrl + shift + k`
- pull
    - 맥: `Ctrl + shift + a => git pull`
    - 윈도우/리눅스: `Ctrl + shift + a => git pull`

## Github 연동하기

그러면 만약 새로운 환경에서 인텔리제이와 내 프로젝트와 Github을 연동하는 방법에 대해 살펴보도록 하겠다.

### 기존 프로젝트 Github에 연동하기

먼저 Action 검색을 열어서 `share project on Github`을 검색한다.

![image22](./assets/22.png)

그리고 연동을 진행하면 된다. 만약 이미 연동이 되어 있다면 아래와 같이 나올 것이다.

![image23](./assets/23.png)

필자는 독자들을 위해 어떻게 화면이 나오는지 보여주기 위해 새로운 프로젝트를 만들어서 진행해보도록 하겠다. 먼저 Action 검색을 해서 `share project on Github`을 입력하면 아래와 같이 나올 것이다.

![image24](./assets/24.png)

여기에 repository 이름과 설명을 작성하고 `Add Account` 버튼을 클릭한다.

![image25](./assets/25.png)

그러면 토큰 방식과 일반 방식이 있는데 토큰 방식으로 인증을 추천하긴 한다. 하지만 간단히 하고 싶다면 일반 Id/Password를 입력하는 방식도 좋다. 독자들이 원하는 방식으로 진행하면 좋을 것 같다.

> 보안 상, ssh를 이용한 방식을 적극 권한다.

이렇게 인증을 하면 아래와 같이 나올 것이고 share 버튼을 클릭한다.

![image26](./assets/26.png)

그러면 바로 커밋을 진행할 지 물어본다. 필자는 바로 커밋을 진행해볼려고 한다. 바로 커밋 메세지를 작성해주고 add를 눌러주면 자동으로 커밋을 진행해주고 원격 repository가 생성되고 push가 됨을 알 수 있다.

![image27](./assets/27.png)

![image28](./assets/28.png)

### Github 프로젝트 clone 받기

깃헙 프로젝트 클론 받는 법은 간단하다. 인텔리제이 창을 열어서 clone repository 버튼을 클릭한다. 그리고 url 방식으로 다운 받을지 혹은 자기 깃헙의 repo에 클론을 받을지 선택하고 클론을 진행하면 된다.

![image29](./assets/29.png)