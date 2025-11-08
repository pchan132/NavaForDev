import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/application/getCurrentUser"; // ตรวจสอบ user_id จาก session
import { PrismaProjectRepository } from "@/modules/project/infrastructure/project.repository"; // นำเข้าพนักงาน repository
import { UpdateProjectUseCase } from "@/modules/project/application/updateProject.usecase"; // นำเข้า use-case สำหรับอัปเดตโปรเจกต์
import { DeleteProjectUseCase } from "@/modules/project/application/deleteProject.usecase"; // นำเข้า use-case สำหรับลบโปรเจกต์

// Api route สำหรับดึงเฉพาะโปรเจกต์ method: GET
interface idProps {
  params: { projectId: string };
}

export async function GET({ params }: idProps) {
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

    const { projectId } = params;
    console.log("Fetching project with ID:", projectId);

    const projectRepository = new PrismaProjectRepository();

    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error in fetching project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Api route สำหรับแก้ไขโปรเจกต์ method: PUT
export async function PUT({ params, request }: idProps & { request: Request }) {
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

    const { projectId } = params;
    const body = await request.json();

    const projectRepository = new PrismaProjectRepository();
    const updateProjectUseCase = new UpdateProjectUseCase(projectRepository);

    // ตรวจสอบว่าโปรเจกต์เป็นของผู้ใช้นี้ก่อนอัปเดต
    const existingProject = await projectRepository.findProjectById(projectId);
    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const updatedProject = await updateProjectUseCase.execute(
      projectId,
      body.title,
      body.description,
      body.status
    );

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Api route สำหรับลบโปรเจกต์ method: DELETE
export async function DELETE({ params }: idProps) {
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

    const { projectId } = params;
    const projectRepository = new PrismaProjectRepository();
    const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository);

    // ตรวจสอบว่าโปรเจกต์เป็นของผู้ใช้นี้ก่อนลบ
    const existingProject = await projectRepository.findProjectById(projectId);
    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    await deleteProjectUseCase.execute(projectId);

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
