import Image from 'next/image';

interface OptionImageProps {
  label: string;
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionImage({ label, imageUrl, selected, onClick, disabled }: OptionImageProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-300
        ${selected ? 'ring-4 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.02] hover:shadow-xl'}
        ${disabled ? 'cursor-default' : 'cursor-pointer active:scale-95'}
        w-full aspect-[4/5] md:aspect-square bg-gray-100 dark:bg-gray-800
      `}
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        className={`object-cover transition-transform duration-500 ${selected ? 'scale-110' : 'group-hover:scale-110'}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className={`
        absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
        flex flex-col justify-end p-6
        transition-opacity duration-300
        ${selected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}
      `}>
        <span className="text-white text-2xl font-bold tracking-wide text-shadow-sm">
          {label}
        </span>
      </div>

      {selected && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
