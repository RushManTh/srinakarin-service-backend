-- CreateTable
CREATE TABLE "CoreCompetency" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoreCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoreCompetencyToLevel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoreCompetencyToLevel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CoreCompetencyToStudentLevel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoreCompetencyToStudentLevel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CoreCompetency_code_key" ON "CoreCompetency"("code");

-- CreateIndex
CREATE INDEX "_CoreCompetencyToLevel_B_index" ON "_CoreCompetencyToLevel"("B");

-- CreateIndex
CREATE INDEX "_CoreCompetencyToStudentLevel_B_index" ON "_CoreCompetencyToStudentLevel"("B");

-- AddForeignKey
ALTER TABLE "_CoreCompetencyToLevel" ADD CONSTRAINT "_CoreCompetencyToLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "CoreCompetency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoreCompetencyToLevel" ADD CONSTRAINT "_CoreCompetencyToLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoreCompetencyToStudentLevel" ADD CONSTRAINT "_CoreCompetencyToStudentLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "CoreCompetency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoreCompetencyToStudentLevel" ADD CONSTRAINT "_CoreCompetencyToStudentLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
