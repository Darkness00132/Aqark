export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const param = await params;
  return <div>Other User Profile: {param.publicId}</div>;
}
