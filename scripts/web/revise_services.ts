
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

  // 1. Deactivate ALL existing services first
  console.log('Deactivating existing services...');
  const { error: deactivateError } = await supabase
    .from('service')
    .update({ active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // update all safe guard

  if (deactivateError) {
    console.error('Error deactivating services:', deactivateError);
    // Continue anyway
  }

  // --- DEFINITIONS ---

  // 1. Separate 360 Review
  const service360 = {
    slug: 'revisio360',
    name: '360° Review',
    description: 'Comprehensive assessment of your physical and emotional well-being.',
    duration: 90, 
    price: 12000, 
    image_url: 'https://images.pexels.com/photos/4099304/pexels-photo-4099304.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'review',
    active: true
  };

  // 2. Main Services (from Booking Website)
  const mainServices = [
    {
      slug: 'massatge',
      name: 'Therapeutic Massage',
      description: 'Relieves stress and improves circulation with specialized techniques.',
      duration: 60,
      price: 6000,
      image_url: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'therapy'
    },
    {
      slug: 'kinesiologia',
      name: 'Holistic Kinesiology',
      description: 'Identifies blockages and restores balance through muscle testing.',
      duration: 60,
      price: 7000,
      image_url: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'therapy'
    },
    {
      slug: 'nutritio',
      name: 'Conscious Nutrition',
      description: 'Personalized nutritional guidance for long-term vitality.',
      duration: 60,
      price: 6000,
      image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'nutrition'
    },
    {
      slug: 'suplements',
      name: 'Supplements Guidance',
      description: 'Expert advice on supplementation to support your health goals.',
      duration: 45,
      price: 4500,
      image_url: 'https://images.pexels.com/photos/8845019/pexels-photo-8845019.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'nutrition'
    },
    {
      slug: 'sistemica',
      name: 'Systemic Therapy',
      description: 'Addresses deep-rooted patterns and emotional blockages.',
      duration: 60,
      price: 7500,
      image_url: 'https://images.pexels.com/photos/7176036/pexels-photo-7176036.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'therapy'
    }
  ];

  // 3. Grouped Personalized Services
  const personalizedGroup = {
    slug: 'personalized-session',
    name: 'Personalized Session',
    description: 'Tailored therapies for specific professions and lifestyles.',
    duration: 60,
    price: 7000,
    image_url: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2070&auto=format&fit=crop',
    category: 'individual',
    active: true
  };

  const personalizedVariants = [
    { name: 'Office Workers', description: 'Relief for sedentary work tensions.', price: 7000 },
    { name: 'Athletes', description: 'Recovery and performance optimization.', price: 7000 },
    { name: 'Artists', description: 'Care for creative physical demands.', price: 7000 },
    { name: 'Musicians', description: 'Technique and posture support.', price: 7000 },
    { name: 'Students', description: 'Focus and stress management.', price: 6000 },
    { name: 'Parents', description: 'Support for the demands of parenthood.', price: 6500 }
  ];

  // --- UPSERT FUNCTIONS ---

  async function upsertService(service: any) {
    // Try to find by slug first
    const { data: existing } = await supabase
      .from('service')
      .select('id')
      .eq('slug', service.slug)
      .maybeSingle();

    let serviceId;
    if (existing) {
      const { data } = await supabase
        .from('service')
        .update({ ...service, active: true })
        .eq('id', existing.id)
        .select()
        .single();
      serviceId = data.id;
    } else {
      const { data, error } = await supabase
        .from('service')
        .insert({ ...service, active: true })
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating ${service.name}:`, error);
        return null;
      }
      serviceId = data.id;
    }
    return serviceId;
  }

  // EXECUTION

  // 1. Upsert 360 Review
  console.log('Upserting 360 Review...');
  await upsertService(service360);

  // 2. Upsert Main Services
  console.log('Upserting Main Services...');
  for (const s of mainServices) {
    await upsertService(s);
  }

  // 3. Upsert Personalized Group and Variants
  console.log('Upserting Personalized Group...');
  const pId = await upsertService(personalizedGroup);
  
  if (pId) {
    // Create variants
    console.log('Creating variants for Personalized Session...');
    
    // Deactivate old variants for this service
    await supabase.from('service_variant').update({ active: false }).eq('service_id', pId);

    for (const v of personalizedVariants) {
      await supabase.from('service_variant').insert({
        service_id: pId,
        name: v.name,
        description: v.description,
        price_amount: v.price,
        currency: 'EUR',
        duration_min: 60,
        active: true,
        comparison_label: 'Specialized'
      });
    }
  }

  console.log('Service revision complete.');
}

reviseServices().catch(console.error);
