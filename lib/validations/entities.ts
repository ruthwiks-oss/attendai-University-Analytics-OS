import { z } from "zod";

export const departmentSchema = z.object({ deptId: z.string().min(1), deptName: z.string().min(1), hodName: z.string().min(1), office: z.string().min(1) });
export const studentSchema = z.object({ studentId: z.string().min(1), name: z.string().min(1), email: z.string().email(), phone: z.string().optional(), dob: z.coerce.date(), semester: z.number().int().min(1).max(12), section: z.string().min(1), deptId: z.string().min(1) });
export const facultySchema = z.object({ facultyId: z.string().min(1), name: z.string().min(1), email: z.string().email(), designation: z.string().min(1), phone: z.string().optional() });
export const attendanceSchema = z.object({ attendanceId: z.string().min(1), studentId: z.string().min(1), classId: z.string().min(1), status: z.enum(["PRESENT", "ABSENT"]), date: z.coerce.date() });
export const assessmentSchema = z.object({ assessmentId: z.string().min(1), classId: z.string().min(1), marks: z.number().min(0), type: z.string().min(1), date: z.coerce.date() });
