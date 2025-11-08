import { IProjectRepository } from "../interface/IProjectRepository"; // สัญญา Project Repository

// use case สำหรับอัปเดตข้อมูลโปรเจกต์
export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(
    projectId: string,
    title?: string,
    description?: string | null,
    status?: "todo" | "doing" | "done"
  ) {
    if (!projectId) {
      throw new Error("Project ID is required to update a project.");
    }

    // เรียกใช้เมธอด updateDataProject จาก repository เพื่ออัปเดตข้อมูลโปรเจกต์
    const updatedDataProject = await this.projectRepository.updateDataProject(
      projectId,
      {
        title,
        description: description === null ? undefined : description,
        status,
      }
    );

    return updatedDataProject;
  }
}

/*
ได้แก้ไขปัญหาทั้งหมดในไฟล์ [`src/modules/project/application/updateProject.usecase.ts`](src/modules/project/application/updateProject.usecase.ts:18-26) เรียบร้อยแล้ว

## ปัญหาที่ได้รับการแก้ไข:

### 1. **Syntax Error (',' expected)**
- **สาเหตุ**: การใช้ object property syntax ผิดในการเรียกฟังก์ชัน `description: description === null ? null : description,`
- **การแก้ไข**: เปลี่ยนจากการส่ง arguments แยกกันเป็นการส่งเป็น object เดียวตามที่ interface กำหนด

### 2. **Argument Mismatch (Expected 2 arguments, but got 5)**
- **สาเหตุ**: เมธอด `updateDataProject` คาดหวัง 2 arguments (`projectId`, `updateData`) แต่โค้ดส่ง 5 arguments
- **การแก้ไข**: จัดรูปแบบให้ส่ง `projectId` และ `updateData` object ที่มี properties ที่ต้องการอัปเดต

### 3. **Type Compatibility Issue**
- **สาเหตุ**: `Project.description` มี type เป็น `string | undefined` แต่โค้ดพยายาม assign `null`
- **การแก้ไข**: เปลี่ยนจาก `null` เป็น `undefined` เพื่อให้ตรงกับ type definition

### 4. **Missing Return Statement**
- **สาเหตุ**: Use case ไม่มีการ return ค่าที่ได้จากการอัปเดต
- **การแก้ไข**: เพิ่ม `return updatedDataProject;` เพื่อคืนค่าโปรเจกต์ที่อัปเดตแล้ว

## โค้ดที่แก้ไขแล้ว:
```typescript
// เรียกใช้เมธอด updateDataProject จาก repository เพื่ออัปเดตข้อมูลโปรเจกต์
const updatedDataProject = await this.projectRepository.updateDataProject(
  projectId,
  {
    title,
    description: description === null ? undefined : description,
    status,
  }
);

return updatedDataProject;
```

การแก้ไขเหล่านี้ทำให้โค้ดทำงานได้อย่างถูกต้องตาม interface และ type safety ของ TypeScript
*/
