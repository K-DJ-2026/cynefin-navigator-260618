CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "WorkflowState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "currentStep" TEXT NOT NULL DEFAULT 'situation',
    "situationOutput" TEXT,
    "problemOutput" TEXT,
    "primaryDomain" TEXT,
    "alternativeDomain" TEXT,
    "evidence" TEXT,
    "counterEvidence" TEXT,
    "confidence" INTEGER NOT NULL DEFAULT 50,
    "keyQuestion" TEXT,
    "observations" TEXT,
    "insights" TEXT,
    "facilitationNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkflowState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkflowState_projectId_key" ON "WorkflowState"("projectId");
