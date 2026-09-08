import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Attendance, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Attendance, (await context.params).id, request); }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Attendance, (await context.params).id); }
