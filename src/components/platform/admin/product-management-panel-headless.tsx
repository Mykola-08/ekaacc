'use client';

import React, { useState, Fragment } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { Plus, Edit, Trash2, Search, MoreVertical, Package, Check } from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
} from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductManagementPanelHeadless() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([
    {
      id: '1',
      name: 'Intro Session',
      price: 50,
      category: 'Consultation',
      isActive: true,
      sales: 120,
    },
    {
      id: '2',
      name: 'Therapy Pack (5)',
      price: 200,
      category: 'Package',
      isActive: true,
      sales: 45,
    },
    {
      id: '3',
      name: 'Wellness Workshop',
      price: 99,
      category: 'Event',
      isActive: false,
      sales: 12,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true },
  });

  const onSubmit = (data: ProductFormData) => {
    toast({ title: 'Success', description: 'Product saved (simulation)' });
    setProducts([...products, { ...data, id: Math.random().toString(), sales: 0 }]);
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-xl font-bold">Products & Services</h2>
          <p className="text-muted-foreground text-sm">Manage your catalog and pricing.</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="group relative w-full sm:w-96">
        <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-colors group-focus-within:text-blue-500" />
        <input
          type="text"
          placeholder="Search products..."
          className="bg-muted/30 focus:bg-card text-foreground placeholder:text-muted-foreground/80 w-full rounded-2xl border-transparent py-3 pr-4 pl-10 font-medium transition-all duration-200 outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-card relative overflow-hidden rounded-xl p-6 shadow-xl ring-1 shadow-slate-100 ring-slate-100 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:ring-blue-500/20"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <Menu as="div" className="relative">
                <MenuButton className="text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/30 rounded-lg p-2">
                  <MoreVertical className="h-5 w-5" />
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="bg-card ring-opacity-5 absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl shadow-lg ring-1 ring-black focus:outline-none">
                    <div className="p-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={cn(
                              active ? 'bg-muted/30' : '',
                              'group text-foreground flex w-full items-center rounded-lg px-2 py-2 text-sm'
                            )}
                          >
                            <Edit className="text-muted-foreground/80 mr-2 h-4 w-4" />
                            Edit
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            className={cn(
                              active ? 'bg-red-50 text-red-700' : 'text-foreground',
                              'group flex w-full items-center rounded-lg px-2 py-2 text-sm'
                            )}
                          >
                            <Trash2
                              className={cn(
                                'mr-2 h-4 w-4',
                                active ? 'text-red-500' : 'text-muted-foreground/80'
                              )}
                            />
                            Delete
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>

            <h3 className="text-foreground mb-1 text-lg font-bold">{product.name}</h3>
            <p className="text-muted-foreground mb-4 text-sm">{product.category}</p>

            <div className="mt-auto flex items-end justify-between">
              <div>
                <p className="text-foreground text-2xl font-bold">€{product.price}</p>
                <p className="text-muted-foreground/80 mt-1 text-xs">{product.sales} sales</p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                  product.isActive
                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                    : 'bg-muted/30 text-muted-foreground ring-gray-600/20'
                )}
              >
                {product.isActive ? 'Active' : 'Draft'}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Card Placeholder */}
        <button
          onClick={() => setIsDialogOpen(true)}
          className="border-border group flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all hover:border-blue-300 hover:bg-blue-50/50"
        >
          <div className="bg-muted/30 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors group-hover:bg-blue-100">
            <Plus className="text-muted-foreground/80 h-6 w-6 group-hover:text-blue-600" />
          </div>
          <span className="text-muted-foreground font-semibold group-hover:text-blue-700">
            Add New Product
          </span>
        </button>
      </div>

      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDialogOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="bg-card w-full max-w-md transform overflow-hidden rounded-2xl p-8 text-left align-middle shadow-2xl transition-all">
                  <DialogTitle as="h3" className="text-foreground text-xl leading-6 font-bold">
                    Product Details
                  </DialogTitle>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                      <label className="text-foreground/90 mb-1 block text-sm font-medium">
                        Name
                      </label>
                      <input
                        {...register('name')}
                        className="border-border bg-muted/30 w-full rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g. Therapy Session"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-foreground/90 mb-1 block text-sm font-medium">
                          Price
                        </label>
                        <div className="relative">
                          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                            €
                          </span>
                          <input
                            type="number"
                            {...register('price', { valueAsNumber: true })}
                            className="border-border bg-muted/30 w-full rounded-xl p-3 pl-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        {errors.price && (
                          <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-foreground/90 mb-1 block text-sm font-medium">
                          Category
                        </label>
                        <select
                          {...register('category')}
                          className="border-border bg-muted/30 w-full rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Package">Package</option>
                          <option value="Event">Event</option>
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="flex flex-col">
                        <span className="text-foreground text-sm font-medium">Active Status</span>
                        <span className="text-muted-foreground text-xs">Visible to users</span>
                      </span>
                      <Switch
                        checked={true} // Simplified
                        onChange={() => {}}
                        className={cn(
                          'bg-blue-600',
                          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'translate-x-5',
                            'bg-card pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <button
                        type="button"
                        className="text-foreground/90 hover:bg-muted inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
