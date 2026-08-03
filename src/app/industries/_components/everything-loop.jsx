import styles from "./everything-loop.module.css";

const letters = [..."everything"];

export default function EverythingLoop() {
  return (
    <span className={styles.word} aria-label="everything">
      <span aria-hidden="true">
        {letters.map((letter, index) => (
          <span
            className={styles.letter}
            style={{ "--letter-index": index }}
            key={`${letter}-${index}`}
          >
            {letter}
          </span>
        ))}
      </span>
    </span>
  );
}
