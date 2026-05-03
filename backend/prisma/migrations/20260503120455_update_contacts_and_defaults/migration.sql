-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "titleKk" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "descriptionKk" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT,
    "propertyType" TEXT NOT NULL,
    "dealType" TEXT NOT NULL,
    "rooms" INTEGER,
    "area" DOUBLE PRECISION,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "yearBuilt" INTEGER,
    "residentialComplex" TEXT,
    "material" TEXT,
    "kitchenArea" DOUBLE PRECISION,
    "ceilingHeight" DOUBLE PRECISION,
    "bathroom" TEXT,
    "balcony" TEXT,
    "furniture" TEXT,
    "mortgageAvailable" BOOLEAN NOT NULL DEFAULT false,
    "instagram" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "extraNotes" TEXT,
    "otherContacts" TEXT,
    "landArea" DOUBLE PRECISION,
    "houseArea" DOUBLE PRECISION,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_dealType_idx" ON "Property"("dealType");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_district_idx" ON "Property"("district");
