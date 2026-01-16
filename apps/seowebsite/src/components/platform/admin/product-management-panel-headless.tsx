'use client';

import React, { useState, Fragment } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MoreVertical,
  Package,
  Check
} from 'lucide-react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Menu, MenuButton, MenuItem, MenuItems, Switch } from '@headlessui/react';
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
  isActive: z.boolean().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductManagementPanelHeadless() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([
      { id: '1', name: 'Intro Session', price: 50, category: 'Consultation', isActive: true, sales: 120 },
      { id: '2', name: 'Therapy Pack (5)', price: 200, category: 'Package', isActive: true, sales: 45 },
      { id: '3', name: 'Wellness Workshop', price: 99, category: 'Event', isActive: false, sales: 12 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true }
  });

  const onSubmit = (data: ProductFormData) => {
    toast({ title: 'Success', description: 'Product saved (simulation)' });
    setProducts([...products, { ...data, id: Math.random().toString(), sales: 0 }]);
    setIsDialogOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
            <h2 className="text-xl font-bold text-foreground">Products & Services</h2>
            <p className="text-sm text-muted-foreground">Manage your catalog and pricing.</p>
        </div>
        <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
        </button>
      </div>

       <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/80 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-3 bg-muted/30 border-transparent focus:bg-card focus:border-blue-500 rounded-2xl outline-none transition-all duration-200 font-medium text-foreground placeholder:text-muted-foreground/80"
          />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
            <div key={product.id} className="group bg-card rounded-[24px] p-6 shadow-xl shadow-slate-100 ring-1 ring-slate-100 hover:ring-blue-500/20 transition-all hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Package className="w-6 h-6" />
                    </div>
                    <Menu as="div" className="relative">
                        <MenuButton className="p-2 text-muted-foreground/80 hover:text-muted-foreground rounded-lg hover:bg-muted/30">
                            <MoreVertical className="w-5 h-5" />
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
                            <MenuItems className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-1">
                                    <MenuItem>
                                        {({ active }) => (
                                            <button className={cn(active ? 'bg-muted/30' : '', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm text-foreground')}>
                                                <Edit className="mr-2 h-4 w-4 text-muted-foreground/80" />
                                                Edit
                                            </button>
                                        )}
                                    </MenuItem>
                                     <MenuItem>
                                        {({ active }) => (
                                            <button className={cn(active ? 'bg-red-50 text-red-700' : 'text-foreground', 'group flex w-full items-center rounded-lg px-2 py-2 text-sm')}>
                                                <Trash2 className={cn("mr-2 h-4 w-4", active ? "text-red-500" : "text-muted-foreground/80")} />
                                                Delete
                                            </button>
                                        )}
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
                 </div>
                 
                 <h3 className="text-lg font-bold text-foreground mb-1">{product.name}</h3>
                 <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                 
                 <div className="flex items-end justify-between mt-auto">
                    <div>
                        <p className="text-2xl font-bold text-foreground">€{product.price}</p>
                        <p className="text-xs text-muted-foreground/80 mt-1">{product.sales} sales</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset", product.isActive ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-muted/30 text-muted-foreground ring-gray-600/20")}>
                        {product.isActive ? 'Active' : 'Draft'}
                    </span>
                 </div>
            </div>
        ))}
        
        {/* Add New Card Placeholder */}
        <button 
            onClick={() => setIsDialogOpen(true)}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-[24px] hover:border-blue-300 hover:bg-blue-50/50 transition-all group min-h-[200px]"
        >
            <div className="h-12 w-12 rounded-full bg-muted/30 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground/80 group-hover:text-blue-600" />
            </div>
            <span className="font-semibold text-muted-foreground group-hover:text-blue-700">Add New Product</span>
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
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[32px] bg-card p-8 text-left align-middle shadow-2xl transition-all">
                  <DialogTitle as="h3" className="text-xl font-bold leading-6 text-foreground">
                    Product Details
                  </DialogTitle>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Name</label>
                        <input
                            {...register('name')}
                            className="w-full rounded-xl border-border bg-muted/30 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="e.g. Therapy Session" 
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/90 mb-1">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                <input
                                    type="number"
                                    {...register('price', { valueAsNumber: true })}
                                    className="w-full rounded-xl border-border bg-muted/30 p-3 pl-8 text-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-foreground/90 mb-1">Category</label>
                            <select
                                {...register('category')}
                                className="w-full rounded-xl border-border bg-muted/30 p-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select...</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Package">Package</option>
                                <option value="Event">Event</option>
                            </select>
                            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                        </div>
                     </div>

                    <div className="flex items-center justify-between py-2">
                        <span className="flex flex-col">
                             <span className="text-sm font-medium text-foreground">Active Status</span>
                             <span className="text-xs text-muted-foreground">Visible to users</span>
                        </span>
                        <Switch
                            checked={true} // Simplified
                            onChange={() => {}}
                            className={cn(
                                'bg-blue-600',
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'translate-x-5',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-card shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                        type="button"
                        className="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-muted transition-colors"
                        onClick={() => setIsDialogOpen(false)}
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className="inline-flex justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
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
