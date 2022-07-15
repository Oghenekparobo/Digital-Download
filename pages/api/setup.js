import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "user not logged in" });

  const user = await prisma.user.findUnique({
    id: session.user.id,
  });

  if (!user) return res.status(401).json({ message: "user not found" });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: req.body.name,
    },
  });

  res.end()
  return
}
