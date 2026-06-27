const fs = require('fs');

try {
  const html = fs.readFileSync('public/index.html', 'utf8');
  
  const hasStyleTag = html.includes('id="theme-override-styles"');
  const hasPrimaryColor = html.includes('--color-primary: #121212 !important;');
  
  console.log('--- Theme Override Verification ---');
  console.log(`Style tag present: ${hasStyleTag ? '✅ YES' : '❌ NO'}`);
  console.log(`Primary color override present: ${hasPrimaryColor ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n--- Section Wrappers Verification ---');
  ['banner', 'features', 'testimonials', 'cta'].forEach(sec => {
    const hasSec = html.includes(`id="section-${sec}"`);
    console.log(`Section ${sec} wrapper present: ${hasSec ? '✅ YES' : '❌ NO'}`);
  });
} catch (err) {
  console.error('Error reading public/index.html. Did you run a build first?', err.message);
}
