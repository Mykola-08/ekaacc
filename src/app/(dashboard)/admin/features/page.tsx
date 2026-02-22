import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Component to render a node and its children
function FeatureNode({ feature, childrenMap, level = 0 }: any) {
  return (
    <div className="group">
      <div
        style={{ marginLeft: (level * 24) + 'px' }}
        className="flex items-center gap-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors rounded-sm pr-2"
      >
        {/* Tree connectors visual could go here */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              {feature.key}
            </span>
            {feature.default_enabled ? (
              <Badge variant="default" className="h-5 text-[10px] px-1.5">Default On</Badge>
            ) : (
              <Badge variant="outline" className="h-5 text-[10px] px-1.5 text-muted-foreground">Default Off</Badge>
            )}
          </div>
          {feature.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {feature.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
        </div>
      </div>

      {childrenMap.get(feature.id)?.map((child: any) => (
        <FeatureNode
          key={child.id}
          feature={child}
          childrenMap={childrenMap}
          level={level + 1}
        />
      ))}
    </div>
  )
}

export default async function FeatureMatrixPage() {
  const supabase = await createClient();
  const { data: features } = await supabase.from('features').select('*').order('key');

  if (!features || features.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold">No Features Defined</h2>
        <p className="text-muted-foreground mb-4">Get started by adding your first feature flag.</p>
        <Button>Initialize Defaults</Button>
      </div>
    );
  }

  // Build Tree
  const childrenMap = new Map();
  const rootNodes: any[] = [];

  features.forEach(f => {
    if (f.parent_feature_id) {
      if (!childrenMap.has(f.parent_feature_id)) childrenMap.set(f.parent_feature_id, []);
      childrenMap.get(f.parent_feature_id).push(f);
    } else {
      rootNodes.push(f);
    }
  });

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Matrix</h1>
          <p className="text-muted-foreground text-sm">Manage system-wide capabilities and hierarchical flags.</p>
        </div>
        <Button>Add Feature</Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base">Feature Tree</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            {rootNodes.map(node => (
              <FeatureNode key={node.id} feature={node} childrenMap={childrenMap} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
