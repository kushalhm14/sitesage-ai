import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

async function listModels() {
  try {
    console.log('🔍 Fetching available Gemini models from v1beta API...\n');
    
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const geminiModels = response.data.models.filter(m => 
      m.name.includes('gemini') && 
      m.supportedGenerationMethods?.includes('generateContent')
    );

    console.log(`📋 Found ${geminiModels.length} Gemini models that support generateContent:\n`);
    console.log('=' .repeat(80));

    geminiModels.forEach((model, index) => {
      const modelName = model.name.replace('models/', '');
      console.log(`\n${index + 1}. ${modelName}`);
      console.log(`   Display Name: ${model.displayName || 'N/A'}`);
      console.log(`   Description: ${model.description || 'N/A'}`);
      console.log(`   Version: ${model.version || 'N/A'}`);
      console.log(`   Supports: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log(`   Input Token Limit: ${model.inputTokenLimit || 'N/A'}`);
      console.log(`   Output Token Limit: ${model.outputTokenLimit || 'N/A'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 FREE TIER MODELS (as of Oct 2024):');
    console.log('   - gemini-1.5-flash (latest stable)');
    console.log('   - gemini-1.5-flash-001 (versioned)');
    console.log('   - gemini-1.5-flash-002 (versioned)');
    console.log('   - gemini-1.5-flash-8b (lightweight)');
    console.log('   - gemini-1.0-pro (legacy)');
    console.log('\n💰 Rate Limits (FREE tier):');
    console.log('   - 15 requests per minute (RPM)');
    console.log('   - 1 million tokens per minute (TPM)');
    console.log('   - 1,500 requests per day (RPD)');
    console.log('\n🎯 RECOMMENDED for your use case: gemini-1.5-flash-001 or gemini-1.5-flash-002');
    console.log('');

  } catch (error) {
    console.error('❌ Error fetching models:', error.response?.data || error.message);
    if (error.response?.status === 403) {
      console.error('\n⚠️  API Key might be invalid or doesn\'t have permissions');
    }
  }
}

listModels();
