import { render } from '@react-email/render';
import * as fs from 'fs';
import * as path from 'path';
import { ConfirmEmail, ResetPasswordEmail, MagicLinkEmail, ChangeEmailAddressEmail } from '../src/emails/SupabaseTemplates';
import { WelcomeEmail } from '../src/emails/WelcomeEmail';

async function main() {
  const outDir = path.join(process.cwd(), 'supabase', 'templates');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const templates = [
    { name: 'confirm_email.html', component: ConfirmEmail },
    { name: 'reset_password.html', component: ResetPasswordEmail },
    { name: 'magic_link.html', component: MagicLinkEmail },
    { name: 'change_email.html', component: ChangeEmailAddressEmail },
    { name: 'welcome.html', component: () => WelcomeEmail({ name: 'User', actionUrl: 'https://ekaacc.com/dashboard' }) },
  ];

  for (const { name, component } of templates) {
    const html = await render(component());
    fs.writeFileSync(path.join(outDir, name), html);
    console.log(`Generated ${name}`);
  }
}

main().catch(console.error);
