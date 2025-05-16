import { Sparklines, SparklinesLine } from "react-sparklines";

export const MiniChart = ({ data, type }) => {
  return (
    <Sparklines data={data} limit={0} width={200} height={40} margin={5}>
      <SparklinesLine
        color={type === "gain" ? "#00ff95" : "#ff4d6d"}
        style={{ fill: "none", strokeWidth: 2 }}
      />
    </Sparklines>
  );
};
