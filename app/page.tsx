import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dev Playground</h1>

      <ul>
        <li>
          <Link href="/activity-tracker">
            <div style={{
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
              cursor: "pointer"
            }}>
              Activity Tracker
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}