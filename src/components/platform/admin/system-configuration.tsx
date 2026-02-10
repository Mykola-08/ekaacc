'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Switch } from '@/components/ui/switch';
import { Settings, RefreshCw, Plus, Edit, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Configuration {
  id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  category: string;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

interface ConfigurationCategory {
  name: string;
  description: string;
  configurations: Configuration[];
}

export function SystemConfiguration() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [categories, setCategories] = useState<ConfigurationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConfig, setNewConfig] = useState({
    key: '',
    value: '',
    description: '',
    category: 'general',
    isEncrypted: false,
  });

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/admin/configurations');
      if (!response.ok) throw new Error('Failed to fetch configurations');
      const data = await response.json();

      setConfigurations(data.configurations);

      // Group configurations by category
      const grouped = data.configurations.reduce((acc: any, config: Configuration) => {
        const category = config.category || 'general';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(config);
        return acc;
      }, {});

      const categoriesArray = Object.entries(grouped).map(([name, configs]: [string, any]) => ({
        name,
        description: getCategoryDescription(name),
        configurations: configs,
      }));

      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      general: 'General system settings',
      security: 'Security and authentication settings',
      email: 'Email and notification settings',
      analytics: 'Analytics and tracking settings',
      payment: 'Payment and billing settings',
      storage: 'File storage and media settings',
      api: 'API and integration settings',
    };
    return descriptions[category] || 'Custom settings';
  };

  const handleSaveConfiguration = async (configId: string, value: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/configurations/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) throw new Error('Failed to update configuration');

      setEditingConfig(null);
      fetchConfigurations();
    } catch (error) {
      console.error('Error updating configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddConfiguration = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) throw new Error('Failed to add configuration');

      setShowAddModal(false);
      setNewConfig({
        key: '',
        value: '',
        description: '',
        category: 'general',
        isEncrypted: false,
      });
      fetchConfigurations();
    } catch (error) {
      console.error('Error adding configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfiguration = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    try {
      const response = await fetch(`/api/admin/configurations/${configId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete configuration');

      fetchConfigurations();
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const renderConfigValue = (config: Configuration) => {
    if (config.isEncrypted) {
      return <span className="text-muted-foreground/80 italic">â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢</span>;
    }

    if (typeof config.value === 'boolean') {
      return (
        <Switch
          checked={config.value}
          onCheckedChange={(checked) => handleSaveConfiguration(config.id, checked.toString())}
        />
      );
    }

    return (
      <div className="flex items-center gap-2">
        {editingConfig === config.id ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            autoFocus
            onBlur={() => {
              handleSaveConfiguration(config.id, editValue);
              setEditingConfig(null);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveConfiguration(config.id, editValue);
                setEditingConfig(null);
              }
            }}
          />
        ) : (
          <span className="text-foreground text-sm">{config.value}</span>
        )}
        {editingConfig !== config.id && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingConfig(config.id);
              setEditValue(config.value.toString());
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-semibold">System Configuration</h2>
          <p className="text-muted-foreground">Manage system settings and configurations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchConfigurations}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Configuration
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find configurations quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search by key or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Categories */}
      <div className="space-y-6">
        {categories
          .filter((category) => selectedCategory === 'all' || category.name === selectedCategory)
          .map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{category.configurations.length} settings</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.configurations
                    .filter(
                      (config) =>
                        config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        config.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((config) => (
                      <div
                        key={config.id}
                        className="border-border flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="text-foreground text-sm font-medium">{config.key}</h4>
                            {config.isEncrypted && (
                              <Badge variant="outline" className="text-xs">
                                Encrypted
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{config.description}</p>
                          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                            <span>
                              Updated: {format(new Date(config.updatedAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                            <span>By: {config.updatedBy}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          {renderConfigValue(config)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteConfiguration(config.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Add Configuration Modal */}
      {showAddModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Configuration</CardTitle>
              <CardDescription>Create a new system setting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="key">Configuration Key</Label>
                <Input
                  id="key"
                  value={newConfig.key}
                  onChange={(e) => setNewConfig({ ...newConfig, key: e.target.value })}
                  placeholder="e.g., app.name"
                />
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={newConfig.value}
                  onChange={(e) => setNewConfig({ ...newConfig, value: e.target.value })}
                  placeholder="Configuration value"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newConfig.description}
                  onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                  placeholder="Brief description of this setting"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newConfig.category}
                  onChange={(e) => setNewConfig({ ...newConfig, category: e.target.value })}
                  className="w-full rounded-md border border-border px-3 py-2"
                >
                  <option value="general">General</option>
                  <option value="security">Security</option>
                  <option value="email">Email</option>
                  <option value="analytics">Analytics</option>
                  <option value="payment">Payment</option>
                  <option value="storage">Storage</option>
                  <option value="api">API</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="encrypted"
                  checked={newConfig.isEncrypted}
                  onCheckedChange={(checked) =>
                    setNewConfig({ ...newConfig, isEncrypted: checked })
                  }
                />
                <Label htmlFor="encrypted" className="mb-0">
                  Encrypt this value
                </Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddConfiguration}
                  disabled={saving || !newConfig.key || !newConfig.value}
                  className="flex-1"
                >
                  {saving ? 'Adding...' : 'Add Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
