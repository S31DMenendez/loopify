-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_register" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_register" ("address", "city", "country", "email", "id", "lastName", "name", "phone") SELECT "address", "city", "country", "email", "id", "lastName", "name", "phone" FROM "register";
DROP TABLE "register";
ALTER TABLE "new_register" RENAME TO "register";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
