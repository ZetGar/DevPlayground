import styles from "./Button.module.css"

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "yellow";
};

export default function Button({ variant="primary", children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}