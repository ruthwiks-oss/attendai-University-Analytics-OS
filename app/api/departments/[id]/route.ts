import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Department, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Department, (await context.params).id, request); }
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Department, (await context.params).id, request); }
