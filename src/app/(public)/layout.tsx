import { Header } from "@/presentation/components/header";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Header />
      <div className="">{children}</div>
    </>
  );
}
