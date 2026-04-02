import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function TherapistRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('Therapist')
      .select('slug')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data?.slug) navigate(`/therapist/${data.slug}`, { replace: true });
        else navigate('/404', { replace: true });
      });
  }, [id]);

  return null;
}