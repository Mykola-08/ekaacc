const fs = require('fs');
let content = fs.readFileSync('src/marketing/contexts/TranslationExtensions.tsx', 'utf-8');

const additions = {
  ca: {
    'contact.form.error.nameMin': 'El nom és massa curt',
    'contact.form.error.emailInvalid': 'El correu electrònic no és vàlid',
    'contact.form.error.phoneMin': 'El telèfon és massa curt',
    'contact.form.error.messageMin': 'El missatge és massa curt'
  },
  en: {
    'contact.form.error.nameMin': 'Name is too short',
    'contact.form.error.emailInvalid': 'Email is invalid',
    'contact.form.error.phoneMin': 'Phone is too short',
    'contact.form.error.messageMin': 'Message is too short'
  },
  es: {
    'contact.form.error.nameMin': 'El nombre es demasiado corto',
    'contact.form.error.emailInvalid': 'El correo electrónico no es válido',
    'contact.form.error.phoneMin': 'El teléfono es demasiado corto',
    'contact.form.error.messageMin': 'El mensaje es demasiado corto'
  },
  ru: {
    'contact.form.error.nameMin': 'Имя слишком короткое',
    'contact.form.error.emailInvalid': 'Неверный адрес электронной почты',
    'contact.form.error.phoneMin': 'Телефон слишком короткий',
    'contact.form.error.messageMin': 'Сообщение слишком короткое'
  }
};

for (const lang of Object.keys(additions)) {
  const marker = '  ' + lang + ': {';
  const index = content.indexOf(marker);
  if (index > -1) {
    const insertString = marker + '\n' + Object.keys(additions[lang]).map(k => "    '" + k + "': '" + additions[lang][k] + "',").join('\n') + '\n';
    content = content.replace(marker, insertString);
  }
}

fs.writeFileSync('src/marketing/contexts/TranslationExtensions.tsx', content);
console.log('Translations updated');
