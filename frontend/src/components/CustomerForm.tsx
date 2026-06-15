'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  pan: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();

  const onSubmit = async (data: FormData) => {
    await api.post('/customers', data);
    queryClient.invalidateQueries({ queryKey: ['customers'] });
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Name" className="border p-2 w-full" />
      <input {...register('email')} placeholder="Email" className="border p-2 w-full" />
      <input {...register('phone')} placeholder="Phone" className="border p-2 w-full" />
      <input {...register('address')} placeholder="Address" className="border p-2 w-full" />
      <input {...register('pan')} placeholder="PAN" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
