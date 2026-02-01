import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Heart, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiPaypal } from "react-icons/si";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
              data-testid="button-donate"
            >
              <a
                href="https://paypal.me/pokercoachai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiPaypal className="h-4 w-4 text-blue-600" />
                <Heart className="h-3 w-3 text-red-500" />
                {t("footer.donate")}
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2"
              data-testid="button-contact"
            >
              <a href="mailto:gamedevtycoonadvisor@proton.me">
                <Mail className="h-4 w-4" />
                {t("footer.contact")}
              </a>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2"
              data-testid="link-privacy-footer"
            >
              <Link href="/privacy">
                <Shield className="h-4 w-4" />
                {t("footer.privacy")}
              </Link>
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>&copy; {currentYear} GDT Advisor. {t("footer.rights")}</p>
            <p className="text-xs mt-1">{t("footer.disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
