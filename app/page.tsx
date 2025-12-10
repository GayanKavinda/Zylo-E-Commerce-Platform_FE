// This directive declares that this is a "Client Component". 
// In Next.js, this means it will run in the user's browser, giving it 
// access to browser-only features and allowing it to be interactive.
'use client';

// Imports necessary functions ("Hooks") from the React library.
import { useEffect, useState } from 'react';
// Imports the router from Next.js to allow for programmatic navigation.
import { useRouter } from 'next/navigation';

// This is the main function for the Home page of the website.
export default function Home() {
  // Initializes the router object.
  const router = useRouter();
  // Creates a state variable `mounted` to track if the component has finished its initial render.
  // It starts as `false`. This is a technique to avoid running browser-specific code on the server.
  const [mounted, setMounted] = useState(false);
  
  // This `useEffect` hook runs once, right after the component is first rendered in the browser.
  useEffect(() => {
    // It updates the state to indicate that the component is now mounted.
    setMounted(true);
  }, []); // The empty array `[]` means this effect runs only one time.

  // This `useEffect` hook runs whenever the `mounted` state changes.
  useEffect(() => {
    // It checks if the component is mounted.
    if (mounted) {
      // If it is, it automatically redirects the user to the "/products" page.
      router.push('/products');
    }
  }, [router, mounted]); // This effect depends on `router` and `mounted`.
  
  // This is the HTML structure (written in JSX) that gets displayed.
  // It's a temporary loading screen shown before the redirect happens.
  return (
    <div className="flex items-center justify-center min-h-screen" suppressHydrationWarning>
      <div className="text-center">
        {/* A simple spinning loader animation. */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        {/* The text displayed below the spinner. */}
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
