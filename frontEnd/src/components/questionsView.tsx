import { Question } from '../lib/types';
import OptionImage from './OptionImage';

type Props = {
  question: Question;
  onSelectOption: (optionId: number) => void;
};

export default function QuestionView({ question, onSelectOption }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold text-center">{question.title}</h2>

      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {question.options.map((o) => (
          <OptionImage
            key={o.id}
            option={o}
            onClick={() => onSelectOption(o.id)}
          />
        ))}
      </div>
    </div>
  );
}
