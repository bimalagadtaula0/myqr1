import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ProfileId = "standard" | "wheelchair" | "elderly" | "lowVision" | "simplified";

export type NeedId =
  | "wheelchair"
  | "lowVision"
  | "simplified"
  | "quiet"
  | "avoidCrowds"
  | "audio"
  | "elderly"
  | "shortest"
  | "leastTurns";

export type RouteVariant = {
  id: string;
  label: string;
  /** SVG polyline points in 0–100 coords */
  points: string;
  distanceM: number;
  minutes: number;
  steps: { icon: string; title: string; detail: string; upcoming?: string }[];
  notes: string[];
  warnings?: string[];
};

export type Profile = {
  id: ProfileId;
  label: string;
  icon: string;
  tagline: string;
  defaultNeeds: NeedId[];
  route: RouteVariant;
  /** Visual morph hints */
  ui: {
    largeLabels: boolean;
    highContrast: boolean;
    simplified: boolean; // hide secondary landmarks
    showSlope: boolean;
  };
};

const baseShower = "🚿";

export const PROFILES: Record<ProfileId, Profile> = {
  standard: {
    id: "standard",
    label: "Standard",
    icon: "🚶",
    tagline: "Fastest direct route",
    defaultNeeds: ["shortest"],
    ui: { largeLabels: false, highContrast: false, simplified: false, showSlope: false },
    route: {
      id: "shortest",
      label: "Shortest route",
      points: "14,82 30,70 50,55 70,42 78,38",
      distanceM: 60,
      minutes: 1,
      steps: [
        { icon: "🚪", title: "Leave the changing room", detail: "Exit and turn slightly right toward the boardwalk.", upcoming: "Head diagonally toward the kiosk." },
        { icon: "🧭", title: "Head toward the kiosk", detail: "Walk diagonally across the boardwalk.", upcoming: "Continue past the kiosk on your right." },
        { icon: "🍹", title: "Pass the kiosk", detail: "Keep heading right.", upcoming: `Shower ${baseShower} is 20m ahead.` },
        { icon: "🚿", title: "Arrive at the shower", detail: "You have arrived." },
      ],
      notes: ["Direct path", "Some uneven sand"],
    },
  },
  wheelchair: {
    id: "wheelchair",
    label: "Wheelchair",
    icon: "♿",
    tagline: "Step-free, ramp-supported",
    defaultNeeds: ["wheelchair", "shortest"],
    ui: { largeLabels: true, highContrast: false, simplified: false, showSlope: true },
    route: {
      id: "ramp",
      label: "Step-free route",
      points: "14,82 38,82 38,55 62,55 78,38",
      distanceM: 80,
      minutes: 2,
      steps: [
        { icon: "🚪", title: "Leave changing room", detail: "Exit through the wide accessible door.", upcoming: "Follow the blue boardwalk straight ahead." },
        { icon: "🧭", title: "Follow the blue boardwalk", detail: "Smooth, step-free surface, 1.8m wide.", upcoming: "You will reach the kiosk in about 20m." },
        { icon: "🍹", title: "Pass the kiosk", detail: "Rest area on your left if needed.", upcoming: "Turn right toward the shower." },
        { icon: "🚿", title: "Turn right to the shower", detail: "Ramp at entrance. No steps.", upcoming: "You have arrived." },
      ],
      notes: ["Ramp at shower", "Step-free entire route", "Accessible WC nearby"],
    },
  },
  elderly: {
    id: "elderly",
    label: "Elderly friendly",
    icon: "🪑",
    tagline: "Gentle slope, benches along the way",
    defaultNeeds: ["elderly", "wheelchair"],
    ui: { largeLabels: true, highContrast: false, simplified: false, showSlope: true },
    route: {
      id: "gentle",
      label: "Gentle route with rest stops",
      points: "14,82 38,82 50,72 62,72 62,55 78,38",
      distanceM: 95,
      minutes: 3,
      steps: [
        { icon: "🚪", title: "Leave changing room", detail: "Take your time. Door opens automatically.", upcoming: "Bench available in 15m if you need a rest." },
        { icon: "🪑", title: "Pass the rest bench", detail: "First rest stop. Shaded area.", upcoming: "Continue along the boardwalk to the kiosk." },
        { icon: "🍹", title: "Stop at the kiosk", detail: "Rest area with seating and water.", upcoming: "Gentle slope ahead toward the shower." },
        { icon: "🚿", title: "Arrive at the shower", detail: "Handrails available at the entrance." },
      ],
      notes: ["2 rest benches", "Gentle slope only", "Handrails at shower", "Drinking water at kiosk"],
    },
  },
  lowVision: {
    id: "lowVision",
    label: "Low vision",
    icon: "👁",
    tagline: "High contrast, large landmarks, audio",
    defaultNeeds: ["lowVision", "audio", "wheelchair"],
    ui: { largeLabels: true, highContrast: true, simplified: true, showSlope: false },
    route: {
      id: "highContrast",
      label: "High-contrast route",
      points: "14,82 38,82 38,55 62,55 78,38",
      distanceM: 80,
      minutes: 2,
      steps: [
        { icon: "🚪", title: "Leave changing room", detail: "Tactile strip starts at the door.", upcoming: "Follow the high-contrast guide line." },
        { icon: "🧭", title: "Follow the guide line", detail: "Wide, dark boardwalk with bright edges.", upcoming: "Kiosk landmark on the left in 20 meters." },
        { icon: "🍹", title: "Reach the kiosk", detail: "Large landmark with audio beacon.", upcoming: "Right turn to the shower in 15 meters." },
        { icon: "🚿", title: "Arrive at the shower", detail: "Audio beacon at entrance." },
      ],
      notes: ["Tactile paving", "Audio beacons", "High-contrast edges", "Large signage"],
    },
  },
  simplified: {
    id: "simplified",
    label: "Simplified",
    icon: "🧠",
    tagline: "Fewest turns, calmest path",
    defaultNeeds: ["simplified", "quiet", "leastTurns"],
    ui: { largeLabels: true, highContrast: false, simplified: true, showSlope: false },
    route: {
      id: "leastTurns",
      label: "Least turns route",
      points: "14,82 38,82 38,38 78,38",
      distanceM: 90,
      minutes: 2,
      steps: [
        { icon: "🚪", title: "Leave changing room", detail: "Walk straight ahead.", upcoming: "Turn left once." },
        { icon: "↰", title: "Turn left", detail: "Just one turn. Keep going straight.", upcoming: "Long straight section." },
        { icon: "↱", title: "Turn right at the end", detail: "Shower is right there.", upcoming: "Almost there." },
        { icon: "🚿", title: "You have arrived", detail: "This is the shower." },
      ],
      notes: ["Only 2 turns", "Quiet path", "Minimal distractions"],
    },
  },
};

export const NEEDS: { id: NeedId; label: string; icon: string; profile?: ProfileId }[] = [
  { id: "wheelchair", label: "Wheelchair accessible", icon: "♿", profile: "wheelchair" },
  { id: "lowVision", label: "Low vision support", icon: "👁", profile: "lowVision" },
  { id: "simplified", label: "Simplified navigation", icon: "🧠", profile: "simplified" },
  { id: "quiet", label: "Quiet route", icon: "🤫" },
  { id: "avoidCrowds", label: "Avoid crowded areas", icon: "🚶‍♀️" },
  { id: "audio", label: "Audio guidance", icon: "🔈" },
  { id: "elderly", label: "Elderly friendly", icon: "🪑", profile: "elderly" },
  { id: "shortest", label: "Shortest route", icon: "📏" },
  { id: "leastTurns", label: "Least turns", icon: "🔁" },
];

type Ctx = {
  profile: Profile;
  profileId: ProfileId;
  setProfile: (id: ProfileId) => void;
  needs: Set<NeedId>;
  toggleNeed: (id: NeedId) => void;
  audioOn: boolean;
  setAudioOn: (v: boolean) => void;
};

const NavCtx = createContext<Ctx | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<ProfileId>("standard");
  const [needs, setNeeds] = useState<Set<NeedId>>(new Set(PROFILES.standard.defaultNeeds));
  const [audioOn, setAudioOn] = useState(false);

  const value = useMemo<Ctx>(() => ({
    profileId,
    profile: PROFILES[profileId],
    setProfile: (id) => {
      setProfileId(id);
      setNeeds(new Set(PROFILES[id].defaultNeeds));
    },
    needs,
    toggleNeed: (id) => {
      setNeeds((s) => {
        const n = new Set(s);
        if (n.has(id)) n.delete(id);
        else n.add(id);
        // If toggling a profile-bound need, switch profile
        const need = NEEDS.find((x) => x.id === id);
        if (need?.profile && n.has(id)) setProfileId(need.profile);
        return n;
      });
    },
    audioOn,
    setAudioOn,
  }), [profileId, needs, audioOn]);

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}

export function useNavigation() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error("useNavigation must be used inside NavigationProvider");
  return ctx;
}
