import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FileText } from "lucide-react";
import { ClientPageIntro } from "@/components/layout/ClientPageIntro";

export default async function ClientDocumentsPage() {
  const session = await getServerSession(authOptions);
  const documents = await prisma.clientDocument.findMany({
    where: { userId: session!.user!.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <ClientPageIntro
        align="left"
        title="Mes documents"
        description="Livrables de coaching et documents liés à votre parcours image"
      />

      {documents.length === 0 ? (
        <div className="public-card text-center py-16 px-6">
          <FileText className="w-10 h-10 text-brand-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-brand-500 mb-2">Aucun document disponible</p>
          <p className="text-sm text-brand-400">Vos livrables apparaîtront ici après votre coaching</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="public-card p-6 hover:border-accent/40 hover:shadow-md transition-all group"
            >
              <FileText className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <p className="font-medium text-sm mb-1">{doc.title}</p>
              <p className="text-xs text-brand-400">{doc.type}</p>
              <p className="text-xs text-brand-300 mt-3">
                {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
