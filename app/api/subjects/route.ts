import { connectToDatabase } from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Subject, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Subject, request); } catch { return apiError(); } }
