import { auth } from "@/lib/auth/auth";

export default async function Dashboard() {
  const session = await auth();
  console.log(session);
  

  if (!session) return <p>You must be logged in</p>;

  return <div>Welcome, {session.user?.name}</div>;
}
