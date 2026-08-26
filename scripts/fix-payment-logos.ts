/**
 * Remet les logoUrl par défaut pour les modes dont l'URL locale /uploads/ ne fonctionne pas en prod.
 * Usage : npx tsx scripts/fix-payment-logos.ts
 */
import prisma from "../src/lib/prisma";

const DEFAULTS: Record<string, string> = {
  CASH_ON_DELIVERY: "/payments/cash-on-delivery.svg",
  ORANGE_MONEY: "/payments/orange-money.svg",
  MTN_MOMO: "/payments/mtn-momo.svg",
  WAVE: "/payments/wave.svg",
  CARD: "/payments/card.svg",
  BANK_TRANSFER: "/payments/bank-transfer.svg",
};

async function main() {
  for (const [code, logoUrl] of Object.entries(DEFAULTS)) {
    const updated = await prisma.paymentMethodConfig.updateMany({
      where: {
        code,
        OR: [{ logoUrl: { startsWith: "/uploads/" } }, { logoUrl: null }],
      },
      data: { logoUrl },
    });
    if (updated.count > 0) {
      console.log(`✓ ${code} → ${logoUrl}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
