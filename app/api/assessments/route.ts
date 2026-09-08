import { connectToDatabase } from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Assessment, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Assessment, request); } catch { return apiError(); } }
