import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const createUserSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "FACULTY", "STUDENT"]),
  linkedStudentId: z.string().optional(),
  linkedFacultyId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const input = createUserSchema.parse(await request.json());
    await connectToDatabase();
    const existing = await User.findOne({ $or: [{ email: input.email.toLowerCase() }, ...(input.username ? [{ username: input.username }] : [])] }).lean();
    if (existing) return NextResponse.json({ success: false, error: "A user with this email already exists." }, { status: 409 });
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({ ...input, email: input.email.toLowerCase(), passwordHash });
    return NextResponse.json({ success: true, data: { id: user._id.toString(), name: user.name, username: user.username, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, error: "Please check the registration details." }, { status: 400 });
    return NextResponse.json({ success: false, error: "User creation is unavailable until MongoDB is connected." }, { status: 503 });
  }
}
