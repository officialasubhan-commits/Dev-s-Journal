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
  let changed = false;

  if (content.includes('SiteSettings') && content.includes('@prisma/client')) {
    content = content.replace(/import\s+\{([^}]*)\s*SiteSettings\s*([^}]*)\}\s+from\s+['"]@prisma\/client['"];?/g, (match, p1, p2) => {
      let rest = (p1 + p2).replace(/,\s*,/g, ',').trim();
      if (rest.startsWith(',')) rest = rest.substring(1).trim();
      if (rest.endsWith(',')) rest = rest.substring(0, rest.length - 1).trim();
      
      if (rest === '') return '';
      return 'import { ' + rest + ' } from "@prisma/client";';
    });
    
    // Add import for getSiteSettings and define type
    content = 'import { getSiteSettings } from "@/app/admin/settings/actions";\n' + 
              'type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;\n' + content;
    changed = true;
  } else if (content.includes('SiteSettings') && !content.includes('getSiteSettings')) {
     if (content.includes('settings: SiteSettings')) {
       content = 'import { getSiteSettings } from "@/app/admin/settings/actions";\n' + 
                 'type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;\n' + content;
       changed = true;
     }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed ' + f);
  }
});
