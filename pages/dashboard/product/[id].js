import prisma from "lib/prisma";
import { getProduct} from "lib/data";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import {useState} from 'react'

export default function Product({ product }) {
    
  const [title, setTitle] = useState(product.title);
  const [free, setFree] = useState(product.free);
  const [price, setPrice] = useState(product.price / 100);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(product.image);
  const [newproduct, setNewProduct] = useState(null);
  const [changedLink, setChangedLink] = useState(false);

  if (!product) return "hi no product";

  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  if (loading) return "loading";

  if (!session.user.name) {
    router.push("/setup");
    return;
  }

  return (
    <div className="">
      <div className="flex justify-center mt-10">
        <div>
          <h1 className="text-xl font-b old text-center py-1">Update Product</h1>

          <div className="capitalize bg-fuchsia-500 px-10 py-4">
            <form
              className="mt-10"
              onSubmit={async (e) => {
                e.preventDefault();

                const body = new FormData();
                body.append('id' , product.id)
                body.append("image", image);
                body.append("product", newproduct);
                body.append("title", title);
                body.append("free", free);
                body.append("price", price);
                body.append("description", description);

                await fetch("/api/edit", {
                  body,
                  method: "POST",
                });

                router.push('/dashboard');
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
                        setImageUrl(URL.createObjectURL(event.target.files[0]));
                      }
                    }}
                  />
                </label>
              </div>

              <div className="form-group flex flex-col text-center text-white">
                <label className="relative font-medium cursor-pointer  my-3 block">
                  <p className="">Product Doc {product && "✅"}</p> (required)
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files && event.target.files[0]) {
                        if (event.target.files[0].size > 20480000) {
                          alert("Maximum size allowed is 20MB");
                          return false;
                        }
                        setNewProduct(event.target.files[0]);
                        setChangedLink(true);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="">
                {!changedLink && (
                  <a className="underline" href={product.url}>
                    Link
                  </a>
                )}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };

  let product = await getProduct(context.params.id, prisma);
  product = JSON.parse(JSON.stringify(product));



  if (!product) return { props: {} };

  if (session.user.id !== product.author.id) return { props: {} };

  return {
    props: {
      product,
    },
  };
}
