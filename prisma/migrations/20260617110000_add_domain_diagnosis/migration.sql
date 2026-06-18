-- AlterTable
ALTER TABLE "WorkflowState" ADD COLUMN "primaryDomain" TEXT;
ALTER TABLE "WorkflowState" ADD COLUMN "alternativeDomain" TEXT;
ALTER TABLE "WorkflowState" ADD COLUMN "evidence" TEXT;
ALTER TABLE "WorkflowState" ADD COLUMN "counterEvidence" TEXT;
ALTER TABLE "WorkflowState" ADD COLUMN "confidence" INTEGER NOT NULL DEFAULT 50;
