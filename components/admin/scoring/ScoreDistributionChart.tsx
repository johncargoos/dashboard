'use client'

interface ScoreDistributionData {
  range: string
  currentCount: number
  proposedCount: number
}

interface ScoreDistributionChartProps {
  data: ScoreDistributionData[]
  totalDrivers: number
  className?: string
}

export function ScoreDistributionChart({ data, totalDrivers, className = '' }: ScoreDistributionChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.map(d => Math.max(d.currentCount, d.proposedCount))
  )
  const chartHeight = 300
  const barWidth = 40
  const barGap = 8
  const chartWidth = data.length * (barWidth * 2 + barGap) + 100

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Score Distribution Comparison</h2>
        <p className="text-sm text-gray-500 mt-1">
          Comparison of current vs. proposed score distributions across {totalDrivers} drivers
        </p>
      </div>

      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight + 60} className="mx-auto">
          {/* Y-axis labels */}
          {[0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue].map((value, index) => {
            const y = chartHeight - (value / maxValue) * chartHeight
            return (
              <g key={index}>
                <line
                  x1="50"
                  y1={y + 30}
                  x2={chartWidth - 50}
                  y2={y + 30}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x="45"
                  y={y + 35}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {Math.round(value)}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const x = 60 + index * (barWidth * 2 + barGap)
            const currentHeight = (item.currentCount / maxValue) * chartHeight
            const proposedHeight = (item.proposedCount / maxValue) * chartHeight
            const yCurrent = chartHeight - currentHeight
            const yProposed = chartHeight - proposedHeight

            return (
              <g key={index}>
                {/* Current bar (teal) */}
                <rect
                  x={x}
                  y={yCurrent + 30}
                  width={barWidth}
                  height={currentHeight}
                  fill="#14B8A6"
                  className="hover:opacity-80 transition-opacity"
                />
                
                {/* Proposed bar (orange/salmon) */}
                <rect
                  x={x + barWidth + 4}
                  y={yProposed + 30}
                  width={barWidth}
                  height={proposedHeight}
                  fill="#FB923C"
                  className="hover:opacity-80 transition-opacity"
                />

                {/* X-axis label */}
                <text
                  x={x + barWidth}
                  y={chartHeight + 50}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.range}
                </text>
              </g>
            )
          })}

          {/* Y-axis label */}
          <text
            x="15"
            y={chartHeight / 2 + 30}
            textAnchor="middle"
            className="text-xs fill-gray-600"
            transform={`rotate(-90, 15, ${chartHeight / 2 + 30})`}
          >
            Number of Drivers
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#14B8A6] rounded"></div>
          <span className="text-sm text-gray-600">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FB923C] rounded"></div>
          <span className="text-sm text-gray-600">Proposed</span>
        </div>
      </div>
    </div>
  )
}
