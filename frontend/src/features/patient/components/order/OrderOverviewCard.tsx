import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { primitiveColors } from '@design/tokens';

export interface OrderOverviewCardProps {
  ongoingCount: number;
  completedCount: number;
  completionPercent: number;
  labels: {
    title: string;
    ongoing: string;
    completed: string;
  };
}

const CHART_SIZE = 107;
const CX = CHART_SIZE / 2;
const CY = CHART_SIZE / 2;
const RADIUS = 40;
const STROKE_WIDTH = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function OrderOverviewCard({
  ongoingCount,
  completedCount,
  completionPercent,
  labels,
}: OrderOverviewCardProps) {
  const completedLen = CIRCUMFERENCE * (completionPercent / 100);
  const ongoingLen = CIRCUMFERENCE - completedLen;

  return (
    <View className="bg-white border border-grey-200 rounded-2xl h-[213px] overflow-hidden">
      {/* Title */}
      <Text className="text-h3 font-semibold font-sans text-grey-900 absolute top-[26px] left-[26px]">
        {labels.title}
      </Text>

      {/* Donut chart */}
      <View className="absolute left-[26px] top-[86px] size-[107px] items-center justify-center">
        <Svg width={CHART_SIZE} height={CHART_SIZE}>
          <G rotation="-90" origin={`${CX}, ${CY}`}>
            {/* Background track */}
            <Circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              stroke={primitiveColors['grey-100']}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Completed arc (primary-500 / blue) */}
            {completedLen > 0 && (
              <Circle
                cx={CX}
                cy={CY}
                r={RADIUS}
                stroke={primitiveColors['primary-500']}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${completedLen} ${CIRCUMFERENCE - completedLen}`}
              />
            )}
            {/* Ongoing arc (red-500) — offset to start after completed portion */}
            {ongoingLen > 0 && (
              <Circle
                cx={CX}
                cy={CY}
                r={RADIUS}
                stroke={primitiveColors['red-500']}
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${ongoingLen} ${CIRCUMFERENCE - ongoingLen}`}
                strokeDashoffset={-completedLen}
              />
            )}
          </G>
        </Svg>
        {/* Percentage label */}
        <Text className="text-h4 font-semibold font-sans text-grey-900 absolute">
          {completionPercent}%
        </Text>
      </View>

      {/* Legend */}
      <View className="absolute right-[26px] top-[105px] gap-6">
        <View className="flex-row items-center gap-4">
          <View className="size-4 rounded-full bg-red-500" />
          <Text className="text-b3 font-sans text-grey-900">
            {ongoingCount} {labels.ongoing}
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="size-4 rounded-full bg-primary-500" />
          <Text className="text-b3 font-sans text-grey-900">
            {completedCount} {labels.completed}
          </Text>
        </View>
      </View>
    </View>
  );
}
