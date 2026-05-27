import React, { useState } from "react";
import { useSendContactMessageMutation } from "../services/api";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [sendMessage, { isLoading }] = useSendContactMessageMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage(formData).unwrap();
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info Section */}
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Get in Touch 🐝
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Have a question about our honey? Want to visit the apiary? Drop us a
            line and we'll get back to you faster than a bee to a flower.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <span className="text-3xl mr-4">📍</span>
              <div>
                <h3 className="font-bold text-gray-900">Address</h3>
                <p className="text-gray-500">
                  123 Beehive Lane, Galway, Ireland
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">💌</span>
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-500">honeypot.shop96@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">📞</span>
              <div>
                <h3 className="font-bold text-gray-900">Phone</h3>
                <p className="text-gray-500">+353 1 234 5678</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-yellow-50 p-8 rounded-2xl shadow-sm">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍯</div>
              <h3 className="text-2xl font-bold text-green-700">
                Message Sent!
              </h3>
              <p className="text-gray-600 mt-2">
                Thanks for reaching out. We'll be in touch soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-honey-gold underline font-bold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-3"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-honey-gold text-white font-bold text-lg py-3 rounded-md hover:bg-yellow-500 transition shadow-md"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && (
                <p className="text-red-500 text-center font-bold">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
