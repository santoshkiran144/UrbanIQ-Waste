const MetricCard = ({ label, value, hint }) => (
  <article className="metric-card">
    <p>{label}</p>
    <h3>{value}</h3>
    <span>{hint}</span>
  </article>
);

export default MetricCard;
