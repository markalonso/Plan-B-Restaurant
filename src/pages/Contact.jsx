import { useState } from "react";
import Section from "../components/ui/Section.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import InfoList from "../components/ui/InfoList.jsx";
import Button from "../components/ui/Button.jsx";

const whatsappNumber = "201005260787";

const contactInfo = [
  {
    icon: "📍",
    label: "Address",
    value: "Hurghada, Cornish Street, Gold Star Mall",
    subtext: "Easy to find, right on the coast"
  },
  {
    icon: "🕐",
    label: "Opening Hours",
    value: "Daily 09:00 – 02:00",
    subtext: "Breakfast through late-night vibes"
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+20 100 526 0787"
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = encodeURIComponent(
      `Plan B Contact\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`
    );
    const whatsappWindow = window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
    
    // Only clear form and show success if window opened
    if (whatsappWindow) {
      setSuccessMessage("Message sent via WhatsApp!");
      setFormData({ name: "", phone: "", message: "" });
    } else {
      setSuccessMessage("Please allow popups to send via WhatsApp");
    }
  };

  const isValid = formData.name.trim() && formData.phone.trim();

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-coffee-dark/5 to-transparent pb-8 pt-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Section animate={false}>
            <SectionHeading
              eyebrow="Contact"
              title="Let's Connect"
              subtitle="Questions, reservations, or just want to say hi — we're here."
              align="center"
            />
          </Section>
        </div>
      </div>

      {/* Main Content */}
      <Section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left Column - Info */}
            <div className="space-y-8">
              {/* Visit Us Card */}
              <div className="rounded-2xl border border-coffee/10 bg-white/50 p-6">
                <h2 className="mb-6 text-xl font-semibold text-text-primary">
                  Visit Us
                </h2>
                <InfoList items={contactInfo} />
              </div>

              {/* WhatsApp CTA */}
              <div className="rounded-2xl border border-coffee/10 bg-olive-light/30 p-6">
                <h3 className="mb-3 text-lg font-semibold text-text-primary">
                  Quick Contact
                </h3>
                <p className="mb-4 text-sm text-text-secondary">
                  Prefer WhatsApp? Send us a message directly and we'll respond as soon as possible.
                </p>
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-coffee px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-coffee-dark"
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 4C14.16 4 16.12 4.82 17.59 6.29C19.06 7.76 19.95 9.72 19.95 11.92C19.95 16.28 16.4 19.83 12.04 19.83C10.62 19.83 9.23 19.45 8.02 18.73L7.55 18.45L4.75 19.18L5.5 16.46L5.19 15.96C4.39 14.7 3.95 13.31 3.95 11.91C3.95 7.55 7.58 4 12.05 4ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.64 13.1 14.5 13.06 14.31 13.3C14.15 13.55 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 11 13.11C10.26 12.45 9.77 11.64 9.62 11.39C9.5 11.15 9.61 11 9.73 10.89C9.84 10.78 10 10.6 10.1 10.45C10.23 10.31 10.27 10.2 10.35 10.04C10.43 9.87 10.39 9.73 10.33 9.61C10.27 9.5 9.77 8.26 9.56 7.77C9.36 7.29 9.16 7.35 9 7.34C8.86 7.34 8.7 7.33 8.53 7.33Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Google Map */}
              <div className="overflow-hidden rounded-2xl border border-coffee/10 bg-surface-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3546.743360749807!2d33.823205!3d27.2585772!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14528756b4e5a9a7%3A0x4f65db9fe1cfb206!2sPlan%20B%20Caf%C3%A9%20%26%20Restaurant!5e0!3m2!1sen!2seg!4v1770820859662!5m2!1sen!2seg"
                  className="h-[260px] w-full border-0 md:h-[320px]"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Plan B Restaurant Location"
                ></iframe>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <form
                className="rounded-2xl border border-coffee/10 bg-white/50 p-6"
                onSubmit={handleSubmit}
              >
                <h2 className="mb-6 text-xl font-semibold text-text-primary">
                  Send a Message
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1 block text-sm font-medium text-text-secondary"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-coffee/15 bg-white px-4 py-3 text-text-primary transition focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-text-secondary"
                    >
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+20 xxx xxx xxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-coffee/15 bg-white px-4 py-3 text-text-primary transition focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1 block text-sm font-medium text-text-secondary"
                    >
                      Message (optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="How can we help?"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full rounded-xl border border-coffee/15 bg-white px-4 py-3 text-text-primary transition focus:border-coffee focus:outline-none focus:ring-2 focus:ring-coffee/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send via WhatsApp
                  </Button>

                  {successMessage && (
                    <div className="rounded-lg bg-olive-light/50 p-3 text-center">
                      <p className="text-sm font-semibold text-coffee-dark">
                        ✓ {successMessage}
                      </p>
                    </div>
                  )}

                  <p className="text-center text-xs text-text-muted">
                    Your message will open in WhatsApp for instant communication.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
