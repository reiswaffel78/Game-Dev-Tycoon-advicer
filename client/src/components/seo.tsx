import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | Game Dev Tycoon Advisor`;
    document.title = fullTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute("content", description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", fullTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute("content", description);
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", fullTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
