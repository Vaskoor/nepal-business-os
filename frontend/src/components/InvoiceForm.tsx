'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().positive(),
  price: z.coerce.number().positive(),
});

const schema = z.object({
  customerId: z.string(),
  date: z.string(),
  items: z.array(itemSchema).min(1),
  tax: z.coerce.number().default(0),
});

export default function InvoiceForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { items: [{ productId: '', quantity: 1, price: 0 }], tax: 0 },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const queryClient = useQueryClient();

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then(res => res.data),
  });
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data),
  });

  const onSubmit = async (data: any) => {
    // Calculate totals
    let subtotal = 0;
    for (const item of data.items) {
      subtotal += item.quantity * item.price;
    }
    const grandTotal = subtotal + (subtotal * data.tax) / 100;
    const payload = {
      ...data,
      invoiceNo: `INV-${Date.now()}`,
      total: subtotal,
      grandTotal,
    };
    await api.post('/invoices', payload);
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <select {...register('customerId')} className="border p-2 w-full">
        <option value="">Select Customer</option>
        {customers?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input type="date" {...register('date')} className="border p-2 w-full" />
      <input type="number" {...register('tax')} placeholder="Tax %" className="border p-2 w-full" />

      <div className="space-y-2">
        <h3 className="font-bold">Items</h3>
        {fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2">
            <select {...register(`items.${idx}.productId`)} className="border p-2 flex-1">
              <option value="">Select Product</option>
              {products?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" {...register(`items.${idx}.quantity`)} placeholder="Qty" className="border p-2 w-20" />
            <input type="number" {...register(`items.${idx}.price`)} placeholder="Price" className="border p-2 w-24" />
            <button type="button" onClick={() => remove(idx)} className="bg-red-500 text-white px-2">X</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ productId: '', quantity: 1, price: 0 })} className="text-blue-600">+ Add Item</button>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Invoice</button>
    </form>
  );
}
