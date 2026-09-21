# Steg 3b: Domän, kontrakt och fraktal dokumentation (TCK-LT-015)

## Kontrakt för API-nyckel och Token-dirigering

### Regler för `isEphemeral`
| Nyckelformat | `tokenProvider` angiven? | `isEphemeral` | Mål-URL |
| :--- | :--- | :--- | :--- |
| `AIzaSy...` | Nej | `false` | `v1beta ... BidiGenerateContent?key=AIzaSy...` |
| `AIzaSy...` | Ja | `false` | `v1beta ... BidiGenerateContent?key=AIzaSy...` |
| `authTokens/...` | Nej / Ja | `true` | `v1alpha ... BidiGenerateContentConstrained?access_token=...` |
| `auth_tokens/...` | Nej / Ja | `true` | `v1alpha ... BidiGenerateContentConstrained?access_token=...` |
| `test-key` | Nej / Ja | `false` | `v1beta ... BidiGenerateContent?key=test-key` |
