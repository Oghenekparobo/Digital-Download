import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Heading from "pages/components/Heading";
import { getProducts } from "lib/data";
import prisma from "lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard({ products }) {
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
        <title>
          {session.user.name} {""} Dashboard
        </title>
        <meta name="description" content="ashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <div className="absolute top-48 left-3/4 bg-fuchsia-500 text-xl p-4 text-white rounded-full font-mono">
        <p>{session.user.name}</p>
      </div>

      <div className=" grid grid-cols-2 ">
        {products.map((product, index) => (
          <div className="mx-auto mb-10 shadow" key={index}>
            <div className="">
              <div className="prod-box rounded-xl overflow-hidden  w-96 border bg-fuchsia-500">
                <div className="prod-title text-center text-xl text-white py-2 capitalize italic">
                  <h1>{product.title}</h1>
                </div>
                <div classNme="prod-img overflow-hidden bg-fuchsia-500">
                  {product.image ? (
                    <img src="/prod.jpg" alt="" className="w-1/2 h-80" />
                  ) : (
                    <Image src="/prod.jpg" width={400} height={550} />
                  )}
                </div>
                <div className="prod-price_edit text-white p-2 ">
                  <div className="flex justify-between ">
                    {product.free ? (
                      <span>Free</span>
                    ) : (
                      <a className="price">${product.price / 100}</a>
                    )}
                    <Link href={`/dashboard/product/${product.id}`}>
                      <a className="bg-white text-fuchsia-500 px-4 rounded hover:text-fuchsia-300 transition-all">
                        edit
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  let products = await getProducts({ author: session.user.id }, prisma);
  products = JSON.parse(JSON.stringify(products));

  return {
    props: {
      products: products,
    },
  };
}
