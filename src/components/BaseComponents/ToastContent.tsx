export const ToastContent = (
  title: string,
  message: string
): React.ReactNode => {
  return (
    <>
      <h5>{title}</h5>
      <p>{message}</p>
    </>
  );
};
