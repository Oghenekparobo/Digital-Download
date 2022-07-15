import Head from "next/head";
import Heading from "./components/Heading";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Digital Downloads Web Applicatiion</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="">
        <Heading/>
      </div>
    </div>
  );
}
