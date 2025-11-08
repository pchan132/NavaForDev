import { IProjectRepository } from "../interface/IProjectRepository"; // สัญญา Project Repository หรือหัวหน้า ที่รับงาน ว่าทำอะไรได้บ้าง

// use case สำหรับสร้างโปรเจกต์ใหม่
export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(
    title: string,
    description: string | null,
    userId: string,
    status: "todo" | "doing" | "done"
  ) {
    if (!title || !userId || !status) {
      throw new Error(
        "Title, User ID, and Status are required to create a project."
      );
    }

    // เรียกใช้เมธอด createProject จาก repository เพื่อสร้างโปรเจกต์ใหม่
    const projectData = await this.projectRepository.createProject({
      title,
      description: description || undefined,
      userId,
      status,
    });

    return projectData;
  }
}
