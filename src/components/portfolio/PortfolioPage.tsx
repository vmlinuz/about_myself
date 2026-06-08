import Image from "next/image";
import type { ComponentType } from "react";
import {
  ArrowUpRight,
  Binary,
  Briefcase,
  Code2,
  Cpu,
  Download,
  Mail,
  MapPin,
  Monitor,
  Network,
  ShieldCheck,
  Terminal,
  type LucideProps
} from "lucide-react";

import {
  capabilities,
  career,
  metrics,
  navItems,
  principles,
  profile,
  projects,
  systems
} from "@/lib/profile";

type IconName = (typeof capabilities)[number]["icon"];
type IconComponent = ComponentType<LucideProps>;

const iconMap: Record<IconName, IconComponent> = {
  Cpu,
  MonitorCog: Monitor,
  Network,
  ShieldCheck
};

export function PortfolioPage() {
  return (
    <main className="site-shell">
      <SiteHeader />
      <Hero />
      <Capabilities />
      <About />
      <Journey />
      <Systems />
      <Projects />
      <Contact />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand-mark" href="#top" aria-label="Volodymyr Salo home">
        <span className="brand-symbol">VS</span>
        <span className="brand-text">
          <strong>Volodymyr Salo</strong>
          <span>Senior Software Engineer</span>
        </span>
      </a>
      <nav className="site-nav" aria-label="Section navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-action" href={profile.githubUrl} target="_blank" rel="noreferrer">
        <Code2 size={17} strokeWidth={1.8} aria-hidden="true" />
        GitHub
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <MapPin size={16} strokeWidth={1.8} aria-hidden="true" />
            {profile.location}
          </div>
          <h1 id="hero-title">{profile.name}</h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-summary">{profile.summary}</p>
          <div className="hero-actions" aria-label="Profile links">
            <a className="action-button primary" href={profile.githubUrl} target="_blank" rel="noreferrer">
              <Code2 size={18} strokeWidth={1.9} aria-hidden="true" />
              View GitHub
              <ArrowUpRight size={16} strokeWidth={1.9} aria-hidden="true" />
            </a>
            <a className="action-button" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
              <Network size={18} strokeWidth={1.9} aria-hidden="true" />
              LinkedIn
            </a>
            <a className="action-button ghost" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Download size={18} strokeWidth={1.9} aria-hidden="true" />
              CV
            </a>
          </div>
        </div>

        <div className="hero-portrait" aria-label="Portrait of Volodymyr Salo">
          <Image
            src="/avatar.jpg"
            alt="Volodymyr Salo"
            fill
            priority
            sizes="(max-width: 860px) 78vw, 38vw"
          />
          <div className="portrait-caption">
            <span>Production-minded engineering</span>
            <strong>Linux. Qt. C++. Python. Data.</strong>
          </div>
        </div>
      </div>

      <div className="metric-strip" aria-label="Career metrics">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="section-block capability-band" aria-labelledby="capabilities-title">
      <SectionHeader
        kicker="Operating range"
        title="Enterprise discipline with systems-level edge."
        description="The work spans product UI, device integration, services, data layers, and production support without losing sight of maintainability."
        id="capabilities-title"
      />
      <div className="capability-grid">
        {capabilities.map((area) => {
          const Icon = iconMap[area.icon];
          return (
            <article className="capability-card" key={area.title}>
              <div className="card-icon">
                <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section-block about-section" id="about" aria-labelledby="about-title">
      <div className="about-grid">
        <SectionHeader
          kicker="About"
          title="A pragmatic senior engineer for complex product surfaces."
          description={profile.headline}
          id="about-title"
        />
        <div className="about-copy">
          <p>
            I build software where the system boundary matters: embedded Linux devices, desktop applications,
            production data, service APIs, and customer-facing workflows. My recent work includes Austrian
            medical practice software, smart-glasses device workflows, and streaming audio SDKs.
          </p>
          <p>
            The common thread is ownership. I can work in the implementation details, define a supportable
            technical concept, diagnose field issues, and make the tradeoffs explicit when reliability,
            delivery risk, and platform constraints collide.
          </p>
          <div className="principle-list" aria-label="Engineering principles">
            {principles.map((principle) => (
              <span key={principle}>{principle}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section-block journey-section" id="journey" aria-labelledby="journey-title">
      <SectionHeader
        kicker="Career journey"
        title="From embedded foundations to modern product engineering."
        description="A condensed path through 19+ years of shipped software, production support, and cross-platform systems."
        id="journey-title"
      />
      <div className="timeline">
        {career.map((role) => (
          <article className="timeline-item" key={`${role.period}-${role.company}`}>
            <div className="timeline-period">{role.period}</div>
            <div className="timeline-body">
              <div className="role-heading">
                <div>
                  <h3>{role.company}</h3>
                  <p>{role.place}</p>
                </div>
                <span>{role.title}</span>
              </div>
              <p className="role-focus">{role.focus}</p>
              <ul>
                {role.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="tag-row">
                {role.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Systems() {
  return (
    <section className="section-block systems-section" id="systems" aria-labelledby="systems-title">
      <SectionHeader
        kicker="Systems"
        title="The stack is broad, but the standards stay narrow."
        description="Each technology group is tied to real shipped product work, not a keyword inventory."
        id="systems-title"
      />
      <div className="systems-grid">
        {systems.map((system) => (
          <article className="system-card" key={system.label}>
            <div className="system-heading">
              <Terminal size={21} strokeWidth={1.8} aria-hidden="true" />
              <h3>{system.label}</h3>
            </div>
            <p>{system.note}</p>
            <div className="stack-list">
              {system.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section-block projects-section" aria-labelledby="projects-title">
      <div className="project-heading-row">
        <SectionHeader
          kicker="Open source"
          title="Selected GitHub work."
          description="Public repositories that show clean build flows, compact APIs, Android patterns, and service-boundary experiments."
          id="projects-title"
        />
        <a className="inline-link" href={profile.githubUrl} target="_blank" rel="noreferrer">
          <Code2 size={18} strokeWidth={1.8} aria-hidden="true" />
          github.com/vmlinuz
          <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <div className="project-title-row">
              <Binary size={20} strokeWidth={1.8} aria-hidden="true" />
              <h3>{project.title}</h3>
            </div>
            <p>{project.description}</p>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
              Repository
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact-section" id="contact" aria-labelledby="contact-title">
      <div>
        <p className="section-kicker">Contact</p>
        <h2 id="contact-title">Let the work speak with signal.</h2>
        <p>
          For senior engineering roles, systems-heavy product work, or consulting conversations,
          use the direct channels below.
        </p>
      </div>
      <div className="contact-actions">
        <a className="action-button primary" href={`mailto:${profile.email}`}>
          <Mail size={18} strokeWidth={1.9} aria-hidden="true" />
          {profile.email}
        </a>
        <a className="action-button" href={profile.linkedinUrl} target="_blank" rel="noreferrer">
          <Network size={18} strokeWidth={1.9} aria-hidden="true" />
          LinkedIn profile
        </a>
        <a className="action-button ghost" href={profile.linkedInSnapshotUrl} target="_blank" rel="noreferrer">
          <Briefcase size={18} strokeWidth={1.9} aria-hidden="true" />
          Snapshot
        </a>
      </div>
    </footer>
  );
}

function SectionHeader({
  kicker,
  title,
  description,
  id
}: {
  kicker: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="section-header">
      <p className="section-kicker">{kicker}</p>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
