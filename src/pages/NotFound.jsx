function NotFound() {
  const lang = document.documentElement.getAttribute('lang') || 'ar';
  const translations = {
    en: { notFound: 'Page Not Found', message: 'The page you are looking for does not exist.' },
    ar: { notFound: 'الصفحة غير موجودة', message: 'الصفحة التي تبحث عنها غير موجودة.' },
  };

  return (
    <div className="container mt-4 text-center">
      <h2>{translations[lang].notFound}</h2>
      <p>{translations[lang].message}</p>
    </div>
  );
}

export default NotFound;