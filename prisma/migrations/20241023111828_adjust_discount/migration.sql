-- AlterTable
ALTER TABLE "Discount" ALTER COLUMN "discount_type" SET DEFAULT 'fixed_amount',
ALTER COLUMN "discount_users_used" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "discount_is_active" SET DEFAULT true,
ALTER COLUMN "discount_product_ids" SET DEFAULT ARRAY[]::TEXT[];
