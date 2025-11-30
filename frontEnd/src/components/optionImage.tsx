import { QuestionOption } from '../lib/types';

type Props = {
  option: QuestionOption;
  onClick: () => void;
};

export default function OptionImage({ option, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer 
                 hover:scale-105 transition-transform"
    >
      <img
        src={option.imageUrl}
        alt={option.text}
        className="w-full h-48 object-cover rounded-2xl shadow-md"
      />
      <span className="text-lg font-medium">{option.text}</span>
    </button>
  );
}
