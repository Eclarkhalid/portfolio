import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ndvvtpq', 'template_4p18x7h', form.current, 'Wkyf7Mf6LGGc3xd-b')
      .then((result) => {
        // Display a success toast
        toast.success('Successfully Sent!')

        // Clear input fields
        form.current.reset();

        // Redirect to /about upon successful message sent
        window.location.href = '/';
      })
      .catch((error) => {
        // Display an error toast
        toast.error('An error occurred while sending the message!');
        console.error(error.text);
      });
  };

  return (
    <div className="w-full my-12">
      <h2 className="desc mb-3 font-semibold">Leave me a message. Let me know your feedback.</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-5 link_card">
        <div>
          <label htmlFor="name" className="mb-2 block font-medium text-gray-700 text-xl">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
            name="user_name"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-medium text-gray-700 text-xl">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="you@email.com"
            name="user_email"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block font-medium text-gray-700 text-xl">
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="5"
            placeholder="Type Message here ..."
            name="message"
          ></textarea>
        </div>

        <button
          type="submit"
          value="Send"
          className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center font-semibold text-slate-900 border-blue-300 shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
        >
          Send Message
        </button>
      </form>
      <hr className="my-8 h-px border-0 bg-gray-300" />

      <div className="flex items-center justify-between">
        <h2 className="desc mb-3 font-semibold"> Call Me Instead</h2>
        <a href="tel:+254708118414">
          <button type="button" class="rounded-lg border border-primary-100 bg-teal-50 px-5 py-2.5 text-center text-sm font-medium text-primary-600 transition-all hover:border-primary-200 hover:bg-primary-200 focus:ring focus:ring-primary-50 disabled:border-primary-50 disabled:bg-primary-50 disabled:text-primary-400">Call Me</button>
        </a>
      </div>

      <hr className="my-1 h-px border-0 bg-gray-300" />
    </div>
  );
};
