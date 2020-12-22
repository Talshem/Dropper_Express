import React, { useEffect, useState } from "react";
import { AreaChart, Area, YAxis, Tooltip } from "recharts";
function CompareChart({ price, range }) {
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setData(
      range
        .sort(function (a, b) {
          return b - a;
        })
        .map((e) => ({ difference: e - price }))
    );
    const expensiveItems = range.filter((e) => e > price);
    setPercentage((expensiveItems.length / range.length) * 100);
  }, [price]);

  const dataMax = Math.max(...data.map((e) => e.difference));
  const dataMin = Math.min(...data.map((e) => e.difference));

  const gradientOffset = () => {
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div style={{ background: "rgb(256,256,256,0.75)" }}>
          {payload[0].value > 0 ? (
            <p className="label">{`Seller offers ${payload[0].value.toFixed(
              2
            )}$ more than you`}</p>
          ) : (
            <p className="label">{`Seller offers ${payload[0].value.toFixed(
              2
            )}$ less than you`}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <p>
        <u>
          Your product is cheaper than <b>{percentage.toFixed(2)}%</b> of the
          Listings:
        </u>
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p style={{ width: "6%", marginTop: "40px" }}>
          Difference between ebay's offers to yours
        </p>
        <AreaChart
          width={800}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <Tooltip content={<CustomTooltip />} />
          <YAxis tickFormatter={(e) => `${e}$`} />
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="green" stopOpacity={1} />
              <stop offset={off} stopColor="red" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="difference"
            stroke="#000"
            fill="url(#splitColor)"
          />
        </AreaChart>
      </div>
    </>
  );
}

export default CompareChart;
