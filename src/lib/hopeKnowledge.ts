export type KnowledgeItem = {
  id: string;
  role: "Switcher" | "Camera" | "ProPresenter" | "Safety";
  title: string;
  keywords: string[];
  answer: string;
  steps?: string[];
  level: "Volunteer safe" | "Escalate quickly" | "Stop and escalate";
  href: string;
};

export const hopeKnowledge: KnowledgeItem[] = [
  {
    id: "switcher-camera-black",
    role: "Switcher",
    title: "A camera is black",
    keywords: ["camera black", "black camera", "no picture", "camera missing", "camera feed black"],
    answer: "Keep a working source live. Do not take the black camera. Use Camera 2 as the safe fallback and tell the technical lead.",
    steps: ["Stay on the current usable source.", "Preview Camera 2.", "Confirm Camera 2 is visible and settled.", "CUT or fade to Camera 2 as appropriate.", "Report which camera is black."],
    level: "Volunteer safe",
    href: "/troubleshooting"
  },
  {
    id: "switcher-wrong-live",
    role: "Switcher",
    title: "The wrong camera is live",
    keywords: ["wrong camera", "wrong shot", "bad shot live", "incorrect source", "fix live shot"],
    answer: "Do not panic-switch. Put the correct source in Preview, verify it, then CUT to it.",
    steps: ["Select the correct source on Preview.", "Confirm the green Preview image is usable.", "Press CUT.", "Prepare the next shot normally."],
    level: "Volunteer safe",
    href: "/switcher/panel"
  },
  {
    id: "switcher-transition",
    role: "Switcher",
    title: "Should I fade or cut?",
    keywords: ["fade or cut", "auto or cut", "transition", "during worship", "during sermon"],
    answer: "At Hope, use AUTO/fade during music. Use CUT for welcome, announcements, sermon, and other speaking.",
    level: "Volunteer safe",
    href: "/switcher"
  },
  {
    id: "switcher-safe-shot",
    role: "Switcher",
    title: "What is the safe shot?",
    keywords: ["safe shot", "fallback camera", "which camera", "unsure what to show", "camera 2"],
    answer: "Camera 2 is Hope's default safe wide shot. Use it when the next camera is not ready or you are unsure what should be live.",
    level: "Volunteer safe",
    href: "/switcher/live"
  },
  {
    id: "switcher-controller-dead",
    role: "Switcher",
    title: "The physical controller is not responding",
    keywords: ["controller not responding", "panel frozen", "atem panel dead", "buttons not working", "switcher frozen"],
    answer: "Do not restart the ATEM during a live service. Keep the current usable source live and contact the technical lead immediately.",
    level: "Escalate quickly",
    href: "/troubleshooting"
  },
  {
    id: "camera-ready",
    role: "Camera",
    title: "The director says Ready",
    keywords: ["ready one", "ready two", "ready three", "director says ready", "what does ready mean"],
    answer: "Build the requested shot, finish your movement, focus, and hold it steady. You are not live yet unless the red tally is on.",
    steps: ["Acknowledge the cue if your intercom procedure requires it.", "Move while off-air.", "Set framing and focus.", "Stop moving and wait."],
    level: "Volunteer safe",
    href: "/camera"
  },
  {
    id: "camera-take",
    role: "Camera",
    title: "The director says Take",
    keywords: ["take one", "take two", "take three", "director says take", "red tally"],
    answer: "Your camera is live. Hold the shot steady and avoid unrequested zooms or reframing until you are cleared.",
    level: "Volunteer safe",
    href: "/camera/live"
  },
  {
    id: "camera-focus",
    role: "Camera",
    title: "The image is out of focus",
    keywords: ["out of focus", "blurry camera", "camera blurry", "lost focus", "focus problem"],
    answer: "Tell the director immediately. If you are live, hold your position and make only the smallest safe correction. The director should move to another camera before a larger adjustment.",
    level: "Volunteer safe",
    href: "/camera"
  },
  {
    id: "camera-intercom",
    role: "Camera",
    title: "The intercom is not working",
    keywords: ["intercom not working", "cannot hear director", "headset dead", "comms failed", "no communication"],
    answer: "Keep a stable usable shot, avoid major moves, and get the director's attention through the approved backup method. Do not unplug unfamiliar booth or camera cabling during the service.",
    level: "Escalate quickly",
    href: "/camera"
  },
  {
    id: "propresenter-behind",
    role: "ProPresenter",
    title: "Lyrics are behind",
    keywords: ["lyrics behind", "late lyrics", "missed lyric", "worship slides behind", "catch up lyrics"],
    answer: "Advance to the lyric currently being sung. Do not click rapidly through every missed slide. Follow the worship leader, not only the planned order.",
    level: "Volunteer safe",
    href: "/propresenter/live"
  },
  {
    id: "propresenter-skipped",
    role: "ProPresenter",
    title: "The pastor skipped slides",
    keywords: ["pastor skipped", "skip slides", "jump ahead", "wrong sermon slide", "find correct slide"],
    answer: "Select the correct slide directly in the presentation. Do not repeatedly press Next to catch up.",
    level: "Volunteer safe",
    href: "/propresenter"
  },
  {
    id: "propresenter-black",
    role: "ProPresenter",
    title: "The ProPresenter output is black",
    keywords: ["propresenter black", "output black", "slides not showing", "atem cannot see propresenter", "presentation feed missing"],
    answer: "Keep the switcher on a camera. Check whether ProPresenter is cleared and whether the correct presentation is open. Do not change screen routing or output configuration during the service; escalate if the feed remains missing.",
    level: "Escalate quickly",
    href: "/propresenter"
  },
  {
    id: "propresenter-video",
    role: "ProPresenter",
    title: "A video will not play",
    keywords: ["video not playing", "video frozen", "video no sound", "media failed", "playback problem"],
    answer: "Tell the director to remain on camera. Try the approved playback action once. If it still fails, stop and move to the next service item rather than repeatedly clicking or changing settings.",
    level: "Escalate quickly",
    href: "/propresenter"
  },
  {
    id: "propresenter-freeze",
    role: "ProPresenter",
    title: "ProPresenter is frozen",
    keywords: ["propresenter frozen", "app frozen", "propresenter crashed", "not responding", "software locked"],
    answer: "Tell the director to stay on camera. Do not force-quit or restart the Mac unless the technical lead directs you, because that may interrupt all outputs.",
    level: "Escalate quickly",
    href: "/propresenter"
  },
  {
    id: "safety-electrical",
    role: "Safety",
    title: "Smoke, sparks, burning smell, or unsafe heat",
    keywords: ["smoke", "sparks", "burning smell", "electrical", "hot equipment", "fire"],
    answer: "Stop using the equipment and alert the technical lead immediately. Keep people away. Do not touch rack power, open equipment, or reconnect cables.",
    level: "Stop and escalate",
    href: "/troubleshooting"
  }
];
