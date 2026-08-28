const fs = require('fs');
let code = fs.readFileSync('src/features/sms_assistant/components/AdminConsole.tsx', 'utf8');

code = code.replace(
    'placeholder="Svara med t.ex. #GODKÄNN ID eller skriv en ny inbjudan..."',
    'placeholder="Svara med t.ex. .ja ID eller skriv en ny inbjudan..."'
);

fs.writeFileSync('src/features/sms_assistant/components/AdminConsole.tsx', code);
console.log("AdminConsole.tsx updated");
