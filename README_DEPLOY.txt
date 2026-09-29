DOMINO RANKING CLOUD v0.3.3

هذا الإصدار يستخدم Netlify Function بدل external proxy.

مهم:
لا ترفعه كـ "مجلد static جاهز" فقط، لأن Netlify لازم يبني الـFunction.

الطريقة الأسهل:
1) ارفع هذا المشروع إلى GitHub repository.
2) في Netlify افتح مشروعك الحالي.
3) Project configuration > Build & deploy > Continuous deployment.
4) اربط GitHub repository.
5) Netlify يقرأ netlify.toml تلقائياً:
   Publish directory: public
   Functions directory: netlify/functions
6) Deploy.

بعد نجاح النشر افتح:
https://YOUR-SITE.netlify.app/.netlify/functions/supabase-proxy?path=/groups&select=id,name,code&code=eq.DOMINO2026

المفروض يرجع JSON يحتوي Domino Group.
