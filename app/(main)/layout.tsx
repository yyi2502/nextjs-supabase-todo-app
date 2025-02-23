const MainLayout = async ({ children }: React.PropsWithChildren<{}>) => {
  return <div className="mx-auto max-w-screen-lg">{children}</div>;
};

export default MainLayout;
