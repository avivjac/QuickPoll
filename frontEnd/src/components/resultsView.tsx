'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResultSlice, Question } from '../lib/types';

type Props = {
  question: Question;
  results: ResultSlice[];
};

export default function ResultsView({ question, results }: Props) {
  const data = results.map((r) => {
    const opt = question.options.find((o) => o.id === r.optionId);
    return {
      name: opt?.text ?? String(r.optionId),
      value: r.percent,
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-2xl font-semibold">תוצאות</h3>
      <PieChart width={320} height={320}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={130}
        >
          {data.map((_, index) => (
            <Cell key={index} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
