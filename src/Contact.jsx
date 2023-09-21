import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';


export const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ndvvtpq', 'template_4p18x7h', form.current, 'Wkyf7Mf6LGGc3xd-b')
      .then((result) => {
        // Display a success toast
        toast.success('Message sent successfully!', {
          position: toast.POSITION.TOP_RIGHT
        });
        // Redirect to /about upon successful message sent
        history.push('/about');
      })
      .catch((error) => {
        // Display an error toast
        toast.error('An error occurred while sending the message!', {
          position: toast.POSITION.TOP_RIGHT
        });
        console.error(error.text);
      });
  };


  return (

    <div className=" w-full my-12 ">
      <h2 className="desc mb-3 font-semibold">Leave me a message. Let me know your feedback.</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-5 link_card">
        <div>
          <label for="example1" className="mb-2 block font-medium text-gray-700 text-xl">Your Name</label>
          <input type="name" id="example1" className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Name" name="user_name" />
        </div>

        <div>
          <label for="example1" className="mb-2 block font-medium text-gray-700 text-xl">Your Email</label>
          <input type="email" id="example1" className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@email.com" name="user_email" />
        </div>

        <div>
          <div>
            <label for="5" className="mb-1 block font-medium text-gray-700 text-xl">Message</label>
            <textarea id="example1" className="w-full px-4 py-2 mt-1 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" rows="3" placeholder="Leave a message" name="message"></textarea>
          </div>
        </div>

        <button type="submit" value="Send" className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center font-semibold text-slate-900 border-blue-300 shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">Send Message</button>
      </form>
    </div>

    // <form ref={form} onSubmit={sendEmail}>
    //   <label>Name</label>
    //   <input type="text" name="user_name" />
    //   <label>Email</label>
    //   <input type="email" name="user_email" />
    //   <label>Message</label>
    //   <textarea name="message" />
    //   <input type="submit" value="Send" />
    // </form>
  );
};