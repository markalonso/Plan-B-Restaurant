import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const groupRequested = searchParams.get("type") === "group";
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
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-skywash-600">
              Booking
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900 md:text-5xl">
              Reserve your table
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Daily 09:00 – 02:00. Group requests (9+ guests) receive a tailored
              response from our team.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone / WhatsApp"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="number"
                name="guests"
                min="1"
                value={formData.guests}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
              {isReservation ? (
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="timeWindow"
                  placeholder="Preferred time window (optional)"
                  value={formData.timeWindow}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />
              )}
            </div>
            {isGroupRequest && (
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
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
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
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
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
            {status.error && (
              <p className="text-sm font-semibold text-rose-500">
                {status.error}
              </p>
            )}
            <button
              type="submit"
              disabled={!isValid || status.loading}
              className="w-full rounded-full bg-skywash-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-skywash-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status.loading
                ? "Sending..."
                : isGroupRequest
                ? "Request a group booking"
                : "Send reservation"}
            </button>
            {successMessage && (
              <p className="text-sm font-semibold text-emerald-600">
                {successMessage}
              </p>
            )}
          </form>
        </div>

        <aside className="space-y-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-slate-900">
              Booking details
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Daily service: 09:00 – 02:00</li>
              <li>Group/party: 9+ guests</li>
              <li>Requests saved in our CRM</li>
            </ul>
          </div>
          <div className="glass-card">
            <h3 className="text-lg font-semibold text-slate-900">
              Looking for an event?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Let us craft a custom menu, seating layout, and ambience for your
              celebration.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Booking;
