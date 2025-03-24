export { default } from './DonutChart';
export * from './DonutChart.types';
/*

투표 시 나오는 결과 리포트 페이지에서 사용되는 그래프 컴포넌트 중 도넛넛 그래프 컴포넌트입니다.

컴포넌트 Props로 아래 데이터를 받게 됩니다.

예시)

    const pieData = [
        { value: 70, label: "서울특별시" },
        { value: 14, label: "인천광역시" },
        { value: 14, label: "경기도" },
        { value: 2, label: "기타" },
      ];

<DonutChart data={pieData} />

여기서 서울특별시시 데이터가 더 진하게 나타납니다.
*/