import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  const { connectToDatabase } = await import("../lib/mongodb");
  const { default: Department } = await import("../models/Department");
  const { default: Student } = await import("../models/Student");
  const { default: Faculty } = await import("../models/Faculty");
  const { default: Subject } = await import("../models/Subject");
  const { default: ClassSession } = await import("../models/Class");

  await connectToDatabase();
  await Promise.all([Department.deleteMany({}), Student.deleteMany({}), Faculty.deleteMany({}), Subject.deleteMany({}), ClassSession.deleteMany({})]);
  const departments = await Department.insertMany([
    { deptId: "CSE", deptName: "Computer Science", hodName: "Dr. Maya Rao", office: "Block A · 204" },
    { deptId: "ECE", deptName: "Electronics", hodName: "Dr. Arjun Mehta", office: "Block B · 108" },
    { deptId: "ME", deptName: "Mechanical", hodName: "Dr. Priya Nair", office: "Block C · 301" },
    { deptId: "CE", deptName: "Civil Engineering", hodName: "Dr. Kabir Shah", office: "Block D · 116" },
  ]);
  const faculty = await Faculty.insertMany(Array.from({ length: 10 }, (_, index) => ({ facultyId: `FAC-${100 + index}`, name: ["Elena Torres", "Marcus Chen", "Isha Patel", "Noah Williams"][index % 4], email: `faculty${index}@christuniversity.edu`, designation: index < 3 ? "Professor" : "Assistant Professor", phone: `+1 555 010 ${String(index).padStart(2, "0")}` })));
  await Subject.insertMany(Array.from({ length: 16 }, (_, index) => ({ subjectId: `SUB-${200 + index}`, subjectName: ["Data Structures", "Signals & Systems", "Thermodynamics", "Structural Design"][index % 4], credits: 3, facultyId: faculty[index % faculty.length].facultyId })));
  await ClassSession.insertMany([
    { classId: "CS-204", date: new Date(), time: "09:00 - 10:00", roomNo: "Block A · 204", subjectId: "SUB-200" },
    { classId: "EC-108", date: new Date(), time: "11:00 - 12:00", roomNo: "Block B · 108", subjectId: "SUB-201" },
    { classId: "ME-301", date: new Date(), time: "14:00 - 15:00", roomNo: "Block C · 301", subjectId: "SUB-202" },
  ]);
  await Student.insertMany(Array.from({ length: 40 }, (_, index) => ({ studentId: `STU-${1000 + index}`, name: ["Aarav Sharma", "Nisha Menon", "Rohan Kapoor", "Sara Iqbal"][index % 4], email: `student${index}@christuniversity.edu`, semester: (index % 8) + 1, section: ["A", "B"][index % 2], deptId: departments[index % departments.length].deptId })));
  console.log("Seed complete: departments, students, faculty, subjects, and class sessions created.");
  process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
