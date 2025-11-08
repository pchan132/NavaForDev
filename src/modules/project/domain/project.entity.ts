// src/modules/project/domain/project.entity.ts

// Project entity interface
// คุณสามารถเพิ่มฟิลด์อื่น ๆ ตามที่ต้องการ
// กำหนดฟิลด์พื้นฐาน หรือ TypeORM entity ได้ตามต้องการ
export interface Project {
  id: string;
  title: string;
  description?: string;
  userId: string; // ผู้ใช้ที่เป็นเจ้าของโปรเจกต์
  status: "todo" | "doing" | "done";
  createdAt: Date;
}
