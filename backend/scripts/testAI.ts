import dotenv from 'dotenv';
import { OpenAIService } from '../src/services/OpenAIService';

dotenv.config();

async function testAIIntegration() {
  console.log('🤖 Testing AI Integration...\n');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please add your OpenAI API key to the .env file');
    process.exit(1);
  }

  const openAIService = new OpenAIService();

  const testQueries = [
    "I need a laptop for college work and gaming",
    "Looking for wireless headphones under $200",
    "Best smartphone with good camera",
    "Running shoes for marathon training",
    "Coffee maker for small office"
  ];

  for (const query of testQueries) {
    try {
      console.log(`📝 Query: "${query}"`);
      console.log('⏳ Processing...');
      
      const startTime = Date.now();
      const result = await openAIService.processQuery(query);
      const endTime = Date.now();
      
      console.log('✅ Result:');
      console.log(`   Category: ${result.category || 'Not specified'}`);
      console.log(`   Features: ${result.features.join(', ') || 'None'}`);
      console.log(`   Price Range: ${result.priceRange ? `$${result.priceRange[0]} - $${result.priceRange[1]}` : 'Not specified'}`);
      console.log(`   Use Case: ${result.useCase || 'Not specified'}`);
      console.log(`   Keywords: ${result.keywords.join(', ')}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`   Processing Time: ${endTime - startTime}ms`);
      console.log(`   Explanation: ${result.explanation}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error processing query "${query}":`, error);
      console.log('');
    }
  }

  console.log('🎉 AI Integration test completed!');
}

if (require.main === module) {
  testAIIntegration().catch(console.error);
}
