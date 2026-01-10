'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Alert, AlertDescription } from '@/components/platform/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/platform/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/platform/ui/form';
import { Input } from '@/components/platform/ui/input';
import { Textarea } from '@/components/platform/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { Switch } from '@/components/platform/ui/switch';
import { Label } from '@/components/platform/ui/label';
import { useAuth } from '@/context/platform/auth-context';
import { supabase } from '@/lib/platform/supabase';
import { useToast } from '@/hooks/platform/use-toast';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  DollarSign,
  Image,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Upload
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required').max(100),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be positive'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['physical', 'digital', 'service']),
  availability: z.enum(['active', 'hidden', 'vip_only', 'corporate_only']),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  images: z.array(z.string()).optional(),
  variations: z.array(z.object({
    name: z.string(),
    price: z.number(),
    duration: z.number().optional(),
    description: z.string().optional()
  })).optional(),
  isActive: z.boolean().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  type: 'physical' | 'digital' | 'service';
  availability: 'active' | 'hidden' | 'vip_only' | 'corporate_only';
  stripeProductId?: string;
  stripePriceId?: string;
  images: string[];
  variations: Array<{
    name: string;
    price: number;
    duration?: number;
    description?: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
  lastSyncAt?: string;
  syncError?: string;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  metadata: Record<string, any>;
  active: boolean;
}

interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  active: boolean;
}

export function ProductManagementPanel() {
  const { user, canAccessResource } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stripeProducts, setStripeProducts] = useState<StripeProduct[]>([]);
  const [stripePrices, setStripePrices] = useState<StripePrice[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      difficulty: 'Beginner',
      type: 'service',
      availability: 'active',
      isActive: true,
      images: [],
      variations: []
    }
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStripeData = async () => {
    try {
      // Fetch Stripe products and prices
      const response = await fetch('/api/stripe/products');
      const data = await response.json();
      
      if (data.success) {
        setStripeProducts(data.products || []);
        setStripePrices(data.prices || []);
      }
    } catch (error) {
      console.error('Error fetching Stripe data:', error);
    }
  };

  const syncWithStripe = async (productId: string) => {
    try {
      setIsSyncing(true);
      
      const response = await fetch(`/api/stripe/sync-product/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Product synced with Stripe successfully'
        });
        fetchProducts();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync with Stripe',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
            sync_status: 'pending'
          })
          .eq('id', selectedProduct.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product updated successfully'
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            sync_status: 'pending'
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Product created successfully'
        });
      }

      setIsDialogOpen(false);
      setSelectedProduct(null);
      form.reset();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully'
      });

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        const currentImages = form.getValues('images') || [];
        form.setValue('images', [...currentImages, data.url]);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  useEffect(() => {
    fetchProducts();
    fetchStripeData();
  }, []);

  if (!canAccessResource('product_management', 'read')) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access product management.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">
            Create and manage products with Stripe integration
          </p>
        </div>
        {canAccessResource('product_management', 'create') && (
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="category">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View and manage your products with Stripe sync status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Stripe Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.shortDescription}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>€{product.price}</TableCell>
                      <TableCell>{product.duration} min</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.availability === 'active' ? 'default' :
                            product.availability === 'vip_only' ? 'secondary' :
                            product.availability === 'corporate_only' ? 'secondary' :
                            'outline'
                          }
                        >
                          {product.availability.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.syncStatus === 'synced' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : product.syncStatus === 'error' ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
                          )}
                          <span className="text-sm capitalize">{product.syncStatus}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canAccessResource('product_management', 'update') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                form.reset(product);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canAccessResource('product_management', 'update') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => syncWithStripe(product.id)}
                              disabled={isSyncing}
                            >
                              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                            </Button>
                          )}
                          {canAccessResource('product_management', 'delete') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update product details and Stripe integration' : 'Create a new product with Stripe integration'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProductSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (EUR)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="60"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Therapy, Wellness, Fitness" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                          <SelectItem value="vip_only">VIP Only</SelectItem>
                          <SelectItem value="corporate_only">Corporate Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Product is visible and available for purchase
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description for product cards"
                        className="resize-none"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/100 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed product description"
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stripe Integration */}
              {selectedProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle>Stripe Integration</CardTitle>
                    <CardDescription>
                      Connect this product with Stripe for payment processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control as any}
                      name="stripeProductId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Product ID</FormLabel>
                          <FormControl>
                            <Input placeholder="prod_..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Leave empty to auto-create Stripe product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control as any}
                      name="stripePriceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stripe Price ID</FormLabel>
                          <FormControl>
                            <Input placeholder="price_..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Leave empty to auto-create Stripe price
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedProduct.stripeProductId && (
                      <div className="text-sm text-muted-foreground">
                        <p>Last sync: {selectedProduct.lastSyncAt ? new Date(selectedProduct.lastSyncAt).toLocaleString() : 'Never'}</p>
                        {selectedProduct.syncError && (
                          <p className="text-red-500">Sync error: {selectedProduct.syncError}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedProduct(null);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}