# Συμβόλαιο API frontend–backend

Η μόνη πηγή αλήθειας για το τι χρειάζεται το frontend από τον backend και σε ποιο σημείο. Κάθε σημάδι `BACKEND-NEEDED[id]` στον κώδικα του frontend δείχνει σε μία ενότητα εδώ, και τα types του frontend (`app/panhellenicexams/_lib/api/types.ts`) ακολουθούν αυτό το έγγραφο.

## Στάδια

| Στάδιο | Τι ισχύει |
|---|---|
| **Τώρα** | Πλαίσιο του frontend για την παρουσίαση, με mock απαντήσεις. Δεν ελέγχεται τίποτα: κάθε αριθμός μητρώου, κωδικός και email περνά |
| **Πριν το MVP** | Απλοί έλεγχοι και πραγματικό email: το pool, ο κωδικός επιβεβαίωσης και τα σφάλματα των ενοτήτων παρακάτω |
| **Φάση 2** | Τα υπόλοιπα της ασφάλειας: HTTPS, όρια προσπαθειών, επαναφορά κωδικού, αλλαγή email και κωδικού |

## Γενικά

- **Διεύθυνση:** το frontend καλεί `/panhellenicexams/api/...`. Το site το προωθεί (rewrite στο `next.config.ts`) στο `/api/...` του backend. Ο browser βλέπει ένα μόνο origin, οπότε δεν χρειάζεται CORS.
- **Μορφή:** JSON με `Content-Type: application/json`, εκτός από τις απαντήσεις 204.
- **Session:** cookie που βάζει ο backend, `HttpOnly`, `SameSite=Lax`, `Path=/panhellenicexams`, και `Secure` από τη Φάση 2 με HTTPS. Το frontend δεν το βλέπει ποτέ· στέλνει μόνο `credentials: "include"`.
- **Μηνύματα:** το frontend δεν δείχνει ποτέ το `message` του backend. Δείχνει δικό του ελληνικό κείμενο ανάλογα με το `code` (`app/panhellenicexams/_lib/i18n/el.ts`).

### Το pool αριθμών μητρώου

Το σχολείο φορτώνει από πριν στη βάση έναν πίνακα με όσους δικαιούνται λογαριασμό. Από εκεί βγαίνουν η ταυτότητα και ο ρόλος του χρήστη, οπότε ο χρήστης δεν τα δηλώνει ποτέ ο ίδιος.

| Στήλη | Τι είναι |
|---|---|
| `registry_number` | Ο αριθμός μητρώου, μοναδικός. Κάθε πρόσωπο έχει δικό του |
| `role` | `STUDENT`, `PARENT`, `TEACHER` ή `ADMIN` |
| `first_name`, `last_name` | Τα στοιχεία του προσώπου |
| `school_email` | Το email που έχει το σχολείο. Εδώ πηγαίνει ο κωδικός επιβεβαίωσης |
| `child_registry_number` | Μόνο για γονείς: ο αριθμός μητρώου του παιδιού |
| `claimed_at` | Πότε έγινε λογαριασμός. Κενό όσο ο αριθμός είναι ελεύθερος |

### Κοινή μορφή σφάλματος

Κάθε σφάλμα του backend έχει αυτό το body:

```json
{ "code": "INVALID_CREDENTIALS", "message": "για τα logs μόνο", "fieldErrors": { "email": "INVALID_EMAIL" } }
```

| Πεδίο | Υποχρεωτικό | Τι είναι |
|---|---|---|
| `code` | ναι | Ένας από τους κωδικούς των ενοτήτων παρακάτω |
| `message` | όχι | Κείμενο για logs. Το frontend το αγνοεί |
| `fieldErrors` | όχι | Ανά πεδίο φόρμας, ένας από: `REQUIRED`, `INVALID_EMAIL`, `TOO_SHORT`, `TOO_LONG`, `MISMATCH`, `NOT_ACCEPTED` |

Ένα 5xx **χωρίς** JSON body το frontend το διαβάζει ως «δεν υπάρχει σύνδεση με τον server», γιατί έτσι απαντά ο proxy όταν ο backend δεν τρέχει.

### Πού είναι στον κώδικα (κάτω από `app/panhellenicexams/`)

| id | Η κλήση | Το σημείο στο UI |
|---|---|---|
| [session](#session) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, όταν ανοίγει |
| [continue](#continue) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, αν υπάρχει session |
| [login](#login) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, κουμπί «Σύνδεση» |
| [signup-registry](#signup-registry) | `_lib/api/auth.real.ts` | `_views/SignupView.tsx`, βήμα 1 |
| [signup-verify](#signup-verify) | `_lib/api/auth.real.ts` | `_views/SignupView.tsx`, βήμα 2 |
| [signup-resend](#signup-resend) | `_lib/api/auth.real.ts` | `_views/SignupView.tsx`, «Αποστολή ξανά» |
| [signup-complete](#signup-complete) | `_lib/api/auth.real.ts` | `_views/SignupView.tsx`, βήμα 3 |
| [logout](#logout) | `_lib/api/auth.real.ts` | `_views/DevRedirectView.tsx`, κουμπί «Αποσύνδεση» |
| [csrf](#csrf) | `_lib/api/client.ts` | Κάθε POST |
| [redirect](#redirect) | `_lib/redirect.ts` | Μετά από login ή continue |
| [password-policy](#password-policy) | `_lib/config/passwordPolicy.ts` | Βήμα 3 της εγγραφής |
| [forgot-password](#forgot-password) | — | `forgot-password/page.tsx` |

---

## session

`GET /api/auth/session`

**Πότε:** μόλις ανοίγει η σελίδα σύνδεσης. Αν ο χρήστης είναι ήδη συνδεδεμένος, δεν του ζητάμε ξανά login.

**Request:** τίποτα, μόνο το cookie.

**Επιτυχία:** `200`

```json
{ "user": { "id": "u-123", "registryNumber": "1001", "firstName": "Μαρία", "lastName": "Δημητρίου", "email": "maria@example.com", "role": "STUDENT" } }
```

`role` είναι ένα από `STUDENT`, `PARENT`, `TEACHER`, `ADMIN`.

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 401 | `UNAUTHENTICATED` (ή χωρίς body) | Δείχνει τη φόρμα, χωρίς μήνυμα |

**Ασφάλεια:** ποτέ κωδικός, hash ή token στην απάντηση. `Cache-Control: no-store`.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## continue

`POST /api/auth/continue`

**Πότε:** αμέσως μετά το [session](#session), όταν υπάρχει ήδη session. Ο χρήστης πάει στο eClass χωρίς να ξαναγράψει κωδικό.

**Request:**

```json
{ "app": "eclass" }
```

**Επιτυχία:** `200`, ίδια μορφή με το [login](#login):

```json
{ "redirectUrl": "http://ims-eclass.local/?ims_code=..." }
```

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 401 | `UNAUTHENTICATED` | Δείχνει τη φόρμα |
| 400 | `VALIDATION_ERROR` | Άγνωστο `app`. Δείχνει τη φόρμα |

**Ασφάλεια:** νέος κωδικός μίας χρήσης σε κάθε κλήση (δες [redirect](#redirect)). Θέλει [CSRF](#csrf).

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## login

`POST /api/auth/login`

**Πότε:** ο χρήστης γράφει αριθμό μητρώου και κωδικό και πατά «Σύνδεση».

**Request:**

```json
{ "registryNumber": "1001", "password": "...", "rememberMe": false, "app": "eclass" }
```

**Επιτυχία:** `200` με `Set-Cookie` για το session και:

```json
{ "redirectUrl": "http://ims-eclass.local/?ims_code=..." }
```

Με `rememberMe: true` το session κρατά περισσότερο (π.χ. 30 μέρες). Χωρίς αυτό, λήγει όταν κλείσει ο browser.

**Σφάλματα:**

| HTTP | code | Τι δείχνει το frontend |
|---|---|---|
| 400 | `VALIDATION_ERROR` | «Ελέγξτε τα στοιχεία της φόρμας.» |
| 401 | `INVALID_CREDENTIALS` | «Λάθος αριθμός μητρώου ή κωδικός.» |
| 423 | `ACCOUNT_LOCKED` | «Ο λογαριασμός σας είναι κλειδωμένος. Επικοινωνήστε με τη γραμματεία.» |
| 429 | `TOO_MANY_ATTEMPTS` | «…Δοκιμάστε ξανά σε N λεπτά.» από το header `Retry-After` (δευτερόλεπτα) |
| 403 | `CSRF_INVALID` | «Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.» |

**Ασφάλεια:**
- Ίδια απάντηση για άγνωστο αριθμό μητρώου και λάθος κωδικό.
- Ο κωδικός ελέγχεται **πριν** από την κατάσταση του λογαριασμού, ώστε το `ACCOUNT_LOCKED` να το βλέπει μόνο όποιος ξέρει τον κωδικό.
- Όριο προσπαθειών ανά αριθμό μητρώου και ανά IP.
- Νέο session id μετά από κάθε επιτυχημένο login.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## signup-registry

`POST /api/auth/signup/registry`

**Πότε:** βήμα 1 της εγγραφής. Ο χρήστης γράφει τον αριθμό μητρώου που του έδωσε το σχολείο.

**Request:**

```json
{ "registryNumber": "1001" }
```

**Τι κάνει ο backend:** βρίσκει τον αριθμό στο [pool](#το-pool-αριθμών-μητρώου), φτιάχνει μια εγγραφή σε εξέλιξη και στέλνει κωδικό επιβεβαίωσης στο `school_email`.

**Επιτυχία:** `200`

```json
{ "signupId": "...", "maskedEmail": "m•••@gmail.com" }
```

**Σφάλματα:**

| HTTP | code | Τι δείχνει το frontend |
|---|---|---|
| 404 | `REGISTRY_NOT_FOUND` | «Δεν βρέθηκε αυτός ο αριθμός μητρώου. Επικοινωνήστε με τη γραμματεία.» |
| 409 | `REGISTRY_ALREADY_USED` | «Υπάρχει ήδη λογαριασμός με αυτόν τον αριθμό μητρώου.» |
| 429 | `TOO_MANY_ATTEMPTS` | «…Δοκιμάστε ξανά σε N λεπτά.» |

**Ασφάλεια:**
- Ο κωδικός πηγαίνει **μόνο** στο email που έχει το σχολείο, ποτέ σε email που γράφει ο χρήστης. Αλλιώς όποιος ξέρει έναν αριθμό μητρώου θα έπαιρνε τον λογαριασμό.
- Κωδικός 6 ψηφίων, λήγει σε 10 λεπτά.
- Οι αριθμοί μητρώου μαντεύονται εύκολα και οι απαντήσεις δείχνουν ποιοι υπάρχουν, οπότε χρειάζεται όριο ανά IP.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## signup-verify

`POST /api/auth/signup/verify`

**Πότε:** βήμα 2 της εγγραφής. Ο χρήστης γράφει τον κωδικό που πήρε στο email.

**Request:**

```json
{ "signupId": "...", "code": "123456" }
```

**Επιτυχία:** `204`

**Σφάλματα:**

| HTTP | code | Τι δείχνει το frontend |
|---|---|---|
| 400 | `CODE_INVALID` | «Ο κωδικός επιβεβαίωσης δεν είναι σωστός.» |
| 410 | `CODE_EXPIRED` | «Ο κωδικός επιβεβαίωσης έληξε. Ζητήστε νέο.» |
| 429 | `TOO_MANY_ATTEMPTS` | «…Δοκιμάστε ξανά σε N λεπτά.» |

**Ασφάλεια:** το πολύ 5 προσπάθειες ανά κωδικό. Μετά ακυρώνεται και χρειάζεται νέος.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## signup-resend

`POST /api/auth/signup/resend`

**Πότε:** βήμα 2 της εγγραφής. Ο χρήστης πατά «Αποστολή ξανά».

**Request:**

```json
{ "signupId": "..." }
```

**Επιτυχία:** `204`. Ο προηγούμενος κωδικός ακυρώνεται.

**Σφάλματα:** `429 TOO_MANY_ATTEMPTS`, π.χ. πάνω από μία αποστολή το λεπτό.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## signup-complete

`POST /api/auth/signup/complete`

**Πότε:** βήμα 3 της εγγραφής. Ο χρήστης δηλώνει email και διαλέγει κωδικό.

**Request:**

```json
{ "signupId": "...", "email": "maria@example.com", "password": "...", "acceptTerms": true }
```

**Επιτυχία:** `201`, χωρίς session. Ο χρήστης συνδέεται μετά από τη σελίδα σύνδεσης. Το `claimed_at` του pool συμπληρώνεται.

```json
{ "status": "ACTIVE" }
```

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 400 | `VALIDATION_ERROR` με `fieldErrors` | «Ελέγξτε τα στοιχεία της φόρμας.» Στο στάδιο των ελέγχων, μήνυμα κάτω από κάθε πεδίο |
| 400 | `CODE_INVALID` | Το βήμα 2 δεν έχει ολοκληρωθεί για αυτό το `signupId` |

**Ασφάλεια:**
- Κωδικοί μόνο με BCrypt ή Argon2.
- Ο ίδιος [κανόνας κωδικού](#password-policy) με το frontend.
- Το `acceptTerms` πρέπει να είναι `true`.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## logout

`POST /api/auth/logout`

**Πότε:** ο χρήστης πατά «Αποσύνδεση». Τώρα στη σελίδα προσομοίωσης, αργότερα και από το eClass.

**Request:** τίποτα, μόνο το cookie.

**Επιτυχία:** `204`. Ο backend ακυρώνει το session στη βάση και σβήνει το cookie (`Max-Age=0`).

**Ασφάλεια:** Θέλει [CSRF](#csrf), ώστε άλλη σελίδα να μη μπορεί να αποσυνδέσει τον χρήστη.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## csrf

**Πότε:** σε κάθε POST.

**Πρόταση:** double-submit cookie.
1. Ο backend βάζει cookie `XSRF-TOKEN` (όχι HttpOnly, `SameSite=Lax`, `Path=/panhellenicexams`).
2. Το frontend το διαβάζει και το στέλνει πίσω στο header `X-CSRF-Token`.
3. Ο backend συγκρίνει τα δύο.

Το frontend κάνει ήδη το βήμα 2 όταν βρει το cookie. Αν ο backend διαλέξει άλλα ονόματα (π.χ. με το CSRF extension του Quarkus), αλλάζουν στο `_lib/api/client.ts`.

**Σφάλμα:** `403 CSRF_INVALID` → «Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.»

Κατάσταση: [x] θέση στο frontend · [ ] υλοποιήθηκε στο backend

## redirect

**Πότε:** μετά από επιτυχημένο [login](#login) ή [continue](#continue).

**Πώς το φτιάχνει ο backend:**
1. Βρίσκει τη διεύθυνση του `app` σε δική του λίστα (`eclass` → `http://ims-eclass.local/`). Δεν δέχεται ποτέ URL από τον browser.
2. Φτιάχνει τυχαίο κωδικό μίας χρήσης (τουλάχιστον 128 bits), που λήγει σε 60 δευτερόλεπτα, και τον αποθηκεύει μαζί με τον χρήστη και το `app`.
3. Επιστρέφει `<διεύθυνση>?ims_code=<κωδικός>`.

**Τι κάνει το frontend:** ακολουθεί το `redirectUrl` μόνο αν το origin του είναι στο `NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS`. Αλλιώς δείχνει «Η μεταφορά στο eClass σταμάτησε για λόγους ασφαλείας.» Στο mock mode πηγαίνει στη σελίδα προσομοίωσης `/panhellenicexams/dev/redirect`.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## password-policy

**Πότε:** στο βήμα 3 της εγγραφής, και αργότερα στην αλλαγή κωδικού.

**Κανόνας:** 10 έως 128 χαρακτήρες, χωρίς υποχρεωτικά σύμβολα ή κεφαλαία. Τα μεγάλα συνθηματικά προστατεύουν περισσότερο από τους κανόνες σύνθεσης.

Ο backend τον ελέγχει και έχει τον τελικό λόγο. Το frontend τον έχει στο `_lib/config/passwordPolicy.ts`. Τώρα τον δείχνει μόνο ως οδηγία και δεν τον επιβάλλει. Αν αλλάξει, αλλάζει και στα δύο.

**Φάση 2:** έλεγχος σε λίστα κωδικών που έχουν διαρρεύσει.

Κατάσταση: [x] οδηγία στο frontend · [ ] υλοποιήθηκε στο backend

## forgot-password

**Φάση 2.** Η σελίδα υπάρχει ως ορατό placeholder, με απενεργοποιημένη φόρμα.

**Πρόταση:**
- `POST /api/auth/password-reset` `{ "registryNumber": "..." }` → πάντα `202`, ώστε να μη φαίνεται αν ο αριθμός υπάρχει. Αν υπάρχει, στέλνεται email με σύνδεσμο που λήγει σε 30 λεπτά.
- `POST /api/auth/password-reset/confirm` `{ "token": "...", "password": "..." }` → `204`.

Κατάσταση: [ ] στο frontend · [ ] υλοποιήθηκε στο backend

---

## Αργότερα: αλλαγή email και κωδικού

Ο χρήστης θα αλλάζει το email και τον κωδικό του μέσα από το eClass, και οι αλλαγές θα αποθηκεύονται στη βάση. Δεν υπάρχουν ακόμα οθόνες.

**Πρόταση:**
- `POST /api/account/password` `{ "currentPassword": "...", "newPassword": "..." }` → `204`, και ακύρωση των άλλων sessions.
- `POST /api/account/email` `{ "password": "...", "email": "..." }` → `202`, με κωδικό επιβεβαίωσης στο νέο email πριν ισχύσει.

## Αργότερα: 2FA πριν από το redirect

Το eClass είναι ξεχωριστός server (WordPress) και ο χρήστης φτάνει εκεί μόνο μέσα από το redirect. Γι' αυτό το redirect περνά από δεύτερο παράγοντα: μετά τον σωστό κωδικό, το [login](#login) δεν δίνει ακόμα `redirectUrl`. Δεν υπάρχει ακόμα οθόνη.

**Πρόταση:**
- `POST /api/auth/login` → `200 { "twoFactorRequired": true, "challengeId": "..." }`.
- `POST /api/auth/2fa/verify` `{ "challengeId": "...", "code": "123456" }` → `200 { "redirectUrl": "..." }`, με τον κωδικό μίας χρήσης του [redirect](#redirect).

Μένει να αποφασιστεί ο δεύτερος παράγοντας: κωδικός στο email ή εφαρμογή TOTP.

## Όχι για το frontend

`POST /api/sso/exchange`

Το eClass ανταλλάσσει, **από server σε server**, τον κωδικό μίας χρήσης με τα στοιχεία του χρήστη. Ο browser δεν καλεί ποτέ αυτό το endpoint.

**Request:** με header `Authorization: Bearer <μυστικό του eClass>`, που το ξέρουν μόνο ο backend και το eClass.

```json
{ "code": "...", "app": "eclass" }
```

**Επιτυχία:** `200`, και ο κωδικός δεν ξαναδουλεύει.

```json
{ "user": { "id": "u-123", "registryNumber": "1001", "firstName": "Μαρία", "lastName": "Δημητρίου", "email": "maria@example.com", "role": "STUDENT" } }
```

**Σφάλματα:** `400` για κωδικό άγνωστο, ληγμένο ή ήδη χρησιμοποιημένο. `401` για λάθος μυστικό.

Κατάσταση: [ ] υλοποιήθηκε στο backend · [ ] υλοποιήθηκε στο eClass
