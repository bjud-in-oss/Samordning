const fs = require('fs');
let code = fs.readFileSync('src/features/sms_assistant/domain/supportAgent.ts', 'utf8');

code = code.replace(
    '- PUBLICERA: Godkänn och publicera ditt utkast genom att skriva kommandot #PUBLICERA.',
    '- PUBLICERA: Godkänn och publicera ditt utkast genom att skriva kommandot .ja'
);

fs.writeFileSync('src/features/sms_assistant/domain/supportAgent.ts', code);
console.log("supportAgent.ts updated");
