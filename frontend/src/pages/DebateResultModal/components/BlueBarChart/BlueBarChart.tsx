import { BarChart } from "react-native-gifted-charts";
import { BarChartComponentProps } from "./BlueBarChart.types";
import Text from '../../../../components/Common/Text';

const BlueBarChart = (data: BarChartComponentProps) => {

  const highlightIdx = data.highlightIdx;

  const generateBarData = (data: BarChartComponentProps["data"]) => {
    return data.map((item, idx) => ({
      value: item.value,
      label: item.label,
      frontColor: idx === highlightIdx ? "#0066FF" : "#DCEAFF",
      labelTextStyle: { color: "gray", fontWeight: "bold" },
      topLabelComponent: () => (
        <Text
          style={{
            color: "#0066FF",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 2,
          }}
        >
          {item.value}
        </Text>
      ),
    }));
  };

  const barData = generateBarData(data["data"]);

  return (
    <BarChart
      barWidth={35}
      noOfSections={2}
      barBorderTopLeftRadius={12}
      barBorderTopRightRadius={12}
      barBorderBottomLeftRadius={3}
      barBorderBottomRightRadius={3}
      yAxisLabelSuffix={'%'}
      frontColor="#DCEAFF"
      data={barData}
      hideRules
      yAxisThickness={0}
      xAxisThickness={0}
      height={200}
      overflowTop={50}
      maxValue={100}
    />
  )
}

export default BlueBarChart;