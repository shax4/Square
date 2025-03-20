import { PieChart } from "react-native-gifted-charts";
import {DonutChartComponentProps} from "./DonutChart.types";
import { Text, View } from "react-native";

const DonutChart = (data:DonutChartComponentProps) => {
    const colors = ["#00AEFF", "#6541F2", "#F553DA", "#CB59FF"];

    const dataArray = data["data"];

    const pieData = dataArray.map((item, index) => ({
        value: item.value,
        color: colors[index],
        gradientCenterColor: colors[index], // gradient를 같은 색상으로 설정
        ...(index === 0 && { focused: true }), // 첫 번째 요소에만 focused 추가
      }));

  // 색상을 기반으로 작은 원형 Dot을 렌더링하는 함수
  const renderDot = (color: string) => {
    return (
      <View
        style={{
          height: 20,
          width: 20,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };
 
  // Legend (범례) 컴포넌트
  const renderLegendComponent = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", width: 120, marginRight: 30 }}>
            {renderDot(colors[0])}
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{dataArray[0].label}: {dataArray[0].value}%</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", width: 120 }}>
            {renderDot(colors[1])}
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{dataArray[1].label}: {dataArray[1].value}%</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", width: 120, marginRight: 30 }}>
            {renderDot(colors[2])}
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{dataArray[2].label}: {dataArray[2].value}%</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", width: 120 }}>
            {renderDot(colors[3])}
            <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{dataArray[3].label}: {dataArray[3].value}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ alignItems: "center" }}>
      {/* 도넛 차트 */}
      <PieChart
        data={pieData}
        donut
        showGradient
        sectionAutoFocus
        radius={120}
        innerRadius={70}
        innerCircleColor={"#232B5D"}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 28, color: "white", fontWeight: "bold" }}>{dataArray[0].label}</Text>
              <Text style={{ fontSize: 22, color: "white" }}>{dataArray[0].value}%</Text>
            </View>
          );
        }}
      />
      {/* Legend 표시 */}
      {renderLegendComponent()}
    </View>
  );
};

export default DonutChart;