interface TypingUser {
  id: string;
  name: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} está a escrever`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].name} e ${typingUsers[1].name} estão a escrever`;
    }
    return `${typingUsers[0].name} e outros estão a escrever`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span>{getTypingText()}...</span>
    </div>
  );
}
