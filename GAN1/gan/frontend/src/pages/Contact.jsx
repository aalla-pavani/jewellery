// import React, { useState } from 'react';
// import Title from '../components/Title';
// import contact from '../assets/contact.webp';

// const Contact = () => {
//   // State to store the phone number input
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const token = localStorage.getItem('token');
//   // Function to handle form submission
//   const submitContact = async () => {
//     const token = localStorage.getItem('token');

//     if (!phoneNumber) {
//       console.log('Please enter your phone number');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5001/api/contact/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': token,
//         },
//         body: JSON.stringify({ phoneNumber }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         window.alert('Contact information submitted');
//       } else {
//         console.log(data.message);
//       }
//     } catch (error) {
//       console.log('An error occurred:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="text-center text-2xl pt-10 border-t">
//         <Title text1={'CONTACT'} text2={'US'} />
//       </div>

//       <div className="my-10 flex justify-center md:flex-row gap-10 mb-28">
//         <img src={contact} alt="Contact us" className="w-full md:max-w-480px" />
//         <div className="flex flex-col justify-center items-start gap-6">
//           <p className="text-2xl font-medium text-gray-800">
//             Give us your number, our team will contact you soon
//           </p>
//           {/* Input for phone number */}
//           <input
//             type="tel"
//             className="w-full px-3 py-2 border border-gray-800"
//             placeholder="Mobile number"
//             required
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)} // Update state on input change
//           />
//           {/* Submit button */}
//           {/* <button
//             className="bg-black text-white font-light px-8 py-2 mt-4"
//             onClick={submitContact} // Call submitContact on button click
//           >
          
//             Submit
//           </button> */}
//           <button
//           className="bg-black text-white font-light px-8 py-2 mt-4"
//           onClick={submitContact}
//           disabled={!token}
//           style={{
//             cursor: token ? 'pointer' : 'not-allowed'
//           }}
//         >
//           Submit
//         </button>
          
//         </div>
//       </div>
//     </div>
//   );
// };

// // Error boundary component for error handling
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }

// export default Contact;



import React, { useState } from 'react';
import Title from '../components/Title';
import contact from '../assets/contact.webp';

const Contact = () => {
  // State to store the phone number input and success/error message
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Function to handle form submission
  const submitContact = async () => {
    if (!phoneNumber) {
      setMessage('Please enter your phone number');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Contact information submitted successfully!');
      } else {
        setMessage(data.message || 'Something went wrong!');
      }
    } catch (error) {
      setMessage('An error occurred while submitting your contact info.');
    }
  };

  return (
    <div className="py-10 bg-gray-50">
      <div className="text-center text-3xl font-semibold text-gray-900 pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className="my-10 flex justify-center md:flex-row gap-10 mb-28 px-5 md:px-20">
        <img
          src={contact}
          alt="Contact us"
          className="w-full md:max-w-md rounded-lg shadow-lg"
        />
        <div className="flex flex-col justify-center items-start gap-6 md:w-1/2">
          <p className="text-2xl font-medium text-gray-800">
            Give us your number, and our team will contact you soon.
          </p>
          
          {/* Display message if any */}
          {message && (
            <p
              className={`text-lg font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
            </p>
          )}

          {/* Input for phone number */}
          <div className="w-full relative">
            <input
              type="tel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your mobile number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} // Update state on input change
              aria-label="Phone number input"
            />
            <span
              className="absolute right-4 top-3 text-gray-500"
              aria-hidden="true"
            >
              📱
            </span>
          </div>

          {/* Submit button */}
          <button
            className={`bg-black text-white font-light px-8 py-3 mt-4 rounded-lg ${!token ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            onClick={submitContact}
            disabled={!token}
            aria-label="Submit contact information"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Error boundary component for error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-20">
          <h1 className="text-3xl font-semibold text-gray-900">Something went wrong.</h1>
          <p className="text-lg text-gray-600">Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Contact;