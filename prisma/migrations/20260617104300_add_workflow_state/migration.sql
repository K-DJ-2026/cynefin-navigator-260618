-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL DEFAULT 'situation',
    "situationOutput" TEXT,
    "problemOutput" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkflowState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowState_projectId_key" ON "WorkflowState"("projectId");
