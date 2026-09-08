import { connectToDatabase } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Faculty, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Faculty, request); } catch { return apiError(); } }
