import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Student, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Student, (await context.params).id, request); }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Student, (await context.params).id); }
