import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Heading() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  if (loading) return "loading";

  return (
    <div className="">
      <header className="">
        <div className="flex justify-between items-center border border-b-black border-b-2">
          <div className="font-bold text-2xl">
            {
              (router.asPath === "/" ? (
                <p>Digital Downloads</p>
              ) : (
                <Link href={"/"}>
                  <a>Home</a>
                </Link>
              ))
            }
          </div>
          <div className="border-l-black border-l-4  cursor-pointer flex items-center w-40 px-4 h-20 bg-fuchsia-500 text-black font-light hover:bg-black hover:text-white transition-all">
            <div className="pl-2 capitalize ">
              <a
                className="text-xl"
                href={session ? '/api/auth/signout' : 'api/auth/signin'}
              >
                {session ? "logout" : "login"}
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="px-2 relative">
        <h1 className=" custom-txt italic  hidden md:block ">Digital <br /> Downloads</h1>
        <div className="absolute top-60 hover:text-white  hover:bg-black left-28 text-2xl bg-fuchsia-500 rounded px-6 py-2 transiton-all">
          {
            (router.asPath === "/dashboard" ? (
              <p className="cursor-not-allowed">Dashboard</p>
            ) : (
              <Link href={`/dashboard`}>
                <a className=" ">Dashboard</a>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}
