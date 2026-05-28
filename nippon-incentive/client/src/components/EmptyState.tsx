interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState = ({ title = 'No data', description = 'Nothing to show yet.' }: EmptyStateProps) => {
  return (
    <section>
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
};

export default EmptyState;
