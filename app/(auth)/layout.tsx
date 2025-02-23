type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  return <div className="flex items-center justify-center">{children}</div>;
};

export default AuthLayout;
