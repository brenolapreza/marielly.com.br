import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { sections } from "@/app/(public)/section";

const adapter = new PrismaBetterSQLite3({
  url: "file:./prisma/dev.db",
});

export const prisma = new PrismaClient({ adapter });

async function main() {
  for (const section of sections) {
    await prisma.section.create({
      data: {
        section: section.section,
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        content: section.content ?? null,
        button: section.button ?? null,
        cards: section.cards ?? null,
        buttons: section.buttons ?? null,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed finalizado com sucesso!");
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
    return prisma.$disconnect();
  });
