type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const color =
    status === "Active"
      ? "blue"
      : status === "Idle"
      ? "orange"
      : "red";

  return (
    <span style={{ color, fontWeight: "bold" }}>
      {status}
    </span>
  );
}