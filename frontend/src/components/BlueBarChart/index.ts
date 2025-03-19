export { default } from './BlueBarChart';
export * from './BlueBarChart.types';

/*

투표 시 나오는 결과 리포트 페이지에서 사용되는 그래프 컴포넌트 중 막대 그래프 컴포넌트입니다.

컴포넌트 Props로 두 가지 데이터를 받게 됩니다.
그래프에서 사용할 데이터, 그리고 사용자의 범주에 해당하는 인덱스 입니다.

예시)

const chartData = [
    { value: 50, label: "10대" },
    { value: 25, label: "20대" },
    { value: 20, label: "30대" },
    { value: 4, label: "40대" },
    { value: 1, label: "50대" },
];

<BlueBarChart data={chartData} highlightIdx={1}/>

여기서 20대 데이터가 더 진하게 나타납니다.
*/