
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function reviseServices() {
  console.log('Starting service revision...');

  // 1. Deactivate ALL existing services first to start clean
  console.log('Deactivating existing services...');
  const { error: deactivateError } = await supabase
    .from('service')
    .update({ active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // update all

  if (deactivateError) {
    console.error('Error deactivating services:', deactivateError);
    return;
  }

  // 2. Create the main "Personalized Session" service
  console.log('Creating "Personalized Session"...');
  const personalizedService = {
    name: 'Personalized Session',
    description: 'A tailored therapy session designed to address your unique needs, whether it be anxiety, stress, personal growth, or emotional balance. We adapt the approach to you.',
    category: 'individual',
    duration: 50,
    price: 10000,
    active: true,
    image_url: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop', // Soothing image
  };

  // Upsert logic for Personalized Session
  let serviceData, serviceError;
  const { data: existingService } = await supabase
    .from('service')
    .select('id')
    .eq('name', personalizedService.name)
    .maybeSingle();

  if (existingService) {
    ({ data: serviceData, error: serviceError } = await supabase
      .from('service')
      .update(personalizedService)
      .eq('id', existingService.id)
      .select()
      .single());
  } else {
    ({ data: serviceData, error: serviceError } = await supabase
      .from('service')
      .insert(personalizedService)
      .select()
      .single());
  }

  if (serviceError) {
    console.error('Error creating/updating Personalized Session:', serviceError);
    return;
  }

  const serviceId = serviceData.id;
  console.log(`Personalized Session ID: ${serviceId}`);

  // 3. Create Variants for Personalized Session
  const variants = [
    {
      service_id: serviceId,
      name: 'Standard Session',
      description: '50-minute focused session.',
      duration_min: 50,
      price_amount: 10000, // 100.00 EUR
      currency: 'EUR',
      active: true,
      comparison_label: 'Standard'
    },
    {
      service_id: serviceId,
      name: 'Deep Dive Session',
      description: '80-minute extended session for deeper exploration.',
      duration_min: 80,
      price_amount: 15000, // 150.00 EUR
      currency: 'EUR',
      active: true,
      comparison_label: 'Extended'
    }
  ];

  for (const v of variants) {
    const { error: matchError } = await supabase
      .from('service_variant')
      .delete()
      .match({ service_id: serviceId, name: v.name });

    const { error: varError } = await supabase
      .from('service_variant')
      .insert(v);
      
    if (varError) {
      console.error(`Error creating variant ${v.name}:`, varError);
    } else {
      console.log(`Created variant: ${v.name}`);
    }
  }

  // 4. Create "Couples Therapy" (Grouped)
  console.log('Creating "Couples Therapy"...');
  const couplesService = {
    name: 'Couples Therapy',
    description: 'A safe space for partners to improve communication and resolve conflict.',
    category: 'couples',
    duration: 50,
    price: 14000,
    active: true,
    image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop',
  };

  let couplesData, couplesError;
  const { data: existingCouples } = await supabase
    .from('service')
    .select('id')
    .eq('name', couplesService.name)
    .maybeSingle();

  if (existingCouples) {
    ({ data: couplesData, error: couplesError } = await supabase
      .from('service')
      .update(couplesService)
      .eq('id', existingCouples.id)
      .select()
      .single());
  } else {
    ({ data: couplesData, error: couplesError } = await supabase
      .from('service')
      .insert(couplesService)
      .select()
      .single());
  }

  if (couplesError) {
     console.error('Error creating Couples Therapy:', couplesError);
  } else {
     const cId = couplesData.id;
     // Variants
     const cVariants = [
        {
          service_id: cId,
          name: 'Standard Couples Session',
          description: '50-minute session for two.',
          duration_min: 50,
          price_amount: 14000, 
          currency: 'EUR',
          active: true
        },
        {
          service_id: cId,
          name: 'Extended Couples Session',
          description: '90-minute session for complex issues.',
          duration_min: 90,
          price_amount: 20000,
          currency: 'EUR',
          active: true
        }
     ];

     for (const v of cVariants) {
        await supabase.from('service_variant').delete().match({ service_id: cId, name: v.name });
        await supabase.from('service_variant').insert(v);
     }
  }
  
  console.log('Service revision complete.');
}

reviseServices();
