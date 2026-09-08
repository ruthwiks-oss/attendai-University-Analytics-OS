import { connectToDatabase } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Faculty, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Faculty, (await context.params).id, request); }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Faculty, (await context.params).id); }
