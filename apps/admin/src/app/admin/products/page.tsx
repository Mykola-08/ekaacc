'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Crown,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number;
  category: string;
  type: 'physical' | 'digital' | 'service';
  availability: 'active' | 'hidden' | 'vip_only' | 'corporate_only';
  stripeProductId?: string;
  stripePriceId?: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

type ProductType = 'physical' | 'digital' | 'service';
type ProductAvailability = 'active' | 'hidden' | 'vip_only' | 'corporate_only';

interface ProductFormState {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  duration: number;
  category: string;
  type: ProductType;
  availability: ProductAvailability;
  stripeProductId: string;
  stripePriceId: string;
  isActive: boolean;
}

const initialFormState: ProductFormState = {
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  duration: 60,
  category: '',
  type: 'service',
  availability: 'active',
  stripeProductId: '',
  stripePriceId: '',
  isActive: true
};

export default function ProductsManagementPage() {
  const { toast } = useToast();
  const { canAccessResource } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data?.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        shortDescription: p.short_description || '',
        price: p.price || 0,
        duration: p.duration || 60,
        category: p.category || '',
        type: p.type || 'service',
        availability: p.availability || 'active',
        stripeProductId: p.stripe_product_id,
        stripePriceId: p.stripe_price_id,
        images: p.images || [],
        isActive: p.is_active ?? true,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        syncStatus: p.sync_status || 'pending'
      })) || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Using demo data.',
        variant: 'destructive'
      });
      
      // Demo data
      setProducts([
        { id: '1', name: 'Individual Therapy Session', description: 'One-on-one therapy session with a licensed therapist', shortDescription: 'Personal therapy', price: 80, duration: 60, category: 'Therapy', type: 'service', availability: 'active', images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), syncStatus: 'synced' },
        { id: '2', name: 'Group Wellness Workshop', description: 'Interactive workshop for stress management', shortDescription: 'Group workshop', price: 40, duration: 90, category: 'Workshop', type: 'service', availability: 'active', images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), syncStatus: 'synced' },
        { id: '3', name: 'VIP Premium Package', description: 'Exclusive package with priority booking', shortDescription: 'VIP package', price: 200, duration: 120, category: 'Package', type: 'service', availability: 'vip_only', images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), syncStatus: 'pending' },
        { id: '4', name: 'Corporate Wellness Program', description: 'Comprehensive wellness program for businesses', shortDescription: 'Corporate wellness', price: 500, duration: 180, category: 'Corporate', type: 'service', availability: 'corporate_only', images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), syncStatus: 'synced' },
        { id: '5', name: 'Digital Meditation Course', description: 'Online meditation course with video content', shortDescription: 'Meditation course', price: 29, duration: 0, category: 'Digital', type: 'digital', availability: 'active', images: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), syncStatus: 'synced' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSaveProduct = async () => {
    setIsSaving(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.shortDescription,
        price: formData.price,
        duration: formData.duration,
        category: formData.category,
        type: formData.type,
        availability: formData.availability,
        stripe_product_id: formData.stripeProductId || null,
        stripe_price_id: formData.stripePriceId || null,
        is_active: formData.isActive,
        updated_at: new Date().toISOString(),
        sync_status: 'pending'
      };

      if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Product updated successfully' });
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Product created successfully' });
      }

      setShowDialog(false);
      setSelectedProduct(null);
      setFormData(initialFormState);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({ title: 'Error', description: 'Failed to save product', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Product deleted successfully' });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.isActive, updated_at: new Date().toISOString() })
        .eq('id', product.id);

      if (error) throw error;
      toast({ title: 'Success', description: `Product ${product.isActive ? 'deactivated' : 'activated'} successfully` });
      loadProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
      toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' });
    }
  };

  const handleSyncWithStripe = async (productId: string) => {
    try {
      const response = await fetch(`/api/stripe/sync-product/${productId}`, { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Success', description: 'Product synced with Stripe' });
        loadProducts();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast({ title: 'Error', description: 'Failed to sync with Stripe', variant: 'destructive' });
    }
  };

  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || p.availability === availabilityFilter;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    services: products.filter(p => p.type === 'service').length,
    digital: products.filter(p => p.type === 'digital').length,
    physical: products.filter(p => p.type === 'physical').length,
    totalRevenue: products.reduce((sum, p) => sum + (p.isActive ? p.price : 0), 0)
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'active': return <Eye className="h-4 w-4 text-green-500" />;
      case 'hidden': return <EyeOff className="h-4 w-4 text-gray-500" />;
      case 'vip_only': return <Crown className="h-4 w-4 text-amber-500" />;
      case 'corporate_only': return <Building2 className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'synced': return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Synced</Badge>;
      case 'pending': return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'error': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      default: return null;
    }
  };

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Products Management"
            description="Manage products, services, and packages with Stripe integration."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadProducts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => { setSelectedProduct(null); setFormData(initialFormState); setShowDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.services}</div>
            <div className="text-sm text-muted-foreground">Services</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.digital}</div>
            <div className="text-sm text-muted-foreground">Digital</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.physical}</div>
            <div className="text-sm text-muted-foreground">Physical</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">€{stats.totalRevenue}</div>
            <div className="text-sm text-muted-foreground">Potential Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="vip_only">VIP Only</SelectItem>
                <SelectItem value="corporate_only">Corporate Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products and services</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Sync Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className={!product.isActive ? 'opacity-50' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.shortDescription}</div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>€{product.price}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.duration > 0 ? `${product.duration} min` : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAvailabilityIcon(product.availability)}
                        <span className="text-sm capitalize">{product.availability.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getSyncStatusBadge(product.syncStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setFormData({
                              name: product.name,
                              description: product.description,
                              shortDescription: product.shortDescription,
                              price: product.price,
                              duration: product.duration,
                              category: product.category,
                              type: product.type,
                              availability: product.availability,
                              stripeProductId: product.stripeProductId || '',
                              stripePriceId: product.stripePriceId || '',
                              isActive: product.isActive
                            });
                            setShowDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleActive(product)}>
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSyncWithStripe(product.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Update product details' : 'Fill in the product details below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Therapy, Workshop" />
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input id="shortDescription" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Brief description" maxLength={100} />
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description" rows={4} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (EUR)</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input id="duration" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability} onValueChange={(value: any) => setFormData({ ...formData, availability: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Public)</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="vip_only">VIP Only</SelectItem>
                    <SelectItem value="corporate_only">Corporate Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                <Label>Active</Label>
              </div>
            </div>

            {selectedProduct && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Stripe Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stripeProductId">Stripe Product ID</Label>
                      <Input id="stripeProductId" value={formData.stripeProductId} onChange={(e) => setFormData({ ...formData, stripeProductId: e.target.value })} placeholder="prod_..." />
                    </div>
                    <div>
                      <Label htmlFor="stripePriceId">Stripe Price ID</Label>
                      <Input id="stripePriceId" value={formData.stripePriceId} onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })} placeholder="price_..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProduct} disabled={isSaving}>
              {isSaving ? 'Saving...' : selectedProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
