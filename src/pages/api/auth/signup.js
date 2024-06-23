import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

const signup = async (req, res) => {
  console.log("req.method:", req.method);
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      console.log("existingUser:", existingUser);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default signup;
