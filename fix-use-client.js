const fs = require('fs');
const files = [
  'src/app/admin/settings/MaintenanceSettingsForm.tsx',
  'src/app/admin/settings/GeneralSettingsForm.tsx',
  'src/app/admin/settings/SeoSettingsForm.tsx',
  'src/app/admin/settings/FeatureFlagsForm.tsx',
  'src/app/admin/settings/BrandingSettingsForm.tsx',
  'src/app/admin/settings/AppearanceSettingsForm.tsx',
  'src/app/admin/settings/AnalyticsUploadSettingsForm.tsx',
  'src/app/admin/contact/ContactSettingsForm.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"use client"') || content.includes("'use client'")) {
    content = content.replace(/["']use client["'];?\s*/g, '');
    content = '"use client";\n\n' + content;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed use client in ' + f);
  }
});
