const convertToOpenAPI = require('./utils/convert-openapi');
const vocaGameData = require('./utils/data/vocagame.json');

// Test dengan data sample
const testData = vocaGameData.data.map((item) => ({
   ...item,
   endpoint: `/check/${item.slug}`,
   hasZoneId: item.isZone,
   listZoneId: item.isZone ? `/zone/${item.slug}` : null,
}));

// Ambil beberapa sample data untuk test
const sampleData = testData.slice(0, 3); // Ambil 3 data pertama

console.log('=== Testing convertToOpenAPI function ===');
console.log('Sample data:');
sampleData.forEach((item, index) => {
   console.log(`${index + 1}. ${item.name}`);
   console.log(`   - isZone: ${item.isZone}`);
   console.log(`   - dropdown length: ${item.dropdown ? item.dropdown.length : 0}`);
   if (item.dropdown && item.dropdown.length > 0) {
      console.log(`   - dropdown sample: ${JSON.stringify(item.dropdown[0])}`);
   }
   console.log('');
});

console.log('=== OpenAPI Result ===');
const result = convertToOpenAPI(sampleData);
console.log(JSON.stringify(result, null, 2));
