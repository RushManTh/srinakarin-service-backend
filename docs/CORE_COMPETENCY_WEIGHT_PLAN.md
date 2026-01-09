# 📋 แผนการพัฒนาระบบ Weight คะแนนสมรรถนะหลักจาก Learning Area

## 🎯 ภาพรวม

พัฒนาระบบที่สามารถคำนวณคะแนนสมรรถนะหลัก (CoreCompetency) โดยใช้น้ำหนัก (weight) จากกลุ่มสาระการเรียนรู้ต่างๆ (LearningArea) ตามสัดส่วนที่กำหนด

---

## 📊 Phase 1: Database Schema Design

### 1.1 เพิ่ม Model ใหม่ใน Prisma Schema

**Model: `CoreCompetencyLearningAreaWeight`**

```prisma
model CoreCompetencyLearningAreaWeight {
  id               String         @id @default(uuid())
  coreCompetencyId String
  coreCompetency   CoreCompetency @relation(fields: [coreCompetencyId], references: [id])
  learningAreaId   String
  learningArea     LearningArea   @relation(fields: [learningAreaId], references: [id])
  weight           Float          // สัดส่วน 0.0-1.0 (เช่น 0.3 = 30%)
  levelId          String?        // optional: กำหนดต่างกันตามช่วงชั้น
  level            Level?         @relation(fields: [levelId], references: [id])
  isActive         Boolean        @default(true)
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @default(now()) @updatedAt

  @@unique([coreCompetencyId, learningAreaId, levelId])
  @@index([coreCompetencyId])
  @@index([learningAreaId])
  @@index([levelId])
}
```

### 1.2 อัพเดท Back Relations

**ใน `CoreCompetency`:**

```prisma
model CoreCompetency {
  // ... existing fields
  learningAreaWeights CoreCompetencyLearningAreaWeight[]
}
```

**ใน `LearningArea`:**

```prisma
model LearningArea {
  // ... existing fields
  coreCompetencyWeights CoreCompetencyLearningAreaWeight[]
}
```

**ใน `Level`:**

```prisma
model Level {
  // ... existing fields
  coreCompetencyLearningAreaWeights CoreCompetencyLearningAreaWeight[]
}
```

### 1.3 สร้าง Migration

```bash
bunx prisma migrate dev --name add_core_competency_learning_area_weight
bunx prisma generate
```

---

## 🔧 Phase 2: Backend Service Development

### 2.1 สร้าง Service สำหรับจัดการ Weight

**File: `src/v1/services/admin/coreCompetencyWeight.service.ts`**

**Functions ที่ต้องมี:**

- `createWeight(data)` - สร้างการกำหนด weight ใหม่
- `updateWeight(id, data)` - แก้ไข weight
- `deleteWeight(id)` - ลบ weight
- `listWeights({ coreCompetencyId?, levelId? })` - ดึงรายการ weight
- `getWeightById(id)` - ดึง weight ตาม ID
- `validateWeightSum(coreCompetencyId, levelId)` - ตรวจสอบว่า weight รวมเป็น 100% หรือไม่

### 2.2 สร้าง Service สำหรับคำนวณคะแนน

**File: `src/v1/services/calculation/coreCompetencyScore.service.ts`**

**Functions หลัก:**

#### `calculateStudentCoreCompetencyScore(params)`

```typescript
interface CalculateParams {
  studentId: string;
  coreCompetencyId: string;
  academicYearId: string;
  termId: string;
  levelId?: string;
}

interface ScoreResult {
  coreCompetencyId: string;
  studentId: string;
  finalScore: number;
  finalLevel: number; // ระดับที่ได้ (1-4)
  breakdown: {
    learningAreaId: string;
    learningAreaName: string;
    weight: number;
    averageScore: number;
    weightedScore: number;
    competencyScores: {
      competencyId: string;
      competencyName: string;
      assignmentCount: number;
      averageScore: number;
    }[];
  }[];
  metadata: {
    totalAssignments: number;
    calculatedAt: Date;
  };
}
```

**Logic Flow:**

1. ดึง weight configuration ของสมรรถนะหลัก
2. Loop แต่ละ LearningArea
3. Query คะแนนจากชิ้นงานที่อยู่ใน LA นั้น
4. คำนวณคะแนนเฉลี่ย per LA
5. คูณด้วย weight
6. รวมคะแนนถ่วงน้ำหนักทั้งหมด
7. Map คะแนนเข้าระดับ (CoreCompetencyLevel)

#### `calculateClassroomCoreCompetencyScores(params)`

```typescript
// คำนวณคะแนนสมรรถนะหลักของทั้งห้อง
interface ClassroomParams {
  classroomId: string;
  coreCompetencyId: string;
  academicYearId: string;
  termId: string;
}
```

#### `getCoreCompetencyScoreHistory(studentId, coreCompetencyId)`

```typescript
// ดึงประวัติคะแนนสมรรถนะหลักแต่ละเทอม
```

---

## 🎨 Phase 3: API Controllers & Routes

### 3.1 Weight Management API

**File: `src/v1/controllers/admin/coreCompetencyWeight.controller.ts`**

**Endpoints:**

- `GET /api/v1/admin/core-competency-weights` - ดึงรายการ weight
- `GET /api/v1/admin/core-competency-weights/:id` - ดึง weight ตาม ID
- `POST /api/v1/admin/core-competency-weights` - สร้าง weight ใหม่
- `PATCH /api/v1/admin/core-competency-weights/:id` - แก้ไข weight
- `DELETE /api/v1/admin/core-competency-weights/:id` - ลบ weight
- `POST /api/v1/admin/core-competency-weights/validate` - ตรวจสอบความถูกต้อง (sum = 100%)

### 3.2 Score Calculation API

**File: `src/v1/controllers/calculation/coreCompetencyScore.controller.ts`**

**Endpoints:**

- `POST /api/v1/calculations/core-competency-score` - คำนวณคะแนนนักเรียน
- `GET /api/v1/calculations/core-competency-score/:studentId` - ดึงคะแนนของนักเรียน
- `POST /api/v1/calculations/core-competency-score/classroom` - คำนวณทั้งห้อง
- `GET /api/v1/calculations/core-competency-score/history/:studentId/:coreCompetencyId` - ประวัติคะแนน

### 3.3 Register Routes

**File: `src/v1/routes/index.admin.route.ts`**

```typescript
import coreCompetencyWeightRoute from "./admin/coreCompetencyWeight.route";
app.use(coreCompetencyWeightRoute);
```

**File: `src/v1/routes/index.route.ts`**

```typescript
import coreCompetencyScoreRoute from "./calculation/coreCompetencyScore.route";
app.use(coreCompetencyScoreRoute);
```

---

## 💾 Phase 4: Data Storage (Optional)

### 4.1 เพิ่ม Model บันทึกผลคะแนน

**Model: `StudentCoreCompetencyScore`** (สำหรับ cache/history)

```prisma
model StudentCoreCompetencyScore {
  id               String         @id @default(uuid())
  studentId        String
  student          Student        @relation(fields: [studentId], references: [id])
  coreCompetencyId String
  coreCompetency   CoreCompetency @relation(fields: [coreCompetencyId], references: [id])
  academicYearId   String
  academicYear     AcademicYear   @relation(fields: [academicYearId], references: [id])
  termId           String
  term             Term           @relation(fields: [termId], references: [id])
  score            Float          // คะแนนถ่วงน้ำหนัก
  level            Int            // ระดับที่ได้ (1-4)
  breakdown        Json           // เก็บรายละเอียดการคำนวณ
  calculatedAt     DateTime       @default(now())
  updatedAt        DateTime       @default(now()) @updatedAt

  @@unique([studentId, coreCompetencyId, academicYearId, termId])
  @@index([studentId])
  @@index([coreCompetencyId])
  @@index([academicYearId])
  @@index([termId])
}
```

---

## 🧪 Phase 5: Testing & Validation

### 5.1 Unit Tests

- Test weight validation (sum = 100%)
- Test score calculation logic
- Test edge cases (no data, missing weights)

### 5.2 Integration Tests

- Test full flow: create weight → calculate score
- Test with real data scenarios

### 5.3 Manual Testing Scenarios

```typescript
// Scenario 1: สมรรถนะหลัก "ความสามารถในการคิด"
// LA1 (คณิตศาสตร์) = 30%
// LA2 (วิทยาศาสตร์) = 70%

// Scenario 2: นักเรียนไม่มีคะแนนใน LA บางตัว
// Scenario 3: Weight ไม่ครบ 100%
// Scenario 4: คำนวณทั้งห้อง 30 คน
```

---

## 📱 Phase 6: Frontend Integration (Optional)

### 6.1 Admin UI: Weight Management

- **หน้าจอจัดการ Weight**
  - เลือกสมรรถนะหลัก
  - เลือกช่วงชั้น
  - เพิ่ม/ลบ LA พร้อม slider ปรับ %
  - แสดง progress bar รวม 100%
  - ปุ่ม Validate & Save

### 6.2 Teacher/Student UI: View Scores

- **หน้าแสดงคะแนนสมรรถนะหลัก**
  - แสดงคะแนนรวม
  - แสดง breakdown ตาม LA
  - แสดงกราฟเปรียบเทียบ
  - Export PDF report

---

## 🚀 Phase 7: Deployment & Monitoring

### 7.1 Database Migration Production

```bash
# Backup database
# Run migration
bunx prisma migrate deploy
```

### 7.2 Seed ข้อมูล Weight เริ่มต้น

```typescript
// สร้าง seed script สำหรับ weight configuration พื้นฐาน
```

### 7.3 Performance Monitoring

- Monitor query performance
- Add indexes if needed
- Cache frequently accessed weights

---

## 📝 Phase 8: Documentation

### 8.1 API Documentation (Swagger)

- เพิ่ม endpoint specs
- Request/Response examples
- Error codes

### 8.2 Admin Guide

- วิธีตั้งค่า weight
- วิธีตรวจสอบความถูกต้อง
- Best practices

### 8.3 Technical Documentation

- Architecture diagram
- Calculation formula explanation
- Database schema diagram

---

## ⏱️ Timeline Estimate

| Phase     | Tasks                   | Estimated Time  |
| --------- | ----------------------- | --------------- |
| Phase 1   | Schema & Migration      | 2-3 hours       |
| Phase 2   | Backend Services        | 8-10 hours      |
| Phase 3   | API Development         | 4-6 hours       |
| Phase 4   | Data Storage (Optional) | 2-3 hours       |
| Phase 5   | Testing                 | 4-6 hours       |
| Phase 6   | Frontend (Optional)     | 12-16 hours     |
| Phase 7   | Deployment              | 2-3 hours       |
| Phase 8   | Documentation           | 3-4 hours       |
| **Total** |                         | **37-51 hours** |

---

## ✅ Checklist

### Database

- [ ] เพิ่ม `CoreCompetencyLearningAreaWeight` model
- [ ] เพิ่ม back-relations ทุก model
- [ ] สร้าง migration
- [ ] Run migration (dev)
- [ ] Validate schema

### Backend

- [ ] สร้าง weight management service
- [ ] สร้าง score calculation service
- [ ] สร้าง validation logic
- [ ] Handle edge cases

### API

- [ ] สร้าง weight CRUD controllers
- [ ] สร้าง calculation controllers
- [ ] Register routes
- [ ] Add middleware (auth, validation)

### Testing

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual test scenarios
- [ ] Performance testing

### Deployment

- [ ] Backup database
- [ ] Run production migration
- [ ] Seed initial data
- [ ] Monitor performance

### Documentation

- [ ] API docs
- [ ] Admin guide
- [ ] Technical docs

---

## 🎯 Next Steps

1. **เริ่มจาก Phase 1**: แก้ไข schema และสร้าง migration
2. **ทดสอบ Schema**: Validate และ generate Prisma client
3. **พัฒนา Core Services**: เริ่มจาก weight management
4. **สร้าง Calculation Logic**: พัฒนาส่วนคำนวณคะแนน
5. **Build APIs**: สร้าง endpoints ทีละส่วน
6. **Testing**: ทดสอบทุก scenario
7. **Deploy**: นำขึ้น production

---

## 📚 ตัวอย่างการใช้งาน

### ตัวอย่างที่ 1: ตั้งค่า Weight

```typescript
// สมรรถนะหลัก: "ความสามารถในการคิด" สำหรับ ช่วงชั้นที่ 1
await prisma.coreCompetencyLearningAreaWeight.createMany({
  data: [
    {
      coreCompetencyId: "core-comp-1",
      learningAreaId: "la-math", // คณิตศาสตร์
      levelId: "level-1",
      weight: 0.3, // 30%
      isActive: true,
    },
    {
      coreCompetencyId: "core-comp-1",
      learningAreaId: "la-science", // วิทยาศาสตร์
      levelId: "level-1",
      weight: 0.7, // 70%
      isActive: true,
    },
  ],
});
```

### ตัวอย่างที่ 2: คำนวณคะแนน

```typescript
const result = await calculateStudentCoreCompetencyScore({
  studentId: "student-001",
  coreCompetencyId: "core-comp-1",
  academicYearId: "2567",
  termId: "term-1",
});

console.log(result);
// Output:
// {
//   finalScore: 82.5,
//   finalLevel: 3,  // ระดับ "ดี"
//   breakdown: [
//     {
//       learningAreaName: "คณิตศาสตร์",
//       weight: 0.3,
//       averageScore: 75,
//       weightedScore: 22.5
//     },
//     {
//       learningAreaName: "วิทยาศาสตร์",
//       weight: 0.7,
//       averageScore: 85.7,
//       weightedScore: 60.0
//     }
//   ]
// }
```

---

**พร้อมเริ่ม Phase 1 แล้วครับ!** 🚀
