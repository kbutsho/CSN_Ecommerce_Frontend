'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/api';
import { Loader } from '@/components/Loader';

export default function Guard({ role, children }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user || (role && user.role !== role)) {
      router.replace('/login');
    } else {
      setOk(true);
    }
  }, []);

  return ok ? children : <Loader />;
}
