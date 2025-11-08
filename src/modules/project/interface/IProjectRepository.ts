import { Project } from "../domain/project.entity";

// Project repository interface
// กำหนดเมธอดที่จำเป็นสำหรับการจัดการโปรเจกต์
export interface IProjectRepository {
  createProject(
    projectData: Omit<Project, "id" | "createdAt">
  ): Promise<Project>;

  findProjectsByUserId(userId: string): Promise<Project[]>;

  updateDataProject(
    projectId: string,
    updateData: Partial<Omit<Project, "id" | "createdAt">>
  ): Promise<Project>;

  deleteProject(projectId: string): Promise<void>;
}
