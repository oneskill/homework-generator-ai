'use client';

import { useParams } from 'next/navigation';
import AssessmentView from '@/components/AssessmentView';

export default function AssessmentPage() {
  const params = useParams();
  const assessmentId = params.id as string;

  return (
    <div>
      <AssessmentView assessmentId={assessmentId} />
    </div>
  );
}