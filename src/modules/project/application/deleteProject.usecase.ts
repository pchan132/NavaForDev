import { IProjectRepository } from "../interface/IProjectRepository"; // สัญญา Project Repository

// use case สำหรับ ลบโปรเจกต์

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string) {
    if (!projectId) {
      throw new Error("Project ID is required to delete a project.");
    }

    // เรียกใช้เมธอด deleteProject จาก repository เพื่อ ลบโปรเจกต์
    await this.projectRepository.deleteProject(projectId);
  }
}
