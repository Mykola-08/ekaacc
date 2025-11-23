import { integrationManager } from '@/lib/integrations/manager';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const statuses = await integrationManager.getAllStatuses();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>EKA Balance API Service</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#666' }}>
          <span>Status: <strong style={{ color: 'green' }}>Operational</strong></span>
          <span>Port: <strong>9005</strong></span>
          <span>Environment: <strong>{process.env.NODE_ENV}</strong></span>
        </div>
      </header>

      <main>
        <h2>Active Integrations</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {statuses.map((status) => (
            <div 
              key={status.id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '1.5rem',
                backgroundColor: status.connected ? '#f0fdf4' : '#fef2f2'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{status.name}</h3>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '999px',
                  backgroundColor: status.connected ? '#dcfce7' : '#fee2e2',
                  color: status.connected ? '#166534' : '#991b1b'
                }}>
                  {status.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#555' }}>
                {status.description}
              </p>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                <div>Provider: {status.provider}</div>
                {status.details && Object.keys(status.details).length > 0 && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #eee' }}>
                    {Object.entries(status.details).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
