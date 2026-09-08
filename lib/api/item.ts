import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { deleteDocument, getDocument, updateDocument } from "@/lib/api/crud";

export async function itemGet(model: Model<unknown>, id: string) {
  try { return await getDocument(model, id); } catch { return NextResponse.json({ success: false, error: "Request could not be completed." }, { status: 400 }); }
}
export async function itemPut(model: Model<unknown>, id: string, request: Request) {
  try { return await updateDocument(model, id, request); } catch { return NextResponse.json({ success: false, error: "Request could not be completed." }, { status: 400 }); }
}
export async function itemDelete(model: Model<unknown>, id: string, request: Request) {
  try { return await deleteDocument(model, id, request); } catch { return NextResponse.json({ success: false, error: "Request could not be completed." }, { status: 400 }); }
}
