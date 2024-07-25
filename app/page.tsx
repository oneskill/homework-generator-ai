import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl text-center font-bold mb-6">Welcome to EDU Genie Platform</h1>
      <p className="text-xl mb-8">
        Create, manage, and take interactive language assessments with our easy-to-use platform.
      </p>
      <div className="space-y-4">
        <Link href="/dashboard" className="block bg-blue-500 text-white px-6 py-3 rounded-lg text-center hover:bg-blue-600 transition">
          Go to Dashboard
        </Link>
        <Link href="/setup" className="block bg-green-500 text-white px-6 py-3 rounded-lg text-center hover:bg-green-600 transition">
          Create New Assessment
        </Link>
      </div>
    </div>
  );
}