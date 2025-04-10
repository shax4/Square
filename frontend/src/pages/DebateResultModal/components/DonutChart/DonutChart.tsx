import { PieChart } from "react-native-gifted-charts";
import { DonutChartComponentProps } from "./DonutChart.types";
import { Text, View } from "react-native";

const DonutChart = ({ data }: DonutChartComponentProps) => {
    const colors = ["#00AEFF", "#6541F2", "#F553DA", "#CB59FF", "#FFA500", "#FF4500", "#32CD32", "#8A2BE2"];
    
    // 데이터 개수에 맞춰 색상 선택
    const pieData = data.map((item, index) => ({
        value: item.value,
        color: colors[index % colors.length], // 색상을 순환하도록 설정
        gradientCenterColor: colors[index % colors.length],
        ...(index === 0 && { focused: true }),
    }));

    // 색상을 기반으로 작은 원형 Dot을 렌더링하는 함수
    const renderDot = (color: string) => (
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

    // Legend (범례) 컴포넌트
    const renderLegendComponent = () => (
        <View style={{ marginTop: 20, flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}>
            {data.map((item, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
                    {renderDot(colors[index % colors.length])}
                    <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{item.label}: {item.value}%</Text>
                </View>
            ))}
        </View>
    );

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
                centerLabelComponent={() => (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 28, color: "white", fontWeight: "bold" }}>{data[0]?.label || ""}</Text>
                        <Text style={{ fontSize: 22, color: "white" }}>
                            {data[0] ? `${Math.round(data[0].value)}%` : ""}
                        </Text>
                    </View>
                )}
            />
            {/* Legend 표시 */}
            {renderLegendComponent()}
        </View>
    );
};

export default DonutChart;