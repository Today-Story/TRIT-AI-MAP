interface TagProps {
  tag: string;
}

export default function Tag({ tag }: TagProps) {
  return (
    <span className="bg-primary-200 rounded-full py-1 px-2 text-primary-300 font-semibold">
      #{tag}
    </span>
  );
}
