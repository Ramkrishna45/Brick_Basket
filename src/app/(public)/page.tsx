"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight, CheckCircle2, XCircle, Star, ChevronDown, ChevronUp,
  Building2, Clock, Shield, Smartphone, HardHat, Camera, FileText,
  CreditCard, Users, Award, Phone,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, SERVICES_LIST, TESTIMONIALS, FAQS, TRUST_STATS, CONSTRUCTION_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        </div>
        {/* Amber glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <Badge className="mb-6 bg-amber-600/20 text-amber-300 border-amber-600/30 hover:bg-amber-600/30">
              🏗️ India&apos;s Most Transparent Construction Platform
            </Badge>
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Build Your Dream Home
            <span className="block text-amber-400">With Complete Transparency</span>
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Track every brick, every day. Get daily photo updates, milestone payments, and complete
            project visibility — all on your phone.
          </motion.p>

          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button render={<Link href="/enquiry" />} size="lg" className="bg-amber-600 hover:bg-amber-700 text-white gap-2 text-base h-12 px-8">
              Get Free Consultation <ArrowRight className="h-4 w-4" />
            </Button>
            <Button render={<Link href="/plans" />} size="lg" variant="outline" className="border-white/30 text-white hover:bg-white dark:bg-slate-950/10 h-12 px-8 text-base">
              Explore Plans
            </Button>
          </motion.div>

          {/* Trust stats bar */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">Simple Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              From enquiry to handover — a transparent, tracked, and trusted journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-300 to-amber-500 z-0" style={{ left: "12.5%", right: "12.5%" }} />

            {[
              { step: "01", icon: FileText, title: "Submit Enquiry", desc: "Tell us your home requirements — plot size, budget, and location." },
              { step: "02", icon: Users, title: "Select Plan", desc: "Our team calls you, understands your needs, and you choose a plan." },
              { step: "03", icon: HardHat, title: "Start Construction", desc: "An engineer is assigned and work begins with full documentation." },
              { step: "04", icon: Camera, title: "Track Daily", desc: "Get daily photos, stage updates, and payment milestones on your phone." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative flex flex-col items-center text-center bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow z-10"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{item.step}</span>
                </div>
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
                  <item.icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">Our Services</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Everything You Need to Build</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              End-to-end construction management so you can focus on your dream, not the details.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_LIST.slice(0, 6).map((service, i) => (
              <motion.div
                key={service.id}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-amber-300 hover:shadow-md transition-all duration-300 cursor-default"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 group-hover:bg-amber-100 transition-colors mb-4">
                  <service.lucideIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
                <Link href="/services" className="text-sm text-amber-600 dark:text-amber-500 font-medium hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 group/link">
                  Learn more <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button render={<Link href="/services" />} variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-950/40">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PLANS ─── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Choose Your Plan</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Transparent pricing with milestone-based payments. No hidden costs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={cn(
                  "relative bg-white dark:bg-slate-950 rounded-2xl border p-6 transition-all duration-300",
                  plan.isPopular
                    ? "border-amber-500 shadow-xl shadow-amber-100 scale-[1.02] md:scale-105"
                    : "border-slate-200 dark:border-slate-800 hover:border-amber-300 hover:shadow-md"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white border-0 px-3">⭐ Most Popular</Badge>
                  </div>
                )}
                <div className={cn("inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-3",
                  plan.isPopular ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                )}>
                  {plan.name}
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm"> {plan.priceUnit}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{plan.sqftRange}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Duration: {plan.duration}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">{plan.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.slice(0, 7).map((f) => (
                    <li key={f.name} className="flex items-center gap-2 text-sm">
                      {f.included
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        : <XCircle className="h-4 w-4 text-slate-300 flex-shrink-0" />}
                      <span className={f.included ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}>{f.name}</span>
                    </li>
                  ))}
                </ul>
                <Button render={<Link href="/enquiry" />} className={cn("w-full",
                  plan.isPopular
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:text-amber-700 dark:text-amber-400"
                )} variant={plan.isPopular ? "default" : "outline"}>
                  Choose {plan.name}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button render={<Link href="/plans" />} variant="ghost" className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:text-amber-400 gap-1">
              Compare all plans in detail <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">Why Brick Basket</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Built for Peace of Mind</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              We solve the biggest pain points of home construction — lack of transparency, poor communication, and no accountability.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: "Daily Photo Updates", desc: "See every stage of construction with high-quality photos uploaded every single day." },
              { icon: FileText, title: "Online Document Access", desc: "All agreements, plans, and certificates stored securely and accessible anytime." },
              { icon: CreditCard, title: "Milestone Payments", desc: "Pay only when stages are completed and verified. No bulk upfront payments." },
              { icon: HardHat, title: "Dedicated Engineer", desc: "Your project gets an assigned engineer who is accountable for quality and timelines." },
              { icon: Smartphone, title: "Mobile-First Platform", desc: "Track your project from anywhere — perfect for NRIs and busy professionals." },
              { icon: Shield, title: "Quality Guarantee", desc: "We use certified materials and follow IS standards at every construction stage." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:bg-amber-950/40 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors flex-shrink-0">
                  <item.icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Happy Homeowners</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.review}&rdquo;</p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.projectType} · {t.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Common Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.id}
                custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:bg-slate-900 transition-colors"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100 pr-4">{faq.question}</span>
                  {openFaq === faq.id
                    ? <ChevronUp className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Building2 className="absolute bottom-0 right-0 h-64 w-64 text-white translate-x-16 translate-y-16" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Award className="h-12 w-12 text-amber-300 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Build Your Dream Home?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-xl mx-auto">
              Get a free consultation from our experts. No obligation. Just clarity on your home construction journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button render={<Link href="/enquiry" />} size="lg" className="bg-white dark:bg-slate-950 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:bg-amber-950/40 gap-2 h-12 px-8 text-base font-semibold">
                Get Free Consultation <ArrowRight className="h-4 w-4" />
              </Button>
              <Button render={<a href={`tel:+919876543210`} />} size="lg" variant="outline" className="border-white/40 text-white hover:bg-white dark:bg-slate-950/10 h-12 px-8 text-base gap-2">
                <Phone className="h-4 w-4" /> Call Us Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
