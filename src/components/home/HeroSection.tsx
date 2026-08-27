"use client";

import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={IMAGES.hero}
          alt="Conseil en image premium"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/70 via-brand-950/40 to-transparent" />
      </div>

      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-display text-white mb-8"
          >
            Révélez l&apos;image
            <br />
            <span className="italic font-light">qui vous ressemble</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-brand-200 leading-relaxed mb-10 max-w-lg"
          >
            Un accompagnement premium pour aligner votre image avec votre personnalité,
            votre fonction et vos ambitions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/orientation" className="btn-primary bg-white text-brand-950 hover:bg-brand-100 inline-flex items-center gap-2">
              Trouver mon accompagnement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/offres" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-950">
              Découvrir nos prestations
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
