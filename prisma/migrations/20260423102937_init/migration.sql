-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "material" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "targetPrice" TEXT NOT NULL,
    "deliveryDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEGOTIATING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
