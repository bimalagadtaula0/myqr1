import { useEffect, useState } from "react";
import { Headphones, Accessibility, Play, Square, Mic, MicOff, Navigation } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { useSpeech } from "@/hooks/useSpeech";
import { NEEDS, PROFILES, useNavigation, type ProfileId } from "@/lib/navigation";

type Lang = "IT" | "EN" | "FR" | "DE" | "ES";
type TextSize = "normal" | "large" | "xlarge";

export function SettingsDock() {
  const [openVoice, setOpenVoice] = useState(false);
  const [openA11y, setOpenA11y] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);

  const { profile, profileId, setProfile, needs, toggleNeed, audioOn, setAudioOn } = useNavigation();
  const { supported, speaking, speak, stop } = useSpeech();

  const [lang, setLang] = useState<Lang>("EN");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [plainLanguage, setPlainLanguage] = useState(false);
  const [listening, setListening] = useState(false);

  // Apply global a11y classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("hc", highContrast);
    root.dataset.textsize = textSize;
  }, [highContrast, textSize]);

  const playGuide = () => {
    if (!supported) return;
    if (speaking) return stop();
    const intro = `Welcome. You are heading to the ${profile.route.label}. ${profile.route.steps
      .map((s, i) => `Step ${i + 1}. ${s.title}. ${s.detail}`)
      .join(" ")}`;
    speak(plainLanguage ? simplify(intro) : intro);
  };

  return (
    <>
      {/* Floating dock */}
      <div className="fixed bottom-3 left-1/2 z-40 flex w-[min(96vw,520px)] -translate-x-1/2 items-center justify-center gap-2 sm:bottom-5 sm:w-auto sm:gap-3">
        <DockButton
          tone="route"
          onClick={() => setOpenRoute(true)}
          icon={<Navigation size={16} />}
          label={profile.label}
          fullLabel={`${profile.label} route`}
          badge={profile.icon}
        />
        <DockButton
          tone="voice"
          onClick={() => setOpenVoice(true)}
          icon={<Headphones size={16} />}
          label="Audio"
          fullLabel="Audio & voice"
        />
        <DockButton
          tone="a11y"
          onClick={() => setOpenA11y(true)}
          icon={<Accessibility size={16} />}
          label="Access"
          fullLabel="Accessibility"
        />
      </div>

      {/* Route / profile drawer */}
      <Drawer open={openRoute} onOpenChange={setOpenRoute}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-primary">
              <Navigation size={20} /> Choose how to navigate
            </DrawerTitle>
            <DrawerClose className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Close">✕</DrawerClose>
          </DrawerHeader>

          <div className="space-y-5 overflow-y-auto p-4 pb-8">
            <Section title="Navigation profile">
              <p className="mb-3 text-xs text-muted-foreground">The map and route adapt to your choice.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
                  const p = PROFILES[id];
                  const active = profileId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setProfile(id)}
                      aria-pressed={active}
                      className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-3 text-left transition ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl" aria-hidden>{p.icon}</span>
                      <span className="text-sm font-bold leading-tight">{p.label}</span>
                      <span className="text-[11px] leading-tight text-muted-foreground">{p.tagline}</span>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Fine-tune needs">
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {NEEDS.map((n) => {
                  const checked = needs.has(n.id);
                  return (
                    <li key={n.id}>
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 transition ${
                          checked ? "border-primary bg-primary/5" : "border-transparent hover:bg-secondary"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleNeed(n.id)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span aria-hidden className="text-base">{n.icon}</span>
                        <span className="text-sm font-medium">{n.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Section>
          </div>
        </DrawerContent>
      </Drawer>


      {/* Audio & voice drawer */}
      <Drawer open={openVoice} onOpenChange={setOpenVoice}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-primary">
              <Headphones size={20} /> Audio & voice
            </DrawerTitle>
            <DrawerClose className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Close">✕</DrawerClose>
          </DrawerHeader>

          <div className="space-y-5 overflow-y-auto p-4 pb-8">
            <Section icon="🔊" title="Audio guide">
              <button
                onClick={playGuide}
                disabled={!supported}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 text-left transition hover:border-primary disabled:opacity-50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-card">
                  {speaking ? <Square size={20} /> : <Play size={20} />}
                </span>
                <span>
                  <p className="font-bold">{speaking ? "Stop audio guide" : "Play audio guide"}</p>
                  <p className="text-sm text-muted-foreground">Browser voice synthesis</p>
                </span>
              </button>
            </Section>

            <Section icon="🎙" title="Voice assistant">
              <button
                onClick={() => setListening((v) => !v)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                  listening ? "border-primary bg-primary/10" : "border-primary/30 bg-primary/5 hover:border-primary"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-card">
                  {listening ? <MicOff size={20} /> : <Mic size={20} />}
                </span>
                <span>
                  <p className="font-bold">{listening ? "Close assistant" : "Ask something"}</p>
                  <p className="text-sm text-muted-foreground">Ask questions about the menu or map</p>
                </span>
              </button>

              {listening && (
                <div className="mt-3 rounded-2xl border-2 border-border p-4 text-sm">
                  <p className="font-semibold">Voice assistant</p>
                  <p className="text-muted-foreground">Limited scope: menu, map and accessibility settings.</p>
                  <span className="mt-2 inline-block rounded-full border px-2 py-0.5 text-xs">State: Idle</span>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a question"
                      className="flex-1 rounded-xl border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <button className="rounded-xl border-2 border-border px-3 py-2 text-sm font-semibold hover:border-primary">
                      Send
                    </button>
                  </div>
                </div>
              )}
            </Section>

            <Toggle
              label="Plain language"
              hint="Simpler, easier responses"
              checked={plainLanguage}
              onChange={setPlainLanguage}
            />

            <Toggle
              label="Auto-read steps"
              hint="Read each step aloud as you navigate"
              checked={audioOn}
              onChange={setAudioOn}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Accessibility drawer */}
      <Drawer open={openA11y} onOpenChange={setOpenA11y}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-primary">
              <Accessibility size={20} /> Accessibility
            </DrawerTitle>
            <DrawerClose className="rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Close">✕</DrawerClose>
          </DrawerHeader>

          <div className="space-y-5 overflow-y-auto p-4 pb-8">
            <Section title="Language">
              <div className="grid grid-cols-5 gap-2">
                {(["IT", "EN", "FR", "DE", "ES"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-xl border-2 p-3 text-center text-sm font-bold transition ${
                      lang === l
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/20 bg-primary/5 hover:border-primary"
                    }`}
                  >
                    <div className="text-base">{flag(l)}</div>
                    <div className="text-xs">{l}</div>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Text size">
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: "normal", label: "A", caption: "Normal" },
                  { id: "large", label: "A+", caption: "Large" },
                  { id: "xlarge", label: "A++", caption: "Extra large" },
                ] as { id: TextSize; label: string; caption: string }[]).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTextSize(s.id)}
                    className={`rounded-xl border-2 p-4 text-center transition ${
                      textSize === s.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary/20 bg-primary/5 hover:border-primary"
                    }`}
                  >
                    <div className="text-2xl font-black">{s.label}</div>
                    <div className="text-xs">{s.caption}</div>
                  </button>
                ))}
              </div>
            </Section>

            <Toggle
              label="High contrast"
              hint="Boost contrast across the app"
              checked={highContrast}
              onChange={setHighContrast}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function DockButton({
  icon,
  label,
  fullLabel,
  onClick,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  fullLabel?: string;
  onClick: () => void;
  tone: "voice" | "a11y";
}) {
  const grad =
    tone === "voice"
      ? "from-sky-500 to-violet-600"
      : "from-violet-600 to-fuchsia-500";
  return (
    <button
      onClick={onClick}
      className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-full bg-gradient-to-r ${grad} px-3 py-2 text-xs font-bold text-white shadow-lg shadow-primary/30 transition hover:scale-[1.03] active:scale-95 sm:flex-initial sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm`}
    >
      {icon}
      <span className="truncate sm:hidden">{label}</span>
      <span className="hidden truncate sm:inline">{fullLabel ?? label}</span>
    </button>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
        {icon && <span aria-hidden>{icon}</span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 text-left transition hover:border-primary"
    >
      <span>
        <p className="font-bold">{label}</p>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function flag(l: Lang) {
  return { IT: "🇮🇹", EN: "🇬🇧", FR: "🇫🇷", DE: "🇩🇪", ES: "🇪🇸" }[l];
}

function simplify(t: string) {
  return t.replace(/\b(approximately|roughly|in about)\b/gi, "about");
}
