import { connectToDatabase } from "@/lib/mongodb";
import ClassSession from "@/models/Class";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(ClassSession, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(ClassSession, request); } catch { return apiError(); } }
