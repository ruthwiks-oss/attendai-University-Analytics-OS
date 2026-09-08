import { connectToDatabase } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Subject, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Subject, (await context.params).id, request); }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Subject, (await context.params).id); }
