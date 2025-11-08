import { IProjectRepository } from "../interface/IProjectRepository"; // สัญญา Project Repository หรือหัวหน้า ที่รับงาน ว่าทำอะไรได้บ้าง

// use case สำหรับดึงข้อมูลโปรเจกต์ทั้งหมดของผู้ใช้
export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new Error("User ID is required to get projects.");
    }

    // เรียกใช้เมธอด findProjectsByUserId จาก repository เพื่อดึงข้อมูลโปรเจกต์ของผู้ใช้
    const projects = await this.projectRepository.findProjectsByUserId(userId);

    return projects;
  }
}
