-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "sessionDate" TEXT NOT NULL,
    "sessionTime" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionDate_sessionTime_key" ON "Session"("sessionDate", "sessionTime");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_date_time_key" ON "TimeSlot"("date", "time");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_sessionDate_sessionTime_fkey" FOREIGN KEY ("sessionDate", "sessionTime") REFERENCES "TimeSlot"("date", "time") ON DELETE RESTRICT ON UPDATE CASCADE;
