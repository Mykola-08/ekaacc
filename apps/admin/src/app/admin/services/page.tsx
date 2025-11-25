'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { supabase } from '@/lib/supabase';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Clock,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

interface Service {
  id: string;
  name: string;
  category: 'Core' | 'Personalized' | '360° Component' | 'Workshop' | 'Wellness';
  descriptionShort: string;
  descriptionLong: string;
  durationMinutes: number;
  priceEUR: number;
  benefits: string[];
  tags: string[];
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = ['Core', 'Personalized', '360° Component', 'Workshop', 'Wellness'] as const;
type ServiceCategory = typeof categories[number];

interface ServiceFormState {
  name: string;
  category: ServiceCategory;
  descriptionShort: string;
  descriptionLong: string;
  durationMinutes: number;
  priceEUR: number;
  benefits: string;
  tags: string;
  active: boolean;
  featured: boolean;
}

const initialFormState: ServiceFormState = {
  name: '',
  category: 'Core',
  descriptionShort: '',
  descriptionLong: '',
  durationMinutes: 60,
  priceEUR: 0,
  benefits: '',
  tags: '',
  active: true,
  featured: false
};

export default function ServicesManagementPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormState>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServices(data?.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category || 'Core',
        descriptionShort: s.description_short || '',
        descriptionLong: s.description_long || '',
        durationMinutes: s.duration_minutes || 60,
        priceEUR: s.price_eur || 0,
        benefits: s.benefits || [],
        tags: s.tags || [],
        active: s.active ?? true,
        featured: s.featured ?? false,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      })) || []);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: 'Info',
        description: 'Loading demo services data.',
      });
      
      // Demo data for therapy services
      setServices([
        {
          id: '1',
          name: 'Individual Therapy',
          category: 'Core',
          descriptionShort: 'One-on-one therapy sessions',
          descriptionLong: 'Personalized therapy sessions tailored to your specific needs and goals.',
          durationMinutes: 60,
          priceEUR: 80,
          benefits: ['Personal attention', 'Customized treatment', 'Flexible scheduling'],
          tags: ['therapy', 'individual', 'mental-health'],
          active: true,
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Couples Therapy',
          category: 'Core',
          descriptionShort: 'Relationship counseling for couples',
          descriptionLong: 'Professional guidance for couples looking to improve their relationship.',
          durationMinutes: 90,
          priceEUR: 120,
          benefits: ['Improved communication', 'Conflict resolution', 'Stronger bond'],
          tags: ['couples', 'relationship', 'counseling'],
          active: true,
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Stress Management Workshop',
          category: 'Workshop',
          descriptionShort: 'Learn effective stress management techniques',
          descriptionLong: 'Group workshop teaching practical stress management and relaxation techniques.',
          durationMinutes: 120,
          priceEUR: 45,
          benefits: ['Practical techniques', 'Group support', 'Take-home materials'],
          tags: ['stress', 'workshop', 'group'],
          active: true,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Personalized Wellness Plan',
          category: 'Personalized',
          descriptionShort: 'Custom wellness program',
          descriptionLong: 'A comprehensive wellness plan designed specifically for your lifestyle and goals.',
          durationMinutes: 90,
          priceEUR: 150,
          benefits: ['Tailored approach', 'Holistic assessment', 'Ongoing support'],
          tags: ['wellness', 'personalized', 'holistic'],
          active: true,
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Mindfulness Meditation',
          category: 'Wellness',
          descriptionShort: 'Guided meditation sessions',
          descriptionLong: 'Learn mindfulness meditation techniques to reduce anxiety and improve focus.',
          durationMinutes: 45,
          priceEUR: 35,
          benefits: ['Reduced anxiety', 'Better focus', 'Inner peace'],
          tags: ['meditation', 'mindfulness', 'relaxation'],
          active: true,
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '6',
          name: '360° Assessment',
          category: '360° Component',
          descriptionShort: 'Comprehensive wellness assessment',
          descriptionLong: 'Complete evaluation covering mental, physical, and emotional wellness.',
          durationMinutes: 180,
          priceEUR: 200,
          benefits: ['Full evaluation', 'Detailed report', 'Action plan'],
          tags: ['assessment', '360', 'comprehensive'],
          active: true,
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleSaveService = async () => {
    setIsSaving(true);
    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description_short: formData.descriptionShort,
        description_long: formData.descriptionLong,
        duration_minutes: formData.durationMinutes,
        price_eur: formData.priceEUR,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        active: formData.active,
        featured: formData.featured,
        updated_at: new Date().toISOString()
      };

      if (selectedService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', selectedService.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Service updated successfully' });
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            ...serviceData,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        toast({ title: 'Success', description: 'Service created successfully' });
      }

      setShowDialog(false);
      setSelectedService(null);
      setFormData(initialFormState);
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Service deleted successfully' });
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ active: !service.active, updated_at: new Date().toISOString() })
        .eq('id', service.id);

      if (error) throw error;
      toast({ title: 'Success', description: `Service ${service.active ? 'deactivated' : 'activated'}` });
      loadServices();
    } catch (error) {
      console.error('Error toggling service:', error);
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ featured: !service.featured, updated_at: new Date().toISOString() })
        .eq('id', service.id);

      if (error) throw error;
      toast({ title: 'Success', description: `Service ${service.featured ? 'unfeatured' : 'featured'}` });
      loadServices();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.descriptionShort.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: services.length,
    active: services.filter(s => s.active).length,
    featured: services.filter(s => s.featured).length,
    avgPrice: services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.priceEUR, 0) / services.length) : 0,
    avgDuration: services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.durationMinutes, 0) / services.length) : 0
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return 'bg-blue-500';
      case 'Personalized': return 'bg-purple-500';
      case '360° Component': return 'bg-green-500';
      case 'Workshop': return 'bg-orange-500';
      case 'Wellness': return 'bg-teal-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <SettingsShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <SettingsHeader
            title="Services Management"
            description="Manage therapy services, workshops, and wellness programs."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadServices} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => { setSelectedService(null); setFormData(initialFormState); setShowDialog(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Services</div>
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
            <div className="text-2xl font-bold">{stats.featured}</div>
            <div className="text-sm text-muted-foreground">Featured</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">€{stats.avgPrice}</div>
            <div className="text-sm text-muted-foreground">Avg Price</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.avgDuration}m</div>
            <div className="text-sm text-muted-foreground">Avg Duration</div>
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
                  placeholder="Search services..."
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
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>All therapy and wellness services</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className={!service.active ? 'opacity-50' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.descriptionShort}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(service.category)}>{service.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {service.durationMinutes} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        €{service.priceEUR}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleActive(service)}>
                        {service.active ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleFeatured(service)}>
                        <Star className={`h-4 w-4 ${service.featured ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedService(service);
                            setFormData({
                              name: service.name,
                              category: service.category as ServiceCategory,
                              descriptionShort: service.descriptionShort,
                              descriptionLong: service.descriptionLong,
                              durationMinutes: service.durationMinutes,
                              priceEUR: service.priceEUR,
                              benefits: service.benefits.join(', '),
                              tags: service.tags.join(', '),
                              active: service.active,
                              featured: service.featured
                            });
                            setShowDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteService(service.id)}>
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

      {/* Service Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
            <DialogDescription>
              {selectedService ? 'Update service details' : 'Fill in the service details below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Service name" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: ServiceCategory) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descriptionShort">Short Description</Label>
              <Input id="descriptionShort" value={formData.descriptionShort} onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })} placeholder="Brief description" />
            </div>

            <div>
              <Label htmlFor="descriptionLong">Full Description</Label>
              <Textarea id="descriptionLong" value={formData.descriptionLong} onChange={(e) => setFormData({ ...formData, descriptionLong: e.target.value })} placeholder="Detailed description" rows={4} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                <Input id="durationMinutes" type="number" value={formData.durationMinutes} onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <Label htmlFor="priceEUR">Price (EUR)</Label>
                <Input id="priceEUR" type="number" step="0.01" value={formData.priceEUR} onChange={(e) => setFormData({ ...formData, priceEUR: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>

            <div>
              <Label htmlFor="benefits">Benefits (comma separated)</Label>
              <Textarea id="benefits" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} placeholder="Benefit 1, Benefit 2, Benefit 3" rows={2} />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="therapy, wellness, relaxation" />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                <Label>Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveService} disabled={isSaving}>
              {isSaving ? 'Saving...' : selectedService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SettingsShell>
  );
}
