import { CheckCircleIcon } from "../icons";
import { useI18n } from "../useI18n";

const LABELS = {
  received: "statusReceived",
  preparing: "statusPreparing",
  shipped: "statusShipped",
  delivered: "statusDelivered",
};

export default function OrderStatusTracker({ steps, stepIndex }) {
  const { t } = useI18n();
  return (
    <ol className="c4l-status-tracker">
      {steps.map((step, i) => (
        <li key={step} className={i <= stepIndex ? "done" : ""}>
          <span className="c4l-status-dot">{i <= stepIndex && <CheckCircleIcon size={14} />}</span>
          <span className="c4l-status-label">{t(LABELS[step])}</span>
        </li>
      ))}
    </ol>
  );
}
