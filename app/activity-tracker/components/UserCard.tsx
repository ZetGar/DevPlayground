type Props = {
  userId: string;
  status: string;
  lastActive: number;
};

export default function UserCard({ userId, status, lastActive }: Props) {
  return (
    <div style={{ marginBottom: 10 }}>
      <b>{userId}</b> - {status} ({lastActive}분 전)
    </div>
  );
}