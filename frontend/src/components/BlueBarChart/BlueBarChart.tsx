import { BarChart } from "react-native-gifted-charts";
import {BarChartComponentProps} from "./BlueBarChart.types";
import { Text } from "react-native";

const BlueBarChart = (data:BarChartComponentProps) => {

    const highlightIdx = data.highlightIdx;

    const generateBarData = (data: BarChartComponentProps["data"]) => {
        return data.map((item, idx) => ({
          value: item.value,
          label: item.label,
          frontColor: idx === highlightIdx ? "#0066FF" : "#EAF2FE",
          labelTextStyle: { color: "gray", fontWeight: "bold" },
          topLabelComponent: () => (
            <Text
              style={{
                color: "#0066FF",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 6,
              }}
            >
              {item.value}%
            </Text>
          ),
        }));
      };

      const barData = generateBarData(data["data"]);

    return (
        <BarChart
            barWidth={35}
            noOfSections={3}
            barBorderRadius={12}
            frontColor="#EAF2FE"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
            height={120}
        />
    )
}

export default BlueBarChart;