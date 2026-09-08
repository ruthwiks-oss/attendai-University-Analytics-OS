import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/models/Student";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Student, request); } catch { return apiError(); } }
export async function POST(request: Request) { try { await connectToDatabase(); return createDocument(Student, request); } catch { return apiError(); } }
