---
title: "[알고리즘] 자료구조"
tags:
  - 알고리즘
image: ./assets/banner.png
date: 2025-07-12 22:33:27
series: 알고리즘
draft: false
---

![배너 이미지](./assets/banner.png)

> 해당 블로그 글은 [감자님의 인프런 강의](https://inf.run/5fM4d)를 바탕으로 쓰여진 글입니다.

## 배열

우리는 이전에 자바라는 프로그래밍 언어를 학습하면서 **배열**이 무엇인지 알고 있다. 배열은 모든 프로그래밍 언어에서 기본적으로 제공하는 자료구조이다.

배열을 이해하기 위해서는 배열이 메모리에서 어떤 모습을 하고 있는지를 알아야 한다. 일반적으로 자바에서는 배열을 선언할때 배열의 크기를 미리 지정해야 한다. 바로 아래와 같이 말이다.

``` java
int[] arr = new int[5];
```

위와 같이 배열을 선언했다면 운영체제는 메모리에서 숫자 5개가 들어갈 수 있는 연속된 빈 공간을 찾아서 순서대로 데이터의 값을 할당한다. 값을 지정을 안했다면 자료형의 기본값을 세팅한다. 여기서는 정수형 배열을 선언했기에 0으로 할당된다. 그리고 운영체제는 배열의 시작 주소 즉, 참조값을 알고 있는다. 자바에서는 이런 참조값을 힙 메모리 영역에 저장을 한다.

만약 개발자가 배열의 3번째 원소에 접근하고 싶다면 `arr[2]`로 인덱스를 통해 접근을 한다. 운영체제는 이렇게 인덱스를 이용하여 접근 명령이 떨어지면 참조값을 통해 배열의 시작 주소를 찾은 후, 인덱스만큼 커서를 옮겨서 해당 데이터에 접근할 수 있는 것이다. 이렇게 인덱스를 통해 데이터 접근 방식은 배열의 길이와 무관하기 때문에 O(1)의 성능을 지닌다. 이렇기 때문에 배열은 읽기/쓰기, 즉 참조에서 좋은 성능을 보인다.

배열의 참조 성능은 좋지만 데이터의 삽입/삭제 성능은 좋지 못한다. 왜 그럴까? 아래의 코드를 예시로 설명해보겠다.

``` java
int[] arr = {1, 2, 3, 4, 5};
```

위와 같이 배열을 선언했다고 하자. 그런데 개발자가 만약 `arr[5] = 10;`과 같은 짓을 하려고 한다고 해보자. 이러면 우리는 자바에서 예외가 터질것이라는 것을 알 수 있다. 하지만 다른 언어에서는 조금 다르다. 운영체제는 처음에 개발자한테 크기가 5인 메모리 공간을 요청 받았고 그에 맞게 연속된 메모리 공간을 찾아서 할당했다. 배열의 끝에는 다른 중요한 데이터가 있을 수 있어서 더 확장이 불가능하다. 그렇기 때문에 운영체제는 크기가 만약 6인 연속된 메모리를 다시 찾아서 할당해야만 한다. 이 뿐만이 아니다. 기존에 저장되어 있던 1부터 5까지의 데이터를 전부 새로 할당하는 공간에 복사까지 해줘야 한다.

그럼 애초에 이런일이 발생하지 않도록 배열의 크기를 1억같은 큰 수로 미리 할당하면 안될까? 이렇게 하면 일시적으로는 해결이 되는 듯 보인다. 하지만 만약 사용자가 이것보다 더 큰 배열을 원하면 어떻게 될까? 아마 위와 같은 과정이 반복될 것이다. 또한 배열 하나가 엄청 메모리를 차지하게 되고 다른 프로세스가 메모리를 점유할때 메모리가 부족하여 컨텍스트 스위칭도 빈번히 발생할 것이다. 또한 배열을 사용하지 않는 낭비되는 메모리 문제가 발생할 것이다.

배열은 이처럼 데이터를 추가/삭제하려면 내부적으로 필요한 단계가 많이 들기 때문에 성능이 별로 좋지 못하다. 하지만 이런 의문이 들것이다. 자바를 깊게 배워보신 독자라면 컬렉션 프레임워크 중에 `List`와 같은 것은 처음에 크기를 지정하지 않고 데이터 추가/삭제가 가능하다. 그럼 이 녀석은 어떻게 된 것일까? 컬렉션 프레임워크는 지금까지 설명한 배열 동작과는 살짝 다르게 동작한다. 처음에 기본 배열 크기를 지정을 해준다. 하지만 이를 넘을 시, 일정 크기만큼 배열의 크기를 늘려서 사용한다. 이 때문에 우리는 컬렉션 프레임워크를 사용할때 크기를 지정 안 하지만 내부적으로는 배열을 사용하는 것으로 볼 수 있다.

그럼 배열의 장/단점을 살펴보자.

- 장점
  - 읽기/쓰기와 같은 참조에는 O(1)의 성능을 가진다.
- 단점
  - 크기를 미리 예측하기 힘들기 때문에 메모리 낭비가 발생할 수 있다.
  - 데이터의 삽입/삭제가 비효율적이다.

## 연결 리스트 - 개념

배열은 연속된 메모리가 필요하다는 점과 초기의 배열의 크기를 모른다면 낭비가 발생할 수 있는 문제가 존재하였다. 그래서 우리의 조상님들 개발자는 이런 문제를 해결하기 위하여 고민을 하기 시작했다. 처음에는 간단한 방법을 제시하였다.

저장하려는 데이터를 메모리 공간에 분산시키고 이 데이터들을 서로 연결해주는 방식으로 개발을 해보기로 하였다. 이는 노드라는 것을 만들어서 수행하는데 노드의 구조는 참 단순하게 되어 있다. 노드는 데이터를 담는 변수 하나와 다음 노드를 가리키는 변수 하나를 가지고 있다. 데이터가 필요하다면 필요한 데이터만큼 노드를 만들어 데이터를 저장하고 다른 노드를 가리켜 연결한다. 이러한 구조를 **연결 리스트**라고 부른다.

연결 리스트는 첫 노드의 주소만 알고 있으면 다른 모든 노드에 접근이 가능하다. 또한 연결이라는 특성때문에 배열과는 또 다른 장단점을 가지고 있다.

### 연결 리스트 - 장점

연결 리스트에 데이터를 추가한다면 빈 메모리 공간 아무 곳에 데이터를 생성하고 연결해주기만 하면 되기 때문에 배열에서 초기 크기를 알아야 한다는 단점이 해결되었다. 또한 배열에서는 데이터를 중간에 삽입하려면 그 뒤에 있는 데이터들을 하나씩 다 미뤄주고 넣어줘야 하기 때문에 오버헤드가 많이 발생하는 반면에 연결 리스트는 중간에 데이터를 삽입하려면 다음 가리키는 노드만 바꿔주면 되기 때문에 아주 간단하다. 이러한 과정은 데이터 삭제를 할때도 마찬가지이다.

### 연결 리스트 - 단점

배열은 메모리에 연속된 공간에 할당되어 있어서 시작 주소만 알면 뒤에 있는 데이터 접근이 굉장히 쉽다. 인덱스로 접근이 가능하기 때문에 O(1)의 성능을 가진다. 반면 연결리스트는 데이터들이 다 떨어져 있기 때문에 인덱스 접근이 불가능하다. 만약 3번째 노드를 찾으려면 첫번째 노드에서 다음 노드를 찾는 방식으로 가야 한다. 즉, 연결 리스트에서 데이터 참조는 O(n)의 성능을 가진다.

그럼 배열과 연결 리스트를 비교해보자.

<table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;"></th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">배열</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">연결리스트</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">크기</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">고정</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">동적</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">주소</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">연속</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">불연속</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">데이터 참조</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">O(1)</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">O(n)</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">삽입과 삭제</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">O(n)</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">O(n)</td>
        </tr>
    </tbody>
</table>

## 연결리스트 - 구현

그럼 연결 리스트를 한번 구현해보겠다. 강의에서는 자바스크립트로 구현을 하지만 나는 한번 자바로 구현해보도록 하겠다.

구현하기 전에 먼저 추상 자료형에 대해 알아보자. 추상 자료형은 어떠한 데이터와 그 데이터에 대한 연산을 표기하는 것이다. 이렇게만 이야기하고 끝내면 무슨 이야기인지 모르니 비유적인 표현으로 들어보겠다. 세탁기가 하나 있다고 하자. 세탁기로 빨래를 하기 위해서는 옷이 들어가야 한다. 여기서 옷이 어떠한 데이터가 된다. 그리고 세탁기에는 이 옷을 처리하는 다양한 기능들이 존재한다. 뭐 빨래, 탈수, 건조등이 있을 것이다. 이렇게 데이터와 그 데이터를 연산하는 기능을 표기하는 것을 추상 자료형이라고 부른다.

그럼 연결 리스트의 추상 자료형에 대해 살펴보자. 데이터는 정수라고 가정해보겠다. 그리고 연결 리스트에 필요한 연산을 나열해보도록 하자.

- 연결 리스트의 모든 원소 출력(`printAll()`)
- 연결 리스트의 모든 원소 제거(`clear()`)
- 인덱스 삽입(`insertAt(index, data)`)
- 마지막 삽입(`insertLast(data)`)
- 인덱스 삭제(`deleteAt(index)`)
- 마지막 원소 제거(`deleteLast()`)
- 인덱스 읽기(`getNodeAt(index)`)

그럼 이런 추상 자료형을 자바로 나타내보자.

``` java
package me.sungbin.dev.section02;

public class Node {

    public int data;

    public Node next;

    public Node(int data) {
        this.data = data;
        this.next = null;
    }

    public Node(int data, Node next) {
        this.data = data;
        this.next = next;
    }

    @Override
    public String toString() {
        return "Node{" +
                "data=" + data +
                ", next=" + next +
                '}';
    }
}
```

``` java
package me.sungbin.dev.section02;

public class LinkedList {

    private Node head;

    private int count;

    public LinkedList() {
        this.head = null;
        this.count = 0;
    }

    public void insertAt(int index, int data) {
        if (index > this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        Node newNode = new Node(data);

        if (index == 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            Node currentNode = this.head;

            for (int i = 0; i < index - 1; i++) {
                currentNode = currentNode.next;
            }

            newNode.next = currentNode.next;
            currentNode.next = newNode;
        }

        this.count++;
    }

    public void printAll() {
        Node currentNode = head;
        System.out.print("[");

        while (currentNode != null) {
            System.out.print(currentNode.data);
            currentNode = currentNode.next;

            if (currentNode != null) {
                System.out.print(", ");
            }

        }
        System.out.println("]");
    }

    public void clear() {
        this.head = null;
        this.count = 0;
    }

    public void insertLast(int data) {
        this.insertAt(this.count, data);
    }

    public Node deleteAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("제거할 수 없습니다.");
        }

        Node currentNode = this.head;

        if (index == 0) {
            Node deleteNode = this.head;
            this.head = this.head.next;
            this.count--;

            return deleteNode;
        }

        for (int i = 0; i < index - 1; i++) {
            currentNode = currentNode.next;
        }

        Node deleteNode = currentNode.next;
        currentNode.next = currentNode.next.next;
        this.count--;

        return deleteNode;
    }

    public void deleteLast() {
        this.deleteAt(this.count - 1);
    }

    public Node getNodeAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        Node currentNode = this.head;

        for (int i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }
}
```

## 스택 - 개념

스택은 아주 단순한 규칙을 가지고 있는 리스트이다. 바로 FILO(First In Last Out)으로 먼저 들어간 데이터가 나중에 나오는 규칙이 있다. 우리가 편의점에 음료를 꺼낼때를 생각해보면 이해하기 쉬울 것이다.

또 다른 예를 일상생활에서 찾아보자. 엘레베이터를 타는 상황을 생각해보자. 엘레베이터를 타려고 먼저 기다린 사람은 엘레베이터 안으로 먼저 들어간다. 내릴때는 반대로 이루어진다. 즉, 늦게 탄 사람이 먼저 내리게 될 것이다. 이러한 관점에서 엘레베이터는 스택이라고 볼 수 있다.

즉, 스택은 먼저 들어온게 나중에 나오는 조건만 충족한다면 어떠한 자료구조로 구현하던지 상관이 없다. 우리는 이전에 만들었던 연결리스트를 통하여 스택을 한번 구현해보도록 할 것이다. 우리는 연결 리스트를 구현할 때 head 하나를 가지로 모든 노드를 연결했다. 이 head를 이용하면 스택을 쉽게 구현할 수 있다. 바로 데이터 삽입을 무조건 첫번째 인덱스로만 하면 되는 것이다. 또한 데이터 제거도 무조건 첫번째 인덱스만 하면 되는 것이다.

그런데 뭔가 스택의 이런 구조가 실제 어디서 사용할지가 궁금할 것이다. 순서를 중요시 하는 곳에서는 스택을 사용하는 것은 정말 쓸모 없는 자료구조일 것이다. 하지만 스택이 딱 적합한 상황이 존재한다. 예시를 들어보자.

우리가 그림판이나 포토샵으로 그림을 그린다고 생각해보자. 그림을 그리다가 실수를 하면 우리는 `ctrl + z`를 통해 되돌리기를 할 것이다. 우리는 되돌리기 작업이 바로 스택이다. 즉, 우리의 작업을 스택구조로 저장을 해두다가 해당 단축키를 입력받으면 스택이 가장 나중에 들어온 작업을 돌려내는 것이다.

## 스택 - 구현

이제 스택을 한번 구현해보도록 하겠다. 우리는 이미 연결 리스트를 구현해두었기에 스택을 아주 간단하게 구현할 수 있다. 구현 전에 스택에 필요한 추상 자료형을 알아보자.

- 데이터 삽입(`push`)
- 데이터 제거(`pop`)
- 데이터 참조(`peek`)
- 비어있는지 체크(`isEmpty`)

위의 4가지 기능을 연결 리스트를 이용하여 구현해보도록 하자.

``` java
package me.sungbin.dev.section02;

public class Stack {

    private LinkedList list;

    public Stack() {
        list = new LinkedList();
    }

    public void push(int data) {
        this.list.insertAt(0, data);
    }

    public Node pop() {
        try {
            return this.list.deleteAt(0);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    public Node peek() {
        return this.list.getNodeAt(0);
    }

    public boolean isEmpty() {
        return this.list.count == 0;
    }
}
```

## 큐 - 개념

이제 큐에 대해 알아보자. 큐도 스택과 같이 아주 단순한 규칙을 가지고 있는 리스트이다. 바로 FIFO(Fist In First Out)으로 먼저 들어간 데이터가 먼저 나오는 규칙을 의미한다. 즉, 스택과 정반대의 성격을 지닌다.

큐에 대한 예시로 우리는 마트 계산대를 들 수 있다. 마트에서 손님들이 물건을 사고 줄을 선다고 하자. 먼저 온 사람이 앞에 설 것이고 줄을 선 데로 계산을 순차적으로 진행된다. 이런 형태를 우리는 큐라고 부른다. 큐는 운영체제에서도 사용된다. 운영체제가 프로세스의 작업 요청을 들어온 순서대로 큐에 넣고 CPU가 들어온 순서대로 처리를 한다. 이를 운영체제에서는 FIFO 스케쥴링이라고 한다.

이처럼 큐도 스택처럼 우리는 연결리스트를 이용하여 구현을 할 예정이다. 연결리스트에서 이런 순서를 지키려면 삽입할 때는 head에다가 삽입을 이루게 하면 된다. 삭제는 데이터를 가장 뒤에서부터 제거를 시키면 된다. 이게 큐의 전부이다.

하지만 실제 구현하려면 약간의 문제가 발생한다. 우리가 구현한 연결 리스트는 단방향 연결 리스트이다. 이런 구조면 데이터를 뒤에서부터 제거하기 힘들다. 왜냐하면 삭제를 하려면 가장 뒤의 노드를 찾아야 하는데 가장 뒤의 노드를 찾으려면 가장 앞의 노드로부터 순차적으로 찾아가야 하기 때문이다. 즉 좋지 못하는 O(n)의 성능이 발생한다.

이런 성능을 최적화하고자 기존 구현한 연결 리스트에 tail이라는 변수를 하나 더 만들어 줄 예정이다. head는 가장 앞에 있는 노드를 가리키고 tail은 가장 뒤에 있는 노드를 가리키면 되는 것이다. 이렇게 하면 tail을 이용해서 O(1) 성능으로 최적화할 수 있다. 즉, 삭제를 진행할 때 tail이 가리키는 노드를 삭제한 후에 이전 노드를 tail로 가리키게 하면 된다. 하지만 여기에서 문제가 있는데 바로 이전 노드를 참조를 못한다는 것이다. 현재 우리가 구현한 연결 리스트가 단방향 연결 리스트이기 때문에 이전 노드를 참조하지 못하는 것이다. 굳이 어떻게 하려면 head에서 가장 마지막 노드를 찾아서 해당 위치를 tail이 가리키게 하는 것이지만 이것 또한 O(n)의 성능이 나오기 때문에 좋지 못하다. 그래서 우리는 현재 노드가 이전 노드도 가리킬 수 있게 이중 연결 리스트로 수정을 해야 한다. 이중 연결 리스트로 이전 노드도 참조할 수 있다면 위의 문제를 해결이 가능하다.

## 큐 - 구현

이제 큐를 구현해보자. 구현 전에 큐의 추상 자료형을 작성해보자.

- 데이터 삽입(`enqueue`)
- 데이터 제거(`dequeue`)
- 먼저 들어간 데이터 참조(`front`)
- 비었는지 확인(`isEmpty`)

그럼 먼저 기존 단방향 연결 리스트를 이중 연결 리스트로 변경해보자.

``` java
package me.sungbin.dev.section02;

public class DoublyNode {

    public int data;

    public DoublyNode next;

    public DoublyNode prev;

    public DoublyNode(int data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    public DoublyNode(int data, DoublyNode next, DoublyNode prev) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }

    @Override
    public String toString() {
        return data + "";
    }
}
```

``` java
package me.sungbin.dev.section02;

public class DoublyLinkedList {

    public DoublyNode head;

    public DoublyNode tail;

    public int count;

    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    public void insertAt(int index, int data) {
        if (index > this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        DoublyNode newNode = new DoublyNode(data);

        if (index == 0) {
            newNode.next = this.head;

            if (this.head != null) {
                this.head.prev = newNode;
            }

            this.head = newNode;
        } else if (index == this.count) {
            newNode.next = null;
            newNode.prev = this.tail;
            this.tail.next = newNode;
        } else {
            DoublyNode currentNode = this.head;

            for (int i = 0; i < index - 1; i++) {
                currentNode = currentNode.next;
            }

            newNode.next = currentNode.next;
            newNode.prev = currentNode;
            currentNode.next = newNode;
            currentNode.next.prev = newNode;
        }

        if (newNode.next == null) {
            this.tail = newNode;
        }

        this.count++;
    }

    public void printAll() {
        DoublyNode currentNode = head;
        System.out.print("[");

        while (currentNode != null) {
            System.out.print(currentNode.data);
            currentNode = currentNode.next;

            if (currentNode != null) {
                System.out.print(", ");
            }

        }
        System.out.println("]");
    }

    public void clear() {
        this.head = null;
        this.count = 0;
    }

    public void insertLast(int data) {
        this.insertAt(this.count, data);
    }

    public DoublyNode deleteAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("제거할 수 없습니다.");
        }

        DoublyNode currentNode = this.head;

        if (index == 0) {
            DoublyNode deleteNode = this.head;

            if (this.head.next == null) {
                this.head = null;
                this.tail = null;
            } else {
                this.head = this.head.next;
                this.head.prev = null;
            }

            this.count--;

            return deleteNode;
        }

        if (index == this.count - 1) {
            DoublyNode deleteNode = this.tail;
            this.tail.prev.next = null;
            this.tail = this.tail.prev;
            this.count--;

            return deleteNode;
        }

        for (int i = 0; i < index - 1; i++) {
            currentNode = currentNode.next;
        }

        DoublyNode deleteNode = currentNode.next;
        currentNode.next = currentNode.next.next;
        currentNode.next.prev = currentNode;
        this.count--;

        return deleteNode;
    }

    public DoublyNode deleteLast() {
        return this.deleteAt(this.count - 1);
    }

    public DoublyNode getNodeAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        DoublyNode currentNode = this.head;

        for (int i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }
}
```

이후, 큐를 구현해보자.

``` java
package me.sungbin.dev.section02;

public class Queue {

    private DoublyLinkedList list;

    public Queue() {
        list = new DoublyLinkedList();
    }

    public void enqueue(int data) {
        this.list.insertAt(0, data);
    }

    public DoublyNode dequeue() {
        try {
            return this.list.deleteLast();
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    public DoublyNode front() {
        return this.list.tail;
    }

    public boolean isEmpty() {
        return this.list.count == 0;
    }
}
```

## 덱 - 개념과 구현

다음으로 덱이라는 자료구조에 대해 알아보자. 스택과 큐에 대해 알고 있으면 아마 쉽게 이해할 것이다.

덱은 데이터 삽입/제거를 head와 tail 두 군데서 자유롭게 할 수 있는 자료구조이다. 덱은 이러한 특성을 가지고 있기 때문에 덱을 이용하면 스택과 큐를 둘 다 구현이 가능하다. 그럼 구현을 해보도록 하자. 구현에 앞서서 추상 자료형에 대해 살펴보자.

- 모든 데이터 출력(`printAll`)
- head에 데이터 삽입(`addFirst`)
- head에 데이터 제거(`removeFirst`)
- tail에 데이터 삽입(`addLast`)
- tail에 데이터 제거(`removeLast`)
- 리스트가 비어있는지(`isEmpty`)

``` java
package me.sungbin.dev.section02;

public class Deque {

    private DoublyLinkedList list;

    public Deque() {
        this.list = new DoublyLinkedList();
    }

    public void printAll() {
        this.list.printAll();
    }

    public void addFirst(int data) {
        this.list.insertAt(0, data);
    }

    public DoublyNode removeFirst() {
        return this.list.deleteAt(0);
    }

    public void addLast(int data) {
        this.list.insertAt(this.list.count, data);
    }

    public DoublyNode removeLast() {
        return this.list.deleteLast();
    }

    public boolean isEmpty() {
        return this.list.count == 0;
    }
}
```

## 해시 테이블 - 개념

다음으로 해시 테이블 자료구조에 대해 알아보자. 해시 테이블은 프로그래밍 언어에 따라 서로 다른 이름을 가지고 있다. 해시, 맵, 해시 맵, 딕셔너리등으로 불린다. 해시 테이블은 쉽게 생각해 해시와 테이블이 합쳐진 자료구조이다.

그럼 먼저 테이블이 무엇인지 살펴보자. 우리가 흔히 생각하는 엑셀 표를 생각하면 쉽다. 그럼 이런 엑셀 표 같은 것을 프로그래밍에서는 어떻게 저장할까?

<table style="border-collapse: collapse; width: 100%; max-width: 400px; margin: 0 auto; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold; width: 30%;">등번호</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold; width: 70%;">이름</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">1</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">이운재</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">4</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">최진철</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">20</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">홍명보</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">6</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">유상철</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">22</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">송종국</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">21</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">박지성</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">5</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">김남일</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">10</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">이영표</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">8</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">최태욱</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">9</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">설기현</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">14</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">이천수</td>
        </tr>
    </tbody>
</table>

위와 같이 국가대표 엑셀표가 있다고 해보자. 이 표를 코드로 표현한다고 해보자. 이것을 저장하는 가장 쉬운 방법으로는 배열을 이용하면 될 것 같다. 배열의 각 인덱스를 등번호로 하고 해당 데이터를 선수 이름으로 하면 될 듯 보인다. 이것이 테이블의 전부이다.

하지만 이 테이블의 단점은 인덱스로 배열에 접근하다 보니 중간 중간에 빈 공간이 발생한다는 점인 것이다. 그래서 오랜 조상 개발자들은 이런 문제를 해결하려고 하였다. 선수의 등번호를 어떠한 계산을 거쳐서 한 자릿수로 만들어 0~9의 인덱스에 들어오게 하는 것이였다. 이렇게 하면 공간의 낭비가 줄어들 것이다. 여기서 어떠한 계산을 **해시 함수**라고 한다. 여기서 간단히 해시함수를 선수 등번호에 10을 나눈 나머지 연산을 하는 것이라고 해보자. 그러면 아마 아래와 같이 될 것이다.

<table style="border-collapse: collapse; width: 100%; max-width: 400px; margin: 0 auto; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold; width: 30%;">인덱스</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold; width: 70%;">데이터</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">0</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">홍명보</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">1</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">이운재</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">2</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">송종국</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">3</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;"></td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">4</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">최진철</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">5</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;"></td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">6</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;">유상철</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">7</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;"></td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">8</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;"></td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; background-color: #1a1a2e; color: white; font-weight: bold;">9</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: black;"></td>
        </tr>
    </tbody>
</table>

이런식으로 해시함수로 테이블의 인덱스를 새로 만들기 때문에 해시 테이블이라는 이름이 붙인 것이다.

해시 테이블의 성능은 아주 강력하다. 해시 테이블에서 key는 축구선수의 등번호가 되는 것이고 선수의 이름은 value에 해당한다. 등번호만 알면 선수의 이름을 알 수 있듯이 해시 테이블은 key만 알면 value에 O(1)의 성능으로 읽기가 가능하다. 이뿐만 아니라 삽입/수정/삭제까지 O(1)의 성능을 가진다.

하지만 우리가 지금까지 알아본 해시 테이블의 문제점이 존재한다. 해시 함수가 축구선수 등번호를 10으로 나눈 나머지이기에 이미 존재하는 value에 다른 축구선수가 들어올 수 있다는 점이다. 이런 경우를 충돌이 났다고 말한다. 충돌이 발생하면 어떻게 해야할까? 바로 value를 연결 리스트로 구성하는 방법이다. value에 새로운 데이터가 들어오면 해당 데이터를 노드로 변경하여 이전 데이터 노드와 연결해주는 방식으로 말이다. 이런 방식으로 value를 검색하면 O(n)의 성능을 가져서 성능이 나빠보이긴 하지만 일단은 구현은 되는 셈이다.

그럼 해시 테이블의 장단점을 살펴보자.

- 장점
  - 빠른 데이터 읽기/삽입/삭제/수정을 할 수 있다.
- 단점
  - 공간의 효율성이 좋지 않다.
  - 좋은 해시 함수 구현이 필수적이다.

## 해시 테이블 - 구현

그럼 해시 테이블을 구현해보자. 구현 전에 추상 자료형에 대해 살펴보자.

- 데이터 삽입(`set`)
- 데이터 읽기(`get`)
- 데이터 제거(`remove`)

``` java
package me.sungbin.dev.section02;

public class HashData {

    public int key;

    public Object value;

    public HashData(int key, Object value) {
        this.key = key;
        this.value = value;
    }
}
```

``` java
package me.sungbin.dev.section02;

public class DoublyNode {

    public Object data;

    public DoublyNode next;

    public DoublyNode prev;

    public DoublyNode(Object data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    public DoublyNode(Object data, DoublyNode next, DoublyNode prev) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }

    @Override
    public String toString() {
        return data + "";
    }
}
```

``` java
package me.sungbin.dev.section02;

public class DoublyLinkedList {

    public DoublyNode head;

    public DoublyNode tail;

    public int count;

    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }

    public void insertAt(Integer index, Object data) {
        if (index > this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        DoublyNode newNode = new DoublyNode(data);

        if (index == 0) {
            newNode.next = this.head;

            if (this.head != null) {
                this.head.prev = newNode;
            }

            this.head = newNode;
        } else if (index == this.count) {
            newNode.next = null;
            newNode.prev = this.tail;
            this.tail.next = newNode;
        } else {
            DoublyNode currentNode = this.head;

            for (int i = 0; i < index - 1; i++) {
                currentNode = currentNode.next;
            }

            newNode.next = currentNode.next;
            newNode.prev = currentNode;
            currentNode.next = newNode;
            currentNode.next.prev = newNode;
        }

        if (newNode.next == null) {
            this.tail = newNode;
        }

        this.count++;
    }

    public void printAll() {
        DoublyNode currentNode = head;
        System.out.print("[");

        while (currentNode != null) {
            System.out.print(currentNode.data);
            currentNode = currentNode.next;

            if (currentNode != null) {
                System.out.print(", ");
            }

        }
        System.out.println("]");
    }

    public void clear() {
        this.head = null;
        this.count = 0;
    }

    public void insertLast(int data) {
        this.insertAt(this.count, data);
    }

    public DoublyNode deleteAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("제거할 수 없습니다.");
        }

        DoublyNode currentNode = this.head;

        if (index == 0) {
            DoublyNode deleteNode = this.head;

            if (this.head.next == null) {
                this.head = null;
                this.tail = null;
            } else {
                this.head = this.head.next;
                this.head.prev = null;
            }

            this.count--;

            return deleteNode;
        }

        if (index == this.count - 1) {
            DoublyNode deleteNode = this.tail;
            this.tail.prev.next = null;
            this.tail = this.tail.prev;
            this.count--;

            return deleteNode;
        }

        for (int i = 0; i < index - 1; i++) {
            currentNode = currentNode.next;
        }

        DoublyNode deleteNode = currentNode.next;
        currentNode.next = currentNode.next.next;
        currentNode.next.prev = currentNode;
        this.count--;

        return deleteNode;
    }

    public DoublyNode deleteLast() {
        return this.deleteAt(this.count - 1);
    }

    public DoublyNode getNodeAt(int index) {
        if (index >= this.count || index < 0) {
            throw new IndexOutOfBoundsException("범위를 넘어갔습니다.");
        }

        DoublyNode currentNode = this.head;

        for (int i = 0; i < index; i++) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }
}
```

기존 연결 리스트의 data 타입을 `Object`로 변경하고 `HashData`의 value값도 `Object`로 해두었다. 이제 해시 테이블을 구현해보자.

``` java
package me.sungbin.dev.section02;

public class HashTable {

    private DoublyLinkedList[] arr;

    public HashTable() {
        this.arr = new DoublyLinkedList[10];
        for (int i = 0; i < 10; i++) {
            this.arr[i] = new DoublyLinkedList();
        }
    }

    private int hashFunction(int number) {
        return number % 10;
    }

    public void set(int key, Object value) {
        this.arr[hashFunction(key)].insertAt(0, new HashData(key, value));
    }

    public Object get(int key) {
        DoublyNode currentNode = this.arr[hashFunction(key)].head;
        while (currentNode != null) {
            HashData data = (HashData) currentNode.data;
            if (data.key == key) {
                return data.value;
            }
            currentNode = currentNode.next;
        }
        return null;
    }

    public Object remove(int key) {
        DoublyLinkedList list = this.arr[hashFunction(key)];
        DoublyNode currentNode = list.head;
        int deletedIndex = 0;

        while (currentNode != null) {
            HashData data = (HashData) currentNode.data;
            if (data.key == key) {
                DoublyNode deletedNode = list.deleteAt(deletedIndex);
                return ((HashData) deletedNode.data).value;
            }
            currentNode = currentNode.next;
            deletedIndex++;
        }
        return null;
    }

    public void printAll() {
        for (int i = 0; i < arr.length; i++) {
            System.out.print("Bucket " + i + ": ");
            arr[i].printAll();
        }
    }
}
```

## 셋 - 개념과 구현

다음으로 셋에 대해 살펴보자. 셋은 데이터의 중복을 허용하지 않는 자료구조이다. 셋은 해시테이블을 이용하기 때문에 쉽게 구현이 가능하다. 해시 테이블을 사용한다고 해서 해시 셋이라고도 불린다. 셋은 해시 테이블의 value값은 사용하지 않고 key만 사용해서 구현한다. key가 key임 동시에 데이터로 쓰이는 것이다. 그럼 구현하기 전에 추상 자료형을 살펴보자.

- 데이터 삽입(`add`)
- 데이터 체크(`isContain`)
- 데이터 제거(`remove`)
- 셋 비우기(`clear`)
- 셋이 비었는지 체크(`isEmpty`)
- 모든 데이터 출력(`printAll`)

``` java
package me.sungbin.dev.section02;

public class HashSet {

    private HashTable hashTable;

    public HashSet() {
        this.hashTable = new HashTable();
    }

    public void add(int data) {
        if (this.hashTable.get(data) == null) {
            this.hashTable.set(data, -1);
        }
    }

    public boolean isContains(int data) {
        return this.hashTable.get(data) != null;
    }

    public void remove(int data) {
        this.hashTable.remove(data);
    }

    public void clear() {
        for (int i = 0; i < hashTable.arr.length; i++) {
            this.hashTable.arr[i].clear();
        }
    }

    public boolean isEmpty() {
        boolean empty = true;

        for (int i = 0; i < this.hashTable.arr.length; i++) {
            if (this.hashTable.arr[i].count > 0) {
                empty = false;
                break;
            }
        }

        return empty;
    }

    public void printAll() {
        for (int i = 0; i < this.hashTable.arr.length; i++) {
            DoublyNode currentNode = this.hashTable.arr[i].head;

            while (currentNode != null) {
                System.out.println(currentNode.data);
                currentNode = currentNode.next;
            }
        }
    }
}
```

> 잘못된 지식이 있을 경우 댓글로 남겨주시면 빠르게 반영하겠습니다!