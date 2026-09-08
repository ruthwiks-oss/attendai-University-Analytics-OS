import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Department, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Department, request); } catch { return apiError(); } }
