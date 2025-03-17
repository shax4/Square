export {default} from './ProfileImage';
export * from './ProfileImage.types';

/*
해당 컴포넌트는 사용자의 프로필 이미지를 화면에 출력하는 원형 이미지 컴포넌트입니다.

컴포넌트에 다음과 같은 Props를 전달해줍니다.

imageUrl : 이미지 주소.
variant : 'small', 'medium', 'large'. (이미지의 크기를 string으로 전달. 기본값은 small)


사용예시는 다음과 같습니다.
<ProfileImage imageUrl="https://example.com/profile.jpg" variant="large"/>
<ProfileImage variant="medium"/> => 기본 이미지 적용.

*/