'use client';

import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <FiAlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
              Oops! Something went wrong
            </h2>

            <p className="mb-6 text-center text-gray-600">
              We`ve been notified about this issue and are working to fix it.
            </p>

            {error.message && (
              <div className="mb-6 rounded-md bg-gray-50 p-4">
                <p className="font-mono text-sm text-gray-700">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>

            {error.digest && (
              <p className="mt-4 text-center text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
