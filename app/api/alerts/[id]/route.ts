import { connectToDatabase } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Alert, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Alert, (await context.params).id, request); }
export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Alert, (await context.params).id); }
