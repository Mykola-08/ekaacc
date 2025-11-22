import { bidirectionalSyncService } from '@/services/bidirectional-sync-service';

/**
 * Test script for bidirectional sync functionality
 * Run this to verify the sync system is working correctly
 */

async function testBidirectionalSync() {
  console.log('🧪 Starting bidirectional sync tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const isHealthy = await bidirectionalSyncService.healthCheck();
    console.log(`   Health check: ${isHealthy ? '✅ PASSED' : '❌ FAILED'}\n`);

    if (!isHealthy) {
      console.log('❌ Health check failed. Please check your configuration.');
      return;
    }

    // Test 2: Sync Statistics
    console.log('2️⃣ Testing sync statistics...');
    try {
      const stats = await bidirectionalSyncService.getSyncStatistics();
      console.log(`   Sync statistics: ${stats ? '✅ PASSED' : '❌ FAILED'}`);
      if (stats && stats.length > 0) {
        console.log(`   Found ${stats.length} sync statistics records`);
      }
      console.log('');
    } catch (error) {
      console.log(`   Sync statistics: ❌ FAILED - ${error}`);
      console.log('');
    }

    // Test 3: Pending Conflicts
    console.log('3️⃣ Testing pending conflicts...');
    try {
      const conflicts = await bidirectionalSyncService.getPendingConflicts();
      console.log(`   Pending conflicts: ${conflicts ? '✅ PASSED' : '❌ FAILED'}`);
      if (conflicts) {
        console.log(`   Found ${conflicts.length} pending conflicts`);
      }
      console.log('');
    } catch (error) {
      console.log(`   Pending conflicts: ❌ FAILED - ${error}`);
      console.log('');
    }

    // Test 4: Inbound Sync (from Square to Supabase)
    console.log('4️⃣ Testing inbound sync...');
    try {
      const inboundResult = await bidirectionalSyncService.syncBidirectional({
        direction: 'inbound',
        batchSize: 5,
        conflictResolution: 'merge'
      });
      
      console.log(`   Inbound sync: ${inboundResult.success ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   - Imported: ${inboundResult.imported}`);
      console.log(`   - Updated: ${inboundResult.updated}`);
      console.log(`   - Conflicts: ${inboundResult.conflicts}`);
      console.log(`   - Errors: ${inboundResult.errors.length}`);
      
      if (inboundResult.errors.length > 0) {
        inboundResult.errors.forEach(error => console.log(`     Error: ${error}`));
      }
      console.log('');
    } catch (error) {
      console.log(`   Inbound sync: ❌ FAILED - ${error}`);
      console.log('');
    }

    // Test 5: Outbound Sync (from Supabase to Square)
    console.log('5️⃣ Testing outbound sync...');
    try {
      const outboundResult = await bidirectionalSyncService.syncBidirectional({
        direction: 'outbound',
        batchSize: 5,
        conflictResolution: 'merge'
      });
      
      console.log(`   Outbound sync: ${outboundResult.success ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   - Exported: ${outboundResult.exported}`);
      console.log(`   - Updated: ${outboundResult.updated}`);
      console.log(`   - Conflicts: ${outboundResult.conflicts}`);
      console.log(`   - Errors: ${outboundResult.errors.length}`);
      
      if (outboundResult.errors.length > 0) {
        outboundResult.errors.forEach(error => console.log(`     Error: ${error}`));
      }
      console.log('');
    } catch (error) {
      console.log(`   Outbound sync: ❌ FAILED - ${error}`);
      console.log('');
    }

    // Test 6: Bidirectional Sync (both directions)
    console.log('6️⃣ Testing bidirectional sync...');
    try {
      const bidirectionalResult = await bidirectionalSyncService.syncBidirectional({
        direction: 'bidirectional',
        batchSize: 5,
        conflictResolution: 'merge'
      });
      
      console.log(`   Bidirectional sync: ${bidirectionalResult.success ? '✅ PASSED' : '❌ FAILED'}`);
      console.log(`   - Imported: ${bidirectionalResult.imported}`);
      console.log(`   - Exported: ${bidirectionalResult.exported}`);
      console.log(`   - Updated: ${bidirectionalResult.updated}`);
      console.log(`   - Conflicts: ${bidirectionalResult.conflicts}`);
      console.log(`   - Errors: ${bidirectionalResult.errors.length}`);
      console.log(`   - Duration: ${bidirectionalResult.duration}ms`);
      
      if (bidirectionalResult.errors.length > 0) {
        bidirectionalResult.errors.forEach(error => console.log(`     Error: ${error}`));
      }
      console.log('');
    } catch (error) {
      console.log(`   Bidirectional sync: ❌ FAILED - ${error}`);
      console.log('');
    }

    console.log('✅ All tests completed!');
    console.log('\n📊 Summary:');
    console.log('- Health Check: Verify API connections');
    console.log('- Sync Statistics: Check monitoring data');
    console.log('- Pending Conflicts: Check conflict resolution');
    console.log('- Inbound Sync: Test Square → Supabase sync');
    console.log('- Outbound Sync: Test Supabase → Square sync');
    console.log('- Bidirectional Sync: Test full bidirectional sync');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // We're in a Node.js environment
  testBidirectionalSync().catch(console.error);
}

export { testBidirectionalSync };