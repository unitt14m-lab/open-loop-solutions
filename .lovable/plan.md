# Refine Open Loop and فُرص Open Loop

## Outcome
- Rebrand the portfolio as **أعمالنا** and replace the media gallery with a clean ordered list of externally opened Google Drive links.
- Give admins full control over work items and their order.
- Align the marketplace wording and light visual system, while closing verification, privacy, bidding, commission, and private-file gaps.

## 1. أعمالنا
- Replace every visible and SEO reference to «سابقة الأعمال» with «أعمالنا» in navigation, footer, page headings, and metadata.
- Add a backend `portfolio_items` collection with title, validated Google Drive URL, display order, timestamps, and publish state.
- Allow public read access only to published items; restrict create, update, delete, and reorder operations to admins.
- Replace the current categorized media grid and preview dialog with a minimal responsive list. Each row shows the title and a subtle view/external-link icon, then opens the Drive URL in a new tab.
- Add an «أعمالنا» section in the Admin Dashboard with add, edit, delete, move up, and move down controls using only Title and Google Drive URL fields.
- Keep a clear empty state until the admin adds real Drive links; no invented links will be published.

## 2. Marketplace wording and visual refinement
- Standardize buyer terminology as «صاحب المشروع» / «طالب الخدمة» and bidding-side terminology as «مقدم الخدمة / المورد» across public forms, filters, cards, account views, admin rows, and messages.
- Keep the approved light direction: off-white page background, white cards, soft borders, dark-navy line icons, and no stock imagery.
- Refine the two entry cards to:
  - «مشتريين» — non-profits and subsidiaries — «طرح فرصة / طلب توريد».
  - «موردين» — verified companies — «تصفح الفرص / تقديم عرض».
- Use existing semantic brand tokens instead of adding page-specific raw color values.

## 3. RFQ review flag and privacy
- Keep the RFQ checkbox but update its exact label to «أرغب بطلب خدمة فُرص Open Loop لدراسة العروض وترشيح الأفضل».
- Persist `requires_openloop_review` and retain the highlighted admin status for requests needing Open Loop evaluation.
- Remove project-owner identity from the general RFQ list. Only authorized parties and admins can access identity or contact details.
- Remove direct contact collection from bid submission so questions and proposal handling stay inside the platform.
- Tighten database access so only approved providers can submit bids and questions on published, open opportunities.

## 4. Manual verification and protected documents
- Change entity onboarding from automatic approval to manual review.
- Require a license/registration document upload and explicit legal acceptance before submission.
- Store the document in the existing private storage area and record only its protected path in the backend.
- Let only the owner and admins view organization documents through short-lived protected access.
- Show a verified badge in «دليل فُرص Open Loop» only after admin approval; remove representative identity from directory cards.
- Add admin controls to review the uploaded verification document before approving or rejecting the account.

## 5. Workflow, commission, and file security
- Preserve platform-only questions, proposals, awarding, and contract registration.
- Keep the server-side contract trigger that closes the opportunity, awards the quote, logs the action, and calculates the configured 1% commission.
- Tighten contract and proposal document storage policies so only the uploader, relevant buyer/provider, and admins can access files.
- Open protected files only with short-lived signed access; never render or persist public download URLs.
- Correct the private question/answer read rules so non-public threads are visible only to the asker, project owner, and admins.

## 6. Validation
- Verify public «أعمالنا» behavior, admin CRUD/reordering, entity registration and document review, approved/unapproved marketplace states, RFQ review tags, proposal submission, awarding, commission creation, and protected document access.
- Check the relevant pages at mobile and desktop widths and confirm route metadata remains unique and app-specific.

## Technical details
- Apply all schema and policy changes through one additive Lovable Cloud migration with grants before RLS policies.
- Keep roles in `user_roles`; all admin checks remain server/database enforced.
- Use the existing private `community-files` bucket and generated backend types.
- Use existing React Query and design-system components; no new framework or public storage bucket.
