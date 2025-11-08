import { prisma } from "../../../lib/prismaAdapter"; // อุปกรณ์ Prisma Client
import { IProjectRepository } from "../interface/IProjectRepository"; // สัญญา Project Repository
import { Project } from "../domain/project.entity"; // เอนทิตี Project หรือ ข้อมูลประเภท ที่เกี่ยวข้อง กับโปรเจกต์

// สร้างพนักงาน ชื่อ PrismaProjectRepository ที่ทำงานตามสัญญา IProjectRepository

export class PrismaProjectRepository implements IProjectRepository {
  // เมธอดสำหรับสร้างโปรเจกต์ใหม่
  async createProject(
    projectData: Omit<Project, "id" | "createdAt">
  ): Promise<Project> {
    const newProject = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description || null,
        userId: projectData.userId,
        status: projectData.status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        userId: true,
        status: true,
        createdAt: true,
      },
    });

    // แปลงข้อมูลจาก Prisma เป็น Project entity
    return this.mapPrismaProjectToProject(newProject);
  }

  async findProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        userId: true,
        status: true,
        createdAt: true,
      },
    });

    return projects.map((project) => this.mapPrismaProjectToProject(project));
  }

  async updateDataProject(
    projectId: string,
    updateData: Partial<Omit<Project, "id" | "createdAt">>
  ): Promise<Project> {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: updateData.title,
        description:
          updateData.description === undefined
            ? undefined
            : updateData.description || null,
        status: updateData.status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        userId: true,
        status: true,
        createdAt: true,
      },
    });

    return this.mapPrismaProjectToProject(updatedProject);
  }

  async deleteProject(projectId: string): Promise<void> {
    await prisma.project.delete({
      where: { id: projectId },
    });
  }

  // Helper method สำหรับแปลงข้อมูลจาก Prisma เป็น Project entity
  private mapPrismaProjectToProject(prismaProject: {
    id: string;
    title: string;
    description: string | null;
    userId: string;
    status: string;
    createdAt: Date;
  }): Project {
    return {
      id: prismaProject.id,
      title: prismaProject.title,
      description: prismaProject.description || undefined,
      userId: prismaProject.userId,
      status: prismaProject.status as "todo" | "doing" | "done",
      createdAt: prismaProject.createdAt,
    };
  }
}

/**
ฉันได้แก้ไขปัญหาทั้งหมดในไฟล์ [`src/modules/project/infrastructure/project.repository.ts`](src/modules/project/infrastructure/project.repository.ts:23) แล้ว

## ปัญหาที่แก้ไข:

### 1. **ปัญหาหลัก: Type incompatibility ระหว่าง `string | null` และ `string | undefined`**
- **สาเหตุ**: Prisma สร้าง `description: string | null` จาก `String?` ใน schema
- **แก้ไข**: สร้าง helper method [`mapPrismaProjectToProject()`](src/modules/project/infrastructure/project.repository.ts:69) เพื่อแปลง `null` เป็น `undefined`

### 2. **ปัญหาเพิ่มเติมที่พบและแก้ไข:**

#### **Status type casting**
- **สาเหตุ**: Prisma ให้ `status: string` แต่ Project entity ต้องการ `"todo" | "doing" | "done"`
- **แก้ไข**: ใช้ type casting `as "todo" | "doing" | "done"` ใน mapping method

#### **Implementation ที่ขาดหายไป**
- **ปัญหา**: เมธอดอื่นๆ ใน interface ยังไม่ถูก implement
- **แก้ไข**: เพิ่ม implementation สำหรับ:
  - [`findProjectsByUserId()`](src/modules/project/infrastructure/project.repository.ts:30)
  - [`updateDataProject()`](src/modules/project/infrastructure/project.repository.ts:40)
  - [`deleteProject()`](src/modules/project/infrastructure/project.repository.ts:58)

#### **Data handling ที่ไม่สมบูรณ์**
- **สาเหตุ**: การส่งข้อมูลตรงๆ โดยไม่จัดการ `null` values
- **แก้ไข**: ใช้ `description: projectData.description || null` ในการ create

## สิ่งที่ปรับปรุง:

1. **Type Safety**: แปลงข้อมูลจาก Prisma ให้ตรงกับ Project entity อย่างถูกต้อง
2. **Complete Implementation**: implement ทุกเมธอดใน interface
3. **Consistent Data Handling**: จัดการ `null`/`undefined` อย่างสม่ำเสมอ
4. **Code Organization**: แยก mapping logic เป็น helper method ชัดเจน

ตอนนี้ repository ทำงานได้อย่างสมบูรณ์และปลอดภัยต่อ TypeScript type system

 */
