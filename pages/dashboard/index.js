import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Heading from "pages/components/Heading";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  if (loading) return "loading";

  if (!session) {
    router.push("/");
    return;
  }

  if (!session.user.name) {
    router.push("/setup");
    return;
  }

  return (
    <div className="">
      <Head>
        <title>{session.user.name} {""} session</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading/>
  
  <div className="absolute top-48 left-3/4 bg-fuchsia-500 text-xl p-4 text-white rounded-full font-mono">
      <p>{session.user.name}</p>
  </div>

    </div>
  );
}
