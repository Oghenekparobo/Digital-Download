import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Heading from "pages/components/Heading";
import { getProducts } from "lib/data";
import prisma from "lib/prisma";
import Link from 'next/link'

export default function Dashboard({products}) {
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


      <div className='flex justify-center mt-10'>
        <div className='flex flex-col w-full '>
          {products && products.map((product, index) => (
            <div
              className='border flex justify-between w-full md:w-2/3 xl:w-1/3 mx-auto px-4 my-2 py-5 '
              key={index}
            >
              {product.image && (
                <img src={product.image} className='w-14 h-14 flex-initial' />
              )}
              <div className='flex-1 ml-3'>
                <p>{product.title}</p>
                {product.free ? (
                  <span className='bg-white text-black px-1 uppercase font-bold'>
                    free
                  </span>
                ) : (
                  <p>${product.price / 100}</p>
                )}
              </div>
              <div className=''>
                <Link href={`/dashboard/product/${product.id}`}>
                  <a className='text-sm border p-2 font-bold uppercase'>Edit</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
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
