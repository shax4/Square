# React Native Project (Expo)

이 프로젝트는 Expo를 사용하여 개발된 React Native 애플리케이션입니다.

## 프로젝트 실행 방법

### 1. Expo CLI 설치
프로젝트를 실행하기 전에 Expo CLI가 설치되어 있어야 합니다. 만약 설치되어 있지 않다면 다음 명령어를 실행하여 설치하세요.

#### 전역 설치 (추천)
```sh
npm install -g expo-cli
또는
npm install expo
```
또는
```sh
npx expo --version
```
위 명령어를 실행하여 버전이 출력되면 Expo CLI가 이미 설치된 상태입니다.

### 2. 프로젝트 클론
```sh
git clone https://lab.ssafy.com/s12-bigdata-recom-sub1/square.git
cd frontend
```

### 3. 종속성 설치
```sh
npm install
```
또는
```sh
yarn install
```

### 4. Expo 개발 서버 실행
```sh
npx expo start
```
또는
```sh
yarn expo start
```

개발 서버가 실행되면 터미널에 QR 코드가 표시됩니다.

## 앱 실행 방법

### 1. 에뮬레이터에서 실행

#### Android Emulator
1. Android Studio에서 **Android Emulator**를 실행합니다.
2. `npx expo start` 실행 후 `a` 키를 눌러 에뮬레이터에서 앱을 실행합니다.

#### iOS Simulator (Mac에서만 가능)
1. Xcode를 설치하고 iOS 시뮬레이터를 실행합니다.
2. `npx expo start` 실행 후 `i` 키를 눌러 iOS 시뮬레이터에서 앱을 실행합니다.

### 2. 실제 기기에서 실행

#### Expo Go 앱을 이용하는 방법
1. Android/iOS 기기에 [Expo Go](https://expo.dev/client) 앱을 설치합니다.
2. `npx expo start` 실행 후 터미널에 표시된 QR 코드를 휴대폰 카메라로 스캔하거나, Expo Go 앱에서 직접 QR 코드를 스캔합니다.

### 3. 웹 브라우저에서 실행
Expo는 기본적으로 웹에서도 실행할 수 있습니다.
```sh
npx expo start --web
```
이 명령어를 실행하면 브라우저에서 프로젝트를 미리 볼 수 있습니다.

## Expo 웹사이트에서 실행하는 방법
현재 Expo 웹사이트에서 직접 에뮬레이터를 실행하는 기능은 없지만, **Expo Snack**을 이용하면 웹에서 코드를 실행하고 테스트할 수 있습니다.

1. [Expo Snack](https://snack.expo.dev/)에 접속합니다.
2. 프로젝트의 주요 코드를 복사하여 붙여넣습니다.
3. 웹에서 직접 실행해 보고 결과를 확인할 수 있습니다.

---
이제 프로젝트를 실행하고 직접 테스트해 보세요! 🚀