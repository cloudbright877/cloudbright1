import { Suspense } from 'react';
import RecoveryForm from './RecoveryForm';

export default function RecoveryPage() {
  return (
    <Suspense fallback={<RecoveryPageSkeleton />}>
      <RecoveryForm />
    </Suspense>
  );
}

function RecoveryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-dark-900/80 backdrop-blur-xl border-2 border-dark-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-3xl">
              🔑
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-dark-300">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

