import Heading from "pages/components/Heading";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [free, setFree] = useState(false);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [product, setProduct] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === "loading";
  if (loading) return "loading";

  if (!session) {
    router.push("/");
    return;
  }
  return (
    <div className="">
      <Head>
        <title>Digital Downloads Web Applicatiion</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Heading />
      </div>

      <div className="flex justify-center mt-10">
        <div>
          <h1 className="text-xl font-bold text-center py-1">Create Product</h1>

          <div className="capitalize bg-fuchsia-500 px-10 py-4">
            <form
              className="mt-10"
              onSubmit={async (e) => {
                e.preventDefault();

                const body = new FormData();
                body.append("image", image);
                body.append("product", product);
                body.append("title", title);
                body.append("free", free);
                body.append("price", price);
                body.append("description", description);

                await fetch("/api/new", {
                  body,
                  method: "POST",
                });
                
                router.push(`/dashboard`);
              }}
            >
              <div className="form-group flex flex-col text-center py-4">
                <label htmlFor="title" className="text-white">
                  title
                </label>
                <input
                  type="text"
                  className="text-black rounded py-1 outline-none"
                  name="title"
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex items-center justify-center">
                <input
                  type="checkbox"
                  name="check"
                  onChange={(e) => {
                    setFree(!free);
                  }}
                />
                <label htmlFor="check" className="text-white">
                  indicate if the product is free
                </label>
              </div>

              {!free && (
                <div className="form-group flex flex-col text-center py-4">
                  <label htmlFor="price" className="text-white">
                    product price in $ (required)
                  </label>
                  <input
                    type="text"
                    className="w-96 py-1 rounded outline-none"
                    name="price"
                    pattern="^\d*(\.\d{0,2})?$"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group flex flex-col text-center ">
                <label htmlFor="description" className="text-white">
                  Description
                </label>
                <textarea
                  name=""
                  id=""
                  cols="10"
                  rows="5"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group flex flex-col text-center text-white">
                <label className="relative font-medium cursor-pointer  my-3 block">
                  <p className="">
                    Product image {image && "✅"} (800 x 450 suggested)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files && event.target.files[0]) {
                        if (event.target.files[0].size > 3072000) {
                          alert("Maximum size allowed is 3MB");
                          return false;
                        }
                        setImage(event.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="form-group flex flex-col text-center text-white">
                <label className="relative font-medium cursor-pointer  my-3 block">
                  <p className="">Product {product && "✅"}</p> (required)
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files && event.target.files[0]) {
                        if (event.target.files[0].size > 20480000) {
                          alert("Maximum size allowed is 20MB");
                          return false;
                        }
                        setProduct(event.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="submit text-center py-4">
                <button
                  disabled={title && product && (free || price) ? false : true}
                  className={`border px-8 py-2 mt-10 font-bold bg-fuchsia-200  ${
                    title && (free || price)
                      ? "cursor-pointer"
                      : "cursor-not-allowed text-gray-800 border-gray-800"
                  }`}
                >
                  Create product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
