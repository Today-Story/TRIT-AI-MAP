interface BookItemProps {
  title: string;
  description: string;
  informations: string[];
  schedule: string;
  onClickBook: () => void;
}

export default function BookItem({
  title,
  description,
  informations,
  schedule,
  onClickBook,
}: BookItemProps) {
  const information = informations.join(" / ");

  return (
    <div className="flex flex-col gap-3 relative bg-primary-100 rounded-lg p-2">
      <div className="flex justify-between">
        <div className="flex flex-col justify-between">
          <p className="font-semibold">{title}</p>
          <p className="font-medium text-sm">{description}</p>
        </div>
        <div className="w-1/5 bg-gray-200 rounded-lg aspect-square" />
      </div>
      <hr className="border-gray-200" />
      <div className="flex justify-between items-center text-sm">
        <span className="text-primary-300 font-medium">{information.concat(schedule)}</span>
        <button
          onClick={onClickBook}
          className="text-white bg-primary-300 rounded-full py-1 px-2 font-semibold"
        >
          BOOK
        </button>
      </div>
    </div>
  );
}
