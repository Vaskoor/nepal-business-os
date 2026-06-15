'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().positive(),
  cost: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  description: z.string().optional(),
});

export default function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();

  const onSubmit = async (data: any) => {
    await api.post('/products', data);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Product Name" className="border p-2 w-full" />
      <input {...register('sku')} placeholder="SKU" className="border p-2 w-full" />
      <input {...register('price')} type="number" placeholder="Price" className="border p-2 w-full" />
      <input {...register('cost')} type="number" placeholder="Cost" className="border p-2 w-full" />
      <input {...register('stock')} type="number" placeholder="Stock" className="border p-2 w-full" />
      <textarea {...register('description')} placeholder="Description" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </form>
  );
}
