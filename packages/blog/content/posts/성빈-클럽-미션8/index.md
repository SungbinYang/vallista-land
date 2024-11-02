---
title: 성빈 클럽 미션8
tags:
  - 스터디
image: ./assets/01.png
date: 2024-11-02 15:31:27
series: 성빈클럽-자바입문
draft: false
---

![썸네일](./assets/01.png)

이번 시간에는 배열에 대해 학습해보았다. 해당 배열에 대한 문제들을 강의에서 많이 학습해봤다. 이제 미션을 진행해보자.

## 초급

### 문제1

> 배열이란 무엇이며, 배열을 사용할 때 얻을 수 있는 이점은 무엇인가요? 간단하게 설명하세요.

내 해설)

배열은 같은 데이터 타입을 가진 여러 값을 하나의 변수에 저장할 수 있는 자료구조입니다. 배열을 사용하면 데이터의 집합을 보다 쉽게 관리하고, 각 요소에 인덱스로 접근할 수 있어 데이터 검색 및 수정이 편리합니다. 또한, 메모리 할당이 연속적으로 이루어져 효율적으로 데이터를 저장할 수 있습니다.

### 문제2

> 정수(int) 배열을 생성하고, 첫 번째 요소에 10을 할당한 후 배열의 길이를 출력하는 코드를 작성하세요.

내 해설)

``` java
int[] numbers = new int[5];
numbers[0] = 10;
System.out.println("배열의 길이: " + numbers.length);
```

### 문제3

> 주어진 int 배열 {2, 4, 6, 8, 10}의 모든 요소를 출력하는 코드를 작성하세요. (향상된 for문을 사용하세요.)

내 해설)

``` java
int[] numbers = {2, 4, 6, 8, 10};
for (int num : numbers) {
    System.out.println(num);
}
```

## 중급

### 문제1

> 길이가 5인 double 배열을 선언하고, for문을 사용하여 배열의 각 요소에 해당 인덱스의 제곱 값을 할당하는 코드를 작성하세요. 예를 들어, 배열의 첫 번째 요소는 0^2이 되어야 합니다.

내 해설)

``` java
double[] squares = new double[5];
for (int i = 0; i < squares.length; i++) {
    squares[i] = Math.pow(i, 2);
}
```

### 문제2

> 배열의 크기는 한 번 정해지면 변경할 수 없습니다. 이 문제를 해결하기 위한 대안으로 어떤 방법이 있는지 설명하세요.

내 해설)

배열은 고정 크기를 가지므로 크기 변경이 불가능합니다. 이를 해결하기 위해 `ArrayList`나 `LinkedList`와 같은 컬렉션을 사용할 수 있습니다. 이들은 동적 크기를 가지므로 필요에 따라 요소를 추가하거나 삭제할 수 있어 유연합니다.

### 문제3

> 주어진 String 배열 {"apple", "banana", "cherry"}의 요소들을 역순으로 출력하는 코드를 작성하세요.

내 해설)

``` java
String[] fruits = {"apple", "banana", "cherry"};
for (int i = fruits.length - 1; i >= 0; i--) {
    System.out.println(fruits[i]);
}
```

## 고급

### 문제1

> 2차원 int 배열을 생성하고, 각 행과 열의 합을 계산하여 배열의 모든 요소와 각 행과 열의 합을 출력하는 코드를 작성하세요.

내 해설)

``` java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
int[] rowSums = new int[matrix.length];
int[] colSums = new int[matrix[0].length];

for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        rowSums[i] += matrix[i][j];
        colSums[j] += matrix[i][j];
    }
}

System.out.println("각 행의 합:");
for (int sum : rowSums) {
    System.out.println(sum);
}

System.out.println("각 열의 합:");
for (int sum : colSums) {
    System.out.println(sum);
}
```

### 문제2

> 배열을 리팩토링할 때 고려해야 할 사항에는 어떤 것이 있는지 설명하고, 배열을 보다 효율적으로 관리하기 위해 사용할 수 있는 컬렉션이나 자료구조에 대해 간단히 설명하세요.

내 해설)

배열을 리팩토링할 때는 가독성, 유지 보수성, 효율성 등을 고려해야 합니다. 배열을 효율적으로 관리하기 위해 컬렉션 프레임워크를 사용하는 것이 유용할 수 있습니다. 특히, 배열 크기를 동적으로 변경할 수 없다는 제약을 해결하거나, 데이터 삽입과 삭제가 빈번한 경우 컬렉션을 사용하면 유리합니다.

### 문제3

> 사용자로부터 숫자 입력을 받아 그 숫자만큼의 길이를 가지는 배열을 생성한 후, 배열에 랜덤한 값을 채우고 배열의 평균을 출력하는 코드를 작성하세요. (Scanner와 Math.random()을 사용하세요.)

내 해설)

``` java
Scanner scanner = new Scanner(System.in);
System.out.print("배열의 길이를 입력하세요: ");
int length = scanner.nextInt();

int[] numbers = new int[length];
int sum = 0;

for (int i = 0; i < length; i++) {
    numbers[i] = (int)(Math.random() * 100);
    sum += numbers[i];
}

double average = (double) sum / length;
System.out.println("배열의 평균값: " + average);
```