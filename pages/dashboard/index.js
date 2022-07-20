import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Heading from "pages/components/Heading";
import { getProducts, getPurchases } from "lib/data";
import prisma from "lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard({ products, purchases }) {
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
        <meta name="description" content="dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading />

      <div className="absolute top-48 left-3/4 bg-fuchsia-500 text-xl p-4 text-white rounded-full font-mono">
        <p>{session.user.name}</p>
      </div>
      {products.length > 0 && (
       <div className="">
         <h1 className='text-center text-xl italic font-bold'>Products</h1>
          <div className=" grid grid-cols-2 ">
          {products.map((product, index) => (
            <div className="mx-auto mb-10 shadow" key={index}>
              <div className="relative">
                <div className="prod-box rounded-xl overflow-hidden  w-96 border bg-fuchsia-500">
                  <div className="prod-title text-center text-xl text-white py-2 capitalize italic">
                    <h1>{product.title}</h1>
                    <div className="absolute bg-white top-20 right-4 px-4 py-1 rounded z-20 text-fuchsia-500 hover:text-fuchsia-300 transition-all">
                      <Link href={`/product/${product.id}`}>
                        <a>View</a>
                      </Link>
                    </div>
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
       
      )}

      {purchases.length > 0 && (
        <div className="flex flex-col w-full">
          <h2 className="text-center text-xl mb-4">Purchases</h2>
          {purchases.map((purchase, index) => (
            <div
              className="border flex justify-between w-full md:w-2/3 xl:w-1/3 mx-auto px-4 my-2 py-5 "
              key={index}
            >
              {purchase.product.image && (
                <img
                  src={purchase.product.image}
                  className="w-14 h-14 flex-initial"
                />
              )}
              <div className="flex-1 ml-3">
                <p>{purchase.product.title}</p>
                {parseInt(purchase.amount) === 0 ? (
                  <span className="bg-white text-black px-1 uppercase font-bold">
                    free
                  </span>
                ) : (
                  <p>${purchase.amount / 100}</p>
                )}
              </div>
              <div className="">
                <a
                  href={purchase.product.url}
                  className="text-sm border p-2 font-bold uppercase"
                >
                  Get files
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  let products = await getProducts({ author: session.user.id }, prisma);
  products = JSON.parse(JSON.stringify(products));

  let purchases = await getPurchases({ author: session.user.id }, prisma);
  purchases = JSON.parse(JSON.stringify(purchases));

  return {
    props: {
      products: products,
      purchases: purchases,
    },
  };
}
