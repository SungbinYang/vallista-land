---
title: "코틀린 상속 간 주의점"
tags:
  - 트러블 슈팅
image: ./assets/banner.png
date: 2025-10-07 16:38:27
series: 트러블 슈팅
draft: false
---

![banner](./assets/banner.png)

## 코틀린 넌 왜 나에게 이런 시련을 주는건가..

연휴기간 동안 코틀린 상속 관련 공부를 진행하다가 재미난 이슈가 있어서 한번 공유드릴려구요!

아래의 2개의 클래스가 있습니다. 보시는 바와 같이 Child class가 Parent 클래스를 상속받고 있지요.

``` kotlin
package me.sungbin.troubleshooting

open class Parent(
    open val number: String = "100"
) {
    init {
        println("Parent Call")
        println(number)
    }
}
```

``` kotlin
package me.sungbin.troubleshooting

class Child(
    override val number: String,
): Parent() {
    init {
        println("Child Call")
    }
}
```

그리고 아래와 같이 main 함수에서 Child class 생성자를 호출합니다.

``` kotlin
package me.sungbin.troubleshooting

fun main() {
    Child("300")
}
```

그러면 결과는 어떻게 찍힐까요?

저는 처음에 아래와 같이 생각했습니다. 부모 클래스의 생성자가 호출되면서 number값을 출력할 때 오버라이딩 되었으니 자식 클래스의 number값을 호출하지 않을까? 그래서 아래와 같이 생각했었습니다.

``` bash
Parent Class
300
Child Class
```

그런데 실제 결과는 달랐습니다.

``` bash
Parent Class
null
Child Class
```

오잉? 이상하지 않은가요? 그래서 자바코드로 디컴파일 해보고 공식문서를 찾아본 결과 정답에 대한 솔루션을 알 수 있었습니다.

> 공식문서: [공식문서 링크](https://kotlinlang.org/docs/inheritance.html#derived-class-initialization-order)

왜 그런가 싶더니 코틀린 공식 문서에서 아래와 같이 이야기 하더라구요!

> 파생 클래스의 새 인스턴스를 생성하는 동안 기본 클래스 초기화는 첫 번째 단계로 수행됩니다(기본 클래스 생성자의 인수 평가에 의해서만 선행됨). 즉, 파생 클래스의 초기화 논리가 실행되기 전에 수행됩니다.

코틀린의 공식문서의 해당 내용을 번역해보았습니다.

> 즉, 기본 클래스 생성자가 실행될 때 파생 클래스에서 선언되거나 재정의된 속성은 아직 초기화되지 않은 상태입니다. 기본 클래스 초기화 로직에서 이러한 속성을 사용하면 (직접적으로든 다른 재정의된 멤버 구현을 통해 간접적으로든 ) 잘못된 동작이나 런타임 오류가 발생할 수 있습니다. 따라서 기본 클래스를 설계할 때는 생성자, 속성 초기화자 또는 블록에 멤버를 open사용하지 않는 것이 좋습니다.

즉, 요약 하자면 아래와 같을 것입니다.

자식 생성자를 호출한다 -> 그 전에 부모 생성자를 호출하려고 할 때 먼저 init block을 호출한다. number 값을 출력하려고 보니 재정의되어서 자식 클래스에 접근한다. -> 그런데 자식 클래스 생성자 전이니 해당 값은 알 수 없다 -> 따라서 null로 출력한다. 그런데 저는 여기서 또 의문이 들었습니다. 분명 선언된 것은 non-nullable 타입인데 어떻게 null이 나오는거야? 또한, 신기한 것은 타입을 String -> Int로 변경 시에는 기본 값 0이 나오더라구요! 그래서 또 한번 30분간 연구를 해보았습니다. 그 덕에 조금 답을 얻을 수 있었는데요.

초기화 순서를 먼저 보면 좋을 것 같아요.

- Child("300") 호출 → Parent() 생성자 호출(슈퍼 생성자 호출이 먼저).
- Parent의 init가 실행되며 println(number) 수행.
- number는 open 프로퍼티라서 가상 디스패치로 Child.number getter를 타게 됩니다.
- 하지만 이 시점에는 Child.number의 백킹 필드가 아직 할당 전이므로, 원시 타입 Int → JVM 기본값 0, 레퍼런스 타입(예: String) → JVM 기본값 null이 반환된다고 하더라구요.
- Kotlin의 Non-null 보장도 생성 중(super 생성자 실행 중)에는 예외적으로 깨질 수 있습니다.

그래서 값이 다르게 나왔다고 하더라구요!

## 후기

해당 과정은 정말 1시간 동안 연구하면서 공식문서를 뒤져보고 gpt한테도 물어보면서 얻은 답변들이였습니다. 그래서 뭔가 재미나면서도 다른 분들께 공유를 드리면 좋을 것 같아서 해당 포스팅을 진행하게 되었습니다. 이렇게 연구하게 된것도 어찌보면 인프런에서 진행하는 ['향로' 와 함께하는 추석 완강 챌린지](https://inf.run/RAWqi) 덕도 큰 것 같습니다. 연휴가 이제 거의 절반을 지난 것 같은데 남은 연휴기간도 화이팅입니다!