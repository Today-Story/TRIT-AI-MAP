import BookItem from "./BookItem";

const bookItems = [
  {
    id: 1,
    title: "피부 광택 시술",
    description: "피부에 빛을 내주는~~",
    informations: ["시술 정보1", "시술 정보2"],
    schedule: "월-금",
  },
  {
    id: 2,
    title: "피부 광택 시술",
    description: "피부에 빛을 내주는~~",
    informations: ["시술 정보1", "시술 정보2"],
    schedule: "월-금",
  },
  {
    id: 3,
    title: "피부 광택 시술",
    description: "피부에 빛을 내주는~~",
    informations: ["시술 정보1", "시술 정보2"],
    schedule: "월-금",
  },
];

export default function Book() {
  return (
    <section className="space-y-3 py-3">
      {bookItems.map((item) => (
        <BookItem key={item.id} {...item} onClickBook={() => {}} />
      ))}
    </section>
  );
}
