export {default} from './PersonalityTag';
export * from './PersonalityTag.types';

/*
해당 컴포넌트는 사용자의 성향 태그 네 글자를 화면에 출력하는 컴포넌트입니다.

컴포넌트에 다음과 같은 Props를 전달해줍니다.

personality : 사용자의 성향 네 글자 "PNTB".
onPress : 성향 태그를 클릭할 시 호출되는 함수.


사용예시는 다음과 같습니다.
<PersonalityTag personality="PNTB" onPress={() => console.log("PNTB clicked")} />

*/