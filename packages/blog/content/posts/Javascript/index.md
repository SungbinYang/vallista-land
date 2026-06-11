---
title: "[프론트엔드] Javascript"
tags:
  - 프론트엔드
image: ./assets/banner.png
date: 2026-06-11 17:40:27
series: 프론트엔드
draft: false
---

> 해당 포스팅은 인프런의 [백엔드 개발자에 의한, 백엔드 개발자들을 위한 프론트엔드 강의 - 기본편](https://inf.run/DQ8mU)를 참조하여 만들었습니다.

![banner](./assets/banner.png)

## Java와 비교하며 배우는 Javascript 기본 문법들

지금부터 자바스크립트 문법에 대해 알아보도록 하겠다. 자바스크립트 문법에 앞서서 실습 환경은 개발자 도구를 통해서 알아보도록 하겠다. 여기서는 단순히 코드만 보여주겠지만 직접 실습을 해보면 좋을 것 같다.

> ✅ 참고: 개발자 도구는 크롬 기준 `F12` 또는 `Cmd + Option + I` (Mac), `Ctrl + Shift + I` (Windows)로 열 수 있다. 개발자 도구의 Console 탭에서
> 자바스크립트를 한 줄씩 즉시 실행해보면서 학습하는 것이 가장 빠르다. 마치 자바의 jshell이나 코틀린의 REPL과 비슷한 환경이라고 보면 좋을 것 같다.

### 변수와 상수

자바에서는 변수와 상수를 정의할 때 타입과 함께 정의를 하였지만 자바스크립트는 타입을 안 적어줘도 괜찮다.

``` js
let a = 1;
```

위와 같이 정의를 하면 변수 a에 1을 대입한 것과 같다. 자바에서는 `int a = 1;`처럼 반드시 타입을 명시해줘야 했지만 자바스크립트는 `let`이라는 키워드 하나로 변수 선언을 끝낼 수 있다. 여기서
`let`은 "이 변수는 값이 변경될 수 있다"라는 의미를 가지는 키워드이다. 자바와 비교해서 보면 자바의 일반 변수 선언과 유사한 역할을 한다고 보면 좋을 것이다.

그러면 이제 정수가 아닌 문자열 변수를 정의해보자. 문자열 변수를 정의하는 방법은 아래와 같다.

``` js
let b = "자바스크립트";
```

자바스크립트에서는 문자열을 표현할 때 큰따옴표(`"`)와 작은따옴표(`'`)를 모두 사용할 수 있다. 자바에서는 큰따옴표는 문자열, 작은따옴표는 문자(char)를 의미했지만 자바스크립트는 그런 구분이 없다. 다만,
프로젝트마다 컨벤션이 있을 수 있으므로 한 가지 스타일로 일관성 있게 사용하는 것을 권장한다.

그러면 여러분이 위의 실습을 통해 변수를 정의하고 엔터를 치면 아래와 같이 `undefined`라고 나오는 것을 확인 했을 것이다.

![image01](./assets/01.png)

그러면 개발자 도구 창에 `3 + 5`라고 작성해보자. 그러면 아마 아래와 같이 숫자 8이 나오는 것을 볼 수 있을 것이다.

![image02](./assets/02.png)

그러면 이 숫자 8과 `undefined`의 차이를 좀 알아보자. 개발자 도구에서 엔터를 쳤을 때 나오는 이 값은 해당 명령문에 대한 반환값을 의미하는 것이다. 즉, 3과 5를 더했을 때 숫자 8이 나오는 반환 값이
존재하므로 개발자 도구에 숫자 8이 나오는 것이고 변수에 값을 할당에서 정의하는 행위는 반환값이 없으므로 `undefined`라고 나오는 것이다. 잠시 후에 알아 볼 함수를 정의하는 것도 반환값이 없다면
`undefined`라고 나올 것이고 결과 값이 없다면 그 값이 개발자 도구창에 나올 것이다.

여기서 `undefined`라는 값에 대해서 좀 더 짚고 넘어갈 필요가 있다. 자바스크립트에서 `undefined`는 "값이 정의되지 않았다"라는 의미를 가지는 특수한 값이다. 자바의 `null`과 비슷해 보일 수
있지만 자바스크립트에는 `null`도 별도로 존재하기 때문에 둘은 명확히 다르다. 간단히 정리하자면 `undefined`는 "아직 값이 할당되지 않은 상태"이고, `null`은 "개발자가 의도적으로 비어있는 값을
할당한 상태"라고 이해하면 좋다. 백엔드 개발자가 자바스크립트를 처음 접할 때 가장 헷갈려 하는 부분 중에 하나이니 이 차이를 꼭 기억해두자.

그러면 여기서 1가지 의문이 들 것이다.

> 자바처럼 변수 할당하는 것은 비슷한데 자바스크립트는 타입이 없나요?

위의 물음에 일반적으로 타입이 없다라고 말씀하시는 분들도 계시지만 필자의 생각으로는 자바스크립트에도 타입은 존재한다라고 말할 수 있을 것이다. 그 이유는 바로 `typeof`라는 키워드 때문이다. 위의 선언된 변수에
대해서 실습을 해보도록 하겠다.

``` js
typeof a; // number
typeof b; // string
```

이런 이유로 자바스크립트에도 여전히 타입은 존재하고 그 타입을 알려면 `typeof`라는 키워드를 통해 알아야 한다.

다만 자바와 결정적으로 다른 부분이 있다. 자바는 컴파일 시점에 타입이 결정되는 정적 타입 언어인 반면, 자바스크립트는 실행 시점에 값에 따라 타입이 결정되는 동적 타입 언어이다. 즉, 아래와 같은 코드도
자바스크립트에서는 아무런 에러가 나지 않는다.

``` js
let a = 1;        // 이 시점에 a는 number
a = "hello";      // 이 시점에 a는 string
a = true;         // 이 시점에 a는 boolean
```

자바였다면 `int a = 1;` 이후에 `a = "hello";`라고 할 경우 컴파일 에러가 나겠지만 자바스크립트는 그저 변수에 다른 타입의 값을 다시 할당했을 뿐이라고 받아들인다. 이 점이 자바스크립트의 가장 큰
유연성이자 동시에 가장 큰 함정이기도 하다. 그래서 등장한 것이 바로 우리가 잘 아는 TypeScript인데, 이 시리즈에서는 우선 순수 자바스크립트만 다루도록 하겠다.

다음으로 상수에 대해 알아보자. 자바에서 상수를 선언할 때는 `final` 키워드를 통해서 상수를 선언하였는데 자바스크립트에서는 `const`라는 키워드를 사용한다. 상수 변수 네이밍 규칙은 자바와 동일하다. 그러면
한번 상수를 정의해보자.

``` js
const PI = 3.14;
```

그리고 자바스크립트도 자바처럼 상수에 값을 변경하려고 하면 안된다. 만약 변경하려고 한다면 아래와 같은 에러가 발생할 것이다.

![image03](./assets/03.png)

여기서 한 가지 중요한 컨벤션을 짚고 넘어가자. 자바스크립트에서는 변수를 선언할 때 가능한 `const`를 우선적으로 사용하는 것을 권장한다. 변경할 필요가 있을 때만 `let`을 사용하는 것이다. 이는 자바에서
가능한 `final`을 붙여서 불변성을 보장하려는 것과 같은 맥락이다. 변수가 중간에 변경되지 않는다는 것을 보장할 수 있다면 코드를 읽고 디버깅하기가 훨씬 수월해지기 때문이다.

### 로그

자바스크립트도 자바처럼 로그를 찍을 수 있다. 자바에서는 lombok의 `log`나 `System.out.println`을 통하여 로그 출력문을 작성할 수 있었지만 자바스크립트는 아래처럼 `console.log`를
통해 로그를 찍을 수 있다.

``` js
console.log('Hello World!');
```

혹은 변수에 있는 값을 출력하고 싶다면 아래와 같이 해주면 된다.

``` js
let a = 3;
console.log(a); // 숫자 3 출력
```

그런데 독자들이 실습을 하면서 1가지 의문사항이 생길 수도 있다. 위와 같이 실습을 하면 아래와 같은 화면처럼 값이 출력 되고 `undefined`라고 찍히는 것도 볼 수 있을 것이다.

![image04](./assets/04.png)

숫자 3은 `console.log`를 통해 나온 실행 결과물로 보면 좋을 것이고 `undefined`는 `console.log`에 대한 반환 값을 의미하는 것이다.

이 부분도 앞에서 설명한 "반환 값" 이야기와 같은 맥락이다. `console.log` 함수는 콘솔에 무언가를 출력하는 부수 효과(side effect)는 만들지만, 그 자체로 어떤 값을 반환하지는 않는다. 그래서
개발자 도구에서 마지막 표현식의 평가 결과로 `undefined`가 한 번 더 찍히는 것이다. 자바의 `void` 메서드를 호출했을 때를 생각하면 이해가 쉬울 것이다.

### alert

다음으로는 `alert`에 대한 것에 대해서도 알아보겠다. `alert`에는 브라우저 창에 알림창을 띄워주는 기능을 한다. 이것을 변수와 조합해서 사용할 수 있다.

``` js
const PI = 3.14;
alert('PI = ' + PI);
```

위와 같이 작성하여 실행을 하면 아래와 같은 결과처럼 브라우저에서 기본으로 제공해주는 알림창이 나올 것이다.

![image05](./assets/05.png)

여기서 한 가지 더 짚고 갈 부분이 있다. 위 코드에서 `'PI = ' + PI` 부분을 보면 문자열과 숫자를 `+` 연산자로 합치고 있다. 자바에서도 비슷하게 문자열과 다른 타입을 `+`로 연결하면 자동으로
문자열로 변환되어 합쳐졌는데, 자바스크립트도 동일하게 동작한다. 이런 것을 **암묵적 형변환**이라고 부르는데, 자바스크립트는 자바보다 훨씬 다양한 상황에서 암묵적 형변환이 일어나기 때문에 가끔 예상치 못한 결과가
나오기도 한다. 예를 들어 `1 + '1'`은 `'11'`이 나오는 식이다. 이런 점은 잠시 후에 살펴 볼 논리 연산자에서도 영향을 미치니 미리 알아두면 좋다.

또한 `alert`은 사용자가 확인 버튼을 누르기 전까지 자바스크립트의 실행을 멈추게 만든다는 특징이 있다. 그래서 운영 코드에서는 거의 사용하지 않고, 학습이나 간단한 디버깅 용도로만 쓰는 경우가 대부분이다.

### 논리 연산자

다음으로 논리 연산자에 대해 알아보자. 자바스크립트도 자바처럼 논리 연산자를 가지고 있다. 단 차이가 있다면 등호 연산자에서 `==`를 쓰냐 `===`를 쓰냐 차이가 존재한다. 자바스크립트에서는 등호 연산자로
`==`과 `===`를 제공하는데 `===`을 쓸 경우 타입까지 같은지 체크를 해준다.

![image06](./assets/06.png)

만약 서로 다른 타입으로 `===` 비교를 진행하였다면 아래처럼 `false`를 반환할 것이다.

![image07](./assets/07.png)

그런데 만약 서로 다른 타입이라고 하더라고 값이 논리상 같아 보인다면 `==`를 쓰면 `true`가 나온다.

![image08](./assets/08.png)

여기서 우리가 원하는 것은 자바처럼 타입이 다르면 다르다라고 `false`를 반환하기를 원할 것이다. 그래서 우리는 자바스크립트를 작성해서 비교 연산을 진행하려면 `==`보다는 `===`을 사용하는 것을 추천한다.

이 부분은 자바스크립트를 처음 다루는 백엔드 개발자가 가장 많이 실수하는 부분 중에 하나이다. 왜냐하면 `==`가 너무 익숙하기 때문이다. 자바에서 `==`는 원시 타입이면 값 비교, 참조 타입이면 참조 비교를
했지만, 자바스크립트의 `==`는 그것과는 또 다르게 동작한다. 자바스크립트의 `==`는 "두 값을 같은 타입으로 변환한 후에 비교"한다. 앞서 설명한 암묵적 형변환이 비교 연산에서도 일어나는 것이다. 그래서
`1 == '1'`이 `true`가 나오는 것이고, 더 극단적인 예시로는 `0 == false`도 `true`가 나오는 것이다.

이런 암묵적 형변환은 코드를 작성할 때는 편할 수도 있지만, 디버깅할 때는 정말 골치 아픈 버그를 만들어낸다. 그래서 자바스크립트 진영에서는 `===`를 사용하는 것을 강하게 권장하고 있다. ESLint와 같은 정적
분석 도구에서도 기본 규칙으로 `===` 사용을 강제하고 있는 경우가 많다.

만약 다름을 비교하려면 `!==`를 사용하면 된다. 해당 연산자는 타입까지 체크를 해준다. 만약 값만 같은지 다른지 여부를 보려면 `!=`를 해주면 된다. 정리하자면 비교 연산자는 아래와 같다.

- `===`: 값과 타입이 모두 같은지 비교 (권장)
- `==`: 형변환 후 값만 비교 (비권장)
- `!==`: 값과 타입이 다른지 비교 (권장)
- `!=`: 형변환 후 값만 다른지 비교 (비권장)

그 외 `>`, `<`, `>=`, `<=`와 같은 비교 연산자나 `&&`(AND), `||`(OR), `!`(NOT)과 같은 논리 연산자는 자바와 동일하게 동작하니 별도 설명은 생략하겠다.

### 조건문

자바스크립트에서도 자바와 같이 조건문을 제공해준다. 그러면 바로 실습을 해보자.

``` js
let a = 1;

if (a === 1) {
    console.log('number는 1입니다.');
} else {
    console.log('number는 1이 아닙니다.');
}
```

문법적으로는 자바와 거의 동일하다. `if`, `else if`, `else`의 구조를 그대로 사용하면 되고, 조건식에 들어가는 값이 자바스크립트의 다양한 타입이 될 수 있다는 점만 유의하면 된다.

여기서 자바스크립트만의 재미있는 특징이 하나 있다. 바로 **truthy**와 **falsy**라는 개념인데, 조건식에 boolean이 아닌 값이 들어가도 자바스크립트가 알아서 true 또는 false로 판단해준다.
자바였다면 `if (a)`처럼 작성했을 때 `a`가 boolean이 아니면 컴파일 에러가 발생했지만, 자바스크립트는 그렇지 않다.

falsy로 평가되는 값들은 `false`, `0`, `''`(빈 문자열), `null`, `undefined`, `NaN` 정도이고, 그 외의 모든 값은 truthy로 평가된다. 그래서 아래와 같은 코드도
가능하다.

``` js
let name = "양성빈";

if (name) {
    console.log('이름이 있습니다.');
}
```

위 코드는 `name`이 빈 문자열이 아니라면 `'이름이 있습니다.'`를 출력한다. 백엔드 개발자 입장에서는 코틀린의 null 체크나 자바의 null/empty 체크와 비슷한 패턴으로 활용할 수 있다.

간단한 내용이니 여기서 조건문은 여기서 마무리해보도록 하겠다.

### 배열과 반복문

자바스크립트에서 배열은 아래와 같이 선언할 수 있다.

``` js
const arr = [];
```

위와 같이 선언하면 비어있는 배열 하나가 생성된 것이다. 그런데 여기서 자바와 다른 점이 존재한다. 자바같은 경우 배열이 한번 정해지면 그 사이즈를 변경할 수 없다. 하지만, 자바스크립트는 중간의 사이즈를 변경할 수
있다. 마치 자바의 컬렉션의 `ArrayList`와 같은것과 생각하면 된다. 그럼 위에서 선언한 배열에 값을 넣으려면 어떻게 해야할까? 바로 아래와 같이 작성하면 된다.

``` js
arr.push(10);
arr.push(20);
arr.push(30);
```

![image09](./assets/09.png)

여기서 유심히 볼만한 부분은 `push` 함수는 반환 값이 `undefined`가 아닌 해당 배열의 사이즈를 반환한다라는 것을 볼 수 있다. 그러면 배열을 출력해보자.

``` js
console.log(arr); // [10, 20, 30]
```

주석에 달아논 것처럼 출력이 이쁘게 잘 되는 것을 볼 수 있을 것이다. 또한, 몇번째 인덱스에 어떤 값이 들어가는지도 확인이 된다.

![image10](./assets/10.png)

여기서 또 한 가지 자바와 다른 부분이 보인다. 우리는 `arr`를 `const`로 선언했음에도 불구하고 `push`로 값을 넣을 수 있었다. 자바였다면 `final` 변수에 그런 행위를 하더라도 컴파일 에러가 나지
않았을 것이고, 이는 사실 자바스크립트도 같은 원리이다. `const`는 "변수가 가리키는 참조를 변경하지 못하게" 하는 것이지, "참조가 가리키는 객체의 내부 값을 변경하지 못하게" 하는 것이 아니다. 즉,
`arr = [1, 2, 3]`처럼 새로운 배열을 다시 할당하려고 하면 에러가 나지만, 기존 배열에 값을 추가하거나 빼는 것은 가능하다는 의미이다. 자바의 `final List<Integer> list`도 동일하게
`list.add(...)`는 가능하지만 `list = new ArrayList<>()`는 불가능한 것과 같은 맥락이다.

자바스크립트도 자바처럼 배열의 몇번째 인덱스에 접근하는 것은 같다.

``` js
console.log(arr[1]); // 20
```

그리고 배열의 길이를 알 고 싶을 때는 `length`를 이용하면 배열의 길이를 알 수 있다.

``` js
console.log(arr.length); // 3
```

여기서 약간 흥미로운 부분은 자바의 배열은 `arr.length`처럼 메서드 호출이 아닌 필드 접근으로 길이를 가져왔는데, 자바스크립트도 동일하게 `length`라는 속성으로 접근한다는 점이다. `ArrayList`
였다면 `size()` 메서드를 호출했어야 했지만 자바스크립트는 그냥 `length`라는 속성에 접근한다.

또한, 배열을 자를 수도 있다. 아래와 같이 `splice`를 사용하면 되는데 첫번째 인자로는 짜르기 시작할 인덱스 위치고 2번째 인자로는 몇개를 짜를지를 적어주면 된다.

``` js
arr.splice(1, 1); // [20]
```

이렇게 하면 1번째 인덱스가 잘려나가고 기존 배열에는 `[10, 30]`이 남을 것이다. 그리고 `splice`의 반환값을 보면 잘려나간 부분이 새로운 배열로 반환되는 것을 알 수 있다. 즉, `splice`는
원본을 변경하면서 동시에 잘라낸 부분을 돌려주는 함수라고 이해하면 좋겠다.

![image11](./assets/11.png)

다음으로 배열과 반복문 조합을 알아보도록 하겠다. 아래와 같이 배열을 정의하고 반복문을 돌려보자. 반복문의 문법은 자바와 거의 동일하다.

``` js
const arr = [1, 2, 3, 4, 5];

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
```

이렇게 하면 배열을 순회하면서 해당 인덱스에 맞는 원소가 하나씩 출력이 될 것이다.

![image12](./assets/12.png)

자바의 `for (int i = 0; i < arr.length; i++)`와 너무도 닮아있어서 별도의 설명이 필요 없을 정도이다. 다만 `int` 대신 `let`을 사용한다는 점만 다르다. 백엔드 개발자가
자바스크립트를 처음 만났을 때 가장 먼저 친숙함을 느끼는 부분이 바로 이 반복문이 아닐까 싶다.

### 함수

다음으로 자바스크립트의 함수를 선언하는 방식에 대해 알아보자. 자바스크립트에서 함수를 선언하는 방법은 `function` 키워드를 이용하면 된다.

``` js
function addTwoNumber(one, two) {
    return one + two;
}
```

위의 함수는 두 인자를 받아서 더하는 것을 반환하는 함수이다. 자바와 비교해보면 자바는 함수를 선언할 때 반드시 클래스 안에 메서드 형태로 선언해야 했고, 반환 타입과 파라미터 타입을 모두 명시해야 했다. 하지만
자바스크립트는 클래스 없이 단독으로 함수를 선언할 수 있고, 반환 타입과 파라미터 타입을 명시할 필요가 없다. 이건 자바스크립트가 객체지향 언어이면서 동시에 함수형 언어의 성격도 가지고 있기 때문에 가능한 일이다.

이제 실제 호출을 해보자. 호출하는 방법은 직접 함수 시그니쳐를 적어서 호출이 가능하고 함수를 변수에 할당할 수 있다.

``` js
let result = addTwoNumber(3, 5);
```

![image13](./assets/13.png)

또한 자바스크립트는 함수를 마치 변수처럼 취급할 수 있다. 마치 자바의 람다처럼 활용할 수 있다라는 것이다.

``` js
const addTwoNumber = (one, two) => {
    return one + two;
}
```

위와 같은 형태를 **화살표 함수(arrow function)**라고 부른다. 자바의 람다 표현식인 `(one, two) -> one + two`와 매우 유사한 모양인 것을 알 수 있다. 화살표 함수는 ES6에서
도입된 비교적 최신 문법이고, 일반 `function` 키워드를 사용한 함수보다 더 짧게 작성할 수 있다는 장점이 있다.

이를 실행하면 아래와 같이 나오는 것을 볼 수 있다.

![image14](./assets/14.png)

이처럼 자바스크립트는 함수를 변수처럼 사용할 수 있다. 이를 이용하면 함수를 파라미터에 넣는 행위도 가능해진다. 아래의 코드를 입력해보자.

``` js
const wrapperFunction = (func) => {
    const result = func(10, 20);
    console.log(result);
}
```

그리고 아래와 같이 호출을 하는데 `addTwoNumber`를 마치 변수처럼 넘겨주면 실행이 잘 되는 것을 볼 수 있다.

``` js
wrapperFunction(addTwoNumber);
```

![image15](./assets/15.png)

그러면 세부동작을 살펴보자. wrapperFunction을 호출할 때 인자로 함수를 넣어줬다. 그러면 그 함수는 내부에 func를 호출하는 부분에서 call이 된다. 이처럼 자바스크립트는 자바와 다르게 함수를
1급시민으로 간주한다. 간단히 말하면 변수처럼 함수를 쓸 수 있다라고 생각하면 좋을 것 같다.

여기서 "1급 시민(first-class citizen)"이라는 표현이 처음 나왔는데, 이 개념은 자바스크립트를 깊이 있게 이해하기 위해 반드시 짚고 넘어가야 한다. 1급 시민이라는 것은 다음과 같은 특성을 가진다는
것이다.

- 변수에 할당할 수 있다.
- 다른 함수의 인자(파라미터)로 전달할 수 있다.
- 다른 함수의 반환 값으로 사용할 수 있다.

자바에서는 메서드 자체는 1급 시민이 아니었기 때문에 람다나 메서드 레퍼런스 같은 우회적인 방법을 사용해야 했다. 자바 8 이전에는 함수 하나를 인자로 넘기기 위해 `Runnable`이나 `Comparator` 같은
인터페이스를 익명 클래스로 구현해야 했던 것을 기억할 것이다. 하지만 자바스크립트는 처음부터 함수를 1급 시민으로 다루기 때문에 그런 우회 없이 자연스럽게 함수를 값처럼 다룰 수 있다.

이런 특성 때문에 자바스크립트에서는 콜백 함수, 고차 함수와 같은 함수형 패러다임을 매우 자연스럽게 사용한다. 잠시 후 살펴 볼 Ajax의 `onreadystatechange`나 `fetch`의 `then`도 이런
함수의 1급 시민성을 활용한 것이라고 보면 된다.

## JSON

JSON은 Javascript Object Notation의 약자로 쉽게 말해 자바스크립트 객체 표기법을 의미하는 것이다. 그런데 여기서 주목할 점은 표기법이라는 점이다. 즉, **자바스크립트에서 객체를 표기하는
방법을 빌려온 것이지 분명 자바스크립트 객체와는 다르다는 점**이다. JSON은 서로 다른 언어로 작성된 애플리케이션 사이에 데이터를 전송하기 위한 일종의 표준처럼 사용되고 있다. JSON과 보통 비교되는 대상은
XML인데 XML은 무겁다는 단점도 있고 요즘은 잘 사용하지 않으니 설명은 생략하겠다.

여기서 한 가지 강조하고 싶은 부분은 JSON이 "표기법"일 뿐, 자바스크립트 객체 그 자체는 아니라는 점이다. 백엔드 개발자라면 Spring에서 `@RequestBody`나 `@ResponseBody`를 통해
JSON으로 직렬화/역직렬화를 자주 다뤘을 것이다. 그때 사용하는 Jackson이나 Gson 같은 라이브러리도 결국 자바 객체와 JSON이라는 텍스트 사이의 변환을 담당하는 것이다. 자바스크립트도 본질적으로 같은
작업을 한다.

``` json
{
    "name": "양성빈",
    "age": 30,
    "address": "서울시 강남구"
}
```

JSON 문법을 보면 위와 같이 되어 있다. JSON은 key와 value로 나뉜다. 위의 코드를 보면 name이라는 key와 "양성빈"이라는 value가 묶여 있듯이 말이다. 즉, key와 value가 쌍으로
존재한다라는 것이다. 그리고 key와 value 사이에는 콜론이 위치하고 그리고 하나의 key와 value 쌍 사이에는 ,로 나눠주고 있다. 이런 이유로 마지막 key와 value에는 ,가 없다.

또한, key에는 문자열 형태만 올 수 있고 값에는 문자열이나 숫자 혹은 다른 값들이 올 수 있다. 그리고 몇가지 문법적 특징이 있는데 이건 더 복잡한 JSON 예제를 보면서 이야기 해보도록 해보자.

여기서 주의할 점은 JSON의 key는 반드시 큰따옴표(`"`)로 감싸야 한다는 것이다. 자바스크립트 객체에서는 작은따옴표를 쓰거나 따옴표를 아예 생략할 수 있지만, JSON은 표준 스펙에 의해 큰따옴표만 허용된다.
또한 마지막 항목 뒤에 콤마(trailing comma)를 붙이면 JSON 파싱 시 에러가 발생한다. 자바스크립트 객체나 자바의 일부 컬렉션 초기화에서는 trailing comma를 허용하기 때문에 이 부분에서
실수하기 쉬우니 주의해야 한다.

``` json
{
    "firstName": "Yang",
    "lastName": "Sungbin",
    "isAlive": true,
    "age": 30,
    "height": 175.4,
    "address": {
        "streetAddress": "21 2nd Street",
        "city": "NewYork",
        "state": "NY",
        "postalCode": "10021-3100"
    },
    "phoneNumber": [
        {
            "type": "home",
            "number": "212 555-1234"
        },
        {
            "type": "office",
            "number": "646 555-4567"
        }
    ],
    "children": [],
    "lootoNumbers": [3, 6, 11, 32, 37, 42],
    "spouse": null
}
```

위의 JSON 예시에서는 앞서 살펴본 예시보다 복잡하다. 여기서는 앞에서 설명 안한 문법적인 특징들이 몇가지 존재한다. 위의 isAlive라는 key를 보면 value값으로 문자열도 아니고 숫자도 아닌
boolean형 값이 있다. JSON에서는 value값으로 boolean형 값도 가능하다. 또한 숫자에서 정수형과 실수형 모두 가능하고 또한, JSON의 값으로 또 다른 JSON을 포함하는게 가능하다. 또한 배열도
값으로 가질 수 있다. 또한 spouse라는 key에 value값으로 null이 나오고 있는데 값으로 null도 가능하다.

정리하자면 JSON의 value로 사용 가능한 타입은 다음과 같다.

- 문자열 (반드시 큰따옴표로 감싸야 함)
- 숫자 (정수, 실수 모두 가능)
- boolean (`true` / `false`)
- 객체 (또 다른 JSON 객체)
- 배열
- null

여기서 주목할 부분은 JSON의 value로 또 다른 JSON 객체나 배열을 넣을 수 있다는 것이다. 이런 특성 덕분에 JSON은 매우 복잡한 중첩 구조의 데이터도 표현할 수 있다. 백엔드에서 자주 다루는 관계형
데이터를 표현할 때, 1:N 관계는 배열로, 1:1 관계는 중첩 객체로 자연스럽게 표현할 수 있는 것이다.

그러면 이런 JSON의 문법적 특징을 외워야 할까? 전혀 외울 필요는 없다고 생각한다. 그냥 눈으로 보면서 익숙해지는게 좋을 것이다.

### 자바스크립트로 JSON 다루기

이제 자바스크립트의 객체와 JSON이 서로 다르다는 것을 확인해보자. 이걸 확인하려면 둘 사이에 각각 변환을 해보면 된다. Javascript의 객체를 JSON 문자열로도 바꿔보고 그리고 JSON 문자열을
Javascript 객체로도 변경해보면 뭐가 다른지 한 눈에 알 수 있을 것이다. 여기서 용어를 알고 넘어가면 좋을 것 같은데 Javascript의 객체를 JSON으로 만드는 행위를 **직렬화**라고 표현한다.
자바스크립트 객체를 전송하기 위해서는 이런 직렬화 과정이 필요하다. 여기에서 `JSON.stringify`라는 함수가 사용된다. 이 함수를 사용하면 자바스크립트 객체를 JSON으로 변환해준다. 그리고 반대 과정을
하는 것을 **역직렬화**라고 표현한다. 이 과정에서는 `JSON.parse`라는 함수가 사용된다.

> 📝 용어 정리
>
> - 직렬화: 특정 프로그래밍 언어의 객체를 메모리에서 파일이나 네트워크등 다른 곳으로 전송하기 위해 데이터를 변환하는 것을 말한다.
> - 역직렬화: 직렬화의 반대 과정

직렬화와 역직렬화라는 용어는 백엔드 개발자에게 매우 친숙한 개념일 것이다. 자바에서도 `Serializable` 인터페이스나 Jackson의 `ObjectMapper.writeValueAsString()` /
`readValue()` 같은 메서드로 비슷한 일을 했었다. 그 시점에서 우리가 다룬 것은 "자바 객체 ↔ JSON 문자열" 변환이었고, 자바스크립트에서는 "자바스크립트 객체 ↔ JSON 문자열" 변환을 하는
것이다. 본질적으로는 같은 작업을 하는 것이다.

여기서 핵심은 **JSON은 항상 문자열(string)이라는 것**이다. 네트워크를 타고 가는 것은 결국 바이트의 나열이고, 그 바이트는 결국 문자열로 인코딩된다. 그래서 자바스크립트 객체 형태로는 다른 시스템에
전송할 수 없고, 반드시 JSON 문자열로 직렬화해서 전송해야 하는 것이다. 그리고 받은 쪽에서는 그 문자열을 다시 자기 언어의 객체로 역직렬화해서 사용한다.

우리가 이후 Ajax로 데이터를 주고 받을 때 이 직렬화, 역직렬화 과정이 필요하기 때문에 반드시 알고 있어야 한다. 그럼 이제 실습을 해보자. 먼저 자바스크립트의 객체를 만드는 과정을 살펴보자.

``` js
const obj = {
    name: "양성빈",
    age: 30
};
```

자바스크립트 객체를 만들때 JSON과 달리 key값은 문자열로 안 하고 그 값을 그대로 작성해줘도 좋다.

이 부분이 바로 JSON과 자바스크립트 객체의 가장 가시적인 차이점이다. JSON에서는 key를 반드시 `"name"`처럼 큰따옴표로 감싸야 했지만, 자바스크립트 객체에서는 `name`이라고 그냥 적어도 되고,
`"name"`이나 `'name'`이라고 따옴표로 감싸도 된다. 자바스크립트는 이런 부분에서 매우 유연하다.

![image16](./assets/16.png)

그럼 선언한 자바스크립트 객체를 JSON으로 직렬화해보겠다.

``` js
JSON.stringify(obj);
```

이렇게 하면 아래와 같이 잘 변환된 것을 알 수 있다.

![image17](./assets/17.png)

직렬화 결과를 자세히 보면 key가 모두 큰따옴표로 감싸진 것을 볼 수 있다. 이는 `JSON.stringify`가 자바스크립트 객체를 JSON 표준 스펙에 맞춰서 변환해주기 때문이다. 그리고 결과 타입은 우리가
앞서 이야기한 대로 "문자열"이다. `typeof JSON.stringify(obj)`를 해보면 `"string"`이라고 나오는 것을 확인할 수 있을 것이다.

그러면 이제 다시 역직렬화를 통해 다시 JSON 문자열을 자바스크립트 객체로 변경해보자.

``` js
let json = JSON.stringify(obj);
JSON.parse(json);
```

위와 같이 작성하면 역직렬화가 된 것을 알 수 있다.

![image18](./assets/18.png)

`JSON.parse`로 만들어진 결과는 다시 자바스크립트 객체이기 때문에 `typeof`를 확인하면 `"object"`라고 나올 것이다. 그리고 이 객체는 `.` 접근자로 속성에 바로 접근할 수 있다. 예를 들어
`JSON.parse(json).name`처럼 작성하면 `"양성빈"`이라는 값을 가져올 수 있는 것이다.

이 두 함수만 잘 알아두면 자바스크립트와 백엔드 사이의 모든 데이터 통신을 무리 없이 처리할 수 있다. 이제 그 통신 자체에 대해 살펴보러 가보자.

## XHR을 활용한 AJAX 요청 보내기

다음으로 XHR을 이용해서 AJAX 요청을 보내는 방법에 대해 알아보자. 우리가 만든 API 서버와 상호작용하는 부분이니 자세히 살펴보도록 하겠다. 일단 용어부터 살펴보면 좋을 것 같다. "XHR을 활용한~"이라는
문구에서 XHR은 뭔가 일종의 도구처럼 느껴지고 XHR이라는 도구를 이용해서 AJAX 요청을 보낼 수 있다라는 의미처럼 느껴진다.

XHR은 자바스크립트에서 Ajax 요청을 보낼 수 있도록 제공해주는 내장 객체이다. 여기서 내장 객체라는 말은 기본 라이브러리라고 보면 좋을 것 같다. 그러면 XHR과 Ajax는 무엇의 줄임말인지 알아보자. XHR은
XMLHttpRequest의 줄임말이고 Ajax는 Asynchronous Javascript and XML의 줄임말이다. 여기서 보면 둘다 XML이라는 용어가 보이는 것을 알 수 있다. 원래 이 XHR과 Ajax가
처음 정의되었을 때는 데이터 전송 포맷으로 XML이 주로 사용되었다. 따라서 여기 이름에 각각 XML이라는 말이 들어가져 있으나 현재에는 XML보다는 JSON을 주로 전송하고 있다.

아무튼 XHR은 XML을 포함한 Http 요청을 보낼 수 있는 객체라는 의미인데 Ajax는 무슨 의미일까? 여기서 Asynchronous라는 말은 비동기라는 의미이기에 직역하면 비동기 자바스크립트와 XML이라는
의미가 된다. 여기서 핵심적인 단어는 이 비동기라는 말이다. Ajax에서의 비동기는 여러가지 의미를 가지고 있는데 Ajax 요청이 완료되기 전까지 Javascript 코드가 대기 중인 상태가 아니라 완료되면 실행될
수 있는 로직을 지정하는 부분이 있는데 바로 이 부분이 비동기적 특성을 가지고 있다.

여기서 "비동기"라는 개념을 백엔드 관점에서 한 번 더 짚어보면 좋겠다. 백엔드에서도 `CompletableFuture`나 코루틴, Spring WebFlux의 `Mono`/`Flux`처럼 비동기 처리를 다뤄 본
경험이 있을 것이다. 핵심 아이디어는 같다. "어떤 작업이 끝날 때까지 멈춰서 기다리지 않고, 다른 일을 하다가 그 작업이 끝나면 알림을 받아서 후속 처리를 한다"는 것이다.

자바스크립트에서 Ajax는 네트워크 요청이라는 시간이 오래 걸리는 작업을 동기적으로 처리하면 그동안 브라우저 화면이 멈춰버리기 때문에, 이를 비동기로 처리해서 사용자 경험을 부드럽게 만들기 위한 도구라고 이해하면
된다. 그래서 우리는 "요청을 보낸다"는 행위와 "응답을 받았을 때 무엇을 할지"를 분리해서 코드를 작성해야 한다.

아무튼 Ajax를 사용하면 웹 페이지를 새로고침 없이 서버에서 데이터를 가져와서 화면을 갱신해줄 수 있다. 이를 통해 더 나은 사용자 경험을 제공해줄 수 있는 것이다. 이제 본격적으로 실습을 해보자.

먼저 서버쪽의 RestController를 만들어보자.

``` kotlin
package me.sungbin.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class NoParameterAjaxRestController {

    @GetMapping("/get-with-no-parameter")
    fun getWithNoParameter(): String {
        return "파라미터가 없는 GET 요청"
    }
}
```

위와 같이 컨트롤러를 정의하였다. 다음으로 html과 javascript 코드를 정의해보자.

``` html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script src="./no-parameter-ajax.js"></script>
</body>
</html>
```

``` js
function onReadyStateChange(event) {
    if (AJAX_REQUEST.readyState === XMLHttpRequest.DONE) {
        if (AJAX_REQUEST.status === 200) {
            console.log(AJAX_REQUEST.responseText);
        } else {
            console.error('request failed');
        }
    }
}

const AJAX_REQUEST = new XMLHttpRequest();

AJAX_REQUEST.onreadystatechange = onReadyStateChange;
AJAX_REQUEST.open('GET', '/get-with-no-parameter');
AJAX_REQUEST.send();
```

그러면 한번 코드를 살펴보도록 하겠다. restController로 ajax요청을 받을 수 있게 정의를 해두었다. 그런데 사실 ajax 요청을 받을 수 있는 컨트롤러가 존재하는 것은 아니다. 그냥 일반적인
컨트롤러이다. `/get-with-no-parameter`로 GET 요청을 보냈을 때 "파라미터가 없는 GET 요청"이라는 응답이 나가도록 설계가 되었다.

여기서 한 가지 중요한 포인트가 있다. 서버 입장에서는 이 요청이 Ajax 요청인지 일반 브라우저 요청인지 구분하지 않는다는 점이다. HTTP 프로토콜 레벨에서는 둘 다 똑같은 GET 요청일 뿐이고, 서버는 그저
요청을 받아서 응답을 돌려줄 뿐이다. Ajax라는 것은 어디까지나 클라이언트(브라우저) 쪽에서 "비동기적으로 서버와 통신하는 방식"을 의미하는 것이다. 그래서 백엔드 개발자 입장에서는 평소에 만들던 REST
컨트롤러를 그대로 만들면 되고, 프론트엔드에서 그 컨트롤러를 어떤 방식으로 호출하든 신경 쓰지 않아도 된다.

다음으로 js코드를 살펴보도록 하겠다. js코드를 보면 먼저 함수 하나가 선언되어 있다. onReadyStateChange라는 함수가 하나 선언되어 있다. 그리고 아래쪽으로 가보면 AJAX_REQUEST라는 상수가
하나 선언되어 있다. 그리고 그 상수에 XMLHttpRequest 즉, XHR 객체를 `new`라는 연산자로 객체를 생성하여 넣어주고 있다. 그리고 아래쪽을 보면
AJAX_REQUEST.onreadystatechange라는 변수가 있는데 해당 변수에 함수를 넣어주고 있다. 여기서 onreadystatechange라는 변수는 특별한 의미를 가지고 있는데 이 ajax
request 즉, XMLHttpRequest에 readyState라는 상태 값이 있는데 이 XHR 객체가 어떤 상태인지 예를 들면, Ajax 요청을 시도 했는지, 이 Ajax 요청에 대한 응답이 왔는지, 이런
것들을 기록을 하는 상태 값이다. 해당 상태 값에 변화가 생겼을 때 여기 있는 onreadystatechange라는 곳에 등록된 함수가 실행이 될 준비를 하는 것이다.

여기서 readyState의 값이 어떤 식으로 변화하는지 좀 더 자세히 살펴보면 이해가 더 쉬울 것이다. readyState는 0부터 4까지 총 5개의 값을 가질 수 있다.

- 0 (UNSENT): XHR 객체가 생성됐지만 `open()`이 호출되지 않은 상태
- 1 (OPENED): `open()`이 호출된 상태
- 2 (HEADERS_RECEIVED): `send()`가 호출되어 서버의 응답 헤더가 도착한 상태
- 3 (LOADING): 응답 body를 다운로드 중인 상태
- 4 (DONE): 모든 응답 데이터를 받은 상태

이 모든 단계마다 `onreadystatechange`에 등록된 콜백 함수가 호출된다. 그래서 우리는 그 중에서 4(DONE) 상태일 때만 응답 데이터를 처리하면 되는 것이다. `XMLHttpRequest.DONE`
이라는 상수는 사실 그냥 숫자 4와 같은 값이다. 직접 `4`라고 적어도 되지만 가독성을 위해 상수를 사용하는 것이 좋다.

그리고 그 다음 줄을 보면 `AJAX_REQUEST.open`을 통해서 GET 방식으로 해당 URL에 요청을 보내겠다라고 준비를 하는 단계이다. 그리고 실제 요청을 보내는 것은 `AJAX_REQUEST.send()`
함수를 호출할 때 비로소 Ajax 요청을 보내는 것이다. 그제서야 우리가 선언했던 함수가 실행이 되는 것이다. 그리고 readyState같은 경우 요청이 완료가 될 때까지 총 4번의 과정을 거친다. 그런데 우리가
관심을 가지는 부분은 4번이 바뀌는 동안에 요청이 완료된 상태만 관심을 가지기 때문에 우리가 정의한 함수에 `AJAX_REQUEST.readyState === XMLHttpRequest.DONE`와 같이 조건문을
작성해준 것이다.

또한, `status` 값도 함께 체크하고 있는데 이 값은 백엔드 개발자에게 매우 친숙한 HTTP 상태 코드이다. 200이면 성공, 4xx면 클라이언트 에러, 5xx면 서버 에러를 의미한다. 그래서
readyState가 DONE이고 status가 200일 때만 정상적인 응답을 받았다고 판단하는 것이다.

그러면 실제 실행을 해보면 아래와 같이 우리가 작성한 API와 html, js코드가 잘 나오는 것을 볼 수 있다.

![image19](./assets/19.png)

위와 같이 로그가 찍힌 것도 잘 볼 수가 있으며, 네트워크 탭을 통해 아래처럼 응답이 잘 간 것도 확인 할 수 있다.

![image20](./assets/20.png)

![image21](./assets/21.png)

여기서 네트워크 탭에서 우리가 만든 API가 xhr방식으로 잘 전송 된 것도 확인 할 수 있다. 즉, ajax로 잘 날라갔다는 것이 확인 되는 것이다.

네트워크 탭은 프론트와 백엔드 사이의 통신을 디버깅할 때 정말 유용한 도구이다. 어떤 URL로 어떤 메서드, 어떤 헤더, 어떤 body가 전송되었는지, 그리고 응답으로 어떤 status 코드와 body가 왔는지를
모두 확인할 수 있다. 백엔드 개발 시 Postman으로 확인하던 것을 브라우저에서 바로 확인할 수 있다고 보면 된다.

그러면 이제 조금 더 복잡한 예제를 들어보겠다.

``` kotlin
package me.sungbin.model

data class Bookmark(
    val name: String,
    val url: String,
)
```

위와 같이 북마크 모델을 선언하고 아래와 같이 북마크 조회 API와 등록 API를 작성해보자.

``` kotlin
package me.sungbin.controller

import me.sungbin.model.Bookmark
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class BookmarkAjaxRestController {

    private val bookmarks = mutableListOf<Bookmark>()

    @GetMapping("/bookmarks")
    fun getBookmarks(): List<Bookmark> {
        return bookmarks
    }

    @PostMapping("/bookmark")
    fun registerBookmark(
        @RequestBody bookmark: Bookmark
    ): String {
        bookmarks.add(bookmark)

        return "registered"
    }
}
```

그리고 html과 js코드를 작성해보자.

``` html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form onsubmit="return addBookmarkRequest();">
    <label>즐겨찾기 이름 : </label><input type="text" name="name"><br>
    <label>즐겨찾기 URL : </label><input type="text" name="url"><br>
    <input type="submit"><br>
</form>
<button onclick="getBookmarkListRequest();">즐겨찾기 목록 가져오기</button>
<ol id="bookmark-list">
    <!-- 여기에 즐겨찾기 목록이 나옵니다. -->
</ol>
<script src="./bookmark-ajax.js"></script>
</body>
</html>
```

``` js
function addBookmarkRequest() {
    const name = document.querySelector('input[name=name]').value;
    const url = document.querySelector('input[name=url]').value;
    const requestObject = {name: name, url: url};
    const requestJson = JSON.stringify(requestObject);

    function onReadyStateChange(event) {
        const currentAjaxRequest = event.currentTarget;

        if (currentAjaxRequest.readyState === XMLHttpRequest.DONE) {
            if (currentAjaxRequest.status === 200) {
                alert("즐겨찾기가 등록되었습니다.");
            } else {
                console.error('request failed');
            }
        }
    }

    const ajaxRequest = new XMLHttpRequest();

    ajaxRequest.onreadystatechange = onReadyStateChange;
    ajaxRequest.open('POST', '/bookmark');
    ajaxRequest.setRequestHeader('Content-Type', 'application/json');
    ajaxRequest.send(requestJson);

    return false;
}

function getBookmarkListRequest() {
    function onReadyStateChange(event) {
        const currentAjaxRequest = event.currentTarget;

        if (currentAjaxRequest.readyState === XMLHttpRequest.DONE) {
            if (currentAjaxRequest.status === 200) {
                const bookmarkListDom = document.querySelector('#bookmark-list');
                bookmarkListDom.innerHTML = '';

                const bookmarks = JSON.parse(currentAjaxRequest.responseText);
                bookmarks.forEach(bookmark => {
                    const liNode = document.createElement('li');
                    const textNode = document.createTextNode(bookmark.name + ' - ' + bookmark.url);
                    liNode.appendChild(textNode);
                    bookmarkListDom.appendChild(liNode);
                });
            } else {
                console.error('request failed');
            }
        }
    }

    const ajaxRequest = new XMLHttpRequest();

    ajaxRequest.onreadystatechange = onReadyStateChange;
    ajaxRequest.open('GET', '/bookmarks');
    ajaxRequest.send();
}
```

코드를 그러면 살펴보자. 등록 API부터 보자. 다른건 이전이랑 비슷한데 여기서 핵심은 `@RequestBody`로 Bookmark 객체를 받는 다는 것을 알 수 있다. 이 부분이 Ajax 요청의 body에
json으로 이 bookmark에 대한 body를 받는 것이다. 조회 API는 이전과 동일하니 설명을 생략하겠다.

여기서 한 가지 짚고 넘어갈 부분이 있다. 백엔드 코드만 보면 `@RequestBody Bookmark`라는 코틀린 객체를 받는 것처럼 보이지만, 실제로 네트워크를 타고 오는 것은 JSON 문자열이다. Spring
Boot는 Jackson을 사용해서 그 JSON 문자열을 자동으로 `Bookmark` 객체로 역직렬화해주는 것뿐이다. 그래서 프론트에서는 반드시 `JSON.stringify`로 자바스크립트 객체를 JSON 문자열로
직렬화한 후에 보내야 하고, `Content-Type: application/json` 헤더를 통해 "내가 보내는 body는 JSON이다"라고 서버에 알려줘야 한다. 이 헤더가 없으면 Spring은 어떻게 파싱해야
할지 모르기 때문에 415 (Unsupported Media Type) 같은 에러를 돌려준다.

다음으로 프론트 코드에 대해서 살펴보자. 프론트 코드를 보면 form 태그가 존재한다. 그리고 form 태그 안에 input 태그들이 존재한다. 해당 input 태그는 UI로 보면 알겠지만 사용자가 무언가를 입력하는
창을 보여주는 태그이다. 그리고 그 input 태그들에 name 속성으로 이름을 지정해준 것을 볼 수 있는데 해당 이름이, 등록 API의 request body로 들어가는 네이밍들과 일치하는 것을 알 수 있다.
또한, 마지막 input 태그를 보면 type이 submit으로 되어 있는 것을 볼 수 있는데 이것은 서버로 무언가 데이터를 보낼 때 자주 사용되는 타입이다. 정확히는 input의 type이 submit으로 태그를
생성하면 브라우저에 제출 버튼이 생성되고 해당 버튼을 클릭하면 input의 부모 태그인 form 태그의 onsubmit 속성의 값이 자바스크립트로 실행이 된다. 또한, onsubmit 속성의 value 값을 보면
`return` 키워드가 나와 있는데 이 부분은 이후에 설명해보도록 하겠다.

그러면 자바스크립트 코드를 보자 `addBookmarkRequest` 함수를 보면 `querySelector`로 무언가를 가져오는게 있는데 이 부분은 css때 설명을 하겠지만 지금 잠깐 설명을 해보자면
`querySelector`는 HTML의 특정 태그를 가져올 수 있다라고 보면 좋을 것이다. 지금은 input 태그의 name 속성의 값이 있는 것들을 가져오고 있는 것을 볼 수 있다. 정확히는 input 태그의
사용자가 입력한 value 값을 가져오는 것이다. 이유는 `.value`라는 것 때문이다. 다음으로 코드를 보면 자바스크립트 object로 만들고 이것을 JSON으로 직렬화를 한다. 이후는 이전에 살펴본 것과
유사하니 자세한 설명은 생략하겠다.

코드 중에 `{name: name, url: url}` 부분을 보면, 객체의 key와 변수명이 똑같다는 것을 알 수 있다. 이런 경우 ES6에서 도입된 단축 문법을 사용하면 `{name, url}`처럼 더 짧게 쓸
수도 있다. 실무에서는 이 단축 문법을 자주 쓰니 알아두면 좋다.

> ✅ 참고
>
> post 메서드로 데이터를 전달할 때 header에 Content-Type: application/json으로 넣어줘야 한다. ajax에서는 `setRequestHeader`로 지정해주면 된다.

그리고 한 가지 더 짚고 가자면 `setRequestHeader`는 반드시 `open()` 호출 이후, `send()` 호출 이전에 호출해야 한다. 순서가 바뀌면 헤더가 적용되지 않거나 에러가 발생할 수 있으니
주의해야 한다. XHR의 메서드 호출 순서는 `open()` → `setRequestHeader()` → `send()`로 정해져 있다고 기억해두면 좋다.

다음으로 보면 button 태그가 있는데 해당 태그를 보면 `onclick` 속성이 있다. 이 속성은 해당 버튼을 클릭할 때 호출되는 자바스크립트 코드를 지정할 수 있다. 그리고 자바스크립트 코드를 보면
`event.currentTarget`을 볼 수 있는데 이것은 지금은 굳이 필요 없을 수 있겠으나 만약 여러 XHR 객체를 쓸 수도 있다. 그러면 뭔가 꼬일 수도 있기에 보통은 해당 함수를 호출하는 target정보로
이용하는게 좋다. 즉, 해당 함수를 호출하는 target정보의 readyState값이 DONE이고 상태가 200일 때 id가 bookmark-list인 태그를 찾아서 해당 태그의 자식 태그들을 전부 비워주고 응답
값들을 받아와서 해당 응답 값들을 li 태그를 생성하여 넣어주는 행위를 하고 있다. 여기서 몇가지 함수와 속성에 대해 알아볼건데 먼저 `innerHTML`은 해당 태그의 HTML 태그들을 넣어주는 역할인데 뒤에서
나오는 `appendChild`와 기능이 유사하다. `createElement`가 HTML 태그들을 생성해주는 자바스크립트 내장 함수이며, `createTextNode`를 통해 텍스트를 생성해주는 함수이다. 또한,
`appendChild`는 인자로 들어가는 HTML 태그를 해당 함수를 호출하는 태그에 넣어준다고 이해하면 편할 것이다.

그리고 조회 부분의 코드를 보면 `JSON.parse(currentAjaxRequest.responseText)`라는 부분이 있다. 우리가 앞서 직렬화/역직렬화를 학습했던 부분이 실제로 활용되는 모습이다. 서버로부터
받은 응답은 `responseText`라는 속성에 문자열로 담겨 있고, 이것은 JSON 형식의 문자열이기 때문에 `JSON.parse`로 자바스크립트 객체로 변환해서 사용한다. 그리고 그 결과가 배열이기 때문에
`forEach`라는 배열 순회 메서드로 각 원소를 처리하고 있다. 이 `forEach`는 자바의 `Iterable.forEach`나 코틀린의 `forEach`와 거의 동일한 역할을 하니 백엔드 개발자에게는 매우
친숙할 것이다.

그러면 실제 실행해보고 네트워크 탭을 통해 살펴보자.

![image22](./assets/22.png)

![image23](./assets/23.png)

위의 화면은 네트워크 탭의 payload 탭이고 해당 부분은 프론트에서 request body에 들어가는 값들이 존재한다. 우리가 만든 Bookmark 값이 json꼴로 잘 들어가는 것을 볼 수 있다.

![image24](./assets/24.png)

다음으로, `fetch`로 API를 불러오는 방법에 대해 알아보자.

XHR 코드를 직접 작성해본 독자라면 느꼈을 것이다. "이거 너무 길다"라는 생각이 들었을 것이다. 매번 XHR 객체를 만들고, `onreadystatechange` 콜백을 등록하고, `open` →
`setRequestHeader` → `send`를 순서대로 호출하고, 콜백 안에서 readyState와 status를 체크하고... 단순한 요청 하나를 보내기에는 너무 많은 절차가 필요했다. 그래서 등장한 것이
바로 `fetch` API이다.

``` html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form onsubmit="return addBookmarkRequest();">
    <label>즐겨찾기 이름 : </label><input type="text" name="name"><br>
    <label>즐겨찾기 URL : </label><input type="text" name="url"><br>
    <input type="submit"><br>
</form>
<button onclick="getBookmarkListRequest();">즐겨찾기 목록 가져오기</button>
<ol id="bookmark-list">
    <!-- 여기에 즐겨찾기 목록이 나옵니다. -->
</ol>
<script src="./bookmark-ajax-fetch.js"></script>
</body>
</html>
```

``` js
function addBookmarkRequest() {
    const name = document.querySelector('input[name=name]').value;
    const url = document.querySelector('input[name=url]').value;
    const requestObject = {name: name, url: url};

    fetch('/bookmark', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObject)
    })
        .then(response => {
            if (response.status === 200) {
                alert("즐겨찾기가 등록되었습니다.");
            } else {
                console.error('request failed');
            }
        })
        .catch(error => {
            console.error('request failed', error);
        });

    return false;
}

function getBookmarkListRequest() {
    fetch('/bookmarks')
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.error('request failed');
                throw new Error('request failed');
            }
        })
        .then(bookmarks => {
            const bookmarkListDom = document.querySelector('#bookmark-list');
            bookmarkListDom.innerHTML = '';

            bookmarks.forEach(bookmark => {
                const liNode = document.createElement('li');
                const textNode = document.createTextNode(bookmark.name + ' - ' + bookmark.url);
                liNode.appendChild(textNode);
                bookmarkListDom.appendChild(liNode);
            });
        })
        .catch(error => {
            console.error('request failed', error);
        });
}
```

코드는 방금 XHR과 봤던 코드와 유사하지만 `fetch`라는 내장 함수를 사용했다. 차이는 XHR보다 간결하고 현대적인 느낌이 있다.

XHR과 비교해서 fetch가 어떤 점이 좋아졌는지 좀 더 자세히 살펴보자. 첫째, 객체를 명시적으로 만들 필요가 없다. `new XMLHttpRequest()` 같은 절차가 없고 그냥
`fetch(url, options)` 형태로 함수 한 번만 호출하면 된다. 둘째, readyState 같은 저수준 상태를 직접 체크할 필요가 없다. fetch는 응답이 완전히 도착한 시점에 한 번만 콜백이 호출되기
때문이다. 셋째, `then`과 `catch`를 체이닝하는 방식으로 콜백을 등록할 수 있어서 코드가 훨씬 읽기 쉽다.

여기서 `then`과 `catch`라는 형태가 등장하는데, 이는 fetch가 **Promise**라는 것을 반환하기 때문이다. Promise는 자바의 `CompletableFuture`나 코틀린의 `Deferred`
와 비슷한 개념으로, "지금 당장은 결과가 없지만 나중에 결과가 생길 것이라는 약속"을 표현하는 객체이다. 그 약속의 결과가 성공하면 `then`에 등록한 콜백이, 실패하면 `catch`에 등록한 콜백이 호출되는
것이다.

조회 코드를 보면 `then`이 두 번 연달아 호출되는 것을 볼 수 있는데, 첫 번째 `then`에서는 `response.json()`을 반환하고 있다. 이 `response.json()` 자체가 또 다른
Promise이기 때문에, 그 결과인 실제 파싱된 객체를 받기 위해 두 번째 `then`이 추가로 필요한 것이다. 응답 body를 JSON으로 파싱하는 것도 비동기로 처리되기 때문에 이런 패턴이 만들어진다. 이
부분은 처음 보면 헷갈릴 수 있으니 한 번씩 직접 실행해보면서 익숙해지면 좋겠다.

또 하나 주의할 점은 fetch는 4xx, 5xx 같은 HTTP 에러 상태에서도 `catch`로 가지 않는다는 것이다. 네트워크 자체가 실패한 경우(서버에 도달하지 못한 경우 등)에만 `catch`로 가고,
서버로부터 응답이 왔다면 그 status가 무엇이든 일단 `then`으로 들어온다. 그래서 위 코드처럼 `then` 안에서 `response.status === 200`을 명시적으로 체크해줘야 하는 것이다. 백엔드의
RestTemplate이나 WebClient가 4xx/5xx에서 자동으로 예외를 던지는 것과는 좀 다른 동작이니 주의가 필요하다.

아마 ajax를 학습했다면 이해가 어느정도 될 것이니 자세한 설명은 생략하겠다. 상세한 자바스크립트 설명을 드리고 싶지만, 이러면 포스팅이 너무 길어질 것 같다. 그래서 간단히만 설명을 드렸는데 자세하게 궁금한
사항이 있을 시, 댓글로 질문 작성 바란다.

## form 태그와 AJAX

다음으로 form 태그와 함께 Ajax를 활용해보는 방법에 대해 알아볼 예정이다.

``` html
<form onsubmit="return addBookmarkRequest();">
    <label>즐겨찾기 이름 : </label><input type="text" name="name"><br>
    <label>즐겨찾기 URL : </label><input type="text" name="url"><br>
    <input type="submit"><br>
</form>
```

이전에 위와 같은 form 태그를 보았을 것이다. form 태그는 원래 사용자에게 어떤 내용들을 입력 받는 기능을 수행한다. 이전에 했던 것처럼 즐겨찾기의 이름과 url을 입력받게 할 수도 있지만 더 복잡하게는
회원가입 페이지 같은 것을 만들 수도 있다. 단순히 이렇게 입력만 받는다면 크게 설명은 안 했겠지만 `document.querySelector`로 태그를 선택하여 value 속성으로 value값을 가져와서 서버로
전송할 수 있기에 우리가 유심히 살펴 본 것이다.

form 태그를 사용할 때 가장 좋은 장점은 html 태그만으로 유효성 검사를 할 수 있다. 그래서 이번에는 form 태그가 사용할 수 있는 여러가지 유효성 검사를 알아보고 이 유효성 검사 기능과 Ajax를 함께
결합하여 사용하는 방법에 대해 알아보겠다.

백엔드 개발자라면 Bean Validation(JSR-380)의 `@NotNull`, `@Size`, `@Min`, `@Max`, `@Pattern` 등을 사용해서 서버에서 유효성 검사를 했던 경험이 많을 것이다.
HTML form 태그는 그것의 클라이언트 사이드 버전이라고 생각하면 된다. 다만 클라이언트 사이드 검증만으로는 절대 보안이나 데이터 무결성을 보장할 수 없으니, 서버 사이드 검증과 함께 사용하는 것이 원칙이다.
클라이언트 사이드 검증의 목적은 어디까지나 사용자 경험 향상(불필요한 서버 요청 줄이기, 빠른 피드백 제공 등)이다.

``` html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form onsubmit="return onSubmit();">
    <label>아이디 : </label><input type="text" name="user-id" minlength="4" maxlength="20" required>
    <label>나이 : </label><input type="number" name="age" min="0" max="200">
    <label>URL : </label><input type="url" name="url">
    <input type="submit">
    <script src="./validation-check.js"></script>
</form>
</body>
</html>
```

``` js
function onSubmit(event) {
    console.log(event);

    // AJAX 요청 로직

    return false;
}
```

위의 프론트 코드가 있다고 가정하자. 먼저 html 코드부터 확인해보자. 먼저 form 태그가 존재하고 그 form 태그 안에 label과 input 태그가 존재한다. 이 input 태그에서 유효성 검사를 진행할 수
있는데 위의 코드를 보면 `minlength`, `maxlength`, `required`, `min`, `max`등이 존재한다.

`minlength`는 해당 입력 폼에 최소 길이를 설정해줄 수 있다. `maxlength`는 해당 입력 폼에 최대 길이를 설정해 줄 수 있다. 이 속성을 이용하면 입력 폼의 길이의 제약을 줄 수 있다. 그리고
`required`를 이용하면 해당 input이 반드시 입력이 되어야 한다라고 설정할 수 있다.

다음 input을 보면 이번엔 type이 number로 되어 있는 것을 볼 수 있다. 이렇게 `type`을 number로 설정하면 숫자만 들어 올 수 있다. 이렇게 type이 number로 지정을 하면 `min`이나
`max`같은 속성을 쓸 수 있는데 `min`은 입력하는 값의 최소 값이고 `max`는 입력하는 값의 최대 값을 지정할 수 있는 것이다.

다음 input을 보면 type이 url로 되어 있는 것을 볼 수 있다. 이렇게 `type`을 url로 설정을 하면 입력 값이 문자열인데 url형식인지 유효성 검사를 해줄 수 있다.

이렇게 input의 type 속성 하나만 바꿔도 브라우저가 알아서 유효성 검사를 해주고, 모바일에서는 type에 맞는 키보드(예: number는 숫자 키패드, email은 @가 있는 키패드)를 띄워준다는 부가 효과도
있다. type에는 위에서 본 것 외에도 `email`, `password`, `tel`, `date`, `time`, `color`, `range` 등 다양한 값이 존재하니 상황에 맞게 적절한 type을 사용하면
좋다. 이는 백엔드의 Bean Validation에서 `@Email`, `@URL` 같은 어노테이션을 사용하는 것과 비슷한 맥락이라고 볼 수 있다.

다음 input을 보면 type이 submit인데 앞에서 살펴봤듯이 해당 태그를 설정하면 제출 버튼이 나오고 그 버튼을 클릭했을 때 form 태그의 onsubmit의 자바스크립트 코드를 실행 시켜 준다. 실행 화면은
아래와 같다.

![image25](./assets/25.png)

위 화면을 보면 우리가 유효성 검사 조건을 위반했을 때 브라우저가 자동으로 에러 메시지를 띄워주는 것을 볼 수 있다. 이 메시지는 브라우저가 알아서 제공하는 것이라 별도의 자바스크립트 코드 없이도 동작한다. 정말
편리한 기능이다.

그러면 여기서 좀 더 살펴 볼 부분이 있다. 바로 form 태그의 `onsubmit`의 `return onSubmit();` 부분의 `return`부분이다. 여기에는 왜 `return`을 넣어줬을까? 그걸 알기
위해서 한번 `return false`하는 부분을 `return true`로 변경해보자. 즉, js 코드처럼 작성해보자는 의미이다.

``` js
function onSubmit(event) {
    console.log(event);

    // AJAX 요청 로직

    return true;
}
```

실제 바꿔서 해본 독자는 알겠지만 입력했던 값들이 전부 없어진 것을 알 수 있을 것이다. 그리고 뭔가 url도 바뀌고 네트워크 탭을 보면 뭔가 나온 것을 볼 수 있다.

![image26](./assets/26.png)

url을 자세히 보면 기존 url에 우리가 입력했던 값들이 쿼리스트링으로 붙어나간 것을 볼 수 있다. 그러면 왜 이런 일이 발생했을까? 그것을 알기 위해서는 해당 폼에 `onSubmit` 이벤트 핸들러가 어떤 식으로
동작을 하는지 이해할 필요가 있다. 해당 `onSubmit` 이벤트 핸들러 같은 경우 `return onSubmit()`으로 호출을 해주는데 이때 이 결과가 `return true`이면 form의 정의된 행동, 즉
웹 페이지에 제출하면서 웹 페이지가 이동하려는 것을 하려고 한다. 그런데 우리는 여기서 ajax 요청을 하려고 하는데 즉, 페이지를 새로고침하지 않고 서버로 요청을 보내려고 하는 것이다. 그렇기 때문에 우리는 원래
form 태그가 정의한 html의 기능을 차단시켜야 한다. 그래서 우리는 return값을 `false`로 지정해줌으로서 폼 자체가 제출되지 않게 하고 오직 ajax로만 제출하게 하는 것이다.

조금 더 풀어서 설명하자면, HTML의 form 태그는 원래 Ajax가 등장하기 훨씬 전부터 존재했던 태그이다. 즉, form 태그의 기본 동작은 "사용자가 입력한 값들을 모아서 지정된 URL로 페이지를 이동하면서
전송"하는 것이었다. 별도로 `action` 속성을 지정하지 않으면 현재 페이지의 URL로 전송되고, `method` 속성을 지정하지 않으면 GET 방식으로 전송된다. GET 방식으로 전송되면 입력값이 쿼리스트링에
붙어서 나가게 되는 것이고, 그 결과가 위 화면에서 본 것이다.

이런 form의 기본 동작은 페이지 전체가 새로고침되기 때문에 현대적인 SPA(Single Page Application) 환경에서는 거의 사용하지 않는다. 우리가 원하는 것은 페이지 새로고침 없이 Ajax로 서버와
통신하는 것이기 때문에, form의 기본 동작을 막아야 한다. 그래서 `onsubmit`에서 `return false`를 해주는 것이다.

또 하나 알아두면 좋은 방법이 있는데, `event.preventDefault()`라는 메서드를 호출하는 방법이다. 이는 이벤트 객체의 기본 동작을 막아주는 메서드인데, `return false`와 사실상 같은
효과를 낸다. 현대적인 자바스크립트 코드에서는 `return false`보다 `event.preventDefault()`를 더 많이 사용하니 알아두면 좋다.

여기까지가 자바스크립트의 기본 문법과 Ajax, 그리고 form 태그와의 결합까지 살펴본 내용이다. 백엔드 개발자 입장에서 자바스크립트를 처음 접할 때 가장 헷갈렸던 부분들을 자바/코틀린과 비교하며 짚어봤는데,
도움이 되었기를 바란다. 다음 포스팅에서는 또 다른 주제로 찾아오도록 하겠다.