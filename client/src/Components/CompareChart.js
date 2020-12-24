import zIndex from "@material-ui/core/styles/zIndex";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, YAxis, Tooltip, ReferenceLine  } from "recharts";

function CompareChart({ price, range, index}) {
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setData(
      range
        .sort(function (a, b) {
          return a - b;
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

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div style={{ background: "rgb(256,256,256,0.75)" }}>
          {payload[0].value > 0 ? (
            <p className="label">{`Seller offers this product for ${payload[0].value.toFixed(
              2
            )}$ more than you`}</p>
          ) : (
            <p className="label">{`Seller offers this product for ${payload[0].value.toFixed(
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
          scanned listings:
        </u>
        <br/><br/>
      </p>
      <div style={{justifyContent: "center" }}>

        <AreaChart
          width={850}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 50,
            left: 0,
            bottom: 0,
          }}
        >
          <ReferenceLine y={0} stroke="grey" strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
          <YAxis tickFormatter={(e) => `${e}$`} />
          <defs>
            <linearGradient  id={`splitColor${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="green" stopOpacity={1} />
              <stop offset={off} stopColor="red" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="difference"
            stroke="#000"
            fill={`url(#splitColor${index})`}
          />
        </AreaChart>
      </div>
           <i>
          (The y axis represents the difference between the prices offered by ebay's sellers to yours)
        </i>
      <br/><br/>
    </>
  );
}

export default CompareChart;
