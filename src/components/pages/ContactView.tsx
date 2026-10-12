import type { FC } from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, Info, Loader2 } from 'lucide-react';
import { BackButton } from '../common/BackButton';

export const ContactView: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSubmittedNotice(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    // Simulate validation and explicitly report missing backend endpoint capability
    setTimeout(() => {
      setSubmitting(false);
      // Strictly report that backend does not have a contact submission endpoint
      setSubmittedNotice(
        'Backend Service Notice: The current API (https://electro-hub-1.vercel.app) does not include a contact submission endpoint. Your message has been validated on the client. For inquiries, please reach out via the provided placeholder support email.'
      );
    }, 600);
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-8 lg:py-14 text-[#111111]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-14 space-y-10">
        {/* Back Button */}
        <div>
          <BackButton label="Back to Products" />
        </div>

        {/* Heading */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-[13px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block">
            GET IN TOUCH
          </span>
          <h1 className="text-[36px] sm:text-[44px] font-bold text-[#111111] leading-[1.1] tracking-tight">
            Contact Our Electronics Specialists
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#555555] leading-relaxed">
            Have questions about product availability, acoustic specifications, or your order?
            We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-4">
              <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider">
                Support Channels
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Email Placeholder */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">Email Address</div>
                    <div className="text-[#555555] select-all">support@electrohub-placeholder.com</div>
                    <span className="text-[10px] text-[#888888]">(Placeholder — to be configured)</span>
                  </div>
                </div>

                {/* Phone Placeholder */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">Telephone</div>
                    <div className="text-[#555555]">+20 (2) 555-0199 / +20 100 000 0000</div>
                    <span className="text-[10px] text-[#888888]">(Placeholder contact line)</span>
                  </div>
                </div>

                {/* Location Placeholder */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">Distribution Center</div>
                    <div className="text-[#555555]">Smart Village, Building B4, Cairo-Alex Desert Road, Egypt</div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#111111]">Operating Hours</div>
                    <div className="text-[#555555]">Sunday – Thursday: 9:00 AM – 8:00 PM (EET)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="p-5 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] text-xs text-[#555555] space-y-1.5">
              <div className="font-bold text-[#111111] flex items-center gap-1.5 text-xs uppercase">
                <Info className="w-4 h-4 text-[#C49B82]" />
                Order Inquiries
              </div>
              <p className="leading-relaxed">
                If you are inquiring about an existing order, please include your Order ID and contact phone number.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#EEE9E5] border border-[#E5D7CA] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#555555] mt-1">
                Fill in the details below and our team will get back to you shortly.
              </p>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {submittedNotice ? (
              <div className="p-6 rounded-2xl bg-[#FAF6F2] border border-[#C49B82]/50 text-[#111111] space-y-3">
                <div className="font-bold text-xs uppercase text-[#C49B82] flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Form Validation Completed
                </div>
                <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                  {submittedNotice}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedNotice(null);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#CCA893] text-[#111111] font-bold text-xs uppercase tracking-wider hover:bg-[#C29D87]"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fares Mostafa"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. fares@example.com"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question about Sony WH-1000XM5 warranty"
                    className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#111111] uppercase tracking-[0.06em]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message or inquiry here..."
                    className="w-full rounded-2xl bg-[#FAF6F2] border border-[#DFD4C8] p-4 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-8 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition active:scale-98 shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
