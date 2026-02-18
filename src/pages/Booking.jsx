import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Stagger, { StaggerItem } from "../components/Stagger.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import GlassPanel from "../components/ui/GlassPanel.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { supabase } from "../lib/supabaseClient.js";

const whatsappNumber = "201005260787";

const formatWhatsAppMessage = ({
  id,
  type,
  name,
  phone,
  email,
  guests,
  date,
  time,
  timeWindow,
  eventType,
  budgetRange,
  notes
}) => {
  const lines = [
    `Plan B ${type} Request`,
    `Request ID: ${id}`,
    `Name: ${name}`,
    `Phone/WhatsApp: ${phone}`,
    email ? `Email: ${email}` : null,
    `Guests: ${guests}`,
    date ? `Date: ${date}` : null,
    time ? `Time: ${time}` : null,
    timeWindow ? `Time Window: ${timeWindow}` : null,
    eventType ? `Event Type: ${eventType}` : null,
    budgetRange ? `Budget: ${budgetRange}` : null,
    notes ? `Notes: ${notes}` : null
  ].filter(Boolean);

  return encodeURIComponent(lines.join("\n"));
};

const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9;
  const endHour = 26;
  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute > 0) {
        continue;
      }
      const displayHour = hour % 24;
      const label = `${String(displayHour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
      slots.push(label);
    }
  }
  return slots;
};

const Booking = () => {
  const [searchParams] = useSearchParams();
  const eventMode = searchParams.get("mode") === "event";
  const groupRequested = searchParams.get("type") === "group" || eventMode;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    guests: groupRequested ? 9 : 2,
    date: "",
    time: "",
    timeWindow: "",
    eventType: "",
    budgetRange: "",
    notes: ""
  });
  const [status, setStatus] = useState({ loading: false, error: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const isGroupRequest = Number(formData.guests) >= 9 || groupRequested;
  const isReservation = !isGroupRequest;

  const isValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.guests &&
    formData.date &&
    (isReservation ? formData.time : true);

  const helperText = {
    name: !formData.name.trim() ? "Full name is required." : "",
    phone: !formData.phone.trim()
      ? "Phone or WhatsApp is required."
      : "",
    guests: !formData.guests ? "Please enter number of guests." : "",
    date: !formData.date ? "Please select a date." : "",
    time: isReservation && !formData.time ? "Please select a time." : ""
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const upsertCustomer = async () => {
    const { data: customerId, error } = await supabase.rpc(
      "get_or_create_customer",
      {
        p_full_name: formData.name,
        p_phone: formData.phone,
        p_email: formData.email,
        p_notes: formData.notes
      }
    );

    if (error) {
      throw error;
    }

    return customerId;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "" });
    setSuccessMessage("");

    try {
      const customerId = await upsertCustomer();

      if (isGroupRequest) {
        const { data: eventRequest, error } = await supabase
          .from("event_requests")
          .insert([
            {
              full_name: formData.name,
              phone: formData.phone,
              email: formData.email,
              guests: Number(formData.guests),
              date: formData.date,
              time_window: formData.timeWindow,
              event_type: formData.eventType,
              budget_range: formData.budgetRange,
              notes: formData.notes,
              status: "new",
              customer_id: customerId
            }
          ])
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        const message = formatWhatsAppMessage({
          id: eventRequest.id,
          type: "Group/Party",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          guests: formData.guests,
          date: formData.date,
          timeWindow: formData.timeWindow,
          eventType: formData.eventType,
          budgetRange: formData.budgetRange,
          notes: formData.notes
        });

        window.open(
          `https://wa.me/${whatsappNumber}?text=${message}`,
          "_blank",
          "noopener,noreferrer"
        );
        setSuccessMessage("Request sent on WhatsApp");
      } else {
        const { data: reservation, error } = await supabase
          .from("reservations")
          .insert([
            {
              full_name: formData.name,
              phone: formData.phone,
              email: formData.email,
              guests: Number(formData.guests),
              date: formData.date,
              time: formData.time,
              notes: formData.notes,
              status: "new",
              customer_id: customerId
            }
          ])
          .select("id")
          .single();

        if (error) {
          throw error;
        }

        const message = formatWhatsAppMessage({
          id: reservation.id,
          type: "Table Reservation",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          guests: formData.guests,
          date: formData.date,
          time: formData.time,
          notes: formData.notes
        });

        window.open(
          `https://wa.me/${whatsappNumber}?text=${message}`,
          "_blank",
          "noopener,noreferrer"
        );
        setSuccessMessage("Request sent on WhatsApp");
      }
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Unable to send request."
      });
      return;
    }

    setStatus({ loading: false, error: "" });
  };

  return (
    <div className="section-padding">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.18fr_0.82fr]">
        <Reveal>
          <div className="space-y-6">
            <SectionHeading
              eyebrow="BOOKING"
              title="Request a table"
              subtitle="Send your request — we confirm personally on WhatsApp."
            />
            <Card>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                      required
                    />
                    {helperText.name && (
                      <p className="text-xs text-text-muted">
                        {helperText.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone / WhatsApp"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                      required
                    />
                    {helperText.phone && (
                      <p className="text-xs text-text-muted">
                        {helperText.phone}
                      </p>
                    )}
                  </div>
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                />
                <div className={`grid gap-4 ${isReservation ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                  <div className="space-y-2">
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      value={formData.guests}
                      onChange={handleChange}
                      aria-label="Number of guests"
                      placeholder="Guests"
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                      required
                    />
                    {helperText.guests && (
                      <p className="text-xs text-text-muted">
                        {helperText.guests}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                      required
                    />
                    {helperText.date && (
                      <p className="text-xs text-text-muted">
                        {helperText.date}
                      </p>
                    )}
                  </div>
                  {isReservation ? (
                    <div className="space-y-2">
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      {helperText.time && (
                        <p className="text-xs text-text-muted">
                          {helperText.time}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
                {isGroupRequest && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                    >
                      <option value="">Event type (optional)</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      name="budgetRange"
                      placeholder="Budget range (optional)"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                    />
                  </div>
                )}
                <textarea
                  name="notes"
                  placeholder={
                    isGroupRequest
                      ? "Tell us about the event, seating, and preferences."
                      : "Notes (optional)"
                  }
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-ui-default border border-coffee/15 px-4 py-3 text-sm focus:border-coffee focus:outline-none"
                />
                {status.error && (
                  <p className="text-xs font-medium text-rose-400">
                    {status.error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={!isValid || status.loading}
                  className="w-full justify-center"
                >
                  {status.loading
                    ? "Sending..."
                    : "Send request on WhatsApp"}
                </Button>
                <p className="text-xs text-text-muted">
                  Typical reply time: 10–30 minutes.
                </p>
              </form>
            </Card>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <GlassPanel className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">
                What happens next
              </h3>
              <Stagger className="space-y-3">
                {[
                  { icon: "📝", label: "You send a request" },
                  { icon: "💬", label: "We confirm on WhatsApp" },
                  { icon: "✨", label: "You arrive and enjoy" }
                ].map((step) => (
                  <StaggerItem key={step.label}>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-light text-coffee-dark">
                        {step.icon}
                      </span>
                      {step.label}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </GlassPanel>

            <GlassPanel className="space-y-3">
              <h3 className="text-lg font-semibold text-text-primary">Good to know</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>Daily 09:00–02:00</li>
                <li>Time slots every 30 minutes</li>
                <li>Groups (9+): tailored reply</li>
              </ul>
            </GlassPanel>

          </div>
        </Reveal>
      </div>

      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-emerald-600 shadow-layered">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Booking;
