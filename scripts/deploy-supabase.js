import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadPromptsToSupabase() {
  try {
    console.log('🔄 Uploading prompts to Supabase...');
    
    // Load prompts from JSON file
    const promptsPath = path.join(process.cwd(), 'src/data/prompts.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
    
    console.log(`📊 Found ${prompts.length} prompts to upload`);
    
    // Transform data for Supabase (convert field names)
    const transformedPrompts = prompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      full_prompt: prompt.fullPrompt,
      category: prompt.category,
      tags: prompt.tags,
      compatible_models: prompt.compatibleModels,
      created_at: prompt.createdAt,
      updated_at: prompt.updatedAt,
      source: prompt.source || null
    }));
    
    // Upload in batches to avoid timeout
    const batchSize = 100;
    let uploaded = 0;
    
    for (let i = 0; i < transformedPrompts.length; i += batchSize) {
      const batch = transformedPrompts.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedPrompts.length / batchSize)}...`);
      
      const { data, error } = await supabase
        .from('prompts')
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error('❌ Error uploading batch:', error);
        throw error;
      }
      
      uploaded += batch.length;
      console.log(`✅ Uploaded ${uploaded}/${transformedPrompts.length} prompts`);
    }
    
    console.log('🎉 All prompts uploaded successfully!');
    
    // Get statistics
    const { data: stats, error: statsError } = await supabase
      .from('prompts')
      .select('category')
      .not('category', 'is', null);
    
    if (statsError) {
      console.error('Error fetching statistics:', statsError);
    } else {
      const categoryCounts = stats.reduce((acc, prompt) => {
        acc[prompt.category] = (acc[prompt.category] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📈 Category breakdown:');
      Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([category, count]) => {
          console.log(`  ${category}: ${count} prompts`);
        });
      
      console.log(`\n🎯 Total prompts: ${stats.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error uploading to Supabase:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadPromptsToSupabase();
