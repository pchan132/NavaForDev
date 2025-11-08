import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/application/getCurrentUser"; // ตรวจสอบ user_id จาก session
import { PrismaProjectRepository } from "@/modules/project/infrastructure/project.repository"; // นำเข้าพนักงาน repository
import { CreateProjectUseCase } from "@/modules/project/application/createProject.usecase"; // นำเข้า use-case สำหรับสร้างโปรเจกต์

// API route สำหรับสร้างโปรเจกต์ใหม่ meythod: POST
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      // ตรวจสอบว่า user มี session หรือไม่
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const projectRepository = new PrismaProjectRepository(); // สร้าง instance ของ repository
    const createProjectUseCase = new CreateProjectUseCase(projectRepository); // สร้าง instance ของ use-case

    const projectData = await createProjectUseCase.execute(
      body.title, // ส่งค่า title ที่ได้รับจาก body
      body.description || null, // ส่งค่า description ที่ได้รับจาก body หรือ null ถ้าไม่มี
      user.id, // ใช้ user.id จาก session
      body.status // ส่งค่า status ที่ได้รับจาก body
    );

    return NextResponse.json(
      { message: "Project created successfully", project: projectData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Api route สำหรับดึงโปรเจกต์ทั้งหมดของผู้ใช้ method: GET
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const projectRepository = new PrismaProjectRepository();
    const projects = await projectRepository.findProjectsByUserId(user.id);

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching projects:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
