-- CreateTable
CREATE TABLE "MontessoriCategory" (
    "id" TEXT NOT NULL,
    "schoolSubjectId" TEXT NOT NULL,
    "levelId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MontessoriCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MontessoriSubcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MontessoriSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MontessoriTopic" (
    "id" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "objective" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MontessoriTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MontessoriActivity" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enName" TEXT,
    "description" TEXT,
    "materialNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MontessoriActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MontessoriActivityLearned" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "learned" BOOLEAN NOT NULL,
    "learnedAt" TIMESTAMP(3),
    "note" TEXT,
    "markedByTeacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MontessoriActivityLearned_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MontessoriCategory_schoolSubjectId_idx" ON "MontessoriCategory"("schoolSubjectId");

-- CreateIndex
CREATE UNIQUE INDEX "MontessoriCategory_schoolSubjectId_code_key" ON "MontessoriCategory"("schoolSubjectId", "code");

-- CreateIndex
CREATE INDEX "MontessoriSubcategory_categoryId_idx" ON "MontessoriSubcategory"("categoryId");

-- CreateIndex
CREATE INDEX "MontessoriSubcategory_order_idx" ON "MontessoriSubcategory"("order");

-- CreateIndex
CREATE UNIQUE INDEX "MontessoriSubcategory_categoryId_code_key" ON "MontessoriSubcategory"("categoryId", "code");

-- CreateIndex
CREATE INDEX "MontessoriTopic_subcategoryId_idx" ON "MontessoriTopic"("subcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MontessoriTopic_subcategoryId_code_key" ON "MontessoriTopic"("subcategoryId", "code");

-- CreateIndex
CREATE INDEX "MontessoriActivity_topicId_idx" ON "MontessoriActivity"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "MontessoriActivity_topicId_code_key" ON "MontessoriActivity"("topicId", "code");

-- CreateIndex
CREATE INDEX "MontessoriActivityLearned_studentId_idx" ON "MontessoriActivityLearned"("studentId");

-- CreateIndex
CREATE INDEX "MontessoriActivityLearned_activityId_idx" ON "MontessoriActivityLearned"("activityId");

-- CreateIndex
CREATE INDEX "MontessoriActivityLearned_learned_idx" ON "MontessoriActivityLearned"("learned");

-- CreateIndex
CREATE UNIQUE INDEX "MontessoriActivityLearned_studentId_activityId_key" ON "MontessoriActivityLearned"("studentId", "activityId");

-- AddForeignKey
ALTER TABLE "MontessoriCategory" ADD CONSTRAINT "MontessoriCategory_schoolSubjectId_fkey" FOREIGN KEY ("schoolSubjectId") REFERENCES "SchoolSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriCategory" ADD CONSTRAINT "MontessoriCategory_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriSubcategory" ADD CONSTRAINT "MontessoriSubcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MontessoriCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriTopic" ADD CONSTRAINT "MontessoriTopic_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "MontessoriSubcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriActivity" ADD CONSTRAINT "MontessoriActivity_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "MontessoriTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriActivityLearned" ADD CONSTRAINT "MontessoriActivityLearned_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriActivityLearned" ADD CONSTRAINT "MontessoriActivityLearned_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "MontessoriActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MontessoriActivityLearned" ADD CONSTRAINT "MontessoriActivityLearned_markedByTeacherId_fkey" FOREIGN KEY ("markedByTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
