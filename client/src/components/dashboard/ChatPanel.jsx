import { useEffect, useMemo, useState } from "react";
import { Search, SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useMessageContacts, useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuthStore } from "@/store/authStore";

const ChatPanel = () => {
  const { user } = useAuthStore();
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const { data: contacts = [], isLoading } = useMessageContacts();
  const { data: messages = [] } = useMessages(selectedContactId);
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (!selectedContactId && contacts.length > 0) setSelectedContactId(contacts[0]._id);
  }, [contacts, selectedContactId]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return contacts.filter((contact) => !query || [contact.name, contact.email, contact.department].some((value) => value?.toLowerCase().includes(query)));
  }, [contacts, search]);

  const selectedContact = contacts.find((contact) => contact._id === selectedContactId);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || !selectedContactId) {
      toast.error("Choose a contact and type a message");
      return;
    }
    await sendMessage.mutateAsync({ receiver: selectedContactId, message: body });
    setDraft("");
  };

  if (isLoading) return <TableSkeleton columns={2} rows={6} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card className="p-5">
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." className="pl-11" />
        </div>
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <button
              key={contact._id}
              type="button"
              onClick={() => setSelectedContactId(contact._id)}
              className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                selectedContactId === contact._id ? "bg-accent dark:bg-slate-900/30" : "hover:bg-accent"
              }`}
            >
              <Avatar>
                <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{contact.name}</p>
                <p className="truncate text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <Card className="flex min-h-[620px] flex-col p-5">
        {selectedContact ? (
          <>
            <div className="border-b border-border pb-4">
              <p className="text-lg font-semibold">{selectedContact.name}</p>
              <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
            </div>
            <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto py-6">
              {messages.length === 0 ? (
                <EmptyState title="No messages yet" description="Start the conversation with a project update or question." />
              ) : (
                messages.map((message) => {
                  const mine = message.sender?._id === user?._id || message.sender === user?._id;
                  return (
                    <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-md rounded-lg px-4 py-3 text-sm ${mine ? "bg-primary text-white" : "bg-accent text-foreground dark:bg-slate-950/40"}`}>
                        {message.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message..." onKeyDown={(event) => event.key === "Enter" && handleSend()} />
              <Button size="icon" type="button" onClick={handleSend} disabled={sendMessage.isPending}>
                <SendHorizonal className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <EmptyState title="No contacts available" description="Contacts appear here after users are created." />
        )}
      </Card>
    </div>
  );
};

export default ChatPanel;
