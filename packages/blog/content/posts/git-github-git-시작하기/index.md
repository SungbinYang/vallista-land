---
title: "[Git & Github] git 시작하기"
tags:
  - git
image: ./assets/banner.png
date: 2026-04-04 11:41:27
series: git
draft: false
---

![banner](./assets/banner.png)

> 해당 포스팅은 인프런의 [제대로 파는 Git & GitHub - by 얄코(Yalco)](https://inf.run/VyuWK) 강의를 참조하여 작성한 글입니다.

## 설치 및 설정

이제부터 본격적으로 git을 설치해보고 설정을 해보도록 하자. 필자의 환경은 Mac이므로 MAC 기준으로 진행하도록 하겠다.

### iterm2 다운로드

먼저 맥을 사용하고 계신 사용자라면 기본으로 터미널이라는 프로그램이 존재할 것이다. 하지만 해당 터미널은 실무에서 많이 사용하지 않는다. 그 이유는 이 보다 더 좋은 기능들도 많고 편리한 터미널과 비슷한 *
*iterm2** 를 많이 이용한다.

> https://iterm2.com/

위의 링크를 클릭해서 다운 받는 것이 정말 좋으니 다운 받아보도록 하자. 다운로드를 받으면 아래와 같은 화면이 보일 것이다.

![image01](./assets/01.png)

그리고 해당 iterm2에 아래와 같이 깃 버전 정보를 보는 명령어를 입력하자. 기본적으로 맥에는 git이 자동으로 설치되어 있다. 그래서 별도 설치가 필요는 없지만 최신 버전을 받는 것을 추천하니 현재 버전을 보고
최신화를 해주는 것이 좋다.

```shell
git --version // Git의 현재 버전을 확인합니다.
```

### git 설치

아마도 자동으로 설치된 버전은 최신 git 버전과 차이가 존재할 것이다. 따라서 깃을 최신화해주도록 하자. 먼저 [깃의 공식 사이트](https://git-scm.com/)로 가서 안내에 따라 Git을 설치합니다.
공식 문서를 접속해보면 아마 아래와 같은 화면이 나올 것이다.

![image02](./assets/02.png)

여기서는 다양한 방법으로 깃을 설치할 수 있는 방법들을 제공한다. 하지만 실무에서 가장 많이 이용하는 방식은 `homebrew`를 이용하는 방법이다. homebrew란 각종 프로그램이나 라이브러리들을 쉽게 설치 및
제거하고 관리를 해주는 패키지 프로그램이라고 생각하면 좋을 것 같다.

그러면 homebrew부터 설치해보자. 먼저 깃 공식문서의 homebrew 링크를 클릭해보자. 그러면 아마 아래와 같은 화면이 나올 것이다.

![image03](./assets/03.png)

install homebrew 아래에 있는 명령어를 복사해서 iterm에 붙여넣어보자. 그러면 자동으로 homebrew가 설치된 것을 알 수 있을 것이다. 이제 아래와 같은 명령어를 입력하여 git을 설치해주도록
하자.

```shell
brew install git
```

그러면 최종적으로 git의 설치가 끝이 났다. 그 다음으로 넘어가기 전에 1가지 설정만 미리 해두고 가겠다. item에 아래와 같은 명령어를 입력하자.

```shell
git config --global core.autocrlf input
```

위의 명령어는 git의 명령어로 협업시 윈도우와 맥에서 엔터 방식 차이로 인한 오류를 방지하도록 해주는 설정이다.

### GitKraken 설치

실무에서는 터미널을 통해 명령어로 git을 많이 이용한다. 하지만 터미널만 이용하는 것은 아니다. 바로 gui형태로 보여주는 깃 프로그램이 존재한다. 대표적으로 소스트리라는 것이 있다. 소스트리는 무료이고 보기가
편한 프로그램이다. 하지만 필자는 GitKraken을 사용하도록 하겠다. 해당 프로그램도 소스트리처럼 gui 형태로 보여주는 git 프로그램이지만 소스트리보다 사용하기 쉽고 디자인 자체도 보기가 더 편한 제품이다.
다만 유료라는 것이 아쉽다. 그래도 필자는 개인적으로 소스트리보다 GitKraken이 더 끌리기에 결제하고 사용하고 있다. 독자들도 필자처럼 결제를 하고 GitKraken을 사용하셔도 되고 Sourcetree를
사용해도 괜찮다.

[GitKraken](https://www.gitkraken.com/download?source=paid_search&utm_term=%EA%B9%83%20%ED%81%AC%EB%9D%BC%EC%BC%84&utm_campaign=GKC+-+Search+-+South+Korea+-+Desktop&utm_source=adwords&utm_medium=ppc&hsa_acc=1130375851&hsa_cam=21413139489&hsa_grp=169682405011&hsa_ad=704065275078&hsa_src=g&hsa_tgt=aud-1671627213566:kwd-2193101281085&hsa_kw=%EA%B9%83%20%ED%81%AC%EB%9D%BC%EC%BC%84&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=21413139489&gbraid=0AAAAADeUjDHfxGpGIDnHdwsSIv3egTnCr&gclid=Cj0KCQjwyr3OBhD0ARIsALlo-OnH-7O4gK2Non1dUfQBarXyRvSBMldlnd41M7MlO7YjUwBpbcGid7oaAs9kEALw_wcB)
다운로드 페이지로 접속하여 설치를 해준다. 기본적으로 설치과정은 어렵지 않기에 생락할 것이다. 설치가 완료되면 아래와 같은 화면이 나올 것이다.

![image04](./assets/04.png)

### Claude Code

본 필자는 AI를 이용해서 git을 사용하는 방법을 위해 Claude Code를 같이 이용할 예정이다. 그리고 IDE는 vscode를 사용할 것이다. 물론 Cursor도 있지만 요즘 AI의 성능을 보면 Claude
Code가 막강하다는 것을 실무에서 체감을 많이 하고 있다. 그래서 Claude Code와 vscode를 설치할 것이다. 설치 과정은 생략하는데 어렵다고 느껴지면 아래와 같이 공식문서를 보고 따라해보면 좋을 것이다.

> https://code.claude.com/docs/ko/overview

또한 vscode는 아래와 같이 homebrew를 통해 설치해보도록 하자.

```shell
brew install --cask visual-studio-code
```

### 맥의 셸을 zsh로 설정하기

zsh 셸은 기존에 널리 쓰이던 bash 셸보다 편리한 기능들을 제공하고 테마와 플러그인도 다양하게 설치할 수 있다. 맥OS Catalina부터는 zsh가 기본 셸로 제공되지만, 이전 버전을 사용중이거나
오래된 버전으로부터 업그레이드했다면 아직 bash로 설정되어 있을 수 있다. 아직 bash 셸이 기본으로 설정되어 있는 맥에서 zsh를 사용하려면 아래의 내용들을 진행하자.

#### 현재 터미널의 shell이 zsh인지 확인

터미널 앱 또는 iTerm2(권장)을 열고 아래의 명령어를 입력한다.

```shell
echo $SHELL
```

![image05](./assets/05.png)

위와 같이 `bin/zsh` 라고 출력되면 이미 기본 셸이 zsh인 상태이다. 구형 맥이 아니라면 보통 이 상태이다. 다르게 출력된다면 아래의 과정을 진행해보자.

먼저, homebrew를 통해 진행할 것이니 homebrew의 최신 버전으로 업데이트를 하자.

```shell
brew update
```

다음으로 아래의 명령어를 입력하자.

```shell
brew install zsh
```

설치 후 `zsh --version`을 입력했을 때 아래와 같이 버전 정보가 나타나면 성공이다.

#### 기본 셸을 zsh로 변경

아래의 명령어를 입력하면 기본 셸을 zsh로 변경이 가능하다.

```shell
chsh -s $(which zsh)
```

#### 기본 셸 변경 확인

터미널 또는 iTerm2 앱을 완전히 종료(Command + Q)한 뒤, 다시 실행한다. `echo $SHELL`을 다시 입력하여 기본 쉘을 확인한다. 위의 처럼 `bin/zsh`라고 출력되면 완료이다.

### zsh의 테마 설정

#### oh-my-zsh 설치하기

oh-my-zsh는 zsh에 테마, 자동완성 등 더 많은 기능들을 불어넣어준다. 아래의 명령어를 입력해보자.

```shell
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

설치 후 omz를 입력했을 때 아래와 같이 명령어 정보가 나타나면 성공이다.

![image06](./assets/06.png)

## CLI vs. GUI

우리가 컴퓨터를 사용하는 방식에는 크게 2가지가 존재한다. 첫번째로 명령줄 인터페이스를 뜻하는 'CLI', 그리고 그래픽 사용자 인터페이스의 줄임말인 'GUI'가 존재한다.

먼저 CLI는 앞에서 설치했던 터미널처럼 텍스트로 명령어를 입력하여 컴퓨터에게 명령을 내리는 방식이다. 각종 명령어를 외워두고 이를 키보드에 입력하여 사용하는 방식으로 오늘날에는 개발자가 아니라면 별로 사용할 일이
없다. 또 다른 방식은 GUI이다. 아이콘, 버튼, 창등 시각적으로 직관적인 요소들을 마우스로 클릭하거나 손가락으로 터치하여 사용하는 방식이다. 우리가 사용하는 윈도우나 맥, 태블릿, 스마트폰등은 대부분 GUI
방식의 인터페이스를 제공하여 사람들이 쉽게 사용할 수 있다.

해당 포스팅에서 배우는 git도 CLI로 사용하는 방법과 GUI를 활용하는 방법에 대해 알아보도록 할 것이다. 먼저 코드 에디터에서 터미널 화면에서 명령어들을 입력하여 CLI 방식으로 git의 기능들을 알아 볼
것이다. 대부분의 실습은 이 CLI를 통해 알아볼 것이다. 그리고 git을 GUI로 다루기 위한 도구인 GitKraken의 사용법을 알아볼 것이다. 그러면 이런 의문점이 존재할 것이다.

> CLI보다 GUI가 쉽고 편리한데 그냥 다 GitKraken으로 안 하고 머리 아프게 명령어를 외우야 하는건가요?

GUI는 컴퓨터들의 각종 명령어와 그 실행 결과를 사람들이 쉽게 알아볼 수 있는 시각적인 요소로 '통역'하는 것과도 같다. 이를테면 GitKraken은 Git 관련 업계에서 가장 유명한 통역가인셈이다. 초보자에게는
편리하긴 하지만 통역가를 사이에 두고 외국인과 깊은 대화를 나누기에는 어려운 것처럼 사용할 수 있는 기능들에 제약이 있고 실무에서 작업 효율이 떨어질 때도 있다. 반면 CLI는 컴퓨터와 보다 직접적인 언어로 대화를
하는 것이기 때문에 한 번 배워두면 Git의 모든 기능들을 내가 원하는데로 100% 활용할 수 있는 것이다.

더구나 오늘날에는 Git이 어떤 방식으로 동작하고 어떤 기능들이 있는지만 숙지해두면 명령어를 다 외워두지 않더라도 AI를 활용해서 쉽게 CLI로 Git을 사용할 수 있다. 그래서 권장드리는 Git의 사용법은 Git의
각종 기능들을 실행하는 것은 CLI 방식으로 명령어를 입력하여 진행하고 시각화에 유리한 GUI는 프로젝트의 Git 관리상태를 그래프등으로 확인하는 용도로 활용하는 것이다.

## Git 전역설정 & 프로젝트 관리 시작하기

그러면 본격적으로 Git을 사용해보자. 프로젝트를 시작하기 전에 먼저 중요한 전역 설정들을 해줄 것이다.

### Git 최초 설정

먼저 Git 전역으로 사용자 이름과 이메일 주소를 설정해보도록 하겠다. 아래와 같이 사용자 이름과 이메일 주소를 입력해보도록 하자.

```shell
git config --global user.name "(본인 이름)"
```

```shell
git config --global user.email "(본인 이메일)"
```

git의 명령어들은 항상 `git`이라고 시작한다. 여기서 `config`는 configuration의 약자로 무언가를 설정해준다는 의미이며 `--global`은 전역적으로 설정을 해주겠다는 의미이다.

> ⚠️주의
>
> GitHub 계정과는 별개

잘 설정이 되었는지 확인하려면 아래의 명령어들을 입력해주면 된다.

```shell
git config --global user.name
```

```shell
git config --global user.email
```

또한 추가적인 작업이 존재한다. 바로 기본 브랜치 명을 변경해주는 것이다. 여기서 브랜치란, 일종의 가지로 나중에 차원을 넘어다니는 도구로 일단은 인식하면 좋을 것 같다. 그래서 git을 사용하면 기본적으로
제공해주는 기본 차원이 있는데 이것이 기본으로 `master` 브랜치이다. 하지만 해당 표현은 인종차별의 느낌을 준다는 의미로 `main`으로 깃허브로 변경하였지만 아직까지 git은 변경되지 않았다. 따라서 아래의
명령어를 통해 기본 브랜치를 설정해보도록 하자.

```shell
git config --global init.defaultBranch main
```

### 프로젝트 생성 & Git 관리 시작

적당한 위치에 원하는 이름으로 폴더를 생성하고 코드 에디터로 열람하자. 그리고 해당 폴터를 IDE를 통해 열고 IDE 터미널에 아래와 같은 명령어를 입력하자.

```shell
git init
```

이후에 폴더 구조에 숨김 폴더를 보이게 설정하고 보면 아래와 같이 `.git`이 생성된 것을 볼 수 있다.

![image07](./assets/07.png)

`.git`은 깃의 버전들을 관리해주는 관리사무소 역할을 한다. 즉, `git init`은 관리사무소를 생성해주는 역할을 했다고 보면 이해하기 좋을 것 같다. 다음으로 아래의 yaml 파일을 생성해보자.

```yaml
team: Tigers

manager: John

members:
  - Linda
  - William
  - David
```

```yaml
team: Lions

manager: Mary

members:
  - Thomas
  - Karen
  - Margaret
```

다음으로 아래의 명령어를 입력해보자.

```shell
git status
```

그러면 아래와 같이 터미널에 나오는 것을 알 수 있다.

![image08](./assets/08.png)

뭔가 커밋은 아직 안되었고 트래킹 되지 않은 파일들이 존재한다라고 알려주고 있다. 아직 이런 개념은 모르고 지금 입력한 명령어들만 인지해보도록 하자.

### AI 활용

이제 Claude Code를 사용해서 위의 명령어들을 진행해보자.

```shell
claude
```

터미널을 새로 열어서 위와 같이 실행하여 claude code를 열자. 다음으로 아래의 화면처럼 프롬프트를 통해 `git init`을 해보자.

> 위의 행위를 하기 전에 `.git`은 삭제해두자.

![image09](./assets/09.png)

다음으로 `git status`를 해보자. 아래와 같이 프롬프트를 입력하고 실행하면 친절하게 알려주는 것을 볼 수 있다.

![image10](./assets/10.png)

## Git에게 맡기지 않을 것들

지금부터 우리는 git에게 버전관리를 맡기지 않는 파일들을 정의한 문서인 `.gitignore`에 대해 알아볼 것이다. 실습을 위해 아래의 파일들을 작성하자.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

```css
body {
    background-color: #f0f0f0;
}
```

```python
import os

class Config:
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
```

```json
{
  "database": {
    "url": "postgresql://user:pass@localhost/db"
  },
  "api_keys": {
    "openai": "sk-...",
    "stripe": "sk_test_..."
  },
  "jwt_secret": "your-secret-key"
}
```

그러면 아래와 같은 구조로 될 것이다.

![image11](./assets/11.png)

여기서 우리는 dist 폴더와 그 하위 파일들과 `config.py`파일과 `secrets.json`을 깃에서 제거하고 싶다고 하자. 보통은 dist는 react같은 프론트 프레임워크에서 빌드를 할 때 나오는
부산물같은거라 버전관리에서는 일반적으로 제거를 한다. `config.py`와 같이 환경마다 다른 파일들도 보통은 깃에서 제거를 한다. 당연히 보안에 취약한 `secrets.json` 같은 것도 말이다.

이것을 충족하기 위해 우리는 `.gitignore`에 아래와 같이 작성하면 된다.

```text
config.py
dist/
secrets.*
```

위의 내용을 보면 `config.py`라고 입력한것은 `.gitignore`와 같은 경로의 config.py는 깃에서 관리를 하지 않겠다라는 의미이다. 또한 `dist/`는 `.gitignore`와 같은 경로의
dist폴더와 하위 파일들을 전부 제거하겠다라는 의미이며 `secrets.*`는 secrets라는 이름의 모든 확장자는 다 깃에서 제거를 하겠다고 보면 좋을 것이다.

이 외에 `.gitignore`의 문법은 아래를 보면 좀 더 좋을테니 한번 살펴보도록 하자.

```text
# 1. 기본 파일 무시 (파일명 정확히 일치)
config.json              # 정확히 'config.json' 파일만 무시
README.txt               # 정확히 'README.txt' 파일만 무시

# 2. 확장자별 무시 (와일드카드 *)
*.log                    # 모든 .log 파일 무시
*.tmp                    # 모든 .tmp 파일 무시

# 3. 디렉토리 무시 (끝에 / 붙임)
node_modules/            # node_modules 디렉토리와 그 안의 모든 내용
build/                   # build 디렉토리 전체

# 4. 특정 경로의 파일/폴더
src/config.json          # src 폴더 안의 config.json만 무시
docs/temp/               # docs/temp 디렉토리만 무시
/root-only.txt           # 루트 디렉토리의 root-only.txt만 무시 (하위폴더 제외)

# 5. 패턴 매칭 (와일드카드)
temp*                    # temp로 시작하는 모든 파일/폴더
*temp*                   # temp가 포함된 모든 파일/폴더
temp*.*                  # temp로 시작하고 확장자가 있는 파일들
config*.json             # config로 시작하고 .json으로 끝나는 파일들

# 6. 중첩 디렉토리 패턴 (**)
**/logs/                 # 모든 위치의 logs 디렉토리
logs/**                  # logs 디렉토리 안의 모든 파일과 하위 디렉토리
src/**/temp/             # src 하위 어느 위치든 temp 디렉토리

# 7. 단일 문자 매칭 (?)
temp?.txt                # temp1.txt, tempA.txt 등 (한 글자만)
log?.log                 # log1.log, logA.log 등

# 8. 문자 집합 매칭 ([])
log[0-9].txt             # log0.txt, log1.txt, ..., log9.txt
temp[abc].log            # tempa.log, tempb.log, tempc.log
file[!0-9].txt           # file로 시작하지만 숫자가 아닌 한 글자가 오는 파일

# 9. 예외 처리 (느낌표 !)
*.log                    # 모든 .log 파일 무시
!important.log           # 하지만 important.log는 추적함
!logs/keep.log           # logs 폴더의 keep.log는 추적함

# 복합 예외 예제
build/                   # build 디렉토리 전체 무시
!build/README.md         # 하지만 build/README.md는 추적
!build/docs/             # build/docs 디렉토리는 추적
build/docs/*.tmp         # 단, build/docs/*.tmp 파일들은 무시
```