import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { Shield, BarChart3, Cookie, Mail } from "lucide-react";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <SEO 
        title={t("privacy.title")} 
        description={t("privacy.subtitle")}
        path="/privacy"
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          {t("privacy.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("privacy.subtitle")}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t("privacy.lastUpdated")}: February 2026
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {t("privacy.analytics.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("privacy.analytics.description")}</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t("privacy.analytics.dataCollected")}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t("privacy.analytics.item1")}</li>
                <li>{t("privacy.analytics.item2")}</li>
                <li>{t("privacy.analytics.item3")}</li>
                <li>{t("privacy.analytics.item4")}</li>
                <li>{t("privacy.analytics.item5")}</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("privacy.analytics.moreInfo")}{" "}
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Google Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-amber-500" />
              {t("privacy.cookies.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t("privacy.cookies.description")}</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t("privacy.cookies.types")}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>{t("privacy.cookies.type1")}</li>
                <li>{t("privacy.cookies.type2")}</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("privacy.cookies.optOut")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              {t("privacy.noPersonalData.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("privacy.noPersonalData.description")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-500" />
              {t("privacy.contact.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("privacy.contact.description")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
