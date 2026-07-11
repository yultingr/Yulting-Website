export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Templates remount on navigation, replaying the CSS enter animation
  return <div className="page-enter">{children}</div>;
}
