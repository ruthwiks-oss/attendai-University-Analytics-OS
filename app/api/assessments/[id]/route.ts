import { connectToDatabase } from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import { itemDelete, itemGet, itemPut } from "@/lib/api/item";
export async function GET(_: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemGet(Assessment, (await context.params).id); }
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemPut(Assessment, (await context.params).id, request); }
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) { await connectToDatabase(); return itemDelete(Assessment, (await context.params).id, request); }
