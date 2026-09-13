# Steg 2a: Förändra utåt - Vision (TCK-SMS-004)

## Vision och Arkitekturell Intention
Administrationsgränssnittet och serverns backend-lager ska kommunicera via ett sammanhängande, enhetligt REST-kontrakt. Genom att eliminera inaktuella interna adresser (`/api/admin/alerts`, `/api/admin/approve-alert`, `/api/admin/pairing-status`) och ersätta dem med serverns faktiska rutter (`/api/alerts`, `/api/alerts/:id/status`, `/api/admin/check-pairing`), blir integrationen mellan webbklienten och servern deterministisk och fri från 404-fel.
