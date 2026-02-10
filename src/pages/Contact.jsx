import { useState } from "react";

const whatsappNumber = "201005260787";

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
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
    setSuccessMessage("Message sent on WhatsApp");
  };

  const isValid = formData.name.trim() && formData.phone.trim();

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-6xl space-y-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-coffee">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-text-primary md:text-5xl">
            Let’s connect
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">Visit Us</h2>
            <p className="text-sm text-text-secondary">
              Hurghada, Cornish Street, Gold Star Mall
            </p>
            <p className="text-sm text-text-secondary">Daily 09:00 – 02:00</p>
            <div>
              <a
                className="inline-flex items-center gap-2 rounded-full bg-coffee px-5 py-2 text-sm font-semibold text-white transition hover:bg-coffee-dark"
                href="https://wa.me/201005260787"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp +20 100 526 0787
              </a>
            </div>
            <p className="text-sm text-text-muted">Map coming soon</p>
          </div>

          <form className="glass-card space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-text-primary">Message Us</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-coffee/15 px-4 py-3"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone / WhatsApp"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-coffee/15 px-4 py-3"
              required
            />
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-2xl border border-coffee/15 px-4 py-3"
            />
            <button
              type="submit"
              disabled={!isValid}
              className="w-full rounded-ui-default bg-coffee px-6 py-3 text-sm font-semibold text-white shadow-layered transition hover:bg-coffee-dark disabled:cursor-not-allowed disabled:bg-coffee-light"
            >
              Send via WhatsApp
            </button>
            {successMessage && (
              <p className="text-sm font-semibold text-emerald-600">
                {successMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
