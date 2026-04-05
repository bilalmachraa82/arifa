import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageAttachmentUpload, Attachment } from "@/components/chat/MessageAttachments";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

interface Project {
  id: string;
  title: string;
}

interface Message {
  id: string;
  subject: string;
}

interface ClientMessageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  projects: Project[];
  replyTo?: Message | null;
}

const ClientMessageForm = ({
  open,
  onOpenChange,
  onSuccess,
  projects,
  replyTo,
}: ClientMessageFormProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const { typingUsers, handleInputChange, stopTyping } = useTypingIndicator(
    user?.id || "default"
  );

  useEffect(() => {
    if (open) {
      setSubject(replyTo ? `Re: ${replyTo.subject}` : "");
      setContent("");
      setProjectId("");
      setAttachments([]);
    }
  }, [open, replyTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);
    stopTyping();

    try {
      const { error } = await supabase.from("client_messages").insert({
        client_id: user.id,
        sender_id: user.id,
        subject: subject.trim(),
        content: content.trim(),
        project_id: projectId || null,
        attachments: JSON.parse(JSON.stringify(attachments)),
      });

      if (error) throw error;

      setSubject("");
      setContent("");
      setProjectId("");
      setAttachments([]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("messageForm.error"),
        description: t("messageForm.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    handleInputChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {replyTo ? t("messageForm.replyTitle") : t("messageForm.newTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("messageForm.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {projects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="project">{t("messageForm.project")}</Label>
              <Select value={projectId || "__none__"} onValueChange={(v) => setProjectId(v === "__none__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("messageForm.selectProject")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("messageForm.noProject")}</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject">{t("messageForm.subject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("messageForm.subjectPlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("messageForm.message")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder={t("messageForm.messagePlaceholder")}
              rows={6}
              required
            />
            <TypingIndicator typingUsers={typingUsers} />
          </div>

          <MessageAttachmentUpload
            attachments={attachments}
            onAttachmentsChange={setAttachments}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("messageForm.sending")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t("messageForm.send")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientMessageForm;
