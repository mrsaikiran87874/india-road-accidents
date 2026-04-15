import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Bike,
  BookOpen,
  Car,
  CheckCircle2,
  Eye,
  Moon,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { usePreventionGuidelines } from "../hooks/useAccidentData";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Speed Management": {
    icon: AlertTriangle,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  "Helmet & Seatbelt": {
    icon: ShieldCheck,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  "Drunk Driving": {
    icon: Eye,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  "Night Driving": {
    icon: Moon,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
  "Two Wheeler Safety": {
    icon: Bike,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  "Heavy Vehicle": {
    icon: Truck,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  "Traffic Rules": {
    icon: Car,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  General: { icon: BookOpen, color: "text-muted-foreground", bg: "bg-muted" },
};

// Static fallback guidelines shown before backend data loads
const STATIC_GUIDELINES = [
  {
    id: BigInt(1),
    category: "Speed Management",
    title: "Adhere to Speed Limits",
    description:
      "Speeding is one of the top causes of fatal road accidents in India. Respecting posted speed limits dramatically reduces crash severity.",
    tips: [
      "Observe posted speed limit signs at all times",
      "Reduce speed in school zones, hospital areas, and construction zones",
      "Slow down in fog, rain, or other adverse weather conditions",
      "Never participate in street racing or competitive driving",
      "Use cruise control on highways to maintain consistent speed",
    ],
  },
  {
    id: BigInt(2),
    category: "Helmet & Seatbelt",
    title: "Always Wear Protective Gear",
    description:
      "Helmets and seatbelts are proven life-savers. India makes helmet use mandatory yet compliance remains low in many states.",
    tips: [
      "Wear a BIS-certified helmet every ride, even short distances",
      "Fasten seatbelts for all passengers including those in rear seats",
      "Ensure children under 4 are in age-appropriate child seats",
      "Replace helmets after any significant impact",
      "Check seatbelt condition regularly for cuts or fraying",
    ],
  },
  {
    id: BigInt(3),
    category: "Drunk Driving",
    title: "Never Drive Under Influence",
    description:
      "Drunk driving accounts for over 4% of fatal accidents in India. The legal BAC limit is 30 mg/100 ml blood.",
    tips: [
      "Designate a sober driver before drinking at social events",
      "Use cab services or public transport after consuming alcohol",
      "Do not accept rides from drivers who have been drinking",
      "Be aware that even one drink can impair reaction time",
      "Report suspected drunk drivers to traffic police helpline 1073",
    ],
  },
  {
    id: BigInt(4),
    category: "Night Driving",
    title: "Safe Driving at Night",
    description:
      "Nearly 42% of road deaths in India occur at night due to reduced visibility and fatigue.",
    tips: [
      "Ensure all vehicle lights (headlights, tail lights, indicators) function properly",
      "Use high-beam only when no oncoming traffic is present",
      "Take breaks every 2 hours on long night journeys",
      "Avoid driving if drowsy — pull over and rest",
      "Be extra cautious at unmarked intersections and rail crossings",
    ],
  },
  {
    id: BigInt(5),
    category: "Two Wheeler Safety",
    title: "Two-Wheeler Safety Practices",
    description:
      "Two-wheelers account for over 40% of all road accident deaths in India. Additional precautions are essential.",
    tips: [
      "Wear reflective gear to improve visibility to other drivers",
      "Avoid riding in vehicle blind spots, especially trucks",
      "Never carry more than one pillion rider",
      "Keep a safe following distance from larger vehicles",
      "Be extra cautious at potholes and uneven road surfaces",
    ],
  },
  {
    id: BigInt(6),
    category: "Traffic Rules",
    title: "Follow Traffic Rules Diligently",
    description:
      "Many Indian road fatalities result from basic traffic rule violations like red-light jumping and wrong-way driving.",
    tips: [
      "Stop fully at red lights and never jump signals",
      "Always drive on the correct side of the road",
      "Use indicators when changing lanes or turning",
      "Yield to pedestrians at zebra crossings",
      "Do not use mobile phones while driving — use hands-free",
    ],
  },
];

function GuidelineCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        {(["t1", "t2", "t3", "t4"] as const).map((k) => (
          <Skeleton key={k} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

interface GuidelineItem {
  id: bigint;
  category: string;
  title: string;
  description: string;
  tips: string[];
}

function GuidelineCard({
  guideline,
  index,
}: { guideline: GuidelineItem; index: number }) {
  const config = CATEGORY_CONFIG[guideline.category] ?? CATEGORY_CONFIG.General;
  const Icon = config.icon;

  return (
    <div
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-smooth"
      data-ocid={`guidelines.card.item.${index + 1}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="min-w-0">
          <Badge variant="secondary" className="mb-1.5 text-xs">
            {guideline.category}
          </Badge>
          <h3 className="text-base font-semibold font-display text-foreground leading-snug">
            {guideline.title}
          </h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {guideline.description}
      </p>
      <ul className="space-y-2">
        {guideline.tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-sm text-foreground"
          >
            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GuidelinesPage() {
  const { data: guidelines, isLoading } = usePreventionGuidelines();
  const displayData: GuidelineItem[] =
    guidelines && guidelines.length > 0 ? guidelines : STATIC_GUIDELINES;

  const categories = Array.from(new Set(displayData.map((g) => g.category)));

  return (
    <div className="space-y-6" data-ocid="guidelines.page">
      {/* Header */}
      <div>
        <h1 className="text-display-sm text-foreground">
          Prevention Guidelines
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evidence-based safety guidelines to reduce road accidents in India
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 md:p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-foreground mb-1">
            Road Safety Saves Lives
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            India records over 1.5 lakh road accident deaths annually — one of
            the highest globally. Following these evidence-based guidelines can
            significantly reduce your risk and protect other road users. Every
            action you take matters.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        className="flex flex-wrap gap-2"
        data-ocid="guidelines.category_filters"
      >
        {categories.map((cat, i) => {
          const config = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG.General;
          const Icon = config.icon;
          return (
            <Badge
              key={cat}
              variant="outline"
              className="gap-1.5 py-1 px-3 text-xs cursor-default"
              data-ocid={`guidelines.category.item.${i + 1}`}
            >
              <Icon className="w-3 h-3" />
              {cat}
            </Badge>
          );
        })}
      </div>

      {/* Guidelines Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          data-ocid="guidelines.loading_state"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <GuidelineCardSkeleton key={`gsk-${i + 1}`} />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          data-ocid="guidelines.cards_grid"
        >
          {displayData.map((guideline, i) => (
            <GuidelineCard
              key={Number(guideline.id)}
              guideline={guideline}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Emergency Banner */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 md:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Emergency Helplines
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {[
                { label: "Police", number: "100" },
                { label: "Ambulance", number: "108" },
                { label: "Traffic Helpline", number: "1073" },
              ].map((contact) => (
                <div key={contact.label} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {contact.label}:
                  </span>
                  <span className="text-sm font-bold font-mono text-destructive">
                    {contact.number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
