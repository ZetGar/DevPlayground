
import styles from "./styles/home.module.css"
import EventPanel from "./components/EventPanel/EventPanel";
import Dashboard from "./components/Dashboard/Dashboard";

export default function Home() {
  return (
    <div className={styles.layout}>
      <EventPanel />
      <Dashboard />
    </div>
  );
}