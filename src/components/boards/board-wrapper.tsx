export function BoardWrapper({
  children,
}: {
  boardId: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
