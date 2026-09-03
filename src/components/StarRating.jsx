import { StarIcon } from "../icons";

export default function StarRating({ value = 0, count, size = 14, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={"c4l-stars" + (interactive ? " interactive" : "")}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className="c4l-star-btn"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          aria-label={`${n} étoile(s)`}
        >
          <StarIcon size={size} filled={n <= Math.round(value)} />
        </button>
      ))}
      {typeof count === "number" && <span className="c4l-star-count">({count})</span>}
    </div>
  );
}
