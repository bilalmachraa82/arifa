import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, RefreshCw, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";

interface AIWeeklyUpdateProps {
  projectId: string;
  projectTitle: string;
}

export function AIWeeklyUpdate({ projectId, projectTitle }: AIWeeklyUpdateProps) {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const generateUpdate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-update', {
        body: { projectId, language: 'pt' }
      });

      if (error) {
        console.error('Error generating update:', error);
        if (error.message?.includes('429')) {
          toast.error(t('ai.weeklyUpdate.rateLimited'));
        } else if (error.message?.includes('402')) {
          toast.error(t('ai.weeklyUpdate.creditsExhausted'));
        } else {
          toast.error(t('ai.weeklyUpdate.error'));
        }
        return;
      }

      setSummary(data.summary);
      setGeneratedAt(data.generatedAt);
      setIsOpen(true);
      toast.success(t('ai.weeklyUpdate.success'));
    } catch (err) {
      console.error('Error:', err);
      toast.error(t('ai.weeklyUpdate.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{t('ai.weeklyUpdate.title')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('ai.weeklyUpdate.description')}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateUpdate}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {summary ? t('ai.weeklyUpdate.update') : t('ai.weeklyUpdate.generate')}
              </Button>
              {summary && (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {loading && !summary && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            )}

            {summary && (
              <div className="space-y-3">
                {generatedAt && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{t('ai.weeklyUpdate.generatedAt')} {formatDate(generatedAt)}</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      AI
                    </Badge>
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
                </div>
              </div>
            )}

            {!loading && !summary && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('ai.weeklyUpdate.noSummary')}
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default AIWeeklyUpdate;
