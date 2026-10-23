import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import OvalCarousel from "./OvalCarousel";
import FaqAccordion from "./FaqAccordion";
import ContactForm from "./ContactForm";
import SiteHeader from "./components/SiteHeader";
import SearchBar from "./components/SearchBar";

const SERVICES = [
  {
    name: "Deep Tissue Therapy",
    description: "Focused pressure for chronic tension and recovery.",
    image: "/1.webp",
  },
  {
    name: "Swedish Relaxation",
    description: "Full-body relaxation and circulation work.",
    image: "/2.webp",
  },
  {
    name: "Sports & Recovery",
    description: "Pre-event, post-event, and maintenance sessions.",
    image: "/3.webp",
  },
  {
    name: "Myofascial Release",
    description: "Slow, sustained work on connective tissue.",
    image: "/4.webp",
  },
  {
    name: "Prenatal Massage",
    description: "Supported positioning for every trimester.",
    image: "/5.webp",
  },
  {
    name: "Mobile Massage",
    description: "Sessions at your home, hotel, or workplace.",
    image: "/6.webp",
  },
];

const PROVIDER_BENEFITS = [
  "Add and edit your services and pricing whenever they change",
  "Set your own availability days, times, and session lengths",
  "List a studio location, a mobile service area, or both",
  "Publish a travel schedule and appear in those cities while you are there",
  "Manage bookings, inquiries, and contact preferences in one place",
];

const ABOUT_FEATURES = [
  {
    title: "Location-first",
    description: "Search by ZIP, city, or state including where you're travelling.",
  },
  {
    title: "Professional only",
    description: "A legitimate wellness directory for licensed, practising bodyworkers.",
  },
  {
    title: "Built to grow",
    description: "All 50 states from day one, with city and local areas added continuously.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Discover",
    description:
      "Search by ZIP code, city, or state to discover massage and bodywork professionals in the location you need.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Explore provider profiles, services, availability, service areas, and travel schedules to find the right fit.",
  },
  {
    number: "03",
    title: "Restore",
    description:
      "Connect with your chosen professional and make wellness part of your life wherever you are.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-brand-cream font-jost text-[#1c1a16]">
      <div className="bg-brand-green px-4 py-2 text-sm text-brand-cream sm:px-6 sm:py-2.5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <span>Massage &amp; bodywork professionals in all 50 states</span>
          <div className="flex items-center gap-2">
            <a
              href="tel:+10000000000"
              aria-label="Call us"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream text-brand-green"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" />
              </svg>
            </a>
            <a
              href="#contact"
              aria-label="Book"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream text-brand-green"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zM5 10v10h14V10H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:gap-14 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="font-marcellus inline-block rounded-full bg-brand-gold px-4 py-1.5 text-sm tracking-wide text-brand-gold-text">
              Nationwide wellness directory
            </span>
            <h1 className="font-jost mt-6 text-[40px] font-semibold leading-[1.15] tracking-tight text-brand-green sm:text-[56px] lg:text-[74px]">
              Find Massage &amp; Bodywork Near You
            </h1>
            <p className="font-jost mt-5 text-[20px] font-medium text-brand-rust sm:text-[28px]">
              Find. Connect. Heal.
            </p>
            <p className="font-jost mt-5 max-w-lg text-[18px] leading-7 text-[#3a352c]">
              Discover massage and bodywork professionals near you or wherever
              you&apos;re headed. BodyWorkWorldMassage makes it simple to
              search by location, explore providers and services, view
              availability and travel schedules, and connect with the right
              professional for your needs.
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="font-marcellus inline-block rounded-full bg-brand-green px-8 py-3 text-base tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
              >
                Book Appointment
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <HeroCarousel />
            <div className="absolute -bottom-6 left-0 rounded-2xl bg-white px-5 py-4 shadow-lg">
              <p className="font-marcellus text-lg tracking-wide text-brand-green">
                50 States
              </p>
              <p className="font-jost text-sm text-[#6b6558]">
                Listed from day one
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="bg-brand-cream py-8 sm:py-[50px]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="relative">
              <div className="relative z-10 rounded-2xl bg-brand-green px-6 py-8 shadow-xl sm:mx-6 sm:px-10 sm:py-10">
              <h2 className="font-jost text-2xl font-semibold text-brand-cream sm:text-3xl">
                Find Massage &amp; Bodywork Near You
              </h2>
              <SearchBar />
              </div>

              <div className="-mt-12 rounded-2xl border border-black/10 bg-white pb-[50px] pt-[138px] shadow-sm">
                <div className="grid grid-cols-1 gap-14 px-6 sm:px-10 lg:grid-cols-2">
                  <div className="overflow-hidden rounded-3xl">
                    <Image
                      src="/about section image .png"
                      alt="Massage therapy session"
                      width={600}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-jost text-sm font-semibold uppercase tracking-wide text-brand-rust">
                      About us
                    </p>
                    <h2 className="font-jost mt-3 text-3xl font-semibold leading-tight tracking-tight text-brand-green sm:text-4xl lg:text-5xl">
                      A simpler way to find the right hands
                    </h2>
                    <p className="font-jost mt-5 text-[16px] leading-7 text-[#3a352c]">
                      BodyWorkWorldMassage is a location-based platform built
                      to connect people with massage and bodywork
                      professionals across the United States. Instead of
                      scattered listings and dead phone numbers, you get one
                      place to search by location, read what a professional
                      actually offers, and book with them directly.
                    </p>
                    <p className="font-jost mt-4 text-[16px] leading-7 text-[#3a352c]">
                      Every profile is owned and kept current by the
                      professional behind it — their services, their pricing,
                      their availability, and the cities they travel to. We
                      keep the directory clean and easy to search so the work
                      speaks for itself.
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                      {ABOUT_FEATURES.map((feature) => (
                        <div
                          key={feature.title}
                          className="border-t border-black/15 pt-3"
                        >
                          <h3 className="font-marcellus text-sm font-bold tracking-wide text-brand-green">
                            {feature.title}
                          </h3>
                          <p className="font-jost mt-2 text-xs leading-5 text-[#6b6558]">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="font-jost text-sm font-semibold text-brand-rust">
                How it works
              </p>
              <h2 className="font-jost mx-auto mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-brand-green sm:text-5xl lg:text-6xl">
                Three steps to the right professional
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
                >
                  <span className="font-jost text-2xl font-semibold text-brand-rust">
                    {step.number}
                  </span>
                  <h3 className="font-marcellus mt-4 text-xl tracking-wide text-brand-green">
                    {step.title}
                  </h3>
                  <p className="font-jost mt-3 text-sm leading-6 text-[#3a352c]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-cream py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 items-center gap-10 rounded-b-[2.5rem] bg-[#0E3A29] px-5 py-10 text-brand-cream sm:px-10 sm:py-16 lg:gap-14 lg:grid-cols-2 lg:px-16 lg:py-20">
              <div>
                <p className="font-jost text-base font-semibold text-brand-cream/90">
                  Travel schedules
                </p>
                <h2 className="font-jost mt-4 text-3xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                  Available where you&apos;re headed
                </h2>
                <p className="font-jost mt-6 max-w-lg text-[17px] leading-7 text-white">
                  Providers can list the cities they&apos;re visiting and when
                  they&apos;ll be there, so a therapist based elsewhere still
                  shows up in your search while they&apos;re in town — and
                  drops off automatically once those dates pass. No separate
                  page to dig through: travelling professionals appear right
                  alongside local ones for the location you searched.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <span className="font-marcellus rounded-full border border-white/40 px-5 py-2 text-sm tracking-wide text-white">
                    Tampa, FL · Sept 15–20
                  </span>
                  <span className="font-marcellus rounded-full border border-white/40 px-5 py-2 text-sm tracking-wide text-white">
                    Miami, FL · Oct 3–7
                  </span>
                </div>
              </div>

              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-cream/15">
                <Image
                  src="/travel image .png"
                  alt="Massage professional travelling to a client"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-brand-cream py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
              <div>
                <p className="font-jost text-sm font-semibold text-brand-rust">
                  Services
                </p>
                <h2 className="font-jost mt-3 max-w-md text-3xl font-bold leading-tight text-brand-green sm:text-4xl lg:text-5xl">
                  A simpler way to find the right hands
                </h2>
              </div>
              <div className="flex flex-col items-start gap-4 sm:items-end sm:text-right">
                <p className="font-jost max-w-xs text-sm leading-6 text-[#3a352c]">
                  Every service has its own page, so you can go straight from
                  a treatment to the professionals offering it in a studio or
                  wherever you are.
                </p>
                <a
                  href="#contact"
                  className="font-marcellus rounded-full bg-brand-green px-6 py-2.5 text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
                >
                  Explore Services
                </a>
              </div>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service) => (
                <div
                  key={service.name}
                  className="group rounded-2xl border border-black/10 bg-white p-3 shadow-sm"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={400}
                      height={300}
                      className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-100"
                    />
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <h3 className="font-marcellus text-2xl font-bold tracking-wide text-brand-green">
                      {service.name}
                    </h3>
                    <p className="font-jost mt-2 text-base leading-6 text-[#3a352c]">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-cream py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-t-[2.5rem] bg-brand-panel px-5 py-10 sm:px-10 sm:py-16 lg:px-16">
            <div className="flex justify-center">
              <OvalCarousel />
            </div>

            <div className="mt-12 grid grid-cols-1 items-start gap-10 sm:mt-32 lg:mt-48 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-jost text-sm font-semibold text-brand-rust">
                  For providers
                </p>
                <h2 className="font-jost mt-3 text-3xl font-bold leading-[1.15] text-brand-green sm:text-4xl lg:text-5xl">
                  Your Skills. More Locations. More Opportunities.
                </h2>
                <p className="font-jost mt-6 max-w-lg text-[17px] leading-7 text-[#3a352c]">
                  BodyWorkWorldMassage gives independent professionals a
                  platform to showcase their services, availability,
                  locations, and travel schedules to people actively
                  searching for massage and bodywork.
                </p>
                <p className="font-jost mt-6 max-w-lg text-[17px] font-semibold leading-7 text-brand-green">
                  Build your presence. Expand your reach. Connect with new
                  clients.
                </p>
                <a
                  href="#contact"
                  className="font-marcellus mt-8 inline-block rounded-full bg-brand-green px-7 py-3 text-sm tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
                >
                  Join BodyWorkWorldMassage and get discovered
                </a>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
                <h3 className="font-jost text-xl font-bold text-brand-green">
                  Your profile, self-managed
                </h3>
                <ul className="mt-5 space-y-3">
                  {PROVIDER_BENEFITS.map((benefit) => (
                    <li
                      key={benefit}
                      className="font-jost flex items-start gap-2 text-sm leading-6 text-[#3a352c]"
                    >
                      <span className="text-brand-rust">✳</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>

            <div id="faq" className="overflow-hidden">
              <div className="flex flex-col gap-6 bg-brand-green px-5 py-8 text-brand-cream sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
                <div>
                  <h2 className="font-jost text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    Ready to find the right professional?
                  </h2>
                  <p className="font-jost mt-3 text-white/80">
                    Search your area, or browse every state we cover.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    className="font-marcellus rounded-full border border-white/50 px-6 py-2.5 text-sm tracking-wide text-white transition-colors hover:bg-white hover:text-brand-green"
                  >
                    Get in touch
                  </a>
                  <a
                    href="#about"
                    className="font-marcellus rounded-full border border-white/50 px-6 py-2.5 text-sm tracking-wide text-white transition-colors hover:bg-white hover:text-brand-green"
                  >
                    Search Near Me
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10 bg-brand-panel px-5 py-10 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-16">
                <div>
                  <p className="font-jost text-sm font-semibold text-brand-rust">
                    Our mission
                  </p>
                  <p className="font-jost mt-3 text-2xl font-semibold leading-snug text-brand-green">
                    To make massage, bodywork, and wellness services easier to
                    discover by creating a trusted connection between clients
                    and independent professionals.
                  </p>
                  <p className="font-jost mt-8 text-sm font-semibold text-brand-rust">
                    Our vision
                  </p>
                  <p className="font-jost mt-3 text-[17px] leading-7 text-[#3a352c]">
                    To build a leading nationwide destination for discovering
                    massage and bodywork professionals connecting people with
                    wellness services across cities, states, and communities.
                  </p>
                </div>
                <div>
                  <p className="font-jost text-sm font-semibold text-brand-rust">
                    Common questions
                  </p>
                  <FaqAccordion />
                </div>
              </div>
            </div>

            <div id="contact" className="grid grid-cols-1 gap-10 rounded-b-[2.5rem] bg-white px-5 py-10 sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-16">
              <div>
                <p className="font-jost text-sm font-semibold text-brand-rust">
                  Contact
                </p>
                <h2 className="font-jost mt-3 text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
                  Tell us what you&apos;re looking for
                </h2>
                <p className="font-jost mt-5 max-w-md text-[17px] leading-7 text-[#3a352c]">
                  Send an inquiry and we&apos;ll point you to the right
                  professional or help you get listed if you practise massage
                  and bodywork yourself.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="border-t border-black/10 pt-4">
                    <h3 className="font-jost font-bold text-brand-green">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@bodyworkworldmassage.com"
                      className="font-jost mt-1 inline-block text-sm text-brand-green underline underline-offset-4"
                    >
                      hello@bodyworkworldmassage.com
                    </a>
                  </div>
                  <div className="border-t border-black/10 pt-4">
                    <h3 className="font-jost font-bold text-brand-green">
                      Response time
                    </h3>
                    <p className="font-jost mt-1 text-sm leading-6 text-[#3a352c]">
                      Inquiries are answered within one business day.
                    </p>
                  </div>
                  <div className="border-t border-black/10 pt-4">
                    <h3 className="font-jost font-bold text-brand-green">
                      Booking a session
                    </h3>
                    <p className="font-jost mt-1 text-sm leading-6 text-[#3a352c]">
                      To book directly, search your location and use the
                      booking option on a provider&apos;s profile.
                    </p>
                  </div>
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-brand-cream pt-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-center">
            <Image
              src="/logoo footer.png"
              alt="BodyWorkWorldMassage"
              width={800}
              height={200}
              className="h-32 w-auto max-w-sm object-contain"
            />
            <div className="flex flex-wrap items-center gap-4">
              <p className="font-jost text-xl text-[#3a352c]">
                Massage &amp; bodywork professionals in all 50 states
              </p>
              <a
                href="#contact"
                className="font-marcellus rounded-full bg-brand-green px-7 py-3 text-base tracking-wide text-brand-cream transition-colors hover:bg-brand-green-dark"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-jost text-lg leading-8 text-[#3a352c]">
                Discover massage and bodywork professionals near you or
                wherever you&apos;re headed.
              </p>
              <div className="mt-6">
                <h4 className="font-jost text-lg font-bold text-brand-green">
                  Email
                </h4>
                <a
                  href="mailto:hello@bodyworkworldmassage.com"
                  className="font-jost text-lg text-[#3a352c]"
                >
                  hello@bodyworkworldmassage.com
                </a>
              </div>
              <div className="mt-4">
                <h4 className="font-jost text-lg font-bold text-brand-green">
                  Hours
                </h4>
                <p className="font-jost text-lg text-[#3a352c]">
                  Inquiries answered within one business day.
                </p>
              </div>
              <div className="mt-4">
                <h4 className="font-jost text-lg font-bold text-brand-green">
                  Location
                </h4>
                <p className="font-jost text-lg text-[#3a352c]">
                  Florida USA
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-jost text-xl font-bold text-brand-gold-text">
                Clients
              </h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Find a Provider", href: "#about" },
                  { label: "Therapist Locator", href: "#about" },
                  { label: "Browse by State", href: "#about" },
                  { label: "Services", href: "#services" },
                  { label: "How Booking Works", href: "#faq" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-jost text-lg text-[#3a352c] hover:text-brand-green"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-jost text-xl font-bold text-brand-gold-text">
                Providers
              </h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Join as a Provider", href: "#contact" },
                  { label: "Manage Your Profile", href: "#contact" },
                  { label: "Travel Schedules", href: "#" },
                  { label: "Provider Support", href: "#contact" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-jost text-lg text-[#3a352c] hover:text-brand-green"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-jost text-xl font-bold text-brand-gold-text">
                Company
              </h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Join as a Provider", href: "#contact" },
                  { label: "Manage Your Profile", href: "#contact" },
                  { label: "Travel Schedules", href: "#" },
                  { label: "Provider Support", href: "#contact" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-jost text-lg text-[#3a352c] hover:text-brand-green"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 py-8 sm:flex-row">
            <p className="font-jost text-lg text-[#6b6558]">
              &copy; {new Date().getFullYear()} BodyWorkWorldMassage. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#" className="font-jost text-lg text-[#6b6558] hover:text-brand-green">
                Privacy Policy
              </a>
              <a href="#" className="font-jost text-lg text-[#6b6558] hover:text-brand-green">
                Terms of Service
              </a>
              <a href="#" className="font-jost text-lg text-[#6b6558] hover:text-brand-green">
                Accessibility
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-brand-cream"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.3H7v3.2h2.8V21h3.7z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-brand-cream"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-brand-cream"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M10.5 9.5l5 2.5-5 2.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
