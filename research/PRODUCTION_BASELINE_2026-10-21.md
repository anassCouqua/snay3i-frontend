# Snay3i production / AdSense baseline — 21 October 2026

## Deployment baseline
- **Frontend:** latest Vercel production deployment visible to the connected account is READY, aliased to `snay3i.ma`, built from main commit `ba688b88acb93684e84e5dd61954cefc8148aa6e` (“Add private quote request form to artisan profiles”) on 7 October 2026. A READY build does not prove every live form/tool works end-to-end.
- **Backend:** Render service `snay3i-backend` is configured on main. Latest known deploy `dep-db7c0kavcj2c73duc8cg` was live after commit `38ce924f03a5b2ad558808df7539a32b60efc6fa` on 13 October 2026. That commit prefers `SUPABASE_DATABASE_URL` over `DATABASE_URL` and adds `/health/db`. Browser-based requests to `/ping` and `/health/db` were inaccessible in this pass; actual database connectivity, selected engine and persistence were **not independently live-verified**.
- **Fallback frontend:** Render static service `snay3i-frontend-fallback` remains configured from frontend main, updated 7 October 2026. No claim is made that it serves the canonical domain.

## Verified positive evidence
- Latest known Vercel production build logs for 7 Oct show “Compiled successfully” and build completion.
- Internal gates report six curated indexable guides passing content depth, metadata, canonical, accessibility, overlap and ad placement checks. These are internal QA, not Google's rules or guarantee of approval.
- The build config defines 15 core routes plus six curated blog guides (21 total). `INDEXABLE_SERVICE_CITY_ROUTES` is intentionally empty. The build log says 82 service-city pages are kept noindex/ad-free and six public-source demand pages remain noindex/ad-free.
- Live `/contact` provides a correction/reporting route and does not currently make the “all artisans verified” or “21 cities” claims that appeared in an earlier stale search snapshot. Direct page check was correct.
- Live `/editorial-policy` explains methodology/limitations. Live `/outils` lists six tools. Live `/outils/comparateur-devis` explicitly says its completeness score does not verify identity, qualifications, insurance or outcome.

## Open items / known risks
1. **Live XML and API checks:** available browser connector could not retrieve `https://snay3i.ma/sitemap.xml`, `/robots.txt`, or backend `/ping` and `/health/db`. Build logs evidence build-time generation, not the current HTTP response. Check live endpoints in a normal browser/HTTP monitor and compare actual XML to the 21-route allowlist.
2. **Committed sitemap drift:** committed `public/sitemap.xml` contains numerous old service-city/blog URLs; `scripts/generate-sitemap.js` regenerates it during prebuild and the latest build log reports 21 curated URLs. Production may be correct because the build rewrites the file, but the committed file is misleading. Audit the generated output and make the source reproducible/reviewable. Also check root-level `sitemap.xml` is not served accidentally.
3. **Directory provenance:** some profile data has generic labels and sparse descriptions. Local pages are currently noindex/ad-free, which limits index exposure, but does not substitute for identity/contact checks before making a profile live or claiming verification.
4. **Tool UX:** presence of six tools is supported by page/build evidence, but all six have not been manually tested across mobile/desktop, keyboard navigation, validation/error states, output behaviour and privacy.
5. **Consent/CMP:** internal gate says referrer policy and ad placement pass. Google-certified CMP / Privacy & Messaging account setup is account-level and was not inspected.
6. **AdSense:** no resubmission recommendation. A clean build or internal word-count/canonical script does not prove helpfulness, meaningful demand or approval.

## No production change in this pass
No application code changed, no prospect was published, no HeyTony form submitted, no deployment triggered and no AdSense resubmission made. Research is recorded separately for review.

## Source links
- Frontend commit: https://github.com/anassCouqua/snay3i-frontend/commit/ba688b88acb93684e84e5dd61954cefc8148aa6e
- Backend commit: https://github.com/anassCouqua/snay3i-backend/commit/38ce924f03a5b2ad558808df7539a32b60efc6fa
- Gate: https://github.com/anassCouqua/snay3i-frontend/blob/main/ADSENSE_PRE_SUBMISSION_GATE.md
- Curation config: https://github.com/anassCouqua/snay3i-frontend/blob/main/scripts/site-curation-config.js
- Sitemap generator: https://github.com/anassCouqua/snay3i-frontend/blob/main/scripts/generate-sitemap.js
- Homepage: https://snay3i.ma/
- Tools hub: https://snay3i.ma/outils
- Comparator: https://snay3i.ma/outils/comparateur-devis
- Editorial policy: https://snay3i.ma/editorial-policy
- Contact/corrections: https://snay3i.ma/contact
