---
title: XSS (Cross-Site-Scripting)
tags:
  - All
  - FrontEnd
date: 2019-05-12 11:03:57
draft: false
info: false
---

XSS는 Cross-Site-Scripting의 약자로, 해커가 사용자의 웹에 스크립트를 실행해서 쿠키나 세션 같은 민감한 정보를 빼가는 행위를 일컫는다. 해커가 document.cookie를 가져오는 소스를 넣은 php파일을 만들어서 서버에 넣어두고, 게시판 같은 사용자가 글을 볼 수 있는 곳에 자신의 서버에 있는 php파일을 실행하는 태그를 작성하여 올려둔다. XSS처리를 하지 않은 사이트는 해당 글을 열람한 사용자들이 들어가면 php 파일을 실행하게 되며, 자신의 정보가 해커의 서버에 전송된다. 

XSS를 해결할 수 있는 방법에는 몇 가지가 있는데, 대표적으로 BBCode 사용이 있다. HTML '<'와 '>' 태그 대신 대괄호를 사용하는 방법이다. 또, 각종 이벤트 블러킹등으로 막을 수 있다. 

간단하게는 이렇게 막을 수 있으나, 본격적으로 막으려면 네이버등 대기업에서 제공하는 라이브러리를 사용하면 좋다.