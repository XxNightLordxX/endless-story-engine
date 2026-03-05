/**
 * Test script to verify web search integration and content quality
 * This will test the web search functionality and verify it works with Copilot/Bing AI
 */

import { webSearch } from './endless-story-engine/src/api';

async function testWebSearchIntegration() {
  console.log('=== Testing Web Search Integration ===\n');

  // Test 1: Basic web search
  console.log('Test 1: Basic web search for fantasy vocabulary');
  const result1 = await webSearch('fantasy vampire supernatural dark character writing', 5);
  console.log(`Results: ${result1.results.length} items found`);
  if (result1.results.length > 0) {
    console.log(`First result: ${result1.results[0].title}`);
  }
  console.log('');

  // Test 2: Search for action verbs
  console.log('Test 2: Search for action verbs');
  const result2 = await webSearch('fantasy action adventure dark power verbs writing', 5);
  console.log(`Results: ${result2.results.length} items found`);
  if (result2.results.length > 0) {
    console.log(`First result: ${result2.results[0].title}`);
  }
  console.log('');

  // Test 3: Search for locations
  console.log('Test 3: Search for fantasy locations');
  const result3 = await webSearch('fantasy dark realm location names places', 5);
  console.log(`Results: ${result3.results.length} items found`);
  if (result3.results.length > 0) {
    console.log(`First result: ${result3.results[0].title}`);
  }
  console.log('');

  // Test 4: Search for emotional words
  console.log('Test 4: Search for emotional vocabulary');
  const result4 = await webSearch('dark fantasy emotions hunger power desire feelings', 5);
  console.log(`Results: ${result4.results.length} items found`);
  if (result4.results.length > 0) {
    console.log(`First result: ${result4.results[0].title}`);
  }
  console.log('');

  // Test 5: Search for narrative elements
  console.log('Test 5: Search for narrative transitions');
  const result5 = await webSearch('story transitions connectors narrative writing', 5);
  console.log(`Results: ${result5.results.length} items found`);
  if (result5.results.length > 0) {
    console.log(`First result: ${result5.results[0].title}`);
  }
  console.log('');

  console.log('=== All web search tests completed ===');
}

// Run the tests
testWebSearchIntegration().catch(console.error);