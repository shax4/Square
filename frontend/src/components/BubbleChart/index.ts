export { default } from './BubbleChart';
export * from './BubbleChart.types';

/*
투표 시 나오는 결과 리포트 페이지에서 사용되는 그래프 컴포넌트 중 버블 그래프 컴포넌트입니다.

컴포넌트 Props로 두 가지 데이터를 받게 됩니다.
그래프에서 사용할 데이터, 그리고 버블 차트의 높이입니다.

예시)

const bubbleData = [
    { value: 70, label: "서울특별시" },
    { value: 14, label: "인천광역시" },
    { value: 14, label: "경기도" },
    { value: 2, label: "기타" },
]

<BubbleChart data={pieData} height={200} />
*/