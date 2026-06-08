export const profile = {
  name: "Volodymyr Salo",
  location: "Vienna, Austria",
  role: "Senior Software Engineer",
  headline:
    "Embedded Linux, cross-platform product engineering, and production-grade desktop systems.",
  summary:
    "Senior software engineer with 19+ years across embedded/RTOS, Linux devices, Qt/QML interfaces, APIs, and Windows desktop products. I work best where hardware constraints, product pressure, and long-lived codebases meet.",
  email: "volodymyr.salo@gmail.com",
  githubUrl: "https://github.com/vmlinuz",
  linkedinUrl: "https://www.linkedin.com/in/volodymyrsalo/",
  resumeUrl: "/Volodymyr_Salo_CV_2026.pdf",
  linkedInSnapshotUrl: "/LinkedinProfile.pdf"
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Systems", href: "#systems" },
  { label: "Contact", href: "#contact" }
];

export const metrics = [
  { value: "19+", label: "years building shipped software" },
  { value: "6", label: "language ecosystems used in production" },
  { value: "3", label: "recent product domains: medical, AR, audio" }
];

export const capabilities = [
  {
    icon: "Cpu",
    title: "Embedded Linux and RTOS",
    text:
      "Yocto/Poky Linux, VxWorks, pSOS, QNX, D-Bus, systemd, NetworkManager, ModemManager, Bluetooth, and constrained device debugging."
  },
  {
    icon: "MonitorCog",
    title: "Cross-platform product UI",
    text:
      "Qt/QML, PySide2, Windows desktop UI stacks, Android custom views, and interface work that has to stay stable across releases."
  },
  {
    icon: "Network",
    title: "APIs, IPC, and data layers",
    text:
      "FastAPI services, Apache Thrift, REST, COM/.NET integration, PostgreSQL, MSSQL, Oracle, MySQL, and microservice boundary prototypes."
  },
  {
    icon: "ShieldCheck",
    title: "Production ownership",
    text:
      "Release support, 3rd-level incident analysis, customer issue reproduction, log analysis, hotfix delivery, and pragmatic stack choices."
  }
] as const;

export const career = [
  {
    period: "2024 - 2025",
    company: "CGM Arztsysteme Osterreich",
    place: "Wiener Neudorf, Austria",
    title: "Senior Software Engineer",
    focus: "Windows desktop medical practice software",
    details: [
      "Built and maintained features across UI, business logic, and PostgreSQL-backed data access layers.",
      "Produced concepts and technical specifications for new product add-ons.",
      "Handled production defect analysis, release support, and 3rd-level customer issue remediation."
    ],
    tags: ["C++", "SQL", "PostgreSQL", ".NET/C#", "Medical software"]
  },
  {
    period: "2020 - 2024",
    company: "Viewpointsystem GmbH",
    place: "Vienna, Austria",
    title: "Senior Software Developer",
    focus: "VPS19 smart glasses and embedded Linux workflows",
    details: [
      "Developed GUI and device workflows with Python, PySide2, and Qt/QML.",
      "Implemented FastAPI services exposing device capabilities and data flows.",
      "Integrated systemd, D-Bus, NetworkManager, ModemManager, Bluetooth, and NTP on constrained hardware."
    ],
    tags: ["Yocto", "Linux", "Python", "Qt/QML", "FastAPI"]
  },
  {
    period: "2018 - 2020",
    company: "StreamUnlimited Engineering",
    place: "Vienna, Austria",
    title: "Software Development Engineer",
    focus: "Streaming audio SDK for consumer electronics",
    details: [
      "Worked across requirements, implementation, integration, deployment, and production support.",
      "Built streaming-audio functionality for embedded Linux devices across SDK modules.",
      "Designed component interfaces with Apache Thrift and supported SoC and partner integrations."
    ],
    tags: ["Yocto", "C++", "Qt", "Thrift", "Consumer audio"]
  },
  {
    period: "2013 - 2018",
    company: "TiVo, Lohika, AB Soft, Luxoft",
    place: "Ukraine and distributed teams",
    title: "Senior and contract engineering roles",
    focus: "Media, automation, communication, and in-vehicle systems",
    details: [
      "Delivered Android/Kotlin smart-glasses work, HP UFT features, RingCentral softphone clients, and Linux in-vehicle entertainment prototypes.",
      "Kept cross-platform codebases moving across C++, C#, COM/.NET, WPF, Silverlight, Qt, QML, Boost, and Google APIs."
    ],
    tags: ["C++", "C#", "Qt/QML", "Android", "Automation"]
  },
  {
    period: "2006 - 2012",
    company: "SoftServe, InTechEnergo, Telrad, Artful Bits",
    place: "Lviv and Kyiv, Ukraine",
    title: "Software Engineer",
    focus: "Enterprise tooling, SCADA, networking, and UI foundations",
    details: [
      "Built configuration and lifecycle tools, SCADA and energy-system UIs, embedded networking software, and .NET UI components.",
      "Developed with C++, Java, Embedded C/C++, Qt, XML, VxWorks, pSOS, Linux/X11, Motif, OpenGL, C#, and Windows Forms."
    ],
    tags: ["C++", "Java", "SCADA", "VxWorks", ".NET"]
  }
];

export const systems = [
  {
    label: "Device software",
    stack: ["Yocto", "Linux", "systemd", "D-Bus", "Bluetooth", "NTP"],
    note:
      "Low-level integration and support work where reliability has to survive constrained hardware and customer deadlines."
  },
  {
    label: "Product surfaces",
    stack: ["Qt/QML", "PySide2", "Windows UI", "Android views", "QML"],
    note:
      "Interfaces for real workflows, including medical desktop systems, smart glasses, and embedded audio platforms."
  },
  {
    label: "Backend and data",
    stack: ["FastAPI", "REST", "Thrift", "PostgreSQL", "MSSQL", "Oracle"],
    note:
      "Service boundaries, IPC, schema-aware changes, and performance-conscious database work."
  }
];

export const projects = [
  {
    title: "dev-intensive-2019",
    description:
      "Android/Kotlin app demonstrating MVVM, ViewModel/LiveData, SharedPreferences, and custom ImageView widgets.",
    href: "https://github.com/vmlinuz/dev-intensive-2019",
    tags: ["Kotlin", "Android", "MVVM"]
  },
  {
    title: "questions_answers",
    description:
      "C++17 CLI Q&A manager with CMake build tooling and GoogleTest coverage; a compact clean-build workflow sample.",
    href: "https://github.com/vmlinuz/questions_answers",
    tags: ["C++17", "CMake", "GoogleTest"]
  },
  {
    title: "libscoreboard",
    description:
      "Java 21 library with Maven and JUnit 5, focused on a small and testable API surface.",
    href: "https://github.com/vmlinuz/libscoreboard",
    tags: ["Java", "Maven", "JUnit"]
  },
  {
    title: "go-micro",
    description:
      "Go microservices prototype exploring service boundaries, APIs, and service-to-service patterns.",
    href: "https://github.com/vmlinuz/go-micro",
    tags: ["Go", "Microservices", "APIs"]
  }
];

export const principles = [
  "Choose technology from constraints, not fashion.",
  "Design for release pressure and support reality.",
  "Keep interfaces explicit across UI, services, and devices.",
  "Debug from evidence: logs, reproduction paths, and system behavior."
];
