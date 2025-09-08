import AuthInitializer from "@/components/UI/AuthInitializer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <AuthInitializer login={params.login} />
      <h1 className="text-center text-7xl mt-20">مرحبا فى موقعنا</h1>
    </div>
  );
}
